import { lib, game, ui, get, ai, _status } from '../../../noname.js';
const tebiechuanwu = {

    //光荣舰队SP
    guangrongjianduisp: {
        nobracket: true,
        audio: false,
        trigger: { global: "phaseEnd" },
        forced: false,
        frequent: true,
        filter: function (event, player) {
            if (!player.isTurnedOver()) return false;
            var evt = _status.event.getParent("phase");
            if (!evt || !evt.player) return false;

            // 检查本回合该角色是否造成过伤害
            var phasePlayer = evt.player;
            var dealtDamage = phasePlayer.getHistory('sourceDamage').length > 0;
            if (dealtDamage) return false;

            // 检查弃牌堆中该角色本回合弃置的牌
            var list = [];
            phasePlayer.getHistory("lose", function (loseEvt) {
                if (loseEvt.type == "discard" && loseEvt.cards) {
                    list.addArray(loseEvt.cards.filter(function (card) {
                        return get.position(card) == "d";
                    }));
                }
            });
            return list.length > 0;
        },
        content: function () {
            "step 0"
            var evt = _status.event.getParent("phase");
            if (evt && evt.player) {
                var list = [];
                evt.player.getHistory("lose", function (loseEvt) {
                    if (loseEvt.type == "discard" && loseEvt.cards) {
                        list.addArray(loseEvt.cards.filter(function (card) {
                            return get.position(card) == "d";
                        }));
                    }
                });
                if (list.length > 0) {
                    player.chooseButton(["光荣舰队：是否使用一张牌？", list]).set("ai", function (button) {
                        var player = _status.event.player;
                        var card = button.link;

                        // 评估此牌的使用价值
                        var maxValue = 0;
                        game.countPlayer(function (target) {
                            if (player.canUse(card, target)) {
                                var eff = get.effect(target, card, player, player);
                                if (eff > maxValue) maxValue = eff;
                            }
                        });

                        // 如果有威严_phaseUse标记，额外加成（无视距离+不可被响应）
                        if (player.hasSkill('weiyan_phaseUse') && get.tag(card, 'damage')) {
                            maxValue += 3;
                        }
                        // 如果有威严_phaseDraw标记，评估双倍结算价值
                        if (player.hasSkill('weiyan_phaseDraw')) {
                            var cardType = get.type(card, false);
                            if (cardType == 'basic' || cardType == 'trick') {
                                maxValue *= 1.8;
                            }
                        }

                        return maxValue;
                    });
                } else {
                    event.finish();
                }
            } else {
                event.finish();
            }
            "step 1"
            if (result.bool && result.links && result.links[0]) {
                player.chooseUseTarget(result.links[0], true);
            }
        },
        group: ["guangrongjianduisp_draw"],
        subSkill: {
            draw: {
                trigger: { player: "turnOverAfter" },
                forced: true,
                filter: function (event, player) {
                    return !player.isTurnedOver();
                },
                content: function () {
                    player.draw();
                },
            },
        },
    },
    //威严
    weiyan: {
        audio: false,
        trigger: { player: ['phaseJudgeBefore', 'phaseDrawBefore', 'phaseUseBefore', 'phaseDiscardBefore'] },
        filter: function (event, player) {
            return player.countCards('h') > 0;
        },
        direct: true,
        preHidden: true,
        content: function () {
            'step 0'
            var check, str = '弃置一张手牌，翻面并跳过';
            str += ['判定', '摸牌', '出牌', '弃牌'][lib.skill.weiyan.trigger.player.indexOf(event.triggername)];
            str += '阶段';
            if (trigger.name == 'phaseDraw') str += '，然后本回合你使用的第一张牌结算两次';
            if (trigger.name == 'phaseUse') str += '，然后本回合你使用的牌无视距离限制且不可被响应';

            // Strategy B优化版: 判定阶段时制定全回合计划
            if (trigger.name == 'phaseJudge' && !player.storage.weiyan_plan) {
                // 评估本轮翻面结束的价值（仅当拥有光荣舰队SP时）
                var fleetValue = 0;
                if (player.hasSkill('guangrongjianduisp')) {
                    // 预测其他角色会弃牌且不造成伤害的次数
                    var predictedTriggers = 0;
                    game.countPlayer(function (current) {
                        if (current == player) return;
                        // 简化预测：手牌多的角色更可能弃牌，血量低的更可能不造成伤害
                        var discardProb = Math.min(0.8, current.countCards('h') / 8);
                        var noDamageProb = current.hp <= 2 ? 0.7 : 0.4;
                        predictedTriggers += discardProb * noDamageProb;
                    });
                    // 光荣舰队价值 = 预测触发次数 * 每次平均价值(约4) + 翻回正面摸牌(1.5)
                    fleetValue = predictedTriggers * 4 + 1.5;
                }

                // 失去下回合的代价 (约4-5点价值：2摸牌 + 2-3出牌阶段)
                var skipTurnCost = 4.5;

                // 决定目标状态：如果光荣舰队价值 > 跳过回合代价，目标是翻面结束
                player.storage.weiyan_plan = {
                    targetTurnedOver: fleetValue > skipTurnCost,
                    fleetValue: fleetValue,
                    skipCount: 0,  // 已跳过的阶段数
                    hasDiscarded: false  // 本回合是否已有弃牌
                };
            }

            var plan = player.storage.weiyan_plan || { targetTurnedOver: false, skipCount: 0, hasDiscarded: false };
            var currentTurnedOver = player.isTurnedOver();

            // 计算本次跳过后的翻面状态
            var skipCountAfter = plan.skipCount + 1;
            var willBeTurnedOver = (skipCountAfter % 2 == 1) ? !currentTurnedOver : currentTurnedOver;

            // 评估本阶段跳过的直接收益（buff价值 - 阶段本身价值）
            var directBenefit = 0;
            switch (trigger.name) {
                case 'phaseJudge':
                    // 有负面判定时跳过：收益 = 避免负面判定
                    directBenefit = player.countCards('j') > 0 ? 3 : -1;
                    break;
                case 'phaseDraw':
                    // 跳过摸牌获得"第一张牌双倍结算"buff
                    var valueCards = player.countCards("h", function (card) {
                        var type = get.type(card);
                        if (type != 'basic' && type != 'trick') return false;
                        var value = player.getUseValue(card, null, true);
                        return value > 6;
                    });
                    // buff价值（约3-5） - 摸牌阶段价值（2） = 净收益1-3
                    directBenefit = valueCards > 0 ? (valueCards >= 2 ? 3 : 1) : -2;
                    break;
                case 'phaseUse':
                    // 跳过出牌获得"无视距离+不可被响应"buff
                    var attackCards = player.countCards("h", function (card) {
                        return get.tag(card, 'damage');
                    });
                    // buff价值（约4-6） - 出牌阶段价值（3） = 净收益1-3
                    directBenefit = attackCards > 0 ? (attackCards >= 2 ? 3 : 1) : -3;

                    // 警告：如果跳过出牌+弃牌，本回合可能没有弃牌进入弃牌堆
                    if (!plan.hasDiscarded && player.countCards('h') <= player.getHandcardLimit()) {
                        // 手牌不超过上限，弃牌阶段不会弃牌
                        // 如果还跳过出牌阶段，光荣舰队SP可能无牌可用
                        if (plan.targetTurnedOver && player.hasSkill('guangrongjianduisp')) {
                            directBenefit -= 2;  // 扣除部分光荣舰队预期价值
                        }
                    }
                    break;
                case 'phaseDiscard':
                    // 需要弃牌时跳过：收益 = 保留手牌价值
                    var needDiscard = player.countCards('h') - player.getHandcardLimit();
                    directBenefit = needDiscard > 0 ? needDiscard * 1.5 : -1;

                    // 如果需要弃牌却跳过了，标记本回合有弃牌机会但放弃了
                    if (needDiscard > 0) {
                        plan.hasDiscarded = true;  // 本应弃牌，视为有弃牌
                    }
                    break;
            }

            // 检查本回合是否已经有弃牌（威严弃置手牌也算）
            if (!plan.hasDiscarded && trigger.name != 'phaseJudge') {
                var discardHistory = player.getHistory('lose', function(evt) {
                    return evt.type == 'discard';
                });
                if (discardHistory.length > 0) {
                    plan.hasDiscarded = true;
                }
            }

            // 决策逻辑：直接收益 + 翻面状态对齐奖励
            check = directBenefit;

            // 只有当直接收益为正（跳过本身有价值）时，才考虑翻面状态对齐
            if (directBenefit > 0) {
                if (plan.targetTurnedOver && willBeTurnedOver) {
                    // 目标翻面 & 跳过后翻面 → 完美对齐，加成
                    check += 1;
                } else if (!plan.targetTurnedOver && !willBeTurnedOver) {
                    // 目标正面 & 跳过后正面 → 完美对齐，加成
                    check += 1;
                } else {
                    // 不对齐：虽然跳过本身有收益，但最终状态不符合预期
                    // 如果还有后续阶段可以调整，则允许；否则扣分
                    var remainingPhases = 0;
                    var phaseIndex = lib.skill.weiyan.trigger.player.indexOf(event.triggername);
                    remainingPhases = 3 - phaseIndex;  // 还有几个阶段可以调整

                    if (remainingPhases > 0) {
                        // 还有机会调整，轻微扣分
                        check -= 0.5;
                    } else {
                        // 最后一个阶段了，状态不对齐，重扣
                        check -= 2;
                    }
                }
            }

            // 单技能情况（仅威严，无光荣舰队）：翻面是纯代价
            if (!player.hasSkill('guangrongjianduisp')) {
                // 只有跳过本身收益足够大（>1），才值得牺牲下回合
                if (directBenefit <= 1) {
                    check = -2;
                }
            }

            player.chooseToDiscard(get.prompt('weiyan'), str, lib.filter.cardDiscardable).set('ai', card => {
                if (_status.event.check <= 0) return -1;
                return 7 - get.value(card);
            }).set('check', check).set('logSkill', 'weiyan').setHiddenSkill('weiyan');
            'step 1'
            if (result.bool) {
                // 更新计划中的跳过计数和弃牌标记
                if (player.storage.weiyan_plan) {
                    player.storage.weiyan_plan.skipCount++;
                    // 威严弃置手牌，标记本回合已有弃牌
                    player.storage.weiyan_plan.hasDiscarded = true;
                }

                trigger.cancel();
                game.log(player, '跳过了', '#y' + ['判定', '摸牌', '出牌', '弃牌'][lib.skill.weiyan.trigger.player.indexOf(event.triggername)] + '阶段');
                if (trigger.name == 'phaseUse') {
                    player.addTempSkill("weiyan_phaseUse");
                    player.turnOver();
                }
                else if (trigger.name == 'phaseDraw') {
                    player.addTempSkill("weiyan_phaseDraw");
                    player.turnOver();
                }
                else { player.turnOver(); };
            }
            else event.finish();
        },
        // 回合结束时清除计划
        group: 'weiyan_cleanup',
        subSkill: {
            cleanup: {
                trigger: { player: 'phaseAfter' },
                forced: true,
                silent: true,
                popup: false,
                content: function () {
                    delete player.storage.weiyan_plan;
                },
            },
            phaseUse: {
                charlotte: true,
                trigger: { player: 'useCard1' },
                forced: true,
                popup: false,
                content: function () {
                    trigger.directHit.addArray(game.players);
                    game.log(trigger.card, '不可被响应');
                },
                mark: true,
                intro: {
                    content: '使用牌无距离限制且不能被响应',
                },
                mod: {
                    targetInRange: () => true,
                },
            },
            phaseDraw: {
                trigger: { player: 'useCard' },
                direct: true,
                usable: 1,
                charlotte: true,
                popup: false,
                filter: function (event, player) {
                    var type = get.type(event.card, false);
                    if (type != 'basic' && type != 'trick') return false;
                    return true
                },
                content: function () {
                    trigger.effectCount++;
                },
                mark: true,
                intro: {
                    content: '使用的第一张牌结算两次',
                },
            },
        },
    },
    //金雕展翅
    jindiaozhanchi: {
        nobracket: true,
        audio: false,
        trigger: { global: "useCard" },
        direct: true,
        filter: function (event, player) {
            return event.card && event.card.name == "sha";
        },
        content: function () {
            "step 0"
            player.chooseToDiscard("he", get.prompt("jindiaozhanchi"), "弃置一张牌，令此【杀】变为【雷杀】").set("ai", function (card) {
                var player = _status.event.player;
                var evt = _status.event.getTrigger();
                if (get.attitude(player, evt.player) > 0) {
                    if (get.color(card) == "black") return 8.5 - get.value(card);
                    return 7 - get.value(card);
                }
                if (get.color(card) == "black") return 7 - get.value(card);
                return 0;
            });
            "step 1"
            if (result.bool) {
                player.logSkill("jindiaozhanchi", trigger.player);
                trigger.card.nature = "thunder";
                game.log(trigger.card, "变为了", "#y雷杀");
                event.cardColor = get.color(result.cards[0]);
                event.count = 0;
                if (trigger.card.color == "black") event.count++;
                if (event.cardColor == "black") event.count++;
                if (event.count > 0) {
                    player.draw(event.count);
                }
            }
        },
    },

    //南沙功臣
    nanshagonchen: {
        nobracket: true,
        audio: false,
        trigger: { player: "useCardToTargeted" },
        filter: function (event, player) {
            return event.card && event.card.name == "sha" || event.card.name == "sheji9";
        },
        check(event, player) {
            return get.attitude(player, event.target) < 0;
        },
        content: function () {
            'step 0'
            var num = game.countPlayer(function (current) {
                return current.group == "PLAN" || current.group == "ROCN";
            });

            if (num >= 2) {
                player.draw();
            }
            if (num >= 3) {
                trigger.target.addTempSkill('qinggang2');
                trigger.target.storage.qinggang2.add(trigger.card);
            }
            if (num >= 4) {
                var evt = trigger.getParent();
                if (evt.baseDamage) evt.baseDamage++;
            }
            if (num >= 1) {
                if (trigger.target.countCards("he") >= 0) {
                    var next = player.choosePlayerCard(trigger.target, 'he', [1, Math.min(player.hp, trigger.target.countCards('he'))], get.prompt('nanshagonchen', trigger.target));
                    next.set('ai', function (button) {
                        if (!_status.event.goon) return 0;
                        var val = get.value(button.link);
                        if (button.link == _status.event.target.getEquip(2)) return 2 * (val + 3);
                        return val;
                    });
                    next.set('goon', get.attitude(player, trigger.target) <= 0);
                    next.set('forceAuto', true);
                }

            }
            'step 1'
            if (result.bool) {
                var target = trigger.target;
                player.logSkill('nanshagonchen', target);
                target.addSkill('nanshagonchen2');
                target.addToExpansion('giveAuto', result.cards, target).gaintag.add('nanshagonchen2');
            }
        },
        ai: {
            unequip_ai: true,
            directHit_ai: true,
            skillTagFilter: function (player, tag, arg) {
                if (get.attitude(player, arg.target) > 0) return false;
                if (tag == 'directHit_ai') return player.hp >= Math.max(1, arg.target.countCards('h') - 1);
                if (arg && (arg.name == 'sha' || arg.name == 'sheji9') && arg.target.getEquip(2)) return true;
                return false;
            }
        },
    },
    nanshagonchen2: {
        trigger: { global: 'phaseEnd' },
        forced: true,
        popup: false,
        charlotte: true,
        filter: function (event, player) {
            return player.getExpansions('nanshagonchen2').length > 0;
        },
        content: function () {
            'step 0'
            var cards = player.getExpansions('nanshagonchen2');
            player.gain(cards, 'draw');
            game.log(player, '收回了' + get.cnNumber(cards.length) + '张“破军”牌');
            'step 1'
            player.removeSkill('nanshagonchen2');
        },
        intro: {
            markcount: 'expansion',
            mark: function (dialog, storage, player) {
                var cards = player.getExpansions('nanshagonchen2');
                if (player.isUnderControl(true)) dialog.addAuto(cards);
                else return '共有' + get.cnNumber(cards.length) + '张牌';
            },
        },
    },
    //四大金刚
    sidajinganglian: {
        nobracket: true,
        audio: false,
        trigger: { global: "roundStart" },
        direct: true,
        content: function () {
            "step 0"
            game.countPlayer(function (current) {
                if (current.hasMark("sidajinganglian")) {
                    current.removeMark("sidajinganglian", current.countMark("sidajinganglian"));
                    current.removeSkill("sidajinganglian_effect");
                }
            });
            player.chooseTarget([0, 2], "四大金刚：选择至多两名其他角色令其获得'联'", function (card, player, target) {
                return target != player;
            }).set("ai", function (target) {
                var player = _status.event.player;
                return get.attitude(player, target);
            });
            "step 1"
            if (result.bool && result.targets && result.targets.length > 0) {
                player.logSkill("sidajinganglian", result.targets);
                for (var target of result.targets) {
                    target.addMark("sidajinganglian", 1);
                    target.addSkill("sidajinganglian_effect");
                }
            }
        },
        group: ["sidajinganglian_damage", "sidajinganglian_draw"],
        subSkill: {
            effect: {
                init: function (player) {
                    player.storage.sidajinganglian_effect = 0;
                },
                trigger: { player: "phaseDrawBegin2" },
                forced: true,
                filter: function (event, player) {
                    return !event.numFixed;
                },
                content: function () {
                    trigger.num++;
                },

                marktext: "联",
                intro: {
                    content: "摸牌阶段摸牌+1；首次造成伤害时，可以额外使用一张【杀】",
                },
            },
            draw: {
                silent: true,
                lastdo: true,
                trigger: { player: "phaseDrawBegin2" },
                forced: true,
                filter: function (event, player) {
                    return !event.numFixed;
                },
                content: function () {
                    trigger.num++;
                },
            },
            damage: {
                trigger: { source: "damageSource" },
                direct: true,
                filter: function (event, player) {
                    return event.source.hasSkill("sidajinganglian_effect") && event.source.storage.sidajinganglian_effect < 2;
                },
                content: function () {
                    "step 0"
                    if (trigger.source.storage.sidajinganglian_effect && trigger.source.storage.sidajinganglian_effect == 1) {
                        game.asyncDraw([player, trigger.source]);
                        trigger.source.storage.sidajinganglian_effect = 2;
                        event.finish();
                        return;
                    }
                    player.chooseToDiscard("he", "四大金刚：是否弃置一张牌，令" + get.translation(player) + "额外使用一张【杀】？").set("ai", function (card) {
                        return 7 - get.value(card);
                    });
                    "step 1"
                    if (result.bool) {
                        trigger.source.storage.sidajinganglian_effect = 1;
                        trigger.source.chooseToUse('四大金刚：你可以使用一张杀', function (card) {
                            if (get.name(card) != 'sha' && get.name(card) != 'sheji9') return false;
                            return lib.filter.cardEnabled.apply(this, arguments)
                        }, function (card, player, target) {
                            return lib.filter.filterTarget.apply(this, arguments);
                        }).set('ai2', function () {
                            return get.effect_use.apply(this, arguments) + 0.01;
                        });
                    }

                },
            },

        },
    },
    //海鹰巡弋
    haiyingxunyi: {
        nobracket: true,
        audio: false,
        global: "haiyingxunyi_qinggang_skill",
        trigger: { global: "useCardAfter" },
        direct: true,
        filter: function (event, player, name) {
            if (event.player == player) {
                if (_status.currentPhase != player) return false;
                var evt = player.getLastUsed(1);
                if (!evt) return false;
                var color1 = get.color(evt.card);
                var color2 = get.color(event.card);
                return color1 && color2 && color1 != 'none' && color2 != 'none' && color1 != color2;
            }
            if (event.player != player) {
                if (event.player.group == "PLAN" || event.player.group == "ROCN") {
                    if (_status.currentPhase != event.player) return false;
                    var evt = event.player.getLastUsed(1);
                    if (!evt) return false;
                    var color1 = get.color(evt.card);
                    var color2 = get.color(event.card);
                    return color1 && color2 && color1 != 'none' && color2 != 'none' && color1 != color2;
                }
            }
            return false;
        },
        content: function () {
            "step 0"
            if (trigger.player == player) {
                player.chooseTarget("海鹰巡弋：令一名其他角色摸一张牌", function (card, player, target) {
                    return target != player;
                }).set("ai", function (target) {
                    var player = _status.event.player;
                    return get.attitude(player, target);
                });
            } else {
                player.logSkill("haiyingxunyi");
                player.draw();
                event.finish();
            }
            "step 1"
            if (result.bool && result.targets && result.targets[0]) {
                player.logSkill("haiyingxunyi", result.targets);
                result.targets[0].draw();
            }
        },
        ai: {
            threaten: function (player, target) {
                if (player.group == "PLAN" || player.group == "ROCN") return 2;
                return 1.2;
            },
        },
    },
    haiyingxunyi_qinggang_skill: {
        audio: true,
        trigger: {
            player: "useCardToPlayered",
        },
        filter: function (event) {
            return event.player.hasSkill("daoqu");
        },
        forced: true,
        logTarget: "target",
        content: function () {
            trigger.target.addTempSkill("qinggang2");
            trigger.target.storage.qinggang2.add(trigger.card);
            trigger.target.markSkill("qinggang2");
        },
        ai: {
            unequip_ai: true,
            skillTagFilter: function (player, tag, arg) {
                if (arg && arg.name == "sha" || arg.name == "sheji9") return true;
                return false;
            },
        },
    },

    //大洋鹰击
    dayangyingji: {
        audio: false,
        global: ["dayangyingji_qinggang_skill"],
        forced: false,
        round: 1,
        trigger: { global: ['chooseToRespondBefore', 'chooseToUseBefore'] },
        filter(event, player) {
            if (event.responded) return false;
            if (!event.filterCard({ name: 'shan' }, player, event)) return false;
            if (event.player.hasSkill('qiantingss')) return true;
        },
        check(event, player) {
            if (get.damageEffect(player, event.player, player) >= 0) return false;
            return true;
        },
        content(event, trigger, player) {
            trigger.result = { bool: true, card: { name: 'shan', isCard: true } };
            trigger.responded = true;
            trigger.animate = false;
        },
        ai: {
            threaten: 1.3,
        },
    },
    dayangyingji_qinggang_skill: {
        audio: true,
        trigger: {
            player: "useCardToPlayered",
        },
        filter: function (event) {
            return event.player.hasSkill("qiantingss");
        },
        forced: true,
        logTarget: "target",
        content: function () {
            trigger.target.addTempSkill("qinggang2");
            trigger.target.storage.qinggang2.add(trigger.card);
            trigger.target.markSkill("qinggang2");
        },
        ai: {
            unequip_ai: true,
            skillTagFilter: function (player, tag, arg) {
                if (arg && arg.name == "sha" || arg.name == "sheji9") return true;
                return false;
            },
        },
    },
    //先驱者
    xianquzhe: {
        audio: false,
        trigger: { global: 'phaseBefore', player: "enterGame" },
        forced: true,
        nobracket: true,
        content: function () {
            "step 0"
            player.addSkill("xianquzhe_range");
            player.chooseTarget("先驱者：令一名角色攻击范围-2", true).set("ai", function (target) {
                var player = _status.event.player;
                return -get.attitude(player, target);
            });
            "step 1"
            if (result.bool && result.targets && result.targets[0]) {
                result.targets[0].addSkill("xianquzhe_range_minus");
            }
            player.chooseTarget("先驱者：令一名角色攻击范围+1", true).set("ai", function (target) {
                var player = _status.event.player;
                return get.attitude(player, target);
            });
            "step 2"
            if (result.bool && result.targets && result.targets[0]) {
                result.targets[0].addSkill("xianquzhe_range_plus");
            }
        },
        group: "xianquzhe_discard",
        subSkill: {
            range: {
                mod: {
                    attackRange: function (player, num) {
                        return num + 2;
                    },
                },
            },
            range_minus: {
                mod: {
                    attackRange: function (player, distance) {
                        return distance - 2;
                    },
                },
                mark: true,
                intro: {
                    content: "攻击范围-2",
                },
            },
            range_plus: {
                mod: {
                    attackRange: function (player, distance) {
                        return distance + 1;
                    },
                },
                mark: true,
                intro: {
                    content: "攻击范围+1",
                },
            },
            discard: {
                trigger: { player: "useCardToTargeted" },
                usable: 1,
                filter: function (event, player) {
                    return event.card && get.type(event.card) == "trick" && event.target && event.targets.length == 1 && event.target.countCards("h") > 0;
                },
                check: function (event, player) {
                    if (get.attitude(player, event.target) < 0) return true;
                },
                content: function () {
                    "step 0"
                    trigger.target.chooseToDiscard("h", [0, trigger.target.countCards("h")], true).set("ai", function (card) {
                        var player = get.player();
                        if (!get.tag(_status.event.card, 'damage')) return 0;
                        var respondCards = player.countCards("h", { name: 'shan' });
                        if (get.name(_status.event.card) == "wanjian" && respondCards > 0) return 0;
                        var saveCards = player.countCards("h", { name: 'tao', suit: 'diamond' }) + player.countCards("h", { name: 'jiu', suit: 'diamond' }) + player.countCards("h", { name: 'kuaixiu9', suit: 'diamond' }) + player.countCards("h", { name: 'Zziqi9', suit: 'diamond' });
                        if (saveCards) return 0;
                        if (get.suit(card) == "diamond") return 3;
                    });
                    "step 1"
                    var diamonds = trigger.target.countCards("h", { suit: "diamond" });
                    var evt = trigger.getParent();
                    if (evt.baseDamage) evt.baseDamage += diamonds.length ? 1 : 0;
                },
                ai: {
                    threaten: 1.2
                },
            },
        },
    },
    //三坐标定位
    sanzuobiaodingwei: {
        audio: false,
        enable: "phaseUse",
        usable: 1,
        nobracket: true,
        filterTarget: function (card, player, target) {
            return target != player;
        },
        content: function () {
            "step 0"
            player.chooseControl("基本", "锦囊", "装备").set("prompt", "三坐标定位：选择一种牌的类型").set("ai", function () {
                var list = ["基本", "锦囊", "装备"];
                return list.randomGet();
            });
            "step 1"
            event.cardType = result.control;
            var trans = { "基本": "basic", "锦囊": "trick", "装备": "equip" };
            event.type = trans[event.cardType];
            target.showHandcards();
            "step 2"
            var hs = target.getCards("h");
            var has = false;
            for (var card of hs) {
                if (get.type(card) == event.type) {
                    has = true;
                    break;
                }
            }
            if (has) {
                target.turnOver();
            } else {
                var types = ["basic", "trick", "equip"];
                types.remove(event.type);
                for (var t of types) {
                    var cards = target.getCards("h", { type: t });
                    if (cards.length > 0) {
                        target.discard(cards.randomGet());
                    }
                }
            }
        },
        ai: {
            order: 8,
            result: {
                target: -1,
            },
        },
    },
    //威严召唤
    weiyanzhaohuan: {
        nobracket: true,
        group: ["weiyanzhaohuan_use", "weiyanzhaohuan_respond"],
        subSkill: {
            use: {
                usable: 1,
                enable: "chooseToUse",
                filter: function (event, player) {
                    if (event.filterCard({ name: "sha", isCard: true }, player, event)) return true;
                },
                check: function (event, player) {
                    return true;

                },
                content: function () {
                    "step 0";
                    player.judge("weiyanzhaohuan", function (card) {
                        return get.color(card) == "black" ? 1.5 : -0.5;
                    }).judge2 = function (result) {
                        return result.bool;
                    };
                    "step 1";
                    if (result.judge > 0) {
                        player.chooseUseTarget("sha", true);
                    }
                },
                ai: {
                    order() {
                        return get.order({ name: "sha" }) + 3;
                    },
                    result: {
                        player: 1,
                    },
                    threaten: 1.5,
                },
            },
            respond: {
                usable: 1,
                trigger: {
                    player: ["chooseToRespondBegin"],
                },
                filter: function (event, player) {
                    if (event.filterCard({ name: "sha", isCard: true }, player, event)) return true;
                },
                check: function (event, player) {
                    if (!event) return true;
                    if (event.ai) {
                        var ai = event.ai;
                        var tmp = _status.event;
                        _status.event = event;
                        var result = ai({ name: "sha" }, _status.event.player, event);
                        _status.event = tmp;
                        return result > 0;
                    }
                    let evt = event.getParent();
                    /*if (!evt || !evt.card || !evt.player || player.hasSkillTag("useShan", null, evt))
                        return true;*/
                    if (
                        (evt.card.name == "juedou" || evt.card.name == "juedouba9") &&
                        evt.player &&
                        get.attitude(player, evt.player._trueMe || evt.player) > 0
                    )
                        return false;
                    return true;
                },
                content: function () {
                    "step 0";
                    trigger.jishiyu_R1 = true;
                    player.judge("weiyanzhaohuan", function (card) {
                        return get.color(card) == "black" ? 1.5 : -0.5;
                    }).judge2 = function (result) {
                        return result.bool;
                    };
                    "step 1";
                    if (result.judge > 0) {
                        trigger.untrigger();
                        trigger.set("responded", true);
                        trigger.result = { bool: true, card: { name: "sha", isCard: true } };
                    }
                },
                ai: {
                    order: function (item, player) {
                        var player = get.player();
                        var event = _status.event;
                        if (event.filterCard({ name: "sha" }, player, event)) {
                            if (
                                !player.hasShan() &&
                                !game.hasPlayer(function (current) {
                                    return player.canUse("sha", current) && current.hp == 1 && get.effect(current, { name: "sha" }, player, player) > 0;
                                })
                            ) {
                                return 0;
                            }
                            return 2.95;
                        } else {
                            var player = get.player();
                            return 3.15;
                        }
                    },
                    respondSha: true,
                    skillTagFilter: function (player, tag, arg) {
                        if (arg != "use") return false;
                    },
                    result: {
                        player: 1,
                    },
                },
            },
        },
    },
    //光荣舰队normal
    guangrongjianduinormal: {
        nobracket: true,
        audio: false,
        trigger: { player: "useCardToTargeted" },
        forced: false,
        filter: function (event, player) {
            if (event.card.name != "sha" && event.card.name != "sheji9") return false;
            var hs = player.getCards("h");
            for (var card of hs) {
                if (get.type(card) == "basic") return false;
            }
            return true;
        },
        content: function () {
            player.showHandcards();
            var evt = trigger.getParent();
            if (evt.baseDamage) evt.baseDamage++;
        },
        ai: {
            presha: true,
            pretao: true,
            threaten: 1.2,
        },
    },
    //力争上游
    lizhengshangyou: {
        nobracket: true,
        audio: false,
        trigger: {
            global: "phaseBeforeEnd",
            player: ["phaseDrawBegin2"]
        },
        forced: true,
        // 初始化标记：每局游戏只触发一次
        init: function (player) {
            if (player.storage.lizhengshangyou_used === undefined) {
                player.storage.lizhengshangyou_used = false;
            }
        },
        filter: function (event, player, name) {
            // 已经触发过则不再触发
            if (player.storage.lizhengshangyou_used) return false;
            if (name == "phaseDrawBegin2") {
                return !event.numFixed;
            }
            return (event.name != 'phase' || game.phaseNumber == 0);
        },
        content: function () {
            "step 0";
            var num = game.countPlayer(function (current) {
                return current.group == "PLAN" || current.group == "ROCN";
            });
            // 处理摸牌阶段加成
            if (event.triggername == "phaseDrawBegin2") {
                trigger.num += num * 2;
                event.finish();
                return;
            }
            // 先摸牌
            player.draw(num * 2);
            "step 1";
            player.chooseTarget("力争上游：是否令一名距离你为1的或c国的角色执行一个额外回合？", function (card, player, target) {
                if (get.distance(target, player) == 1) return true;
                if (target.group == "PLAN" || target.group == "ROCN") return true;
                return false;
            }).set("ai", function (target) {
                return get.attitude(_status.event.player, target);
            });
            "step 2";
            // 无论是否选择目标，都标记已使用（仅触发一次）
            player.storage.lizhengshangyou_used = true;
            if (!result.bool) {
                event.finish();
                return;
            }

            // 取消原回合剩余阶段（如果希望直接跳转到额外回合）
            if (trigger && !trigger._finished) {
                trigger.finish();
                trigger._finished = true;
                trigger.untrigger(true);
                trigger._triggered = 5;
            }
            var zhu = game.filterPlayer(current => current.getSeatNum() == 1)[0];
            zhu.insertPhase("lizhengshangyou", true);
            var target = result.targets[0];
            // 为目标插入一个额外回合
            var extraPhase = target.insertPhase("lizhengshangyou", true);
            extraPhase._noTurnOver = true;
            event.finish();
        }
    },
    //迫钧
    pojun: {
        audio: false,
        trigger: { source: "damageBegin1" },
        forced: true,
        filter: function (event, player) {
            if (!event.card || event.card.name != "sha") return false;
            var target = event.player;
            if (!target) return false;
            if (target.countCards("e") < player.countCards("e")) {
                if (target.countCards("h") < player.countCards("h")) {
                    return true;
                }
            }
            return false;
        },
        content: function () {
            trigger.num++;
        },
    },
    //凌海
    linghai: {
        audio: false,
        trigger: { player: "useCardToTargeted" },
        direct: true,
        filter: function (event, player) {
            return event.card && event.card.name == "sha" && event.target && event.target.countCards("h") > 0;
        },
        content: function () {
            "step 0"
            player.chooseToCompare(trigger.target).set("ai", function (card) {
                return get.number(card);
            });
            "step 1"
            if (result.bool) {
                player.gainPlayerCard(trigger.target, "he", true);
            }
        },
    },
};
export { tebiechuanwu };