import { lib, game, ui, get, ai, _status } from '../../../noname.js';
const shuileizhandui = {
    xietongzuozhan: {
        audio: false,
        enable: "phaseUse",  //出牌阶段可发动
        usable: 1,  //每阶段限一次
        //目标筛选：最多选择的目标数不能超过手牌数
        filterTarget: function (card, player, target) {
            return ui.selected.targets.length < player.countCards("h");
        },
        //目标数量：1到手牌数
        selectTarget: function () {
            var player = _status.event.player;
            return [1, player.countCards("h")];
        },
        //发动条件：有手牌
        filter: function (event, player) {
            return player.countCards("h") > 0;
        },
        multitarget: true,  //多目标技能
        multiline: true,    //多条连线
        content: function () {
            "step 0"
            //让玩家选择与目标数量相等的手牌
            var num = targets.length;
            player.chooseCard("协同作战：选择" + num + "张手牌展示", num, true).set("ai", function (card) {
                return 6 - get.value(card);  //优先选择低价值牌
            });
            "step 1"
            //展示选择的手牌并初始化变量
            if (!result.bool || !result.cards || result.cards.length == 0) {
                event.finish();
                return;
            }
            var cards = result.cards;
            player.showCards(cards, get.translation(player) + "发动了【协同作战】");
            event.showedCards = cards.slice();  //保存展示的牌
            event.cardMap = {};      //cardid -> {name, nature} 的映射
            event.usedNames = [];    //已使用的牌名（用于去重）
            event.currentIndex = 0;  //当前处理的目标索引
            "step 2"
            //循环：让每个目标为对应的牌选择牌名
            if (event.currentIndex >= targets.length) {
                event.goto(4);  //所有目标处理完毕,跳到step 4
                return;
            }
            var target = targets[event.currentIndex];
            var card = event.showedCards[event.currentIndex];
            if (!card || !target) {
                event.currentIndex++;
                event.redo();
                return;
            }
            //构建可选牌名列表（基本牌和锦囊牌,排除已选的）
            var list = [];
            for (var i = 0; i < lib.inpile.length; i++) {
                var name = lib.inpile[i];
                var type = get.type(name);
                if (!type) continue;
                if (type != "basic" && type != "trick" && type != "delay") continue;
                if (event.usedNames.includes(name)) continue;
                var typeTrans = type == "basic" ? "基本" : (type == "delay" ? "延时锦囊" : "锦囊");
                list.push([typeTrans, "", name]);
            }
            if (list.length <= 0) {
                game.log("没有可选的牌了");
                event.finish();
                return;
            }
            if (list.length > 3) {
                //生成3个不重复的随机索引
                const indices = new Set();
                while (indices.size < 3) {
                    indices.add(Math.floor(Math.random() * list.length));
                }
                //用这3个索引对应的元素替换原数组
                list = [...indices].map(i => list[i]);
            }
            //让目标选择一个牌名
            target.chooseButton([
                "协同作战：为" + get.translation(card) + "选择一个牌名",
                [list, "vcard"]
            ], true).set("ai", function (button) {
                var card = { name: button.link[2], type: button.link[0] };
                var player = _status.event.getParent().player;
                var target = get.player();
                if (get.attitude(target, player) > 0) {
                    return get.value(card, player);
                } else {
                    return 10 - get.value(card, player);
                }

            });
            "step 3"
            //处理目标的选择结果
            if (result.bool && result.links && result.links[0]) {
                var link = result.links[0];
                var cardName = link[2];
                var nature = link[3] || null;  //杀的属性（fire/thunder/ice）
                var card = event.showedCards[event.currentIndex];
                var target = targets[event.currentIndex];

                //记录已使用的牌名
                event.usedNames.push(cardName);

                //保存牌名映射
                event.cardMap[card.cardid] = {
                    name: cardName,
                    nature: nature
                };

                game.log(target, "将", card, "的牌名指定为", "#g【" + get.translation(cardName) + "】");
            }
            event.currentIndex++;
            if (event.currentIndex < targets.length) {
                event.goto(2);  //继续处理下一个目标
            }
            "step 4"
            //将牌名映射保存到player.storage,并添加效果子技能
            if (Object.keys(event.cardMap).length > 0) {
                if (!player.storage.xietongzuozhan_cards) {
                    player.storage.xietongzuozhan_cards = {};
                }
                for (var cardid in event.cardMap) {
                    player.storage.xietongzuozhan_cards[cardid] = event.cardMap[cardid];
                }
                player.addSkill("xietongzuozhan_effect");  //添加子技能处理视为效果和还原
            }
        },
        ai: {
            order: 7,  //出牌顺序优先级
            result: {
                target: 1  //正数表示对目标有利,AI会发动
            }
        }
    },
    //【协同作战】子技能 - 处理牌名视为效果和离开手牌时还原
    //通过mod.cardname和mod.cardnature改变手牌的牌名和属性
    //监控牌离开手牌的事件,从storage中移除对应记录
    xietongzuozhan_effect: {
        //触发时机：失去牌后、装备后、判定后、其他角色获得牌后等
        trigger: { player: "loseAfter", global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
        forced: true,   //强制发动
        silent: true,   //不显示发动提示
        popup: false,   //不弹出提示
        filter: function (event, player) {
            if (!player.storage.xietongzuozhan_cards) return false;
            //获取离开的牌
            var cards = [];
            if (event.name == "gain") {
                if (event.player == player) return false;  //自己获得不触发
                cards = event.cards || [];
            } else if (event.name == "loseAsync") {
                if (!event.getl) return false;
                var hs = event.getl(player);
                if (!hs || !hs.cards) return false;
                cards = hs.cards;
            } else if (event.getl) {
                var hs = event.getl(player);
                if (!hs || !hs.cards) return false;
                cards = hs.cards;
            } else if (event.cards) {
                cards = event.cards;
            }
            //检查是否有被标记的牌离开
            for (var card of cards) {
                if (player.storage.xietongzuozhan_cards[card.cardid]) {
                    return true;
                }
            }
            return false;
        },
        content: function () {
            //从storage中移除离开的牌的记录
            var cards = [];
            if (trigger.name == "gain") {
                cards = trigger.cards || [];
            } else if (trigger.name == "loseAsync") {
                if (trigger.getl) {
                    var hs = trigger.getl(player);
                    if (hs && hs.cards) cards = hs.cards;
                }
            } else if (trigger.getl) {
                var hs = trigger.getl(player);
                if (hs && hs.cards) cards = hs.cards;
            } else if (trigger.cards) {
                cards = trigger.cards;
            }
            for (var card of cards) {
                if (player.storage.xietongzuozhan_cards[card.cardid]) {
                    delete player.storage.xietongzuozhan_cards[card.cardid];
                }
            }
            //如果没有被标记的牌了,清理storage并移除子技能
            if (Object.keys(player.storage.xietongzuozhan_cards).length == 0) {
                delete player.storage.xietongzuozhan_cards;
                player.removeSkill("xietongzuozhan_effect");
            }
        },
        //mod：修改牌的属性
        mod: {
            //修改牌名
            cardname: function (card, player) {
                if (player.storage.xietongzuozhan_cards &&
                    player.storage.xietongzuozhan_cards[card.cardid]) {
                    return player.storage.xietongzuozhan_cards[card.cardid].name;
                }
            },
            //修改牌的属性（用于火/雷/冰杀）
            cardnature: function (card, player) {
                if (player.storage.xietongzuozhan_cards &&
                    player.storage.xietongzuozhan_cards[card.cardid] &&
                    player.storage.xietongzuozhan_cards[card.cardid].nature) {
                    return player.storage.xietongzuozhan_cards[card.cardid].nature;
                }
            }
        }
    },
    yuleizhantujin: {
        // 鱼雷战突进：
        // 先按 X 亮出牌堆顶若干牌，再把其中能用的基本牌集中砸向同一名角色；
        // 剩下能对自己生效的锦囊则尽量立即结算，最后处理未用掉的余牌。
        enable: "phaseUse",
        usable: 1,
        filter: function (event, player) {
            return player.countCards("e") + game.countPlayer(function (current) {
                return current.hasSkill("quzhudd");
            }) > 0;
        },
        async content(event, trigger, player) {
            var count = player.countCards("e") + game.countPlayer(function (current) {
                return current.hasSkill("quzhudd");
            });
            var cards = game.cardsGotoOrdering(get.cards(count)).cards;
            var showCardsDelay = Math.min(20, 10 + cards.length * 5);
            await player.showCards(cards, "鱼雷战突进").set("delay_time", showCardsDelay);

            var basicTargetResult = { result: { bool: false } };
            // 只有存在至少一张可合法使用的基本牌时，才需要先确定突击目标。
            var hasBasicTarget = game.hasPlayer(function (current) {
                return cards.some(function (currentCard) {
                    return get.type(currentCard, "trick") == "basic" && player.canUse(currentCard, current, false);
                });
            });
            if (hasBasicTarget) {
                basicTargetResult = await player.chooseTarget(
                    true,
                    get.prompt("yuleizhantujin"),
                    "选择一名角色，依次对其使用亮出牌中的可用基本牌",
                    function (card, player, target) {
                        return _status.event.cards.some(function (currentCard) {
                            return get.type(currentCard, "trick") == "basic" && player.canUse(currentCard, target, false);
                        });
                    }
                ).set("cards", cards).set("ai", function (target) {
                    var player = _status.event.player;
                    return _status.event.cards.reduce(function (sum, currentCard) {
                        if (get.type(currentCard, "trick") != "basic" || !player.canUse(currentCard, target, false)) return sum;
                        return sum + get.effect(target, currentCard, player, player);
                    }, 0);
                });
            }

            var basicTarget = null;
            if (basicTargetResult.result && basicTargetResult.result.bool) {
                basicTarget = basicTargetResult.result.targets[0];
            }

            if (basicTarget && player.isIn() && basicTarget.isIn()) {
                var basicCards = cards.slice(0);
                for (var i = 0; i < basicCards.length; i++) {
                    var basicCard = basicCards[i];
                    // 基本牌统一朝同一个目标倾泻，模拟驱逐舰一轮雷击全打同一处缺口。
                    if (!cards.includes(basicCard) || get.type(basicCard, "trick") != "basic") continue;
                    if (!player.isIn() || !basicTarget.isIn()) break;
                    if (get.info(basicCard).notarget) {
                        continue;
                    } else {
                        if (!player.canUse(basicCard, basicTarget, false)) continue;
                        await player.useCard(basicCard, basicTarget, false);
                    }
                    cards.remove(basicCard);
                }


                var trickCards = cards.slice(0);
                for (var j = 0; j < trickCards.length; j++) {
                    var trickCard = trickCards[j];
                    if (!cards.includes(trickCard) || get.type(trickCard, "trick") != "trick" || !player.isIn()) continue;
                    if (get.info(trickCard).notarget) {
                        continue;
                    } else {
                        if (!basicTarget.canUse(trickCard, player, false)) continue;
                        await basicTarget.useCard(trickCard, player);
                    }
                    cards.remove(trickCard);
                }
            }

            if (cards.length) {
                // 既没法打向敌人、也没法给自己结算的剩余牌统一弃置。
                await game.cardsDiscard(cards);
            }
        },
        ai: {
            order: 7.5,
            result: {
                player: function (player) {
                    return Math.min((player.countCards("e") + game.countPlayer(function (current) {
                        return current.hasSkill("quzhudd");
                    })) / 2, 3);
                },
            },
        },
    },
};

export { shuileizhandui };