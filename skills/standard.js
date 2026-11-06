import { lib, game, ui, get, ai, _status } from '../../../noname.js';

const standard = {
    manchangzhanyi: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        group: ["manchangzhanyi_mianyi"], trigger: { global: "phaseZhunbeiBegin" }, // 触发时机：其他角色的准备阶段
        filter: function (event, player) {
            return player.inRange(event.player) && event.player.countCards("h"); // 在你的攻击范围内
        },
        check: function (event, player) {
            return get.attitude(player, event.player) <= 0;
        }, content: function () {
            "step 0"
            player.discardPlayerCard('h', trigger.player, 1, true);
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    manchangzhanyi_mianyi: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        round: 1,
        trigger: { player: "damageBefore" },
        filter: function (event, player) { return event.card && get.type2(event.card) == 'trick'; },
        forced: true,
        content: function () {

            trigger.cancel();
            game.log(get.translation(player), "免疫了一次锦囊牌造成的伤害。");
        },
        mark: false,
        sub: true,
    },
    guzhuyizhi: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: { player: 'phaseZhunbeiBegin' },

        check: function (event, player) {
            var cards = player.getCards('h');
            if (player.hp <= 2 && cards.some(function (card) {
                return ['tao', 'jiu', 'kuaixiu9', 'zziqi9'].includes(get.name(card, player));
            })) return false;
            if (cards.length <= 2) return true;
            var lowValueCards = cards.filter(function (card) {
                return get.value(card, player) <= 4;
            }).length;
            return lowValueCards >= Math.ceil(cards.length / 2);
        },
        content: function () {

            player.addTempSkill('guzhuyizhi2', { player: 'phaseBegin' });
            var handCount = player.countCards("h");
            player.discard(player.getCards("h"));
            player.draw(handCount + 2);
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },

    guzhuyizhi2: {
        init: function (player, skill) {
            player.addSkillBlocker(skill);
        },
        onremove: function (player, skill) {
            player.removeSkillBlocker(skill);
        },
        charlotte: true,
        locked: true,
        skillBlocker: function (skill, player) {
            return skill != 'guzhuyizhi' && skill != 'guzhuyizhi2' && !lib.skill[skill].charlotte;
        },
        mark: true,
        intro: {
            content: function (storage, player, skill) {
                var list = player.getSkills(null, false, false).filter(function (i) {
                    return lib.skill.fengyin.skillBlocker(i, player);
                });
                if (list.length) return '失效技能：' + get.translation(list);
                return '无失效技能';
            },
        },
        mod: {
            /*cardEnabled: function (card) {
                if (card.name == 'tao' || card.name == 'kuaixiu9') return false;
            },*/
            maxHandcardBase: function (player, num) {
                if (player.hp == player.maxHp) {
                    var damage = player.getStat().damage;
                    if (typeof damage == 'number') return damage - player.countMark('shoupaiup');
                    return 0 - player.countMark('shoupaiup');
                } else {
                    var damage = player.getStat().damage;
                    if (typeof damage == 'number') return damage - player.countMark('shoupaiup') - 1;
                    return 0 - player.countMark('shoupaiup') - 1;
                }
            },
            cardUsable: function (card, player, num) {
                if (card.name == 'sha') return num + 1;
            },
            globalFrom: function (from, to, distance) {
                return distance - 1;
            }
        }
    },

    shuileizhandui_skill: {
        nobracket: true,
        mod: {
            targetEnabled(card, player, target, now) {
                if (target.countCards("h") == 0) {
                    if (card.name == "sha") return false;
                }
            },
        },
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        filterCard: true,
        position: 'hejs',
        discard: false,
        selectCard: [1, Infinity],
        lose: false,
        check: function (card) {
            var player = get.player();
            // 防具和防御马优先保留，避免 AI 为摸雷杀交出关键防御装备。
            if (['equip2', 'equip3'].includes(get.subtype(card))) return -100;
            var val = 5;
            if (player.needsToDiscard()) val = 15;
            return val - get.value(card) > 0;
        },
        filterTarget: function (card, player, target) {
            return player != target;
        },
        //使用give必须要以上这三条属性
        prompt: function () { return ('选择一名角色并交给其任意张牌') },
        content: function () {
            "step 0";
            player.give(cards, targets[0]);
            "step 1";
            if (player.hasSkill("shuileizhandui_skill_1")) {
                event.finish();
                return;
            }
            player.addTempSkill("shuileizhandui_skill_1", { global: 'phaseAfter' });
            event.thunderSha = get.cardPile(function (card) {
                return get.name(get.autoViewAs(card)) == 'sha' && game.hasNature(card, 'thunder');
            });
            if (!event.thunderSha) {
                event.finish();
                return;
            }
            player.chooseBool("水雷战队：是否获得" + get.translation(event.thunderSha) + "？").set('ai', () => true);
            "step 2";
            if (result.bool && ['c', 'd'].includes(get.position(event.thunderSha, true))) {
                player.gain(event.thunderSha, 'gain2');
            }
        },
        ai: {
            expose: 0.1,
            order: 5,

            noh: true,
            skillTagFilter(player, tag) {
                if (tag == 'noh') {
                    if (player.countCards('h') != 1) return false;
                }
            }, result: {
                target: function (player, target) {
                    if (!player || !target) return 0;
                    if (!ui.selected.cards || ui.selected.cards.length == 0) return 0;
                    if (get.value(ui.selected.cards[0], false, 'raw') < 0) return -1;
                    return 1;
                }
            }
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        }

    },


    shuileizhandui_skill_1: {
        /*trigger: { player: "gainEnd" }, // 当你获得牌时触发
        //direct: true,
        filter: function (event, player) {
            return !player.hasMark('shuileizhandui_skill_1');
        },
        content: function () {
            "step 0"
            player.chooseCardTarget({
                prompt: get.prompt('战队支援'),
                prompt2: ('选择一张卡牌,令指定的一名本回合内未因“水雷战队1”获得牌的角色获得之'),
                position: 'hejs',//hej代指牌的位置,加个s即可用木流流马的牌。
                selectCard: function () {
                    var player = get.player();
                    return 1;
                },//要气质的卡牌,可以return[1,3]
                selectTarget: function () {
                    var player = get.player(); return [1];
                },//要选择的目标,同上,目标上限跟着手牌数走,怕报错跟个判定。
                filterCard: function (card, player) {
                    return lib.filter.cardDiscardable(card, player);
                },//气质能气质掉的卡牌。
                filterTarget: function (card, player, target) {
                    return target != player && !target.hasMark("shuileizhandui_skill_1");
                },//选择事件包含的目标,有其他同技能的角色时,ai不要重复选择目标。
                ai1: function (card) {
                    // 防具和防御马不作为自动支援牌交出。
                    if (['equip2', 'equip3'].includes(get.subtype(card))) return -100;
                    return 12 - get.useful(card);
                },//建议卡牌以7为标准就行,不要选太多卡牌,要形成持续的牵制。
                ai2: function (target) {
                    return get.attitude(player, target);
                }, //targets: trigger.targets,//贯石斧、朱雀羽扇有类似代码。还有recover版的。
            });//技能还没扩起来,括起来。
            "step 1";
            if (result.bool) {
                result.targets[0].addTempSkill("shuileizhandui_skill_1", { player: 'phaseJieshuBegin' });
                if (game.countPlayer(function (current) {
                    return current.hasMark('shuileizhandui_skill_1');
                }) == 3) {
                    for (var i = 0; i < game.players.length; i++) {
                        var current = game.players[i];
                        if (current.hasSkill('shuileizhandui_skill')) {
                            current.draw(1);
                        }
                    }
                }
                player.give(result.cards[0], result.targets[0]);
                result.targets[0].addMark("shuileizhandui_skill_1");
                result.targets[0].useSkill('shuileizhandui_skill_1');
            };
        },
        onremove: function (player) { player.removeGaintag('shuileizhandui_skill_1'); },
        ai: {
            order: function (skill, player) {
                return 1;
            },
            result: {
                target: function (player, target) {
                    if (!player || !target) return 0;
                    if (target.hasSkillTag('nogain')) return 0;
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                        if (target.hasSkillTag('nodu')) return 0;
                        return -10;
                    }
                    if (target.hasJudge('lebu')) return 0;
                    var nh = target.countCards('h');
                    var np = player.countCards('h');
                    if (player.hp == player.maxHp || player.storage.rende < 0 || player.countCards('h') <= 1) {
                        if (nh >= np - 1 && np <= player.hp && !target.hasSkill('haoshi')) return 0;
                    }
                    return Math.max(1, 5 - nh);
                },
            },
 
            intro: {
                content: function () {
                    return get.translation(skill + '_info');
                },
            },
        },
        */
    },
    dumuchenglin: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        group: ["dumuchenglin_2", "dajiaoduguibi"],
    },
    dumuchenglin_2: {
        nobracket: true,
        //audio: "ext:舰R牌将/audio/skill:true",
        mod: {
            cardUsable: function (card, player, num) {
                if (card.name == 'sha' && !game.hasPlayer(current => current != player && current.hasSkill('hangmucv'))) return num + 1;
            },
        },
        /*
        trigger: {
            source: "damageBegin1",
        },
        filter: function (event, player) {
            if (player != event.player) {
                game.log("本回合造成伤害量：" + player.getStat().damage);
 
                if (player.getStat().damage == undefined || player.getStat().damage <= 1) {  //这个神奇变量的变化过程是：undefined,2,3,4...
                    return true;
                }
            }
            return false;
        },
 
        forced: true,
        charlotte: true,
        content: function () {
 
 
            game.log("本回合计算前数值：" + trigger.num);
            game.log("伤害+1");
            trigger.num++;
            game.log("计算后" + trigger.num);
 
        } 
        */
    },

    bigE: {
        prompt: "你令使用的第一张杀需要两张闪响应",
        audio: "ext:舰R牌将/audio/skill:true",
        forced: true,
        filter: function (event, player) {
            return (event.card.name == 'sha' || event.card.name == 'sheji9') && !event.getParent().directHit.includes(event.target) && player.getHistory('useCard', function (event) {
                return event.card.name == 'sha' || event.card.name == 'sheji9';
            }).length == 1;
        },
        trigger: { player: 'useCardToPlayered' },
        logTarget: 'target',
        async content(event, trigger, player) {
            const id = trigger.target.playerid;
            const map = trigger.getParent().customArgs;
            if (!map[id]) map[id] = {};
            if (typeof map[id].shanRequired == 'number') {
                map[id].shanRequired++;
            }
            else {
                map[id].shanRequired = 2;
            }
        },
        ai: {
            "directHit_ai": true,
            skillTagFilter(player, tag, arg) {
                if (arg.card.name != 'sha' || arg.target.countCards('h', 'shan') > 1) return false;
            },
        },
        group: ["bigE_effect"],
        subSkill: {
            effect: {
                prompt: "你令受到伤害的角色进水（手牌上限-1直到其回合结束）",
                shaRelated: true,
                trigger: {
                    source: "damageSource",
                },
                frequent: true,
                filter: function (event, player) {
                    if (event._notrigger.includes(event.player)) return false;
                    return (event.card && (event.card.name == 'sha' || event.card.name == 'sheji9') && (event.getParent().name == 'sha' || event.getParent().name == 'sheji9') &&
                        event.player.isIn());
                },
                check: function (event, player) {
                    return get.attitude(player, event.player) < 0 && player.countCards('h') > 1;
                },
                content: function () {
                    'step 0'
                    trigger.player.addSkill('_wulidebuff_jinshui');
                    trigger.player.addMark('_wulidebuff_jinshui', 1);
                    game.log(get.translation(player.name) + '让:' + get.translation(trigger.player.name) + '进水减手牌上限了');

                },
            },

        },
    },
    xiangrui: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: { player: "damageBegin4", },
        usable: 1,
        mark: true,
        content: function () {
            "step 0"
            player.judge(function (card) {
                if (get.suit(card) == 'spade') {
                    trigger.cancel();
                    player.addMark('xiangrui', 1);
                    return 1;
                }
                return 0;
            });
        },
        marktext: "祥瑞",
        intro: {
            name: "祥瑞",
            content: "幸运值$",
        },
    },
    yumian: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "phaseJieshuBegin",
        },
        forced: true,
        /*filterTarget: function (card, player, target) {
            return get.distance(player, target) <= 1 && target.isAlive;
        },*/
        content: function () {
            "step 0"
            event.unlimited = player.countMark('xiangrui') > 0;
            player.removeMark('xiangrui', player.countMark('xiangrui'));
            player.chooseTarget(get.prompt2('yumian'), true, function (card, player, target) {
                return _status.event.unlimited || get.distance(player, target) <= 1;
            }).set('unlimited', event.unlimited).set('ai', function (target) {
                var player = get.player();
                return get.effect(target, { name: 'losehp' }, player, target);
            });
            "step 1"
            //game.log("result.bool" + result.bool);
            if (result.bool) {
                var target = result.targets[0];
                target.loseHp(1);
                target.draw(2);

                // 将体力流失计入雪风的造成伤害统计
                var sourceStat = player.getStat();
                if (!sourceStat.damage) sourceStat.damage = 0;
                sourceStat.damage += 1;

                // 将体力流失计入承受者的受伤统计
                var targetStat = target.getStat();
                if (!targetStat.damaged) targetStat.damaged = 0;
                targetStat.damaged += 1;
            } else {
                event.finish();
                return;
            }
        },
        ai: {
            damage: true,
            threaten: 1.3,
        },
    },
    hangkongxianqu: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        //audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "useCardAfter",
        },
        frequent: true,
        filter: function (event, player) {
            //if (event.getParent().triggeredTargets3.length > 1) return false;
            return event.targets.length > 0 && (get.type(event.card) == 'trick' && !event.card.isCard);
        },
        content() {
            "step 0"
            event.cards = get.cards(Math.min(4, trigger.targets.length));
            game.cardsGotoOrdering(event.cards);
            event.videoId = lib.status.videoId++;
            game.broadcastAll(function (player, id, cards) {
                var str;
                if (player == game.me && !_status.auto) {
                    str = '获取花色各不相同的牌';
                }
                else {
                    str = '航空战术先驱';
                }
                var dialog = ui.create.dialog(str, cards);
                dialog.videoId = id;
            }, player, event.videoId, event.cards);
            event.time = get.utc();
            game.addVideo('showCards', player, ['航空战术先驱', get.cardsInfo(event.cards)]);
            game.addVideo('delay', null, 2);
            "step 1"
            var list = [];
            for (var i of event.cards) list.add(get.suit(i, false));
            var next = player.chooseButton(list.length, true);
            next.set('dialog', event.videoId);
            next.set('filterButton', function (button) {
                for (var i = 0; i < ui.selected.buttons.length; i++) {
                    if (get.suit(ui.selected.buttons[i].link) == get.suit(button.link)) return false;
                }
                return true;
            });
            next.set('ai', function (button) {
                return get.value(button.link, _status.event.player);
            });
            "step 2"
            if (result.bool && result.links) {
                event.cards2 = result.links;
            }
            else {
                event.finish();
                return;
            }
            var time = 1000 - (get.utc() - event.time);
            if (time > 0) {
                game.delayx(0, time);
            }
            "step 3"
            game.broadcastAll('closeDialog', event.videoId);
            var cards2 = event.cards2;
            player.gain(cards2, 'log', 'gain2');
        },
        ai: {
            threaten: 1.6,
        },
    },
    gaosusheji: {
        nobracket: true,
        init: function (player) {
            //game.log("高速射击初始化检查");
            //game.log(typeof player.storage.gaosusheji);
            if (typeof player.storage.gaosusheji === 'undefined') player.storage.gaosusheji = false;
        },
        audio: "ext:舰R牌将/audio/skill:true",
        zhuanhuanji: true,
        mark: true,
        marktext: "☯",
        intro: {
            content: function (storage, player, skill) {
                if (storage) return '出牌阶段你使用的第一张牌为普通锦囊牌时,你可以令此牌额外结算一次。';
                return '出牌阶段你使用的第一张牌为基本牌时,你可以令此牌额外结算一次。';
            },
        },
        trigger: {
            player: "useCard",
        },

        filter: function (event, player) {
            var evtx = event.getParent('phaseUse');
            if (!evtx || evtx.player != player) return false;
            if (player.countUsed() != 1) return false;
            //game.log("高速射击初始化检查");
            //game.log(typeof player.storage.gaosusheji);
            if (typeof player.storage.gaosusheji === 'undefined') player.storage.gaosusheji = false;
            if (player.storage.gaosusheji) {
                //game.log("阳");
                return (_status.currentPhase == player && (get.type(event.card) == 'trick') && event.getParent('phaseUse') == evtx);
            } else {
                //game.log("阴");
                return (_status.currentPhase == player && (get.type(event.card) == 'basic') && event.getParent('phaseUse') == evtx);

            }

        },
        check(event, player) {
            return !get.tag(event.card, 'norepeat')
        },
        content: function () {
            if (typeof player.storage.gaosusheji === 'undefined') { player.storage.gaosusheji = false; }
            //game.log("1:" + player.storage.gaosusheji);
            player.storage.gaosusheji = (!player.storage.gaosusheji);
            //player.changeZhuanhuanji('gaosusheji');
            //game.log("2:" + player.storage.gaosusheji);
            trigger.effectCount++;
            //game.logSkill('gaosusheji');
        },
    },
    qixi_cv: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        unique: true,
        enable: "phaseUse",
        mark: true,
        skillAnimation: true,
        limited: true,
        animationColor: "wood",
        init: function (player) {
            player.storage.qixi_cv = false;
        },
        filter: function (event, player) {
            if (player.storage.qixi_cv) return false;
            return true;
        },
        logTarget: function (event, player) {
            return game.players.sortBySeat(player);
        },


        content: function () {
            'step 0'
            player.awakenSkill('qixi_cv');
            player.storage.qixi_cv = true;
            event.num = 0;
            event.targets = game.filterPlayer(current => current != player).sortBySeat();
            if (event.targets.length == 0) {
                event.finish();
                return;

            }
            //game.log(event.targets);
            'step 1'
            event.target1 = event.targets.shift();
            event.target1.chooseControlList(
                ['令' + get.translation(player) + '弃置你区域内的两张牌',
                    '本回合不能使用或打出手牌', '翻面'],
                true).set('ai', function (event, player) {
                    var target = _status.event.getParent().player;
                    var player = get.player();
                    var options = [
                        { name: "弃牌", weight: 3 },
                        { name: "沉默", weight: 3 },
                        { name: "翻面", weight: 1 },
                    ];
                    //根据条件修改权重
                    if (get.attitude(player, target) > 0) options[1].weight += 1;
                    if (!player.hasEmptySlot(2)) options[0].weight -= 2;
                    else if (player.countCards("h") > 3) options[0].weight += 1;
                    if (player.hp <= 2) options[1].weight -= 1;
                    if (!player.countCards('hej')) return 1;

                    //加权随机
                    var totalWeight = options.reduce((acc, option) => acc + option.weight, 0);
                    var randomValue = Math.random() * totalWeight;

                    let cumulativeWeight = 0;
                    for (var option of options) {
                        cumulativeWeight += option.weight;
                        if (randomValue <= cumulativeWeight) {
                            var selectedOption = option.name;
                            break;
                        }
                    }
                    //game.log('selectedOption' + selectedOption);
                    if (selectedOption == "弃牌") return 0;
                    else if (selectedOption == "沉默") return 1;
                    else if (selectedOption == "翻面") return 2;


                    return 2;
                });


            //game.log(event.target1);
            //game.log("选择完成");
            'step 2'
            if (result.index == 0) {
                game.log(get.translation(event.target1) + "弃牌");
                player.discardPlayerCard(event.target1, 2, 'hej', true)

            } else if (result.index == 1) {
                game.log(get.translation(event.target1) + "不能使用手牌");
                event.target1.addTempSkill('qixi_cv_block', { global: "phaseAfter" });

            } else {
                game.log(get.translation(event.target1) + "翻面");
                event.target1.turnOver();

            }

            //game.log("操作完成");

            'step 3'
            if (event.num < event.targets.length) event.goto(1);
            else game.delayx();
            //game.log("技能结束");
            'step 4'
            player.chooseTarget("请选择目标,视为使用【万箭齐发】", [1, Infinity], function (card, player, target) {
                return player != target;
            }).set("ai", function (target) {
                return -get.attitude(player, target);
            });
            "step 5"
            if (result.targets && result.targets.length > 0) {
                player.useCard({ name: 'wanjian' }, result.targets, false);
            }
            /*var next = game.createEvent('hangmucv');
            next.player = player;
            next.setContent(lib.skill.hangmucv.content);*/
        },
        subSkill: {
            block: {
                charlotte: true,
                mark: true,
                intro: {
                    content: "不能使用或打出手牌",
                },
                charlotte: true,
                mod: {
                    "cardEnabled2": function (card) {
                        if (get.position(card) == 'h') return false;
                    },
                },
                sub: true,
                "_priority": 0,
            },
        },
        /* ai: {//2026.2.10旧版本AI
            order: 10,
            result: {
 
                player: function (player) {
                    var damageCards = player.getCards('h', function (card) {
                        return get.tag(card, 'damage') && get.type(card) == 'trick';
                    });
                    if (damageCards.length >= 1) {
                        return game.countPlayer(function (current) {
                            if (current != player) {
                                return get.sgn(get.damageEffect(current, player, player));
                            }
                        });
                    }
                    return 0;
                },
            },
        }, */
        ai: {
            order: 10,
            result: {
                // 核心：是否发动该限定技（player为当前AI玩家）
                player: function (player) {
                    // 1. 基础校验：限定技已用/非出牌阶段/无操作空间 → 不发动
                    if (player.storage.qixi_cv == true || game.countPlayer(function (p) { return p != player && p.isIn(); }) == 0) {
                        return 0;
                    }
                    if (game.roundNumber < 2) {
                        return 0;
                    }
                    var damageCards = player.getCards('h', function (card) {
                        return get.tag(card, 'damage') && get.type(card) == 'trick';
                    });
                    // 2. 核心收益计算：评估技能对全场的净收益
                    var totalProfit = 0;
                    var enemies = player.getEnemies(); // 敌方角色
                    var friends = player.getFriends(); // 友方角色（包括自己,但排除）

                    // 遍历所有其他角色,计算对每个角色的收益
                    var alltargets = game.filterPlayer(current => current != player).sortBySeat();
                    for (var target of alltargets) {
                        if (target == player || !target.isIn()) continue;

                        // 2.1 评估该角色的「被技能影响的收益」
                        var targetProfit = 0;
                        // 判定该角色的最优选择（AI会预判对方选对自己最有利的选项）
                        var bestChoice = lib.skill.qixi_cv.getTargetBestChoice(target, player);
                        var att = get.attitude(player, target);
                        // 2.2 按对方选择计算收益（敌方/友方收益反向）
                        if (att <= 0) {
                            // 敌方：对方选的选项越差,我方收益越高
                            targetProfit = lib.skill.qixi_cv.getChoiceCost(target, bestChoice);
                            var eff = get.sgn(get.effect(target, { name: 'wanjian' }, player, player));
                            if (target.hp == 1) {
                                eff *= 1.5;
                            }
                            if (damageCards.length >= 1) {
                                eff += get.sgn(get.damageEffect(target, player, player));
                            }
                            targetProfit += eff;
                        } else {
                            // 友方：对方选的选项越优,我方收益越高（避免误伤友方）
                            targetProfit = -lib.skill.qixi_cv.getChoiceCost(target, bestChoice);
                        }
                        totalProfit += targetProfit;
                    }
                    // 限定技阈值：收益≥1 才发动（避免浪费）
                    return totalProfit > 2 ? 1 : 0;
                },
            },
        },

        // 【辅助函数】预判目标角色会选哪个选项（1=弃2牌,2=禁手牌,3=翻面）
        getTargetBestChoice(target, player) {
            // 计算每个选项对目标的成本（成本越低,目标越可能选）
            var cost1 = lib.skill.qixi_cv.getChoiceCost(target, 1); // 弃2牌的成本
            var cost2 = lib.skill.qixi_cv.getChoiceCost(target, 2); // 禁手牌的成本
            var cost3 = lib.skill.qixi_cv.getChoiceCost(target, 3); // 翻面的成本

            // 返回成本最低的选项（目标的最优选择）
            var minCost = Math.min(cost1, cost2, cost3);
            if (minCost == cost1) return 1;
            if (minCost == cost2) return 2;
            return 3;
        },

        // 【辅助函数】计算某个选项对目标的成本（数值越大,成本越高）
        getChoiceCost(target, choice) {
            switch (choice) {
                case 1: // 弃置2张牌
                    var cardNum = target.countCards('he'); // 手牌+装备区牌数
                    // 牌越多,弃牌成本越高；关键牌（桃/酒/闪）权重更高
                    var keyCardWeight = target.countCards('h', function (card) {
                        return ['tao', 'jiu', 'shan', 'kuaixiu9', 'zziqi9', 'huibi9'].includes(get.name(card));
                    });
                    return Math.min(cardNum, 2) + keyCardWeight;

                case 2: // 本回合不能使用/打出手牌
                    // 手牌越多/输出型角色,禁手牌成本越高
                    var SaveCardNum = target.countCards('h', function (card) {
                        return ['tao', 'jiu', 'shan', 'kuaixiu9', 'zziqi9', 'huibi9'].includes(get.name(card));
                    });
                    return SaveCardNum * (target.hp < 2 ? 1.5 : 1);

                case 3: // 翻面
                    // 回合外防御弱/血量低,翻面成本越高
                    var hpRatio = target.hp / target.maxHp;
                    var defenseWeak = target.countCards('h', card => get.type(card) == 'basic') < 2;
                    return (1 - hpRatio) * 2 + (defenseWeak ? 1 : 0);
            }
        },
        intro: {
            content: "limited",
        },
        "_priority": 0,
    },
    rand: {
        enable: "phaseUse",
        content: function () {
            var options = [
                { name: "一", weight: 1 },
                { name: "二", weight: 1 },
                { name: "三", weight: 1 },
                { name: "四", weight: 1 },
                { name: "五", weight: 1 },
                { name: "六", weight: 1 }
            ];

            //game.log(options);
            var selectedOption = 0;
            const totalWeight = options.reduce((acc, option) => acc + option.weight, 0);
            const randomValue = Math.random() * totalWeight;
            let cumulativeWeight = 0;
            for (const option of options) {
                cumulativeWeight += option.weight;

                if (randomValue <= cumulativeWeight) {
                    selectedOption = option.name;
                    break;
                }
            }

            game.log("随机选择的选项是:" + selectedOption);
        }
    },
    duikongfangyu: {//对空防御的摸牌部分写在防空
        nobracket: true,
        forced: true,
        ai: {
            notrick: true,
            effect: {
                target: function (card, player, target, current) {
                    if (target.countCards('he') <= 1) return;
                    if (get.type(card) == 'trick' && (get.name(card) == 'nanman' || get.name(card) == 'wanjian' || get.name(card) == 'wanjian9' || get.name(card) == 'manchangyiyi9' || get.name(card) == 'zhiyuangongji9' || get.name(card) == 'zuihoudeduiyou9' || get.name(card) == 'paohuofugai9')) {
                        return 0.6;
                    }
                },
            },
        },

        "_priority": 0,

    },
    zhudaojiandui: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        filter: function (event, player) {
            return player.countMark('zhudaojiandui') > 2;
        },
        content: function () {
            'step 0'
            player.removeMark('zhudaojiandui', 3);
            player.chooseUseTarget('sha', false);
        },
        marktext: "柱",
        intro: {
            name: "柱岛舰队",
            "name2": "柱",
            content: "mark",
        },
        ai: {
            order: 1,
            result: {
                player: 1,
            },
            threaten: 1.5,
        },
        group: "zhudaojiandui_add",
        subSkill: {
            add: {
                trigger: {
                    player: ["useCardAfter", "respond"],
                },
                forced: true,
                filter: function (event, player) {
                    return get.type(event.card) == 'basic' && event.card.isCard && event.cards.length == 1;
                },
                content: function () {
                    player.addMark('zhudaojiandui', 1);
                },
                sub: true,
                "_priority": 0,
            },
        },

    },
    sawohaizhan: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        group: ["sawohaizhan_1", "sawohaizhan_2"],
        //preHidden: ["sawohaizhan_1", "sawohaizhan_2"],
        "_priority": 0,
    },
    sawohaizhan_1: {
        nobracket: true,
        usable: 1,
        enable: "chooseToUse",
        filterCard(card) {
            return get.color(card) == 'black';
        },
        position: "hes",
        viewAs: {
            name: "sha", nature: 'thunder',
        },
        viewAsFilter(player) {
            if (!player.countCards('hes', { color: 'black' })) return false;
            return true;
        },
        prompt: "将一张黑色牌当雷杀使用",
        check(card) { return 4 - get.value(card) },
        hiddenCard: function (player, name) {
            if (name == 'sha') return player.countCards('hs', { color: 'black' }) > 0;
        },
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
        "_priority": 0,

    },
    sawohaizhan_2: {
        nobracket: true,
        enable: 'chooseToUse',
        position: 'hes',
        viewAsFilter: function (player) {
            return !player.hasSkill('sawohaizhan_2_used') && player.countCards('hes', { color: 'red' }) > 0;
        },
        precontent: function () {
            player.addTempSkill('sawohaizhan_2_used', { global: 'phaseAfter' });
        },
        subSkill: { used: { charlotte: true } },
        viewAs: {
            name: "dongzhuxianji",
        },
        filterCard: {
            color: "red",
        },
        check: function (card) {
            return 8 - get.value(card);
        },
        prompt: "你可以将一张红牌当作洞烛先机使用（洞烛先机：观星2,然后摸两张牌）",
        ai: {
            wuxie: function (target, card, player, viewer) {
                if (get.mode() == 'guozhan') {
                    if (!_status._aozhan) {
                        if (!player.isMajor()) {
                            if (!viewer.isMajor()) return 0;
                        }
                    }
                }
            },
            basic: {
                order: 7.2,
                useful: 4.5,
                value: 9.2,
            },
            result: {
                target: 2,
            },
            tag: {
                draw: 2,
            },
        },
        "_priority": 0,
    },
    qingyeqingyeqing: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            target: "useCardToTarget",
        },
        filter: function (event, player) {
            return event.player != player && event.targets && event.targets.length == 1;
        },
        check: function (event, player) {
            return get.effect(player, event.card, event.player, player) < 0;
        },
        content: function () {
            'step 0'
            player.chooseTarget(get.prompt2('qingyeqingyeqing'), function (card, player, target) {
                return target != player;
            }).set('ai', function (target) {
                var player = get.player();
                return get.attitude(target, player);
            }).set('targets', trigger.targets);
            'step 1'
            if (result.bool) {
                var target = result.targets[0];
                player.logSkill('qingyeqingyeqing', target);
                event.target = target;
                target.chooseToDiscard("he", '弃置一张非基本牌令此牌对' + get.translation(player) +
                    '无效,或袖手旁观', function (card) {
                        return get.type(card) != 'basic';
                    }).set('ai', function (card) {
                        return (get.effect(player, trigger.card, trigger.player, player)) - get.value(card);
                    });
                game.delayx();
            }
            else {
                event.finish();
            }
            'step 2'
            if (result.bool) {
                trigger.targets.length = 0;
                trigger.getParent().triggeredTargets2.length = 0;
                trigger.cancel();
            }
        },
        "_priority": 0,
    },
    mingyundewufenzhong: {
        nobracket: true,
        group: ["wufenzhong1", "wufenzhong2", "wufenzhong4"],
        "_priority": 0,
    },
    wufenzhong1: {
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "phaseJudgeBefore",
        },
        direct: true,
        content: function () {
            "step 0"
            var check = player.countCards('h') > 2 || player.countCards('j') > 0;
            player.chooseTarget(get.prompt("mingyundewufenzhong"), "跳过判定阶段和摸牌阶段,视为对一名其他角色使用一张【杀】", function (card, player, target) {
                if (player == target) return false;
                return player.canUse({ name: 'sha' }, target);
            }).set('check', check).set('ai', function (target) {
                if (!_status.event.check) return 0;
                return get.effect(target, { name: 'sha' }, _status.event.player);
            }).setHiddenSkill('wufenzhong1');
            "step 1"
            if (result.bool) {
                player.logSkill('wufenzhong1', result.targets);
                player.storage.AttTarget = result.targets[0]
                var list = ["thunder", "fire"];
                player.chooseControl(list).set('prompt', get.prompt('mingyundewufenzhong')).set('prompt2', '视为使用一张属性杀');
            } else {
                event.finish();
            }
            "step 2"
            //game.log(result.index);
            if (result.index == 0) {
                player.useCard({ name: 'sha', nature: 'thunder', isCard: true }, player.storage.AttTarget, false);
            } else if (result.index == 1) {
                player.useCard({ name: 'sha', nature: 'fire', isCard: true }, player.storage.AttTarget, false);
            }
            trigger.cancel();
            player.skip('phaseDraw');

        },
        "_priority": 0,
    },
    wufenzhong2: {
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "phaseUseBefore",
        },
        direct: true,
        filter: function (event, player) {
            return player.countCards('he', function (card) {
                if (_status.connectMode) return true;
                return get.type(card) == 'equip';
            }) > 0;
        },
        content: function () {
            "step 0"
            var check = player.needsToDiscard();
            player.chooseCardTarget({
                prompt: get.prompt('mingyundewufenzhong'),
                prompt2: "弃置一张装备牌并跳过出牌阶段,视为对一名其他角色使用一张【杀】",
                filterCard: function (card, player) {
                    return get.type(card) == 'equip' && lib.filter.cardDiscardable(card, player)
                },
                position: 'he',
                filterTarget: function (card, player, target) {
                    if (player == target) return false;
                    return player.canUse({ name: 'sha' }, target);
                },
                ai1: function (card) {
                    if (_status.event.check) return 0;
                    return 6 - get.value(card);
                },
                ai2: function (target) {
                    if (_status.event.check) return 0;
                    return get.effect(target, { name: 'sha' }, _status.event.player);
                },
                check: check
            }).setHiddenSkill('wufenzhong2');
            "step 1"
            if (result.bool) {
                player.logSkill('wufenzhong2', result.targets);
                player.discard(result.cards[0]);
                player.storage.AttTarget = result.targets[0]
                var list = ["thunder", "fire"];
                player.chooseControl(list).set('prompt', get.prompt('mingyundewufenzhong')).set('prompt2', '视为使用一张属性杀');
            } else {
                event.finish();
            }
            "step 2"
            //game.log(result.index);
            if (result.index == 0) {
                player.useCard({ name: 'sha', nature: 'thunder', isCard: true }, player.storage.AttTarget, false);
            } else if (result.index == 1) {
                player.useCard({ name: 'sha', nature: 'fire', isCard: true }, player.storage.AttTarget, false);
            }
            trigger.cancel();

        },
        "_priority": 0,
    },
    wufenzhong4: {
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "phaseDiscardBefore",
        },
        direct: true,
        content: function () {
            "step 0"
            var check = player.needsToDiscard() || player.isTurnedOver() || (player.hasSkill('shebian') && player.canMoveCard(true, true));
            player.chooseTarget(get.prompt('mingyundewufenzhong'), "跳过弃牌阶段并将武将牌翻面,视为对一名其他角色使用一张【杀】", function (card, player, target) {
                if (player == target) return false;
                return player.canUse({ name: 'sha' }, target);
            }).set('check', check).set('ai', function (target) {
                if (!_status.event.check) return 0;
                return get.effect(target, { name: 'sha' }, _status.event.player, _status.event.player);
            });
            "step 1"
            if (result.bool) {
                player.logSkill('wufenzhong4', result.targets);
                player.storage.AttTarget = result.targets[0]
                player.turnOver();
                var list = ["thunder", "fire"];
                player.chooseControl(list).set('prompt', get.prompt('mingyundewufenzhong')).set('prompt2', '视为使用一张属性杀');
            } else {
                event.finish();
            }
            "step 2"
            //game.log(result.index);
            if (result.index == 0) {
                player.useCard({ name: 'sha', nature: 'thunder', isCard: true }, player.storage.AttTarget, false);
            } else if (result.index == 1) {
                player.useCard({ name: 'sha', nature: 'fire', isCard: true }, player.storage.AttTarget, false);
            }
            trigger.cancel();

        },
        "_priority": 0,
    },
    qijianshashou: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        usable: 1,
        /* check: function (event, player) {
            if (player.countCards('h') > (player.maxHandcard + 3)) return false;
            if (player.countCards('h', function (card) { if (get.number(card) > 10) return true; })) return true;
            return false;
        }, */
        content: function () {
            'step 0'
            player.chooseTarget(get.prompt2('qijianshashou'), function (card, player, target) {
                return player.canCompare(target);
            }).set('ai', function (target) {
                return -get.attitude(player, target) - 1;
            });
            'step 1'
            if (result.bool) {
                var target = result.targets[0];
                event.target = target;
                player.logSkill('qijianshashou', target);
                player.chooseToCompare(target);
            }
            else {
                event.finish();
            }
            'step 2'
            //game.log("拼点结果" + result.bool);
            if (result.bool) {
                player.markAuto('qijianshashou_1', [target]);
                player.addTempSkill("qijianshashou_1", { global: "phaseEnd" });
                game.log("拼点赢");
            } else {
                var evt = _status.event.getParent("phaseUse");
                if (evt && evt.name == "phaseUse") {
                    evt.skipped = true;
                }
                player.skip('phaseDiscard');
                game.log("拼点没赢");
            }
        },
        ai: {
            expose: 0.2,
            order: 8,
            // 技能用 content.chooseTarget 自选目标、无 filterTarget，
            // 故引擎永不以真实目标调 result.target（target 恒 null）。
            // 发动意愿全部集中在 result.player：内部枚举最优敌将算期望收益。
            result: {
                player(player) {
                    if (!player) return 0;
                    var hs = player.getCards("h");
                    if (hs.length < 2) return 0;

                    // 找最大点数且价值<8的拼点牌
                    var maxNum = 0;
                    for (var i = 0; i < hs.length; i++) {
                        if (hs[i].number > maxNum && get.value(hs[i]) < 8) {
                            maxNum = hs[i].number;
                        }
                    }
                    // 至少要8点以上才考虑（拼点失败惩罚=跳过出牌+弃牌阶段）
                    if (maxNum < 8) return 0;

                    // 拼赢要能接杀才有意义
                    var shaCount = player.countCards('h', 'sha');
                    if (shaCount == 0) return 0;

                    // 估算胜率（简化：假设对方平均7点）
                    var winRate = Math.min(0.9, (maxNum - 7) / 6);
                    if (winRate < 0.4) return 0;

                    // 枚举最优敌将的期望收益；对任何敌将都不划算则不发动
                    var best = 0;
                    var self = this;
                    game.countPlayer(function (target) {
                        if (target == player) return;
                        if (!player.canCompare(target)) return;
                        if (target.countCards('h') == 0) return;
                        var att = get.attitude(player, target);
                        if (att >= 0) return;
                        var targetHp = target.hp;
                        var canKill = (targetHp <= shaCount + 1); // +1拼点伤害加成
                        var benefit;
                        if (canKill) benefit = 4;
                        else if (targetHp <= 2) benefit = 3;
                        else if (att < -3) benefit = 2.5;
                        else benefit = 2;
                        var failPenalty = 2;
                        var ev = benefit * winRate - failPenalty * (1 - winRate);
                        if (ev > best) best = ev;
                    });
                    return best > 0 ? Math.min(3, best) : 0;
                },
            },
        },
    },
    qijianshashou_1: {
        mark: "character",
        onremove: true,
        init: function (player, skill) {
            if (!player.storage.qijianshashou_1) player.storage.qijianshashou_1 = [];
        },
        intro: {
            content: "到$的距离视为1",
        },
        mod: {
            globalFrom: function (from, to) {
                if (from.getStorage('qijianshashou_1').includes(to)) {
                    return -Infinity;
                }
            },
            cardUsableTarget(card, player, target) {
                if (player.getStorage('qijianshashou_1').includes(target) && (card.name == "sha" || card.name == "sheji9")) return true;
            },
        },
        trigger: {
            source: "damageBegin",
        },
        charlotte: true,
        forced: true,
        filter: function (event, player) {

            return event.card && (event.card.name == "sha" || event.card.name == "sheji9") && player.getStorage('qijianshashou_1') && event.player != player && event.notLink();
        },
        content: function () {
            //game.log("目标" + get.translation(trigger.player.name));
            //game.log("目标包含:" + player.getStorage('qijianshashou_1').includes(trigger.player));
            if (player.getStorage('qijianshashou_1').includes(trigger.player)) {
                trigger.num++;
                game.log("伤害+1");
            }
        },
        "_priority": 0,
    },
    zhanxianfangyu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        prompt: "你可以弃置一张牌代替其成为杀的目标。",
        usable: 1,
        group: ["zhanxianfangyu1"],
        trigger: {
            global: "useCardToTarget",
        },
        //direct:true,//自动发动
        priority: 5,
        check: function (event, player) {

            return get.attitude(player, event.target) > 1;
        },
        filter: function (event, player) {
            if (player.countCards("hes") == 0) return false;
            if (player == event.target || player == event.player) return false;
            return (event.card.name == 'sha' || event.card.name == 'sheji9') && get.distance(player, event.target, 'pure') <= 1;
        },
        /* check: function (event, player) {
         
             if (get.attitude(player, event.target) > 2) {
                 if (player.countCards('h', 'shan') || player.getEquip(2) || trigger.target.hp == 1 || player.hp > trigger.target.hp + 1) {
                     if (!trigger.target.countCards('h', 'shan') || trigger.target.countCards('h') < player.countCards('h')) {
                         return true;
                     }
                 }
             }
             return false;
         },*/
        content: function () {
            'step 0'

            //game.log('zhanxianfangyu', trigger.target);

            player.chooseToDiscard('he', 1);
            'step 1'
            if (result.bool) {
                //game.log('zhanxianfangyu', trigger.target);
                trigger.getParent().targets.remove(trigger.target);
                trigger.getParent().triggeredTargets2.remove(trigger.target);
                trigger.getParent().targets.push(player);
                trigger.untrigger();
                trigger.player.line(player);
                game.delayx();
            }
        },
        ai: {

            threaten: 1.1,
            expose: 0.25,



        },
        "_priority": 500,
    },
    zhanxianfangyu1: {
        nobracket: true,
        usable: 1,
        trigger: {
            target: "shaBefore",
        },

        direct: true,
        filter: function (event, player) {
            if (!player.hasEmptySlot(2)) return false;
            return (event.card.name == 'sha' || event.card.name == 'sheji9') && get.color(event.card) == 'black';
        },
        content: function () {

            player.logSkill('zhanxianfangyu1');
            trigger.cancel();

        },
        "_priority": 0,
        ai: {
            effect: {
                target: function (card, player, target) {
                    if (player == target && get.subtypes(card).includes("equip2")) {
                        if (get.equipValue(card) <= 8) return 0;
                    }
                    if (!player.hasEmptySlot(2)) return;
                    if ((!player.getStat('skill').zhanxianfangyu1 || player.getStat('skill').zhanxianfangyu1 == 0) && card.name == "sha" && get.color(card) == "black") return "zerotarget";
                },
            },
        },
    },
    Zqujingying: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        usable: 1,
        enable: "phaseUse",

        filter: function (event, player) {
            return true;
        },
        filterCard: true,
        filterTarget: function (card, player, target) {
            return player != target;
        },
        selectCard: [1, Infinity],
        selectTarget: [1, Infinity],
        discard: false,
        lose: false,
        position: "he",
        filterOk: function () {
            return ui.selected.cards.length == ui.selected.targets.length;
        },
        check: function (card) {
            var player = get.player();
            if (ui.selected.cards.length >= game.countPlayer(current => {
                return current != player && get.attitude(player, current) <= 0;
            })) return 0;
            return 5 - get.value(card);
        },
        prompt: "按顺序选择卡牌和角色,并将卡牌交给对应顺序的角色。",
        complexSelect: true,
        multitarget: true,
        multiline: true,
        discard: false,
        lose: false,
        delay: false,
        contentBefore: function () {
            event.getParent()._Zqujingying_targets = targets.slice();
        },
        content: function () {
            'step 0'
            //player.awakenSkill('Zqujingying');
            'step 1'
            var targets = event.getParent()._Zqujingying_targets;
            var list = [];
            for (var i = 0; i < targets.length; i++) {
                var target = targets[i];
                var card = cards[i];
                list.push([target, card]);
                player.line(target);
            }
            game.loseAsync({
                gain_list: list,
                player: player,
                cards: cards,
                giver: player,
                animate: 'giveAuto',
            }).setContent('gaincardMultiple');
            'step 2'
            game.log("给出了" + cards.length);

            event.num = 0;
            event.targets = targets.sortBySeat();
            //game.log(event.targets);
            'step 3'
            event.target1 = event.targets.shift();
            event.target1.chooseControlList(
                ['令' + get.translation(player) + '获得你的两张牌',
                '令' + get.translation(player) + '给出一张牌作为Z'],
                true).set('ai', function (event, player) {
                    var target = _status.event.getParent().player;
                    var player = get.player();
                    var options = [
                        { name: "给牌", weight: 1 },
                        { name: "给Z", weight: 1 },
                    ];
                    //根据条件修改权重
                    if (get.attitude(player, target) > 0) options[1].weight += 10;
                    if (get.attitude(player, target) < 0) options[1].weight -= 1;
                    //加权随机
                    var totalWeight = options.reduce((acc, option) => acc + option.weight, 0);
                    var randomValue = Math.random() * totalWeight;

                    let cumulativeWeight = 0;
                    for (var option of options) {
                        cumulativeWeight += option.weight;
                        if (randomValue <= cumulativeWeight) {
                            var selectedOption = option.name;
                            break;
                        }
                    }
                    //game.log('selectedOption' + selectedOption);
                    if (selectedOption == "给牌") return 0;
                    else if (selectedOption == "给Z") return 1;


                    return 0;
                });
            //game.log(get.translation(event.target1) + "选择完成");
            'step 4'
            if (result.index == 0) {
                game.log("给牌");
                player.gainPlayerCard(2, event.target1, true);
                event.goto(7);

            } else if (result.index == 1) {
                game.log("强化");

            }

            'step 5'
            //game.log(event.target1);
            event.target1.chooseCard('h', true, '将一张手牌置于' + get.translation(player) + '武将牌上称为Z').set('ai', card => {
                return - get.value(card);
            });
            'step 6'
            if (result.cards) {
                //game.log(result.cards);
                player.addToExpansion(event.target1, 'give', result.cards).gaintag.add('Z');
            }
            'step 7'
            //game.log("操作完成");
            if (event.num < targets.length) event.goto(3);
            else game.delayx();
            //game.log("技能结束");
        },
        ai: {
            order: 10,
            result: {
                target: function (player, target) {
                    if (!player || !target) return 0;
                    var card = ui.selected.cards[ui.selected.targets.length];
                    if (!card) return 0;
                    if (get.value(card) < 0) return -1;
                    if (get.value(card) < 1.5) return (get.sgnAttitude(player, target) + 0.01) / 5;
                    return Math.sqrt(5 - Math.min(4, target.countCards('h')));
                },
            },
        },
        "_priority": 0,
    },
    Z_qianghua: {
        nobracket: true,
        name: "Z强化",
        prompt: "出牌阶段，你可以移去一张Z，强化一项。",
        enable: "phaseUse",
        filter: function (event, player) {
            return player.getExpansions('Z').length > 0 && lib.skill.Z_qianghua.getUpgrades(player).length > 0;
        },
        getUpgrades: function (player) {
            var cap = Math.min(2, player.countMark('_jianzaochuan') + 1);
            return ['mopaiup', 'jinengup', 'wuqiup', 'useshaup', 'jidongup', 'shoupaiup'].filter(mark =>
                player.countMark(mark) < cap && (mark != 'jinengup' || !player.hasSkill('shixiangquanneng')));
        },
        mod: {
            attackFrom: function (from, to, distance) {
                if (lib.config.extension_舰R牌将__qianghuazhuang !== false) return distance;
                return distance - from.countMark('wuqiup');
            },
            attackTo: function (from, to, distance) {
                if (lib.config.extension_舰R牌将__qianghuazhuang !== false) return distance;
                return distance + to.countMark('jidongup');
            },
            cardUsable: function (card, player, num) {
                if (lib.config.extension_舰R牌将__qianghuazhuang !== false) return num;
                if (card.name == 'sha') return num + player.countMark('useshaup');
            },
            maxHandcard: function (player, num) {
                if (lib.config.extension_舰R牌将__qianghuazhuang !== false) return num;
                return num + player.countMark('shoupaiup');
            }
        },
        async content(event, trigger, player) {
            var choices = lib.skill.Z_qianghua.getUpgrades(player);
            if (!choices.length || !player.getExpansions('Z').length) return;
            var chosen = await player.chooseCardButton('移去一张Z，强化一项', player.getExpansions('Z'), 1)
                .set('ai', button => 1).forResult();
            if (!chosen.bool) return;
            var labels = {mopaiup: '后勤保障', jinengup: '技能升级', wuqiup: '射程升级', useshaup: '速射炮管', jidongup: '改良推进器', shoupaiup: '物流运输'};
            var result = await player.chooseButton(['强化一项', [choices.map(mark => [mark, labels[mark] + '：' + player.countMark(mark) + '→' + (player.countMark(mark) + 1)]), 'textbutton']], true)
                .set('selectButton', 1).set('ai', button => button.link == 'jinengup' ? 3 : 1).forResult();
            if (!result.bool || !choices.includes(result.links[0])) return;
            await player.loseToDiscardpile(chosen.links);
            player.addMark(result.links[0], 1);
        },
        ai: {
            save: true,
            expose: 0,
            threaten: 1,
            order: 2,
            result: {
                player: function (player) {
                    if (player.getExpansions('Z').length > 0) return 6;
                    return 0;
                }
            }
        },
    },
    /* Z_qianghua: {//2026.2.6强化重置,原代码注释保存
        nobracket: true,
        init: function (player) {//初始化数组,也可以运行事件再加if后面的内容
            if (!player.storage._qianghuazhuang) player.storage._qianghuazhuang = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        },
        enable: "phaseUse",
        prompt: "你可以移去一张Z,强化一项或摸两张牌",
        filter: function (event, player) {
            var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, lv = 0; if (k < 3) { lv = k * 6 };//远航上限降低为2,总可用强化数量公式作相应修改
            if (player.countCards('h') > 0) { if ((a + b + c + d + e + f + g) >= (lv)) return false };
            return player.getExpansions('Z').length;
 
        },
        mod: {
            attackFrom: function (from, to, distance) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === true) return distance;
                var a = 0; if (from.countMark('wuqiup')) { var a = a + from.countMark('wuqiup') }; return distance - a;
            },
            attackTo: function (from, to, distance) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === true) return distance;
                var a = 0; if (to.countMark('jidongup')) { var a = a + to.countMark('jidongup') }; return distance + a;
            },
            cardUsable: function (card, player, num) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === true) return num;
                var a = 0; if (card.name == 'sha') return num + player.countMark('useshaup');
            },
            maxHandcard: function (player, num) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === true) return num;
                var a = 0; if (player.countMark('shoupaiup')) { var a = a + player.countMark('shoupaiup') }; return num + a;
            },
        },
        content: function () {
            'step 0'
            var cards = player.getExpansions('Z'), count = cards.length;
            if (count > 0) {
                player.chooseCardButton('移去一张Z,然后强化一项。', true, cards).set('ai', function (button) {
                    return 1;
                });
            }
            else event.finish();
            'step 1'
            event.cards = result.links;
            player.loseToDiscardpile(event.cards);
            'step 2'
            var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, exp1 = 0;
            player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h, k];
            var choiceList = [];
            var list = [];
            jieshao = ['后勤保障：上限+' + (a + 1) + '→' + (a + 2) + '远航（用一摸一）标记上限,<br>手牌少于手牌上限1/2时,失去手牌会摸一张牌。防守反击的保障<br>每轮上限1/2/3,在自己的回合重置使用次数。', '技能升级：+' + (b) + '→' + (b + 1) + ',重巡-降低必中攻击限制(杀/黑牌/任意牌)、轻巡-增加无效群体锦囊牌范围(1/2/3)、航母-降低万箭齐发限制(黑桃与梅花/黑桃与梅花与红桃/任意牌);<br>战列舰-增加防护范围(杀造成的伤害/杀和锦囊牌造成的伤害/所有伤害),导驱-增加射程(2/3/4)、潜艇-降低雷杀条件(红桃/红桃或黑桃/红桃或黑桃或方块);<br>驱逐-增加回避概率(0.25/0.33/0.50)、军辅-增加存牌上限(1/2/3)。', '射程升级：+' + c + '→' + (c + 1) + '武器（出杀）攻击距离,<br>增加出杀范围,虽然不增加锦囊牌距离,但胜在永久', '速射炮管：+' + d + '→' + (d + 1) + '出杀次数,<br>作为连弩的临时替代,进行多刀输出。', '改良推进器：+' + e + '→' + (e + 1) + '武器（被杀）防御距离<br>对手有更远的出杀范围才能对你出杀时,但不能防御锦囊牌。', '物流运输：+' + f + '→' + (f + 1) + '手牌上限,且蝶舞递装备给杀的距离提升,<br>双方状态差距越大,保牌效果越强。', '经验：+' + h + '→' + event.exp1 + ',将卡牌转为经验,供下次升级。（直接点确定也行）<br>1级技能需要两张牌才能强化,2级技能需要三张牌才能强化。<br>但无名杀不能读取这个界面的文本,导致四点经验即可强化两个不同等级技能']//player.getEquip(1),定义空数组,push填充它,事件变量可以自定义名字,什么都可以存。game.log('已强化:',a+b+c+d);
            var info = lib.skill._qianghuazhuang.getInfo(player);
            //game.log(info);
            if (info[0] < k && info[0] <= 2) {
                list.push('mopaiup');
                choiceList.push(['mopaiup', jieshao[0]]);
            };
            if (info[1] < k && info[1] <= 2 && !player.hasSkill("shixiangquanneng")) {
                list.push('jinengup');
                choiceList.push(['jinengup', jieshao[1]]);
            };
            if (info[2] < k && info[2] <= 2) {
                list.push('wuqiup');
                choiceList.push(['wuqiup', jieshao[2]]);
            };//若此值：你强化的比目标多时,+1含锦囊牌防御距离。
            if (info[3] < k && info[3] <= 2) {
                list.push('useshaup');
                choiceList.push(['useshaup', jieshao[3]]);
            };
            if (info[4] < k && info[4] <= 2) {
                list.push('jidongup');
                choiceList.push(['jidongup', jieshao[4]]);
            };
            if (info[5] < k && info[5] <= 2) {
                list.push('shoupaiup');
                choiceList.push(['shoupaiup', jieshao[5]]);
            };
            event.first = true;    //存了6个变量,可以导出为button,与textbutton样式,看需求
            var xuanze = 1;
            player.chooseButton([
                '将手牌转化为强化点数强化以下能力；取消将返还卡牌,未使用完的点数将保留。<br>强化上限默认为1,发动建造技能后提高。<br>一级强化需要2点,二级强化需要3点强化点数。<br>鼠标滚轮或下拉查看所有选项。',
                [choiceList, 'textbutton'],
            ]).set('filterButton', button => {
                var event = _status.event;
                if (ui.selected.buttons) {//for(var i=0;i<event.cao.length;i+=(1)){};测试失败的函数组合game.log(ui.selected.buttons,get.selectableButtons().includes(ui.selected.buttons),get.selectableButtons());游戏无名杀Button的限制,这个代码并没有起到实时计算的作用。
                    return true; //return xuanze >= player.countMark(ui.selected.buttons[0]) * 0.5 + 1;
                }
            }).set('ai', function (button) {
                var haode = [jieshao[0], jieshao[1]]; var yingji = []; var tunpai = [jieshao[5]];//其实一个例子就行,不如直接if(){return 2;};
                if (game.hasPlayer(function (current) { return current.inRange(player) && get.attitude(player, current) < 0; }) < 1) { yingji.push(jieshao[2]) } else if (player.countCards('h', { name: 'sha' }) > 1) { yingji.push(jieshao[3]) };
                if (game.hasPlayer(function (current) { return player.inRange(current) && get.attitude(player, current) < 0; }) > 0) yingji.push(jieshao[4]);
                switch (ui.selected.buttons.length) {
                    case 0:
                        if (haode.includes(button.link)) return 3;
                        if (yingji.includes(button.link)) return 2;
                        if (tunpai.includes(button.link)) return 1;
                        return Math.random();
                    case 1:
                        if (haode.includes(button.link)) return 3;
                        if (yingji.includes(button.link)) return 2;
                        if (tunpai.includes(button.link)) return 1;
                        return Math.random();
                    case 2:
                        return Math.random();
                    default: return 0;
                }
            }).set('selectButton', [0, xuanze]);
 
            'step 3'
            //game.log(result.links, result.bool)//只能返还这两个,所以更适合技能,更需要循环的方式进行计算。
            if (!result.bool) { player.draw(2); player.removeMarkevent.finish(); };//返还牌再计算
            if (result.bool) {  //player.addMark('Expup',event.cadechangdu);//先给经验再计算扣除经验升级,随着此项目的升级,花费也越多。通过一个有序的清单,遍历比对返回的内容,来定位要增加的标记/数组。
                for (var i = 0; i < result.links.length; i += (1)) {
                    if (!result.links.includes('Expup')) {
                        player.addMark(result.links[i], 1); // game.log('数组识别:', result.links[i], '编号', i, ',总编号', result.links.length - 1); 
                    }
                }
            };
            //    if(event.choiceList.length<event.cao){player.addMark('Expup',1);};从0开始,当介绍数组有内容==选项数组的内容（第i个）,就加的简称数组第i个(内容)标签。并通过game.log()调试,在出牌记录中查看执行效果。result.links.includes(event.list[i])&&
            'step 4'
            var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1; //game.log('结束', a, b, c, d, e, f, g, h, k);
            player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h];
        },
        ai: {
            save: true,
            expose: 0,
            threaten: 1,
            order: 2,
            result: {
                player: function (player) {
                    if (player.getExpansions('Z').length > 0) return 6;
                    return 0;
                },
            },
        },
    }, */

    huhangyuanhu: {
        nobracket: true,
        trigger: {
            global: "useCardToTargeted",
        },
        filter: function (event, player) {
            if ((event.card.name != 'sha' && event.card.name != 'sheji9') || !event.target.isIn()) return false;
            if (event.targets && event.targets.length != 1) return false;
            if (event.target != player) return player.countCards('he') > 0;
            return game.hasPlayer(function (current) {
                return current != player && current.countCards('he') > 0;
            });
        },
        check: function (event, player) {
            if (event.target != player) return get.attitude(player, event.target) > 0;
            return game.hasPlayer(function (current) {
                return current != player && current.countCards('he') > 0 && get.attitude(player, current) > 0;
            });
        },
        logTarget: "target",
        content: function () {
            "step 0"
            if (trigger.target != player) {
                player.chooseCard(true, 'he', '交给' + get.translation(trigger.target) + '一张牌').set('ai', function (card) {
                    if (get.position(card) == 'e') return -1;
                    if (card.name == 'shan' || card.name == 'huibi9') return 1;
                    if (get.type(card) == 'equip') return 0.5;
                    return 0;
                });
            }
            else {
                event.goto(2);

            }
            "step 1"
            player.give(result.cards, trigger.target);
            game.delayx();
            if (trigger.target.countCards("ej")) {
                player.gainPlayerCard(trigger.target, 'ej', true, 'visible').set('ai', function (card) {
                    if (get.type(card) == "delay") return 1;
                    return -get.value(card);
                });
            }
            event.finish();
            "step 2"
            player.chooseTarget(function (card, player, target) {
                //game.log(target);
                //game.log(get.distance(player, target));
                //if (get.distance(player, target) <= 1) { return 1 }
                return target != player && target.countCards('he') > 0;
            }, "你可以选择一名其他角色,其可以交给你一张牌并获得你场上的一张牌。").set('ai', function (ard, player, target) {
                return get.attitude(player, target);
            });
            "step 3"
            if (result.bool) {
                event.target = result.targets[0];
                event.target.chooseCard('he', '交给' + get.translation(player) + '一张牌,并获得其场上的一张牌').set('ai', function (card) {
                    var attitude = get.attitude(event.target, player);
                    if (attitude <= 0) return -get.value(card);
                    if (get.position(card) == 'e') return -1;
                    if (card.name == 'shan') return 7;
                    if (get.type(card) == 'equip') return get.value(card, player) - get.value(card);
                    return get.value(card, player);
                });
            } else {
                event.finish();
            }
            "step 4"
            if (result.bool) {
                event.target.give(result.cards, player);
                //game.delayx();
                if (trigger.target.countCards("ej")) {
                    event.target.gainPlayerCard(player, 'ej', true, 'visible').set('ai', function (card) {
                        if (get.attitude(event.target, player) >= 0) {
                            if (get.type(card) == "delay") return 1;
                            return -get.value(card);
                        } else {
                            return get.value(card);
                        }
                    });
                }
            } else {
                event.finish();
            }
        },
        ai: {
            threaten: 0.8,
        },
        "_priority": 0,
    },
    shizhibuyu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        group: ["shizhibuyu1"],
        trigger: {
            player: "damageBegin3",
        },
        filter: function (event, player) {
            return event.num > 0;
        },
        frequent: true,
        //preHidden: true,
        content: function () {
            'step 0'
            var check = (player.countCards('h', { color: 'red' }) > 1 || player.countCards('h', { color: 'black' }) > 1);
            player.chooseCard(get.prompt('shizhibuyu'), '弃置两张颜色相同的牌,令即将受到的伤害-1', 'he', 2, function (card) {
                if (ui.selected.cards.length) return get.color(card) == get.color(ui.selected.cards[0]);
                return true;
            }).set('complexCard', true).set('ai', function (card) {
                if (!_status.event.check) return 0;
                var player = get.player();
                if (player.hp == 1) {
                    if (!player.countCards('h', function (card) { return get.tag(card, 'save') }) && !player.hasSkillTag('save', true)) return 10 - get.value(card);
                    return 7 - get.value(card);
                }
                return 6 - get.value(card);
            }).set('check', check).setHiddenSkill(event.name);
            'step 1'
            var logged = false;
            if (result.cards) {
                logged = true;
                player.discard(result.cards);
                trigger.num--;
            }
            if (!player.isUnseen()) {
                if (!logged) player.logSkill('shizhibuyu');
                player.judge(function (card) {
                    if (get.color(card) == 'red') return 1;
                    return 0;
                });
            }
            else event.finish();
            'step 2'
            if (result.judge > 0) { player.draw(); } else {
                if (
                    game.hasPlayer(function (current) {
                        return current.countDiscardableCards(player, "hej") > 0;
                    })
                ) {
                    player
                        .chooseTarget(
                            "弃置一名角色区域内的一张牌",
                            function (card, player, target) {
                                return target.countDiscardableCards(player, "hej");
                            },
                            true
                        )
                        .set("ai", function (target) {
                            var player = get.player();
                            var att = get.attitude(player, target);
                            if (att < 0) {
                                att = -Math.sqrt(-att);
                            } else {
                                att = Math.sqrt(att);
                            }
                            return att * lib.card.guohe.ai.result.target(player, target);
                        });
                }
                else event.finish();
            }
            'step 3'
            if (result.bool) {
                player.discardPlayerCard(result.targets[0], 1, 'hej', true);
            }
        },
        "_priority": 0,
    },
    shizhibuyu1: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "judgeEnd",
        },
        filter: function (event) {
            if (get.owner(event.result.card)) return false;
            if (event.nogain && event.nogain(event.result.card)) return false;
            return true;
            //return event.result.card.name=='sha'||event.result.card.name=='juedou';
        },
        frequent: true,
        //preHidden: true,
        content: function () {
            'step 0'
            //player.gain(trigger.result.card, 'gain2');
            player.chooseTarget(get.prompt2('选择一名角色，其手牌上限和使用【杀】的次数上限+1，直到你的下回合开始')).ai = function (target) {
                return get.attitude(player, target) > 0;
            }
            'step 1'
            if (result.bool) {
                game.log(get.translation(result.targets[0]) + "矢志不渝");
                var beneficiary = result.targets[0];
                beneficiary.addSkill('shizhibuyu1_eff');
                if (!beneficiary.storage.shizhibuyu1_eff_sources) beneficiary.storage.shizhibuyu1_eff_sources = {};
                var sources = beneficiary.storage.shizhibuyu1_eff_sources;
                sources[player.playerid] = (sources[player.playerid] || 0) + 1;
                beneficiary.storage.shizhibuyu1_eff = (beneficiary.storage.shizhibuyu1_eff || 0) + 1;
                beneficiary.updateMarks();
                //target.addTempSkill('mingjian2',{player:'phaseAfter'});
                //target.storage.mingjian2++;
                //target.updateMarks('mingjian2');
            }
        },
        subSkill: {
            eff: {
                sub: true,
                trigger: { global: 'phaseBefore' },
                forced: true, silent: true, firstDo: true, priority: 100,
                filter: function (event, player) {
                    return !!player.storage.shizhibuyu1_eff_sources?.[event.player.playerid];
                },
                content: function () {
                    var sources = player.storage.shizhibuyu1_eff_sources;
                    player.storage.shizhibuyu1_eff -= sources[trigger.player.playerid];
                    delete sources[trigger.player.playerid];
                    if (!player.storage.shizhibuyu1_eff) player.removeSkill('shizhibuyu1_eff');
                    else player.updateMarks();
                },
                onremove: function (player) {
                    delete player.storage.shizhibuyu1_eff;
                    delete player.storage.shizhibuyu1_eff_sources;
                },
                mod: {
                    cardUsable: function (card, player, num) {
                        if (card.name == 'sha' || card.name == 'sheji9') return num + player.storage.shizhibuyu1_eff;
                    },
                    maxHandcard: function (player, num) { return num + player.storage.shizhibuyu1_eff },
                },
                mark: true,
                charlotte: true,
                intro: {
                    content: function (storage) { if (storage) return '使用【杀】的次数上限+' + storage + ',手牌上限+' + storage },
                },
                "_priority": 0,
            },
        },
        "_priority": 0,
    },
    qianxingtuxi: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        mod: { targetInRange: function () { return true; } },
        trigger: { source: "damageSource" },
        forced: true,
        filter: function (event, player) { return !player.isPhaseUsing(); },
        content: function () {
            player.addTempSkill("dajiaoduguibi", "roundStart");
            trigger.player.addSkill("qianxingtuxi_debuff");
            trigger.player.storage.qianxingtuxi_debuff.pending = true;
        },
    },
    qianxingtuxi_debuff: {
        charlotte: true,
        init: function (player) {
            player.storage.qianxingtuxi_debuff = { pending: false, active: false, used: false };
        },
        onremove: true,
        trigger: { source: "damageBegin1" },
        forced: true,
        filter: function (event, player) {
            var state = player.storage.qianxingtuxi_debuff;
            return state && state.active && !state.used;
        },
        async content(event, trigger, player) {
            player.storage.qianxingtuxi_debuff.used = true;
            var result = await player.judge(card => get.suit(card) == 'spade' ? -1 : 1).forResult();
            if (result.suit == 'spade') trigger.num--;
        },
        group: ['qianxingtuxi_debuff_start', 'qianxingtuxi_debuff_end'],
        subSkill: {
            start: {
                trigger: { player: 'phaseBefore' }, firstDo: true, priority: 100,
                forced: true, silent: true, charlotte: true,
                content: function () {
                    var state = player.storage.qianxingtuxi_debuff;
                    state.active = state.pending;
                    state.pending = false;
                    state.used = false;
                },
            },
            end: {
                trigger: { player: 'phaseAfter' }, forced: true, silent: true, charlotte: true,
                content: function () {
                    var state = player.storage.qianxingtuxi_debuff;
                    state.active = false;
                    if (!state.pending) player.removeSkill('qianxingtuxi_debuff');
                },
            },
        },
    },
    "31jiezhongdui": {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        usable: 1,
        frequent: true,
        trigger: {
            global: "useCardToPlayered",
        },
        check: function (event, player) {
            return get.attitude(player, event.target) > 0;
        },
        filter: function (event, player) {
            return (event.card.name == 'sha' || event.card.name == 'sheji9') && !player.countMark('31jiezhongdui') && event.player.hp <= event.target.hp;
        },
        content: function () {
            'step 0'
            var str = get.translation(trigger.target), card = get.translation(trigger.card);
            player.chooseControl('cancel2').set('choiceList', [
                '令' + card + '对' + str + '的伤害+1',
                '令' + str + '不能响应' + card,
                '令当前回合角色摸一张牌',/*然后"31节中队"暂时失效',*/
            ]).set('prompt', get.prompt('31jiezhongdui', trigger.target)).setHiddenSkill('31jiezhongdui').set('ai', function () {
                var player = get.player(), target = _status.event.getTrigger().target;
                if (get.attitude(player, trigger.target) >= 0) {
                    //game.log("return'cancel2'");
                    return 'cancel2';
                }
                if (trigger.target.hp + trigger.target.hujia <= 2 || _status.currentPhase.countCards("h") > 2) {
                    return target.mayHaveShan() ? 1 : 0;
                }
                return 2;

            });
            'step 1'
            if (result.control != 'cancel2') {
                var target = trigger.target;
                player.logSkill('31jiezhongdui', target);
                if (result.index == 1) {
                    game.log(trigger.card, '不可被', target, '响应');
                    trigger.directHit.add(target);
                }
                else if (result.index == 0) {
                    game.log(trigger.card, '对', target, '的伤害+1');
                    var map = trigger.getParent().customArgs, id = target.playerid;
                    if (!map[id]) map[id] = {};
                    if (!map[id].extraDamage) map[id].extraDamage = 0;
                    map[id].extraDamage++;
                }
                else {
                    _status.currentPhase.draw(1);
                    //player.addMark('31jiezhongdui', 1);
                }
            }

        },
        marktext: "31节中队",
        intro: {
            name: "31节中队",
            content: "暂时失效",
        },
        group: "31jiezhongdui_reflash",
        subSkill: {
            reflash: {
                trigger: {
                    player: ["phaseZhunbeiBegin"],
                },
                forced: true,
                filter: function (event, player) {
                    return player.countMark('31jiezhongdui');
                },
                content: function () {
                    player.removeMark('31jiezhongdui', 1);
                },
                sub: true,
                "_priority": 0,
            },
        },
        "_priority": 0,
    },
    jujianmengxiang: {
        nobracket: true,
        init: function (player) {
            player.storage.jujianmengxiang = [];
            player.storage.jujianmengxiang_error = false;
        },
        useEvent(event) {
            if (event?.name === 'chooseToUse') return event;
            const parent = event?.getParent?.('chooseToUse');
            return parent?.name === 'chooseToUse' ? parent : event;
        },
        // getUseValue 按合法目标和次数限制估价；无目标牌只计算使用者收益。
        cardValue(player, name) {
            const card = { name, isCard: true };
            // 桃（含自动转为桃的快修）只能补回本次支付的体力，没有净回血。
            // 手动选择仍合法；AI不把这次独立回血的通用倍率当成技能收益。
            if (name === 'tao' || get.info(card)?.autoViewAs === 'tao') return 0;
            const value = get.info(card)?.notarget
                ? get.effect(undefined, card, player, player)
                : player.getUseValue(card, true, true);
            return Number.isFinite(value) ? value : 0;
        },
        hpValue(player) {
            // 代价先于虚拟牌结算；最后一点体力无法安全支付，不能把未确认的救援算作收益。
            // 这不是旧版 hp<3 门槛：两点体力及以上仍完全按真实净收益决策。
            if (player.hp <= 1) return Infinity;
            // losehp 保留低血量风险与技能修正，但抵消 get.effect 对手牌数的通用倍率。
            // 手牌多/装甲厚不能降低主动失去体力的成本；失血并不需要突破防御牌。
            const lossEffect = get.effect(player, { name: 'losehp', isCard: true }, player, player);
            const hand = player.countCards('h');
            const handFactor = hand === 0 ? 1.5 : hand === 1 ? 1.3 : hand === 2 ? 1.1 : hand > 3 ? 0.5 : 1;
            return Number.isFinite(lossEffect) ? -lossEffect / handFactor : Infinity;
        },
        // 入口、按钮与总AI共用父 chooseToUse 的合法性口径：lib.filter.filterCard 内含
        // cardEnabled+cardUsable+目标存在性，与 cardValue 的 getUseValue(card,true,true)
        // （canUse 走 targetEnabledx 含 cardUsable/_backup.filterCard）判定一致。
        availableNames(event, player) {
            const useEvent = lib.skill.jujianmengxiang.useEvent(event);
            const filterCard = (useEvent && useEvent.name === 'chooseToUse')
                ? (useEvent._backup?.filterCard || useEvent.filterCard || lib.filter.filterCard)
                : lib.filter.filterCard;
            return lib.inpile.filter(name => {
                const type = get.type(name);
                const card = { name, isCard: true };
                return (type === 'trick' || type === 'basic') &&
                    !player.getStorage('jujianmengxiang').includes(name) &&
                    filterCard.call(useEvent, card, player, useEvent);
            });
        },
        // 只有明显超过失去1点体力的成本才发动，过滤低价值锦囊的边际收益。
        activateThreshold: 0.6,
        // 总 AI 与按钮共用：最高牌收益 - 失去体力代价
        bestScore(event, player) {
            const info = lib.skill.jujianmengxiang;
            const names = info.availableNames(event, player);
            if (!names.length) return -1;
            let best = 0;
            for (const name of names) best = Math.max(best, info.cardValue(player, name));
            return best - info.hpValue(player);
        },
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        //prompt: "失去一点体力并视为使用一张基本牌或非延时类锦囊牌（每回合每种牌名限一次）。",
        filter(event, player) {
            return lib.skill.jujianmengxiang.availableNames(event, player).length > 0;
        },
        chooseButton: {
            dialog(event, player) {
                var names = lib.skill.jujianmengxiang.availableNames(event, player);
                var list = [];
                for (var i = 0; i < names.length; i++) {
                    var name = names[i];
                    list.push([get.translation(get.type(name)), '', name]);
                }
                game.log("巨舰梦想列表已生成");
                if (list.length == 0) {
                    game.log("没有可用的牌了！");
                    player.storage.jujianmengxiang_error = true;
                    event.finish();
                    return;
                }
                return ui.create.dialog('巨舰梦想', [list, "vcard"]);

            },
            filter(button, player) {
                return lib.skill.jujianmengxiang.availableNames(_status.event, player).includes(button?.link?.[2]);
            },
            check(button) {
                const player = get.player();
                const name = button?.link?.[2];
                const info = lib.skill.jujianmengxiang;
                if (!name || !info.availableNames(_status.event, player).includes(name)) return -1;
                return info.cardValue(player, name) - info.hpValue(player) - info.activateThreshold;
            },
            backup(links, player) {
                return {
                    viewAs: {
                        name: links[0][2],
                        isCard: true,
                        // 美化牌使用时可能改名（如快修→桃），保留选中的原牌名用于次数限制。
                        storage: { jujianmengxiangName: links[0][2] },
                    },
                    filterCard: () => false,
                    selectCard: -1,
                    popname: true,
                    onuse: function (result, player) {
                        var evt = _status.event.getParent('phase');
                        if (evt && evt.name == 'phase' && !evt.jujianmengxiang) {
                            evt.jujianmengxiang = true;
                            var next = game.createEvent('jujianmengxiang_clear');
                            _status.event.next.remove(next);
                            evt.after.push(next);
                            next.player = player;
                            next.setContent(function () {
                                delete player.storage.jujianmengxiang;
                                player.storage.jujianmengxiang_error = false;
                            });
                        }
                        player.markAuto('jujianmengxiang', [result.card.storage?.jujianmengxiangName || result.card.name]);
                        // 显式记录代价来源；onuse产生的事件不一定挂在useCard父事件下。
                        player.loseHp(1).set('skill', 'jujianmengxiang');
                    },
                };
            },
            prompt(links, player) {
                return "请选择" + get.translation(links[0][2]) + "的目标";
            },
        },
        ai: {
            order: 4,
            result: {
                player: function (player) {
                    if (!player.storage.jujianmengxiang) { player.storage.jujianmengxiang = []; }
                    if (player.storage.jujianmengxiang_error == true) return -1;
                    // 与按钮评分共用同一判定；需明显覆盖失去1点体力的成本才发动。
                    return lib.skill.jujianmengxiang.bestScore(_status.event, player) - lib.skill.jujianmengxiang.activateThreshold;
                },
            },
        },
        "_priority": 0,

    },
    sidajingang: {
        nobracket: true,
        group: ["sidajingang_mopai", "sidajingang_pindian"],
        subSkill: {
            mopai: {
                frequent: true,
                audio: "ext:舰R牌将/audio/skill:true",
                trigger: {
                    player: "logSkill",
                },
                filter: function (event, player) {
                    return event.skill == '_yuanhang_mopai';
                },
                //forced: true,
                content: function () {
                    //game.log("_yuanhang");
                    player.draw(1);
                },

                "_priority": 0,
            },
            pindian: {
                audio: "ext:舰R牌将/audio/skill:true",
                shaRelated: true,
                trigger: {
                    source: "damageSource",
                },
                filter: function (event, player) {
                    if (event._notrigger.includes(event.player)) return false;
                    return (event.card && (event.card.name == 'sha' || event.card.name == 'sheji9') && (event.getParent().name == 'sha' || event.getParent().name == 'sheji9') &&
                        event.player.isIn() &&
                        player.canCompare(event.player));
                },
                check: function (event, player) {
                    return get.attitude(player, event.player) < 0 && player.countCards('h') > 1;
                },
                content: function () {
                    "step 0"
                    player.chooseToCompare(trigger.player);
                    "step 1"
                    if (result.bool && trigger.player.countGainableCards(player, 'he')) {
                        player.gainPlayerCard(trigger.player, true, 'he');
                    }
                },
                "_priority": 0,
            },
        },
    },
    jiujingzhanzhen: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        count: function (player) {
            var num = 0;
            player.getHistory('lose', function (evt) {
                if (evt.type == 'discard' && evt.position == ui.discardPile) {
                    num += evt.cards.filter(card => get.color(card, player) == 'red').length;
                }
            });
            return num;
        },
        frequent: true,
        filter: function (event, player) {
            return lib.skill.jiujingzhanzhen.count(player) > 0;
            /*return player.hasHistory('lose', function (evt) {
                return evt.hs && evt.hs.length > 0;
            });*/
        },
        trigger: {
            player: "phaseJieshuBegin",
        },

        content: function () {
            'step 0'
            player.chooseTarget([1, lib.skill.jiujingzhanzhen.count(player)], get.prompt2('jiujingzhanzhen')).ai = function (target) {
                return get.attitude(_status.event.player, target);
            };
            'step 1'
            if (result.bool) {
                var targets = result.targets;
                targets.sortBySeat();
                player.line(targets, 'fire');
                player.logSkill('jiujingzhanzhen', targets);
                event.targets = targets;
            }
            else event.finish();
            'step 2'
            event.current = targets.shift();
            if (player.hujia >= 1) event._result = { index: 0 };
            else event.current.chooseControl().set('choiceList', [
                '摸一张牌',
                '令' + get.translation(player) + '获得一点护甲',
            ]).set('ai', function () {
                if (get.attitude(event.current, player) > 0) return 1;
                return 0;
            });
            'step 3'
            if (result.index == 1) {
                event.current.line(player);
                player.changeHujia(1, null, true);
            }
            else event.current.draw();
            game.delayx();
            if (targets.length) event.goto(2);
        },
        "_priority": 0,
        group: "jiujingzhanzhen_recast",
        subSkill: {
            recast: {
                usable: 2,
                audio: "ext:舰R牌将/audio/skill:2",
                enable: "phaseUse",
                position: "he",
                filter: function (card, player) {
                    return true;
                },
                filterCard: function (card) {
                    return get.color(card) == "red";
                },
                selectCard: function () {
                    var player = get.player();
                    return 1;
                },
                check: function (card) {
                    return 6 - get.value(card);
                },
                delay: false,
                content: function () {
                    player.draw(cards.length);
                },
                ai: {
                    order: 1,
                    result: {
                        player: 1,
                    },
                },
                "_priority": 0,
            }
        },
    },
    wuweizhuangji: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        unique: true,
        enable: "phaseUse",
        skillAnimation: true,
        animationColor: "gray",
        mark: true,
        limited: true,
        filter: function (event, player) {
            if (player.storage.wuweizhuangji) return false;
            return player.isMinHp();
        },
        filterTarget: function (card, player, target) {
            return true;
        },
        content: function () {
            player.awakenSkill('wuweizhuangji');
            var num = player.maxHp;
            if (player.hp > 0) {
                player.loseHp(player.hp);
                target.damage(num);
            }

        },
        // 净收益口径与巨舰梦想一致：入口只比较「对目标伤害收益 − 流失体力代价」。
        // 旧实现无论有没有桃/酒都返回 -8~-14，被对自己的正态度放大后入口恒负，
        // 目标侧收益再高也加不回来。
        hpCost(player) {
            // 失去全部体力：最后 1 点不可安全支付；其余按 losehp 伪牌真实 effect 逐点计，
            // 与伤害分开、不受护甲减免。
            if (player.hp <= 1) return Infinity;
            const loss = get.effect(player, { name: 'losehp', isCard: true }, player, player);
            return Number.isFinite(loss) ? -loss * player.hp : 0;
        },
        // 手里有桃/酒（含舰R美化别名）时，流失后的体力可以自己救回，代价按可回复量折减。
        saveValue(player) {
            let saves = 0;
            player.countCards('hs', function (card) {
                if (['tao', 'jiu', 'kuaixiu9', 'zziqi9'].includes(get.name(card, player))) saves++;
                return false;
            });
            if (!saves) return 0;
            const recover = get.effect(player, { name: 'recover', isCard: true }, player, player);
            return (Number.isFinite(recover) ? recover : 0) * Math.min(saves, player.hp);
        },
        bestScore(player) {
            const info = lib.skill.wuweizhuangji;
            const cost = info.hpCost(player);
            if (!Number.isFinite(cost)) return -1;
            let best = 0;
            game.countPlayer(function (target) {
                if (get.attitude(player, target) >= 0) return;
                const dealt = get.damageEffect(target, player, player) * player.maxHp;
                if (Number.isFinite(dealt)) best = Math.max(best, -dealt);
            });
            return best - cost + info.saveValue(player);
        },
        ai: {
            order: 1,
            result: {
                player: function (player) {
                    return lib.skill.wuweizhuangji.bestScore(player);
                },
                target: function (player, target) {
                    // 无畏装击：失去所有体力对目标造成等同于体力上限的伤害
                    // 这是一个自杀式攻击技能，需要谨慎评估

                    var damage = player.maxHp;
                    var myHp = player.hp;

                    // 如果自己濒死且无法被救，优先考虑使用
                    if (myHp <= 1 && player.hp <= player.getDamagedHp()) {
                        // 对敌人使用
                        if (get.attitude(player, target) < 0) {
                            // 如果能击杀关键敌人，收益极高
                            if (target.hp <= damage) {
                                return -20;
                            }
                            // 能造成大量伤害也值得
                            return -10;
                        }
                        return 0;
                    }

                    // 正常情况下评估收益
                    if (get.attitude(player, target) < 0) {
                        // 对敌人：评估是否值得用命换伤害
                        var targetValue = get.threaten(target);

                        // 能击杀高威胁目标
                        if (target.hp <= damage && targetValue > 2) {
                            // 如果自己体力很低且局势不利，值得拼命
                            if (myHp <= 2) {
                                return -15;
                            }
                            return -8;
                        }

                        // 能造成致命伤害但无法击杀
                        if (target.hp <= damage + 1 && targetValue > 2) {
                            if (myHp <= 1) {
                                return -12;
                            }
                            return -5;
                        }

                        // 一般情况：伤害高但代价太大
                        return -3;
                    }

                    // 不对友方使用
                    return 0;
                },
            },
            tag: {
                damage: function (card, player, target) {
                    if (target && get.attitude(player, target) < 0) {
                        return player.maxHp;
                    }
                    return 0;
                },
            },
        },
    },
    zhongzhuangcike: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        group: ["wushifangju", "liushitili"],
        "_priority": 0,
    },
    wushifangju: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "useCardToPlayered",
        },
        filter: function (event) {
            //game.log("重装刺客1判断条件：使用杀指定目标");
            return (event.card.name == 'sha' || event.card.name == 'sheji9');
        },
        forced: true,
        logTarget: "target",
        content: function () {
            //game.log("重装刺客1执行代码");
            if (player.countCards('e')) {
                trigger.target.addTempSkill('qinggang2');
                trigger.target.storage.qinggang2.add(trigger.card);
                trigger.target.markSkill('qinggang2');
            }
            //game.log("重装刺客1执行结束");
            event.finish();
        },
        prompt: "你装备区内有牌时,你使用的杀无视防具",
    },

    liushitili: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            source: "damageBefore",
        },
        forced: true,
        audio: "ext:舰R牌将/audio/skill:2",
        check: function () { return false; },
        content: function () {
            var num = trigger.num;
            trigger.cancel();
            trigger.player.loseHp(num);

            // 将体力流失计入萤火虫的造成伤害统计
            var sourceStat = player.getStat();
            if (!sourceStat.damage) sourceStat.damage = 0;
            sourceStat.damage += num;

            // 将体力流失计入承受者的受伤统计
            var targetStat = trigger.player.getStat();
            if (!targetStat.damaged) targetStat.damaged = 0;
            targetStat.damaged += num;
        },
        ai: {
            jueqing: true,
        },
        "_priority": 0,
    },
    /*zhongzhuangcike_2: {
        trigger: {
            source: "damageSource",
        },
        filter: function (event, player) {
            if (event._notrigger.includes(event.player)) return false;
            return (event.card && (event.card.name == 'sha' || event.card.name == 'sheji9') && (event.getParent().name == 'sha' || event.getParent().name == 'sheji9'));
        },
        content: function () {
            //game.log("重装刺客2执行代码");
            //game.log(trigger.player);
            //game.log(player);
            if (trigger.player.countCards('e')) {
                player.discardPlayerCard('e', trigger.player, 1, true);
            } else {
                player.draw(1);
            }
        },
        prompt: "造成伤害后可以弃置目标角色的一张装备牌或摸一张牌",
    },*/
    /*zhongzhuangcike_3: {
        enable: ["chooseToRespond", "chooseToUse"],
        filterCard(card, player) {
            if (get.zhu(player, 'shouyue')) return true;
            return get.type(card) == 'equip';
        },
        position: "hes",
        viewAs: {
            name: "sha",
        },
        viewAsFilter(player) {
            if (get.zhu(player, 'shouyue')) {
                if (!player.countCards('hes')) return false;
            }
            else {
                if (!player.countCards('hes', { type: 'equip' })) return false;
            }
        },
        prompt: "将一张装备牌当杀使用或打出",
    },*/
    duomianshou: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        filter: function (event, player) { return player.countMark('duomianshou_count') < 3; },
        init: function (player) { player.storage.duomianshou = []; },
        getConversionCandidates: function (card, player) {
            var list = [];
            var seen = [];
            for (var pileCard of ui.cardPile.childNodes) {
                if (get.number(card) != get.number(pileCard)) continue;
                var name = get.name(pileCard);
                if (seen.includes(name)) continue;
                var type = get.type(pileCard);
                var converted = { name: name, nature: get.nature(pileCard), isCard: true };
                if ((type != 'trick' && type != 'basic') || !lib.filter.cardEnabled(converted, player)) continue;
                if (!player.hasUseTarget(converted, true, false)) continue;
                seen.push(name);
                list.push(pileCard);
            }
            return list;
        },
        getBestUseValue: function (card, player) {
            var best = 0;
            for (var pileCard of lib.skill.duomianshou.getConversionCandidates(card, player)) {
                var converted = { name: get.name(pileCard), nature: get.nature(pileCard), isCard: true };
                best = Math.max(best, player.getUseValue(converted, false, false));
            }
            return best;
        },
        getConversionScore: function (card, player) {
            var convertedValue = lib.skill.duomianshou.getBestUseValue(card, player);
            if (convertedValue <= 0) return 0;

            // A card that cannot produce value in the current phase should be a
            // reasonable conversion cost. Retention value remains a soft penalty
            // for defensive and delayed cards rather than a hard veto.
            var directUseValue = player.getUseValue(card, false, false);
            var retentionCost = get.value(card, player) * 0.35;
            return convertedValue + 1 - Math.max(directUseValue, retentionCost);
        },
        filterCard(card, player) {
            var numbers = [];

            if (player.storage.duomianshou.length) {
                //game.log("进入了if");
                for (var i = 0; i < player.storage.duomianshou.length; i++) {
                    numbers.add(get.number(player.storage.duomianshou[i]));
                }
            }
            if (!numbers.includes(get.number(card))) {
                return true;
            }

            return false;
        },
        mark: true,
        intro: {
            name: "多面手",
            content: function (storage, player) {
                var str = "已发动次数：" + player.countMark('duomianshou_count');
                return str;
            },
        },
        position: "hs",
        discard: false,
        lose: false,
        log: false,
        check: function (card) {
            var player = get.player();
            return lib.skill.duomianshou.getConversionScore(card, player);
        },
        async content(event, trigger, player) {
            var card = event.cards[0];
            var list = lib.skill.duomianshou.getConversionCandidates(card, player);
            player.addTempSkill('duomianshou_count', { global: 'phaseAfter' });
            player.addMark('duomianshou_count', 1, false);
            await player.discard(card);
            var result = list.length ? await player.chooseCardButton('多面手', list, 1)
                .set('selectButton', 1).set('ai', button => get.player().getUseValue(button.link, false, false)).forResult() : {bool: false};
            if (!result.bool) {
                player.storage.duomianshou.push(card);
                player.removeMark('duomianshou_count', 1, false);
                player.getStat('skill').duomianshou = Math.max(0, (player.getStat('skill').duomianshou || 0) - 1);
                return;
            }
            var chosen = result.links[0];
            await player.chooseUseTarget({name: get.name(chosen), nature: get.nature(chosen), isCard: true}, true, false);
            player.logSkill('duomianshou');
        },
        group: ['duomianshou_reset'],
        subSkill: {
            count: { charlotte: true, onremove: true },
            reset: {
                charlotte: true, forced: true, silent: true,
                trigger: { global: 'phaseAfter' },
                content: function () { player.storage.duomianshou = []; },
            },
        },
        ai: {
            order: function (item, player) {
                var best = 0;
                for (var card of player.getCards('h')) {
                    if (!lib.skill.duomianshou.filterCard(card, player)) continue;
                    best = Math.max(best, lib.skill.duomianshou.getConversionScore(card, player));
                }
                if (best >= 8) return 10;
                if (best >= 4) return 8;
                if (best > 0) return 6;
                return 1;
            },
            result: {
                player: 1,
            },
        },
        "_priority": 0,

    },
    duomianshou_1: {
        usable: 1,
        trigger: {
            player: "useCardToPlayer",
        },
        frequent: true,
        logTarget: "target",
        check: function (event, player) {
            if (get.attitude(player, event.target) > 0) return true;
            var target = event.target;
            return target.countCards('h') == 0 || !target.hasSkillTag('noh');
        },
        filter: function (event, player) {
            if (event.target.hasSkill('quzhudd') || event.target.hasSkill('qingxuncl') || event.target.hasSkill('qiantingss') || event.target.hasSkill('zhongxunca'))
                return event.target != player;
        },
        content: function () {
            "step 0"
            //game.log(get.translation(trigger.target.name) + "多面手触发");
            if (!trigger.target.countCards('h')) event._result = { bool: false };
            else trigger.target.chooseToDiscard('弃置一张手牌,或令' + get.translation(player) + '摸一张牌').set('ai', function (card) {
                var trigger = _status.event.getTrigger();
                return -get.attitude(trigger.target, trigger.player) - get.value(card) - Math.max(0, 4 - trigger.target.hp) * 2;
            });
            "step 1"
            if (result.bool == false) player.draw();
        },
        ai: {
            threaten: 1.4,
        },
        "_priority": 0,
    },
    kaixuan: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        shaRelated: true,
        trigger: {
            player: "useCardToPlayer",
        },
        check: function (event, player) {
            return get.attitude(player, event.target) <= 0;
        },
        filter: function (event, player) {
            return player != event.target && event.targets.length == 1 && (event.card.name == 'sha' || event.card.name == 'sheji9');
        },
        logTarget: "target",
        content: function () {
            "step 0"

            player.chooseToDiscard('he', 1);
            "step 1"
            if (result.bool) {
                game.log("此杀伤害基数" + trigger.getParent().baseDamage);
                //game.log(trigger.target);
                trigger.getParent().baseDamage++;//该语句不能在callback中执行
            } else {
                event.finish();
            }
        },
        ai: {
            expose: 0.2,
            threaten: 1.3,
        },
        "_priority": 0,
    },
    changge: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        forced: true, firstDo: true, priority: 100,
        trigger: { player: 'useCardToPlayered', source: 'damageBegin3' },
        filter: function (event, player) {
            if (!event.card || get.name(event.card) != 'sha') return false;
            if (player.hp <= 2) return true;
            if (event.name == 'damage') return event.num >= 2;
            var use = event.getParent();
            var extra = use.customArgs?.[event.target.playerid]?.extraDamage || 0;
            return (use.baseDamage || 1) + (use.extraDamage || 0) + extra >= 2;
        },
        content: function () {
            var target = trigger.name == 'damage' ? trigger.player : trigger.target;
            target.addTempSkill('qinggang2');
            target.storage.qinggang2.add(trigger.card);
            target.markSkill('qinggang2');
        },
    },
    xiongjiaqibin: {
        nobracket: true,
        forced: true,
        mod: {
            globalFrom(from, to, distance) {
                if (from.getSeatNum() < to.getSeatNum()) return distance - 1;
            },
        },
    },
    yishisheji: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        /*  mod: {
             targetInRange(card, player, target) {
                 //game.log(player.getHistory('useCard', evt => get.name(evt.card) == 'sha' || "sheji9"));
                 if ((get.name(card) == 'sha' || get.name(card) == "sheji9") && !player.getHistory('useCard', evt => get.name(evt.card) == 'sha' || "sheji9").length) return true;
             },
         }, */
        shaRelated: true,
        trigger: {
            player: "useCardToPlayered",
        },
        check: function (event, player) {
            return get.attitude(player, event.target) <= 0;
        },
        filter: function (event, player) {
            return player != event.target && event.targets.length == 1 && event.card.name == 'sha';
        },
        logTarget: "target",
        content: function () {
            "step 0"
            player.judge(function (card) {
                if (get.suit(card) != "heart") return 1;
                return -1;
            });
            "step 1"
            game.log("此杀伤害基数" + trigger.getParent().baseDamage);
            //game.log(get.suit(result));
            //game.log(trigger.target);
            if (get.suit(result) != "heart") {
                trigger.getParent().baseDamage++;

            } else if (get.suit(result) == "heart") {
                trigger.targets.length = 0;
                trigger.getParent().triggeredTargets1.length = 0;//取消所有目标,来自秦宓谏征
            }

        },
        ai: {
            expose: 0.2,
        },
        "_priority": 0,
        group: ["yishisheji_mianyi"],
        subSkill: {
            /* mianyi: {
                trigger:
                {
                    player: "damageBefore",
                    //source: "damageSource",
 
                },
                round: 1, filter: function (event, player) { return event.card },
                forced: true,
                content: function () {
                    trigger.cancel();
                    game.log(player, "免疫了一次伤害。");
                },
                mark: false,
                sub: true,
            }, */
            mianyi: {
                nobracket: true,
                audio: "ext:舰R牌将/audio/skill:true",
                trigger: {
                    target: "useCardToBefore",
                },
                forced: true,
                priority: 15,
                check(event, player) {
                    return get.effect(event.target, event.card, event.player, player) < 0;
                },
                filter(event, player) {
                    if (player.hasSkill("yishisheji_mianyi_used")) return false;
                    return (get.type(event.card, "trick") == "trick" || get.name(event.card) == "sha" || get.name(event.card) == "sheji9") && event.player != player;
                },
                content() {
                    trigger.cancel();
                    player.addTempSkill("yishisheji_mianyi_used", { global: "roundStart" });
                },
                ai: {
                    threaten: 0.9,
                    target: function (card, player, target) {
                        if (player._yishisheji_mianyi_tmp) return;
                        if (_status.event.getParent("useCard", true) || _status.event.getParent("_wuxie", true)) return;
                        if (get.tag(card, "damage")) {
                            if (target.hasSkill("yishisheji_mianyi_used")) {
                                return [1, -2];
                            } else {
                                if (get.attitude(player, target) > 0 && target.hp > 1) {
                                    return 0;
                                }
                                if (get.attitude(player, target) < 0) {
                                    if (card.name == "sha") return;
                                    var sha = false;
                                    player._yishisheji_mianyi = true;
                                    var num = player.countCards("h", function (card) {
                                        if (card.name == "sha") {
                                            if (sha) {
                                                return false;
                                            } else {
                                                sha = true;
                                            }
                                        }
                                        return player.canUse(card, target) && get.effect(target, card, player, player) > 0;
                                    });
                                    delete player._yishisheji_mianyi_tmp;
                                    if (num < 2) {
                                        var enemies = player.getEnemies();
                                        if (enemies.length == 1 && enemies[0] == target && player.needsToDiscard()) {
                                            return;
                                        }
                                        return 0;
                                    }
                                }
                            }
                        }
                    },
                },
                "_priority": 1500,
            },
            mianyi_used: {
                mark: true,
                intro: {
                    content: '本轮已发动'
                },
            },

        },
    },
    jueshengzhibing: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "phaseJieshuBegin",
        },
        forced: true,
        filter: function (event, player) {
            return player.countMark('jueshengzhibing_count') < 2;
        },
        content: function () {
            player.addTempSkill('zhiyu_R', { player: 'phaseBegin' });
        },
        group: ["jueshengzhibing_discard", "jueshengzhibing_draw"],
        //preHidden: ["jueshengzhibing_discard", "jueshengzhibing_draw"],
        subSkill: {
            discard: {
                audio: "ext:舰R牌将/audio/skill:true",
                logTarget: "target",
                trigger: {
                    player: "useCardToPlayered",
                },
                filter: function (event, player) {
                    //game.log(event.target.hujia);
                    return player.countMark('jueshengzhibing_count') < 2 && event.target.hujia > 0 && event.target.countDiscardableCards(player, 'he') > 0 &&
                        (event.card.name == 'sha' || event.card.name == 'sheji9');
                },
                check: function (event, player) {
                    return get.attitude(player, event.target) <= 0;
                },
                content: function () {
                    player.discardPlayerCard('he', trigger.target, 1, true);
                    player.addTempSkill('jueshengzhibing_count', { global: 'phaseAfter' });
                    player.addMark('jueshengzhibing_count', 1, false);

                    /* if (player.countMark('jueshengzhibing_count') >= 2) {
                        var evt = _status.event.getParent('phaseUse');
                        if (evt && evt.name == 'phaseUse') {
                            evt.skipped = true;
                            event.finish();
                        }
                    } */
                },
                sub: true,
                "_priority": 0,
            },
            draw: {
                audio: "ext:舰R牌将/audio/skill:true",
                trigger: {
                    player: "useCard",
                },
                filter: function (event, player) {
                    return player.countMark('jueshengzhibing_count') < 2 && get.type2(event.card) == 'trick';
                },
                content: function () {
                    player.draw();
                    player.addTempSkill('jueshengzhibing_count', { global: 'phaseAfter' });
                    player.addMark('jueshengzhibing_count', 1, false);

                    /* if (player.countMark('jueshengzhibing_count') >= 2) {
                        var evt = _status.event.getParent('phaseUse');
                        if (evt && evt.name == 'phaseUse') {
                            evt.skipped = true;
                            event.finish();
                        }
                    } */
                },
                sub: true,
                "_priority": 0,
            },
            count: {
                onremove: true,
                sub: true,
                "_priority": 0,
            },
        },
        "_priority": 0,

    },
    zhiyu_R: {
        audio: "ext:舰R牌将/audio/skill:2",
        trigger: {
            player: "damageEnd",
        },
        preHidden: true,
        content: function () {
            "step 0";
            player.draw();
            "step 1";
            if (!player.countCards("h")) event.finish();
            else player.showHandcards();
            "step 2";
            if (!trigger.source) return;
            var cards = player.getCards("h");
            var color = get.color(cards[0], player);
            for (var i = 1; i < cards.length; i++) {
                if (get.color(cards[i], player) != color) return;
            }
            trigger.source.chooseToDiscard(true);
        },
        ai: {
            "maixie_defend": true,
            threaten: 0.9,
        },
        "_priority": 0,
    },
    zhanfu: {
        nobracket: true,
        mod: {
            targetInRange(card, player, target) {
                if ((card.name == 'sha' || card.name == 'sheji9') && player.isMaxHandcard()) return true;
            },

        },

    },
    xinqidian: {
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filter: function (card, player, target) {
            return player.countCards("h");
        },
        filterTarget: function (card, player, target) {
            return player != target && target.countCards("h");
        },
        selectTarget: function () {
            return [1, 3];
        },
        multiline: true,
        multitarget: true,
        content: function () {
            "step 0"
            event.targets = event.targets.slice(0).sortBySeat();
            event.targets.push(player);
            event.cards = [];
            event.index = 0;
            "step 1"
            if (event.index >= event.targets.length) {
                event.goto(3);
                return;
            }
            event.current = event.targets[event.index];
            event.current.chooseCard("请展示一张手牌", true).set("ai", function (card) {
                return -get.value(card);
            });
            "step 2"
            if (!result.bool || !result.cards || !result.cards[0]) {
                game.log(get.translation(event.current), "未能展示牌，技能中止");
                player.getStat("skill").xinqidian -= 1;
                event.finish();
                return;
            }
            // 仅记录选择结果；全部角色选牌完成后再统一展示。
            event.cards.push(result.cards[0]);
            event.index++;
            event.goto(1);
            "step 3"
            player.showCards(event.cards, get.translation(player) + "发动了【新起点】");
            for (var i = 0; i < event.targets.length; i++) {
                game.log(event.targets[i], "展示了", event.cards[i]);
            }
            event.allDifferent = true;
            for (var i = 0; i < event.cards.length; i++) {
                for (var j = 0; j < i; j++) {
                    if (get.suit(event.cards[i], false) == get.suit(event.cards[j], false)) {
                        event.allDifferent = false;
                        break;
                    }
                }
                if (!event.allDifferent) break;
            }
            "step 4"
            for (var k = 0; k < event.targets.length; k++) {
                if (event.allDifferent) {
                    game.log(event.targets[k], "摸牌");
                    event.targets[k].draw();
                } else {
                    game.log(event.targets[k], "获得技能");
                    event.targets[k].addSkill('xinqidian_distance');
                    event.targets[k].storage.xinqidian_distance = false;
                }
            }
        },
        ai: {
            order: 3.05,
            result: {
                player(player, target) {
                    var att = get.attitude(player, target);
                    if (att <= 0) return 0;
                    return 1;
                },
                target(player, target) {
                    return 2.5 - ui.selected.targets.length;
                },
            },
        },
    },
    xinqidian_distance: {
        charlotte: true, onremove: true,
        mod: { globalFrom: function (from, to, distance) { return distance - 1; } },
        trigger: { player: ['phaseBefore', 'phaseAfter'] },
        forced: true, silent: true,
        content: function () {
            if (event.triggername == 'phaseBefore') player.storage.xinqidian_distance = true;
            else if (player.storage.xinqidian_distance) player.removeSkill('xinqidian_distance');
        },
    },
    jilizhixin: {
        nobracket: true,
        trigger: {
            player: "phaseUseBefore",
        },
        filter: function (event, player) {
            return player.countCards('he') > 0 && !player.hasSkill('jilizhixin3');
        },
        frequent: true,
        //preHidden: true,
        content: function () {
            "step 0"
            var fang = player.countMark('jilizhixin2') == 0 && player.hp >= 2 && player.countCards('h') <= player.maxHandcard + 1;

            player.chooseBool(get.prompt2('jilizhixin')).set('ai', function () {
                if (!_status.event.fang) return false;
                return game.hasPlayer(function (target) {
                    if (target.hasJudge('lebu') || target == player) return false;
                    if (get.attitude(player, target) > 4) {
                        return (get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards('h') + 1) > 0);
                    }
                    return false;
                });
            }).set('fang', fang).setHiddenSkill(event.name);
            "step 1"
            if (result.bool) {
                player.chooseToDiscard('he', '是否弃置一张牌并令一名角色进行一个额外回合？').set('logSkill', 'jilizhixin').ai = function (card) {
                    return 20 - get.value(card);
                };
            } else event.finish();
            "step 2"
            if (result.bool) {
                player.logSkill('jilizhixin');
                trigger.cancel();
                player.addTempSkill('jilizhixin2');
                player.addMark('jilizhixin2', 1, false);

            } else event.finish();
        },

        locked: true,
        ai: {//全在ai里面
            viewHandcard: function (player) {//关于能看别人手牌的
                if (!player.hasEmptySlot(5)) return false; //宝具有没有,装备5是宝具
                return true;//如果是的话生效
            },
            skillTagFilter(player, tag, arg) {//这是给ai的
                if (!player.hasEmptySlot(5)) return false;//也是检查宝具的
                if (player == arg) return false; // 且加上过滤器,防止对自己使用
            }
        },
        "_priority": 0,
    },
    jilizhixin2: {
        nobracket: true,
        trigger: { player: 'phaseEnd' },
        forced: true,
        popup: false,
        audio: false,
        //priority:-50,
        onremove: true,
        content: function () {
            "step 0"
            event.count = player.countMark(event.name);
            player.removeMark(event.name, event.count);
            "step 1"
            event.count--;

            "step 2"

            player.chooseTarget(true, '请选择进行额外回合的目标角色').ai = function (target) {
                if (target.hasJudge('lebu') || get.attitude(player, target) <= 0) return -1;
                if (target.isTurnedOver()) return 0.18;
                return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards('h') + 1);
            };


            "step 3"
            var target = result.targets[0];
            player.line(target, 'fire');
            target.markSkillCharacter('jilizhixin', player, 'jilizhixin', '进行一个额外回合');
            target.insertPhase();
            target.addSkill('jilizhixin3');
            if (event.count > 0) event.goto(1);
        }
    },
    jilizhixin3: {
        nobracket: true,
        trigger: { player: ['phaseAfter', 'phaseCancelled'] },
        forced: true,
        popup: false,
        audio: false,
        content: function () {
            player.unmarkSkill('jilizhixin');
            player.removeSkill('jilizhixin3');
        }
    },
    hangkongzhanshuguang: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        usable: 1,
        enable: "phaseUse",
        filterTarget: true,
        content: function () {
            //game.log(target);
            if (target.hasSkill("hangmucv")) {
                //game.log("CV");
                target.draw(2);
            }
            else {
                // game.log("!=CV");
                target.draw(1);
            }
        },
        ai: {
            order: 7.2,
            result: {
                target(player, target) {
                    if (!player || !target) return 0;
                    var attitude = get.attitude(player, target);
                    if (attitude > 0) {
                        var drawCount = target.hasSkill("hangmucv") ? 2 : 1;
                        var need = Math.max(0, target.maxHp - target.countCards("h"));
                        return attitude * (drawCount + Math.min(need, 2) * 0.25);
                    }
                    return 0;
                },
            },
        },
    },
};
export { standard };
