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
                for (var i = 0; i < listm.length; i++) {
                    if (func(listm[i])) event.skills.push(listm[i]);
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
        },
        prompt: "将一张红色牌当雷杀使用",
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
        subSkill: {
            block: {
                mod: {
                    cardEnabled(card, player) {
                        let evt = get.event();

                        if (evt.name != "chooseToUse") {

                            evt = evt.getParent("chooseToUse");
                        }
                        if (!evt?.respondTo || !evt.respondTo[0].hasSkill("fenzhandaodi") || evt.respondTo[1].name != "sha" || evt.respondTo[1].name != "sheji9") {
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
                force: true,
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
                        force: true,
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
        force: true,
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
                player.chooseToDiscard(get.prompt('xiwangdeshuguang'), "弃置一张手牌,令" + get.translation(event.target) + "恢复一点体力", 1).set(ai, function (card) {
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
        obracket: true,
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
};

export { others };