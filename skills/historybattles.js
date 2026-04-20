import { lib, game, ui, get, ai, _status } from '../../../noname.js';
const historybattles = {
    u81_langben: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        enable: "phaseUse",
        //usable: 2,
        filterTarget: function (card, player, target) {
            if (player == target) return false;
            if (player.countCards('hes', function (card) {
                return get.type(card) != "basic";
            }) == 0) return false;
            if (target.hasSkill("u81_langben_target")) return false;
            return true;
        },
        filterCard: function (card) { return get.type(card) != "basic"; },
        selectCard: 1,
        position: "h",
        discard: false,
        lose: false,
        check: function (card) {
            if (card.name == 'du') return 20;
            if (get.owner(card).countCards('hes') < get.owner(card).hp) return 0;
            return 4 - get.value(card);
        },
        content: function () {
            "step 0"
            player.give(cards, targets[0]);
            target.addTempSkill('u81_langben_target', "phaseBegin");
        },
        ai: {
            result: {
                target: function (player, target) {
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                        return -1;
                    }
                    return 1;
                },
            },
            order: 1,
        },
    },
    u81_langben_target: {
        mod: {
            globalTo(from, to, distance) {
                return 1;
            },
        },
        "_priority": 0,
    },
    u47_xinbiao: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        trigger: {
            global: ["damageEnd", "loseHpEnd", "dying"],
        },
        direct: true,
        filter(event, player) {
            if (player.countCards('he', { color: 'black' }) <= 0) return false;
            if (!event.player.isIn()) return false;
            var i = 0;
            var allplayers = game.filterPlayer().sortBySeat(player);
            //game.log(allplayers.length);
            for (i = 0; i < allplayers.length; i++) {
                //game.log(allplayers[i], i);

                if (allplayers[i].hasSkill("u47_xinbiao_hp")) {

                    //game.log(allplayers[i].group);
                    //game.log(event.player.group);
                    if (allplayers[i].group == event.player.group) {
                        //game.log(allplayers[i],event.player);
                        return false;

                    }
                }

            }
            return player.countCards('he', { color: 'black' }) > 0;
        },
        content: function () {
            "step 0"
            player.chooseToDiscard(1, 'he', '是否弃置一张黑色牌并记录' + get.translation(trigger.player) + '状态？', { color: 'black' }).set('ai', function (card, player) {
                var player = get.player(), target = _status.event.getTrigger().player;
                if (get.attitude(player, target) >= 0) {
                    if (target.hp < 3 && target.countCards("h") < 3) return 0;
                } else {
                    if (target.hp > 2 && target.countCards("h") > 2) return 0;
                };
                return 12 - get.value(card);
            });
            "step 1"
            if (result.bool) {
                trigger.player.addSkill("u47_xinbiao_hp");
                trigger.player.addSkill("u47_xinbiao_cards");
                //trigger.player.addMark("u47_xinbiao_hp",math.max(trigger.player.hp,1));
                //trigger.player.addMark("u47_xinbiao_cards", math.max(trigger.player.countCards('h'),1));
                trigger.player.setStorage("u47_xinbiao_hp", [trigger.player.hp]);
                trigger.player.setStorage("u47_xinbiao_cards", [trigger.player.countCards('h')]);
                player.logSkill("u47_xinbiao");
            }
        },
        ai: {
            combo: "u47_huxi",
        },
    },
    u47_xinbiao_hp: {
        mark: true,
        marktext: "体力",
        onremove: true,
        intro: {
            name: "体力",
            content: function (storage, player) {
                var str = "已记录体力值：" + get.translation(player.storage.u47_xinbiao_hp);
                return str;
            },
            //content: "已记录体力值$",
        },
    },
    u47_xinbiao_cards: {
        mark: true,
        marktext: "手牌",
        onremove: true,
        intro: {
            name: "手牌",
            content: function (storage, player) {
                var str = "已记录手牌数：" + get.translation(player.storage.u47_xinbiao_cards);
                return str;
            },
            //content: "已记录手牌数$",
        },
    },
    u47_huxi: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filter: function (event, player) {
            var filterHuxi = game.countPlayer(function (current) {
                return current.hasSkill('u47_xinbiao_hp');
            });
            return filterHuxi > 0;
        },
        content: function () {
            "step 0"
            player.chooseTarget(get.prompt2('u47_huxi'), function (card, player, target) {
                return target.hasSkill('u47_xinbiao_hp');
            }).set('ai', target => {
                var att = get.attitude(player, target);
                if (att >= 0) {
                    return (target.getStorage('u47_xinbiao_hp') - target.hp) * 2 + (target.getStorage('u47_xinbiao_cards') - target.countCards("h"));
                } else if (att < 0) {
                    return (target.hp - target.getStorage('u47_xinbiao_hp')) * 2 + (target.countCards("h") - target.getStorage('u47_xinbiao_cards'));
                } else {
                    return 1;
                }
            });
            'step 1'
            if (result.bool) {
                player.logSkill('u47_huxi');
                var target = result.targets[0];
                var i1 = target.getStorage('u47_xinbiao_hp');
                //target.removeMark('u47_xinbiao_hp', target.getStorage('u47_xinbiao_hp'));
                var i2 = target.getStorage('u47_xinbiao_cards');
                //target.removeMark('u47_xinbiao_cards', target.getStorage('u47_xinbiao_cards'));
                var hp = target.hp - i1;
                var cards = target.countCards("h") - i2;
                //game.log("hp", hp, "cards", cards);
                //game.log("hp", Math.abs(hp), "cards", Math.abs(cards));
                if (hp > 0) {
                    var loseNum = Math.abs(hp);
                    target.loseHp(loseNum);
                    // 将体力流失计入U47的统计
                    var stat = player.getStat();
                    if (!stat.damage) stat.damage = 0;
                    stat.damage += loseNum;

                } else if (hp < 0) {
                    target.recover(Math.abs(hp));
                } else {
                    ;
                }
                if (cards > 0) {
                    target.discard(Math.abs(cards));

                } else if (cards < 0) {
                    target.draw(Math.abs(cards));
                } else {
                    ;
                }
                //target.unmarkAuto("u47_xinbiao_hp", [i1]);
                //target.unmarkAuto("u47_xinbiao_cards", [i2]);
                target.removeSkill('u47_xinbiao_hp');
                target.removeSkill('u47_xinbiao_cards');
                player.draw(1);
            } else {
                //game.log("结束结算");
                event.finish();
            }
        },
        ai: {
            order: 5,
            result: {
                player: function (player) {
                    return 1;
                },
            },
            combo: "u47_xinbiao",
        },
        "_priority": 0,
    },
    u81_zonglie: {
        audio: "ext:舰R牌将/audio/skill:true",
        usable: 1,
        nobracket: true,
        frequent: true,
        trigger: {
            source: "damageBegin",
        },
        filter(event, player) {
            return !event.player.hasSkill("u81_zonglie_shanghai") && player != event.player && event.player.countCards("h") > 0 && event.player.countCards("h") != player.countCards("h");
        },
        content: function* (event, map) {
            "step 0"
            var player = map.player, trigger = map.trigger;
            //game.log(event.player);
            //game.log(trigger.player);

            var result1 = yield trigger.player.chooseCard('h', '是否交给' + get.translation(player) + '一张手牌免疫此次伤害并摸一张牌？').set('ai', function (card) { return 7 - get.value(card) });
            "step 1"
            if (result1.bool) {
                game.log("给牌免伤");
                trigger.player.give(result1.cards, player);
                trigger.player.draw(1);
                trigger.cancel();
                if (!trigger.player.hasSkill("u81_zonglie_shanghai")) {
                    //game.log("添加技能");
                    trigger.player.addTempSkill("u81_zonglie_shanghai");
                }
                trigger.player.addMark('u81_zonglie_shanghai', 1, false);
            } else {
                game.log("不给牌结束");
                event.finish();
                return;
            }

        },
        group: "u81_zonglie_xiangying",
    },
    u81_zonglie_xiangying: {
        trigger: {
            player: "useCard",
        },
        forced: true,
        locked: false,
        filter: function (event, player) {
            return game.hasPlayer((current) => {
                return current != player && current.hasSkill("u81_zonglie_shanghai");
            });
        },
        groupSkill: true,
        content: function () {
            trigger.directHit.addArray(
                game.filterPlayer((current) => {
                    return current != player && current.hasSkill("u81_zonglie_shanghai");
                })
            );
        },
        ai: {
            "directHit_ai": true,
            skillTagFilter: function (player, tag, arg) {
                return player.hasSkill("u81_zonglie_shanghai");
            },
        },
        "_priority": 0,
    },
    u81_zonglie_shanghai: {
        nobracket: true,
        mark: true,
        marktext: "纵猎",
        intro: {
            name: "纵猎",
            content: "不可响应U81使用的牌",
        },
        /*trigger: {
            player: "damageBegin3",
        },
        forced: true,
        //direct: true,
        onremove: true,
        filter: function (event, player) {
            game.log("纵猎标记数量" + player.countMark("u81_zonglie_shanghai"));
            return player.countMark("u81_zonglie_shanghai");
        },
        content: function () {
            trigger.num += player.countMark('u81_zonglie_shanghai');
            game.log(player, '受到的伤害+' + player.countMark('u81_zonglie_shanghai'));
            player.removeSkill('u81_zonglie_shanghai');
        },*/
        "_priority": 0,
    },
    u81_xunyi: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        trigger: {
            global: "gainAfter",
        },
        usable: 1,
        prompt2: function (event, player) {
            return "令全场角色依次选择是否对" + get.translation(event.player) + "使用一张牌";
        },
        filter: function (event, player) {
            if (player.inRange(event.player)) {
                /*for (var i in game.players) {
                    //game.log(i);
                    if (event.getl(game.players[i]).cards2.length != 0) {
                        //game.log(event.getl(game.players[i]).cards2.length);
                        return event.getl(game.players[i]).cards2;
                    }
                }*///是否从其他角色处获得牌
                return _status.currentPhase != event.player && event.player.hp > 0 && player.countCards("h") > 0 && event.player.countCards("h") > 0;
            }
            return false;
        },
        content: function () {
            "step 0";
            event.targets = game
                .filterPlayer(function (current) {
                    return current != trigger.player;
                })
                .sortBySeat();
            "step 1";
            if (!trigger.player.isIn()) {
                event.finish();
                return;
            }
            var target = targets.shift();
            if (target.isIn() && (_status.connectMode || !lib.config.skip_shan)) {
                target
                    .chooseToUse(function (card, player, event) {
                        return lib.filter.filterCard.apply(this, arguments);
                    }, "是否对" + get.translation(trigger.player) + "使用一张牌？")
                    .set("targetRequired", true)
                    .set("complexSelect", true)
                    .set("filterTarget", function (card, player, target) {
                        if (
                            target != _status.event.sourcex &&
                            !ui.selected.targets.includes(_status.event.sourcex)
                        )
                            return false;
                        return lib.filter.filterTarget.apply(this, arguments);
                    })
                    .set("sourcex", trigger.player);
            }
            if (targets.length > 0) event.redo();
        },
        /* async content(event, trigger, player) {
 
            const targets = [player, trigger.player];
            //game.log(targets);
            const next = player.chooseCardOL(targets, '请展示一张手牌', true).set('ai', card => {
                return -get.value(card);
            }).set('aiCard', target => {
                const hs = target.getCards('h');
                return { bool: true, cards: [hs.randomGet()] };
            });
            next._args.remove('glow_result');
            const { result } = await next;
            const cards = [];
            const videoId = lib.status.videoId++;
            for (let i = 0; i < targets.length; i++) {
                cards.push(result[i].cards[0]);
                game.log(targets[i], '展示了', result[i].cards[0]);
            }
            //game.log(JSON.stringify(result));
            game.broadcastAll((targets, cards, id, player) => {
                var dialog = ui.create.dialog(get.translation(player) + '发动了【巡弋】', cards);
                dialog.videoId = id;
                const getName = (target) => {
                    if (target._tempTranslate) return target._tempTranslate;
                    var name = target.name;
                    if (lib.translate[name + '_ab']) return lib.translate[name + '_ab'];
                    return get.translation(name);
                }
                for (let i = 0; i < targets.length; i++) {
                    dialog.buttons[i].querySelector('.info').innerHTML = getName(targets[i]) + '|' + get.strNumber(cards[i].number);
                }
            }, targets, cards, videoId, player);
            await game.asyncDelayx(4);
            game.broadcastAll('closeDialog', videoId);
 
            const type = get.type(cards[0], false);
            //game.log("flag0" + type);
            let flag = false;
            for (let i = 0; i < targets.length; i++) {
                for (let j = 0; j < i; j++) {
                    if (get.type(cards[j], false) != get.type(cards[i], false)) {
                        //game.log("flag=true" + get.type(cards[i], false));
                        flag = true;
                    }
                    else {
                        //game.log("flag=false" + get.type(cards[i], false));
                        flag = false;
                        i = targets.length;//触发上级停止条件,跳出循环
                        break;
                    }
 
                }
 
            }
            //game.log("类型不同？" + flag);
            //game.log(targets);
            if (!flag) {
                var card = {
                    name: "sha",
                    nature: "thuder",
                    isCard: true,
                };
                if (player.canUse(card, trigger.player, false)) {
                    player.useCard(card, trigger.player, false);
                }
            }
 
        }, */
        sub: true,
    },
    Z: {
        marktext: "Z",
        //audio: "z1_Zqulingjian",
        intro: {
            content: "expansion",
            markcount: "expansion",
        },
        onremove(player, skill) {
            var cards = player.getExpansions(skill);
            if (cards.length) player.loseToDiscardpile(cards);
        },
    },
    z1_Zqulingjian: {
        nobracket: true,
        global: 'Z_damage',
        frequent: true,
        trigger: {
            global: "damageEnd",
        },
        filter: function (event, player) {
            if (get.itemtype(event.cards) != 'cards' || get.position(event.cards[0], true) != "o") { return false; }
            if (event.source && event.source.group == "KMS" && event.source.hasSkill("quzhudd")) {
                //game.log("造成伤害是德驱");
                return true;
            } else if (event.player.group == "KMS" && event.player.hasSkill("quzhudd")) {
                //game.log("受到伤害是德驱");
                return true;
            } //game.log("不满足发动条件");
            return false;
        },
        content: function () {
            "step 0"
            player.addToExpansion(trigger.cards, 'gain2').gaintag.add('Z');
        },
        group: ["z1_Zqulingjian_move", "z1_Zqulingjian_draw"],/* "z1_Zqulingjian_source", "z1_Zqulingjian_damage", */
        subSkill: {
            /* source: {
                trigger: {
                    source: "damageBegin4",
                },
                filter: function (event, player) {
                    return event.hasNature("thunder") && player.getExpansions('Z').length && event.notLink();
                },
                check: function (event, player) {
                    return -get.attitude(player, event.player);
                },
                content: function () {
                    'step 0'
                    var cards = player.getExpansions('Z'), count = cards.length;
                    if (count > 0) {
                        if (count == 1) event._result = { links: cards };
                        else player.chooseCardButton('Z驱领舰：移去一张“Z”令其受到的伤害+1', true, cards).set('ai', function (button) {
 
                            return 1;
                        });
                    }
                    else event.finish();
                    'step 1'
                    var cards = result.links;
                    player.loseToDiscardpile(cards);
                    'step 2'
                    trigger.num += 1;
                },
            },
            damage: {
                trigger: {
                    global: "damageBegin3",
                },
                filter: function (event, player) {
                    return player.getExpansions('Z').length && event.hasNature("thunder") && event.player != player && event.notLink();
                },
                check: function (event, player) {
                    return get.attitude(player, event.player);
                },
                content: function () {
                    'step 0'
                    var cards = player.getExpansions('Z'), count = cards.length;
                    if (count > 0) {
                        if (count == 1) event._result = { links: cards };
                        else player.chooseCardButton('Z驱领舰：移去一张“Z”令其受到的伤害-1', true, cards).set('ai', function (button) {
 
                            return 1;
                        });
                    }
                    else event.finish();
                    'step 1'
                    var cards = result.links;
                    player.loseToDiscardpile(cards);
                    'step 2'
                    trigger.num -= 1;
                },
 
            }, */
            draw: {
                enable: "phaseUse",
                filter: function (event, player) {
                    return player.getExpansions('Z').length > 0;
                },
                content: function () {
                    'step 0'
                    var cards = player.getExpansions('Z');
                    var count = cards.length;
                    if (count > 0) {
                        player.chooseCardButton('移去任意张Z', true, cards).set('ai', function (button) {
                            return 1;
                        }).set('selectButton', [0, cards.length]);
                    }
                    else { event.finish(); }
                    'step 1'
                    if (result.bool) {
                        event.cards = result.links;
                        event.num = event.cards.length;
                        player.loseToDiscardpile(event.cards);
                        player.chooseTarget(get.prompt("z1_Zqulingjian_draw"), "令一名角色摸" + get.translation(event.num) + "张牌。", true, function (card, player, target) {
                            return 1;
                        }).set("ai", function (target) {
                            var player = _status.event.player;
                            return get.attitude(player, target);
                        });
                    } else { event.finish(); }
                    "step 2";
                    if (result.bool) {
                        var target = result.targets[0];
                        target.draw(event.num);
                    } else {
                        event.finish();
                    }

                },
                ai: {
                    order: 7.5,
                    basic: {
                        order: 2,
                        useful: 1,
                        value: 4,
                    },
                    result: {
                        player: 1,
                    },
                },
            },
            move: {
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                filter: function (event, player) {
                    return game.findPlayer(current => current.getExpansions('Z').length);
                },
                content: function* (event, map) {
                    "step 0"
                    var player = map.player;
                    var result = yield player.chooseTarget('Z驱领舰：请选择移动一张Z', 2, (card, player, target) => {
                        if (ui.selected.targets.length) {
                            return true;
                        }
                        return target.getExpansions('Z').length;
                    }).set('targetprompt', ['移走Z', '获得Z']).set('multitarget', true).set('ai', target => {
                        if (!ui.selected.targets.length) {
                            if (get.attitude(player, target) < 0) { return -get.attitude(player, target) }
                            else if (target.getExpansions('Z').length > 1 && player.getExpansions('Z').length < 1) {
                                return 4 - get.attitude(player, target);
                            } else if (player.getExpansions('Z').length && game.filterPlayer(function (current) {
                                return current.hp <= 2 && current.getExpansions('Z').length < 1;
                            })) {
                                return player == target;

                            } else {
                                return "cancel2";
                            }
                        }
                        else return get.attitude(player, target);
                    });
                    "step 1"
                    if (result.bool) {
                        //game.log(result.targets);
                        if (result.targets[0].getExpansions('Z').length == 0) {
                            //game.log("event.finish");
                            event.finish();
                            return;
                        }
                        //game.log(result.targets[1]);
                        /*----下列部分用于检查并给予result.target[1]技能Z----*/
                        //game.log("result.targets[1].hasSkill?"+player.hasSkill("Z",null,false,false));
                        //if (!result.targets[1].hasSkill("Z")) {result.targets[1].addSkills("Z");}
                        //game.log("result.targets[1].hasSkill?"+result.targets[1].hasSkill("Z"));
                        /*--------*/
                        var cards = result.targets[0].getExpansions('Z');

                        var result1 = yield player.chooseCardButton('Z驱领舰：选择一张“Z”移动', true, cards).set('ai', function (button) {
                            return 1;
                        });
                    } else { event.finish(); return; }
                    "step 2"
                    if (result.bool) {
                        var cards = result1.links;
                        result.targets[0].loseToDiscardpile(cards);
                        result.targets[1].addToExpansion(cards, 'gain2').gaintag.add('Z');
                    } else { event.finish(); return; }
                    "step 3"
                    player.logSkill("z1_Zqulingjian_move");
                    event.finish();
                },
            },

        },
    },
    Z_damage: {
        trigger: {
            player: "damageBegin4",
        },
        //discard: false,
        //lose: false,
        //delay: false,
        prompt: function () {
            return "移去所有Z,然后防止此伤害";
        },
        filter: function (event, player) {
            //game.log("检测是否拥有Z标记");
            return player.getExpansions('Z').length;
        },
        visible: true,
        check: function (event, player) {
            return event.num > 1 || player.hp <= 1;
        },
        content: function () {
            "step 0"
            var cards = player.getExpansions('Z');
            for (var i = 0; i < cards.length; i++) {
                player.loseToDiscardpile(cards[i]);
            }
            trigger.cancel();
        },
    },
    Z_gain: {//准备阶段获得一张Z,Z驱测试用。
        frequent: true,
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        filter: function (event, player) {
            return true;
        },
        content: function () {
            "step 0"
            var cards = get.cards();
            player.addToExpansion(cards[0], 'gain2').gaintag.add('Z');
        },
    },
    z16_lianhuanbaopo: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        usable: 1,
        enable: "phaseUse",
        filter: function (event, player) {
            return game.hasPlayer(function (current) {
                return current.getExpansions('Z').length;
            });
        },
        content: function () {
            'step 0'
            event.targets = game.filterPlayer(current => current != player && current.getExpansions('Z').length).sortBySeat();
            'step 1'
            event.target1 = event.targets.shift();
            'step 2'
            var cards = event.target1.getExpansions('Z'), count = cards.length;
            if (count > 0) {
                player.chooseCardButton('将一张Z当作雷杀对' + get.translation(event.target1) + '使用', true, cards).set('ai', function (button) {
                    return 1;
                });
            }
            else { event.goto(4); }
            'step 3'
            if (result.bool) {
                player.useCard({ name: "sha", nature: "thunder" }, result.links, event.target1);
            }
            event.goto(2);
            'step 4'
            if (event.targets.length > 0) event.goto(1);
            else game.delayx();

        },
        ai: {
            order: 5,
            result: {
                player: function (player) {
                    return game.countPlayer(function (current) {
                        if (current != player) {
                            return get.sgn(current.getExpansions('Z').length * get.damageEffect(current, player, player));
                        }
                    });
                },
            },
        },
    },
    /*  z16_lianhuanbaopo: {//旧版z16连环爆破,准备给日驱使用
         nobracket: true,
         enable: "chooseToUse",
         filterCard(card) {
             return get.color(card) == 'black' && (get.name(card) == "sheji9" || get.name(card) == "sha");
         },
         position: "h", 
         viewAs: {
             name: "sha",
             nature: "thunder",
         },
         viewAsFilter(player) {
             if (!player.countCards('hes', { color: 'black' })) return false;
         },
         prompt: "将一张黑色杀当雷杀使用",
         check(card) { return 4 - get.value(card) },
         ai: {
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
         group: ["z16_lianhuanbaopo_sha", "z16_lianhuanbaopo_leisha"],
         subSkill: {
             sha: {
                 enable: ["chooseToRespond", "chooseToUse"],
                 filterCard(card, player) {
                     return get.color(card) == 'black';
                 },
                 position: "hes",
                 viewAs: {
                     name: "sha",
                 },
                 viewAsFilter(player) {
                     if (!player.countCards('hes', { color: 'black' })) return false;
                 },
                 prompt: "将一张黑色牌当杀使用或打出",
                 check(card) {
                     const val = get.value(card);
                     if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
                     return 5 - val;
                 },
                 ai: {
                     skillTagFilter(player) {
 
                         if (!player.countCards('hes', { color: 'black' })) return false;
 
                     },
                     respondSha: true,
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
             leisha: {
                 mod: {
                     cardUsable: function (card) {
                         if (card.name == 'sha' && card.nature == "thunder") return Infinity;
                     },
                     targetInRange: function (card, player, target) {
                         if (card.name == 'sha' && card.nature == "thunder") return true;
                     },
                 },
                 sub: true,
                 trigger: {
                     player: "useCardToPlayered",
                 },
                 filter: function (event) {
                     return event.card.name == 'sha' && event.card.name == "thunder";
                 },
                 forced: true,
                 logTarget: "target",
                 content: function () {
                     trigger.target.addTempSkill('qinggang2');
                     trigger.target.storage.qinggang2.add(trigger.card);
                     trigger.target.markSkill('qinggang2');
                 },
             },
         },
     }, */
    z16_shuileibuzhi: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        global: "Z_judge",
        usable: 1,
        enable: "phaseUse",
        filterTarget: true,
        selectTarget: 1,
        selectCard: 1,
        filterCard: true,
        discard: false,
        filter: function (event, player) {
            return player.countCards('h') > 0;
        },
        position: "h",
        check(card) {
            return 7 - get.value(card);
        },
        content: function () {
            targets[0].addToExpansion(cards[0], 'gain2').gaintag.add('Z');
        },
        ai: {
            order: 6,
            result: {
                target: function (player, target) {
                    return -0.5;
                },
            },
        },
    },
    Z_judge: {
        trigger: {
            player: "phaseJudgeBegin",
        },
        filter: function (event, player) {
            return player.getExpansions('Z').length;
        },
        check: function (event, player) {
            return player.hasJudge("bingliang");
        },
        prompt: function () {
            return "移去一张Z,然后执行一次兵粮寸断判定";
        },
        content: function () {
            'step 0'
            var cards = player.getExpansions('Z'), count = cards.length;
            if (count > 0) {
                player.chooseCardButton('移去一张Z', true, cards).set('ai', function (button) {
                    return 1;
                });
            }
            else { event.finish(); return; }
            'step 1'
            event.cards = result.links;
            player.loseToDiscardpile(event.cards);
            "step 2";
            player.judge(function (result) {
                return get.suit(result) == "club" ? 2 : -2;
            });
            "step 3";
            if (result.bool != true) player.skip('phaseDraw');
        }
    },
    /* z16_shuileibuzhi: {//旧版水雷布置
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        global: "Z_judge",
        frequent: true,
        usable: 1,
        trigger: {
            source: "damageSource",
        },
        filter: function (event, player) {
            return true;
        },
        content: function () {
            "step 0"
            var cards = get.cards();
            player.addToExpansion(cards[0], 'gain2').gaintag.add('Z');
            game.log("结束标志");
        },
        group: ["z16_shuileibuzhi_bingliang"],
        subSkill: {
            bingliang: {
                enable: "phaseUse",
                filter: function (event, player) {
                    return player.getExpansions('Z').length;
                },
                content: function () {
                    'step 0'
                    var cards = player.getExpansions('Z'), count = cards.length;
                    if (count > 0) {
                        player.chooseCardButton('水雷布置：将一张Z当作兵粮寸断使用', true, cards).set('ai', function (button) {
                            return 1;
                        });
                    }
                    else event.finish();
                    'step 1'
                    event.cards = result.links;
                    player.chooseTarget('选择兵粮寸断的目标', false, function (card, player, target) {
                        return target != player && (get.distance(player, target) == 1);
                    }).set('ai', function (target) {
                        return -get.attitude(player, target);
                    });
                    'step 2'
                    if (result.bool) {
                        player.loseToDiscardpile(event.cards);
                        player.useCard({ name: 'bingliang' }, event.cards, result.targets);
                    }
                },
                ai: {
                    threaten: 1.5,
                },
                "_priority": 0,
            }
        }
    },
    Z_judge: {
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        prompt: function () {
            return "移去一张Z,然后移去判定区内所有花色与之相同的牌";
        },
        filter: function (event, player) {
            return player.countCards('j') && player.getExpansions('Z').length;
        },
        content: function () {
            'step 0'
            var cards = player.getExpansions('Z'), count = cards.length;
            if (count > 0) {
                player.chooseCardButton('移去一张Z,然后移去判定区内所有花色与之相同的牌', true, cards).set('ai', function (button) {
                    return player.countCards('j', function (card) {
                        return get.suit(card, player) == get.suit(button.link);
                    });
                });
            }
            else event.finish();
            'step 1'
            player.loseToDiscardpile(result.links);
            var cards = player.getCards('j', function (card) {
                return get.suit(card, player) == get.suit(result.links);
            });
            player.loseToDiscardpile(cards);
        },
    }, */
    z18_weisebaoxingdong: {
        nobracket: true,
        global: "Z_control",
        usable: 1,
        enable: "phaseUse",
        filter: function (event, player) {
            return player.countCards('h') > 0;
        },
        position: "h",
        filterCard: true,
        selectCard: [1, 2],
        filterTarget: true,
        selectTarget: function () {
            return ui.selected.cards.length;
        },
        delay: false,
        discard: false,
        lose: false,
        complexSelect: true,
        filterOk: function () {
            return ui.selected.targets.length == ui.selected.cards.length;
        },
        multitarget: true,
        multiline: true,
        check: function (card) {
            return 5 - get.value(card);
        },
        content: function () {
            'step 0'
            for (var i = 0; i < cards.length; i++) {
                targets[i].addToExpansion(cards[i], player, 'give').gaintag.add('Z');
            }
        },
        ai: {
            result: {
                target: function (player, target) {
                    return get.attitude(player, target) <= 0;
                },
            },
        },
        prompt: "你可以将至多两张手牌置于等量角色武将牌上,称为Z。", group: ["z18_weisebaoxingdong_huogong"],
        subSkill: {
            huogong: {
                enable: "phaseUse",
                prompt: "你可以移去一张Z,观看一名角色的手牌,然后视为使用一张火攻。",
                filter: function (event, player) {
                    return player.getExpansions('Z').length;

                },
                filterTarget: function (card, player, target) {
                    return target.countCards('h');
                },
                content: function () {
                    'step 0'
                    var cards = player.getExpansions('Z'), count = cards.length;
                    if (count > 0) {
                        player.chooseCardButton('移去一张Z,观看一名角色的手牌,然后视为使用一张火攻。', true, cards).set('ai', function (button) {
                            return 1;
                        });
                    }
                    else { event.finish(); return; }
                    'step 1'
                    event.cards = result.links;
                    player.loseToDiscardpile(event.cards);
                    player.viewHandcards(target);
                    'step 2'
                    if (player.canUse('huogong', target)) player.useCard({
                        name: 'huogong',
                        isCard: true,
                    }, target);
                },
                ai: {
                    threaten: 1.2,
                },
            },

        },
    },
    Z_control: {
        mod: {
            cardUsable(card, player, num) {
                if (player.getExpansions('Z').length && card.name == 'sha') { return num + 1; }
            },
        },
        trigger: {
            player: "useCard",
        },
        forced: true,
        filter: function (event, player) {
            if (player.countCards('he') == 0) return false;
            var cards = player.getExpansions('Z');
            for (var i = 0; i < player.getExpansions('Z').length; i++) {
                if (get.type(cards[i]) == get.type(event.card)) return true;
            }
            return false;
        },
        autodelay: true,
        content: function () {
            "step 0"
            player.chooseToDiscard('he', true);
            "step 1"
            if (result.cards.length) {
                var list = [];
                var Zcards = player.getExpansions('Z');
                for (var i = 0; i < Zcards.length; i++) {
                    //game.log("Z的牌名" + get.name(Zcards[i]));
                    //game.log("弃的牌名" + get.name(result.cards[0]));
                    if (get.name(Zcards[i]) == get.name(result.cards[0])) {
                        list.push(Zcards[i]);
                    }
                }
            }
            //game.log(list);
            if (list.length > 0) {
                player.chooseCardButton('移去一张Z', true, list).set('ai', function (button) {
                    return 1;
                });
            }
            else event.finish();
            'step 2'
            player.loseToDiscardpile(result.links);
        },
    },
    z17_naerweikejingjie: {
        nobracket: true,
        global: "Z_reward",
        enable: "phaseUse",
        audio: "ext:舰R牌将/audio/skill:true",
        filter: function (event, player) {
            return player.countCards('h') > 0;
        },
        prompt: "出牌阶段,你可以将任意张手牌置于武将牌上,称为Z,然后将一名角色至多等量张手牌置于其武将牌上,也称为Z。",

        selectTarget: 1,
        filterTarget: true,
        content: function () {
            'step 0'
            player.chooseToDiscard(get.prompt('z17_naerweikejingjie', event.target), [1, Infinity], 'he').set('ai', card => {
                if (ui.selected.cards.length >= _status.event.max) return 0;
                if (_status.event.goon) return 4.5 - get.value(card);
                return 0;
            }).set('max', event.target.countDiscardableCards(player, 'he')).set('goon', get.attitude(player, event.target) < 0).set('logSkill', ['z17_naerweikejingjie', event.target]);
            'step 1'
            if (result.bool) {
                var num = result.cards.length;
                player.addToExpansion(result.cards, player, 'give').gaintag.add('Z');
                if (event.target.countDiscardableCards(player, 'he')) player.discardPlayerCard('弃置' + get.translation(event.target) + get.cnNumber(num) + '张牌', num, 'he', event.target, true);
            }
            'step 2'
            if (result.bool) {
                event.target.addToExpansion(result.cards, event.target, 'give').gaintag.add('Z');
            }
        },
        ai: {
            order: function (item, player) {
                if (player.hasHistory('useSkill', function (evt) {
                    return evt.skill == "z17_naerweikejingjie";
                })) return 0;
                return 7;
            },
            result: {
                player: function (player) {
                    return -1;
                },
                target: function (player, target) {
                    const att = get.attitude(player, target);
                    const hs = target.getDiscardableCards(player, 'h');
                    const es = target.getDiscardableCards(player, 'e');
                    if (!hs.length && !es.length) return 0;
                    if (att > 0) {
                        if (target.isDamaged() && es.some(card => card.name == 'baiyin') &&
                            get.recoverEffect(target, player, player) > 0) {
                            if (target.hp == 1 && !target.hujia) return 1.6;
                        }
                        if (es.some(card => {
                            return get.value(card, target) < 0;
                        })) return 1;
                        return -1.5;
                    }
                    else {
                        const noh = (hs.length == 0 || target.hasSkillTag('noh'));
                        const noe = (es.length == 0 || target.hasSkillTag('noe'));
                        const noe2 = (noe || !es.some(card => {
                            return get.value(card, target) > 0;
                        }));
                        if (noh && noe2) return 1.5;
                        return -1.5;
                    }
                },
            },
        },
    },
    Z_reward: {
        direct: true,
        charlotte: true,
        trigger: {
            player: "damageBegin3",
        },
        filter: function (event, player) {
            return event.source && event.source.isIn()
                && player.getExpansions('Z').length > 0;
        },
        forced: true,
        logTarget: "source",
        content: function () {
            trigger.source.draw(1);
            /*'step 0'
            trigger.source.chooseCardButton('选择获得一张“Z”', player.getExpansions('Z'), true);
            'step 1'
            if (result.bool) {
                trigger.source.gain(result.links, player, 'give');
            }*/
        },
    },
    z21_tuxi: {
        nobracket: true,
        global: "z21_tuxi_discard",
        trigger: {
            player: "phaseUseBegin",
        },
        frequent: true,
        filter: function (event, player) {
            return game.hasPlayer(current => player.inRange(current));
        },
        content: function () {
            'step 0'
            player.chooseTarget(get.prompt2('z21_tuxi'), function (card, player, target) {
                return target != player && player.inRange(target);
            }).set('ai', function (target) {
                if (get.attitude(_status.event.player, target) < 0) {
                    return 1;
                }
                return 0;
            });
            'step 1'
            if (result.bool) {
                event.target = result.targets[0];
                player.choosePlayerCard(event.target, 'he', true);
            } else {
                event.finish();
            }
            'step 2'
            if (result.bool) {
                player.addToExpansion(result.cards, event.target, 'give').gaintag.add('Z');
            }
        },
        ai: {
            order: 4,
            expose: 0.2,
            result: {
                target: -1,
                player: function (player, target) {
                    if (target.countCards('h') == 0) return 0;
                    if (target.countCards('h') == 1) return -0.1;
                    return -0.5;
                },
            },
            threaten: 1.1,
        },
        prompt: "你可以选择一名攻击范围内的角色,将其一张牌置于你的武将牌上,称为Z。", //group: ["z21_tuxi_discard"],
        subSkill: {
            discard: {
                trigger: {
                    player: "useCardToPlayered",
                },
                filter: function (event, player) {
                    //game.log(event.player);
                    return player.getExpansions('Z').length && player != event.target;
                },
                check: function (event, player) {
                    return get.attitude(player, event.target) < 0;
                },
                frequent: true,
                content: function () {
                    'step 0'
                    var cards = player.getExpansions('Z'), count = cards.length;
                    if (count > 0) {
                        player.chooseCardButton('你可以令' + get.translation(trigger.target) + '随机弃置一张牌并弃置一张Z', true, cards).set('ai', function (button) {
                            return 1;
                        });
                    }
                    else { event.finish(); return; }
                    'step 1'
                    event.cards = result.links;
                    player.loseToDiscardpile(event.cards);
                    'step 2'
                    trigger.target.randomDiscard(1);
                },
            },
        },
    },
    z22_tuxixiawan: {
        nobracket: true,
        global: "z22_tuxixiawan_discard",
        trigger: {
            player: "phaseUseBegin",
        },
        frequent: true,
        filter: function (event, player) {
            return true;
        },
        content: function () {
            'step 0'
            player.chooseTarget(get.prompt2('z22_tuxixiawan'), function (card, player, target) {
                return target != player && target.countCards("he");
            }).set('ai', function (target) {
                if (get.attitude(_status.event.player, target) < 0) {
                    return 1;
                }
                return 0;
            });
            'step 1'
            if (result.bool) {
                event.target = result.targets[0];
                player.choosePlayerCard(event.target, 'he', true);
            } else {
                event.finish();
            }
            'step 2'
            if (result.bool) {
                player.addToExpansion(result.cards, player, 'give').gaintag.add('Z');
            }
        },
        ai: {
            order: 4,
            expose: 0.2,
            result: {
                target: -1,
                player: function (player, target) {
                    if (target.countCards('h') == 0) return 0;
                    if (target.countCards('h') == 1) return -0.1;
                    return -0.5;
                },
            },
            threaten: 1.1,
        },
        prompt: "你可以将任意角色一张牌置于自己武将牌上称为Z", //group: ["z22_tuxixiawan_discard"],
        subSkill: {
            discard: {
                trigger: {
                    global: "damageSource",
                },
                filter: function (event, player) {
                    return player.getExpansions('Z').length;
                },
                check: function (event, player) {
                    return get.attitude(player, event.source) < 0;
                },
                content: function () {
                    'step 0'
                    var cards = player.getExpansions('Z'), count = cards.length;
                    if (count > 0) {
                        player.chooseCardButton('你可以移去一张Z令' + get.translation(event.source) + '进行一次判定,本回合无法使用或打出与判定牌相同颜色的牌', true, cards).set('ai', function (button) {
                            return 1;
                        });
                    }
                    else event.finish();
                    'step 1'
                    event.cards = result.links;
                    player.loseToDiscardpile(event.cards);
                    'step 2'
                    player.judge(function (card) {

                        if (!trigger.source.hasSkill('cardsDisabled_color')) {
                            trigger.source.addTempSkill('cardsDisabled_color', { player: 'phaseAfter' });
                        }
                        trigger.source.markAuto('cardsDisabled_color', [get.color(card)]);
                    });
                    event.finish();
                },
            },
        },
    },
    cardsDisabled_color: {
        nobracket: true,
        charlotte: true,
        direct: true,
        trigger: {
            player: ['phaseEnd', 'dieAfter'],
        },
        intro: {
            content: "不可使用的颜色：$",
            onunmark: true,
        },
        mod: {
            cardEnabled: function (card, player) {
                var color = get.color(card);
                if (player.storage.cardsDisabled_color.includes(color)) return false;
            },
            cardUsable: function (card, player) {
                var color = get.color(card);
                if (player.storage.cardsDisabled_color.includes(color)) return false;
            },
            cardRespondable: function (card, player) {
                var color = get.color(card);
                if (player.storage.cardsDisabled_color.includes(color)) return false;
            },
            cardSavable: function (card, player) {
                var color = get.color(card);
                if (player.storage.cardsDisabled_color.includes(color)) return false;
            },
        },
        content: function () {
            player.unmarkSkill('cardsDisabled_color');
        },
        "_priority": 0,
    },
    matapanjiaozhijian: {
        audio: "ext:舰R牌将/audio/skill:true",

        frequent: true,
        trigger: {
            player: "useCardToPlayered",
        },
        filter: function (event, player) {
            if (event.getParent().triggeredTargets3.length > 1) return false;
            if (get.type(event.card) == 'trick') return true;
            return false;
        },
        ai: {
            "directHit_ai": true,
            result: {
                target: function (player, target) {
                    var cards = ui.selected.cards.slice(0);
                    var names = [];
                    for (var i of cards) names.add(i.name);
                    if (names.length < player.hp) return 0;
                    if (player.hasUnknown() && (player.identity != 'fan' || !target.isZhu)) return 0;
                    if (get.attitude(player, target) >= 0) return -20;
                    return 1;
                },
            },
        },
        content: function () {
            'step 0'
            player.chooseToDiscard(get.prompt('matapanjiaozhijian', trigger.target), "弃置任意张牌,然后指定至多等量名角色为目标", [1, Infinity], 'hes').set('ai', card => {
                if (ui.selected.cards.length >= _status.event.max) return 0;
                if (_status.event.goon) return 4.5 - get.value(card);
                return 0;
            }).set('max', player.countDiscardableCards(player, 'hes')).set('goon', get.attitude(player, trigger.target) < 0);
            'step 1'
            if (result.bool) {
                var num = result.cards.length;
                player.chooseTarget(get.prompt('matapanjiaozhijian'),
                    [1, num], function (card, player, target) {
                        return _status.event.targets.includes(target);
                    }).set('ai', function (target) {
                        return -get.attitude(target, player);
                    }).set('targets', trigger.targets);
            }
            'step 2'
            if (result.bool) {
                game.log(result.targets, '不能响应', trigger.card);
                for (var i = 0; i < result.targets.length; i++) {
                    trigger.directHit.push(result.targets[i]);
                }
            }

        },
    },
    zhongbangtuxi: {
        nobracket: true,
        unique: true,
        mark: true,
        skillAnimation: true,
        limited: true,
        animationColor: "metal",
        audio: "ext:舰R牌将/audio/skill:true",
        init: function (player) {
            player.storage.zhongbangtuxi = false;
        },
        enable: "phaseUse",
        selectCard: [1, Infinity],
        filterCard: {
            color: "red",
        },
        selectTarget: function () {
            return ui.selected.cards.length;
        },
        filterTarget: true,
        position: "hes",
        check: function (card) {
            return 12 - get.value(card);
        },
        filterOk: function () {
            return ui.selected.targets.length == ui.selected.cards.length;
        },
        filter: function (event, player) {
            if (player.storage.zhongbangtuxi) return false;
            return true;//!player.getStat('damage');
        },
        multitarget: true,
        multiline: true,
        content: function () {

            player.awakenSkill('zhongbangtuxi');
            player.storage.zhongbangtuxi = true;

            game.log(event.targets, '受到一点火焰伤害');
            for (var i = 0; i < targets.length; i++) {
                targets[i].damage('fire');
            }

        },
        ai: {
            order: 9,
            fireAttack: true,
            result: {
                target(player, target) {
                    if (player.hasUnknown()) return 0;
                    const att = get.sgn(get.attitude(player, target));
                    const targets = game.filterPlayer(target => get.damageEffect(target, player, player, "fire") && (target.hp <= 3 && !target.hasSkillTag("filterDamage", null, { player: player })));
                    if (!targets.includes(target)) return 0;
                    return att * get.damageEffect(target, player, player, "fire");//如果返回值为负数,会对敌方发动,如果返回值为正,会对右方发动
                },
            },
            mark: true,
            intro: {
                content: "limited",
            },
            init: (player, skill) => (player.storage[skill] = false),
            "_priority": 0,
        },
    },
    huangjiahaijunderongyao: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        trigger: {
            player: "damageBegin3",
            source: "damageBegin1",
        },
        forced: true,
        filter(event, player) {
            if (!(event.source && event.source.isIn())) return false;
            var target = (player == event.player) ? event.source : event.player;
            //game.log(event.player != event.source && target.countCards("h") && target.isAlive());
            return event.player != event.source && target.countCards("h") && target.isAlive() && event.notLink();
        },
        content: function () {
            'step 0'
            var target = (player == trigger.player) ? trigger.source : trigger.player;
            var card = player.discardPlayerCard(target, "he", true);

            'step 1'
            //game.log("点数为" + get.number(result.cards[0]));
            //game.log(trigger.player);
            if (get.number(result.cards[0]) <= trigger.player.countCards("h")) {
                game.log("伤害+1");
                trigger.num++;
            }
        },
    },
    huangjiaxunyou: {
        nobracket: true,
        mod: {
            globalFrom(from, to, distance) {
                return distance - 1;
            },
            /*globalTo(from, to, distance) {
                return distance + 1;
            },*/
        },
    },
    tianshi: {
        nobracket: true,
        unique: true,
        zhuSkill: true,
        global: "tianshi2",
    },
    tianshi2: {//新版标司马懿鬼才
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:2",
        trigger: {
            global: "judge",
        },
        frequent: true,
        //preHidden: true,
        filter(event, player) {
            if (player.group != 'RN') return false;
            if (!event.player.hasSkill("tianshi")) return false;
            if (player.hasSkill("tianshi")) return false;
            return player.countCards(get.mode() == 'guozhan' ? 'hes' : 'hs') > 0;
        },
        async content(event, trigger, player) {
            const { result: { bool: chooseCardResultBool, cards: chooseCardResultCards } } = await player.chooseCard(get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' +
                get.translation(trigger.player.judging[0]) + ',' + get.prompt('tianshi2'), get.mode() == 'guozhan' ? 'hes' : 'hs', card => {
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
                }).set('judging', trigger.player.judging[0]).setHiddenSkill('tianshi2');
            if (!chooseCardResultBool) return;
            player.respond(chooseCardResultCards, 'tianshi2', 'highlight', 'noOrdering');
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
    jishiyu_R: {//天妒
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:2",
        usable: 3,
        trigger: {
            player: "judgeEnd",
        },
        audio: "ext:舰R牌将/audio/skill:true",
        //preHidden: true,
        frequent(event) {
            //if(get.mode()=='guozhan') return false;
            return event.result.card.name !== 'du';
        },
        check(event) {
            return event.result.card.name !== 'du';
        },
        filter(event, player) {
            if (player.isMinHp()) {
                return get.position(event.result.card, true) == 'o';
            }
            return 0;
        },
        async content(event, trigger, player) {
            player.gain(trigger.result.card, 'gain2');
        },
        "_priority": 0,
    },
    jishiyu_R1: {
        nobracket: true,
        group: ["jishiyu_R1_use", "jishiyu_R1_respond"],
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
                    player.judge("jishiyu_R1", function (card) {
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
                    player.judge("jishiyu_R1", function (card) {
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
    yongbuchenmodezhanjian: {
        nobracket: true,
        unique: true,
        zhuSkill: true,
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

    tiaobangzuozhan: {
        nobracket: true,
        enable: "chooseToUse",
        usable: 1,
        viewAs: {
            name: "juedou",
            isCard: true,
        },
        filterCard: () => false,
        selectCard: -1,
        log: false,
        precontent: function () {
            'step 0'
            player.logSkill('tiaobangzuozhan');
        },
        ai: {
            order: function () {
                return get.order({ name: 'juedou' }) - 0.5;
            },
            wuxie: function (target, card, player, viewer, status) {
                if (player === game.me && get.attitude(viewer, player._trueMe || player) > 0) return 0;
                if (status * get.attitude(viewer, target) * get.effect(target, card, player, target) >= 0) return 0;
            },
            basic: {
                order: 5,
                useful: 1,
                value: 5.5,
            },
            result: {
                target: -1.5,
                player: function (player, target, card) {
                    if (player.hasSkillTag('directHit_ai', true, {
                        target: target,
                        card: card,
                    }, true)) {
                        return 0;
                    }
                    if (get.damageEffect(target, player, target) > 0 && get.attitude(player, target) > 0 && get.attitude(target, player) > 0) {
                        return 0;
                    }
                    var hs1 = target.getCards('h', 'sha');
                    var hs2 = player.getCards('h', 'sha');
                    if (hs1.length > hs2.length + 1) {
                        return -2;
                    }
                    var hsx = target.getCards('h');
                    if (hsx.length > 2 && hs2.length == 0 && hsx[0].number < 6) {
                        return -2;
                    }
                    if (hsx.length > 3 && hs2.length == 0) {
                        return -2;
                    }
                    if (hs1.length > hs2.length && (!hs2.length || hs1[0].number > hs2[0].number)) {
                        return -2;
                    }
                    return -0.5;
                },
            },
            tag: {
                respond: 2,
                respondSha: 2,
                damage: 1,
            },
            threaten: 1.3,
        },
        group: ["tiaobangzuozhan_self", "tiaobangzuozhan_damage"],
        subSkill: {
            self: {
                popup: false,
                trigger: {
                    player: "damageBegin2",
                },
                forced: true,
                filter: function (event, player) {
                    var evt = event.getParent();
                    return evt.skill == 'tiaobangzuozhan' && evt.player == player;
                },
                content: function () {
                    trigger.source.gainPlayerCard(player, true, 'h');
                    trigger.cancel();
                },
                sub: true,
                "_priority": 0,
            },
            damage: {
                popup: false,
                trigger: {
                    source: "damageSource",
                },
                forced: true,
                filter: function (event, player) {
                    var evt = event.getParent();
                    return evt.skill == 'tiaobangzuozhan' && evt.player == player;
                },
                content: function () {
                    //player.viewHandcards(trigger.player);
                    player.gainPlayerCard(trigger.player, 'hej', true, 'visible');
                },
                sub: true,
                "_priority": 0,
            },
        },
    },
    baixiang: {
        nobracket: true,
        mod: {
            cardEnabled: function (card, player) {
                if (get.subtype(card) == 'equip2') return false;
            },
        },
        trigger: {
            player: "damageBegin4",
        },
        filter: function (event) {
            return event.hasNature('thunder');
        },
        forced: true,
        content: function () {
            trigger.cancel();
        },
        ai: {
            nothunder: true,
            effect: {
                target: function (card, player, target, current) {
                    if (get.tag(card, 'thunderDamage')) return 'zerotarget';
                },
            },
        },
        "_priority": 0,
    },
    guochuan: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: ["damageBegin4"],
        },
        //forced: true,
        filter(event, player, name) {
            return event.num > 0;
        },
        check: function (event, player) {
            return true;
        }, content: function () {
            "step 0"
            player.chooseToDiscard("弃置一张防具牌或点取消失去一点体力", { subtype: "equip2" }, "hes");
            "step 1"
            if (!result.bool) {
                player.loseHp();
                // 将体力流失计入原始伤害来源的统计
                if (trigger.source) {
                    var stat = trigger.source.getStat();
                    if (!stat.damage) stat.damage = 0;
                    stat.damage += 1;
                }
            }
            //game.log("过穿流失体力");
            event.num = trigger.num;
            trigger.cancel();
            "step 2"
            player.chooseTarget(get.prompt("guochuan"), "你可以选择一个目标令其承受此伤害并摸牌", function (card, player, target) {
                //game.log("过穿选择目标" + target.name + (get.distance(player, target) <= 1) + (target != trigger.source));
                return player != target && get.distance(player, target) <= 1 && target != trigger.source;
            }).set('ai', function (target) {
                var att = get.attitude(_status.event.player, target);
                var trigger = _status.event.getTrigger();
                var eff = get.damageEffect(target, trigger.source, target);
                if (att == 0) return 0.1;
                return -att;
            });
            "step 3"
            if (result.bool) {
                var target = result.targets[0];
                target.damage(event.num, trigger.source || "nosource", "nocard");
                target.draw(event.num);
            }
        },
        ai: {
            "maixie_defend": true,
            effect: {
                target(card, player, target) {
                    if (player.hasSkillTag("jueqing", false, target)) return;
                    if (get.tag(card, "damage")) return 0.7;
                },
            },
        },
        "_priority": 0,
    },
    zuihouderongyao: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        init: function (player) {
            if (typeof player.storage.zuihouderongyao === 'undefined') player.storage.zuihouderongyao = 0;
        },
        mark: true,
        marktext: "距离",
        intro: {
            name: "攻击距离",
            content: function (storage, player) {
                var str = "你的攻击距离增加" + get.translation(player.getStorage("zuihouderongyao") + 2 * game.dead.length);
                return str;
            },
        },
        mod: {
            attackRange: function (from, distance) {
                var number = 2 * game.dead.length;
                return distance = (distance + number + from.storage.zuihouderongyao);
            },
            /* maxHandcard: function (player, num) {
                var number = 2 * game.dead.length;
                return num + number;
            }, */
        },
        trigger: {
            player: "phaseDrawBegin2",
        },
        filter: function (event, player) {
            return !event.numFixed;
        },
        forced: true,
        content: function () {
            "step 0";
            player.chooseControl("zuihouderongyao_less", "zuihouderongyao_more", function () {
                var player = get.player();
                if (player.countCards("h") >= 3) {
                    return "zuihouderongyao_less";
                }
                if (player.hp - player.countCards("h") > 1) {
                    return "zuihouderongyao_more";
                }
                return "zuihouderongyao_more";
            });
            "step 1";
            if (result.control == "zuihouderongyao_less") {
                player.storage.zuihouderongyao++;
            } else if (result.control == "zuihouderongyao_more") {
                trigger.num++;
                player.storage.zuihouderongyao--;
            }
        },
        "_priority": 0,
    },
    '29jienaerxun': {

        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        trigger: {
            player: "useCardToPlayer",
        },
        direct: 1,
        usable: 1,
        filter: function (event, player) {
            return player != event.target && (event.card.name == 'sha' || event.card.name == 'sheji9');
        },
        content: function () {
            //game.log('29jienaerxun');
            if (player.getAttackRange() > 3) {
                game.log(trigger.card, '不可被', trigger.target, '响应');
                trigger.directHit.add(trigger.target);
            }
            /* if (player.isMaxHp()) {
                game.log(trigger.card, '对', trigger.target, '的伤害+1');
                var map = trigger.getParent().customArgs, id = trigger.target.playerid;
                if (!map[id]) map[id] = {};
                if (!map[id].extraDamage) map[id].extraDamage = 0;
                //game.log(map[id].extraDamage);
                map[id].extraDamage++;
            } */
        },
        ai: {
            threaten: 1.3,
        },
    },
    hongseqiangwei: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        marktext: "花",
        intro: {
            content: "expansion",
            markcount: "expansion",
        },
        trigger: {
            player: "useCardAfter",
        },
        filter: function (event, player) {
            return get.tag(event.card, 'damage');
        },
        frequent: true,
        content: function () {
            'step 0'
            player.chooseCard(get.prompt('hongseqiangwei', event.target), 1, 'h').set('ai', card => {
                if (!game.players[(get.number(card) - 1) % game.countPlayer()].isAlive()) { return 0; }
                if (get.attitude(game.players[(get.number(card) - 1) % game.countPlayer()] < 0)) { return 0; }
                return 9 - get.value(card);
            });
            'step 1'
            if (result.bool) {
                var num = result.cards.length;
                player.addToExpansion(result.cards, player, 'give').gaintag.add('hongseqiangwei');
                player.draw(1);
            }
        },
        group: ["hongseqiangwei_damage"],
        subSkill: {
            damage: {
                forced: true,
                trigger: {
                    global: "damageBegin3",
                },
                filter: function (event, player) {
                    if (event.num <= 0) { return 0; }
                    var cards = player.getExpansions('hongseqiangwei');
                    var num = event.player.getSeatNum();
                    //game.log(num);
                    for (var i = 0; i < player.getExpansions('hongseqiangwei').length; i++) {
                        if (get.number(cards[i]) % game.countPlayer() == num) {
                            return event.player.isAlive();
                        }
                    }
                    return 0;
                },
                content: function () {
                    "step 0"
                    trigger.cancel();
                    "step 1"
                    var num = trigger.player.getSeatNum();
                    var list = [];
                    var Fcards = player.getExpansions('hongseqiangwei');
                    for (var i = 0; i < Fcards.length; i++) {
                        //game.log("蔷薇的点数" + get.number(Fcards[i]));
                        if (get.number(Fcards[i]) % game.countPlayer() == num) {
                            list.push(Fcards[i]);
                        }
                    }
                    //game.log(list);
                    if (list.length > 0) {
                        player.chooseCardButton('移去一张蔷薇', true, list).set('ai', function (button) {
                            return 1;
                        });
                    }
                    else event.finish();
                    'step 2'
                    player.loseToDiscardpile(result.links);
                },
            },
        },
    },
    bujushenfeng: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        mod: {
            maxHandcardBase: function (player, num) {
                return player.maxHp;
            },
        },
        //preHidden: true,
        trigger: {
            player: "damageEnd",
        },
        filter(event, player) {
            return get.itemtype(event.cards) == "cards" && get.position(event.cards[0], true) == "o";
        },
        async content(event, trigger, player) {
            player.gain(trigger.cards, "gain2");
        },
        ai: {
            maixie: true,
            "maixie_hp": true,
            effect: {
                target(card, player, target) {
                    if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
                    if (get.tag(card, "damage")) return [1, 0.55];
                },
            },
        },
        "_priority": 0,
    },
    jingruizhuangbei: {
        nobracket: true,
        group: ["jingruizhuangbei_mopai", "jingruizhuangbei_fencha"],
        subSkill: {
            mopai: {
                audio: "ext:舰R牌将/audio/skill:true",
                trigger: {
                    source: "damageSource",
                },
                frequent: true,
                filter: function (event, player) {
                    //if (event._notrigger.includes(event.player)) return false;
                    //game.log("salemu_R1");
                    if (!player.getEquip(1)) return false;
                    //game.log("salemu_R2");
                    return (event.card && (event.card.name == 'sha' || event.card.name == 'sheji9') && event.player.isIn());
                },
                content: function () {
                    //game.log("salemu_R3");
                    player.draw(1);
                },
                "_priority": 0,
                sub: true,
            },
            fencha: {
                audio: "ext:舰R牌将/audio/skill:true",
                shaRelated: true,
                sub: true,
                trigger: {
                    player: "useCard2",
                },
                filter: function (event, player) {
                    if (event.card.name != "sha" && event.card.name != "sheji9") return false;
                    return game.hasPlayer(function (current) {
                        return !event.targets.includes(current) && player.canUse(event.card, current);
                    });
                },
                frequent: true,
                async content(event, trigger, player) {
                    const judgeEvent = player.judge(card => {
                        //game.log(get.color(card));
                        //game.log(get.color(trigger.card));
                        if (get.color(card) == get.color(trigger.card)) return 1;
                        return 0;
                    });
                    judgeEvent.judge2 = result => result.bool;
                    const {
                        result: { judge },
                    } = await judgeEvent;
                    //game.log("judge" + judge);
                    if (judge != 1) return;
                    const {
                        result: { bool, targets },
                    } = await player
                        .chooseTarget(get.prompt("jingruizhuangbei"), "为" + get.translation(trigger.card) + "增加一个目标", (card, player, target) => {
                            const trigger = get.event().getTrigger();
                            return !trigger.targets.includes(target) && player.canUse(trigger.card, target);
                        })
                        .set("card", trigger.card)
                        .set("ai", target => {
                            const player = get.event("player"),
                                trigger = get.event().getTrigger();
                            return get.effect(target, trigger.card, player, player);
                        });
                    if (bool) {
                        player.logSkill("jingruizhuangbei", targets);
                        trigger.targets.addArray(targets);
                    }

                },
                "_priority": 0,
                sub: true,
            },
        },
    },
    dananbusi: {
        nobracket: true,
        unique: true,
        trigger: {
            player: "damageBegin4",
        },
        mark: true,
        skillAnimation: true,
        limited: true,
        animationColor: "orange",
        init(player) {
            player.storage.dananbusi = false;
        },
        filter(event, player) {
            if (player.storage.dananbusi) return false;
            if (event.num >= player.hp) return true;
            return false;
        },
        content() {
            player.awakenSkill("dananbusi");
            player.storage.dananbusi = true;
            trigger.cancel();
        },
        ai: {
            order: 1,
            skillTagFilter(player, arg, target) {
                if (player != target || player.storage.dananbusi) return false;
            },
            save: true,
            result: {
                player(player) {
                    return 10;
                },
            },
            threaten(player, target) {
                if (!target.storage.dananbusi) return 0.6;
            },
        },
        intro: {
            content: "limited",
        },
        "_priority": 0,
    },
    houfu: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        content: function () {
            "step 0"
            player.chooseTarget(get.prompt2("houfu"), function (card, player, target) {
                return target != player;
            })
                .set("ai", function (target) {
                    var player = get.player();
                    var att = get.attitude(player, target);
                    return att;
                });
            "step 1"
            //game.log(result.targets);
            if (result.targets) {
                event.targets0 = result.targets[0];
                event.targets0.chooseControlList([
                    '视为对' + player.name + '使用一张杀',
                    '令' + player.name + '从牌堆中获得一张基本牌',
                ]).set('prompt', get.prompt('houfu', event.targets0)).setHiddenSkill('houfu').set('ai', function () {
                    //var player = get.player();
                    //game.log(get.attitude(event.target, player));
                    if (get.attitude(event.targets0, player) < 0) {
                        return 0;
                    }
                    return 1;

                });
            }
            "step 2"
            if (result.index == 0) {
                game.log('视为对' + player.name + '使用一张杀');
                var card = {
                    name: "sha",
                    isCard: true,
                };
                if (event.targets0.canUse(card, player, false)) {
                    event.targets0.useCard(card, player, false);
                }
            }
            else if (result.index == 1) {
                game.log('令' + player.name + '从牌堆中获得一张基本牌');
                var card = get.cardPile(function (card) {
                    return get.type(card) == "basic";
                });
                if (card) {
                    game.log("在牌堆中查找到了基本牌");
                    player.gain(card, 'gain2');
                }
            }
        },
        ai: {
            order: 7.2,
            result: {
                player: 1,
            },
        },
        "_priority": 0,

    },

    yuanyangpoxi: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        mod: {
            cardUsable: function (card, player, num) {
                if (!player.storage.duanwan && card.name == "sha") return num - 1;
            },
        },
        trigger: {
            source: "damageBegin1",
        },
        filter(event, player) {
            return event.card && get.type(event.card) == "trick" && player.inRange(event.player) && event.notLink();
        },
        forced: true,
        async content(event, trigger, player) {
            trigger.num++;
        },
        ai: {
            damageBonus: true,
        },
        "_priority": 0,
    },
    juejingfengsheng: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        init: function (player) {
            player.storage.juejingfengsheng = [];
        },
        trigger: {
            global: "roundStart",
            //player: "dying",
        },
        filter: function (event, player) {
            if (player.storage.juejingfengsheng.length >= 13) return false;
            return player.countCards("hes");
        },
        frequent: true,
        content: function () {
            "step 0"
            player
                .chooseCard("hes", false, [1, Infinity], get.prompt2("juejingfengsheng"), function (card, player) {
                    if (player.storage.juejingfengsheng.includes(get.number(card))) return false;
                    if (!ui.selected.cards.length) return true;
                    var number = get.number(card);
                    for (var i of ui.selected.cards) {
                        if (get.number(i, player) == number) return false;
                    }
                    return true;
                })
                .set("complexCard", true)
                .set("ai", card => 8 - get.value(card));
            "step 1"
            if (result.bool) {
                event.num = result.cards.length;
                for (var i = 0; i < event.num; i++) {
                    player.markAuto("juejingfengsheng", get.number(result.cards[i]));
                }
                player.discard(result.cards);
                player.gainMaxHp(event.num);
                player.recover(event.num);
                //player.draw(event.num);
            }
        },
        "_priority": 0,
        ai: {
            threaten: function (player, target) {
                if (target.maxHp <= 4) return 1.2;
                if (target.maxHp <= 6) return 1;
                return 0.8;
            },
        },
    },
    saqijian: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        mod: {
            aiValue(player, card, num) {
                if (get.name(card) != "wuxie" && get.color(card) != "black") return;
                var cards = player.getCards("hes", function (card) {
                    return get.name(card) == "wuxie" || get.color(card) == "black";
                });
                cards.sort(function (a, b) {
                    return (get.name(b) == "wuxie" ? 1 : 2) - (get.name(a) == "wuxie" ? 1 : 2);
                });
                var geti = function () {
                    if (cards.includes(card)) {
                        return cards.indexOf(card);
                    }
                    return cards.length;
                };
                if (get.name(card) == "wuxie") return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
                return Math.max(num, [6, 4, 3][Math.min(geti(), 2)]);
            },
            aiUseful() {
                return lib.skill.kanpo.mod.aiValue.apply(this, arguments);
            },
        },
        locked: false,
        audio: "ext:舰R牌将/audio/skill:2",
        enable: "chooseToUse",
        filterCard(card) {
            return get.color(card) == "black";
        },
        viewAsFilter(player) {
            return player.countCards("hes", { color: "black" }) > 0;
        },
        viewAs: {
            name: "wuxie",
        },
        position: "hes",
        prompt: "将一张黑色牌当无懈可击使用",
        check(card) {
            var tri = _status.event.getTrigger();
            if (tri && tri.card && tri.card.name == "chiling") return -1;
            return 8 - get.value(card);
        },
        threaten: 1.2,
        ai: {
            basic: {
                useful: [6, 4, 3],
                value: [6, 4, 3],
            },
            result: {
                player: 1,
            },
            expose: 0.2,
        },
        group: ["fangkong2", "saqijian_ying"],
        subSkill: {
            ying: {
                charlotte: true,
                trigger: {
                    player: "logSkill",
                },
                frequent: true,
                filter: function (event, player) {
                    return event.skill == 'fangkong2' || event.skill == 'hangmucv';
                },
                content: function () {
                    player.gain(lib.card.ying.getYing(1), "gain2");
                },
                popup: false,
                sub: true,
                "_priority": 0,
            },
        },
        "_priority": 0,
    },
    jupaohuoli: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:2",
        trigger: {
            source: "damageBegin4",
        },
        frequent: true,
        filter: function (event, player) {
            return event.card && event.card.name == "sha" && player.countCards("h") > event.player.countCards("h") && event.notLink();
        },
        content: function () {
            trigger.num += 1;
        },
    },
    guanjianyiji: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            global: "useCardToPlayered",
        },
        filter: function (event, player) {

            return event.player == player && !player.getStorage("guanjianyiji_used").includes(event.target);
        },
        check: function (event, player) {
            return get.attitude(player, event.target) < 0;
        },
        content: function () {
            "step 0";
            player.choosePlayerCard(trigger.target, "he", 1, get.prompt("guanjianyiji", trigger.target), true).set("forceAuto", true);
            "step 1";
            if (result.bool && result.links.length) {
                var target = trigger.target;
                target.addSkill("guanjianyiji_pojun");
                target.addToExpansion(result.cards, "giveAuto", target).gaintag.add("guanjianyiji_pojun");
            }
            "step 2";
            if (!trigger.target.hasSkill("zhanliebb")) {
                player.addTempSkill("guanjianyiji_used", { global: "phaseEnd" });
                player.markAuto("guanjianyiji_used", [trigger.target]);
            }
        },
        mark: false,
        sub: true,
        subSkill: {
            used: {
                onremove: true,
                charlotte: true,
                sub: true,
                "_priority": 0,
            },
            pojun: {
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                forced: true,
                popup: false,
                charlotte: true,
                filter: function (event, player) {
                    return player.getExpansions("guanjianyiji_pojun").length > 0;
                },
                content: function () {
                    "step 0";
                    var cards = player.getExpansions("guanjianyiji_pojun");
                    player.gain(cards, "draw");
                    game.log(player, "收回了" + get.cnNumber(cards.length) + "张牌");
                    "step 1";
                    player.removeSkill("guanjianyiji_pojun");
                },
                intro: {
                    markcount: "expansion",
                    mark: function (dialog, storage, player) {
                        var cards = player.getExpansions("guanjianyiji_pojun");
                        if (player.isUnderControl(true)) dialog.addAuto(cards);
                        else return "共有" + get.cnNumber(cards.length) + "张牌";
                    },
                },
                "_priority": 0,
            },
        },
    },
    duikongzhiwei: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        lastDo: true,
        trigger: {
            global: "useCardToPlayered",
        },
        filter: function (event, player) {
            if (event.getParent().triggeredTargets3.length > 1) return false;//万箭要作用七个目标,而你不想跟着遍历七次技能。
            if (get.type(event.card) != 'trick') return false;
            if (get.info(event.card).multitarget) return false;
            if (!player.countCards('he')) return false;
            if (event.targets.length < 2) return false;
            for (var i = 0; i < event.targets.length; i++) {
                if (!event.targets[i].hasSkill("fangkong2_aibiexuan")) return true;
            } return false;
        },
        frequent: true,
        round: 1,
        content: function () {
            'step 0'
            var next = player.chooseCardTarget({
                prompt: get.prompt('对空直卫保护对象'),
                prompt2: ('当一名角色使用的锦囊牌指定了至少两名角色为目标时,<br>你可弃置一张牌令此牌对距离你一以内的角色无效。'),
                position: 'hejs',
                selectCard: function () {
                    return 1;
                },
                selectTarget: function () {
                    return -1;
                },
                filterCard: function (card, player) {
                    return lib.filter.cardDiscardable(card, player);
                },
                filterTarget: function (card, player, target) {
                    if (_status.event.targets.includes(target) && !target.hasSkill('fangkong2_aibiexuan')) {
                        return get.distance(player, target) <= 1;
                    }
                },//选择事件包含的目标,同trigger的目标。有其他同技能的角色时,ai不要重复选择目标。
                ai1: function (card) {
                    return 7 - get.useful(card);
                },//建议卡牌以7为标准就行,怕ai不救队友,所以调高了。同时ai顺次选择卡牌时不要选太多卡牌,要形成持续的牵制。
                /* ai2: function (target) {
                    var trigger = _status.event.getTrigger();
                    return -get.effect(target, trigger.card, trigger.player, _status.event.player);
                },  */
                targets: trigger.targets,//这个代码不能照搬到content以外的地方。贯石斧、朱雀羽扇有类似代码。还有recover版的。
            });
            'step 1'
            if (result.bool) {//只能判断你有没有选择,然后给你true与false,没其他文本。
                player.discard(result.cards);//前面有卡牌card,可以返回card,不同于仁德主动技能直接写card。
                event.targets0 = result.targets;//前面有目标target,可以返回target。
                if (event.targets0 != undefined) { for (var i = 0; i < trigger.targets.length; i += (1)) { if (event.targets0.includes(trigger.targets[i])) { trigger.getParent().excluded.add(trigger.targets[i]); trigger.targets[i].addSkill('fangkong2_aibiexuan'); game.log('取消卡牌目标', trigger.targets[i], '编号', i) } } };//三级选择,集合target是否包含trigger.target。同时测试是否选到了目标。
                player.logSkill('duikongzhiwei', event.targets0);
            }//让技能发语音,发历史记录。
        },


        "_priority": 0,
    },
    bigseven: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        frequent: true,
        trigger: {
            player: "useCardToPlayered",
        },
        filter: function (event, player) {
            return event.targets.length == 1 && (get.type(event.card) == "basic" || get.type(event.card) == "trick");
        },
        async content(event, trigger, player) {
            let cardtype = get.type(trigger.card);
            //game.log(trigger.card);
            //game.log(cardtype);
            const judgeEvent = player.judge(card => {
                return get.type(card) == cardtype ? 1 : 0;
            });
            judgeEvent.judge2 = result => result.bool;
            const {
                result: { judge },
            } = await judgeEvent;
            //game.log("1" + judge);
            if (judge != 1) return;

            let count = game.hasPlayer(function (current) {
                return current.hasSkill("bigseven");
            });
            //game.log(count);
            const {
                result: { bool, targets },
            } = await player
                .chooseTarget([1, count], get.prompt("bigseven"), "为" + get.translation(trigger.card) + "增加目标", (card, player, target) => {
                    const trigger = get.event().getTrigger();
                    return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target);
                })
                .set("card", trigger.card)
                .set("ai", target => {
                    const player = get.event("player"),
                        trigger = get.event().getTrigger();
                    return get.effect(target, trigger.card, player, player);
                });
            if (bool) {
                player.logSkill("bigseven", targets);
                trigger.targets.addArray(targets);
            }

        },
    },
    saobaxing: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        forced: true,
        direct: true,
        trigger: {
            global: "judge",
        },
        filter: function (event, player) {
            return get.color(event.player.judging[0]) == "red";
        },
        content: function () {
            "step 0";
            var card = get.cards()[0];
            event.card = card;
            game.cardsGotoOrdering(card).relatedEvent = trigger;
            "step 1";
            player.$throw(card);
            if (trigger.player.judging[0].clone) {
                trigger.player.judging[0].clone.classList.remove("thrownhighlight");
                game.broadcast(function (card) {
                    if (card.clone) {
                        card.clone.classList.remove("thrownhighlight");
                    }
                }, trigger.player.judging[0]);
                game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
            }
            game.cardsDiscard(trigger.player.judging[0]);
            trigger.player.judging[0] = card;
            game.log(trigger.player, "的判定牌改为", card);
            game.delayx(2);
        },
    },
    shaojie: {
        trigger: {
            player: ["damageEnd"],
        },
        audio: "ext:舰R牌将/audio/skill:true",
        frequent: true,
        firstDo: true,
        filter: function (event, player) { return true },
        content: function () {
            if (trigger.card && (trigger.card.name == "wanjian" || trigger.card.name == "jinjuzhiyuan9" || trigger.card.name == "zhiyuangongji9") && trigger.source && event.triggername == 'damageEnd') {
                player.changeHujia(1);
                game.log(get.translation(player), '发动了技能【哨戒】,增加了 1 点护甲值！');
            }
        },
        group: ["shaojie_ban"],
        subSkill: {
            ban: {
                trigger: {
                    global: "useCard1",
                },
                filter: function (event, player) {
                    return event.card.name == "wanjian" || event.card.name == "jinjuzhiyuan9" || event.card.name == "zhiyuangongji9";
                },
                forced: true,
                locked: false,
                silent: true,
                content: function () {
                    trigger.directHit.add(player);
                },
            },
        },
    },
    beihaidandang: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        usable: 1,
        trigger: {
            global: ["damageBegin4"],
        },
        filter(event, player, name) {
            return event.num > 0 && event.player != player;
        },
        check: function (event, player) {
            return get.attitude(player, event.player) > 2 && !event.player.hasSkillTag("maixue");
        },
        prompt2: function (event, player) {
            return "你可以代替" + get.translation(event.player) + "承受此伤害,然后摸x张牌,将x张手牌交给一名其他角色或弃置(x为你已损失的体力值)。若目标为航母,此伤害值-1。";
        },

        content: function () {
            "step 0"
            var num0 = trigger.num;
            //game.log(num0);
            trigger.cancel();
            if (trigger.player.hasSkill("hangmucv")) { num0 = num0 - 1; }
            if (num0 > 0) { player.damage(num0); }
            "step 1"
            player.draw((player.maxHp - player.hp));
            "step 2"
            if (!player.countCards("he") || (player.maxHp == player.hp)) event.finish();
            else player.chooseControl().set("choiceList", ["将" + (player.maxHp - player.hp) + "张牌交给一名其他角色", "弃置" + (player.maxHp - player.hp) + "张牌"]).set("ai", function () {
                if (game.hasPlayer(function (current) {
                    return current != player && get.attitude(player, current) > 2;
                })) return 0;
                return 1;
            });
            "step 3"
            if (result.index == 0) {
                player.chooseCardTarget({
                    position: "he",
                    filterCard: true,
                    selectCard: Math.min((player.maxHp - player.hp), player.countCards("he")),
                    filterTarget: function (card, player, target) {
                        return player != target;
                    },
                    ai1: function (card) {
                        return 1;
                    },
                    ai2: function (target) {
                        var att = get.attitude(_status.event.player, target);
                        if (target.hasSkillTag("nogain")) att /= 10;
                        if (target.hasJudge("lebu")) att /= 5;
                        return att;
                    },
                    prompt: "选择" + (player.maxHp - player.hp) + "张牌,交给一名其他角色。",
                    forced: true,
                });
            } else {
                player.chooseToDiscard((player.maxHp - player.hp), true, "he");
                event.finish();
            }
            "step 4";
            if (result.bool) {
                var target = result.targets[0];
                player.give(result.cards, target);
            }
        },
        ai: {
            expose: 0.4,
        },
        "_priority": 0,
    },
    xingyundeyunyuqu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        mod: {
            globalTo(from, to, distance) {
                if (to.countCards("j")) { return distance + 1; }
            },
        },
        trigger: {
            player: ["phaseEnd"],
        },
        filter: function (event, player) {
            if (player.hasJudge("lebu")) return false;
            return player.countCards("hes") > 0;
        },
        check: function (event, player) {
            return player.countCards("h") <= player.maxHp - 2;
        },
        frequent: true,
        content: function () {
            "step 0";
            player
                .chooseCard("he", get.prompt("xingyundeyunyuqu", player), "将一张牌当做乐不思蜀对自己使用", function (card, player) {
                    return true;
                })
                .set("target", player)
                .set("ai", function (card) {
                    let player = get.player();
                    if (player.Hp == 1 && (player.countCards("h") <= player.maxHp - 3)) { return 9 - get.value(card); }
                    return 6 - get.value(card);
                });
            "step 1";
            if (result.bool) {
                player.useCard(get.autoViewAs({ name: "lebu" }, result.cards), result.cards, false, trigger.player, "xingyundeyunyuqu");

            } else {
                event.finish();

            }
            "step 2";
            player.drawTo(Math.min(5, player.maxHp));
            //player.addTempSkill("xingyundeyunyuqu_bazhen",{player:"phaseBegin"});
        },
        ai: {
            threaten: 1.2,
            tag: {
                skip: "phaseUse",

            },

        },
    },
    xingyundeyunyuqu_bazhen: {
        group: "bazhen_bagua",
        locked: true,
        "_priority": 0,
    },
    diwuzhandui: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: ["phaseZhunbeiBegin"],
        },
        frequent: true,
        filter(event, player, name) {
            return true;
        },
        content: function () {
            "step 0"
            let cruiser = game.countPlayer(function (current) { return current.hasSkill("zhongxunca") || current.hasSkill("qingxuncl"); });
            event.cards = get.cards(Math.min(Math.min(cruiser, 3), 1));
            //event.cards = get.cards(6);
            game.cardsGotoOrdering(event.cards);
            "step 1"
            var next = player.chooseButton(["第五战队", cards], false);
            next.set("filterButton", function (button) {
                return player.hasUseTarget(button.link);
            });
            next.set("ai", function (button) {
                return get.value(button.link, _status.event.player);
            });
            "step 2"
            if (result.links) {
                //game.log(result.links);
                event.cards2 = result.links;
            }
            else {
                event.finish();
            }/* 
                                     var time = 1000 - (get.utc() - event.time);
                                     if (time > 0) {
                                         game.delayx(0, time);
                                     } */
            "step 3"
            game.broadcastAll('closeDialog', event.videoId);
            var cards2 = event.cards2;
            player.chooseUseTarget(cards2, true);
            "step 4"

            var damageHistory = player.hasHistory("sourceDamage", function (evt) {
                return true;

            });
            //game.log(damageHistory);
            if (!damageHistory) {
                event.finish();
            }
            //game.log(event.cards.length);
            if (event.cards.length <= 1) { event.finish(); }

            "step 5"
            event.cards3 = event.cards.removeArray(event.cards2);
            if (event.cards3.length) {
                player
                    .chooseTarget("选择一名角色获得" + get.translation(event.cards3), true, true)
                    .set("ai", function (target) {
                        var att = get.attitude(_status.event.player, target);
                        if (_status.event.enemy) {
                            return -att;
                        } else if (att > 0) {
                            return att / (1 + target.countCards("h"));
                        } else {
                            return att / 100;
                        }
                    });
            } else { event.finish(); }
            "step 6"
            //game.log(result.targets);
            //game.log(event.cards3);
            result.targets[0].gain(event.cards3, 'gain2');
        },
    },
    bisikaiwanshoulie: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        trigger: {
            player: ["loseAfter"],
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
        },
        filter: function (event, player) {
            var evt = event.getl(player);
            return evt && (evt.cards2.length > 1);
        },
        frequent: true,
        content: function () {
            "step 0";
            player.chooseTarget([1, Infinity], get.prompt("bisikaiwanshoulie"), "令任意名角色摸1张牌").ai = function (target) {
                var player = get.player();
                return get.attitude(player, target);
            };
            "step 1";
            if (result.bool) {
                result.targets.sortBySeat();
                game.asyncDraw(result.targets, 1);
            } else event.finish();
            "step 2";
            game.delayx();
        },
    },


    beijixingweishe: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            source: "damageSource",
        },
        frequent: true,
        filter(event, player) {
            return event.player != player;
        },
        content() {
            trigger.player.addTempSkill("beijixingweishe_effect", { player: "phaseEnd" });
        },
        subSkill: {
            effect: {
                charlotte: true,
                forced: true,
                intro: {
                    marktext: "威慑",
                    content: function () {
                        return "不能使用或打出杀";
                    },
                },
                mod: {
                    cardEnabled: function (card, player) {
                        if (card.name == "sha" || card.name == "sheji9") return false;
                    },
                    cardRespondable: function (card, player) {
                        if (card.name == "sha" || card.name == "sheji9") return false;
                    },
                },
            }
        },
    },

    hailangchuji: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            global: "useCardToPlayered",
        },
        frequent: true,
        filter: function (event, player) {
            return event.player.hasSkill("qiantingss") && player != event.target && event.card.name == "sha" && event.card.nature == "thunder";
        },
        prompt: "你可以摸一张牌",
        content: function () {
            player.draw(1);
        },
        "_priority": 0,
    },
    yangwangxingkong: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        unique: true,
        enable: "phaseUse",
        filterCard: true,
        lose: false,
        discard: false,
        skillAnimation: true,
        animationColor: "metal",
        mark: true,
        limited: true,
        filter: function (event, player) {
            if (player.storage.yangwangxingkong) return false;
            return player.countCards("h") > 0;
        },
        filterTarget: function (card, player, target) {
            return true;
        },
        check: function (card) {
            return 9 - get.value(card);
        },
        content: function () {
            "step 0"
            player.awakenSkill('yangwangxingkong');
            player.give(cards[0], target);
            //player.addSkill("yangwangxingkong_draw");
            "step 1"
            target.chooseControl("yangwangxingkong_card", "yangwangxingkong_hp").ai = function (event, player) {
                var cards = player.getCards("h");
                if (cards.length == 1) return 0;
                if (cards.length >= 2 && player.hp == 1) {
                    for (var i = 0; i < cards.length; i++) {
                        if (get.tag(cards[i], "save")) return 1;
                    }
                }
                var countValue = 0;
                var saveMark = 0;
                for (var i = 0; i < cards.length; i++) {
                    countValue += get.value(cards[i]);
                    if (get.tag(cards[i], "save")) { saveMark = 1; }
                    if (countValue >= 8 * player.hp && saveMark) return 1;
                }
                return 0;
            };
            "step 2";
            if (result.control == "yangwangxingkong_card") {
                target.chooseToDiscard(true, target.countCards("h"));
            } else {
                var loseNum = target.hp;
                target.loseHp(loseNum);
                // 将体力流失计入伦敦的统计
                var stat = player.getStat();
                if (!stat.damage) stat.damage = 0;
                stat.damage += loseNum;
                event.finish();
            }

        },
        ai: {
            order(item, player) {
                return lib.skill.yangwangxingkong.doCook(player) ? 10 : 0;
            },
            result: {
                target: function (player, target) {
                    return -target.countCards("he") - (player.countCards("h", "du") ? 1 : 0);
                },
            },
        },
        doCook(player) {//改自业炎bigFire
            //if(player.getDiscardableCards(player,'h').reduce((list,card)=>list.add(get.suit(card,player)),[]).length<4) return false;
            const targets = game.filterPlayer(target => get.damageEffect(target, player, player) && (target.hp > 2 || target.countCards("h") > 5));
            if (!targets.length) return false;
            if (targets.length == 1 || targets.some(target => get.attitude(player, target) < 0 && target.identity && target.identity.indexOf('zhu') != -1)) {
                return true;
            }
            return false;
        },
        intro: {
            content: "limited",
        },
        init: (player, skill) => (player.storage[skill] = false),
        "_priority": 0,
    },
    /*yangwangxingkong_draw: {
        trigger: {
            player: "phaseDrawBegin2",
        },
        direct: true,
        charlotte: true,
        filter(event, player) {
            return !event.numFixed;
        },
        async content(event, trigger, player) {
            trigger.num -= 1;
        },
        ai: {
            threaten: 0.9,
        },
        sub: true,
        "_priority": 0,
    },*/
    zhengzhansifang: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "damageEnd",
        },
        frequent: true,
        content() {
            "step 0";
            player
                .chooseControl("basic", "trick", "equip")
                .set("prompt", "选择获得一种类型的牌")
                .set("ai", function () {
                    var player = _status.event.player;
                    if (player.hp <= 2 && !player.countCards("h", { name: ["shan", "tao"] })) return "basic";
                    if (player.countCards("he", { type: "equip" }) < 2) return "equip";
                    return "trick";
                });
            "step 1";
            var card = get.cardPile2(function (card) {
                return get.type(card, "trick") == result.control;
            });
            if (card) player.gain(card, "gain2", "log");
        },
        ai: {
            maixie: true,
            "maixie_hp": true,
            effect: {
                target: function (card, player, target) {
                    if (get.tag(card, "damage")) {
                        if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
                        if (!target.hasFriend()) return;
                        var num = 1;
                        if (get.attitude(player, target) > 0) {
                            if (player.needsToDiscard()) num = 0.7;
                            else num = 0.5;
                        }
                        if (target.hp >= 4) return [1, num * 2];
                        if (target.hp == 3) return [1, num * 1.5];
                        if (target.hp == 2) return [1, num * 0.5];
                    }
                },
            },
        },
    },
    binghaihuhang: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        shaRelated: true,
        frequent: true,
        trigger: {
            player: "useCardToPlayered",
        },
        check(event, player) {
            return get.attitude(player, event.target) <= 0;
        },
        filter(event, player) {
            return event.card.name == "sha" && event.target.countCards("e");//!player.hasEmptySlot(2)
        },
        logTarget: "target",
        preHidden: true,
        content(event, trigger, player) {
            trigger.getParent().directHit.add(trigger.target);
        },
        ai: {
            "directHit_ai": true,
            skillTagFilter(player, tag, arg) {
                if (get.attitude(player, arg.target) > 0 || arg.card.name != "sha" || !ui.cardPile.firstChild) return false;
            },
        },
        "_priority": 0,
    },

    zhanxianyuanhu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        forced: true,
        filter: function (event, player) {
            return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
        },
        audio: 6,
        content: function () {
            "step 0";
            player
                .chooseTarget("请选择【先辅】的目标", lib.translate.zhanxianyuanhu_info, true, function (card, player, target) {
                    return target != player && (!player.storage.zhanxianyuanhu2 || !player.storage.zhanxianyuanhu2.includes(target));
                })
                .set("ai", function (target) {
                    var att = get.attitude(_status.event.player, target);
                    if (att > 0) return att + 1;
                    if (att == 0) return Math.random();
                    return att;
                }).animate = false;
            "step 1";
            if (result.bool) {
                var target = result.targets[0];
                if (!player.storage.zhanxianyuanhu2) player.storage.zhanxianyuanhu2 = [];
                player.storage.zhanxianyuanhu2.push(target);
                player.addSkill("zhanxianyuanhu2");
            }
        },
        "_priority": 0,
    },
    zhanxianyuanhu2: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            global: ["damageBegin4"],
        },
        forced: true,
        filter: function (event, player) {
            if (event.player.isDead() || !player.storage.zhanxianyuanhu2 || !player.storage.zhanxianyuanhu2.includes(event.player) || event.num <= 0) return false;
            if (event.name == "damage") return true;
        },
        logTarget: "player",
        content: function () {
            "step 0";
            event.num = trigger.num;
            trigger.cancel();
            "step 1";
            player.damage(event.num - 1);
        },
        ai: {
            threaten: 1.05,
        },
    },
};

export { historybattles };