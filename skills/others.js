import { lib, game, ui, get, ai, _status } from '../../../noname.js';

const others = {
    tebiekongxi: {
        nobracket: true,
        init: function (player) {
            //game.log("特别空袭初始化检查");
            //game.log(typeof player.storage.gaosusheji);
            if (typeof player.storage.tebiekongxi === 'undefined') player.storage.tebiekongxi = false;
        },
        audio: "ext:舰R牌将/audio/skill:true",
        zhuanhuanji: true,
        mark: true,
        marktext: "☯",
        intro: {
            content: function (storage, player, skill) {
                if (player.storage.tebiekongxi) return '你的回合内,当你因使用打出或弃置而一次性失去两张或更多牌时,你可以将其中一张牌置于武将牌上,称为“战”(至多三张)。';
                return '你的回合外,当你因使用打出或弃置而一次性失去两张或更多牌时,你可以将其中一张牌置于武将牌上,称为“战”(至多三张)。';
            },
        },
        trigger: {
            player: "loseAfter",
            global: "loseAsyncAfter",
        },
        frequent: true,
        filter: function (event, player) {
            //var evtx = event.getParent('phaseUse');
            //if (!evtx || evtx.player != player) return false;
            //game.log("特别空袭初始化检查");
            if (typeof player.storage.tebiekongxi === 'undefined') player.storage.tebiekongxi = false;
            var evt = event.getl(player);
            if (evt.cards2.length <= 1) { return false; }
            var zhandouji = player.getExpansions('zhandouji').length + player.getCards('s', function (card) { return card.hasGaintag('zhandouji') }).length;
            if (zhandouji >= 3) { return false; }
            if (player.storage.tebiekongxi) {
                //game.log("阳");
                return _status.currentPhase == player;
            } else {
                //game.log("阴");
                return _status.currentPhase != player;

            }

        },
        check(event, player) {
            return true;
        },
        content: function () {
            'step 0'
            if (typeof player.storage.tebiekongxi === 'undefined') { player.storage.tebiekongxi = false; }
            //game.log("1:" + player.storage.tebiekongxi);
            player.storage.tebiekongxi = (!player.storage.tebiekongxi);
            //player.changeZhuanhuanji('gaosusheji');
            //game.log("2:" + player.storage.tebiekongxi);
            var zhandouji = player.getExpansions('zhandouji').length + player.getCards('s', function (card) { return card.hasGaintag('zhandouji') }).length;
            if (zhandouji < 3) {
                //game.log(trigger.getl(player).cards2);
                player.chooseCardButton('将一张牌置于你的武将牌上,称为“战”,<br>至多为三<br>这些牌可以当作无懈可击使用', true, trigger.getl(player).cards2).set('ai', function (card) {
                    var player = get.player();
                    return true;
                });
            }
            else { event.finish(); }
            'step 1'
            //game.log(result.links);
            if (result.bool) {
                // player.addToExpansion(result.cards,player,'giveAuto').gaintag.add('junfu');player.update();
                player.loseToSpecial(result.links, 'zhandouji', player).visible = true;
            }
        },
        /*  onremove: function (player, skill) {
             var cards = player.getExpansions(skill);
             if (cards.length) player.loseToDiscardpile(cards);
         },
         intro: {
             content: function () {
                 return get.translation(skill + '_info');
             },
         }, */

        group: "tebiekongxi_wuxie",
        subSkill: {
            wuxie: {
                /*  */
                enable: "chooseToUse",
                filterCard: true,
                position: "s",
                viewAs: {
                    name: "wuxie",
                },
                filter: function (event, player, name) {
                    return player.getCards('s', function (card) { return card.hasGaintag('zhandouji') }).length > 0;
                },
                viewAsFilter(player) {
                    return player.getCards('s', function (card) { return card.hasGaintag('zhandouji') }).length > 0;
                },
                prompt: "将一张武将牌上的牌当无懈可击使用",
                sub: true,
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
            },
        },
        "_priority": 0,
    },
    zhanliexianfuchou: {
        nobracket: true,
        usable: 1,
        trigger: {
            source: "damageBegin1",
        },
        filter: function (event) {
            return event.card && event.notLink();
        },
        forced: true,
        content: function () {
            /* var history = game.countPlayer2(target => target.getRoundHistory("damage", evt => {
                //game.log(evt.card);
                //game.log(evt.targets);
                //game.log(target);
                return get.tag(evt.card, 'damage') && target != player && evt.targets && evt.targets.includes(player);
            }).length); */
            var history = player.getRoundHistory("damage", evt => {
                //game.log(evt.card);
                //game.log(evt.targets);
                //game.log(target);
                return 1;
            }).length;
            //game.log(history);
            trigger.num += history;
        },
        ai: {
            threaten: 0.8,
        },
    },

    pangguanzhe: {
        nobracket: true,
        init(player, skill) {
            if (!player.storage.pangguanzhe) player.storage.pangguanzhe = [];
        },
        trigger: {
            player: "phaseBegin",
        },
        forced: true,
        filter(event, player) {
            //if (player.storage.pangguanzhe.length) return false;
            return true;
        },
        bannedList: ["pangguanzhe", "zhanliebb", "hangmucv", "zhongxunca", "qingxuncl", "quzhudd", "qianting", "junfu", "daoqu", "fangqu", "zhuangjiafh", "dajiaoduguibi", "huokongld", "fangkong2", "shixiangquanneng", "yaosai", "tiaozhanzhuangbei", "zhongleizhuangjiantuxi", "juejingfengsheng"],
        content: function () {
            "step 0"
            if (player.storage.pangguanzhe.length) {
                player.removeSkills(player.storage.pangguanzhe[0]);

            }
            player.storage.pangguanzhe = [];
            "step 1"
            var listm = [];
            var listv = [];
            event.skills = [];
            var func = function (skill) {
                var info = get.info(skill);
                if (!info || info.charlotte || info.hiddenSkill || info.zhuSkill || info.juexingji || info.limited || info.dutySkill || (info.unique && !info.gainable) || lib.skill.pangguanzhe.bannedList.includes(skill)) return false;
                return true;
            };
            event.players = game.filterPlayer();
            for (i in event.players) {
                //game.log(event.players[i]);
                if (event.players[i].name1 != undefined) listm = lib.character[event.players[i].name1][3];//主将
                else listm = lib.character[event.players[i].name][3];
                if (event.players[i].name2 != undefined) listv = lib.character[event.players[i].name2][3];//副将
                listm = listm.concat(listv);
                for (var j = 0; j < listm.length; j++) {
                    if (func(listm[j])) event.skills.push(listm[j]);
                }
            }
            //game.log(event.skills);
            "step 2"
            if (event.skills.length > 0) {
                event.result = event.skills.randomGet();
                /*player.chooseControl(event.skills)
                    .set('filterButton', button => {
                        if (ui.selected.buttons) {
                            return true;
                        }
                    }).set('ai', function (button) {
                        return event.skills.randomGet();
                    }).set('selectButton', 1);*///玩家选择一项
            } else event.finish();
            "step 3"
            //game.log(event.result);
            player.addTempSkills(event.result, { player: "dieAfter" });
            player.storage.pangguanzhe = [event.result];
            game.log(player, '获得了技能', '#g【' + get.translation(event.result) + '】');
            /*game.log(result.control);
            player.addTempSkills(result.control, { player: "dieAfter" });
            player.storage.pangguanzhe = [result.control];
            game.log(player, '获得了技能', '#g【' + get.translation(result.control) + '】');*/
        },
        group: ["pangguanzhe_judge"],
        subSkill: {
            judge: {
                trigger: {
                    global: "judge",
                },
                frequent: true,
                filter(event, player) {
                    var currentParent = event.getParent();
                    //game.log(currentParent.player);
                    //game.log(currentParent.name);
                    //game.log(player.storage.pangguanzhe);
                    if (currentParent.name == player.storage.pangguanzhe && currentParent.player == player) { return true; }
                    //if (event.fixedResult && event.fixedResult.suit) return true;
                    //return get.suit(event.player.judging[0], event.player);
                    return false;
                },
                content() {
                    "step 0";
                    var str = "请将其改为一种花色";
                    player
                        .chooseControl("spade", "heart", "diamond", "club")
                        .set("prompt", str)
                        .set("ai", function () {
                            var judging = _status.event.judging;
                            var trigger = _status.event.getTrigger();
                            var res1 = trigger.judge(judging);
                            var list = lib.suit.slice(0);
                            var attitude = get.attitude(player, trigger.player);
                            if (attitude == 0) return 0;
                            var getj = function (suit) {
                                return trigger.judge({
                                    name: get.name(judging),
                                    nature: get.nature(judging),
                                    suit: suit,
                                    number: get.number(judging),
                                });
                            };
                            list.sort(function (a, b) {
                                return (getj(b) - getj(a)) * get.sgn(attitude);
                            });
                            return list[0];
                        })
                        .set("judging", trigger.player.judging[0]);
                    "step 1";
                    if (result.control != "cancel2") {
                        player.addExpose(0.25);
                        player.popup(result.control);
                        game.log(player, "将判定结果改为了", "#y" + get.translation(result.control + 2));
                        if (!trigger.fixedResult) trigger.fixedResult = {};
                        trigger.fixedResult.suit = result.control;
                        trigger.fixedResult.color = get.color({ suit: result.control });
                    }
                },
                ai: {
                    rejudge: true,
                    tag: {
                        rejudge: 0.4,
                    },
                    expose: 0.1,
                },
                "_priority": 0,
            },
        },
        "_priority": 0,

    },
    hangkongyazhi: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        unique: true,
        enable: "phaseUse",
        skillAnimation: true,
        animationColor: "wood",
        mark: true,
        limited: true,
        filter: function (event, player) {
            if (player.storage.wuweizhuangji) return false;
            return player.hasSkill("hangmucv");
        },
        filterTarget: function (card, player, target) {
            return true;
        },
        content: function () {
            player.awakenSkill('hangkongyazhi');
            player.removeSkill("hangmucv");
            target.changeHujia(-player.hujia);

            target.addTempSkill("hangkongyazhi_fengyin", "roundStart");

        },
        intro: {
            content: "limited",
        },
        init: (player, skill) => (player.storage[skill] = false),
        "_priority": 0,
    },
    hangkongyazhi_fengyin: {
        init: function (player, skill) {
            player.addSkillBlocker(skill);
        },
        onremove: function (player, skill) {
            player.removeSkillBlocker(skill);
        },
        charlotte: true,
        skillBlocker: function (skill, player) {
            return !lib.skill[skill].charlotte;
        },
        mark: true,
        intro: {
            content: function (storage, player, skill) {
                var list = player.getSkills(null, false, false).filter(function (i) {
                    return lib.skill.hangkongyazhi_fengyin.skillBlocker(i, player);
                });
                if (list.length) return "失效技能：" + get.translation(list);
                return "无失效技能";
            },
        },
        "_priority": 0,
    },
    chuansuohongzha: {
        nobracket: true,
        group: ["chuansuohongzha_get", "chuansuohongzha_send"],
        ai: {
            threaten: 1.4,
        },
        subSkill: {
            get: {
                audio: "ext:舰R牌将/audio/skill:true",
                trigger: {
                    global: "useCardAfter",
                },
                round: 1,
                filter: function (event, player) {
                    if (event.cards.length && player != event.player && get.tag(event.card, 'damage') && !player.isDamaged()) {
                        for (var i = 0; i < event.cards.length; i++) {
                            if (get.position(event.cards[i], true) == "o") {
                                return true;
                            }
                        }
                        return false;
                    };
                    return false;
                },
                content() {
                    //game.log(trigger.cards);
                    player.gain(trigger.cards, "gain2");
                },
            },
            send: {
                audio: "ext:舰R牌将/audio/skill:true",
                trigger: {
                    player: "useCardAfter",
                },
                frequent: true,
                filter: function (event, player) {
                    return event.cards.length && get.tag(event.card, 'damage') && game.hasPlayer(function (current) {
                        return current.hp == current.maxHp;
                    });;
                },
                usable: 1,
                content() {
                    "step 0";
                    //game.log("chuansuohongzha1");
                    player
                        .chooseTarget(get.prompt("chuansuohongzha_send"), "将" + get.translation(trigger.cards) + "交给一名其他角色", function (card, player, target) {
                            return target != player && target.hp == target.maxHp;
                        })
                        .set("ai", function (target) {
                            if (target.hasJudge("lebu")) return 0;
                            let att = get.attitude(_status.event.player, target),
                                name = _status.event.cards[0].name;
                            if (att < 3) return 0;
                            if (target.hasSkillTag("nogain")) att /= 10;
                            if (name === "sha" && target.hasSha()) att /= 5;
                            if (name === "wuxie" && target.needsToDiscard(_status.event.cards)) att /= 5;
                            return att / (1 + get.distance(player, target, "absolute"));
                        })
                        .set("cards", trigger.cards);
                    "step 1";
                    if (result.bool) {
                        //game.log("chuansuohongzha2");
                        //game.log(trigger.cards);
                        //game.log("chuansuohongzha3");
                        //game.log(result.targets);
                        result.targets[0].gain(trigger.cards, "gain2");
                    }
                },
            },
        },
    },
    fenzhandaodi: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: ["chooseToRespond", "chooseToUse"],
        mod: {
            maxHandcardBase: function (player, num) {
                return player.maxHp;
            },
        },
        global: ["fenzhandaodi_block"],
        filterCard(card) {
            return get.color(card) == 'red';
        },
        position: "hes",
        viewAs: {
            name: "sha",
            nature: "thunder",
            storage: {
                fenzhandaodi: true,
            },
        },
        viewAsFilter(player) {
            if (!player.countCards('hes')) return false;
            return true;
        },
        prompt: "将一张红色牌当雷杀使用",
        check(card) { return 4 - get.value(card) },
        ai: {
            yingbian: function (card, player, targets, viewer) {
                return lib.card.sha.ai.yingbian(card, player, targets, viewer);
            },
            canLink: function (player, target, card) {
                return lib.card.sha.ai.canLink(player, target, card);
            },
            basic: {
                useful: [5, 3, 1],
                value: [5, 3, 1],
            },
            order: function (item, player) {
                return lib.card.sha.ai.order(item, player);
            },
            result: {
                target: function (player, target, card, isLink) {
                    return lib.card.sha.ai.result.target.apply(this, arguments);
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
        subSkill: {
            block: {
                mod: {
                    cardEnabled(card, player) {
                        let evt = get.event();

                        if (evt.name != "chooseToUse") {

                            evt = evt.getParent("chooseToUse");
                        }
                        if (!evt?.respondTo || !evt.respondTo[0].hasSkill("fenzhandaodi") || (evt.respondTo[1].name != "sha" && evt.respondTo[1].name != "sheji9")) {
                            return;
                        }
                        const color1 = get.color(card),
                            color2 = get.color(evt.respondTo[1]),
                            hs = player.getCards("h"),
                            cards = [card];
                        if (color1 === "unsure") {
                            return;
                        }
                        if (Array.isArray(card.cards)) {
                            cards.addArray(card.cards);
                        } else {
                            return false;
                        }
                        if (color1 == color2 || !cards.containsSome(...hs)) {
                            return false;
                        }
                    },

                },
                charlotte: true,
            },
        },
    },
    /* jinyangmaozhishi: {
                nobracket: true,
                audio: "ext:舰R牌将/audio/skill:true",
                trigger: { player: "dying", },
                forced: true,
                direct: true,
                filter: function (event, player) {
                    return event.name == "dying" && player.maxHp > 1;
                },
                content: function (event, player) {
                    player.loseMaxHp(1);
                    player.recover(1);
                },
                group: ["jinyangmaozhishi_mark"],
                subSkill: {
                    mark: {
                        trigger: { player: "loseMaxHpAfter", },
                        forced: true,
                        direct: true,
                        silent: true,
                        sub: true,
                        content: function (event, player) {
                            player.addMark("jinyangmaozhishi_mark", 1);
                        },
                        mark: true,
                        intro: {
                            marktext: "金",
                        },
                    },
                },
            }, */
    jinyangmaozhishi: {
        nobracket: true,
        unique: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            target: "useCardToBefore",
        },
        mark: true,
        skillAnimation: true,
        limited: true,
        animationColor: "orange",
        init(player) {
            player.storage.jinyangmaozhishi = false;
        },
        check(event, player) {
            if (player.hp <= 1) {
                let evt = event.getParent(),
                    directHit = (evt.nowuxie && get.type(event.card, "trick") === "trick") || (evt.directHit && evt.directHit.includes(player)) || (evt.customArgs && evt.customArgs.default && evt.customArgs.default.directHit2);
                if (get.tag(event.card, "respondSha")) {
                    if (directHit || player.countCards("h", { name: "sha" }) === 0) return true;
                } else if (get.tag(event.card, "respondShan")) {
                    if (directHit || player.countCards("h", { name: "shan" }) === 0) return true;
                } else if (get.tag(event.card, "damage")) {
                    if (event.card.name === "huogong") return event.player.countCards("h") > 4 - player.hp - player.hujia;
                    if (event.card.name === "shuiyanqijunx") return player.countCards("e") === 0;
                    return true;
                }
            } else return false;
        },
        filter(event, player) {
            return event.player != player && player.isDamaged();
        },
        content() {
            player.awakenSkill("jinyangmaozhishi");
            player.storage.jinyangmaozhishi = true;
            //trigger.getParent().targets.remove(player);
            trigger.cancel();
        },
        ai: {
            order: 1,
            skillTagFilter(player, arg, target) {
                if (player != target || player.storage.jinyangmaozhishi) return false;
            },
            save: true,
            result: {
                player(player) {
                    return 10;
                },
            },
            threaten(player, target) {
                if (!target.storage.jinyangmaozhishi) return 0.8;
            },
        },
        intro: {
            content: "limited",
        },
        "_priority": 0,
    },
    /* zhengzhansihai: {
        nobracket: true,
        forced: true,
        mod: {
            maxHandcard: function (player, num) {
                return num += player.countMark("jinyangmaozhishi_mark");
            },
        },
        trigger: {
            source: "damageBegin4",
        },
        content: function () {
            trigger.num += player.countMark("jinyangmaozhishi_mark");
        },
        ai: {
            effect: {
                target: function (card, player, target) {
                    if (target.hasFriend() && target.maxHp > 1 && player.maxHp > 1) {
                        if ((get.tag(card, "damage") == 1 || get.tag(card, "loseHp")) && target.hp == target.maxHp) return [0, 1];
                    }
                },
            },
            threaten: function (player, target) {
                if (target.maxHp == 1) return 4;
                if (target.maxHp == 2) return 2;
                return 0.8;
            },
        },
    }, */
    zhengzhansihai: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "damageEnd",
            source: "damageSource",
        },
        usable: 1,
        filter: function (event, player) {
            if (event._notrigger.includes(event.player)) return false;
            return event.num && event.source && event.player && event.player.isIn() && event.source.isIn();
        },
        content: function () {
            player.draw(player.maxHp - player.hp);
        },
        ai: {
            maixie: true,
        },
    },
    zhizhanzhige: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "phaseJieshuBegin",
        },
        check: function (event, player) {
            if ((player.getHistory("useCard", function (evt) {
                return evt.isPhaseUsing() && ["tao", "taoyuan", "kuaixiu9", "jinjixiuli9"].includes(get.name(evt.card));
            }).length > 0) && (player.hp == player.maxHp)) return false;
            return player.getHistory("useCard", function (evt) {
                return evt.isPhaseUsing() && ["basic", "trick"].includes(get.type(evt.card));
            }).length > 1;
        },
        filter: function (event, player) {
            return (
                player.getHistory("useCard", function (evt) {
                    return evt.isPhaseUsing() && ["basic", "trick"].includes(get.type(evt.card));
                }).length > 0
            );
        },
        content: function () {
            "step 0";
            event.count = 3;
            event.history = player.getHistory("useCard", function (evt) {
                return evt.isPhaseUsing() && ["basic", "trick"].includes(get.type(evt.card));
            });
            player.turnOver();
            "step 1";
            event._result = {};
            if (event.count && event.history.length && player.countCards("hs")) {
                event.count--;
                var card = event.history.shift().card;
                card = { name: card.name, nature: card.nature };
                if (player.hasUseTarget(card, true, true)) {
                    if (
                        game.hasPlayer(function (current) {
                            return player.canUse(card, current);
                        })
                    ) {
                        player.chooseUseTarget(true, card);
                    }
                }
            }
            "step 2";
            if (result && result.bool) event.goto(1);

        },
        /* trigger: {
            player: "phaseZhunbeiBegin",
        },
        check: function (event, player) {
            return 1;
        },
        content: function (event, player) {
            player.draw(2);
            player.turnOver();
            trigger.getParent("phase").phaseList.splice(trigger.getParent("phase").num + 1, 0, "phaseUse");
        }, */
    },
    jianjianleiji: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        usable: 1,
        enable: ["chooseToRespond", "chooseToUse"],
        mod: {
            cardUsable: function (card) {
                if (card.storage && card.storage.jianjianleiji) return Infinity;
            },
            targetInRange(card, player, target, now) {
                if (card.storage && card.storage.jianjianleiji) return true;
            },
        },
        filterCard(card) {
            return get.type(card) == 'equip';
        },
        position: "hes",
        viewAs: {
            name: "sha",
            nature: "thunder",
            storage: {
                jianjianleiji: true,
            },
        },
        viewAsFilter(player) {
            if (!player.countCards('hes')) return false;
        },
        prompt: "将一张装备牌当雷杀使用",
        check(card) { return 4 - get.value(card) },
        ai: {
            yingbian: function (card, player, targets, viewer) {
                return lib.card.sha.ai.yingbian(card, player, targets, viewer);
            },
            canLink: function (player, target, card) {
                return lib.card.sha.ai.canLink(player, target, card);
            },
            basic: {
                useful: [5, 3, 1],
                value: [5, 3, 1],
            },
            order: function (item, player) {
                return lib.card.sha.ai.order(item, player);
            },
            result: {
                target: function (player, target, card, isLink) {
                    return lib.card.sha.ai.result.target.apply(this, arguments);
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
    jianduixunlian: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        usable: 1,
        filter: function (event, player) {
            return player.countCards("h") > 0;
        },
        filterTarget: function (card, player, target) {
            return target != player && target.countCards("h") > 0;
        },
        content: function () {
            "step 0"
            var list = [];
            var dialog = ["舰队训练：与" + get.translation(target) + "交换一种花色的所有手牌"];
            for (var suit of lib.suit.concat("none")) {
                if (target.countCards("h", { suit: suit })) {
                    dialog.push('<div class="text center">' + get.translation(suit + "2") + "牌</div>");
                    dialog.push(target.getCards("h", { suit: suit }));
                    if (player.countCards("h", { suit: suit })) {
                        list.push(suit);
                    }
                }
            }
            list.push('cancel2');
            player
                .chooseControl(list)
                .set("dialog", dialog)
                .set("ai", () => {
                    return _status.event.control;
                })
                .set(
                    "control",
                    (() => {
                        var getv = cards => cards.map(i => get.value(i)).reduce((p, c) => p + c, 0);
                        return list.sort((a, b) => {
                            return (getv(target.getCards("h", { suit: b })) - getv(player.getCards("h", { suit: b }))) - (getv(target.getCards("h", { suit: a })) - getv(player.getCards("h", { suit: a })));
                        })[0];
                    })()
                );
            "step 1"
            if (!result.control || result.control == "cancel2") {
                event.finish();
            } else {
                //game.log(get.translation(result.control));
                event.cards2 = target.getCards("h", { suit: result.control });
                event.cards1 = player.getCards("h", { suit: result.control });
                //game.log(get.translation(target) + "该花色的牌" + get.translation(event.cards2));
                //game.log(get.translation(player) + "该花色的牌" + get.translation(event.cards1));
                player.swapHandcards(target, event.cards1, event.cards2);
            }
        },
        ai: {
            order: 6,
            result: {
                player: 1,
                target: function (player, target) {
                    if (target.hasSkillTag("noh")) return 0;
                    return -0.2 * target.countCards("h");
                },
            },
        },
        "_priority": 0,
    },
    xiwangdeshuguang: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            global: "phaseEnd",
        },
        filter: function (event, player) {
            var damagedPlayers = game.filterPlayer(current => current.getHistory('damage').length > 0 && current.isDamaged());
            return player.countCards("h") && damagedPlayers && damagedPlayers.length > 0;
        },
        frequent: true,
        content() {
            "step 0"
            player.chooseTarget(get.prompt('xiwangdeshuguang'), "选择一名本回合受过伤害的角色", function (card, player, target) {
                return target.getHistory('damage').length > 0 && target.isDamaged();
            }).set("ai", function (target) {
                var player = get.player();
                var att = get.attitude(player, target);
                return att;
            });
            "step 1"
            if (result.bool) {
                event.targets = result.targets[0];
                player.chooseToDiscard(get.prompt('xiwangdeshuguang'), "弃置一张手牌,令" + get.translation(event.target) + "恢复一点体力", 1).set("ai", function (card) {
                    return 9 - get.value(card);
                });
            }
            else { event.finish(); return; }
            "step 2"
            if (!result.bool) { event.finish(); return; }
            event.targets.recover();
        },
        ai: {
            threaten: 1.2,
        }
    },
    qiangxiu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        usable: 1,
        selectTarget: 1,
        filterTarget: true,
        filter: function (event, player) {
            return true;
        },
        content: function () {
            "step 0"
            target.damage("nocard");
            "step 1"
            target.recover(1);
        },
        ai: {
            order: 2,
            damage: true,
            recover: true,
            result: {
                target: function (player, target) {
                    var att = get.attitude(player, target);
                    if (att >= 0 && target.hp >= 1) {
                        if (target.hasSkillTag("maixue")) return 2;
                        if (target.isDamaged) return 0.5;
                    } else if (target.hp <= 1) {
                        return get.damageEffect(target, player) - 0.5;
                    } else {
                        return 0;
                    }
                },
            },
        },
    },
    liaowangtai: {
        nobracket: true,
        enable: "phaseUse",
        init: function (player) {
            if (!player.storage.liaowangtai) player.storage.liaowangtai = 0;
        },
        mod: {
            globalFrom: function (from, to, distance) {
                var totalLevels = 0;
                totalLevels += 2;//from.countMark('jinengup');
                if (from.hasSkill("liaowangtai")) {
                    totalLevels -= from.countMark("liaowangtai");
                }
                //game.log(from.countMark("liaowangtai"));
                return distance - totalLevels;
            },
        },
        filter: function (event, player) {
            return game.hasPlayer(function (current) {
                return current.countCards("h") && get.distance(player, current) == 1;
            });
        },
        selectTarget: 1,
        filterTarget: function (card, player, target) {
            return target.countCards("h") && get.distance(player, target) == 1;
        },
        content: function () {
            "step 0";
            player.draw(player.countMark("liaowangtai") + 1);
            player.addMark("liaowangtai", 1);
            player.useCard({ name: "huogong", isCard: true }, event.targets, "liaowangtai");
        },
        ai: {
            order: 3,
            expose: 0.2,
            threaten: 1.4,
            result: {
                target: function (player, target) {
                    return -1;
                },
            },
        },
        "_priority": 0,

    },
    huodezhuangbei: {
        nobracket: true,
        enable: "phaseUse",
        content: function () {
            var card = get.cardPile2(function (card) {
                return get.type(card, "trick") == "equip";
            });
            if (card) player.gain(card, "gain2", "log");
        },
    },
    huodeyanshi: {
        nobracket: true,
        enable: "phaseUse",
        content: function () {
            var card = get.cardPile2(function (card) {
                return get.type(card) == "delay";
            });
            if (card) player.gain(card, "gain2", "log");
        },
    },

    // ============================================
    // ① 塔林 - 弥坚
    // 触发时机：damageEnd（受到伤害后）
    // 效果：四选一 - 摸2张/杀不可响应/伤害+1/护甲+1
    // ============================================
    mijian: {
        audio: 2,//语音编号，2表示有两条语音交替播放
        trigger: { player: "damageEnd" },//受到伤害结算完毕后触发，player表示受害者是自己
        filter: function (event, player) {
            return true;//任何情况下都可以触发（无额外条件）
        },
        check: function (event, player) {
            return true;//AI判断：始终愿意发动（四个选项均有益）
        },
        frequent: true,
        content: function () {
            "step 0"
            //弹出四选一控制框，AI逻辑在ai回调中
            player.chooseControl('摸两张牌', '下一张杀无法被响应', '下一次造成伤害+1', '获得一点护甲')
                .set('prompt', get.prompt('mijian'))//技能名作为标题
                .set('ai', function () {
                    var player = get.player();//get.player()获取当前做选择的角色
                    if (player.hp <= 1) return 3;//濒死时优先护甲以抵御下次伤害
                    if (player.countCards('h') < 2) return 0;//手牌极少时优先摸牌补充资源
                    return 2;//默认选伤害+1，攻击性更强
                });
            "step 1"
            //result.index是chooseControl的选项索引（从0开始）
            switch (result.index) {
                case 0:
                    player.draw(2);//摸两张牌
                    break;
                case 1:
                    //添加临时技能标记，下次使用杀时触发
                    player.addTempSkill('mijian_nores');
                    break;
                case 2:
                    //添加临时技能标记，下次造成伤害时触发
                    player.addTempSkill('mijian_jiashang');
                    break;
                case 3:
                    player.changeHujia(1);//护甲+1
                    break;
            }
        },
        intro: {
            content: function () {
                return get.translation('mijian_info');
            },
        },
    },
    mijian_nores: {//弥坚子技能：下一张杀不可被响应（无法闪避）
        trigger: { player: "useCard" },//使用牌时触发
        forced: true,//锁定触发，不询问玩家
        filter: function (event, player) {
            //只对杀和自制杀（sheji9）生效
            return event.card.name == "sha" || event.card.name == "sheji9";
        },
        content: function () {
            //directHit：令所有角色对此牌直接命中（不能使用闪响应）
            trigger.directHit.addArray(game.players);
            player.removeSkill('mijian_nores');//效果触发一次后移除，实现"下一次"限制
        },
        charlotte: true,//不在武将牌上显示此技能名
    },
    mijian_jiashang: {//弥坚子技能：下一次造成伤害+1
        trigger: { source: "damageBegin1" },//造成伤害开始时触发，source表示伤害来源是自己
        forced: true,
        content: function () {
            trigger.num++;//伤害值+1
            player.removeSkill('mijian_jiashang');//触发一次后移除
        },
        charlotte: true,
    },

    // ============================================
    // ② 波特兰 - 善战
    // 触发方式：主动技（出牌阶段使用/响应阶段打出）
    // 效果：每轮限X+1次，弃一张基本牌，视为使用/打出任意基本牌
    //       X=本局累计造成的伤害点数（通过shanzhan_count子技能统计）
    // 实现思路：
    //   - shanzhan主技能：弹出目标牌类型选择框（chooseButton），再选手牌消耗
    //   - shanzhan_count：监听damageEnd事件，累计伤害到storage中
    //   - shanzhan_reset：监听phaseBegin（自己回合开始），清空本轮使用计数
    // ============================================
    shanzhan: {
        audio: 2,
        enable: ['chooseToUse', 'chooseToRespond'],//出牌阶段和响应阶段均可发动
        group: ['shanzhan_count', 'shanzhan_reset'],//关联的子技能组
        filter: function (event, player) {
            //检查本轮使用次数是否已达上限（上限=累计伤害数+1）
            var maxUse = (player.countMark('shanzhan_damage') || 0) + 1;
            if (player.countMark('shanzhan_used') >= maxUse) return false;
            //检查手牌中有没有基本牌可以消耗
            if (!player.countCards('hs', function (card) { return get.type(card) == 'basic'; })) return false;
            //检查当前情境下有没有至少一种基本牌可以使用/打出
            for (var name of ['sha', 'shan', 'tao', 'jiu']) {
                if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
            }
            return false;
        },
        chooseButton: {
            dialog: function (event, player) {
                //构建可选的目标牌类型列表（只显示当前情境下能用的）
                var vcards = [];
                for (var name of ['sha', 'shan', 'tao', 'jiu']) {
                    var card = { name: name, isCard: true };
                    if (event.filterCard(card, player, event)) {
                        //vcard格式：['牌类型分类', '花色', '牌名']
                        vcards.push(['基本', '', name]);
                    }
                }
                return ui.create.dialog('善战', [vcards, 'vcard'], 'hidden');
            },
            backup: function (links, player) {
                //links[0]是玩家选中的按钮对应的vcard数组，links[0][2]是牌名
                return {
                    filterCard: function (card, player) {
                        return get.type(card) == 'basic';//消耗一张基本牌
                    },
                    selectCard: 1,//选择1张牌
                    viewAs: {
                        name: links[0][2],//视为玩家选择的牌类型
                        isCard: false,
                    },
                    check: function (card) {
                        return 5 - get.value(card);//AI：优先消耗价值低的牌
                    },
                    precontent: function () {
                        player.logSkill('shanzhan');//记录技能发动日志
                        player.addMark('shanzhan_used', 1, false);//本轮使用次数+1（false=不显示标记）
                    },
                };
            },
            prompt: function (links, player) {
                return '善战：将一张基本牌当作【' + get.translation(links[0][2]) + '】使用或打出';
            },
        },
        ai: {
            order: function (item, player) {
                if (_status.event.type == 'phase' && !player.countMark('jinzhi2') && player.getUseValue({ name: 'jiu' }, null, true) > 0 && player.countCards('h', 'sha')) return get.order({ name: 'jiu' }) + 1;
                return 1;
            },
            respondShan: true,
            respondSha: true,
            result: { player: 1 },//AI认为此技能对自己有益，会主动发动
        },
    },
    shanzhan_count: {//善战子技能：统计本局累计造成伤害
        trigger: { source: "damageEnd" },//造成伤害结算完毕后触发，source表示伤害来源是自己
        forced: true,
        charlotte: true,
        content: function () {
            //累计伤害存入storage（trigger.num是本次伤害点数）
            player.addMark('shanzhan_damage', trigger.num);
        },
    },
    shanzhan_reset: {//善战子技能：每回合开始时重置本轮使用次数
        trigger: { player: "phaseBegin" },//自己回合开始时触发
        forced: true,
        charlotte: true,
        content: function () {
            //清除本轮已使用次数的标记
            var used = player.countMark('shanzhan_used');
            if (used > 0) player.removeMark('shanzhan_used', used);
        },
    },


    // ============================================
    // ④ 德意志A59 - 多能
    // 触发时机：phaseDrawBegin（摸牌阶段开始时）
    // 效果：放弃摸牌 → 观看牌堆顶4张 → 取类别各不同的牌 → 剩余放回顶部
    // 实现思路：
    //   step 0: skip('phaseDraw')跳过摸牌，get.cards(4)取4张展示
    //   step 1: chooseButton让玩家选取，filterButton限制同类型只选1张
    //   step 2: gain获得选中牌，cardsGotoPile将剩余放回牌堆顶
    // ============================================
    duoneng: {
        audio: 2,
        trigger: { player: "phaseDrawBegin" },//摸牌阶段开始时触发
        filter: function (event, player) {
            return !event.numFixed;//摸牌数未被固定（未被其他效果锁定）才能放弃摸牌
        },
        check: function (event, player) {
            return player.countCards('h') < player.maxHp;//AI：手牌未满时发动（摸4张比摸2张更有可能补充资源）
        },
        content: function () {
            "step 0"
            trigger.cancel();//放弃本次摸牌阶段
            //从牌堆顶取4张并展示给所有人（cardsGotoOrdering使牌进入公开区域）
            event.drawCards = get.cards(4);
            game.cardsGotoOrdering(event.drawCards);
            "step 1"
            //玩家从4张中选取类别各不相同的牌（每种类型最多选1张）
            var next = player.chooseButton(
                ['多能：选取类别各不同的牌（每类最多1张）', [event.drawCards, 'card']],
                [0, 3]//最少0张，最多3张（基本/锦囊/装备各1张）
            );
            next.set('filterButton', function (button) {
                //检查已选中按钮中是否有同类型的牌
                var selected = ui.selected.buttons;
                var cardType = get.type(button.link);
                for (var b of selected) {
                    if (get.type(b.link) == cardType) return false;//同类型已选，不允许再选
                }
                return true;
            });
            next.set('ai', function (button) {
                return get.value(button.link, get.player());//AI优先选价值高的牌
            });
            "step 2"
            //result.links是玩家选中的card对象数组
            var gained = (result.bool && result.links && result.links.length > 0) ? result.links : [];
            //过滤出未被选中的剩余牌
            var remaining = event.drawCards.filter(function (c) { return !gained.includes(c); });
            //玩家获得选中的牌（'draw'表示从牌堆获得的动画效果）
            if (gained.length > 0) player.gain(gained, 'draw');
            //剩余牌放回牌堆顶（按原顺序，最前面的在顶部）
            if (remaining.length > 0) {
                game.cardsGotoPile(
                    remaining.slice().reverse(),//reverse使原顺序第一张排在最顶部
                    ['top_cards', remaining],
                    function (evt, card) {
                        if (evt.top_cards.includes(card)) return ui.cardPile.firstChild;
                        return null;//放到牌堆顶部
                    }
                );
            }
        },
        intro: {
            content: function () { return get.translation('duoneng_info'); },
        },
    },

    // ============================================
    // ④ 德意志A59 - 代课
    // 触发时机：useCardAfter（使用基本牌/普通锦囊后）
    // 效果：选一名非目标角色 → 令其摸1张牌 → 再令其弃1张手牌
    // 设计意图：干扰敌人（摸牌可能帮助了敌人，但弃牌作为惩罚；对友军则纯收益）
    // ============================================
    daike: {
        audio: 2,
        trigger: { player: "useCardAfter" },//自己使用牌结算后触发
        filter: function (event, player) {
            var type = get.type(event.card);
            var type2 = get.type2(event.card);
            //只对基本牌和普通锦囊触发，不含延时锦囊
            if (type != 'basic' && (type != 'trick' || type2 == 'delay')) return false;
            //必须有非目标玩家（被目标的玩家已被直接影响，不重复操作）
            var targets = event.targets || [];
            return game.hasPlayer(function (current) {
                return current != player && !targets.includes(current);
            });
        },
        frequent: true,
        check: function (event, player) {
            //AI：场上有敌人（用代课干扰敌人）时发动
            return game.hasPlayer(function (current) {
                return get.attitude(player, current) < 0;
            });
        },
        content: function () {
            "step 0"
            //选择一名非目标角色（非自己、非此次使用牌的目标）
            var triggerTargets = trigger.targets || [];
            player.chooseTarget(get.prompt('daike'), function (card, player, target) {
                var evt = _status.event.getTrigger();//获取触发的useCard事件
                var tgts = evt.targets || [];
                return target != player && !tgts.includes(target);
            }).set('ai', function (target) {
                var player = get.player();
                return get.attitude(player, target);
            });
            "step 1"
            if (!result.bool) { event.finish(); return; }
            event.daikeTarget = result.targets[0];
            player.line(event.daikeTarget, 'green');//画一条绿色连线表示效果指向
            event.daikeTarget.draw(1);//目标摸1张牌
            "step 2"
            //目标弃置1张手牌
            if (event.daikeTarget.countCards('h') > 0) {
                event.daikeTarget.chooseToDiscard('h', true, '代课：弃置一张手牌')
                    .set('ai', function (card) {
                        return 6 - get.value(card);//AI弃价值低的牌
                    });
            }
        },
        intro: {
            content: function () { return get.translation('daike_info'); },
        },
    },

    // ============================================
    // ⑨ 齐柏林伯爵 - 枭啸
    // 锁定技：与齐柏林发生伤害关系的角色（打齐柏林或被打）获得"俯冲"标记
    // 触发时机：damageEnd（双向监听：player=被打到, source=打出伤害）
    // 判定：
    //   - 我是受害者（trigger.player == player）→ 攻击者（trigger.source）获得俯冲
    //   - 我是攻击者（trigger.source == player）→ 受害者（trigger.player）获得俯冲
    // 有yingfan_immune标记的角色免疫，不获得俯冲
    // ============================================
    xiaoxiao: {
        audio: 2,
        forced: true,//锁定技
        trigger: { player: "damageEnd", source: "damageEnd" },
        //双向监听：player=被打时触发；source=打人时触发
        filter: function (event, player) {
            //排除自伤（攻击自己）
            if (event.player == event.source) return false;
            //情况一：我是被打方，攻击者是别人
            if (event.player == player && event.source && event.source != player) return true;
            //情况二：我是攻击方，受害者是别人
            if (event.source == player && event.player && event.player != player) return true;
            return false;
        },
        content: function () {
            //确定获得俯冲标记的目标
            var markTarget;
            if (trigger.player == player) {
                markTarget = trigger.source;//有人打了我 → 攻击者获得俯冲
            } else {
                markTarget = trigger.player;//我打了别人 → 被打者获得俯冲
            }
            if (markTarget && !markTarget.hasSkill('yingfan_immune')) {
                markTarget.addMark('fuchong', 1);//俯冲标记+1（可见，供鹰返选择）
            }
        },
        intro: {
            content: function () { return get.translation('xiaoxiao_info'); },
        },
    },

    // ============================================
    // ⑨ 齐柏林伯爵 - 鹰返
    // 触发时机：phaseJieshuBegin（结束阶段）
    // 效果：选一名有俯冲标记的角色→该角色二选一：
    //   ① 将全部手牌交给齐柏林（失去手牌但无永久损失）
    //   ② 失去1点体力上限 + 永久免疫（不再获得俯冲，不再被鹰返选中）
    // 实现：
    //   - 选目标后移除其俯冲标记
    //   - target.chooseControl让目标自选
    //   - 方案②通过addSkill('yingfan_immune')实现永久免疫
    // ============================================
    yingfan: {
        audio: 2,
        trigger: { player: "phaseJieshuBegin" },//结束阶段开始时触发
        frequent: true,
        filter: function (event, player) {
            //需要场上有至少一名（非自己）持有俯冲标记的角色
            return game.hasPlayer(function (t) {
                return t != player && t.countMark('fuchong') > 0;
            });
        },
        check: function (event, player) {
            return true;//AI总是愿意发动（对敌人有害）
        },
        content: function () {
            "step 0"
            //选择一名有俯冲标记的角色作为目标
            player.chooseTarget(get.prompt('yingfan'), function (card, player, target) {
                return target != player && target.countMark('fuchong') > 0;
            }).set('ai', function (target) {
                //AI：优先选敌人（负态度=优先攻击对象）
                return -get.attitude(get.player(), target);
            });
            "step 1"
            if (!result.bool || !result.targets || !result.targets.length) {
                event.finish(); return;
            }
            var target = result.targets[0];
            event.yingfanTarget = target;
            //移除该目标的所有俯冲标记（已被鹰返"收割"）
            target.removeMark('fuchong', target.countMark('fuchong'));
            //让目标自主选择：交手牌 or 失去体力上限+免疫
            target.chooseControl('交出所有手牌', '失去1点体力上限并获得永久免疫')
                .set('prompt', get.translation(player) + '的鹰返：请选择一项')
                .set('ai', function () {
                    var t = get.player();//此AI视角是目标
                    //濒死或体力上限为1时，不能失去体力上限
                    if (t.hp <= 1 || t.maxHp <= 1) return 0;
                    //计算手牌总价值，若价值较高则宁可失去体力上限
                    var cardValue = t.getCards('h').reduce(function (sum, c) {
                        return sum + (get.value(c, t) || 0);
                    }, 0);
                    return cardValue > 9 ? 1 : 0;//手牌价值高则选免疫
                });
            "step 2"
            var target = event.yingfanTarget;
            if (result.index == 0) {
                //方案①：目标将所有手牌交给齐柏林
                var cards = target.getCards('h');
                if (cards.length > 0) {
                    player.gain(cards, target, 'give');//齐柏林获得目标所有手牌
                }
            } else {
                //方案②：目标失去1点体力上限 + 永久免疫
                target.loseMaxHp();//体力上限-1
                target.addSkill('yingfan_immune');//永久免疫技能
                game.log(target, '永久免疫了齐柏林伯爵的连环效果');
            }
        },
        intro: {
            content: function () { return get.translation('yingfan_info'); },
        },
    },
    yingfan_immune: {//鹰返免疫子技能：防止再次获得俯冲标记和被鹰返选中
        //此技能通过addSkill永久添加到目标角色，不会自动移除
        charlotte: false,//在武将牌上显示（让玩家知道自己免疫）
        intro: {
            content: function () { return '已免疫齐柏林伯爵的枭啸和鹰返效果。'; },
        },
    },

    // ============================================
    // ⑧ 阿拉斯加 - 先锋
    // ============================================
    xianfeng: {
        audio: 2,
        trigger: { player: "useCard" },//使用牌后触发（targets已确定）
        filter: function (event, player) {
            //需要有目标，且至少一个目标未横置
            return event.targets && event.targets.length > 0
                && event.targets.some(function (t) { return !t.isLinked(); });
        },
        frequent: true,
        content: function () {
            "step 0";
            //复制targets列表（防止在遍历中修改原数组导致跳过）
            var targetlist = trigger.targets.filter(current => !current.isLinked());
            player.chooseTarget(get.prompt("xianfeng"), get.prompt2("xianfeng"), function (card, player, target) {
                if (_status.event.targetlist.includes(target)) return true;
            }, [1, Infinity])
                .set("ai", function (target) {
                    var player = get.player;
                    var card = _status.event.card;
                    return get.attitude2(player, target) * get.effect(target, card, player, player) - get.effect(target, "tiesuo", player, player);
                })
                .set("card", trigger.card)
                .set("targetlist", targetlist);
            "step 1";
            if (!result.bool || !result.targets) { event.finish(); return; }
            for (var i = 0; i < result.targets.length; i++) {
                var t = result.targets[i];
                //从本次牌的目标列表移除：此次牌对其无效
                trigger.targets.remove(t);
                t.link();//横置目标武将牌（连环状态）
            }
        },
        intro: {
            content: function () { return get.translation('xianfeng_info'); },
        },
    },

    // ============================================
    // ⑧ 阿拉斯加 - 狂欢开幕
    // ============================================
    kuanhuankaimu: {
        audio: 2,
        nobracket: true,//防止4字以上技能名被截断
        zhuanhuanji: true,
        trigger: { global: "linkAfter" },
        mark: true,
        marktext: '☯',
        intro: {
            content(storage) {
                return '转换技。' + (storage ? '阳：你的回合内，场上有武将牌横置时，你可以摸一张牌。' : '阴：出牌阶段，你可以弃置一张牌，然后令一名角色重置其武将牌并摸一张牌。');
            },
        },
        filter(event, player) {
            if (!event.player.isLinked()) return false;
            if (player.storage.kuanhuankaimu) return _status.currentPhase == player;
            return false;
        },
        content: function () {
            player.draw(1);
            player.changeZhuanhuanji('kuanhuankaimu');
        },
        group: ['kuanhuankaimu_yin'],//阴面效果作为子技能
        intro: {
            content: function () { return get.translation('kuanhuankaimu_info'); },
        },
    },
    kuanhuankaimu_yin: {
        enable: "phaseUse",
        filter: function (event, player) {
            if (player.storage.kuanhuankaimu) return false;
            return player.countCards('h') > 0 && game.hasPlayer(function (t) { return t.isLinked(); });
        },
        check: function (event, player) {
            return game.hasPlayer(function (t) {
                return t.isLinked() && get.attitude(player, t) > 0;
            });
        },
        content: function () {
            "step 0"
            player.changeZhuanhuanji('kuanhuankaimu');
            //玩家选择弃置1张手牌（代价）
            player.chooseCard('h', get.prompt('kuanhuankaimu'), '弃置一张手牌，令一名横置角色重置并摸1张牌', false)
                .set('ai', function (card) {
                    return 6 - get.value(card);//AI：优先弃价值低的牌
                });
            "step 1"
            if (!result.bool || !result.cards || !result.cards.length) {
                event.finish(); return;//玩家取消
            }
            player.discard(result.cards);//弃置所选手牌
            player.logSkill('kuanhuankaimu');//记录技能发动日志
            //选择目标：一名横置（连环状态）的角色
            player.chooseTarget('狂欢开幕：选择一名横置的角色，令其重置并摸1张牌', function (card, player, target) {
                return target.isLinked();//只能选横置的角色
            }).set('ai', function (target) {
                //AI：优先解除友方横置（态度>0则解除，<0则帮助敌人失去横置护盾）
                return get.attitude(get.player(), target);
            });
            "step 2"
            if (!result.bool || !result.targets || !result.targets.length) {
                event.finish(); return;
            }
            var t = result.targets[0];
            t.link();//重置：link()切换状态，从横置变为正常（因已横置，再link()则恢复）
            t.draw(1);//该角色摸1张牌

        },
    },

    // ============================================
    // ⑦ 提尔比茨 - 牵制
    // 锁定技，三个复合效果：
    // 1. 手牌装备视为闪（无俾斯麦时激活，chooseToRespond）
    // 2. 回合外装备不可移动（暂简化：通过mod.targetEnabled2阻止顺手牵羊/过河拆桥）
    // 3. 有俾斯麦时，装备当任意基本牌（chooseToUse/Respond）
    // 实现思路：
    //   - group关联两个子技能分别处理效果1和效果3
    //   - 效果1(qianzhi_shan)在无俾斯麦时激活
    //   - 效果3(qianzhi_bismarck)在有俾斯麦时激活（并覆盖效果1）
    //   - mod.targetEnabled2实现效果2（回合外保护装备）
    // ============================================
    qianzhi: {
        audio: 2,
        forced: true,
        group: ['qianzhi_bismarck'],
        mod: {
            cardname(card, player, name) {
                if (lib.card[card.name].type == 'equip' && get.position(card) == 'h') return 'shan';
            },
            canBeDiscarded: function (card) {
                if (get.position(card) == 'e') return false;
            },
            canBeMoved: function (card) {
                if (get.position(card) == 'e') return false;
            },
            canBeGained(card, source, player) {
                if (get.position(card) == 'e') return false;
            },
        },
        intro: {
            content: function () { return get.translation('qianzhi_info'); },
        },
    },
    qianzhi_bismarck: {
        charlotte: true,
        enable: ['chooseToUse', 'chooseToRespond'],//出牌和响应阶段均可
        filter: function (event, player) {
            if (!game.hasPlayer(function (p) { return (p.name == 'bismarck_R' || p.name == 'bisimai_R') && p.isIn(); })) return false;
            if (!player.countCards('hs', function (card) { return lib.card[card.name].type == 'equip'; })) return false;
            //当前情境下至少有一种基本牌可用/可打出
            for (var name of ['sha', 'shan', 'tao', 'jiu']) {
                if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
            }
            return false;
        },
        chooseButton: {
            dialog: function (event, player) {
                //展示当前情境可用的基本牌类型
                var vcards = [];
                for (var name of ['sha', 'shan', 'tao', 'jiu']) {
                    if (event.filterCard({ name: name, isCard: true }, player, event)) {
                        vcards.push(['基本', '', name]);
                    }
                }
                return ui.create.dialog('牵制', [vcards, 'vcard'], 'hidden');
            },
            backup: function (links, player) {
                return {
                    filterCard: function (card) { return lib.card[card.name].type == 'equip'; },
                    position: 'hs',
                    selectCard: 1,
                    viewAs: { name: links[0][2], isCard: true },//视为玩家选择的基本牌
                    check: function (card) { return 6 - get.value(card); },
                    precontent: function () { player.logSkill('qianzhi'); },
                };
            },
            prompt: function (links, player) {
                return '牵制（俾斯麦）：将一张装备当作【' + get.translation(links[0][2]) + '】使用或打出';
            },
        },
        ai: { result: { player: 1 } },
    },

    // ============================================
    // ⑦ 提尔比茨 - 北宅
    // 效果一：弃牌阶段，黑色手牌不计入手牌上限（通过addTempSkill+mod实现）
    // 效果二：弃牌阶段结束，可弃置2张黑色手牌，获得随机装备
    // 实现思路：
    //   - group: ['beizhai_limitadd', 'beizhai_gain'] 分别处理两个效果
    //   - beizhai_limitadd在phaseDiscardBegin触发，添加限制mod的临时技能
    //   - beizhai_limit（临时）修改maxHandcard，让黑色牌不计入上限
    //   - beizhai_gain在phaseDiscardEnd触发，提供弃2黑→随机装备的选项
    // ============================================
    beizhai: {
        audio: 2,
        mod: {
            ignoredHandcard: function (card, player) {
                if (get.color(card) == 'black') {
                    return true;
                }
            },
            cardDiscardable: function (card, player, name) {
                if (name == 'phaseDiscard' && get.color(card) == 'black') return false;
            }
        },
        trigger: { player: "phaseDiscardEnd" },//弃牌阶段结束时触发
        filter: function (event, player) {
            //需要手牌中有至少2张黑色牌才能发动
            return player.countCards('h', function (card) {
                return get.color(card) == 'black';
            }) >= 2;
        },
        frequent: true,
        check: function (event, player) {
            return true;//AI：总是愿意发动（装备牌是资源）
        },
        content: function () {
            "step 0"
            //玩家选择2张黑色手牌弃置
            player.chooseCard('h', '北宅：弃置两张黑色手牌以使用随机装备', [2, 2], function (card) {
                return get.color(card) == 'black';//只能选黑色牌
            }).set('ai', function (card) {
                return 6 - get.value(card);//AI：优先弃价值低的黑色牌
            });
            "step 1"
            if (!result.bool || !result.cards || result.cards.length < 2) {
                event.finish(); return;
            }
            player.discard(result.cards);//弃置选中的两张黑色牌
            //从牌堆随机取一张装备牌
            var equip = get.cardPile(function (card) {
                return get.type(card) == 'equip';
            });
            if (equip) {
                player.chooseUseTarget(equip);
            }
        },
        intro: {
            content: function () { return get.translation('beizhai_info'); },
        },
    },

    // ============================================
    // ⑥ 加贺 - 机动舰队
    // 锁定技，两个复合效果：
    // 1. mod.suit: ♦基本牌视为♣（方块基本牌在花色判定时当梅花处理）
    //    - 意义：♦杀 → ♣杀（黑色），可进一步触发黑色加成效果
    // 2. trigger: 黑色杀对有防具角色造成伤害时，伤害+1
    // 实现思路：
    //   - mod对象始终生效（不需要触发，是属性修改）
    //   - forced: true + trigger实现锁定触发（自动不询问）
    // ============================================
    jidongjiandui: {
        audio: 2,
        nobracket: true,//防止4字技能名截断显示
        forced: true,//锁定技：自动触发，不询问玩家
        mod: {
            suit: function (card, suit) {
                //将方块基本牌视为梅花（mod.suit参数：card=牌对象, suit=原始花色字符串）
                //返回新花色字符串则替换，不返回则保持原花色
                if (suit == 'diamond' && get.type(card) == 'basic') return 'club';
            }
        },
        trigger: { source: "damageBegin1" },//加贺作为伤害来源时（source=加贺）触发
        filter: function (event, player) {
            //条件一：造成伤害的牌是杀
            if (!event.card || event.card.name != 'sha') return false;
            //条件二：该杀是黑色的（♠或♣，含经mod转换后的♦杀→♣杀）
            if (get.color(event.card, player) != 'black') return false;
            //条件三：受伤目标有防具（getEquip(2)返回防具槽装备，null=没有）
            return event.player.getEquip(2) != null;
        },
        content: function () {
            trigger.num++;//伤害点数+1
        },
        intro: {
            content: function () { return get.translation('jidongjiandui_info'); },
        },
    },

    // ============================================
    // ⑥ 加贺 - 舰攻出击
    // 触发时机：source: damageEnd（加贺用杀造成伤害后）
    // 效果：
    //   1. 观看受伤目标手牌，选取1张（chooseButton展示目标手牌）
    //   2. 若取到非黑色牌，该目标视为对加贺使用一张无距限杀（可能反伤）
    // 设计意图：
    //   - 高风险高回报：强行取牌，但若取到红色牌则被反打
    //   - 黑色牌（含由机动舰队转换来的♣）安全，红色牌（♥♦）有风险
    // ============================================
    jiangongchuji: {
        audio: 2,
        nobracket: true,
        trigger: { source: "damageEnd" },//加贺造成伤害结算完毕后触发
        filter: function (event, player) {
            //只对杀造成的伤害触发，且目标需要在场且有手牌
            return event.card && event.card.name == 'sha'
                && event.player.isIn()
                && event.player.countCards('h') > 0;
        },
        check: function (event, player) {
            //AI判断：对敌人（态度<0）且其有手牌时发动
            return get.attitude(player, event.player) < 0;
        },
        content: function () {
            "step 0"
            var target = trigger.player;//受伤目标（被加贺打到的人）
            event.jiagaTarget = target;
            //展示目标的手牌供加贺选择（仅加贺可见，其他人不知道内容）
            player.chooseButton(
                ['舰攻出击：观看并选取一张' + get.translation(target) + '的手牌',
                [target.getCards('h'), 'card']],
                true//true=必须选择（不可取消）
            ).set('ai', function (button) {
                var p = get.player();
                var v = get.value(button.link, p);
                //黑色牌不会触发反击，更安全，稍微加权
                if (get.color(button.link) == 'black') v += 1;
                return v;
            });
            "step 1"
            if (!result.bool || !result.links || !result.links.length) {
                event.finish(); return;
            }
            event.jiagaCard = result.links[0];//选中的牌
            //加贺获得目标手中的该牌（'give'表示从他人手中夺取的动画效果）
            player.gain(event.jiagaCard, event.jiagaTarget, 'give');
            "step 2"
            //判断取到的牌是否为黑色（♠♣）
            if (get.color(event.jiagaCard) != 'black') {
                //非黑色：目标视为对加贺使用一张无距离限制的杀
                var t = event.jiagaTarget;
                if (t.isIn() && player.isIn()) {
                    //useCard: target(t)使用虚拟杀对player(加贺)
                    //第三参数false: 非连锁（不因技能触发而连锁使用）
                    var next = t.useCard({ name: 'sha', isCard: true }, player, false);
                    next.set('addCount', false);//不计入t的出牌次数
                    next.set('nodistance', true);//绕过距离限制
                }
            }
        },
        intro: {
            content: function () { return get.translation('jiangongchuji_info'); },
        },
    },

    // ============================================
    // SP大淀 - 末代旗舰
    // 触发时机：player useCard（使用锦囊牌时）
    // 效果：
    //   - 若有"讯"：获得其中一张回到手牌
    //   - 若无"讯"：翻开牌堆顶4张，选择一种颜色，该颜色的牌作为"讯"扣置于武将牌上，弃置其他牌
    // ============================================
    modaiqijian: {
        audio: false,
        nobracket: true,
        trigger: { player: "useCard" },
        filter: function (event, player) {
            //使用锦囊牌（含延时锦囊）时触发
            return get.type2(event.card) == 'trick';
        },
        check: function (event, player) {
            return true;//AI：始终发动（获得讯牌或取回讯牌均有利）
        },
        content: function () {
            "step 0"
            var xunCards = player.getExpansions('modaiqijian');
            if (xunCards.length > 0) {
                //有讯：选一张获得回手牌
                event.hasXun = true;
                if (xunCards.length == 1) {
                    event._result = { bool: true, links: xunCards };
                } else {
                    player.chooseButton(['选择获得一张"讯"', [xunCards, 'card']], true).set('ai', function (button) {
                        return get.value(button.link);
                    });
                }
            } else {
                //无讯：翻开牌堆顶4张
                event.hasXun = false;
                event.cards = get.cards(4);
                game.cardsGotoOrdering(event.cards);
            }
            "step 1"
            if (event.hasXun) {
                //有讯路径：获得选中的讯牌
                if (result.bool && result.links && result.links.length > 0) {
                    player.gain(result.links, player, 'give');
                }
                event.finish();
                return;
            }
            //无讯路径：展示4张牌
            player.showCards(event.cards, get.translation(player) + '发动了【末代旗舰】');
            "step 2"
            //选择一种颜色
            var hasRed = false, hasBlack = false;
            for (var i = 0; i < event.cards.length; i++) {
                if (get.color(event.cards[i]) == 'red') hasRed = true;
                if (get.color(event.cards[i]) == 'black') hasBlack = true;
            }
            var choices = [];
            if (hasRed) choices.push('红色');
            if (hasBlack) choices.push('黑色');
            if (choices.length == 0) {
                //极端情况：4张牌均无颜色，全部弃置
                game.cardsDiscard(event.cards);
                event.finish();
                return;
            }
            if (choices.length == 1) {
                event._result = { control: choices[0] };
            } else {
                player.chooseControl(choices).set('prompt', '选择一种颜色，该颜色的牌作为"讯"').set('ai', function () {
                    //AI：选数量更多的颜色（讯越多越有利）
                    var cards = _status.event.getParent().cards;
                    var red = 0, black = 0;
                    for (var i = 0; i < cards.length; i++) {
                        if (get.color(cards[i]) == 'red') red++;
                        else black++;
                    }
                    return red >= black ? '红色' : '黑色';
                });
            }
            "step 3"
            //按选择的颜色分组：选定颜色→讯，其余→弃置
            var color = (result.control == '红色') ? 'red' : 'black';
            var keep = [], discard = [];
            for (var i = 0; i < event.cards.length; i++) {
                if (get.color(event.cards[i]) == color) keep.push(event.cards[i]);
                else discard.push(event.cards[i]);
            }
            if (keep.length > 0) {
                player.addToExpansion(keep, 'draw').gaintag.add('modaiqijian');
            }
            if (discard.length > 0) {
                game.cardsDiscard(discard);
            }
        },
        intro: {
            //在武将牌上显示当前扣置的讯牌
            content: "expansion",
            markcount: "expansion",
        },
        onremove: function (player, skill) {
            //技能移除时清理残余讯牌
            var cards = player.getExpansions(skill);
            if (cards.length) player.loseToDiscardpile(cards);
        },
    },

    // ============================================
    // SP大淀 - 海天通讯
    // 触发时机：global judge（任意角色判定时，判定牌翻开前）
    // 效果：
    //   - 打出一张"讯"牌替换判定牌
    //   - 当你以任意方式失去所有"讯"后，回复1点体力（子技能监听）
    // ============================================
    haitiantongxun: {
        audio: false,
        nobracket: true,
        trigger: { global: "judge" },
        filter: function (event, player) {
            return player.getExpansions('modaiqijian').length > 0;
        },
        direct: true,
        content: function () {
            "step 0"
            var expansions = player.getExpansions('modaiqijian');
            player.chooseButton(
                [
                    get.translation(trigger.player) + '的' +
                    (trigger.judgestr || '') + '判定为' +
                    get.translation(trigger.player.judging[0]) +
                    '，' + get.prompt('haitiantongxun'),
                    [expansions, 'card']
                ],
                false//可取消
            ).set('ai', function (button) {
                var triggerEvt = _status.event.getTrigger();
                var target = triggerEvt.player;
                var p = get.player();
                var cardScore = triggerEvt.judge(button.link);
                var curScore = triggerEvt.judge(triggerEvt.player.judging[0]);
                var att = get.attitude(p, target);
                if (att > 0) return cardScore - curScore;
                return curScore - cardScore;
            });
            "step 1"
            if (!result.bool || !result.links || !result.links.length) {
                event.finish(); return;
            }
            var xun = result.links[0];
            player.logSkill('haitiantongxun', trigger.player);
            //旧判定牌弃置
            game.cardsDiscard(trigger.player.judging[0]);
            //讯牌替换为新判定牌
            trigger.player.judging[0] = xun;
            trigger.orderingCards.addArray([xun]);
            game.log(trigger.player, '的判定牌改为', xun);
            game.delay(2);
        },
        //子技能：监听任意方式失去所有讯后回复体力
        group: ["haitiantongxun_recover"],
        subSkill: {
            //失去所有讯牌时回复1点体力
            recover: {
                trigger: {
                    player: ["loseAfter"],
                    global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
                },
                filter: function (event, player) {
                    //满血不触发（回复无意义）
                    if (player.isHealthy()) return false;
                    //检查本次事件中是否有扩展区牌被移走
                    var evt = event.getl(player);
                    if (!evt || !evt.xs || !evt.xs.length) return false;
                    //还有剩余讯牌则不触发
                    if (player.getExpansions('modaiqijian').length > 0) return false;
                    //确认失去的牌确实包含讯牌（通过gaintag_map快照判断）
                    if (event.name == 'lose') {
                        for (var i in event.gaintag_map) {
                            if (event.gaintag_map[i].includes('modaiqijian')) return true;
                        }
                        return false;
                    }
                    //复合事件：遍历子lose历史
                    return player.hasHistory('lose', function (loseEvt) {
                        if (loseEvt.getParent() != event) return false;
                        for (var i in loseEvt.gaintag_map) {
                            if (loseEvt.gaintag_map[i].includes('modaiqijian')) return true;
                        }
                        return false;
                    });
                },
                forced: true,
                content: function () {
                    player.recover(1);
                },
                sub: true,
            },
        },
    },

    butaihegedehuwei: {
        audio: false,
        nobracket: true,
        trigger: { player: "enterGame", global: "gameStart", },
        forced: true,
        filter: function (event, player) {
            return game.hasPlayer(function (current) {
                return current != player;
            });
        },
        content: function () {
            "step 0"
            player.chooseTarget(get.prompt2('butaihegedehuwei'), true, function (card, player, target) {
                return target != player;
            }).set("ai", function (target) {
                var player = _status.event.player;
                return get.attitude(player, target) + Math.random();
            });
            "step 1"
            if (result.bool && result.targets && result.targets.length > 0) {
                var target = result.targets[0];
                player.storage.butaihegedehuwei_target = target;
                player.markAuto("butaihegedehuwei", [target]);
                player.line(target, "green");
                game.log(player, "选择了", target, "作为护卫目标");
            }
        },
        intro: {
            content: function (storage, player) {
                if (storage && storage.length > 0) {
                    return "正在守护" + get.translation(storage[0]);
                }
                return "";
            },
        },
        group: ["butaihegedehuwei_guard", "butaihegedehuwei_clear", "butaihegedehuwei_nocount"],
        subSkill: {
            //以护卫目标为目标的牌结算后，令其摸一张牌并展示，视为你使用之
            guard: {
                usable: 1,
                audio: false,
                trigger: { global: "useCardAfter" },
                filter: function (event, player) {
                    //防止递归触发
                    if (player.storage.butaihegedehuwei_guarding) return false;
                    var target = player.storage.butaihegedehuwei_target;
                    if (!target || !target.isIn()) return false;
                    return event.targets && event.targets.includes(target);
                },
                prompt: function (event, player) {
                    var target = player.storage.butaihegedehuwei_target;
                    return "不太合格的护卫：是否令" + get.translation(target) + "摸一张牌并展示，然后视为你使用之？";
                },
                check: function (event, player) {
                    var target = player.storage.butaihegedehuwei_target;
                    return get.attitude(player, target) > 0;
                },
                logTarget: function (event, player) {
                    return player.storage.butaihegedehuwei_target;
                },
                content: function () {
                    "step 0"
                    player.storage.butaihegedehuwei_guarding = true;
                    event.huwei_target = player.storage.butaihegedehuwei_target;
                    event.huwei_target.draw();
                    "step 1"
                    //result为摸到的牌数组
                    if (result && result.length > 0) {
                        event.drawnCard = result[0];
                        event.huwei_target.showCards(result, get.translation(event.huwei_target) + "展示了摸到的牌");
                    } else {
                        delete player.storage.butaihegedehuwei_guarding;
                        event.finish();
                    }
                    "step 2"
                    var card = event.drawnCard;
                    var cardObj = { name: card.name, nature: card.nature, isCard: true };
                    if (player.hasUseTarget(cardObj)) {
                        //记录所有角色体力值，用于判断是否造成体力值变动
                        event.hpBefore = {};
                        game.countPlayer(function (current) {
                            event.hpBefore[current.playerid] = current.hp;
                        });
                        //标记不计入上限
                        player.storage.butaihegedehuwei_using = true;
                        player.chooseUseTarget(cardObj, false, "不太合格的护卫：视为使用【" + get.translation(card.name) + "】");
                    } else {
                        delete player.storage.butaihegedehuwei_guarding;
                        event.finish();
                    }
                    "step 3"
                    delete player.storage.butaihegedehuwei_using;
                    //检查是否造成体力值变动
                    var hpChanged = false;
                    if (result && result.bool) {
                        game.countPlayer(function (current) {
                            if (event.hpBefore[current.playerid] !== current.hp) hpChanged = true;
                        });
                    }
                    if (hpChanged && game.hasPlayer(function (current) { return current != player; })) {
                        player.chooseTarget("不太合格的护卫：是否更换护卫目标？", function (card, player, target) {
                            return target != player;
                        }).set("ai", function (target) {
                            var player = _status.event.player;
                            return get.attitude(player, target) + Math.random();
                        });
                    } else {
                        delete player.storage.butaihegedehuwei_guarding;
                        event.finish();
                    }
                    "step 4"
                    if (result.bool && result.targets && result.targets.length > 0) {
                        var newTarget = result.targets[0];
                        player.storage.butaihegedehuwei_target = newTarget;
                        player.unmarkSkill("butaihegedehuwei");
                        player.markAuto("butaihegedehuwei", [newTarget]);
                        player.line(newTarget, "green");
                        game.log(player, "更换护卫目标为", newTarget);
                    }
                    delete player.storage.butaihegedehuwei_guarding;
                },
                sub: true,
                "_priority": 0,
            },
            //护卫目标死亡后清理标记
            clear: {
                audio: false,
                trigger: { global: "dieAfter" },
                forced: true,
                silent: true,
                popup: false,
                filter: function (event, player) {
                    return player.storage.butaihegedehuwei_target && event.player == player.storage.butaihegedehuwei_target;
                },
                content: function () {
                    delete player.storage.butaihegedehuwei_target;
                    player.unmarkSkill("butaihegedehuwei");
                },
                sub: true,
                "_priority": 0,
            },
            //不计入上限 - 拦截useCard事件，设置addCount=false
            nocount: {
                trigger: { player: "useCard" },
                forced: true,
                silent: true,
                popup: false,
                charlotte: true,
                firstDo: true,
                filter: function (event, player) {
                    return player.storage.butaihegedehuwei_using;
                },
                content: function () {
                    trigger.addCount = false;
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
    // ============================================
    // 初春 - 泥头船来啦
    // 触发时机：player phaseJieshuBegin（结束阶段开始时）
    // 效果：
    //   - 将区域内所有牌置入弃牌堆
    //   - 选择一名其他角色
    //   - 该角色区域内每有一张牌与你弃置的牌牌名相同，便受到一点伤害
    // ============================================
    nitouchuanlaila: {
        audio: false,
        nobracket: true,
        limited: true,
        skillAnimation: true,
        animationColor: "water",
        trigger: { player: "phaseJieshuBegin" },
        filter: function (event, player) {
            return player.countCards("hej") > 0;
        },
        check: function (event, player) {
            var myCards = player.getCards("hej");
            var myNames = [];
            for (var i = 0; i < myCards.length; i++) {
                myNames.push(myCards[i].name);
            }
            //寻找能造成最大伤害的敌方目标
            var bestDamage = 0;
            game.countPlayer(function (current) {
                if (current == player) return;
                if (get.attitude(player, current) >= 0) return;
                var damage = 0;
                var targetCards = current.getCards("hej");
                for (var j = 0; j < targetCards.length; j++) {
                    if (myNames.includes(targetCards[j].name)) damage++;
                }
                if (damage > bestDamage) bestDamage = damage;
            });
            //能造成3+伤害，或2+伤害且自身危急时使用
            if (bestDamage >= 3) return true;
            if (bestDamage >= 2 && player.hp <= 2) return true;
            return false;
        },
        content: function () {
            "step 0"
            player.awakenSkill("nitouchuanlaila");
            //将区域内所有牌置入弃牌堆
            var cards = player.getCards("hej");
            event.discardedNames = [];
            for (var i = 0; i < cards.length; i++) {
                event.discardedNames.push(cards[i].name);
            }
            player.discard(cards);
            "step 1"
            //选择一名其他角色
            player.chooseTarget("泥头船来啦：选择一名其他角色", true, function (card, player, target) {
                return target != player;
            }).set("ai", function (target) {
                var player = _status.event.player;
                var names = _status.event.getParent().discardedNames;
                var damage = 0;
                var targetCards = target.getCards("hej");
                for (var i = 0; i < targetCards.length; i++) {
                    if (names.includes(targetCards[i].name)) damage++;
                }
                return damage * (-get.attitude(player, target));
            });
            "step 2"
            if (result.bool && result.targets && result.targets.length > 0) {
                var target = result.targets[0];
                player.line(target, "fire");
                //计算匹配的牌数量
                var targetCards = target.getCards("hej");
                var damage = 0;
                for (var i = 0; i < targetCards.length; i++) {
                    if (event.discardedNames.includes(targetCards[i].name)) damage++;
                }
                if (damage > 0) {
                    game.log(target, "区域内有", "#g" + damage, "张牌与", player, "弃置的牌牌名相同");
                    target.damage(damage);
                } else {
                    game.log(target, "区域内没有与", player, "弃置的牌牌名相同的牌");
                }
            }
        },
        ai: {
            order: 1,
            result: { player: 1 },
        },
        "_priority": 0,
    },
    guankanpaidui: {
        audio: 2,
        enable: 'phaseUse',
        locked: true,
        filter: function (event, player) {
            return Array.isArray(event.guankanpaidui);
        },
        onChooseToUse: function (event) {
            if (game.online || !event.player.hasSkill('guankanpaidui')) return;
            var cards = [];
            for (var i = 0; i < 7; i++) {
                var card = ui.cardPile.childNodes[i];
                if (card) cards.push(card);
                else break;
            }
            event.set('guankanpaidui', cards);
        },
        chooseButton: {
            dialog: function (event) {
                var dialog = ui.create.dialog('观看牌堆', 'hidden');
                if (event.guankanpaidui && event.guankanpaidui.length) dialog.add(event.guankanpaidui);
                else dialog.addText('牌堆无牌');
                for (var i of dialog.buttons) {
                    i.classList.add('noclick');
                }
                dialog.buttons.length = 0;
                return dialog;
            },
            filter: function () {
                return false;
            },
        },
    },


};

export { others };