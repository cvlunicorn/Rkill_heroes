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
    zhanduiqijian: {
        // 战队旗舰：
        // 其他角色出牌阶段开始时，可以先看牌堆顶三张，
        // 再按需要把其中 0~2 张“调拨”给该角色，剩余牌按原顺序放回牌堆顶。
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        round: 1,
        trigger: {
            global: "phaseUseBegin",
        },
        filter: function (event, player) {
            return event.player != player && event.player.isIn();
        },
        prompt: function (event, player) {
            return get.prompt("zhanduiqijian", event.player, player);
        },
        prompt2: function (event) {
            return "观看牌堆顶的三张牌，并令" + get.translation(event.player) + "获得其中至多两张牌。";
        },
        check: function (event, player) {
            if (event.player == player) return true;
            return get.attitude(player, event.player) > 0;
        },
        async content(event, trigger, player) {
            var target = trigger.player;
            // 进入牌序区，确保挑完牌后还能把剩余牌稳定塞回牌堆顶。
            var cards = game.cardsGotoOrdering(get.cards(3)).cards;
            var chooseResult = await player
                .chooseButton(
                    ["战队旗舰：选择令" + get.translation(target) + "获得的牌（至多两张）", cards],
                    [0, Math.min(2, cards.length)]
                )
                .set("target", target)
                .set("ai", function (button) {
                    var player = _status.event.player;
                    var target = _status.event.target;
                    if (get.attitude(player, target) <= 0) return 0;
                    return get.value(button.link, target);
                });

            var gains = [];
            if (chooseResult.result.bool && chooseResult.result.links && chooseResult.result.links.length) {
                gains = chooseResult.result.links.slice(0);
                await target.gain(gains, "draw");
                cards.removeArray(gains);
            }

            // 剩余牌逆序插回牌堆顶，从而还原“未被选中的牌保持原先上下顺序”。
            cards.reverse();
            for (var i = 0; i < cards.length; i++) {
                ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild);
            }
            game.updateRoundNumber();
        },
        ai: {
            expose: 0.15,
            threaten: 1.1,
        },
    },
    lingjupaoji: {
        // 零距炮击：
        // 选择距离 1 的目标，亮出牌堆顶三张牌，
        // 若其中存在能对该目标合法使用的伤害牌，则可选其中一张直接结算。
        nobracket: true,
        enable: "phaseUse",
        usable: 1,
        filter: function (event, player) {
            return game.hasPlayer(function (current) {
                return current != player && get.distance(player, current) == 1;
            });
        },
        filterTarget: function (card, player, target) {
            return target != player && get.distance(player, target) == 1;
        },
        async content(event, trigger, player) {
            var target = event.target;
            var cards = game.cardsGotoOrdering(get.cards(3)).cards;
            await player.showCards(cards, get.translation(player) + "发动了【零距炮击】");

            if (player.isIn() && target.isIn()) {
                // 先从亮出的三张里筛掉无伤害或不能指定目标的废牌。
                var damageCards = cards.filter(function (card) {
                    if (!get.tag(card, "damage")) return false;
                    if (!lib.filter.targetEnabled2(card, player, target)) return false;
                    return player.canUse(card, target, false);
                });
                if (damageCards.length) {
                    var result = await player
                        .chooseButton(
                            ["零距炮击：你可以对" + get.translation(target) + "使用其中一张伤害牌", damageCards],
                            false
                        )
                        .set("target", target)
                        .set("ai", function (button) {
                            var player = _status.event.player;
                            var target = _status.event.target;
                            return get.effect(target, button.link, player, player);
                        });
                    if (result.result && result.result.bool && result.result.links && result.result.links.length) {
                        var chosenCard = result.result.links[0];
                        cards.remove(chosenCard);
                        // 选中的那张直接按原牌名结算，剩下的再统一丢弃。
                        await player.useCard(chosenCard, target, false);
                    }
                }
            }
            if (cards.length) {
                // 没被打出去的亮牌全部进入弃牌堆，不回牌堆顶。
                player.loseToDiscardpile(cards);
            }
        },
        ai: {
            order: 6.5,
            expose: 0.12,
            result: {
                target: function (player, target) {
                    return get.attitude(player, target) < 0 ? -0.8 : 0;
                },
            },
        },
    },
    wuyizhuangji: {
        enable: "phaseUse",
        usable: 1,
        nobracket: true,
        filterTarget: function (card, player, target) {
            return target != player;
        },
        async content(event, trigger, player) {
            var target = event.target;
            await player.loseHp();
            if (!player.isIn() || !target.isIn()) return;
            var damage = Math.floor(target.getHp() / 2);
            if (damage > 0) {
                await target.damage(damage, player);
            }
        },
        ai: {
            order: 8,
            result: {
                player: function (player, target) {
                    if (player.hp > 2) return -1;
                    return -2;
                },
                target: function (player, target) {
                    var damage = Math.floor(Math.max(target.getHp(), 0) / 2);
                    if (damage <= 0) return 0;
                    return get.damageEffect(target, player, player) * damage;
                },
            },
        },
    },
    shuileihun: {
        // 水雷魂：
        // 出牌阶段一开始就能抢先补一张虚拟【雷杀】，保留“驱逐先手雷击”的定位。
        trigger: {
            player: "phaseUseBegin",
        },
        frequent: true,
        log: false,
        filter: function (event, player) {
            // 先确认当前确实存在可合法指定的目标，避免空触发。
            return player.hasUseTarget({ name: "sha", nature: "thunder", isCard: true }, false);
        },
        prompt2: "选择一名角色，视为对其使用一张【雷杀】。",
        content: function () {
            "step 0";
            // 目标选择和真正用牌拆开做，和常规“视为使用一张杀”的流程保持一致。
            player.chooseTarget(
                get.prompt("shuileihun"),
                "选择一名角色，视为对其使用一张【雷杀】",
                function (card, player, target) {
                    return player.canUse({ name: "sha", nature: "thunder", isCard: true }, target, false);
                }
            ).set("ai", function (target) {
                var player = _status.event.player;
                return get.effect(target, { name: "sha", nature: "thunder", isCard: true }, player, player);
            });
            "step 1";
            if (result.bool && result.targets && result.targets.length) {
                player.logSkill("shuileihun", result.targets);
                // 直接生成虚拟【雷杀】，不需要额外消耗实体手牌。
                player.useCard({ name: "sha", nature: "thunder", isCard: true }, result.targets[0], false);
            }
        },
    },
    shuileiqiangxi: {
        // 水雷强袭：
        // 把全部手牌压成一张超规格【雷杀】，伤害更高、需要更多【闪】响应；
        // 但打完这一轮总攻后，自己的出牌阶段也会立刻结束。
        enable: "phaseUse",
        filterCard: true,
        selectCard: -1,
        position: "h",
        prompt: function () {
            var player = get.player();
            var num = player ? player.countCards("h") : 0;
            return "将所有手牌当作一张需要" + num + "张【闪】响应且伤害基数+1的【雷杀】使用";
        },
        filter: function (event, player) {
            var hs = player.getCards("h");
            if (!hs.length) return false;
            for (var card of hs) {
                if (game.checkMod(card, player, "unchanged", "cardEnabled2", player) === false) return false;
            }
            return event.filterCard(get.autoViewAs({ name: "sha", nature: "thunder", storage: { shuileiqiangxi: true } }, hs));
        },
        viewAs: {
            name: "sha",
            nature: "thunder",
            storage: { shuileiqiangxi: true },
        },
        group: ["shuileiqiangxi_damage", "shuileiqiangxi_response", "shuileiqiangxi_end"],
        ai: {
            order: 9,
            result: {
                player: function (player) {
                    var handCount = player.countCards("h");
                    if (!handCount) return 0;
                    var best = 0;
                    game.countPlayer(function (current) {
                        if (current == player) return;
                        if (!player.canUse({ name: "sha", nature: "thunder", isCard: true }, current, false)) return;
                        best = Math.max(best, get.effect(current, { name: "sha", nature: "thunder", isCard: true }, player, player));
                    });
                    if (best <= 0) return 0;
                    var cost = get.value(player.getCards("h"), player) / Math.max(1, handCount);
                    // 这是交光手牌的爆发技，收益至少要明显高于均摊手牌价值。
                    return best > cost ? Math.min(2.5, best / 1.6) : 0;
                },
            },
        },
    },
    shuileiqiangxi_damage: {
        // 这张总攻【雷杀】的基础伤害固定额外 +1。
        forced: true,
        popup: false,
        trigger: {
            player: "useCard",
        },
        filter: function (event) {
            return event.card && event.card.name == "sha" && (event.skill == "shuileiqiangxi" || (event.card.storage && event.card.storage.shuileiqiangxi));
        },
        content: function () {
            trigger.baseDamage++;
        },
    },
    shuileiqiangxi_response: {
        // 响应需求按实体牌数结算：用了几张手牌，就要多交几张【闪】。
        forced: true,
        popup: false,
        trigger: {
            player: "useCardToPlayered",
        },
        filter: function (event) {
            return event.card && event.card.name == "sha" && (event.skill == "shuileiqiangxi" || (event.card.storage && event.card.storage.shuileiqiangxi)) && !event.getParent().directHit.includes(event.target) && event.cards && event.cards.length > 1;
        },
        logTarget: "target",
        content: function () {
            var id = trigger.target.playerid;
            var map = trigger.getParent().customArgs;
            if (!map[id]) map[id] = {};
            if (typeof map[id].shanRequired == "number") {
                map[id].shanRequired += trigger.cards.length - 1;
            }
            else {
                map[id].shanRequired = trigger.cards.length;
            }
        },
    },
    shuileiqiangxi_end: {
        // 爆发完毕直接结束出牌阶段，防止再叠普通输出手段。
        forced: true,
        popup: false,
        trigger: {
            player: "useCardAfter",
        },
        filter: function (event) {
            return event.card && event.card.name == "sha" && (event.skill == "shuileiqiangxi" || (event.card.storage && event.card.storage.shuileiqiangxi));
        },
        content: function () {
            var evt = trigger.getParent("phaseUse");
            if (evt) evt.skipped = true;
        },
    },
    kongqianyiti: {
        // 空潜一体：
        // 回合内打基本牌后补一张锦囊，回合外打锦囊后补一张基本牌，
        // 让她在主动输出和被动支援之间形成资源循环。
        locked: true,
        forced: true,
        group: ["kongqianyiti_turn", "kongqianyiti_outturn"],
        subSkill: {
            turn: {
                // 自己回合内偏向先手调度，基本牌会继续牵出后续锦囊资源。
                trigger: {
                    player: "useCard",
                },
                forced: true,
                filter: function (event, player) {
                    return _status.currentPhase == player && get.type2(event.card) == "basic" && !!get.cardPile(function (card) {
                        return get.type2(card) == "trick";
                    });
                },
                content: function () {
                    var card = get.cardPile(function (card) {
                        return get.type2(card) == "trick";
                    });
                    if (card) player.gain(card, "gain2");
                },
            },
            outturn: {
                // 回合外更像防空/反潜支援，打出锦囊后再补一张基础应急牌。
                trigger: {
                    player: "useCard",
                },
                forced: true,
                filter: function (event, player) {
                    return _status.currentPhase != player && get.type2(event.card) == "trick" && !!get.cardPile(function (card) {
                        return get.type2(card) == "basic";
                    });
                },
                content: function () {
                    var card = get.cardPile(function (card) {
                        return get.type2(card) == "basic";
                    });
                    if (card) player.gain(card, "gain2");
                },
            },
        },
    },
};

export { shuileizhandui };