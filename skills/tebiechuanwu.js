import { lib, game, ui, get, ai, _status } from '../../../noname.js';
const tebiechuanwu = {

    //光荣舰队SP
    guangrongjianduisp: {
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
                        if (player.canUse(button.link, false)) return get.value(button.link);
                        return 0;
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
    },
    //威严
    weiyan: {
        audio: false,
        trigger: { player: "phaseBegin" },
        direct: true,
        content: function () {
            "step 0"
            player.chooseToDiscard("he", "威严：是否弃置一张牌并跳过一个阶段？").set("ai", function (card) {
                return 6 - get.value(card);
            });
            "step 1"
            if (result.bool) {
                player.logSkill("weiyan");
                player.chooseControl("判定阶段", "摸牌阶段", "出牌阶段", "弃牌阶段").set("prompt", "威严：选择跳过的阶段").set("ai", function () {
                    return "弃牌阶段";
                });
            } else {
                event.finish();
            }
            "step 2"
            if (result.control == "判定阶段") {
                player.skip("phaseJudge");
            } else if (result.control == "摸牌阶段") {
                player.skip("phaseDraw");
            } else if (result.control == "出牌阶段") {
                player.skip("phaseUse");
            } else if (result.control == "弃牌阶段") {
                player.skip("phaseDiscard");
            }
            player.turnOver();
            player.addMark("weiyan_mark", 1);
            player.addSkill("weiyan_effect");
        },
        subSkill: {
            effect: {
                trigger: { target: "useCardToTargeted" },
                forced: false,
                filter: function (event, player) {
                    return player.hasMark("weiyan_mark");
                },
                content: function () {
                    player.removeMark("weiyan_mark", 1);
                    trigger.getParent().excluded.add(player);
                    if (!player.hasMark("weiyan_mark")) {
                        player.removeSkill("weiyan_effect");
                    }
                },
                marktext: "威",
                intro: {
                    content: "当你被指定目标时，你可以取消并失去'威'",
                },
                ai: {
                    threaten: 0.8,
                },
            },
            mark: {},
        },
    },
    //金雕展翅
    jindiaozhanchi: {
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
    /*
    //南沙功臣
    nanshagonchen: {
        audio: false,
        trigger: { player: "useCardToTargeted" },
        forced: true,
        filter: function (event, player) {
            return event.card && event.card.name == "sha";
        },
        content: function () {
            var num = game.countPlayer(function (current) {
                return current.group == "PLAN" || current.group == "ROCN";
            });
            if (num >= 1) {
                var cards = trigger.target.getCards("he").randomGets(player.hp);
                if (cards.length > 0) {
                    trigger.target.lose(cards, ui.special);
                    if (!trigger.target.storage.nanshagonchen_cards) trigger.target.storage.nanshagonchen_cards = [];
                    trigger.target.storage.nanshagonchen_cards.addArray(cards);
                }
            }
            if (num >= 2) {
                player.draw();
            }
            if (num >= 3) {
                trigger.getParent().directHit.add(trigger.target);
            }
            if (num >= 4) {
                var evt = trigger.getParent();
                if (evt.baseDamage) evt.baseDamage++;
            }
        },
    },
    //四大金刚
    sidajingang: {
        audio: false,
        trigger: { global: "roundStart" },
        direct: true,
        content: function () {
            "step 0"
            game.countPlayer(function (current) {
                if (current.hasMark("sidajingang_mark")) {
                    current.removeMark("sidajingang_mark", current.countMark("sidajingang_mark"));
                    current.removeSkill("sidajingang_effect");
                }
            });
            player.chooseTarget([0, 2], "四大金刚：选择至多两名角色令其获得'联'").set("ai", function (target) {
                var player = _status.event.player;
                return get.attitude(player, target);
            });
            "step 1"
            if (result.bool && result.targets && result.targets.length > 0) {
                player.logSkill("sidajingang", result.targets);
                for (var target of result.targets) {
                    target.addMark("sidajingang_mark", 1);
                    target.addSkill("sidajingang_effect");
                }
            }
        },
        subSkill: {
            effect: {
                trigger: { player: "phaseDrawBegin2" },
                forced: true,
                filter: function (event, player) {
                    return !event.numFixed;
                },
                content: function () {
                    trigger.num++;
                },
                group: ["sidajingang_effect_damage", "sidajingang_effect_sha"],
                subSkill: {
                    damage: {
                        trigger: { source: "damageBegin1" },
                        forced: false,
                        filter: function (event, player) {
                            if (!player.storage.sidajingang_damaged) return true;
                            return false;
                        },
                        content: function () {
                            "step 0"
                            var owner = game.findPlayer(function (current) {
                                return current.hasSkill("sidajingang");
                            });
                            if (owner) {
                                owner.chooseToDiscard("he", "四大金刚：是否弃置一张牌，令" + get.translation(player) + "额外使用一张【杀】？").set("ai", function (card) {
                                    return 7 - get.value(card);
                                });
                            } else {
                                event.finish();
                            }
                            "step 1"
                            if (result.bool) {
                                player.storage.sidajingang_damaged = true;
                                player.addTempSkill("sidajingang_effect_sha2");
                            }
                        },
                    },
                    sha2: {
                        mod: {
                            cardUsable: function (card, player, num) {
                                if (card.name == "sha") return num + 1;
                            },
                        },
                        trigger: { source: "damageEnd" },
                        forced: true,
                        filter: function (event, player) {
                            return event.card && event.card.name == "sha";
                        },
                        content: function () {
                            var owner = game.findPlayer(function (current) {
                                return current.hasSkill("sidajingang");
                            });
                            if (owner) {
                                owner.draw();
                            }
                            var targets = game.filterPlayer(function (current) {
                                return current.hasMark("sidajingang_mark");
                            });
                            for (var target of targets) {
                                target.draw();
                            }
                        },
                    },
                },
                marktext: "联",
                intro: {
                    content: "摸牌阶段摸牌+1；首次造成伤害时，可以额外使用一张【杀】",
                },
            },
            mark: {},
        },
    },
    //海鹰巡弋
    haiyingxunyi: {
        audio: false,
        mod: {
            targetEnabled: function (card, player, target) {
                if (target.hasSkill("daoqu") && card.name == "sha") {
                    var info = get.info(card);
                    if (info && info.wuxie === false) return;
                    return "ignoreEquip";
                }
            },
        },
        trigger: { player: "useCardAfter", global: "useCardAfter" },
        direct: true,
        filter: function (event, player, name) {
            if (name == "useCardAfter" && event.player == player) {
                return true;
            }
            if (name == "useCardAfter" && event.player != player) {
                return event.player.group == "PLAN" || event.player.group == "ROCN";
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
    },
    //大洋鹰击
    dayangying: {
        audio: false,
        mod: {
            targetEnabled: function (card, player, target) {
                if (target.hasSkill("qiantingss") && card.name == "sha") {
                    return "ignoreEquip";
                }
            },
        },
        trigger: { global: "chooseToRespondBegin" },
        forced: false,
        filter: function (event, player) {
            if (event.responded) return false;
            if (!event.player || !event.player.hasSkill("qiantingss")) return false;
            return event.filterCard({ name: "shan" }, event.player, event);
        },
        content: function () {
            trigger.result = { bool: true, card: { name: "shan" } };
        },
    },
    //先驱者
    xianquzhe: {
        audio: false,
        trigger: { global: "gameStart", player: "enterGame" },
        forced: true,
        content: function () {
            "step 0"
            player.addSkill("xianquzhe_range");
            player.chooseTarget("先驱者：令一名角色攻击范围-2", true).set("ai", function (target) {
                var player = _status.event.player;
                if (get.attitude(player, target) < 0) return 1;
                return 0;
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
                    attackRange: function (player, distance) {
                        return distance + 2;
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
                forced: false,
                filter: function (event, player) {
                    return event.target && event.target.countCards("h") > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseControl("弃牌", "cancel2").set("prompt", "先驱者：是否令" + get.translation(trigger.target) + "弃置一半手牌？").set("ai", function () {
                        var player = _status.event.player;
                        var target = _status.event.getTrigger().target;
                        if (get.attitude(player, target) < 0) return "弃牌";
                        return "cancel2";
                    });
                    "step 1"
                    if (result.control == "弃牌") {
                        var num = Math.floor(trigger.target.countCards("h") / 2);
                        trigger.target.chooseToDiscard("h", num, true);
                        var diamonds = trigger.target.countCards("h", { suit: "diamond" });
                        var evt = trigger.getParent();
                        if (evt.baseDamage) evt.baseDamage += diamonds;
                    }
                },
            },
        },
    },
    //三坐标定位
    sanzuobiaodingwei: {
        audio: false,
        enable: "phaseUse",
        usable: 1,
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
    },*/
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
    },/*
    //力争上游
    lizhengshangyu: {
        audio: false,
        trigger: { global: "gameStart", player: ["enterGame", "phaseDrawBegin2"] },
        forced: true,
        filter: function (event, player, name) {
            if (name == "phaseDrawBegin2") {
                return !event.numFixed;
            }
            return true;
        },
        content: function () {
            var num = game.countPlayer(function (current) {
                return current.group == "PLAN" || current.group == "ROCN";
            });
            if (event.triggername == "phaseDrawBegin2") {
                trigger.num += num * 2;
            } else {
                player.draw(num * 2);
                player.chooseTarget("力争上游：是否令一名距离你为1的或c国的角色执行一个额外回合？", function (card, player, target) {
                    if (target.distance(player) == 1) return true;
                    if (target.group == "PLAN" || target.group == "ROCN") return true;
                    return false;
                }).set("ai", function (target) {
                    var player = _status.event.player;
                    return get.attitude(player, target);
                });
                if (result.bool && result.targets && result.targets[0]) {
                    result.targets[0].insertPhase();
                }
            }
        },
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
    },*/
};
export { tebiechuanwu };