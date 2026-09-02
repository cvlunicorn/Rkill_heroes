import { lib, game, ui, get, ai, _status } from '../../../noname.js';
const guozhanskills = {
    gz_tianshi: {
        nobracket: true,
        unique: true,
        global: "gz_tianshi2",
    },
    gz_tianshi2: {//新版标司马懿鬼才
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:2",
        trigger: {
            global: "judge",
        },
        frequent: true,
        //preHidden: true,
        filter(event, player) {
            if (player.group != 'RN') return false;
            if (!event.player.hasSkill("gz_tianshi")) return false;
            if (player.hasSkill("gz_tianshi")) return false;
            return player.countCards(get.mode() == 'guozhan' ? 'hes' : 'hs') > 0;
        },
        async content(event, trigger, player) {
            const { result: { bool: chooseCardResultBool, cards: chooseCardResultCards } } = await player.chooseCard(get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' +
                get.translation(trigger.player.judging[0]) + ',' + get.prompt('gz_tianshi2'), get.mode() == 'guozhan' ? 'hes' : 'hs', card => {
                    const player = _status.event.player;
                    const mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                    if (mod2 != 'unchanged') return mod2;
                    const mod = game.checkMod(card, player, 'unchanged', 'cardRespondable', player);
                    if (mod != 'unchanged') return mod;
                    return true;
                }).set('ai', card => {
                    const trigger = _status.event.getTrigger();
                    const player = _status.event.player;
                    const judging = _status.event.judging;
                    const result = trigger.judge(card) - trigger.judge(judging);
                    const attitude = get.attitude(player, trigger.player);
                    if (attitude == 0 || result == 0) return 0;
                    if (attitude > 0) {
                        return result - get.value(card) / 2;
                    }
                    else {
                        return -result - get.value(card) / 2;
                    }
                }).set('judging', trigger.player.judging[0]).setHiddenSkill('gz_tianshi2');
            if (!chooseCardResultBool) return;
            player.respond(chooseCardResultCards, 'gz_tianshi2', 'highlight', 'noOrdering');
            if (trigger.player.judging[0].clone) {
                trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                game.broadcast(function (card) {
                    if (card.clone) {
                        card.clone.classList.remove('thrownhighlight');
                    }
                }, trigger.player.judging[0]);
                game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
            }
            game.cardsDiscard(trigger.player.judging[0]);
            trigger.player.judging[0] = chooseCardResultCards[0];
            trigger.orderingCards.addArray(chooseCardResultCards);
            game.log(trigger.player, '的判定牌改为', chooseCardResultCards[0]);
            game.asyncDelayx(2);
        },
        ai: {
            rejudge: true,
            tag: {
                rejudge: 1,
            },
        },
        "_priority": 0,
    },
    gz_yongbuchenmo: {
        nobracket: true,
        unique: true,
        usable: 1,
        trigger: {
            player: "damageBegin3",
        },
        forced: true,
        filter(event, player) {
            if (player.countCards("he") == 0) return false;
            return player.hujia > 0 && event.num >= 1;
        },
        content() {
            'step 0'
            player.chooseToDiscard(1).set("ai", function (card) {
                return 9 - get.value(card);
            });
            'step 1'
            if (result.bool == true) {
                if (trigger.num >= 1) {
                    trigger.num--;
                }
            }
        },
        ai: {
            effect: {
                target(card, player, target) {
                    if (get.tag(card, 'damage') && target.hujia > 0) {
                        if (player.hasSkillTag('jueqing', false, target)) return 0;
                        return 0.1;
                    }
                },
            },
        },
        "_priority": 0,

    },
    gz_longgu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        global: "gz_longgu_skill",
    },
    gz_longgu_skill: {
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        filter: function (event, player) {
            if (game.hasPlayer(function (current) {
                return current.hasSkill("gz_longgu") && current.isAlive();
            })
            ) {
                if (!(player.hasSkill("gz_longgu_basic") || player.hasSkill("gz_longgu_trick"))) {
                    return game.hasPlayer(function (current) {
                        return current.hasSkill("gz_longgu") && current.group == player.group;
                    });
                }
            }
        },
        check: function (event, player) {
            return player.hp <= 2;
        },
        content: function () {
            'step 0'
            player.skip('phaseDraw');
            if (!player.isMajor()) player.draw();
            var str = get.translation(trigger.player);
            player.chooseControl().set('choiceList', [
                '不能成为基本牌的目标',
                '不能成为普通锦囊牌和延时锦囊牌的目标',
            ]).set('ai', function () {
                if (player.countCards("h", card => get.type(card) === "trick") > 1) return 0;
                return 1;
            });
            'step 1'
            if (result.control) {
                if (result.index == 1) {
                    game.log(get.translation(player), '不能成为普通锦囊牌和延时锦囊牌的目标');
                    player.addSkill("gz_longgu_trick");
                }
                else if (result.index == 0) {
                    game.log(get.translation(player), '不能成为基本牌的目标');
                    player.addSkill("gz_longgu_basic");
                }
            }
        }
    },
    gz_longgu_trick: {
        mod: {
            targetEnabled(card, player, target, now) {
                //game.log(get.translation(card));
                //game.log(get.type(card));
                if (get.type(card) == "trick" || get.type(card) == "delay") return false;
            },
        },
        forced: true,
        direct: true,
        trigger: {
            player: "useCard",
        },
        filter: function (event, player) {
            return get.type(event.card) == "trick" || get.type(event.card) == "delay";
        },
        content: function (event, player) {
            player.removeSkill("gz_longgu_trick");
        },
        ai: {
            effect: {
                player: function (card, player, target, current, isLink) {
                    if (get.type(card) == "trick") {
                        return get.value(card) - 3;
                    }
                },
            },
        },
        "_priority": 0,
    },
    gz_longgu_basic: {
        mod: {
            targetEnabled(card, player, target, now) {
                //game.log(get.translation(card));
                //game.log(get.type(card));
                if (get.type(card) == "basic") return false;
            },
        },
        forced: true,
        direct: true,
        trigger: {
            player: "useCard",
        },
        filter: function (event, player) {
            return get.type(event.card) == "basic";
        },
        content: function (event, player) {
            player.removeSkill("gz_longgu_basic");
        },
        ai: {
            effect: {
                player: function (card, player, target, current, isLink) {
                    if (get.type(card) == "basic") {
                        return get.value(card) - 3;
                    }
                },
            },
        },
        "_priority": 0,
    },
    gz_yixinyiyi: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: ["chooseToRespond", "chooseToUse"],
        usable: function (event, player) {
            return lib.skill.gz_yixinyiyi.getNum();
        },
        getNum: function () {
            var list = [],
                players = game.filterPlayer();
            for (var target of players) {
                if (target.isUnseen() || target.isHealthy()) continue;
                var add = true;
                for (var i of list) {
                    if (i.isFriendOf(target)) {
                        add = false;
                        break;
                    }
                }
                if (add) list.add(target);
            }
            return list.length;
        },
        mod: {
            cardUsable: function (card) {
                if (card.storage && card.storage.gz_yixinyiyi) return Infinity;
            },
        },
        filterCard(card) {
            return true;
        },
        position: "h",
        viewAs: {
            name: "sha",
            nature: "thunder",
            storage: {
                gz_yixinyiyi: true,
            },
        },
        viewAsFilter(player) {
            if (!player.countCards('h')) return false;

            var num = player.getHistory("useSkill", function (evt) {
                return evt.skill == "yixinyiyi";
            }).length;
            if (num < lib.skill.gz_yixinyiyi.getNum()) return true;
            return false;
        },
        prompt: "将一张手牌当雷杀使用",
        check(card) {
            var player = get.player();
            var name = get.name(card, player);
            if (player.hp <= 2 && ['tao', 'jiu', 'kuaixiu9', 'zziqi9'].includes(name)) return 0;
            if (['shan', 'huibi9'].includes(name) && player.countCards('h', function (current) {
                return ['shan', 'huibi9'].includes(get.name(current, player));
            }) <= 1) return 0;
            return 6 - get.value(card, player);
        },
        ai: {
            threaten(player, target) {
                return 2;
            },
            yingbian: function (card, player, targets, viewer) {
                if (get.attitude(viewer, player) <= 0) return 0;
                var base = 0, hit = false;
                if (get.cardtag(card, 'yingbian_hit')) {
                    hit = true;
                    if (targets.some(target => {
                        return target.mayHaveShan(viewer, 'use', target.getCards('h', i => {
                            return i.hasGaintag('sha_notshan');
                        })) && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.natureList(card)) > 0;
                    })) base += 5;
                }
                if (get.cardtag(card, 'yingbian_add')) {
                    if (game.hasPlayer(function (current) {
                        return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                    })) base += 5;
                }
                if (get.cardtag(card, 'yingbian_damage')) {
                    if (targets.some(target => {
                        return get.attitude(player, target) < 0 && (hit || !target.mayHaveShan(viewer, 'use', target.getCards('h', i => {
                            return i.hasGaintag('sha_notshan');
                        })) || player.hasSkillTag('directHit_ai', true, {
                            target: target,
                            card: card,
                        }, true)) && !target.hasSkillTag('filterDamage', null, {
                            player: player,
                            card: card,
                            jiu: true,
                        })
                    })) base += 5;
                }
                return base;
            },
            canLink: function (player, target, card) {
                if (!target.isLinked() && !player.hasSkill('wutiesuolian_skill')) return false;
                if (player.hasSkill('jueqing') || player.hasSkill('gangzhi') || target.hasSkill('gangzhi')) return false;
                return true;
            },
            basic: {
                useful: [5, 3, 1],
                value: [5, 3, 1],
            },
            order: function (item, player) {
                if (player.hasSkillTag('presha', true, null, true)) return 10;
                if (typeof item === 'object' && game.hasNature(item, 'linked')) {
                    if (game.hasPlayer(function (current) {
                        return current != player && lib.card.sha.ai.canLink(player, current, item) && player.canUse(item, current, null, true) && get.effect(current, item, player, player) > 0;
                    }) && game.countPlayer(function (current) {
                        return current.isLinked() && get.damageEffect(current, player, player, get.nature(item)) > 0;
                    }) > 1) return 3.1;
                    return 3;
                }
                return 3.05;
            },
            result: {
                target: function (player, target, card, isLink) {
                    let eff = -1.5, odds = 1.35, num = 1;
                    if (isLink) {
                        let cache = _status.event.getTempCache('sha_result', 'eff');
                        if (typeof cache !== 'object' || cache.card !== get.translation(card)) return eff;
                        if (cache.odds < 1.35 && cache.bool) return 1.35 * cache.eff;
                        return cache.odds * cache.eff;
                    }
                    if (player.hasSkill('jiu') || player.hasSkillTag('damageBonus', true, {
                        target: target,
                        card: card
                    })) {
                        if (target.hasSkillTag('filterDamage', null, {
                            player: player,
                            card: card,
                            jiu: true,
                        })) eff = -0.5;
                        else {
                            num = 2;
                            if (get.attitude(player, target) > 0) eff = -7;
                            else eff = -4;
                        }
                    }
                    if (!player.hasSkillTag('directHit_ai', true, {
                        target: target,
                        card: card,
                    }, true)) odds -= 0.7 * target.mayHaveShan(player, 'use', target.getCards('h', i => {
                        return i.hasGaintag('sha_notshan');
                    }), 'odds');
                    _status.event.putTempCache('sha_result', 'eff', {
                        bool: target.hp > num && get.attitude(player, target) > 0,
                        card: get.translation(card),
                        eff: eff,
                        odds: odds
                    });
                    return odds * eff;
                },
            },
            tag: {
                respond: 1,
                respondShan: 1,
                damage: function (card) {
                    if (game.hasNature(card, 'poison')) return;
                    return 1;
                },
                natureDamage: function (card) {
                    if (game.hasNature(card, 'linked')) return 1;
                },
                fireDamage: function (card, nature) {
                    if (game.hasNature(card, 'fire')) return 1;
                },
                thunderDamage: function (card, nature) {
                    if (game.hasNature(card, 'thunder')) return 1;
                },
                poisonDamage: function (card, nature) {
                    if (game.hasNature(card, 'poison')) return 1;
                },
            },
        },
    },
    gz_yaoyuandexiwang: {
        audio: false,
        nobracket: true,
        limited: true,
        enable: "phaseUse",
        filter: function (event, player) {
            return player.storage.gz_yaoyuandexiwang !== true;
        },
        content: function () {
            "step 0"
            player.awakenSkill("gz_yaoyuandexiwang");
            player.draw(game.roundNumber || 1);
            "step 1"
            event.hopeCards = get.itemtype(result) == "cards" ? result.filter(function (card) {
                return player.getCards("h").includes(card);
            }) : [];
            if (!player.hasSkill("gz_weizhidemingyun")) {
                event.finish();
                return;
            }
            player.logSkill("gz_weizhidemingyun");
            event.x = Math.max(1,game.roundNumber);
            player.chooseControl("选项一", "选项二").set("prompt", "未知的命运：选择一项").set("choiceList", [
                '本回合以此法获得的牌无法使用或打出且不计入手牌上限',
                "弃置" + event.x + "张牌"
            ]).set("ai", function () {
                var player = _status.event.player;
                var x = _status.event.getParent().x;
                var lowValueCards = player.getCards("he").filter(function (card) {
                    return get.value(card) < 5;
                });
                if (player.countCards("he") >= x && lowValueCards.length >= x) return "选项二";
                return "选项一";
            });
            "step 2"
            if (result.index == 0 || player.countCards("he") < event.x) {
                if (event.hopeCards.length) {
                    player.addGaintag(event.hopeCards, "gz_weizhidemingyun");
                    player.addTempSkill("gz_weizhidemingyun_clear", "phaseAfter");
                }
            } else {
                player.chooseToDiscard(event.x, true, "he");
            }
        },
        ai: {
            order: 7,
            result: {
                player: function (player) {
                    var x = game.roundNumber || 1;
                    if (player.countCards("h") < 2 || player.hp <= 1) return 1 + x;
                    return x >= 3 ? 1 : 0;
                },
            },
            threaten: 1.7,
        },
        "_priority": 0,
    },
    //未知的命运 - 遥远的希望结算后选择：本回合锁定新牌或弃牌
    gz_weizhidemingyun: {
        audio: false,
        nobracket: true,
        mod: {
            cardEnabled2: function (card, player) {
                if (get.itemtype(card) == "card" && card.hasGaintag("gz_weizhidemingyun")) return false;
            },
            cardRespondable: function (card, player) {
                if (get.itemtype(card) == "card" && card.hasGaintag("gz_weizhidemingyun")) return false;
            },
            ignoredHandcard: function (card, player) {
                if (card.hasGaintag('gz_weizhidemingyun')) return true;
            },
        },
        onremove: function (player) {
            player.removeGaintag("gz_weizhidemingyun");
        },
        "_priority": 0,
    },
    //如愿的曙光 - 觉醒技，体力变化累计超过4点后觉醒
    gz_ruyuandeshuguang: {
        audio: false,
        unique: true,
        juexingji: true,
        nobracket: true,
        derivation: "gz_heshiyan",
        trigger: { player: "changeHp" },
        forced: true,
        direct: true,
        filter: function (event, player) {
            return !player.storage.gz_shuguang_done;
        },
        content: function () {
            "step 0"
            if (!player.storage.gz_shuguang_count) player.storage.gz_shuguang_count = 0;
            player.storage.gz_shuguang_count += Math.abs(trigger.num);
            player.markSkill("gz_ruyuandeshuguang");
            "step 1"
            if (player.storage.gz_shuguang_count > 4) {
                player.logSkill("gz_ruyuandeshuguang");
                player.storage.gz_shuguang_done = true;
                player.awakenSkill("gz_ruyuandeshuguang");
                player.removeSkill("weizhidemingyun");
                //升级防空（+1技能等级）
                player.addMark("jinengup", 1);
                //重置遥远的希望
                player.restoreSkill("gz_yaoyuandexiwang");
                //获得核试验旗舰
                player.addSkill("gz_heshiyan");
            }
        },
        mark: true,
        intro: {
            content: function (storage, player) {
                var count = player.storage.gz_shuguang_count || 0;
                if (player.storage.gz_shuguang_done) return "已觉醒";
                return "体力变化累计：" + count + "点（需要超过6点）";
            },
        },
        "_priority": 0,
    },
    //核试验旗舰 - 限定技，弃5牌对全场造成伤害
    gz_heshiyan: {
        audio: false,
        nobracket: true,
        enable: "phaseUse",
        limited: true,
        unique: true,
        mark: true,
        skillAnimation: true,
        animationColor: "fire",
        filter: function (event, player) {
            if (!player.hasSkill("gz_heshiyan")) return false;
            return player.countCards("he") >= 5;
        },
        content: function () {
            "step 0"
            player.chooseToDiscard(5, "he", true, "核试验旗舰：弃置5张牌").set("ai", function (card) {
                return 8 - get.value(card);
            });
            "step 1"
            if (!result.bool) {
                event.finish();
                return;
            }
            player.awakenSkill("gz_heshiyan");
            event.baseDamage = 2;
            event.immunePlayers = [];
            //询问其他同势力角色是否响应
            event.mnPlayers = game.filterPlayer(function (current) {
                return current != player && current.group == player.group&& current.countCards('h') >= 2;
            });
            event.mnIndex = 0;
            "step 2"
            if (event.mnIndex >= event.mnPlayers.length) {
                event.goto(4);
                return;
            }
            var target = event.mnPlayers[event.mnIndex];
            var expectedDmg = event.baseDamage + event.immunePlayers.length + 1;
            target.chooseToDiscard(2, "h", '核试验旗舰：是否弃置2张手牌，令伤害+1并免疫此伤害？').set("expectedDamage", expectedDmg).set("ai", function (card) {
                var damage = _status.event.expectedDamage;
                var target = _status.event.player;
                if (target.hp <= damage) return 10 - get.value(card);
                if (damage >= 3) return 8 - get.value(card);
                return -1;
            });
            "step 3"
            if (result.bool) {
                var target = event.mnPlayers[event.mnIndex];
                event.immunePlayers.push(target);
                event.baseDamage++;
                game.log(target, "响应了核试验旗舰，伤害+1");
            }
            event.mnIndex++;
            event.goto(2);
            "step 4"
            //对全场造成伤害
            event.totalDamage = event.baseDamage;
            event.damageTargets = game.filterPlayer(function (current) {
                return !event.immunePlayers.includes(current);
            });
            event.dmgIndex = 0;
            game.log(player, "发动了核试验旗舰，造成", event.totalDamage, "点伤害");
            "step 5"
            if (event.dmgIndex >= event.damageTargets.length) {
                event.finish();
                return;
            }
            player.line(event.damageTargets[event.dmgIndex], "fire");
            event.damageTargets[event.dmgIndex].damage(event.totalDamage, player);
            "step 6"
            event.dmgIndex++;
            event.goto(5);
        },
        ai: {
            order: 1,
            result: {
                player: function (player) {
                    var enemies = 0, allies = 0;
                    game.countPlayer(function (current) {
                        if (current == player) return;
                        if (get.attitude(player, current) < 0) enemies++;
                        else if (get.attitude(player, current) > 0) allies++;
                    });
                    if (enemies > allies + 1 && player.hp > 3) return 1;
                    return 0;
                },
            },
        },
        "_priority": 0,
    },
    // ===== 舰R国战专用改造技能 =====
    gz_sawohaizhan: {
        audio: 'ext:舰R牌将/audio/skill:true',
        group: ['gz_sawohaizhan_thunder', 'gz_sawohaizhan_zhiji', 'gz_sawohaizhan_directhit'],
    },
    gz_sawohaizhan_thunder: {
        enable: 'chooseToUse', usable: 1, position: 'hes',
        filterCard: card => get.color(card) == 'black',
        viewAs: { name: 'sha', nature: 'thunder' },
        viewAsFilter: player => player.countCards('hes', { color: 'black' }) > 0,
        prompt: '将一张黑色牌当【雷杀】使用',
        check: card => 4 - get.value(card),
        hiddenCard(player, name) { return name == 'sha' && player.countCards('hs', { color: 'black' }) > 0; },
    },
    gz_sawohaizhan_directhit: {
        trigger: { player: 'useCardToPlayered' }, forced: true, popup: false,
        filter(event) { return event.skill == 'gz_sawohaizhan_thunder' && event.target.isUnseen(2); },
        content() { trigger.directHit.add(trigger.target); },
    },
    gz_sawohaizhan_zhiji: {
        enable: 'phaseUse', usable: 1, position: 'hes',
        filterCard: { color: 'red' }, viewAs: { name: 'zhibi' },
        viewAsFilter: player => player.countCards('hes', { color: 'red' }) > 0,
        prompt: '将一张红色牌当【知己知彼】使用',
        check: card => 8 - get.value(card),
    },
    gz_tiaobangzuozhan: {
        enable: 'chooseToUse', usable: 1, position: 'h', filterCard: true, selectCard: 1,
        viewAs: { name: 'juedou', isCard: false },
        group: ['gz_tiaobangzuozhan_damage', 'gz_tiaobangzuozhan_self'],
    },
    gz_tiaobangzuozhan_damage: {
        trigger: { source: 'damageSource' }, forced: true, popup: false,
        filter(event, player) { var evt = event.getParent(); return evt.skill == 'gz_tiaobangzuozhan' && evt.player == player; },
        content() { player.gainPlayerCard(trigger.player, 'hej', true, 'visible'); },
    },
    gz_tiaobangzuozhan_self: {
        trigger: { player: 'damageBegin2' }, forced: true, popup: false,
        filter(event, player) { var evt = event.getParent(); return evt.skill == 'gz_tiaobangzuozhan' && evt.player == player && event.source && !event.source.isUnseen(0) && !event.source.isUnseen(1); },
        content() {
            'step 0'
            event.target = trigger.source;
            player.chooseControl('主将', '副将').set('prompt', '跳帮作战：令' + get.translation(event.target) + '暗置一张武将牌，防止此伤害').set('filterControl', control => control == '主将' ? !event.target.isUnseen(0) : !event.target.isUnseen(1));
            'step 1'
            event.target.hideCharacter(result.control == '主将' ? 0 : 1);
            trigger.cancel();
        },
    },
    gz_qingyeqingyeqing: {
        trigger: { target: 'useCardToTarget' },
        filter(event, player) { return event.player != player && event.targets && event.targets.length == 1; },
        content() {
            'step 0'
            player.chooseTarget('青叶青叶青：选择一名其他角色', (card, player, target) => target != player).set('ai', target => get.attitude(target, player));
            'step 1'
            if (!result.bool) return event.finish(); event.target = result.targets[0];
            if (event.target.isUnseen && !event.target.isUnseen() && event.target.group != player.group) player.chooseToDiscard('he', 1, true);
            else event.goto(3);
            'step 2'
            if (!result.bool) return event.finish();
            'step 3'
            event.target.chooseToDiscard('he', '弃置一张非基本牌，令此牌对' + get.translation(player) + '无效', card => get.type(card) != 'basic');
            'step 4'
            if (result.bool) { trigger.targets.length = 0; trigger.getParent().triggeredTargets2.length = 0; trigger.cancel(); }
        },
    },
    gz_qianxingtuxi: {
        mod: { attackFrom() { return 1; } }, trigger: { source: 'damageSource' }, forced: true,
        filter(event, player) { return !player.isPhaseUsing(); },
        content() { player.addTempSkill('dajiaoduguibi', 'roundStart'); trigger.player.addTempSkill('gz_qianxingtuxi_debuff', { player: 'phaseEnd' }); },
    },
    gz_qianxingtuxi_debuff: {
        usable: 1, trigger: { source: 'damageBegin1' }, forced: true,
        content() {
            'step 0'
            player.judge(card => get.suit(card) == 'spade' ? 1 : 0);
            'step 1'
            if (result.suit != 'spade') return;
            if (player.isUnseen && player.isUnseen(2)) player.addTempSkill('gz_qianxingtuxi_nohand', 'phaseEnd');
            else trigger.num--;
        },
    },
    gz_qianxingtuxi_nohand: { charlotte: true, mod: { cardEnabled2() { return false; }, cardRespondable() { return false; } } },
    gz_guishen: {
        trigger: { player: 'phaseUseBegin' }, forced: true,
        content() { game.filterPlayer(current => current != player && current.isUnseen && current.isUnseen(2)).forEach(current => current.addTempSkill('gz_guishen_fengyin', 'phaseUseEnd')); },
    },
    gz_guishen_fengyin: { charlotte: true, ai: { nomingzhi: true }, init(player, skill) { player.addSkillBlocker(skill); }, onremove(player, skill) { player.removeSkillBlocker(skill); }, skillBlocker(skill) { return !lib.skill[skill].charlotte; } },
    gz_sidajingang: {
        trigger: { source: 'damageSource' }, direct: true,
        filter(event, player) { return event.card && event.card.name == 'sha' && event.player.countCards('h') && player.countCards('h'); },
        content() {
            'step 0'
            player.chooseToPindian(trigger.player, '四大金刚：是否与其拼点？');
            'step 1'
            if (result.bool && result.winner == player) { player.gainPlayerCard(trigger.player, 'he', true); if (!player.isMajor()) player.gainPlayerCard(trigger.player, 'h', true); }
        },
    },
    gz_kelaosaiweici_R_lunzhan: {
        trigger: { player: 'phaseZhunbeiBegin' }, direct: true,
        content() {
            'step 0'
            event.num = game.countPlayer(current => current.group == player.group); if (event.num == 1) event.num *= 2;
            player.chooseControl('hand', 'damage').set('choiceList', ['观看并排列牌堆顶四张牌，本回合手牌上限+' + event.num, '本回合使用【杀】造成的伤害+1']);
            'step 1'
            if (result.control == 'damage') { player.addTempSkill('gz_kelaosaiweici_R_lunzhan_damage', 'phaseAfter'); return; }
            player.addTempSkill('gz_kelaosaiweici_R_lunzhan_hand', 'phaseAfter'); player.addMark('gz_kelaosaiweici_R_lunzhan_hand', event.num, false); player.chooseToGuanxing(4);
        },
    },
    gz_kelaosaiweici_R_lunzhan_hand: { charlotte: true, mark: true, intro: { content: '手牌上限+#' }, mod: { maxHandcard(player, num) { return num + player.countMark('gz_kelaosaiweici_R_lunzhan_hand'); } } },
    gz_kelaosaiweici_R_lunzhan_damage: { charlotte: true, trigger: { source: 'damageBegin1' }, forced: true, filter(event) { return event.card && event.card.name == 'sha'; }, content() { trigger.num++; } },
    gz_diwuzhandui: {
        trigger: { player: 'phaseZhunbeiBegin' }, direct: true,
        content() {
            'step 0'
            event.num = Math.min(3, game.countPlayer(current => current.group == player.group));
            if (!player.isMajor()) event.num++;
            event.cards = get.cards(event.num);
            game.cardsGotoOrdering(event.cards);
            player.chooseButton(['第五战队', event.cards], false).set('filterButton', button => player.hasUseTarget(button.link));
            'step 1'
            if (result.bool) player.chooseUseTarget(result.links[0], true);
        },
    },
    gz_bigseven: {
        trigger: { player: 'useCardToPlayered' }, direct: true,
        filter(event) { return event.targets.length == 1 && (get.type(event.card) == 'basic' || get.type(event.card) == 'trick'); },
        content() {
            'step 0'
            event.cardtype = get.type(trigger.card);
            player.judge(card => get.type(card) == event.cardtype ? 1 : 0);
            'step 1'
            if (result.judge <= 0) return event.finish();
            event.max = player.isMajor() ? 3 : 2;
            player.chooseTarget([0, event.max - 1], '为' + get.translation(trigger.card) + '增加目标', (card, player, target) => !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target));
            'step 2'
            if (result.bool) trigger.targets.addArray(result.targets);
            if (!player.isMajor()) trigger.getParent().baseDamage = (trigger.getParent().baseDamage || 1) + 1;
        },
    },
    gz_lizhengshangyou: { trigger: { player: 'phaseDrawBegin2' }, forced: true, filter(event) { return !event.numFixed; }, content() { trigger.num += game.countPlayer(current => current.group == player.group) * 2; } },
    gz_nanshagonchen: { trigger: { player: 'useCardToTargeted' }, direct: true, filter(event) { return event.card && (event.card.name == 'sha' || event.card.name == 'sheji9'); }, content() { var num = game.countPlayer(current => current.group == player.group); if (num >= 2) player.draw(); if (num >= 3) { trigger.target.addTempSkill('qinggang2'); trigger.target.storage.qinggang2.add(trigger.card); } if (num >= 4) trigger.getParent().baseDamage = (trigger.getParent().baseDamage || 1) + 1; } },
    gz_yuleizhantujin: {
        enable: 'phaseUse', usable: 1,
        filter(event, player) { return game.filterPlayer(current => current.group == player.group && current.hasSkill('quzhudd')).reduce((sum, current) => sum + current.countCards('e'), 0) > 0; },
        content() {
            'step 0'
            event.num = game.filterPlayer(current => current.group == player.group && current.hasSkill('quzhudd')).reduce((sum, current) => sum + current.countCards('e'), 0);
            event.cards = get.cards(event.num);
            game.cardsGotoOrdering(event.cards);
            player.showCards(event.cards);
            player.chooseTarget(true, '选择一名角色', (card, player, target) => target != player);
            'step 1'
            if (!result.bool) return event.finish();
            event.target = result.targets[0];
            event.cards.filter(card => get.type(card) == 'basic' && player.canUse(card, event.target, false)).forEach(card => player.useCard(card, event.target, false));
            event.cards.filter(card => get.type(card) == 'trick' && get.type2(card) != 'delay' && event.target.canUse(card, player, false)).forEach(card => event.target.useCard(card, player, false));
        },
    },
    gz_zhanxianfangyu: {
        trigger: { global: 'useCardToTarget' }, direct: true,
        filter(event, player) { return event.card.name == 'sha' && event.target != player && event.player != player && get.distance(player, event.target, 'pure') <= 1 && player.countCards('he'); },
        content() {
            'step 0'
            player.chooseToDiscard('he', 1, '弃置一张牌，代替其成为此【杀】的目标');
            'step 1'
            if (result.bool) { trigger.getParent().targets.remove(trigger.target); trigger.getParent().targets.push(player); }
        },
        group: 'gz_zhanxianfangyu_black',
    },
    gz_zhanxianfangyu_black: { trigger: { target: 'shaBefore' }, forced: true, usable: 1, filter(event, player) { return get.color(event.card) == 'black' && game.hasPlayer(current => current.hasSkill('gz_zhanxianfangyu') && current.inline(player)); }, content() { trigger.cancel(); } },
    gz_huhangyuanhu: {
        trigger: { global: 'useCardToTargeted' }, direct: true,
        filter(event, player) { return event.card.name == 'sha' && event.targets.length == 1 && event.target != player && event.target.inline(player); },
        content() {
            'step 0'
            player.draw();
            player.chooseCard('he', true, '交给' + get.translation(trigger.target) + '一张牌');
            'step 1'
            player.give(result.cards, trigger.target);
            if (get.distance(player, trigger.target, 'pure') <= 1) player.draw();
            trigger.getParent().targets.remove(trigger.target);
            trigger.getParent().targets.push(player);
        },
    },
    gz_zhongbangtuxi: { limited: true, enable: 'phaseUse', selectCard: [1, Infinity], filterCard: { color: 'red' }, selectTarget() { return ui.selected.cards.length; }, filterTarget: true, multitarget: true, content() { player.awakenSkill('gz_zhongbangtuxi'); targets.forEach(target => target.damage(player.siege(target) ? 2 : 1, 'fire', player)); } },
    gz_qiangxingzhencha: {
        trigger: { global: 'phaseJieshuBegin' }, direct: true,
        filter(event, player) { return event.player != player && event.player.countCards('h'); },
        content() {
            'step 0'
            event.targets = player.sieged() ? game.filterPlayer(current => current.siege(player)) : [trigger.player];
            event.targets.forEach(target => target.showHandcards());
            event.index = 0;
            'step 1'
            if (event.index >= event.targets.length) return event.finish();
            event.target = event.targets[event.index];
            if (player.sieged()) player.gainPlayerCard(event.target, 'h', true);
            'step 2'
            event.target.chooseToUse('可以对' + get.translation(player) + '使用一张无距离限制的【杀】', { name: 'sha' }, player, -1).set('nodistance', true);
            'step 3'
            event.index++;
            event.goto(1);
        },
    },
};

export { guozhanskills };
