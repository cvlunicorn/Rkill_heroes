import { lib, game, get, ui, _status } from "../../../noname.js";
const fallendemon = {
    /* pachina_R_xinao: {
               nobracket: true,
               audio: "ext:舰R牌将/audio/skill:true",
               trigger: {
                   player: "damageEnd",
               },
               init: function (player) {
                   if (!player.storage.pachina_R_xinao) player.storage.pachina_R_xinao = [];
               },
               check: function (event, player) {
                   //if (player.countCards("h", { tag: "recover" }) < 0) { return player.hp <= 2; }
                   return player.isDamaged() && Math.floor(player.countCards("h") / 2) < (player.maxHp - player.hp);
               },
               filter: function (event, player) {
                   return player.countCards("h");
               },
               content: function () {
                   "step 0"
                   player.chooseCardTarget({
                       prompt: get.prompt("pachina_R_xinao"),
                       position: "h",
                       selectCard: [1, Infinity],
                       filterTarget: function (card, player, target) {
                           return player != target && !player.storage.pachina_R_xinao.some(arr => arr.includes(target));
                       },
                       filterCard: function (card, player) {
                           return true;
                       },
                       ai1: function (card) {
                           return 9 - get.value(card);
                       },
                       ai2: function (target) {
                           let player = _status.event.player;
                           if (player.hp <= 2) return get.attitude(player, target) + 2;
                           return get.attitude(player, target) - 1;
                       },
                   });
                   "step 1"
                   if (result.bool) {
                       var target = result.targets[0];
                       var cards = result.cards;
                       var num = cards.length;
                       player.give(cards, target);
                       player.storage.pachina_R_xinao.push([target, num]);
                       player.turnOver();
                       player.recover(Math.floor(num / 2));
                       player.addTempSkill("zhuangjiafh", { player: "phaseBegin" });
                   }
               },
               ai: {
                   "maixie_defend": true,
                   effect: {
                       target: function (card, player, target) {
                           if (player.countCards("he") > 1 && get.tag(card, "damage")) {
                               if (player.hasSkillTag("jueqing", false, target)) return [1, -1.5];
                               if (target.hp <= 1) return;
                               if (!target.hasFriend()) return;
                               if (get.attitude(target, player) < 0 && target.countCards("h") >= 1) return [1, 1];
                           }
                       },
                   },
               },
               group: ["pachina_R_xinao_back"],
               subSkill: {
                   back: {
                       nobracket: true,
                       audio: "ext:舰R牌将/audio/skill:true",
                       trigger: {
                           player: "phaseUseBegin",
                       },
                       frequent: true,
                       filter: function (event, player) {
                           if (player.storage.pachina_R_xinao != []) {
                               for (var i = 0; i < player.storage.pachina_R_xinao.length; i++) {
                                   if (player.storage.pachina_R_xinao[i][0].isAlive) return true;
                               }
                           }
                           return false;
                       },
                       content: function () {
                           "step 0";
                           event.count = 0;
                           "step 1";
                           if (player.storage.pachina_R_xinao[event.count][0].isAlive) {
                               event.targets0 = player.storage.pachina_R_xinao[event.count][0];
                               event.num = Math.min(event.targets0.countCards("he"), player.storage.pachina_R_xinao[event.count][1]);
                               event.targets0.chooseCard('he', true, event.num, '交给' + get.translation(player) + event.num + '张牌').set('ai', function (card) {
                                   var attitude = get.attitude(event.targets0, player);
                                   if (attitude <= 0) return -get.value(card);
                                   return get.value(card, player);
                               });
                           }
                           "step 2";
                           if (result.bool && event.targets0) {
                               event.targets0.give(result.cards, player);
                           }
                           event.count++;
                           if (event.count < player.storage.pachina_R_xinao.length) { event.goto(1); }
                           "step 3";
                           player.storage.pachina_R_xinao = [];
                       },
                   },
               },
           }, */
    pachina_R_xinao: {
        audio: 2,
        name: "嬉闹",
        trigger: {
            player: "damageEnd",
        },
        filter: function (event, player) {
            return player.countCards('h') > 0;
        },
        direct: true,
        content: function () {
            'step 0'
            // 初始化嬉闹对象存储
            if (!player.storage.pachina_R_xinao) {
                player.storage.pachina_R_xinao = [];
            }

            // 获取可以选择的玩家（不包括自己）
            var availableTargets = game.filterPlayer(function (current) {
                return current != player && current.isAlive();
            });

            // 如果没有可选目标,则结束
            if (availableTargets.length === 0) {
                event.finish();
                return;
            }

            player.chooseCardTarget({
                prompt: "是否发动【嬉闹】？",
                prompt2: "你可以将任意张手牌交给一名其他角色并记录其为嬉闹对象,然后你翻面。若如此做,你回复X点体力并暂时获得装甲效果。(X为你交出的手牌数/2向下取整)",
                selectCard: [1, Infinity],
                filterCard: true,
                filterTarget: function (card, player, target) {
                    return player != target && target.isAlive();
                },
                ai1: function (card) {
                    var player = _status.event.player;
                    var target = ui.selected.targets ? ui.selected.targets[0] : null;

                    if (!target) return 6 - get.value(card);

                    // AI逻辑：根据目标身份决定给牌策略
                    var attitude = get.attitude(player, target);

                    if (attitude > 0) {
                        return get.effect(target, card, player, player);
                    } else {
                        return 6 - get.value(card);
                    }
                },
                ai2: function (target) {
                    var player = _status.event.player;
                    var attitude = get.attitude(player, target);
                    var isAlreadyMarked = player.storage.pachina_R_xinao &&
                        player.storage.pachina_R_xinao.includes(target.name);

                    // 如果目标已标记,优先选择其他目标
                    if (isAlreadyMarked) {
                        return attitude - 1;
                    }

                    // 优先选择未标记的敌人
                    if (attitude <= 0) return 2;
                    // 其次选择队友传牌
                    return attitude;
                }
            });

            'step 1'
            if (result.bool) {
                var target = result.targets[0];
                var cards = result.cards;
                // 记录嬉闹对象（如果未记录过）
                if (player.storage.pachina_R_xinao && !player.storage.pachina_R_xinao.includes(target)) {
                    player.storage.pachina_R_xinao.push(target);
                } else if (!player.storage.pachina_R_xinao) {
                    player.storage.pachina_R_xinao = [target];
                }

                // 给牌
                target.gain(cards, player, 'giveAuto');

                // 翻面
                player.turnOver();

                // 回复体力
                var healNum = Math.floor(cards.length / 2);
                if (healNum > 0) {
                    player.recover(healNum);
                }

                // 获得装甲效果（直到下回合开始）
                //player.addTempSkill("zhuangjiafh", { player: "phaseBegin" });
            }
        },
        mark: true,
        intro: {
            content: function (storage, player) {
                if (!player.storage.pachina_R_xinao || player.storage.pachina_R_xinao.length === 0) {
                    return '无嬉闹对象';
                }
                return '嬉闹对象：' + get.translation(player.storage.pachina_R_xinao);
            }
        },
        ai: {
            maixie_defend: true,
            effect: {
                target: function (card, player, target) {
                    if (player.countCards('he') > 1 && get.tag(card, 'damage')) {
                        if (player.hasSkillTag('jueqing', false, target)) return [1, -1.5];
                        if (get.attitude(target, player) < 0) return [1, 1];
                    }
                }
            }
        },
        group: ["pachina_R_xinao_steal"],
        subSkill: {
            steal: {
                name: "嬉闹窃取",
                trigger: {
                    player: "turnOverAfter",
                },
                filter: function (event, player) {
                    if (player.storage.pachina_R_xinao) {
                        for (var i = 0; i < player.storage.pachina_R_xinao.length; i++) {
                            if (player.storage.pachina_R_xinao[i].isAlive && player.storage.pachina_R_xinao[i].countCards("hej")) return true;
                        }
                    }
                    return false;
                },
                content: function () {
                    'step 0'
                    if (player.storage.pachina_R_xinao.length === 0) {
                        event.finish();
                        return;
                    }

                    // 如果只有一个对象,直接选择
                    if (player.storage.pachina_R_xinao.length === 1) {
                        event.selectedTarget = player.storage.pachina_R_xinao;
                        event.goto(2);
                    } else {
                        // 让玩家选择一个嬉闹对象
                        player.chooseTarget("请选择一名嬉闹对象,获得其区域内的一张牌", 1, function (card, player, target) {
                            return target != player && player.storage.pachina_R_xinao.includes(target);
                        })
                            .set('ai', function (target) {
                                var attitude = get.attitude(player, target);
                                return -attitude;
                            });
                    }

                    'step 1'
                    if (result.bool) {
                        event.selectedTarget = result.targets;
                    } else {
                        event.finish();
                        return;
                    }

                    'step 2'
                    // 从选择的嬉闹对象处获得一张牌
                    if (event.selectedTarget) {
                        player.gainPlayerCard(event.selectedTarget[0], 'hej', true);
                        game.log(player, '从', event.selectedTarget[0], '处获得了一张牌');
                    }
                }
            }
        },
    },
    loki_R_xiance: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        round: 1,
        init: function (player) {
            player.storage.loki_R_xiance = [];
            player.storage.loki_R_xiance2 = [];
            player.storage.loki_R_xiance2.push(player);
        },
        trigger: {
            global: "phaseUseBegin",
        },
        filter: function (event, player) {
            return event.player != player && player.countCards("hes") >= 2;
        },
        logTarget: "player",
        check: function (event, player) {
            if (get.attitude(player, event.player) < 4 && event.player.countCards("h") > 4) return false;
            if (get.attitude(player, event.player) > 4 && player.isDamaged() && event.player.hp > 1) return true;
            if (player.hp < 2 && player.countCards("h") < 4) return false;
            return true;
        },
        content: function () {
            "step 0";
            if (get.mode() !== "identity" || player.identity !== "nei") player.addExpose(0.2);
            "step 1";
            player.chooseCard(2, "he", false, "交给" + get.translation(trigger.player) + "两张牌").set("ai", function (card) {
                return 8 - get.value(card);
            });
            "step 2";
            if (result.bool) {
                player.give(result.cards, trigger.player);
                if (!trigger.player.hasSkill("loki_R_xiance2")) {
                    trigger.player.addTempSkill("loki_R_xiance2", { global: "phaseEnd" });
                }
                trigger.player.storage.loki_R_xiance2 = [];
                trigger.player.storage.loki_R_xiance2.push(player);

                if (!trigger.player.hasSkill("loki_R_xiance4")) {
                    trigger.player.addSkill("loki_R_xiance4");
                }
                trigger.player.storage.loki_R_xiance4 = [];
                trigger.player.storage.loki_R_xiance4.push(player);
            }
        },
        group: ["loki_R_xiance2"],
        ai: {
            threaten: 1.4,
        },
    },
    loki_R_xiance2: {
        enable: "phaseUse",
        usable: 1,
        filter: function (event, player) {
            if (!player.getStorage('loki_R_xiance2') || player.getStorage('loki_R_xiance2').length == 0 || !player.getStorage('loki_R_xiance2')[0].isAlive()) { return false; }
            if (player.countCards("h") >= 2) {
                for (var i of lib.inpile) {
                    var type = get.type(i);
                    if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) return true;
                }
            }
            return false;
        },
        chooseButton: {
            dialog: function (event, player) {
                var list = [];
                for (var i = 0; i < lib.inpile.length; i++) {
                    var name = lib.inpile[i];
                    var loki_R_xiancePlayer = player.getStorage('loki_R_xiance2');
                    if (loki_R_xiancePlayer[0].getStorage('loki_R_xiance').includes(name)) { continue; }
                    if (name == "sha") {
                        if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", "sha"]);
                        for (var nature of lib.inpile_nature) {
                            if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) list.push(["基本", "", "sha", nature]);
                        }
                    } else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["锦囊", "", name]);
                    else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", name]);
                }
                return ui.create.dialog("献策", [list, "vcard"]);
            },
            check: function (button) {
                if (_status.event.getParent().type != "phase") return 1;
                var player = get.player();
                if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) return 0;
                return player.getUseValue({
                    name: button.link[2],
                    nature: button.link[3],
                });
            },
            backup: function (links, player) {
                return {
                    viewAs: {
                        name: links[0][2],
                        nature: links[0][3],
                        isCard: false,
                    },
                    filterCard: true,
                    selectCard: 2,
                    audio: "loki_R_xiance2",
                    popname: true,
                    check: function (card) {
                        return 8 - get.value(card);
                    },
                    position: "h",
                    onuse: function (result, player) {
                        var loki_R_xiancePlayer = player.getStorage('loki_R_xiance2');
                        if (loki_R_xiancePlayer[0].isAlive()) {
                            loki_R_xiancePlayer[0].markAuto('loki_R_xiance', result.card.name);
                        }
                    },
                };
            },
            prompt: function (links, player) {
                return "将两张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
            },
        },
        hiddenCard: function (player, name) {
            if (!lib.inpile.includes(name)) return false;
            var type = get.type(name);
            return (type == "basic" || type == "trick") && player.countCards("h") > 0 && !player.hasSkill("loki_R_xiance2");
        },
        ai: {
            fireAttack: true,
            skillTagFilter: function (player) {
                if (player.countCards("h") < 2) return false;
            },
            order: 1,
            result: {
                player: function (player) {
                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                    return 1;
                },
            },
        },
        "_priority": 0,
    },
    loki_R_xiance3: {
        trigger: {
            source: "dieAfter",
        },
        forced: true,
        audio: false,
        content: function () {
            player.removeSkill("loki_R_xiance4");
        },
        "_priority": 0,
    },
    loki_R_xiance4: {
        trigger: {
            player: "phaseUseEnd",
        },
        forced: true,
        audio: false,
        onremove: true,
        init: function (player, skill) {
            if (!player.storage[skill]) player.storage[skill] = [];
        },
        charlotte: true,
        content: function () {
            while (player.storage.loki_R_xiance4.length) {
                var current = player.storage.loki_R_xiance4.shift();
                if (current.isDead()) continue;
                current.logSkill("loki_R_xiance");
                /* current.gainPlayerCard(player, 'ej', [1, 2], 'visible').set('ai', function (card) {
                    if (get.type(card) == "delay") return 1;
                    return -get.value(card);
                }); */
                player.damage(current, "nocard");
            }
            player.removeSkill("loki_R_xiance4");
        },
        group: "loki_R_xiance3",
        "_priority": 0,
    },
    southdakota_R_gumei: {
        global: ["southdakota_R_gumei_phaseUse"],
        nobracket: true,
        init: function (player) {
            player.storage.southdakota_R_gumei = false;
        },
        trigger: {
            source: "damageSource",
        },
        forced: true,
        filter: function (event, player) {
            var evt = event.getParent("southdakota_R_gumei_phaseUse");
            return evt && evt.name == "southdakota_R_gumei_phaseUse" && evt.targets[1] == player;
        },
        content: function () {

            if (typeof player.storage.southdakota_R_gumei === 'undefined') player.storage.southdakota_R_gumei = false;
            player.storage.southdakota_R_gumei = true;
        },
        group: ["southdakota_R_gumei_reflash"],
        subSkill: {
            reflash: {
                trigger: {
                    player: ["phaseZhunbeiBegin"],
                },
                forced: true,
                filter: function (event, player) {
                    return player.storage.southdakota_R_gumei == true;
                },
                content: function () {
                    player.storage.southdakota_R_gumei = false;
                },
                sub: true,
                "_priority": 0,
            },
        },
    },
    southdakota_R_gumei_phaseUse: {
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        usable: 1,
        selectCard: 1,
        filterCard: true,
        position: "h",
        check(card) {
            return 10 - get.value(card);
        },
        discard: false,
        lose: false,
        targetprompt: ["决斗目标", "获得牌"],
        selectTarget: 2,
        multitarget: true,
        filterTarget: function (card, player, target) {
            if (ui.selected.targets.length == 1) {
                return (target.hasSkill("southdakota_R_gumei") && target.getStorage('southdakota_R_gumei') != true) && target.canUse({ name: "juedou" }, ui.selected.targets[0]);
            }
            return true;
        },
        filter: function (event, player) {
            if (player.hasSkill("southdakota_R_gumei") || (!player.countCards("h"))) { return false; }
            return game.countPlayer(current => current != player && current.hasSkill("southdakota_R_gumei") && current.getStorage('southdakota_R_gumei') != true) >= 1;
        },
        content: function () {
            player.give(cards[0], event.targets[1]);
            event.targets[1].useCard({ name: "juedou", isCard: true }, event.targets[0], "noai");
        },
        ai: {
            order: 8,
            result: {
                target(player, target) {
                    if (ui.selected.targets.length == 0) {
                        return -3;
                    } else {
                        return get.effect(target, { name: "juedou" }, ui.selected.targets[0], target);
                    }
                },
            },
        },
    },
    southdakota_R_jianmiemoshi: {
        nobracket: true,
        direct: true,
        trigger: {
            player: "useCard",
        },
        direct: true,
        filter(event, player) {
            return (
                player.getHistory("lose", function (evt) {
                    if (evt.getParent() != event) return false;
                    for (var i in evt.gaintag_map) {
                        if (evt.gaintag_map[i].includes("southdakota_R_jianmiemoshi")) return false;
                    }
                    return true;
                }).length > 0
            );
        },
        preHidden: true,
        async content(event, trigger, player) {
            trigger.nowuxie = true;
            trigger.directHit.addArray(game.players);
        },
        group: ["southdakota_R_jianmiemoshi_end"],
        subSkill: {
            end: {
                trigger: {
                    player: "phaseEnd",
                },
                direct: true,
                content: function () {
                    player.addGaintag(player.getCards("h"), "southdakota_R_jianmiemoshi");
                },
            },
        },
        ai: {
            threaten: 1.5,
            "directHit_ai": true,
        },
        "_priority": 0,
    },
    southdakota_R_zhaopin: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        skillAnimation: true,
        animationColor: "thunder",
        trigger: {
            player: "dying",
        },
        zhuSkill: true,
        filter: function (event, player) {
            if (player.hp > 0) return false;
            if (!player.hasZhuSkill("southdakota_R_zhaopin")) return false;
            return true;
        },
        mark: true,
        unique: true,
        limited: true,
        check(event, player) {
            return true;
        },
        content: function () {
            "step 0";
            player.awakenSkill("southdakota_R_zhaopin");
            player.discard(player.getCards("hej"));
            var targets = game.filterPlayer();
            targets.remove(player);
            event.targets = targets;
            "step 1";
            if (event.targets.length) {
                var current = event.targets.shift();
                current
                    .chooseBool("是否与" + get.translation(player) + "互换身份牌,成为主公？")
                    .set("ai", function () {
                        return get.attitude(_status.event.player, _status.event.target) > 2;
                    })
                    .set("target", player);
                event.current = current;
            } else {
                event.goto(3);
            }
            "step 2";
            if (result.bool) {
                game.broadcastAll(
                    function (player, target, shown) {
                        var identity = player.identity;
                        player.identity = target.identity;
                        if (shown || player == game.me) {
                            player.setIdentity();
                        }
                        target.identity = identity;
                        if (identity == "zhu") {
                            delete player.isZhu;
                            game.zhu = target;
                            target.showIdentity();
                        }
                    },
                    player,
                    event.current,
                    event.current.identityShown
                );
                player.line(event.current, "green");
                event.current.gainMaxHp();
                event.current.recover();
                player.loseMaxHp();
                player.draw(4);
                player.recover(1 - player.hp);
            } else {
                if (event.targets.length) {
                    event.goto(1);
                }
            }

        },
        intro: {
            content: "limited",
        },
        init: (player, skill) => (player.storage[skill] = false),
        "_priority": 0,
    },


    sukhbaatar_R_rumeng: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        forced: true,
        direct: true,
        filter: function (event, player) {
            return (player.countCards("h") &&
                game.hasPlayer(function (current) {
                    return player.canCompare(current);
                })
            );
        },
        content: function () {
            "step 0";
            player.chooseTarget(true, get.prompt2("sukhbaatar_R_rumeng"), function (card, player, target) {
                return player.canCompare(target);
            }).set("ai", target => {
                return -get.attitude(player, target);
            });
            "step 1";
            if (result.bool) {
                player.chooseToCompare(result.targets[0]);
            }
        },
        group: ["sukhbaatar_R_rumeng_1"],
        subSkill: {
            1: {
                forced: true,
                trigger: {
                    global: "chooseToCompareBegin",
                },
                filter: function (event, player) {
                    if (!game.hasPlayer(function (current) {
                        return current.countCards("s", function (card) { return card.hasGaintag('junfu') });
                    })) { return false; }
                    if (player == event.player) return true;
                    if (event.targets) return event.targets.includes(player);
                    return player == event.target;
                },
                check: function (trigger, player) {
                    return true;
                },
                content: function () {
                    "step 0";
                    player.chooseTarget("获得一名角色的一张【军辅】牌", function (card, player, target) {
                        return target.countCards("s", function (card) { return card.hasGaintag('junfu') });
                    }).set("ai", target => {
                        return -get.attitude(player, target);
                    });
                    "step 1";
                    if (result.bool) {
                        event.targets0 = result.targets[0];
                        let cards = event.targets0.getCards("s", function (card) { return card.hasGaintag('junfu') });
                        player.chooseCardButton("获得一张【军辅】牌", true, cards).set('ai', function (button) {
                            return get.number(button.link);
                        }).set('selectButton', 1);
                    } else { event.finish(); }
                    "step 2";
                    if (result.bool) {
                        player.gain(result.links[0], "gain2");
                    }
                },
            },
        },
    },
    sukhbaatar_R_sudaren: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        mark: true,
        locked: false,
        zhuanhuanji: true,
        marktext: "☯",
        intro: {
            content(storage, player, skill) {
                if (player.storage.sukhbaatar_R_sudaren == true) return "你使用基本牌或普通锦囊牌时,可以弃置一张“军辅”牌让那张牌额外结算1次。";
                return "一名角色对你使用牌时,可以摸一张牌,并将一张手牌置于在武将牌上,视作“军辅”牌(至多五张)";
            },
        },
        group: ["sukhbaatar_R_sudaren_1", "sukhbaatar_R_sudaren_2", "sukhbaatar_R_sudaren_3"],
        subSkill: {
            "1": {
                prompt: "一名角色对你使用牌时,可以摸一张牌,并将一张手牌置于在武将牌上,视作“军辅”牌(至多五张)",
                audio: "ext:舰R牌将/audio/skill:true",
                trigger: {
                    target: "useCardToBefore",
                },
                direct: true,
                filter(event, player) {
                    if (player.storage.sukhbaatar_R_sudaren) return false;
                    if (player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length > 4) { return false; }
                    return true;
                },
                check: function (event, player) {
                    return 1;
                },
                content() {
                    'step 0'
                    //player.changeZhuanhuanji("sukhbaatar_R_sudaren");
                    trigger.player.draw(1);
                    if (!trigger.player.hasSkill("junfu_mark")) { trigger.player.addSkill("junfu_mark"); }

                    trigger.player.chooseCard('h', 1, '将一张手牌置于你的武将牌上,称为【军辅】', true).set('ai', function (card) {
                        var player = get.player();
                        if (ui.selected.cards.type == "equip") return -get.value(card);
                        return get.value(card);
                    });
                    'step 1'
                    if (result.bool) {
                        trigger.player.loseToSpecial(result.cards, 'junfu', trigger.player).visible = true;
                    }
                },
                sub: true,
                "_priority": 0,
            },
            "2": {
                trigger: {
                    player: "useCard",
                },
                filter(event, player) {
                    if (!player.storage.sukhbaatar_R_sudaren) return false;
                    return player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length > 0 && (get.type(event.card) == 'trick' || get.type(event.card) == "basic" && get.name(event.card) != "shan");
                },
                check: function (event, player) {
                    return 1;
                },
                content() {
                    "step 0";
                    var card1 = trigger.card;
                    player.chooseCardButton(get.prompt2('sukhbaatar_R_sudaren', player), player.getCards('s', function (card) { return card.hasGaintag('junfu') }), 1).set('ai', function (card) {
                        return get.value(_status.event.card1) - get.value(card);
                    }).set('card1', card1);
                    "step 1";
                    if (result.bool) {
                        //player.changeZhuanhuanji("sukhbaatar_R_sudaren");
                        player.logSkill("sukhbaatar_R_sudaren");
                        player.discard(result.links);
                        trigger.effectCount++;
                    }
                },
                sub: true,
                "_priority": 0,
            },
            3: {
                trigger: {
                    player: ["chooseToCompareAfter", "compareMultipleAfter"],
                    target: ["chooseToCompareAfter", "compareMultipleAfter"],
                },
                filter: function (event, player) {
                    if (event.preserve) return false;
                    return true;
                },
                direct: true,
                content: function () {
                    var win = false;
                    if (player == trigger.player) {
                        if (trigger.num1 > trigger.num2) {
                            win = true;
                        } else {
                            win = false;
                        }
                    } else {
                        if (trigger.num1 < trigger.num2) {
                            win = true;
                        } else {
                            win = false;
                        }
                    }
                    if ((player.storage.sukhbaatar_R_sudaren != true && win) || (player.storage.sukhbaatar_R_sudaren == true && !win)) player.changeZhuanhuanji("sukhbaatar_R_sudaren");
                },
            },
        },
        ai: {
            combo: "sukhbaatar_R_rumeng",
            threaten: 1.1,
        },
        "_priority": 0,
    },
    sukhbaatar_R_zuiqiang: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        forced: true,
        direct: true,
        trigger: {
            global: "damageBegin4",
        },
        filter: function (event, player) {
            if (!event.source || event.source != player || event.player == player) return false;
            return event.player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length <= 0 && event.num >= event.player.hp;
        },
        content: function () {
            "step 0";
            trigger.cancel();
            player.draw(1);
            player.chooseCard('h', 1, '将一张手牌置于其的武将牌上,称为【军辅】', true).set('ai', function (card) {
                return 9 - get.value(card);
            });
            "step 1";
            if (result.bool) {
                // player.addToExpansion(result.cards,player,'giveAuto').gaintag.add('junfu');player.update();
                player.loseToSpecial(result.cards, 'junfu', trigger.player).visible = true;
            }
        },
    },
    odin_R_ganggenier: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        direct: true,
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        filter: function (event, player) {
            return game.countPlayer(function (current) {
                return current.getCards('s', function (card) { return card.hasGaintag('junfu') }).length <= 0;
            });
        },
        content: function () {
            var targets = game.filterPlayer(function (current) {
                return current.getCards('s', function (card) { return card.hasGaintag('junfu') }).length <= 0;
            });
            var cardi = get.cards(targets.length);
            for (var i = 0; i < targets.length; i++) {
                if (!targets[i].hasSkill("junfu_mark")) {
                    targets[i].addSkill("junfu_mark");
                }
                targets[i].loseToSpecial([cardi[i]], 'junfu').visible = true;
            }

        },
        group: ["odin_R_ganggenier_1"],
        subSkill: {
            1: {
                nobracket: true,
                audio: "ext:舰R牌将/audio/skill:true",
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    return game.countPlayer(current => current.countCards('s', function (card) { return card.hasGaintag('junfu') })) > 1;
                },
                multitarget: true,
                selectTarget: 2,
                filterTarget: function (card, player, target) {
                    return target.countCards('s', function (card) { return card.hasGaintag('junfu') }) > 0;
                },
                content: function () {
                    "step 0";
                    if (targets.length > 1) {
                        event.i = 0;
                        event.suits = [];
                    } else { event.finish(); }
                    "step 1";
                    var cards = targets[event.i].getCards("s", function (card) { return card.hasGaintag('junfu') });
                    player.chooseCardButton("弃置" + get.translation(targets[event.i]) + "一张【军辅】牌", true, cards).set('ai', function (button) {
                        return get.value(button.link);
                    }).set('selectButton', 1);
                    "step 2";
                    var suit = get.suit(result.links[0]);
                    if (!event.suits.includes(suit)) { event.suits.push(suit); }
                    targets[event.i].discard(result.links[0]);
                    event.i++;
                    if (event.i < 2) { event.goto(1); }
                    "step 3";
                    var targets1 = game.filterPlayer(current => current != player);
                    for (target of targets1) {
                        target.addTempSkill("odin_R_ganggenier_ban", { global: "phaseEnd" });
                        target.markAuto("odin_R_ganggenier_ban", event.suits);
                    }
                },
                ai: {
                    order: 11,
                    result: {
                        target(player, target) {
                            return -1;
                        },
                    },
                    threaten: 1.2,
                },
            },
            ban: {
                onremove: true,
                charlotte: true,
                mod: {
                    cardEnabled: function (card, player) {
                        if (player.getStorage('odin_R_ganggenier_ban').includes(get.suit(card))) return false;
                    },
                    cardRespondable: function (card, player) {
                        if (player.getStorage('odin_R_ganggenier_ban').includes(get.suit(card))) return false;
                    },
                    cardSavable: function (card, player) {
                        if (player.getStorage('odin_R_ganggenier_ban').includes(get.suit(card))) return false;
                    },
                },
                mark: true,
                marktext: '封印',
                intro: {
                    content: '本回合内不能使用或打出$的牌',
                },
            },
        },
    },
    vestal_R_mowang: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            global: "dying",
        },
        frequent: true,
        filter: function (event, player) {
            return event.player.countCards('s', function (card) { return card.hasGaintag('junfu') }) > 0 || player.countCards('s', function (card) { return card.hasGaintag('junfu') }) > 0;
        },
        check: function (event, player) {
            return get.attitude(player, event.player) > 0;
        },
        content() {
            "step 0"
            var cards1 = player.getCards('s', function (card) { return card.hasGaintag('junfu'); });
            var cards2 = trigger.player.getCards('s', function (card) { return card.hasGaintag('junfu'); });
            cards1 = Array.isArray(cards1) ? cards1 : [];
            cards2 = Array.isArray(cards2) ? cards2 : [];
            if (player != trigger.player && cards1.length && cards2.length) {
                var chooseButton = player.chooseButton(1, ['弃置' + get.translation(player) + '的军辅牌,视为使用桃', cards1, '弃置' + get.translation(trigger.player) + '的军辅牌,视为使用桃', cards2]);

            } else if (cards1.length) {
                var chooseButton = player.chooseButton(1, ['弃置' + get.translation(player) + '的军辅牌,视为使用桃', cards1]);
            } else {
                var chooseButton = player.chooseButton(1, ['弃置' + get.translation(trigger.player) + '的军辅牌,视为使用桃', cards2]);
            }
            chooseButton.set('ai', button => {
                var card = button.link;
                return 7 - get.value(card);
            });
            "step 1"
            if (result.bool) {
                var card = { name: 'tao', iscard: true };
                player.loseToDiscardpile(result.links[0]);

                player.useCard(card, trigger.player, true);
            }

        },
        group: ["vestal_R_mowang1"],
    },
    vestal_R_mowang1: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            global: "dyingAfter",
        },
        frequent: true,
        filter: function (event, player) {
            return event.player.isAlive();
        },
        check: function (event, player) {
            return true;
        },
        content() {
            var choice;
            if (player.isDamaged() && get.recoverEffect(player) > 0 && (player.countCards('hs', function (card) {
                return card.name == 'sha' && player.hasValueTarget(card);
            }) >= player.getCardUsable('sha'))) {
                choice = 'recover_hp';
            }
            else {
                choice = 'draw_card';
            }
            var next = player.chooseDrawRecover('###' + get.prompt(event.name) + '###摸一张牌或回复1点体力').set('logSkill', event.name);
            next.set('choice', choice);
            next.set('ai', function () {
                return _status.event.getParent().choice;
            });
            next.setHiddenSkill('vestal_R_mowang1');

        },
    },

    bismarck_R_chajin: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            global: "drawEnd",
        },
        filter: function (event, player) {
            if (player.hasSkill("bismarck_R_chajin_tempBan")) return false;
            var skipEventList = ["phaseDraw", "_yuanhang_mopai", "_yuanhang_bingsimopai", "bahu"];
            if (skipEventList.includes(event.getParent().name)) return false;
            return event.player != player;
        },
        content() {
            "step 0";
            var suits = lib.suit.slice();
            suits.push('cancel2');
            player.chooseControl(suits)
                .set("ai", function () {
                    var suits = lib.suit.slice();
                    return suits.randomGet();
                })
                .set("prompt", get.prompt2("bismarck_R_chajin", trigger.player));
            "step 1";
            if (!result.control || result.control == "cancel2") { event.finish(); return; }
            event.suit = result.control;
            game.log(get.translation(player) + "声明了" + get.translation(result.control));
            player.chat("声明了" + get.translation(result.control));
            trigger.player.chooseCard('h', [0, Infinity], '交给' + get.translation(player) + '任意张手牌').set("ai", function (card) {
                var evt = _status.event.getParent();
                var player = get.player();
                var att = get.attitude(evt.player, player);
                if (att > 2 && evt.player.isDamaged() && get.tag(card, "recover")) return 10;
                if (att > 0) return 0;
                if (att <= 0 && player.countCards("h", function (card) { return get.suit(card) == event.suit; }) <= 0) { return 0 };
                if (att <= 0 && get.suit(card) == event.suit && ui.selected.cards.length < 2 && Math.random() > 0.6) { return 8.5 - get.value(card); }
                if (att <= 0 && get.suit(card) == event.suit && ui.selected.cards.length >= 2) { return 7 - get.value(card); }
                return 0;
            });
            "step 2";
            if (result.cards) { trigger.player.give(result.cards, player); }
            player.chooseControl(["doubts", "noDoubts"]).set("ai", function () {
                var player = get.player();
                var evt = _status.event.getTrigger();
                var att = get.attitude(player, evt.player);
                if (att >= 0) { return "noDoubts"; }
                if (player.hp < 2) { return "noDoubts"; }
                if (Math.random() < 0.4) { return "noDoubts"; }
                return "doubts";
            });
            "step 3";
            if (result.control && result.control == "doubts") {
                trigger.player.showHandcards();
            } else { event.finish(); return; }
            "step 4";
            if (trigger.player.countCards("h", function (card) { return get.suit(card) == event.suit; })) {
                var cards = trigger.player.getCards("h", function (card) { return get.suit(card) == event.suit; });
                player.gain(cards, trigger.player, "gain2");
                trigger.player.damage(player, "nocard");
            } else {
                player.loseHp(1);
                player.addTempSkill("bismarck_R_chajin_tempBan", { global: "roundStart" });
            }
        },
        ai: {
            threaten: 1.8,
        }
    },
    bismarck_R_chajin_tempBan: {
        mark: true,
        charlotte: true,
        marktext: "禁",
        intro: {
            content(storage, player, skill) {
                return "查禁失效";
            },
        },
    },
    bismarck_R_fanji: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "damageEnd",
        },
        filter(event, player) {
            return event.source != undefined;
        },
        check(event, player) {
            return get.attitude(player, event.source) <= 0;
        },
        direct: true,
        content(event, trigger, player) {
            var card = {
                name: "sha",
                isCard: true,
            };
            if (player.canUse(card, trigger.source, false)) {
                player.chooseToUse(function (card, player, event) {
                    if (get.name(card) != "sha") return false;
                    return lib.filter.filterCard.apply(this, arguments);
                }, "是否对" + get.translation(trigger.source) + "使用一张【杀】？")
                    .set("targetRequired", true)
                    .set("complexSelect", true)
                    .set("filterTarget", function (card, player, target) {
                        if (
                            target != _status.event.sourcex &&
                            !ui.selected.targets.includes(_status.event.sourcex)
                        )
                            return false;
                        return lib.filter.filterTarget.apply(this, arguments);
                    }).set("sourcex", trigger.source);
            }
        },
        ai: {
            "maixie_defend": true,
            effect: {
                target(card, player, target) {
                    if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
                    return 0.8;
                    // if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
                },
            },
        },
    },
    tirpitz_R_jinshu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            global: "roundStart",
        },
        init(player) {
            if (!player.storage.tirpitz_R_jinshu) return player.storage.tirpitz_R_jinshu = 0;
            if (!player.storage.tirpitz_R_jinshuSuit) return player.storage.tirpitz_R_jinshuSuit = "";
        },
        filter(event, player) {
            return player.countCards("h");
        },
        frequent: true,
        content() {
            "step 0"
            player.chooseCard(get.prompt2("tirpitz_R_jinshu")).set("ai", function (card) {
                var player = get.player();
                if (player.storage.tirpitz_R_jinshu >= 1) { return Math.random() + 1; }
                if (player.countCards("j") || player.countCards("h", function (card) {
                    return get.tag(card, 'damage') && get.type(card) == "trick" || get.type(card) == "equip";
                }) < 3) {
                    return Math.random() + 1;
                }
                return 0;
            });
            "step 1"
            if (result.bool) {
                player.showCards(result.cards[0]);
                if (player.storage.tirpitz_R_jinshu == 0) {
                    player.addTempSkill("tirpitz_R_jinshu_skip", { global: "roundStart" });
                }
                player.addTempSkill("tirpitz_R_jinshu_draw", { global: "roundStart" });
                player.storage.tirpitz_R_jinshuSuit = get.suit(result.cards[0]);
            }

        },
        subSkill: {
            skip: {
                mark: true,
                marktext: "禁书",
                charlotte: true,
                direct: true,
                onremove: true,
                intro: {
                    content(storage, player, skill) {
                        return "跳过本轮的出牌和弃牌阶段";
                    },
                },
                trigger: {
                    player: ["phaseUseBefore", "phaseDiscardBefore"],
                },
                filter(event, player) {
                    if (player.storage.tirpitz_R_jinshuSuit) return true;
                    return false;
                },
                async content(event, trigger, player) {
                    trigger.cancel();
                },
            },
            draw: {
                mark: true,
                marktext: "禁书",
                charlotte: true,
                onremove: true,
                intro: {
                    content(storage, player, skill) {
                        return get.translation(player.storage.tirpitz_R_jinshuSuit);
                    },
                },
                init: (player) => {
                    game.addGlobalSkill('lingce_global');
                },
                trigger: {
                    global: ["useCardAfter", "respond"],
                },
                filter: function (event, player) {
                    if (player.getStorage("tirpitz_R_jinshuSuit") == "") { return false; }
                    if (get.itemtype(event.cards) != 'cards') { return false; }
                    for (var i = 0; i < event.cards.length; i++) {
                        if (event.cards[i].isInPile()) {
                            return player.getStorage("tirpitz_R_jinshuSuit") == get.suit(event.cards[i], false);;
                        }
                    }
                    return false;
                },
                direct: true,
                content: function () {
                    player.draw(1);
                },

            },
            global: {
                ai: {
                    effect: {
                        player: (card, player, target) => {
                            let num = 0, nohave = true;
                            game.countPlayer(i => {
                                if (i.hasSkill('tirpitz_R_jinshu')) {
                                    nohave = false;
                                    if (i.isIn() && lib.skill.tirpitz_R_jinshu_draw.filter({ card: card }, i)) num += get.sgnAttitude(player, i);
                                }
                            }, true);
                            if (nohave) game.removeGlobalSkill('tirpitz_R_jinshu_global');
                            else return [1, 0.8 * num];
                        }
                    }
                }
            }
        },
        ai: {
            threaten: 2.1,
        },
    },
    tirpitz_R_chuanyue: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            global: "phaseZhunbeiBegin",
        },
        check: function (event, player) {
            return get.attitude(player, event.player) > 0;
        },
        filter: function (event, player) {
            return player != event.player && player.countCards("h");
        },
        content() {
            "step 0"
            player.chooseCard(get.prompt2("tirpitz_R_chuanyue")).set("ai", function (card) {
                var player = get.player();
                var evt = _status.event.player;
                return get.value(card, evt);
            });
            "step 1"
            if (result.bool) {
                player.give(result.cards[0], trigger.player);
                if (trigger.player.hasSkill("tirpitz_R_chuanyue_shadow")) {
                    trigger.player.addTempSkill("tirpitz_R_chuanyue_shadow", { global: "phaseEnd" });
                }
                if (!trigger.player.storage.tirpitz_R_chuanyue_shadow) { trigger.player.storage.tirpitz_R_chuanyue_shadow = []; }
                trigger.player.storage.tirpitz_R_chuanyue_shadow.push(get.suit(result.cards[0]));
            } else {
                event.finish();
                return;
            }

        },
        subSkill: {
            shadow: {
                marktext: "阅",
                onremove: true,
                init: function (player, skill) {
                    if (!player.storage[skill]) player.storage[skill] = [];
                },
                intro: {
                    content: function (storage, player) {
                        var str = "";
                        var shadow = player.getStorage("tirpitz_R_chuanyue_shadow")
                        for (var i = 0; i < shadow.length; i++) {
                            if (i > 0) str += get.translation(shadow[i]);
                        }
                        return str;
                    },
                },
                mod: {
                    cardDiscardable: function (card, player) {
                        var list = player.storage.tirpitz_R_chuanyue_shadow;
                        for (var i = 0; i < list.length; i++) {
                            if (list[i] == card.suit) return false;
                        }
                    },
                },
            },
        },

    },
    tirpitz_R_nvwangfugui: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        trigger: {
            global: "die",
        },
        unique: true,
        juexingji: true,
        forced: true,
        skillAnimation: true,
        animationColor: "gray",
        filter: function (event, player) {
            if (player.storage.tirpitz_R_nvwangfugui) return false;
            return player.hasSkill("tirpitz_R_nvwangfugui") && (event.player.name == "bisimai_R" || event.player.name == "bismarck_R");
        },
        content: function () {
            'step 0'
            player.awakenSkill('tirpitz_R_nvwangfugui');
            if (player.hasSkill("tirpitz_R_jinshu")) { player.storage.tirpitz_R_jinshu = 1; }
            'step 1'
            event.hp = player.hp;
            player.loseHp(player.hp - 1);
            'step 2'
            player.changeHujia(event.hp - 1);
            player.removeSkill('tirpitz_R_nvwangfugui');
        },
    },
    shuangzi: {
        nobracket: true,
        init: function (player) {
            if (typeof player.storage.shuangzi === 'undefined') player.storage.shuangzi = false;
        },
        audio: "ext:舰R牌将/audio/skill:true",
        zhuanhuanji: true,
        mark: true,
        marktext: "☯",
        frequent: true,
        intro: {
            content: function (storage, player, skill) {
                if (storage) return '你使用或打出锦囊牌时摸一张牌';
                return '你使用或打出基本牌时摸一张牌';
            },
        },
        trigger: {
            player: ["useCardAfter", "respond"],
        },
        filter: function (event, player) {
            if (typeof player.storage.shuangzi === 'undefined') player.storage.shuangzi = false;
            if (player.storage.shuangzi) {
                //game.log("阳");
                return (get.type(event.card) == 'trick' || get.type(event.card) == 'delay');
            } else {
                //game.log("阴");
                return (get.type(event.card) == 'basic');

            }

        },
        check(event, player) {
            return true;
        },
        content: function () {
            if (typeof player.storage.shuangzi === 'undefined') { player.storage.shuangzi = false; }
            player.storage.shuangzi = (!player.storage.shuangzi);
            player.draw(1);
        },
    },
    akagikaga_R_zongyu: {
        global: "akagikaga_R_zongyu_turnOver",
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        forced: true,
        enable: ["chooseToRespond", "chooseToUse"],
        filterCard: function (card) {
            return get.name(card) == "tao";
        },
        position: "he",
        viewAs: { name: "taoyuan" },
        viewAsFilter: function (player) {
            if (!player.countCards("he", { name: "tao" })) return false;
        },
        prompt: "将一张桃当桃园使用或打出",
        check: function (card) {
            return true;
        },
        mod: {
            cardUsable(card, player, num) {
                if (card.name == 'jiu' || card.name == 'zziqi9') return Infinity;
                if (card.name == 'tao' || card.name == 'kuaixiu9') return false;
            },
            cardEnabled(card, player) {
                if (card.name == 'tao' || card.name == 'kuaixiu9') return false;
            },
            cardSavable(card, player) {
                if (card.name == 'tao' || card.name == 'kuaixiu9') return false;
            },
        },
        ai: {
            skillTagFilter(player, tag, arg) {
                if (arg && arg.name == 'jiu') return true;
                return false;
            }
        },
    },
    zongyu_turnOver: {
        trigger: { target: 'useCardToTargeted', },
        popup: false,
        onremove: true,
        init: function (player) {
            if (typeof player.storage.akagikaga_R_zongyu_turnOver === 'undefined') player.storage.akagikaga_R_zongyu_turnOver = 0;
        },
        filter: function (event, player) {
            return event.card.name == "tao" || event.card.name == "jiu" || event.card.name == "taoyuan";
        },
        direct: true,
        charlotte: true,
        content() {
            "step 0"
            player.storage.akagikaga_R_zongyu_turnOver += 1;
            "step 1"
            if (player.storage.akagikaga_R_zongyu_turnOver >= player.hp) {
                player.turnOver();
                player.storage.akagikaga_R_zongyu_turnOver = 0;
            }
        },
        group: ["akagikaga_R_zongyu_turnOver1"],
    },
    akagikaga_R_zongyu_turnOver1: {
        trigger: { global: "roundStart", },
        popup: false,
        onremove: true,
        init: function (player) {
            if (typeof player.storage.akagikaga_R_zongyu_turnOver === 'undefined') player.storage.akagikaga_R_zongyu_turnOver = 0;
        },
        filter: function (event, player) {
            return true;
        },
        direct: true,
        charlotte: true,
        content() {
            player.storage.akagikaga_R_zongyu_turnOver = 0;
        },
    },
    savoy_R_xiuzhu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        usable: 1,
        selectTarget: 1,
        filter: function (event, player) {
            return player.countCards("h") > 0;
        },
        filterTarget: function (card, player, target) {
            return player.canCompare(target);
        },
        content: function () {
            "step 0"
            if (target) {
                player.chooseToCompare(target);
            } else {
                event.finish();
                return;
            }
            "step 1"
            if (result.bool) {
                var color = get.color(result.target, false);
                target.addTempSkill("savoy_R_xiuzhu_block", { global: "phaseEnd", });
                target.markAuto("savoy_R_xiuzhu_block", color);
            } else {
                var color = get.color(result.player, false);
                player.addTempSkill("savoy_R_xiuzhu_block", { global: "phaseEnd", });
                player.markAuto("savoy_R_xiuzhu_block", color);
            }
            if (get.number(result.player) + get.number(result.target) > 13) {
                player.recover();
                target.recover();
            }
        },
        ai: {
            order: 9,
            threaten: 1.1,
        },
        subSkill: {
            block: {
                mark: true,
                onremove: true,
                init: function (player) {
                    if (typeof player.storage.savoy_R_xiuzhu_block == "undefined") player.storage.savoy_R_xiuzhu_block = "";
                },
                charlotte: true,
                mod: {
                    cardUsable(card, player, num) {
                        if (card.color == player.storage.savoy_R_xiuzhu_block) return false;
                    },
                    cardEnabled(card, player) {
                        if (card.color == player.storage.savoy_R_xiuzhu_block) return false;
                    },
                    cardSavable(card, player) {
                        if (card.color == player.storage.savoy_R_xiuzhu_block) return false;
                    },
                    cardRespondable(card, player) {
                        if (card.color == player.storage.savoy_R_xiuzhu_block) return false;
                    },
                },
                sub: true,

            },
        },
    },
    savoy_R_wangong: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        skillAnimation: 'epic',
        animationColor: 'wood',
        juexingji: true,
        trigger: { player: 'phaseJieshuBegin' },
        forced: true,
        unique: true,
        audio: 2,
        filter(event, player) {
            return player.hp == player.maxHp;
        },
        content() {
            player.awakenSkill('savoy_R_wangong');
            player.addSkills('zhuangjiafh');
            player.addSkills('savoy_R_yaosaiqun');
        },
        derivation: ['savoy_R_yaosaiqun'],
    },
    savoy_R_yaosaiqun: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: { player: ['dying'] },
        content() {
            player.useSkill("savoy_R_xiuzhu");
        },
    },
    cassone_R_yibing: {
        nobracket: true,
        mark: true,
        zhuanhuanji: true,
        marktext: '☯',
        init: function (player) {
            if (typeof player.storage.cassone_R_yibing === "undefined") player.storage.cassone_R_yibing = 0;
        },
        intro: {
            content: function (storage) {
                if (storage) return '将其他角色场上一张牌移动到自己相应位置。';
                return '阳：将自己区域的一张牌移到其他角色相应位置。';
            },
        },
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: { player: 'compare', target: 'compare' },
        filter: function (event, player) {
            if (player.storage.cassone_R_yibing) {
                return game.countPlayer(function (current) { return current != player && current.countCards("ej") > 0; }) > 0;
            } else {
                return player.countCards("hej");
            }
        },
        content: function () {
            "step 0";
            if (player.storage.cassone_R_yibing == 0) {
                event._result = { bool: true, targets: [player], };
            } else {
                player
                    .chooseTarget("选择一名其他角色,将其场上一张牌移动到自己相应位置。", function (card, player, target) {
                        return target.countCards("ej", function (card) {
                            var js = target.getCards("j");
                            for (var i = 0; i < js.length; i++) {
                                if (player.canAddJudge(js[i])) return true;
                            }
                            if (player.isMin()) return false;
                            var es = target.getCards("e");
                            for (var i = 0; i < es.length; i++) {
                                if (player.canEquip(es[i])) return true;
                            }
                            return false;
                        });
                    })
                    .set("ai", function (target) {
                        var player = _status.event.player;
                        if (player.countCards("j")) return player == target ? 10 : 0.1;
                        return 6 - get.attitude(player, target);
                    });
            }
            "step 1";
            if (result.bool) {
                event.target0 = result.targets[0];
            } else { event.finish(); return; }
            if (player.storage.cassone_R_yibing && result.bool) {
                event._result = { bool: true, targets: [player], };
            } else if (result.bool) {
                player
                    .chooseTarget("请选择移动目标", true, function (card, player, target) {
                        if (target == player) return false;
                        var hs = player.getCards("h");
                        if (hs.length) return true;
                        var js = player.getCards("j");
                        for (var i = 0; i < js.length; i++) {
                            if (target.canAddJudge(js[i])) return true;
                        }
                        if (target.isMin()) return false;
                        var es = player.getCards("e");
                        for (var i = 0; i < es.length; i++) {
                            if (target.canEquip(es[i])) return true;
                        }
                        return false;
                    })
                    .set("card", event.card)
                    .set("ai", function (target) {
                        var player = _status.event.player;
                        var att = get.attitude(player, target);
                        var sgnatt = get.sgn(att);
                        var es = player.getCards("e");
                        var i;
                        for (i = 0; i < es.length; i++) {
                            if (sgnatt != 0 && get.sgn(get.effect(target, es[i], player, target)) == sgnatt && target.canEquip(es[i])) {
                                return Math.abs(att);
                            }
                        }
                        if (
                            i == es.length &&
                            (!player.countCards("j", function (card) {
                                return target.canAddJudge(card);
                            }) || att <= 0)
                        ) {
                            if (player.countCards("h") > 0) return att;
                            return 0;
                        }
                        return -att;
                    });
            } else event.finish();
            "step 2";
            if (result.bool) {
                event.target1 = result.targets[0];
            } else { event.finish(); return; }
            if (player.storage.cassone_R_yibing) {
                var es = event.target0.getCards("ej", function (card) {
                    return (player.canEquip(card) || player.canAddJudge(card));
                });
            } else {
                var es = player.getCards("hej", function (card) {
                    return game.hasPlayer(function (current) {
                        return current != player && (current.canEquip(card) || current.canAddJudge(card));
                    });
                });
            }
            if (es.length == 1) { event._result = { bool: true, links: es }; }
            else {
                player
                    .choosePlayerCard(
                        "hej",
                        true,
                        function (button) {
                            var player = _status.event.player;
                            var targets0 = _status.event.target0;
                            var targets1 = _status.event.target1;
                            if (get.attitude(player, targets0) > 0 && get.attitude(player, targets1) < 0) {
                                if (get.position(button.link) == "j") return 12;
                                if (get.value(button.link, targets0) < 0 && get.effect(targets1, button.link, player, targets1) > 0) return 10;
                                return 0;
                            } else {
                                if (get.position(button.link) == "j") return -10;
                                if (get.position(button.link) == "h") return 10;
                                return get.value(button.link) * get.effect(targets1, button.link, player, targets1);
                            }
                        },
                        event.target0
                    ).set('target0', event.target0).set('target1', event.target1)
                    .set("filterButton", function (button) {
                        var targets1 = _status.event.target1;
                        if (get.position(button.link) == "h") {
                            return true;
                        } else if (get.position(button.link) == "j") {
                            return targets1.canAddJudge(button.link);
                        } else {
                            return targets1.canEquip(button.link);
                        }
                    });
            }
            "step 3";
            if (result.bool) {
                event.card = result.links[0];
            } else { event.finish(); return; }
            event.target0.line(event.target1);
            if (get.position(event.card) == "h") event.target1.gain(event.card, event.target0, "giveAuto");
            else {
                event.target0.$give(event.card, event.target1, false);
                if (get.position(event.card) == "e") event.target1.equip(event.card);
                else if (event.card.viewAs) event.target1.addJudge({ name: event.card.viewAs }, [event.card]);
                else event.target1.addJudge(event.card);
            }
            game.log(event.target0, "的", get.position(event.card) == "h" ? "一张手牌" : event.card, "被移动给了", event.target1);
            player.changeZhuanhuanji('cassone_R_yibing');
        },
        group: ["cassone_R_yibing_number"],
        subSkill: {
            number: {
                direct: true,
                silent: true,
                trigger: { player: 'compare', target: 'compare' },
                filter: function (event, player) {
                    return player.getStorage('cassone_R_yibing') == 1;
                },
                content: function () {
                    game.log('拼点牌点数视为14-x');
                    trigger.num1 = 14 - trigger.num1;
                    trigger.num2 = 14 - trigger.num2;
                },
            },
        },
    },
    cassone_R_weizhuangqixi: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        usable: 1,
        selectTarget: 1,
        filter: function (event, player) {
            return player.countCards("h") > 0;
        },
        check: function (event, player) {
            return player.countCards("h") > 1;
        },
        filterTarget: function (card, player, target) {
            return player.canCompare(target);
        },
        content: function () {
            "step 0"
            player.chooseToCompare(target);
            "step 1"
            if (result.bool) {
                player.addTempSkill("cassone_R_weizhuangqixi_win");
                player.addTempSkill("cassone_R_weizhuangqixi_remove");
                player.markAuto("cassone_R_weizhuangqixi_win", target);
            } else {
                player.loseHp(1);
                player.addTempSkill("cassone_R_weizhuangqixi_lose");
                player.addTempSkill("cassone_R_weizhuangqixi_remove");
                player.markAuto("cassone_R_weizhuangqixi_lose", target);
            }
        },
        ai: {
            order: 10,
            threaten: 1.4,
            result: {
                player: function (player) {
                    if (player.hp < 2) return -100;
                    if (player.countCards('h', function (card) {
                        return get.tag(card, "damage");
                    }) > 0 && player.getHistory("useCard").length < 1) return 1;
                    var num = player.countCards('h');
                    if (num == 1) return -2;
                    if (num == 2) return -1;
                    return -0.7;
                },
                target: function (player, target) {
                    var num = target.countCards('h');
                    if (num == 1) return -1;
                    if (num == 2) return -0.7;
                    return -0.5
                },
            },
        },
        subSkill: {
            win: {
                charlotte: true,
                init: function (player, skill) {
                    if (!player.storage[skill]) player.storage[skill] = [];
                },
                mark: true,
                onremove: true,
                usable: 1,
                intro: {
                    content: "到$的距离视为1",
                },
                direct: true,
                mod: {
                    globalFrom: function (from, to) {
                        if (from.getStorage('cassone_R_weizhuangqixi_win').includes(to)) {
                            return -Infinity;
                        }
                    },
                },
                filter: function (event, player) {
                    return !event.getParent().directHit.includes(event.target) && player.getHistory('useCard', function (event) {
                        return event.cards && event.cards.length;
                    }).indexOf(event) == 0;
                },
                trigger: { player: 'useCardToPlayered' },
                filter(event, player) {
                    return player.getStorage('cassone_R_weizhuangqixi_win').includes(event.target);
                },
                logTarget: 'target',
                content(event, trigger, player) {
                    trigger.directHit.add(event.target);
                },
                ai: {
                    directHit_ai: true,
                },
            },
            lose: {
                charlotte: true,
                init: function (player, skill) {
                    if (!player.storage[skill]) player.storage[skill] = [];
                },
                mark: true,
                onremove: true,
                intro: {
                    content: "受到来自$的伤害后回复1点体力",
                },
                direct: true,
                trigger: { player: 'damageEnd' },
                filter: function (event, player) {
                    return event.source && player.getStorage('cassone_R_weizhuangqixi_lose').includes(event.source);
                },
                content: function () {
                    if (player.hp < player.maxHp) player.recover(1);
                },
                ai: {
                    maixie: true,
                },
            },
            remove: {
                charlotte: true,
                trigger: { global: "phaseEnd" },
                filter: function (event, player) {
                    return (player.getStorage('cassone_R_weizhuangqixi_win').includes(event.player) && player.hasSkill("cassone_R_weizhuangqixi_win")) || (player.getStorage('cassone_R_weizhuangqixi_lose').includes(event.player) && player.hasSkill("cassone_R_weizhuangqixi_lose"));
                },
                content: function () {
                    if (player.hasSkill("cassone_R_weizhuangqixi_win")) player.removeSkill("cassone_R_weizhuangqixi_win");
                    if (player.hasSkill("cassone_R_weizhuangqixi_lose")) player.removeSkill("cassone_R_weizhuangqixi_lose");
                },
            },
        },
    },
    Xfliegerkorps_R_piaobodeying: {
        nobracket: true,
        group: ["Xfliegerkorps_R_piaobodeying_gethangmucv", "Xfliegerkorps_R_piaobodeying_campare"],
        subSkill: {
            gethangmucv: {
                trigger: {
                    global: "gameStart",
                },
                frequent: true,
                content: function () {
                    player.addSkill("hangmucv");
                },
            },
            campare: {
                audio: "ext:舰R牌将/audio/skill:true",
                enable: "phaseUse",
                usable: 1,
                selectTarget: 1,
                filterTarget: function (card, player, target) {
                    return player.canCompare(target);
                },
                filter: function (event, player) {
                    return player.countCards("h") > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseToCompare(target);
                    "step 1"
                    if (result.bool) {
                        if (!player.hasSkill("Xfliegerkorps_R_piaobodeying_mark")) {
                            player.addSkill("Xfliegerkorps_R_piaobodeying_mark");
                        }
                        player.storage.Xfliegerkorps_R_piaobodeying_markplayer.push(player);
                        player.addMark("Xfliegerkorps_R_piaobodeying_mark", 1);
                        var count = 0;
                        for (var i of game.filterPlayer()) {
                            if (i.countMark("Xfliegerkorps_R_piaobodeying_mark") > 0) count += i.countMark("Xfliegerkorps_R_piaobodeying_mark");
                        }
                        player.draw(Math.min(3, count));
                    } else {
                        for (var i of game.filterPlayer()) {
                            if (i.countMark("Xfliegerkorps_R_piaobodeying_mark") > 0) {
                                i.removeMark(i.countMark("Xfliegerkorps_R_piaobodeying_mark"));
                            }
                            if (i.hasSkill("Xfliegerkorps_R_piaobodeying_mark")) {
                                i.storage.Xfliegerkorps_R_piaobodeying_markplayer = [];
                                i.removeSkill("Xfliegerkorps_R_piaobodeying_mark");
                            }
                        }
                        if (!target.hasSkill("Xfliegerkorps_R_piaobodeying_mark")) {
                            target.addSkill("Xfliegerkorps_R_piaobodeying_mark");
                        }
                        target.storage.Xfliegerkorps_R_piaobodeying_markplayer.push(player);
                        target.addMark("Xfliegerkorps_R_piaobodeying_mark", 1);
                    }
                },

            },
            die: {
                charlotte: true,
                trigger: { player: "die" },
                direct: true,
                forceDie: true,
                content: function () {
                    for (var i of game.filterPlayer()) {
                        if (i.countMark("Xfliegerkorps_R_piaobodeying_mark") > 0) i.removeMark(i.countMark("Xfliegerkorps_R_piaobodeying_mark"));
                        if (i.hasSkill("Xfliegerkorps_R_piaobodeying_mark")) {
                            i.storage.Xfliegerkorps_R_piaobodeying_markplayer = [];
                            i.removeSkill("Xfliegerkorps_R_piaobodeying_mark");
                        }
                    }
                },
            },
        },
    },
    Xfliegerkorps_R_piaobodeying_mark: {
        init: function (player, skill) {
            if (!player.storage.Xfliegerkorps_R_piaobodeying_markplayer) player.storage.Xfliegerkorps_R_piaobodeying_markplayer = [];
        },
        mark: true,
        marktext: "鹰",
        onremove: true,
        intro: {
            name: "鹰",
            content: function (storage, player) {
                if (player.hasSkill("Xfliegerkorps_R_piaobodeying")) { return "拥有" + player.countMark("Xfliegerkorps_R_piaobodeying_mark") + "枚鹰标记"; }
                if (player.hasSkill("hangmucv")) { return "拥有" + player.countMark("Xfliegerkorps_R_piaobodeying_mark") + "枚鹰标记,摸牌阶段摸牌数+1"; }
                return "拥有与" + get.translation(player.storage.Xfliegerkorps_R_piaobodeying_markplayer[0]) + "相同等级的航母";
            },
        },
        group: ["Xfliegerkorps_R_piaobodeying_mark_hangmucv", "Xfliegerkorps_R_piaobodeying_mark_yingzi"],
        subSkill: {
            hangmucv: {
                trigger: { player: "phaseUseBegin" },
                filter: function (event, player) {
                    return player.getStorage("player.storage.Xfliegerkorps_R_piaobodeying_markplayer").includes(player) && !player.hasSkill("hangmucv") && player.countCards('h') > 0;
                },
                frequent: true,
                content: function () {
                    "step 0"
                    var sourcePlayer = player.getStorage("player.storage.Xfliegerkorps_R_piaobodeying_markplayer");
                    if (sourcePlayer[0] && sourcePlayer[0].isAlive) {
                        var level = sourcePlayer[0].countMark('jinengup');
                    } else {
                        var level = 0;
                    }
                    if (level <= 0) {
                        player.chooseCardTarget({
                            prompt: "弃置任意张黑桃或梅花手牌,视为使用【万箭齐发】",
                            filterCard: { color: 'black' },
                            position: 'h',
                            selectCard: [1, Infinity],
                            selectTarget: [1, Infinity],
                            filterOk: function () {
                                return ui.selected.cards.length == ui.selected.targets.length;
                            },
                            filterTarget: function (card, player, target) {
                                return player.canUse({ name: 'wanjian' }, target);
                            },
                            ai1: function (card) {
                                return 9 - get.value(card);
                            },
                            ai2: function (target) {
                                return get.effect(target, { name: 'wanjian' }, player, player);
                            }

                        });
                    } else if (level == 1) {
                        player.chooseCardTarget({
                            prompt: "弃置任意张黑桃或梅花或红桃手牌,视为使用【万箭齐发】",
                            filterCard: { suit: ['spade', 'club', 'heart'] },
                            position: 'h',
                            selectCard: [1, Infinity],
                            selectTarget: [1, Infinity],
                            filterOk: function () {
                                return ui.selected.cards.length == ui.selected.targets.length;
                            },
                            filterTarget: function (card, player, target) {
                                return player.canUse({ name: 'wanjian' }, target);
                            },
                            ai1: function (card) {
                                return 9 - get.value(card);
                            },
                            ai2: function (target) {
                                return get.effect(target, { name: 'wanjian' }, player, player);
                            }
                        });
                    } else if (level >= 2) {
                        player.chooseCardTarget({
                            prompt: "弃置任意手牌,视为使用【万箭齐发】",
                            filterCard: true,
                            position: 'h',
                            selectCard: [1, Infinity],
                            selectTarget: [1, Infinity],
                            filterOk: function () {
                                return ui.selected.cards.length == ui.selected.targets.length;
                            },
                            filterTarget: function (card, player, target) {
                                return player.canUse({ name: 'wanjian' }, target);
                            },
                            ai1: function (card) {
                                return 9 - get.value(card);
                            },
                            ai2: function (target) {
                                return get.effect(target, { name: 'wanjian' }, player, player);
                            }
                        });
                    }
                    "step 1"
                    if (result.targets && result.targets.length > 0) {
                        player.useCard({ name: 'wanjian' }, result.cards, result.targets);
                    }
                },
                ai: {
                    basic: {
                        order: 8.5,
                        useful: 1,
                        value: 7,
                    },
                    wuxie: function (target, card, player, viewer) {
                        if (get.attitude(viewer, target) > 0 && target.countCards('h', 'shan')) {
                            if (!target.countCards('h') || target.hp == 1 || Math.random() < 0.7) return 0;
                        }
                    },
                    result: {
                        player: function (player) {
                            return 1;
                        },
                    },
                    tag: {
                        respond: 1,
                        respondShan: 1,
                        damage: 1,
                        multitarget: 1,
                        multineg: 1,
                        skillTagFilter(player, tag, arg) {
                            if (tag == 'respondShan' && arg == 'respond') return false;
                            return true;
                        },
                    },
                },
            },
            yingzi: {
                trigger: { player: 'phaseDrawBegin2' },
                preHidden: true,
                frequent: true,
                filter: function (event, player) {
                    return player.getStorage("player.storage.Xfliegerkorps_R_piaobodeying_markplayer").includes(player) && player.hasSkill("hangmucv") && !event.numFixed;
                },
                content: function () {
                    trigger.num++;
                },
                ai: {
                    threaten: 1.1
                },
            },
        },

    },
    shujuzaisheng: {
        getCheck(card, player) {
            // AI 只愿意把“亏得起”的黑桃牌转成过牌,因此先排除保命牌与最后的关键手牌。
            if (!player) return 0;
            if (get.tag(card, "save")) return 0;
            if (get.name(card, player) == "shan" && player.hp <= 2) return 0;
            if (get.position(card) == "h" && player.countCards("h") <= 1) return 0;
            var score = 5.5 - get.value(card, player);
            // 手牌较少时再额外压低评分,避免 AI 把节奏打空。
            if (get.position(card) == "h" && player.countCards("h") <= 2) score -= 1.5;
            if (get.position(card) == "e" && get.value(card, player) > 5) score -= 2;
            return score;
        },
        // 数据再生：
        // 1. 锁定跳过摸牌阶段,手牌上限固定额外+2；
        // 2. 其他角色的黑桃牌因弃置/判定进入弃牌堆时,可获得等量的【影】；
        // 3. 出牌阶段可把自己手里的黑桃牌转化为等量过牌。
        group: ["shujuzaisheng_skip", "shujuzaisheng_discard", "shujuzaisheng_judge"],
        forced: true,
        enable: "phaseUse",
        usable: 1,
        position: "he",
        selectCard: function (event, player) {
            var player = _status.event.player;
            return [1, player.hp];
        },
        filterCard: function (card, player) {
            // 主动效果只接受黑桃牌,和被动产“影”的花色来源保持一致。
            return get.suit(card, player) == "spade";
        },
        check: function (card) {
            return lib.skill.shujuzaisheng.getCheck(card, get.player());
        },
        content: function () {
            // 弃几张黑桃就补几张牌,简单直接地把冗余资源转为手牌质量。
            player.draw(cards.length);
        },
        ai: {
            order: function (item, player) {
                return player.countCards("he", function (card) {
                    return get.suit(card, player) == "spade" && lib.skill.shujuzaisheng.getCheck(card, player) > 0;
                }) > 1 ? 7 : 5.5;
            },
            result: {
                player: function (player) {
                    return player.countCards("he", function (card) {
                        return get.suit(card, player) == "spade" && lib.skill.shujuzaisheng.getCheck(card, player) > 0;
                    }) > 0 ? 1 : 0;
                },
            },
        },
        mod: {
            maxHandcard: function (player, num) {
                return num + 2;
            },
        },
        subSkill: {
            skip: {
                // 始终跳过自己的摸牌阶段。
                trigger: {
                    player: "phaseDrawBefore",
                },
                forced: true,
                content: function () {
                    trigger.cancel();
                },
            },
            discard: {
                // 其他角色弃牌时,统计其中进入弃牌堆的黑桃牌数量并决定是否获得【影】。
                trigger: {
                    global: ["loseAfter", "loseAsyncAfter"],
                },
                frequent: true,
                filter: function (event, player) {
                    // 只处理真正“因弃置进入弃牌堆”的牌；移动但未落入弃牌堆的不算。
                    if (event.type != 'discard' || event.getlx === false) return false;
                    var cards = event.cards.slice(0);
                    var evt = event.getl(player);
                    if (evt && evt.cards) cards.removeArray(evt.cards);
                    for (var i = 0; i < cards.length; i++) {
                        if (cards[i].original != 'j' && get.suit(cards[i], event.player) == 'spade' && get.position(cards[i], true) == 'd') {
                            return true;
                        }
                    }
                    return false;
                },
                content: function () {
                    "step 0"
                    if (trigger.delay == false) game.delayx();
                    "step 1"
                    var cards = [], cards2 = trigger.cards.slice(0), evt = trigger.getl(player);
                    if (evt && evt.cards) cards2.removeArray(evt.cards);
                    for (var i = 0; i < cards2.length; i++) {
                        if (cards2[i].original != 'j' && get.suit(cards2[i], trigger.player) == 'spade' && get.position(cards2[i], true) == 'd') {
                            cards.push(cards2[i]);
                        }
                    }
                    player.logSkill("shujuzaisheng");
                    player.gain(lib.card.ying.getYing(cards.length), "gain2");
                },
            },
            judge: {
                // 其他角色判定牌结算后进入弃牌堆时,同样按黑桃数量结算等量【影】。
                trigger: {
                    global: "cardsDiscardAfter",
                },
                forced: true,
                filter: function (event, player) {
                    // cardsDiscardAfter 触发来源很多,这里只认判定牌结算后的弃牌。
                    var evt = event.getParent().relatedEvent;
                    if (!evt || evt.name != "judge" || evt.player == player || !event.cards || !event.cards.length) return false;
                    for (var i = 0; i < event.cards.length; i++) {
                        if (get.suit(event.cards[i]) == "spade") return true;
                    }
                    return false;
                },
                content: function () {
                    // 判定只会结算当前这批牌,因此直接统计 trigger.cards 即可。
                    event.count = 0;
                    for (var i = 0; i < trigger.cards.length; i++) {
                        if (get.suit(trigger.cards[i]) == "spade") event.count++;
                    }
                    if (!event.count) {
                        event.finish();
                        return;
                    }
                    player.logSkill("shujuzaisheng");
                    player.gain(lib.card.ying.getYing(event.count), "gain2");
                },
            },
        },
    },
    yapogan: {
        getTargetBaseScore(player, target) {
            // 评估“从这名角色处获得一张牌”的基础收益。
            if (target == player || target.countGainableCards(player, "he") <= 0) return -Infinity;
            var score = get.effect(target, { name: "shunshou", isCard: true }, player, player);
            if (get.attitude(player, target) >= 0) return score - 2;
            if (player.canUse({ name: "sha", nature: "fire", isCard: true }, target, false)) {
                // 若黑桃牌大概率会转成火【杀】,则把这部分期望伤害提前算进收益。
                score += Math.max(get.effect(target, { name: "sha", nature: "fire", isCard: true }, player, player), 0) * 0.35;
            }
            if (target.countCards("he") == 1) score += 0.3;
            return score;
        },
        getDrawCost(player, selectedCount) {
            // “少摸一张”的代价会随着体力、手牌压力和已选目标数上升而变大。
            var cost = 0.7 + selectedCount * 0.18;
            if (player.hp <= 2) cost += 0.35;
            if (player.hp <= 1) cost += 0.55;
            if (player.countCards("h") <= 3) cost += 0.25;
            if (player.countCards("h") <= 1) cost += 0.25;
            return cost;
        },
        getTargetChoiceScore(player, target, selectedCount) {
            return lib.skill.yapogan.getTargetBaseScore(player, target) - lib.skill.yapogan.getDrawCost(player, selectedCount || 0);
        },
        // 压迫感：
        // 摸牌阶段少摸X张,改为依次获得X名其他角色各一张牌。
        // 若拿到的是黑桃,则立即弃置之,并视为对对应目标使用一张无距离限制、且不计次数的火【杀】。
        trigger: {
            player: "phaseDrawBegin2",
        },
        frequent: true,
        filter: function (event, player) {
            if (event.numFixed) return false;
            var num = typeof event.num == "number" ? event.num : 2;
            return num > 0 && game.hasPlayer(function (current) {
                return current != player && current.countGainableCards(player, "he") > 0;
            });
        },
        check: function (event, player) {
            return game.hasPlayer(function (current) {
                return lib.skill.yapogan.getTargetChoiceScore(player, current, 0) > 0;
            });
        },
        async content(event, trigger, player) {
            var drawNum = typeof trigger.num == "number" ? trigger.num : 2;
            var maxNum = Math.min(drawNum, game.filterPlayer(function (current) {
                return current != player && current.countGainableCards(player, "he") > 0;
            }).length);
            if (maxNum <= 0) return;
            var chooseTargetResult = await player
                .chooseTarget(
                    get.prompt("yapogan"),
                    "获得至多" + get.cnNumber(maxNum) + "名其他角色的各一张牌,然后少摸等量的牌；若获得的牌为黑桃,则弃置之并视为对其使用一张无距离且不计次数的火【杀】",
                    [1, maxNum],
                    function (card, player, target) {
                        return _status.event.player != target && target.countGainableCards(_status.event.player, "he") > 0;
                    }
                )
                .set("ai", function (target) {
                    return lib.skill.yapogan.getTargetChoiceScore(_status.event.player, target, ui.selected.targets.length);
                });
            if (!chooseTargetResult.result || !chooseTargetResult.result.bool || !chooseTargetResult.result.targets || !chooseTargetResult.result.targets.length) return;
            var targets = chooseTargetResult.result.targets;
            player.logSkill("yapogan", targets);
            // 真正减少摸牌数,后续改为逐个“夺牌”补偿。
            trigger.num -= targets.length;
            for (var i = 0; i < targets.length; i++) {
                var target = targets[i];
                player.line(target);
                var gainResult = await player.gainPlayerCard(target, "he", true);
                if (!gainResult.result || !gainResult.result.bool || !gainResult.result.cards || !gainResult.result.cards.length) continue;
                var card = gainResult.result.cards[0];
                if (get.suit(card, player) == "spade") {
                    // 黑桃代表“压迫升级”为直接炮击,因此先弃置该牌,再补一张火【杀】。
                    await player.discard(card);
                    if (target.isIn() && player.isIn() && player.canUse({ name: "sha", nature: "fire", isCard: true }, target, false)) {
                        var next = player.useCard({ name: "sha", nature: "fire", isCard: true }, target, false);
                        next.set("addCount", false);
                        next.set("nodistance", true);
                    }
                }
            }
        },
    },
    yamato_R_tongchou: {
        audio: false,
        locked: true,
        mark: true,
        marktext: "仇",
        trigger: { global: "phaseBefore", player: "enterGame" },
        forced: true,
        filter: function (event, player) {
            return game.hasPlayer(function (current) {
                return current != player;
            }) && (event.name != "phase" || game.phaseNumber == 0);
        },
        content: function () {
            "step 0"
            player.chooseTarget("同仇：选择一名其他角色", "当其造成伤害后，你受到等量的伤害。", true, function (card, player, target) {
                return target != player;
            }).set("ai", function (target) {
                var player = _status.event.player;
                //倾向选择敌方且血线较低的角色，方便使命尽快推进
                return -get.attitude(player, target) + Math.max(0, 4 - target.hp);
            });
            "step 1"
            if (result.bool) {
                player.storage.yamato_R_tongchou_targets = [result.targets[0].playerid];
                player.markSkill("yamato_R_tongchou");
                player.line(result.targets[0], "green");
                game.log(player, "选择了", result.targets[0], "作为'同仇'目标");
            }
        },
        intro: {
            content: function (storage, player) {
                var ids = player.storage.yamato_R_tongchou_targets || [];
                var targets = [];
                for (var i = 0; i < ids.length; i++) {
                    var t = game.findPlayer2(function (cur) { return cur.playerid == ids[i]; }, true);
                    if (t && t.isIn()) targets.push(t);
                }
                if (targets.length) return "同仇角色：" + targets.map(function (t) { return get.translation(t); }).join("、");
                return "未选择同仇角色";
            },
        },
        //mod放在主技能中，【影】不计入手牌上限且弃牌阶段不可弃置
        mod: {
            ignoredHandcard: function (card, player) {
                if (card.name == "ying") return true;
            },
            cardDiscardable: function (card, player, name) {
                if (name == "phaseDiscard" && card.name == "ying") return false;
            },
        },
        group: ["yamato_R_tongchou_link"],
        subSkill: {
            //同仇目标造成伤害后，你受到等量伤害（用damageSource确保触发时机正确）
            link: {
                audio: false,
                trigger: { global: "damageSource" },
                forced: true,
                locked: true,
                filter: function (event, player) {
                    var ids = player.storage.yamato_R_tongchou_targets;
                    return ids && ids.length > 0 && event.source && ids.includes(event.source.playerid) && event.num > 0;
                },
                logTarget: function (event) {
                    return event.source;
                },
                content: function () {
                    //用nosource避免额外牵出新的伤害来源联动
                    player.damage(trigger.num, "nosource");
                },
                sub: true,
                "_priority": 0,
            },
        },
        ai: {
            threaten: 1.3,
        },
        "_priority": 0,
    },
    //独立的影获取技能，同仇和同仇·改共享，避免changeSkills切换时丢失
    yamato_R_ying_gain: {
        audio: false,
        trigger: { player: "changeHp" },
        forced: true,
        popup: false,
        mod: {
            ignoredHandcard: function (card, player) {
                if (card.name == "ying") return true;
            },
            cardDiscardable: function (card, player, name) {
                if (name == "phaseDiscard" && card.name == "ying") return false;
            },
        },
        filter: function (event) {
            return event.num != 0;
        },
        content: function () {
            var num = Math.abs(trigger.num) * 2;
            if (num > 0) {
                player.gain(lib.card.ying.getYing(num), "gain2");
            }
        },
        "_priority": 0,
    },
    //同仇·改 - 其他角色受到伤害后可选择受等量伤害，体力变动获得2倍【影】
    yamato_R_tongchou2: {
        audio: false,
        mark: true,
        marktext: "仇",
        intro: {
            content: "其他角色受到伤害后，你可以受到等量的伤害",
        },
        group: ["yamato_R_tongchou2_link"],
        subSkill: {
            //其他角色受到伤害后，你可以受到等量伤害（用damageEnd确保伤害结算完毕后弹提示）
            //注意：不能用 frequent:true，否则人类玩家会被引擎自动点"确定"，等同于强制触发
            link: {
                audio: false,
                charlotte: true,
                trigger: { global: "damageEnd" },
                log: false,
                filter: function (event, player) {
                    return event.player != player && event.num > 0;
                },
                prompt: "是否发动【同仇】？",
                prompt2: function (event) {
                    return "受到" + get.cnNumber(event.num) + "点伤害。";
                },
                check: function (event, player) {
                    //血量足够才考虑承受，用更细致的评分
                    if (player.hp <= event.num) return false;
                    if (player.hp <= event.num + 1 && player.countCards("h", function (card) {
                        return get.name(card, player) == "tao" || get.name(card, player) == "jiu";
                    }) == 0) return false;
                    return player.hp > event.num + 1;
                },
                content: function () {
                    player.logSkill("yamato_R_tongchou2");
                    player.damage(trigger.num, "nosource");
                },
                sub: true,
                "_priority": 0,
            },
        },
        ai: {
            threaten: 1.5,
        },
        "_priority": 0,
    },
    //敌忾 - 两张牌当任意杀使用或打出
    yamato_R_dikai: {
        audio: false,
        enable: ["chooseToUse", "chooseToRespond"],
        getList: function (player, event) {
            var list = [];
            if (event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event)) list.push(["基本", "", "sha"]);
            for (var i of lib.inpile_nature) {
                if (event.filterCard(get.autoViewAs({ name: "sha", nature: i }, "unsure"), player, event)) list.push(["基本", "", "sha", i]);
            }
            return list;
        },
        filter: function (event, player) {
            return player.countCards("hes") > 1 && lib.skill.yamato_R_dikai.getList(player, event).length > 0;
        },
        hiddenCard: function (player, name) {
            return name == "sha" && player.countCards("hes") > 1;
        },
        chooseButton: {
            dialog: function (event, player) {
                return ui.create.dialog("敌忾", [lib.skill.yamato_R_dikai.getList(player, event), "vcard"], "hidden");
            },
            filter: function (button, player) {
                var event = _status.event.getParent();
                return event.filterCard({ name: button.link[2], nature: button.link[3] }, player, event);
            },
            check: function (button) {
                var player = _status.event.player;
                var card = { name: "sha", nature: button.link[3] };
                if (_status.event.getParent().type != "phase") {
                    if (button.link[3] == "fire") return 2.95;
                    if (button.link[3] == "thunder" || button.link[3] == "ice") return 2.92;
                    return 2.9;
                }
                if (game.hasPlayer(function (current) {
                    return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
                })) {
                    if (button.link[3] == "fire") return 2.95;
                    if (button.link[3] == "thunder" || button.link[3] == "ice") return 2.92;
                    return 2.9;
                }
                return 0;
            },
            backup: function (links) {
                return {
                    audio: false,
                    filterCard: true,
                    complexCard: true,
                    selectCard: 2,
                    position: "hes",
                    check: function (card) {
                        return 6 - get.value(card);
                    },
                    viewAs: { name: links[0][2], nature: links[0][3] },
                    popname: true,
                };
            },
            prompt: function (links) {
                return "将任意两张牌当做" + get.translation(links[0][3] || "") + "【杀】使用或打出";
            },
        },
        ai: {
            respondSha: true,
            skillTagFilter: function (player) {
                return player.countCards("hes") > 1;
            },
            order: 3.1,
            result: { player: 1 },
        },
        "_priority": 0,
    },
    //敌忾·改 - 两张牌当任意基本牌使用或打出（每回合最多通过此法使用一张桃）
    yamato_R_dikai2: {
        audio: false,
        enable: ["chooseToUse", "chooseToRespond"],
        //列出本次可选的基本牌；考虑桃每回合限一张
        getList: function (player, event) {
            var list = [];
            //杀（含各元素属性）
            if (event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event)) list.push(["基本", "", "sha"]);
            for (var i of lib.inpile_nature) {
                if (event.filterCard(get.autoViewAs({ name: "sha", nature: i }, "unsure"), player, event)) list.push(["基本", "", "sha", i]);
            }
            //闪（由引擎判断何时可用/可响应）
            if (event.filterCard(get.autoViewAs({ name: "shan" }, "unsure"), player, event)) list.push(["基本", "", "shan"]);
            //酒
            if (event.filterCard(get.autoViewAs({ name: "jiu" }, "unsure"), player, event)) list.push(["基本", "", "jiu"]);
            //桃：每回合最多通过此法使用一张，用 getStat 记录
            if (!player.getStat("skill").yamato_R_dikai2_tao &&
                event.filterCard(get.autoViewAs({ name: "tao" }, "unsure"), player, event)) {
                list.push(["基本", "", "tao"]);
            }
            return list;
        },
        filter: function (event, player) {
            return player.countCards("hes") > 1 && lib.skill.yamato_R_dikai2.getList(player, event).length > 0;
        },
        hiddenCard: function (player, name) {
            if (player.countCards("hes") < 2) return false;
            if (name == "sha" || name == "shan" || name == "jiu") return true;
            if (name == "tao") return !player.getStat("skill").yamato_R_dikai2_tao;
            return false;
        },
        chooseButton: {
            dialog: function (event, player) {
                return ui.create.dialog("敌忾", [lib.skill.yamato_R_dikai2.getList(player, event), "vcard"], "hidden");
            },
            filter: function (button, player) {
                var event = _status.event.getParent();
                return event.filterCard({ name: button.link[2], nature: button.link[3] }, player, event);
            },
            check: function (button) {
                var player = _status.event.player;
                var name = button.link[2];
                var nature = button.link[3];
                //非出牌阶段（响应/濒死救人等）：优先选当前最需要的基本牌
                if (_status.event.getParent().type != "phase") {
                    if (name == "tao") return 5;
                    if (name == "shan") return 4.5;
                    if (name == "jiu") return 3;
                    if (nature == "fire") return 2.95;
                    if (nature == "thunder" || nature == "ice") return 2.92;
                    return 2.9;
                }
                //出牌阶段：桃自救、酒配杀、杀进攻
                if (name == "tao") return player.isDamaged() ? 3.8 : 0;
                if (name == "jiu") return player.countCards("h", "sha") > 0 ? 3.2 : 0;
                if (name == "sha") {
                    var card = { name: "sha", nature: nature };
                    if (game.hasPlayer(function (current) {
                        return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
                    })) {
                        if (nature == "fire") return 2.95;
                        if (nature == "thunder" || nature == "ice") return 2.92;
                        return 2.9;
                    }
                }
                return 0;
            },
            backup: function (links) {
                return {
                    audio: false,
                    filterCard: true,
                    complexCard: true,
                    selectCard: 2,
                    position: "hes",
                    check: function (card) {
                        return 6 - get.value(card);
                    },
                    viewAs: { name: links[0][2], nature: links[0][3] },
                    popname: true,
                    //使用桃后记录，实现"每回合最多通过此法使用一张桃"
                    onuse: function (result, player) {
                        if (result.card && result.card.name == "tao") {
                            var stat = player.getStat("skill");
                            stat.yamato_R_dikai2_tao = (stat.yamato_R_dikai2_tao || 0) + 1;
                        }
                    },
                };
            },
            prompt: function (links) {
                var name = links[0][2];
                var nature = links[0][3];
                if (name == "sha" && nature) return "将任意两张牌当做" + get.translation(nature) + "【杀】使用或打出";
                return "将任意两张牌当做【" + get.translation(name) + "】使用或打出";
            },
        },
        ai: {
            respondSha: true,
            respondShan: true,
            save: true,
            skillTagFilter: function (player, tag) {
                if (player.countCards("hes") < 2) return false;
                if (tag == "save") return !player.getStat("skill").yamato_R_dikai2_tao;
                return true;
            },
            order: 3.1,
            result: { player: 1 },
        },
        "_priority": 0,
    },
    yamato_R_nizhuanfanji: {
        audio: false,
        dutySkill: true,
        unique: true,
        derivation: ["yamato_R_tongchou2", "yamato_R_dikai2"],
        group: ["yamato_R_nizhuanfanji_achieve", "yamato_R_nizhuanfanji_fail"],
        subSkill: {
            //成功：同仇目标死亡（直接读 storage 数组判断）
            achieve: {
                audio: false,
                trigger: { global: "dieAfter" },
                forced: true,
                locked: false,
                dutySkill: true,
                skillAnimation: true,
                animationColor: "water",
                filter: function (event, player) {
                    var ids = player.storage.yamato_R_tongchou_targets;
                    return !player.awakenedSkills.includes("yamato_R_nizhuanfanji") &&
                        ids && ids.length > 0 && event.player && ids.includes(event.player.playerid);
                },
                content: function () {
                    player.awakenSkill("yamato_R_nizhuanfanji");
                    game.log(player, "成功完成使命【逆转反击】");
                    delete player.storage.yamato_R_tongchou_targets;
                    player.unmarkSkill("yamato_R_tongchou");
                    player.changeSkills(
                        ["yamato_R_tongchou2", "yamato_R_dikai2"],
                        ["yamato_R_tongchou", "yamato_R_dikai"]
                    );
                },
                sub: true,
                "_priority": 0,
            },
            //失败：进入濒死状态时，回复体力至1点，然后依次对当前回合角色使用手牌（无距离次数限制）
            fail: {
                audio: false,
                trigger: { player: "dying" },
                forced: true,
                locked: false,
                forceDie: true,
                dutySkill: true,
                filter: function (event, player) {
                    return !player.awakenedSkills.includes("yamato_R_nizhuanfanji");
                },
                content: function () {
                    "step 0"
                    player.awakenSkill("yamato_R_nizhuanfanji");
                    game.log(player, "使命失败【逆转反击】");
                    if (player.hp < 1) player.recover(1 - player.hp);
                    "step 1"
                    //记录当前回合角色、快照当前手牌后逐张询问；不走 phaseUse 以免插入结算造成连锁 bug
                    var current = _status.currentPhase;
                    if (!current || !current.isIn() || current == player) {
                        event.finish();
                        return;
                    }
                    event._target = current;
                    event._cards = player.getCards("h").slice(0); //快照，避免新获得的牌被纳入流程
                    event._idx = 0;
                    "step 2"
                    //取快照中下一张；不在手牌或不能对目标使用则直接跳过
                    var target = event._target;
                    if (!target.isIn() || event._idx >= event._cards.length) {
                        event.finish();
                        return;
                    }
                    var card = event._cards[event._idx];
                    event._idx++;
                    event._curCard = null;
                    if (!card || !player.getCards("h").includes(card)) {
                        event.goto(2);
                        return;
                    }
                    if (!player.canUse(card, target, false, false)) {
                        event.goto(2);
                        return;
                    }
                    event._curCard = card;
                    player.chooseBool("逆转反击：是否对" + get.translation(target) + "使用" + get.translation(card) + "？")
                        .set("_target", target)
                        .set("_card", card)
                        .set("ai", function () {
                            var _event = _status.event;
                            return get.effect(_event._target, _event._card, _event.player, _event.player) > 0;
                        });
                    "step 3"
                    //玩家选择"是"且该牌仍可用则使用；"否"或不可用则继续下一张
                    if (result.bool && event._curCard &&
                        player.getCards("h").includes(event._curCard) &&
                        player.canUse(event._curCard, event._target, false, false)) {
                        //手动 useCard 直接绕过距离和次数限制
                        player.useCard(event._curCard, event._target, false);
                    }
                    event.goto(2);
                },
                sub: true,
                "_priority": 0,
            },
        },
        "_priority": 0,
    },
};
export { fallendemon };