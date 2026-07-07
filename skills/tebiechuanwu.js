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
            var evt = _status.event.getParent("phase");
            if (!evt || !evt.player) return false;
            var list = [];
            evt.player.getHistory("lose", function (evt) {
                if (evt.type == "discard" && evt.cards) {
                    list.addArray(evt.cards.filter(function (card) {
                        return get.position(card) == "d";
                    }));
                }
            });
            if (list.length <= 0) return false;
            return player.isTurnedOver();
        },
        content: function () {
            "step 0"
            var evt = _status.event.getParent("phase");
            if (evt && evt.player) {
                var list = [];
                evt.player.getHistory("lose", function (evt) {
                    if (evt.type == "discard" && evt.cards) {
                        list.addArray(evt.cards.filter(function (card) {
                            return get.position(card) == "d";
                        }));
                    }
                });
                if (list.length > 0) {
                    player.chooseButton(["光荣舰队：是否使用一张牌？", list]).set("ai", function (button) {
                        var player = _status.event.player;
                        var hasBasicTarget = game.hasPlayer(function (current) {
                            if (player.canUse(button.link, current)) return get.value(button.link);
                        });
                        return hasBasicTarget>0;
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
            switch (trigger.name) {
                case 'phaseJudge':
                    check = player.countCards('j');
                    break;
                case 'phaseDraw':
                    var valueCards = player.countCards("h", function (card) {
                        return get.type(card) == 'basic' || get.type(card) == 'trick' && player.getUseValue({ name, isCard: true }, null, true) > 7;
                    });
                    check = valueCards > 0;
                    break;
                case 'phaseUse':
                    var attackCards = player.countCards("h", function (card) {
                        return get.tag(card, 'damage');
                    })
                    check = attackCards > 0;
                    break;
                case 'phaseDiscard':
                    check = player.needsToDiscard();
                    break;
            }
            player.chooseToDiscard(get.prompt('weiyan'), str, lib.filter.cardDiscardable).set('ai', card => {
                if (!_status.event.check) return -1;
                return 7 - get.value(card);
            }).set('check', check).set('logSkill', 'weiyan').setHiddenSkill('weiyan');
            'step 1'
            if (result.bool) {
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
        subSkill: {
            weiyan_phaseUse: {
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