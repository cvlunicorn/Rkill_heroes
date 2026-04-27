import { lib, game, get, ui, _status } from "../../../noname.js";
const globalskills = {
    _yuanhang: {
        name: "远航", "prompt2": "当你有摸牌标记时,你失去手牌后能摸1张牌,然后失去1个摸牌标记,自己回合暂时+1标记上限并回满标记,标记上限x个,可在强化中提升X值。", intro: { marktext: "摸牌", content: function (player, mark) { ; var a = player.countMark('_yuanhang_mopai'); return '手牌较少时,失去手牌可以摸一张牌,还可以摸' + a + '次,其他角色回合开始时会回复一个标记'; }, },
        group: ["_yuanhang_mopai", "_yuanhang_kaishi", "_yuanhang_bingsimopai", "_yuanhang_dietogain"],
        mod: {
            maxHandcard: function (player, num) {
                if (lib.config.extension_舰R牌将__yuanhang === false) return num;
                var a = 0;
                //if (player.hasSkill('qianting')) { var a = a + 1 };
                if (player.hp < player.maxHp) { a += (1) };
                if (get.mode() == 'boss' && player.hp <= 0) { a += (1) };
                return (num + a);
            },
        },
        trigger: { global: "phaseBefore", player: "enterGame", },
        forced: true,
        priority: -1,
        filter: function (event, player) {
            if (lib.config.extension_舰R牌将__yuanhang === false) return false;
            return (event.name != 'phase' || game.phaseNumber == 0) && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));
        },
        content: function () {
            let mode = get.mode();
            if (player.identity == 'zhu' && mode === "identity") { player.changeHujia(1); };
        },
        intro: { content: function () { return get.translation('_yuanhang' + '_info'); }, },
        subSkill: {
            mopai: {
                name: "远航摸牌", frequent: true,
                trigger: { player: "loseAfter", global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"], },
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__yuanhang === false) return false;
                    var d = (player.getHandcardLimit() / 2);//, a = 0;
                    //if (player == _status.currentPhase) { a += (1) };
                    if (player.countCards('h') > d) return false;
                    var evt = event.getl(player);
                    if (!player.countMark('_yuanhang_mopai')) return false;
                    return evt && evt.player == player && evt.hs && evt.hs.length > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));
                },
                content: function () { player.draw(1); player.removeMark('_yuanhang_mopai'); },
                sub: true,
            },
            kaishi: {
                name: "远航回合开始时", fixed: true, silent: true,  frequent: true,
                trigger: {
                    player: "phaseBegin",
                },
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__yuanhang === false) return false;
                    return true;
                },
                content: function () {
                    //else if(!player.countMark('mopaiup')<1&&player.countCards('h','shan')<1){player.draw()}
                    var a = player.countMark('mopaiup'); var b = player.countMark('_yuanhang_mopai');
                    //game.log(event.skill != 'huijiahuihe');
                    if (player == _status.currentPhase && event.getParent('phase').skill != 'huijiahuihe') {
                        a += (1);
                        if (a - b > 0) player.addMark('_yuanhang_mopai', a - b);
                    };
                    /*if(a>b&&player!=_status.currentPhase){player.addMark('_yuanhang_mopai',1);};*/
                },//远航每回合恢复标记被砍掉了。现在只有每轮开始恢复标记。
                sub: true,
            },
            dietogain: {
                name: "远航死后给牌", trigger: { player: ["dieAfter"], },
                direct: true,
                forceDie: true,
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__yuanhang === false) return false;
                    if (event.name == 'die') return get.mode() === "identity" && player.identity === "zhong";
                    return player.isAlive() && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));
                },
                content: function () {
                    'step 0'
                    event.count = trigger.num || 1;
                    'step 1'
                    event.count--;//让优势方有一轮的挑战,因为第二轮对手就因为过牌量下降而失去威胁。
                    player.chooseTarget(get.prompt2('在离开战斗前,若你的身份：<br>是忠臣,你可令一名角色摸1张牌。<br>或许会有转机出现。'), function (card, player, target) { return target.maxHp > 0; }).set('ai', function (target) {
                        var att = get.attitude(_status.event.player, target); var draw = Math.max(3, player.maxHp + 1);
                        if (target == trigger.source) att *= 0.35; if (target.hasSkill('zhanliebb')) att *= 1.05;
                        return att
                    });
                    'step 2'
                    if (result.bool) {
                        var target = result.targets[0]; event.target = target; player.logSkill('_yuanhang_dietogain', target);
                        //if(target==trigger.source){target.draw(Math.max(1,player.maxHp))}else
                        if (player.identity == 'zhong') { target.draw(1); };
                        //if (player.identity == 'nei') { target.gain(game.createCard('shan'), 'gain2'); };
                        //if (player.identity == 'fan') { target.draw(1); };
                    } else event.finish();
                },
                sub: true,
            },
            bingsimopai: {
            name: "濒死摸牌",
            //usable: 2,
            fixed: true,
            mark: false,
            trigger: { player: "changeHp", },
            filter: function (event, player) {
                if (lib.config.extension_舰R牌将__yuanhang === false) return false;
                return player.hp <= 0 && event.num < 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));
            },
            "prompt2": function (event, player) {
                return '当你进入濒死状态时,你可以摸一张牌,<br>若血量上限大于2,你须失去一点体力上限,改为摸两张牌。'
            },
            content: function () {
                if (player.maxHp <= 2) {
                    player.draw(1);
                } else if (player.maxHp > 2) {
                    player.loseMaxHp(1);
                    player.draw(2);
                }
            },
            sub: true,
        },
        },
        
    },
    _jianzaochuan: {
        name: "建造",
        prompt: function (event, player) {
            if (event.parent.name == 'phaseUse') {
                return '1.出牌阶段,<br>你可以弃置3张不同花色的牌,提升一点血量上限与强化上限。';
            }
        },
        limited: false,
        complexCard: true,
        enable: "phaseUse",
        position: "hejs",
        filter: function (event, player) {
            if (lib.config.extension_舰R牌将__jianzaochuan === false) return false;
            // 获取当前强化信息
            var totalLevels = 0;
            var keys = ['mopaiup', 'jinengup', 'wuqiup', 'useshaup', 'jidongup', 'shoupaiup'];
            for (var i = 0; i < keys.length; i++) {
                totalLevels += player.countMark(keys[i]);
            }
            // 检查是否有进行过至少一次强化
            if (totalLevels === 0) return false;
            // 每局游戏限一次,且需要至少3张手牌或装备
            if (!player.hasMark('_jianzaochuan')) {
                return (player.countCards('hejs') >= 3);
            }

            return false;
        },
        selectCard: function (event, player) {
            return 3;
        },
        filterCard: function (card) {
            var suit = get.suit(card);
            for (var i = 0; i < ui.selected.cards.length; i++) {
                if (get.suit(ui.selected.cards[i]) == suit) return false;
            }
            return true;
        },
        check: function (card) {
            var player = get.player();
            var event = _status.event;
            var huifu = player.countCards('h', 'jiu') + player.countCards('h', 'tao');

            // 优先弃置价值较低的牌
            return 6 - get.value(card);
        },
        content: function () {
            'step 0'
            // 添加建造标记,增加1点建造等级
            var currentBuildLevel = player.countMark('_jianzaochuan') || 0;
            player.addMark('_jianzaochuan', 1);

            // 增加血量上限
            player.gainMaxHp(1);

            game.log(player, '发动了建造技能,提升1点血量上限和强化上限');

            'step 1'
            // 弃置卡牌
            if (event.cards && event.cards.length > 0) {
                player.discard(event.cards);
            }
        },
        ai: {
            save: true,
            expose: 0,
            threaten: 0,
            order: 2,
            result: {
                player: function (player) {
                    // 检查是否有进行过强化
                    var totalLevels = 0;
                    var keys = ['mopaiup', 'jinengup', 'wuqiup', 'useshaup', 'jidongup', 'shoupaiup'];
                    for (var i = 0; i < keys.length; i++) {
                        totalLevels += player.countMark(keys[i]);
                    }

                    // 没有强化过,则AI不会发动建造
                    if (totalLevels === 0) return 0;

                    // 检查是否有足够的牌
                    if (player.countCards('hejs') < 3) return 0;

                    // 计算收益
                    var benefit = 0;

                    // 血量上限提升的收益
                    if (player.hp < player.maxHp) benefit += 1.5;

                    // 强化上限提升的收益
                    var currentBuildLevel = player.countMark('_jianzaochuan') || 0;
                    if (currentBuildLevel === 0) benefit += 2.0; // 第一次建造收益最高

                    // 根据手牌质量调整
                    var cardValues = 0;
                    var handcards = player.getCards('h');
                    for (var i = 0; i < Math.min(handcards.length, 3); i++) {
                        cardValues += get.value(handcards[i]);
                    }

                    // 如果手牌质量较高,则发动意愿降低
                    if (cardValues > 15) benefit -= 0.5;
                    else if (cardValues < 10) benefit += 0.5;

                    return benefit;
                }
            }
        },
        mark: true,
        intro: {
            content: function () {
                return '已建造提升体力上限';
            }
        },
    },
    /* _jianzaochuan: {
        name: "建造",
        prompt: function (event, player) {//<br>或弃置三张牌,回复一点血量。或弃置四张牌,回复两点体力,两个改动的测试结果是过于强悍.
            if (event.parent.name == 'phaseUse') { return '1.出牌阶段,<br>你可以弃置3张不同花色的牌,提升一点血量上限。' }; //if (event.type == 'dying') { return "2.当你濒死时,<br>你可以弃置4张不同花色的牌,回复一点体力。" };
        }, limited: false, complexCard: true,
        enable: "chooseToUse", position: "hejs",
        filter: function (event, player) {
            if (lib.config.extension_舰R牌将__jianzaochuan === false) return false;
            if (lib.config.extension_舰R牌将__qianghuazhuang) {
                var info = lib.skill._qianghuazhuang.getInfo(player); var a = info[0] + info[1] + info[2] + info[3] + info[4] + info[5]
            } else { var a = 1 };
            if (event.parent.name == 'phaseUse' && (a) > 0 && !player.hasMark('_jianzaochuan')) { return (player.countCards('hejs') >= 2) && a && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai')); } return false;//没有建造标记时才能建造,即主动建造上限1次,
        },
        selectCard: function (event, player) {
            var event = _status.event;
            return [3, 3];
        },
        filterCard: function (card) {
            var suit = get.suit(card);
            for (var i = 0; i < ui.selected.cards.length; i++) {
                if (get.suit(ui.selected.cards[i]) == suit) return false;
            }
            return true;
        },
        check: function (card) {
            var player = get.player(); var event = _status.event; var huifu = player.countCards('h', 'jiu') + player.countCards('h', 'tao');
            if (player != event.dying && (player.hp < player.maxHp) && (player.countCards('h') > 4 || !player.hasMark('_jianzaochuan'))) return 11 - get.value(card);
            if (player.hp <= 0 && (huifu < (-player.hp + 1) || !player.hasMark('_jianzaochuan'))) return 15 - get.value(card);
        },
        content: function () {
            player.addMark('_jianzaochuan');
            //game.log(event.parent.name, event.cards);
            if (event.cards.length < 3) { player.gainMaxHp(1); }; if (event.cards.length > 2) { player.gainMaxHp(1); }; if (event.cards.length > 3) { player.recover(); };
        },
        ai: {
            save: true, expose: 0, threaten: 0, order: 2,
            result: {
                player: function (player) {
                    var huifu = player.countCards('h', 'jiu') + player.countCards('h', 'tao');
                    if (player.hp <= 0 && (huifu < (-player.hp + 1) || !player.hasMark('_jianzaochuan'))) return 6;
                    if ((player.hp < player.maxHp) && (player.countCards('h') > 4)) { return 6; };
                    return 0;
                },
            },
        },
        mark: false,
        intro: {
            content: function () { return get.translation('建造的次数,用于提升升级上限。'); },
        },
    }, */
    _qianghuazhuang: {
        name: "强化装备",
        prompt: "每回合限一次,你可以弃置最多四张牌（或使用存储的经验）获得强化点数。<br>每2点强化点数可升级一次技能,二级需要3点。<br>升级时可以选择多个不同技能,每个技能每回合只能升一次。<br><b>建造</b>后技能等级上限提升至2级。<br>未使用的点数会存储为经验供下次使用。",
        mark: true,
        discard: false, // 技能手动处理弃牌
        lose: false,
        intro: {
            marktext: "装备",
            content: function (storage, player) {
                var map = {
                    mopaiup: '用一摸一',
                    jinengup: '技能升级',
                    wuqiup: '出杀距离',
                    useshaup: '攻击次数',
                    jidongup: '被杀距离',
                    shoupaiup: '手牌上限',
                    Expup: '经验'
                };
                var str = '<div class="text center">';
                str += '<span class=greentext>' + map.mopaiup + ':' + player.countMark('mopaiup') + '<br>' +
                    map.jinengup + ':' + player.countMark('jinengup') + '</span><br>';
                str += '<span class=firetext>出杀距离:-' + player.countMark('wuqiup') + '<br>' +
                    map.useshaup + ':' + player.countMark('useshaup') + '</span><br>';
                str += '<span class=thundertext>被杀距离:+' + player.countMark('jidongup') + '<br>' +
                    map.shoupaiup + ':' + player.countMark('shoupaiup') + '<br>' +
                    map.Expup + ':' + player.countMark('Expup') + '</span>';
                str += '</div>';
                return str;
            }
        },
        mod: {
            attackFrom: function (from, to, distance) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === false) return distance;
                return distance - from.countMark('wuqiup');
            },
            attackTo: function (from, to, distance) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === false) return distance;
                return distance + to.countMark('jidongup');
            },
            cardUsable: function (card, player, num) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === false) return num;
                if (card.name == 'sha') return num + player.countMark('useshaup');
            },
            maxHandcard: function (player, num) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === false) return num;
                return num + player.countMark('shoupaiup');
            }
        },
        enable: "phaseUse",
        usable: 1,
        init: function (player) {
            // 移除 storage 初始化逻辑,直接操作 mark
            // 确保所有标记都有初始值（0）,避免 undefined
            var keys = ['mopaiup', 'jinengup', 'wuqiup', 'useshaup', 'jidongup', 'shoupaiup', 'Expup'];
            for (var key of keys) {
                if (player.countMark(key) === undefined) {
                    player.addMark(key, 0);
                }
            }
            // _jianzaochuan 单独处理
            if (player.countMark('_jianzaochuan') === undefined) {
                player.addMark('_jianzaochuan', 0);
            }
        },
        getInfo: function (player) {
            // 直接返回 mark 中的值,不再依赖 storage
            return {
                mopaiup: player.countMark('mopaiup'),
                jinengup: player.countMark('jinengup'),
                wuqiup: player.countMark('wuqiup'),
                useshaup: player.countMark('useshaup'),
                jidongup: player.countMark('jidongup'),
                shoupaiup: player.countMark('shoupaiup'),
                Expup: player.countMark('Expup'),
                _jianzaochuan: player.countMark('_jianzaochuan') || 0
            };
        },
        filter: function (event, player) {
            if (lib.config.extension_舰R牌将__qianghuazhuang === false) return false;
            if (player.hasSkill("guzhuyizhi2")) return false;

            var currentExp = player.countMark('Expup');
            var hasUpgrade = false;
            var keys = ['mopaiup', 'jinengup', 'wuqiup', 'useshaup', 'jidongup', 'shoupaiup'];
            var buildLevel = player.countMark('_jianzaochuan') + 1;

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var currentLv = player.countMark(key);
                if (currentLv < 2 && currentLv < buildLevel) {
                    hasUpgrade = true;
                    break;
                }
            }

            var maxCards = Math.min(player.countCards('h'), 4);
            if (maxCards + currentExp >= 2 && hasUpgrade) return true;

            return false;
        },
        filterCard: function (card) {
            return true;
        },
        position: "h",
        selectCard: function () {
            var player = get.player();
            var currentExp = player.countMark('Expup');
            var minCards = Math.max(0, 2 - currentExp);
            var maxCards = Math.min(4, player.countCards('h'));
            return [minCards, maxCards];
        },
        check: function (card) {
            var player = get.player();
            if (player.countCards("h") > player.maxHandcard) return 8.5 - get.value(card);
            return 6 - get.value(card);
        },
        content: function () {
            'step 0'
            var player = get.player(); // 补充缺失的 player 定义
            var currentExp = player.countMark('Expup');
            var gainedExp = event.cards ? event.cards.length : 0;
            var totalPoints = currentExp + gainedExp;

            // 关键修复：先将弃牌获得的经验加到标记上,这样客户端的 filterButton 就能通过 countMark 获取到正确的总点数
            if (gainedExp > 0) {
                player.addMark('Expup', gainedExp);
            }

            // 保存变量供后续步骤使用
            event.gainedExp = gainedExp;
            event.totalPoints = totalPoints;

            var buildLevel = player.countMark('_jianzaochuan') + 1;
            var upgradeConfig = [{
                mark: 'mopaiup',
                name: '后勤保障',
                desc: '用一摸一标记上限提升,手牌少于手牌上限一半时,失去手牌会摸一张牌。',
                cost: function (lv) {
                    return lv + 2;
                }
            },
            {
                mark: 'jinengup',
                name: '技能升级',
                desc: '强化各类技能效果（重巡-降低必中攻击限制(杀/黑牌/任意牌)、轻巡-增加无效群体锦囊牌范围(1/2/3)、航母-降低万箭齐发限制(黑桃与梅花/黑桃与梅花与红桃/任意牌);<br>战列舰-增加防护范围(普通杀造成的伤害/普通杀造成的伤害和火属性伤害/普通杀造成的伤害和属性伤害),导驱-增加射程(2/3/4)降低导弹条件（武器/装备/任意牌）、潜艇-降低雷杀条件(红桃/红桃或黑桃/红桃或黑桃或方块);<br>驱逐-增加回避概率(0.25/0.33/0.50)、军辅-增加存牌上限(1/2/3)、要塞-增加血量上限（0/1/2））。',
                cost: function (lv) {
                    return lv + 2;
                },
                ban: player.hasSkill("shixiangquanneng")
            },
            {
                mark: 'wuqiup',
                name: '射程升级',
                desc: '增加出杀攻击距离。',
                cost: function (lv) {
                    return lv + 2;
                }
            },
            {
                mark: 'useshaup',
                name: '速射炮管',
                desc: '增加出杀次数上限。',
                cost: function (lv) {
                    return lv + 2;
                }
            },
            {
                mark: 'jidongup',
                name: '改良推进器',
                desc: '增加防御距离（被杀距离）。',
                cost: function (lv) {
                    return lv + 2;
                }
            },
            {
                mark: 'shoupaiup',
                name: '物流运输',
                desc: '增加手牌上限。',
                cost: function (lv) {
                    return lv + 2;
                }
            }
            ];

            var choiceList = [];
            // 存储可用升级配置供服务端后续校验,注意这里不传给 filterButton
            event.upgradeConfigMap = {};

            for (var i = 0; i < upgradeConfig.length; i++) {
                var item = upgradeConfig[i];
                if (item.ban) continue;

                var currentLv = player.countMark(item.mark);
                var cost = item.cost(currentLv);

                event.upgradeConfigMap[item.mark] = item;

                if (currentLv < 2 && currentLv < buildLevel && totalPoints >= cost) {
                    choiceList.push([
                        item.mark,
                        item.name + ' (消耗' + cost + '点)<br>当前:' + currentLv + '→' + (currentLv + 1) + '级<br>' + item.desc
                    ]);
                }
            }

            choiceList.push(['store_only', '<b>仅存储经验</b><br>不进行任何升级,将所有' + totalPoints + '点存储为经验。']);
            event.choiceList = choiceList;

            if (choiceList.length <= 1) { // 只有存储选项
                game.log(player, '没有可升级的技能,存储了', totalPoints, '点经验');
                // 经验已经在上面 addMark 加上了,这里无需操作,直接结束
                return;
            }

            // 计算最多可选数量,用于 selectButton
            var maxSelectable = 0;
            var tempPoints = totalPoints;
            // 简易估算,假设最小消耗为2
            maxSelectable = Math.floor(tempPoints / 2);
            maxSelectable = Math.max(1, maxSelectable);

            player.chooseButton([
                '将手牌转化为强化点数强化以下能力；取消将返还卡牌,未使用完的点数将保留。<br>强化上限默认为1,发动建造技能后提高。<br>一级强化需要2点,二级强化需要3点强化点数。<br>鼠标滚轮或下拉查看所有选项。',
                [event.choiceList, 'textbutton'],
            ]).set('filterButton', function (button) {
                // --- 客户端安全代码区域 ---
                var player = _status.event.player;
                // 直接读取已同步的标记,获取真实总点数
                var totalPoints = player.countMark('Expup');
                var selectedButtons = ui.selected.buttons || [];
                var totalCost = 0;

                // 简易版 Cost 计算函数,不依赖外部闭包
                var getCost = function (mk) {
                    var lv = player.countMark(mk);
                    return lv + 2;
                };

                // 计算已选消耗
                for (var i = 0; i < selectedButtons.length; i++) {
                    var mark = selectedButtons[i].link || selectedButtons[i];
                    if (mark === 'store_only') continue;
                    totalCost += getCost(mark);
                }

                // 逻辑处理
                var currentLink = button.link;

                // 互斥逻辑
                if (currentLink === 'store_only') {
                    for (var i = 0; i < selectedButtons.length; i++) {
                        if ((selectedButtons[i].link || selectedButtons[i]) !== 'store_only') return false;
                    }
                    return true;
                }
                for (var i = 0; i < selectedButtons.length; i++) {
                    if ((selectedButtons[i].link || selectedButtons[i]) === 'store_only') return false;
                }

                // 允许取消勾选
                for (var i = 0; i < selectedButtons.length; i++) {
                    if ((selectedButtons[i].link || selectedButtons[i]) === currentLink) return true;
                }

                // 检查余额
                if (totalCost + getCost(currentLink) <= totalPoints) {
                    return true;
                }
                return false;

            }).set('ai', function (button) {
                var choice = button.link;
                var player = _status.event.player;

                // 仅存储选项默认最低优先级
                if (choice === 'store_only') return 0.1;

                // === 第一步：评估当前风险分（生存威胁） ===
                var riskScore = 0;
                var hp = player.hp;
                var maxHp = player.maxHp;
                var handCards = player.countCards('h');
                var shanCount = player.countCards('h', 'shan');

                // 血量风险
                if (hp <= 1) riskScore += 0.6;
                else if (hp <= 2) riskScore += 0.3;
                else if (hp <= maxHp / 2) riskScore += 0.15;

                // 敌方集火压力
                var enemiesInRange = game.countPlayer(function (current) {
                    return current != player && get.attitude(player, current) < 0 && current.inRange(player);
                });
                riskScore += Math.min(0.3, enemiesInRange * 0.1);

                // 缺少防御牌
                if (shanCount === 0 && hp <= 2) riskScore += 0.2;

                // === 第二步：评估各选项的基础收益 ===
                var baseScore = 0;
                var currentLv = player.countMark(choice);

                switch (choice) {
                    case 'mopaiup':
                        // 后勤保障：手牌紧缺时价值高
                        baseScore = 3.5;
                        if (handCards <= player.getHandcardLimit() / 2) baseScore += 1.5;
                        if (handCards <= 2) baseScore += 1.0;
                        break;

                    case 'jinengup':
                        // 技能升级：质变收益极高
                        baseScore = 4.0;

                        // 重巡：0→1级质变（黑牌必中）
                        if (player.hasSkill('zhongxunca') && currentLv === 0) {
                            var blackCards = player.countCards('h', function (card) {
                                return get.color(card) === 'black' && get.type(card) !== 'basic';
                            });
                            if (blackCards > 0) baseScore += 2.5; // 有黑锦囊，质变收益拉满
                        }

                        // 驱逐：1→2级质变（0.33→0.50闪避）
                        if (player.hasSkill('quzhudd') && currentLv === 1) {
                            baseScore += 2.0; // 闪避提升显著
                        }

                        // 战列：对抗火属性伤害
                        if (player.hasSkill('zhanliebb')) {
                            var fireEnemies = game.countPlayer(function (current) {
                                return get.attitude(player, current) < 0 &&
                                       (current.hasSkill('huogong') || current.countCards('h', {nature: 'fire'}) > 0);
                            });
                            if (fireEnemies > 0 && currentLv === 1) baseScore += 1.5;
                        }

                        // 轻巡：对抗AOE
                        if (player.hasSkill('qingxuncl')) {
                            var aoeEnemies = game.countPlayer(function (current) {
                                return get.attitude(player, current) < 0 &&
                                       current.countCards('h', function (card) {
                                           return ['nanman', 'wanjian', 'taoyuan'].includes(card.name);
                                       }) > 0;
                            });
                            if (aoeEnemies > 0) baseScore += 1.5;
                        }

                        // 要塞：升级即回血+加血量上限
                        if (player.hasSkill('yaosai') && hp < maxHp) {
                            baseScore += 3.0; // 即时回血价值极高
                        }
                        break;

                    case 'wuqiup':
                        // 射程升级：打不到人时价值高
                        baseScore = 2.5;
                        var unreachableEnemies = game.countPlayer(function (current) {
                            return current != player && get.attitude(player, current) < 0 && !player.inRange(current);
                        });
                        if (unreachableEnemies > 0) baseScore += unreachableEnemies * 0.8;
                        break;

                    case 'useshaup':
                        // 速射炮管：有多张杀时价值高
                        baseScore = 2.0;
                        var shaCount = player.countCards('h', 'sha');
                        if (shaCount > 1) baseScore += shaCount * 0.5;

                        // 输出型武将优先级更高
                        if (player.hasSkill('zhongxunca') || player.hasSkill('hangmucv')) {
                            baseScore += 1.0;
                        }
                        break;

                    case 'jidongup':
                        // 改良推进器：被贴脸时价值高
                        baseScore = 2.0;
                        if (enemiesInRange > 0) baseScore += enemiesInRange * 0.6;

                        // 脆皮输出更需要防御距离
                        if ((player.hasSkill('zhongxunca') || player.hasSkill('hangmucv')) && hp <= 2) {
                            baseScore += 1.5;
                        }
                        break;

                    case 'shoupaiup':
                        // 物流运输：手牌溢出时价值高
                        baseScore = 1.5;
                        var handcardLimit = player.getHandcardLimit();
                        if (handCards >= handcardLimit) baseScore += 2.0; // 溢出，急需
                        else if (handCards >= handcardLimit - 1) baseScore += 1.0;
                        break;
                }

                // === 第三步：根据风险分调整优先级 ===
                var finalScore = baseScore;

                if (riskScore > 0.5) {
                    // 高风险：优先防御选项
                    if (['jidongup', 'shoupaiup'].includes(choice)) {
                        finalScore += 2.0;
                    }
                    // 要塞技能在残血时优先级拉满
                    if (choice === 'jinengup' && player.hasSkill('yaosai') && hp <= 2) {
                        finalScore += 3.0;
                    }
                    // 降低纯输出选项优先级
                    if (['wuqiup', 'useshaup'].includes(choice)) {
                        finalScore -= 1.5;
                    }
                } else {
                    // 低风险：突出特长
                    // 质变技能优先级拉满
                    if (choice === 'jinengup' && currentLv === 0) {
                        finalScore += 2.0;
                    }
                    // 输出选项适当提升
                    if (['wuqiup', 'useshaup'].includes(choice)) {
                        finalScore += 0.5;
                    }
                }

                // === 第四步：团队需求调整 ===
                var teamHasDamage = game.hasPlayer(function (current) {
                    return current != player && get.attitude(player, current) > 0 &&
                           (current.hasSkill('zhongxunca') || current.hasSkill('hangmucv'));
                });

                // 防御型武将，但团队缺输出
                if ((player.hasSkill('zhanliebb') || player.hasSkill('yaosai')) && !teamHasDamage) {
                    if (['wuqiup', 'useshaup'].includes(choice)) {
                        finalScore += 1.5; // 弥补短板
                    }
                }

                // === 第五步：避免重复升级已满级的选项 ===
                var buildLevel = player.countMark('_jianzaochuan') + 1;
                if (currentLv >= buildLevel || currentLv >= 2) {
                    return 0; // 已满级，不可选
                }

                return finalScore;
            }).set('selectButton', [0, maxSelectable]);

            'step 1'
            var selected = [];
            if (result && result.bool && result.links) {
                selected = result.links;
            } else {
                // 玩家点击了取消
                // 还原状态：扣除掉刚才临时加上的 gainedExp
                if (event.gainedExp > 0) {
                    player.removeMark('Expup', event.gainedExp);
                }
                game.log(player, '取消了强化,返还了经验和卡牌');
                return;
            }

            // 处理弃牌（如果不取消,牌就真的弃掉了）
            if (event.gainedExp > 0) {
                player.discard(event.cards);
            }

            if (selected.includes('store_only')) {
                game.log(player, '存储了', event.totalPoints, '点经验');
                // Expup 已经是满的,无需操作
            } else {
                var usedPoints = 0;
                var upgraded = [];

                for (var i = 0; i < selected.length; i++) {
                    var mark = selected[i];
                    var item = event.upgradeConfigMap[mark];

                    if (item) {
                        // 服务端再次校验消耗
                        var currentLv = player.countMark(mark);
                        var cost = item.cost(currentLv);

                        if (event.totalPoints - usedPoints >= cost) {
                            player.addMark(mark, 1);
                            usedPoints += cost;
                            upgraded.push(item.name);
                            game.log(player, '强化了', item.name, '（消耗', cost, '点）');
                        }
                    }
                }

                // 扣除已消耗的点数
                // 当前 player 身上的 Expup 是 totalPoints,需要减去 usedPoints
                if (usedPoints > 0) {
                    player.removeMark('Expup', usedPoints);
                }

                var remainingPoints = event.totalPoints - usedPoints;
                if (remainingPoints > 0 && upgraded.length > 0) {
                    game.log(player, '剩余', remainingPoints, '点存储为经验');
                }
            }

            // 移除 storage 更新逻辑,所有数据已通过 mark 存储
        },
        ai: {
            order: 3,
            result: {
                player: function (player) {
                    var currentExp = player.countMark('Expup');
                    var handcards = player.countCards('h');
                    var maxCards = Math.min(handcards, 4);

                    if (currentExp + maxCards >= 2) {
                        var buildLevel = player.countMark('_jianzaochuan') + 1;
                        var keys = ['mopaiup', 'jinengup', 'wuqiup', 'useshaup', 'jidongup', 'shoupaiup'];
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i];
                            var currentLv = player.countMark(key);
                            if (currentLv < 2 && currentLv < buildLevel) {
                                return 1.5;
                            }
                        }
                        return 0.3;
                    }
                    return 0;
                }
            }
        }
    },
    /* _qianghuazhuang: { //2026.2.6,强化装备代码结构重置,原手工诗山代码转为注释保存
        name: "强化装备",
         prompt: "每回合限一次,你可以弃置二至四张牌,将手牌转化为强化点数,<br>每2点强化点数换一级永久的效果升级。二级需要3点。<br>（可选择如减少技能消耗、增加武器攻击距离、提高手牌上限等）<br>建造前强化上限一级,建造后强化上限2级。<br>已存储的经验会降低弃牌最低牌数", mark: true, intro: {
            marktext: "装备", content: function (storage, player) {//只有content与mark可以function吧,内容,介绍的文字与内容。
                var info = lib.skill._qianghuazhuang.getInfo(player);
                return '<div class="text center"><span class=greentext>用一摸一:' + info[0] + '<br>技能耗牌：' + info[1] + '</span><br><span class=firetext>出杀距离：-' + info[2] + '<br>攻击次数:' + info[3] + '</span><br><span class=thundertext>被杀距离：+' + info[4] + '<br>手牌上限:' + info[5] + '<br>Exp:' + info[7] + '</span></div>';
            },
        },
        mod: {
            attackFrom: function (from, to, distance) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === false) return distance;
                var a = 0; if (from.countMark('wuqiup')) { var a = a + from.countMark('wuqiup') }; return distance - a;
            },
            attackTo: function (from, to, distance) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === false) return distance;
                var a = 0; if (to.countMark('jidongup')) { var a = a + to.countMark('jidongup') }; return distance + a;
            },
            cardUsable: function (card, player, num) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === false) return num;
                var a = 0; if (card.name == 'sha') return num + player.countMark('useshaup');
            },
            maxHandcard: function (player, num) {
                if (lib.config.extension_舰R牌将__qianghuazhuang === false) return num;
                var a = 0; if (player.countMark('shoupaiup')) { var a = a + player.countMark('shoupaiup') }; return num + a;
            },
        },
        enable: "phaseUse",
        usable: 1,
        init: function (player) {//初始化数组,也可以运行事件再加if后面的内容
            if (!player.storage._qianghuazhuang) player.storage._qianghuazhuang = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        },
        getInfo: function (player) {//让其他技能可以更简单的获取该技能的数组。
            if (!player.storage._qianghuazhuang) player.storage._qianghuazhuang = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            return player.storage._qianghuazhuang;
        },
        filter: function (event, player) {
            if (lib.config.extension_舰R牌将__qianghuazhuang === false) return false;
            if (player.hasSkill("guzhuyizhi2")) { return 0; }//孤注一掷发动后禁用强化。
            var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, lv = 0;
            lv = k * 6;//远航上限降低为2,总可用强化数量公式作相应修改
            if (player.countCards('h') > 0) { if ((a + b + c + d + e + f + g) >= (lv)) return false };
            return player.countCards('h') > 1 || player.countMark('Expup') > 1;
            //比较保守的设计,便于设计与更改。
            ;
        },
        filterCard: {}, position: "h", selectCard: function (card) {
            var player = get.player(), num = 0;
            num += (player.countMark('Expup'));
            //if(ui.selected.cards.length&&get.type(ui.selected.cards[0],'equip')=='equip'){num+=(1)};if(ui.selected.cards.length>1&&get.type(ui.selected.cards[1],'equip')=='equip'){num+=(1)};//装备不再记为2强化点数
            return [Math.max(2 - num, 0), Math.max(4 - num, 2)];
        },
        discard: false,
        lose: false,
        check: function (card) {//ui,参考仁德,ai执行判断,卡牌价值大于1就执行（只管卡片）当然,能把玩家设置进来就可以if玩家没桃 return-1。
            var player = get.player();
            //if (ui.selected.cards.length && get.type(ui.selected.cards[0], 'equip') == 'equip') return 5 - get.value(card);
            //if (ui.selected.cards.length >= Math.max(1, player.countCards('h') / 2)) return 0;
            //if (game.phaseNumber < 3) return 7 - get.value(card);
            if (player.countCards("h") > player.maxHandcard) return 9 - get.value(card);
            return 7 - get.value(card);
        },
        content: function () {//choiceList.unshift
            'step 0'
            var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1;
            player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h, k];
            event.exp1 = cards.length;
            var choiceList = [];
            var list = [];
            //game.log(cards);
            event.cao = cards;
            //game.log(event.cao);
            var jieshao = ['后勤保障：上限+' + (a + 1) + '→' + (a + 2) + '远航（用一摸一）标记上限,<br>手牌少于手牌上限1/2时,失去手牌会摸一张牌。防守反击的保障<br>每轮上限1/2/3,在自己的回合重置使用次数。', '技能升级：+' + (b) + '→' + (b + 1) + ',重巡-降低必中攻击限制(杀/黑牌/任意牌)、轻巡-增加无效群体锦囊牌范围(1/2/3)、航母-降低万箭齐发限制(黑桃与梅花/黑桃与梅花与红桃/任意牌);<br>战列舰-增加防护范围(杀造成的伤害/杀和锦囊牌造成的伤害/所有伤害),导驱-增加射程(2/3/4)降低导弹条件（武器/装备/任意牌）、潜艇-降低雷杀条件(红桃/红桃或黑桃/红桃或黑桃或方块);<br>驱逐-增加回避概率(0.25/0.50/0.75)、军辅-增加存牌上限(1/2/3)、要塞-增加血量上限（0/1/2）。', '射程升级：+' + c + '→' + (c + 1) + '武器（出杀）攻击距离,<br>增加出杀攻击范围,虽然不增加锦囊牌距离,但胜在永久', '速射炮管：+' + d + '→' + (d + 1) + '出杀次数,<br>作为连弩的临时替代,进行多刀输出。', '改良推进器：+' + e + '→' + (e + 1) + '武器（被杀）防御距离<br>对手有更远的出杀范围才能对你出杀时,但不能防御锦囊牌。', '物流运输：+' + f + '→' + (f + 1) + '手牌上限,且蝶舞递装备给杀的距离提升,<br>双方状态差距越大,保牌效果越强。', '经验：+' + h + '→' + event.exp1 + ',将卡牌转为经验,供下次升级。（直接点确定也行）<br>1级技能需要两张牌才能强化,2级技能需要三张牌才能强化。<br>但无名杀不能读取这个界面的文本,导致四点经验即可强化两个不同等级技能']//player.getEquip(1),定义空数组,push填充它,事件变量可以自定义名字,什么都可以存。game.log('已强化:',a+b+c+d);
            var info = lib.skill._qianghuazhuang.getInfo(player);
            //game.log(info);
            if (info[0] < k && (info[0] + 2 <= info[6] + event.exp1) && info[0] <= 2) {
                list.push('mopaiup');
                choiceList.push(['mopaiup', jieshao[0]]);
            };
            if (info[1] < k && (info[1] + 2 <= info[6] + event.exp1) && info[1] <= 2 && !player.hasSkill("shixiangquanneng")) {
                list.push('jinengup');
                choiceList.push(['jinengup', jieshao[1]]);
            };
            if (info[2] < k && (info[2] + 2 <= info[6] + event.exp1) && info[2] <= 2) {
                list.push('wuqiup');
                choiceList.push(['wuqiup', jieshao[2]]);
            };//若此值：你强化的比目标多时,+1含锦囊牌防御距离。
            if (info[3] < k && (info[3] + 2 <= info[6] + event.exp1) && info[3] <= 2) {
                list.push('useshaup');
                choiceList.push(['useshaup', jieshao[3]]);
            };
            if (info[4] < k && (info[4] + 2 <= info[6] + event.exp1) && info[4] <= 2) {
                list.push('jidongup');
                choiceList.push(['jidongup', jieshao[4]]);
            };
            if (info[5] < k && (info[5] + 2 <= info[6] + event.exp1) && info[5] <= 2) {
                list.push('shoupaiup');
                choiceList.push(['shoupaiup', jieshao[5]]);
            };
            //      if(info[6]<k&&(info[0]+2<=info[7])&&info[6]<2){event.list.push('songpaiup');
            //  event.choiceList.push('+'+g+'→'+(g+1)+'给牌次数,<br>提升“先进雷达”技能的送牌范围。');};
            if (info[6] <= k && info[6] < 6) {
                list.push('Expup');
                choiceList.push(['Expup', jieshao[6]]);
            };
            //game.log(choiceList);
            event.first = true;    //存了6个变量,可以导出为button,与textbutton样式,看需求
            var xuanze = Math.max(Math.floor((event.cao.length + info[6]) / 2), 1);
            //game.log("xuanze" + xuanze);
            player.chooseButton([
                '将手牌转化为强化点数强化以下能力；取消将返还卡牌,未使用完的点数将保留。<br>强化上限默认为1,发动建造技能后提高。<br>一级强化需要2点,二级强化需要3点强化点数。<br>鼠标滚轮或下拉查看所有选项。',
                [choiceList, 'textbutton'],
            ]).set('filterButton', button => {
                var event = _status.event;
                if (ui.selected.buttons) {//for(var i=0;i<event.cao.length;i+=(1)){};测试失败的函数组合game.log(ui.selected.buttons,get.selectableButtons().includes(ui.selected.buttons),get.selectableButtons());游戏无名杀Button的限制,这个代码并没有起到实时计算的作用。
                    return true; //return xuanze >= player.countMark(ui.selected.buttons[0]) * 0.5 + 1;
                }
            }).set('ai', function (button) {
                var haode = [jieshao[0], jieshao[1]];
                var yingji = [];
                var tunpai = [jieshao[5]];//其实一个例子就行,不如直接if(){return 2;};
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
            'step 1'
            //game.log(result.links, result.bool)//只能返还这两个,所以更适合技能,更需要循环的方式进行计算。
            if (!result.bool) {
                event.exp1 = 0;
                event.finish();
            };//取消强化
            if (result.bool) {  //player.addMark('Expup',event.cadechangdu);//先给经验再计算扣除经验升级,随着此项目的升级,花费也越多。通过一个有序的清单,遍历比对返回的内容,来定位要增加的标记/数组。
                player.addMark('Expup', event.exp1);
                event.exp1 = 0;
                for (var i = 0; i < result.links.length; i += (1)) {
                    if (!result.links.includes('Expup')) {
                        player.addMark(result.links[i], 1);
                        player.removeMark('Expup', 1 + player.countMark(result.links[i]));
                        //game.log('数组识别:', result.links[i], '编号', i, ',总编号', result.links.length - 1); 
                    }
                }
                player.discard(event.cao);
            };//从0开始,当介绍数组有内容==选项数组的内容（第i个）,就加的简称数组第i个(内容)标签。并通过game.log()调试,在出牌记录中查看执行效果。result.links.includes(event.list[i])&&
            'step 2'
            var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1;
            //game.log('结束', a, b, c, d, e, f, g, h, k);
            player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h];
        },
        ai: {
            order: function (player) {
                var player = get.player();
                if (player.countMark('_jianzaochuan') < 3) { return 7 };
                return 1;
            },
            threaten: 0,
            result: {
                player: function (player) {
                    var player = get.player();
                    var num = player.countCards('h', { name: 'shan' }) - 1;
                    return num;
                },
            },
        },//装备上装备以后,ai剩下的装备可以考虑强化,应该会保留防具吧。
    }, */
    _wulidebuff: {
        mod: {
            maxHandcard: function (player, num) {//手牌上限
                if (lib.config.extension_舰R牌将__wulidebuff === false) return num;
                if (player.hasMark('_wulidebuff_jinshui')) {
                    num -= 1;
                    return num;
                };
                return num;

            },
            globalTo: function (from, to, distance) {
                if (lib.config.extension_舰R牌将__wulidebuff === false) return distance;
                if (to.hasMark('_wulidebuff_jiansu')) {
                    distance -= 1;
                    return distance
                };
                return distance;

            },
        },
        name: "属性效果", lastDo: true, forced: true, trigger: { source: "damageBefore", },
        filter: function (event, player) {
            if (lib.config.extension_舰R牌将__wulidebuff === false) return false;
            if ((event.nature && player != event.player) && event.num > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai')))
                return true
        },
        content: function () {
            var link = (game.hasPlayer(function (current) { return get.attitude(player, current) < 0 && current == trigger.player && current.isLinked(); }) - game.hasPlayer(function (current) { return get.attitude(player, current) > 0 && current == trigger.player && current.isLinked(); }));
            if (trigger.nature == 'fire') {
                {
                    if (trigger.player.hasSkill('_wulidebuff_ranshao')) { trigger.player.addSkill('_wulidebuff_ranshao'); }
                    trigger.player.addMark('_wulidebuff_ranshao', 1);
                    game.log(get.translation(player.name) + '<span class=firetext>燃烧</span>' + get.translation(trigger.player.name) + '<span class=thundertext>,ta还能坚持到出完牌');
                };
                if (trigger.player.hp * 2 < trigger.player.maxHp) { player.$throwEmotion(trigger.player, 'yanhua') };
            };


            if (trigger.nature == 'ice' || (player.hasSkill('hanbing_skill') && trigger.nature == 'thunder')) {
                if (trigger.player.hasSkill('_wulidebuff_jiansu')) { trigger.player.addSkill('_wulidebuff_jiansu'); }
                trigger.player.addMark('_wulidebuff_jiansu');
                if (trigger.player.hujia > 0) {
                    trigger.num += (1);
                    game.log('冰杀/寒冰剑雷杀对护甲加伤' + 1)
                };
                game.log(get.translation(player.name) + '<span class=thundertext>减速了:</span>' + get.translation(trigger.player.name) + '小心随之而来的集火');
                if (trigger.player.hp * 2 < trigger.player.maxHp) { player.$throwEmotion(trigger.player, 'wine') };
            };

            if (trigger.nature == 'thunder' && !player.hasSkill('hanbing_skill')) {
                if (trigger.player.hasSkill('_wulidebuff_jinshui')) { trigger.player.addSkill('_wulidebuff_jinshui'); }
                trigger.player.addMark('_wulidebuff_jinshui', 1);
                if ((trigger.player.hujia > 0 || trigger.player.hasSkillTag('maixie_defend')) && (!trigger.player.isLinked() || (trigger.player.isLinked() && link < 2 || trigger.num < 2))) {
                    var loseNum = trigger.num;
                    trigger.player.loseHp(loseNum);
                    game.log('雷杀穿透护甲:', loseNum);

                    // 将体力流失计入伤害来源的造成伤害统计
                    if (player) {
                        var sourceStat = player.getStat();
                        if (!sourceStat.damage) sourceStat.damage = 0;
                        sourceStat.damage += loseNum;
                    }

                    // 将体力流失计入承受者的受伤统计
                    var targetStat = trigger.player.getStat();
                    if (!targetStat.damaged) targetStat.damaged = 0;
                    targetStat.damaged += loseNum;

                    trigger.num -= (trigger.num);
                    //trigger.cancel;
                };
                game.log(get.translation(player.name) + '让:' + get.translation(trigger.player.name) + '进水减手牌上限了');
                if (trigger.player.hp * 2 < trigger.player.maxHp) { player.$throwEmotion(trigger.player, 'hehua') };
            };
            trigger.player.updateMarks();
        },
        subSkill: {
            jiansu: {
                name: "减速",
                intro: {
                    marktext: "减速",
                    content: function (storage, player) {
                        return ('减少1点与其他角色的防御距离,令舰船更容易被对手集火,雷杀的效果,不叠加计算');
                    },
                },
                priority: 3, forced: true, trigger: {
                    player: ["phaseJieshuBegin", "dying"],

                },
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__wulidebuff === false) return false;
                    return player.hasMark('_wulidebuff_jiansu');

                },
                content: function () {
                    player.removeMark('_wulidebuff_jiansu', player.countMark('_wulidebuff_jiansu'));
                    if (player.hasSkill('_wulidebuff_jiansu')) {
                        player.removeSkill('_wulidebuff_jiansu');

                    };
                }, sub: true,
            },
            jinshui: {

                name: "进水",
                intro: {
                    marktext: "进水",
                    content: function (storage, player) {
                        return ('减少1点手牌上限,在结束阶段会恢复,冰杀与袭击运输船的效果,不叠加计算也很可怕了');
                    },
                },
                priority: 2,
                forced: true,
                trigger: {
                    player: ["phaseJieshuBegin", "dying"],
                },
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__wulidebuff === false) return false;
                    return player.hasMark('_wulidebuff_jinshui');
                },
                content: function () {
                    player.removeMark('_wulidebuff_jinshui', player.countMark('_wulidebuff_jinshui'));
                    if (player.hasSkill('_wulidebuff_jinshui')) {
                        player.removeSkill('_wulidebuff_jinshui');
                    };
                },
                sub: true,
            },
            ranshao: {
                name: "燃烧",
                forced: true,
                priority: 1,
                trigger: {
                    player: ["phaseJieshuBegin", "dying"],
                },
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__wulidebuff === false) return false;
                    return player.hasMark('_wulidebuff_ranshao')
                },
                content: function () {

                    if (event.triggername != 'dying') {
                        if (player.hujia == 0) {
                            player.draw(2);

                        } else {
                            player.draw(1);
                        }
                        player.damage(1, 'fire', "nosource");
                    };
                    player.removeMark('_wulidebuff_ranshao', player.countMark('_wulidebuff_ranshao'));
                    player.removeSkill('_wulidebuff_ranshao');
                },
                intro: {
                    marktext: "燃烧", content: function (storage, player) {//+player.countMark('_wulidebuff_ranshao')+'次,'+tishi
                        var player = get.player(); var tishi = '回合结束受到一点火焰伤害,摸两张牌（有护甲则不会触发摸牌）,火杀带来的负面效果,本回合被攻击了' + player.countMark('_wulidebuff_ranshao') + '次,'; if (player.countMark('_wulidebuff_ranshao') > 0 && player.hp <= 2) { tishi += ('可能小命不保,求求队友给点力,发挥抽卡游戏的玄学力量。”') }; if (player.countMark('_wulidebuff_ranshao') > 2 && player.hp <= 2) { tishi += ('“被集火了,希望队友能能继续扛起重任。') }; if (player.identity == 'nei') { tishi += ('为了自己的光辉岁月,我内奸一定能苟住,一定要苟住') }; if (player.identity == 'zhu') { tishi += ('我的生命在燃烧,') }; if (player.identity == 'zho') { tishi += ('同志,救我,我被火力压制了。') }; if (player.identity == 'fan') { tishi += ('就怕火攻一大片啊,我们的大好前程被火杀打到功亏一篑') };
                        return tishi;
                    },
                }, sub: true,
                ai: {
                    effect: {
                        player: function (card, player) {
                            var a = game.countPlayer(function (current) {
                                return current != player && (!get.attitude(player, current) < 0 && (player.hasSkill('zhongxunca') || player.hasSkill('qingxun')));

                            });
                            if (card.name == 'tengjia') {
                                var equip1 = player.getEquip(1); if (a > 0 || player.hasSkill('_wulidebuff_ranshao')) { return -10; };
                                if (a > 0) return -1;
                            }
                        },
                    },
                },
            },
        },
        intro: { content: function () { return "属性效果"; }, },
    },
    hanbing_skill: {//寒冰剑技能添加config控制,同名覆盖标包寒冰剑技能
        equipSkill: true,
        trigger: { source: "damageBegin2" },
        //direct:true,
        audio: true,
        filter: function (event) {
            if (lib.config.extension_舰R牌将__hanbing_gai === true) return false;
            return (
                event.card &&
                event.card.name == "sha" &&
                event.notLink() &&
                event.player.getCards("he").length > 0
            );
        },
        //priority:1,
        check: function (event, player) {
            var target = event.player;
            var eff = get.damageEffect(target, player, player, event.nature);
            if (get.attitude(player, target) > 0) {
                if (eff >= 0) return false;
                return true;
            }
            if (eff <= 0) return true;
            if (target.hp == 1) return false;
            if (
                event.num > 1 ||
                player.hasSkill("tianxianjiu") ||
                player.hasSkill("luoyi2") ||
                player.hasSkill("reluoyi2")
            )
                return false;
            if (target.countCards("he") < 2) return false;
            var num = 0;
            var cards = target.getCards("he");
            for (var i = 0; i < cards.length; i++) {
                if (get.value(cards[i]) > 6) num++;
            }
            if (num >= 2) return true;
            return false;
        },
        logTarget: "player",
        content: function () {
            "step 0";
            trigger.cancel();
            "step 1";
            if (trigger.player.countDiscardableCards(player, "he")) {
                player.line(trigger.player);
                player.discardPlayerCard("he", trigger.player, true);
            }
            "step 2";
            if (trigger.player.countDiscardableCards(player, "he")) {
                player.line(trigger.player);
                player.discardPlayerCard("he", trigger.player, true);
            }
        },
    },
    _hanbing_gai: {
        inherit: "hanbing_skill",
        trigger: { source: "damageBegin2", },
        equipSkill: false, ruleSkill: true, firstDo: true,
        filter: function (event, player) {//||player.hasSkill('hanbing_gai')
            if (lib.config.extension_舰R牌将__hanbing_gai === false) return false;
            return (event.nature == 'ice' || player.hasSkill('hanbing_skill') && event.card && event.card.name == 'sha') && event.notLink() && event.player.getCards('he').length > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));
        },
        audio: "ext:舰R牌将/audio/skill:true",
        check: function (event, player) {
            var target = event.player;
            var eff = get.damageEffect(target, player, player, event.nature);
            if (get.attitude(player, target) > 0) {
                if (eff >= 0) return false;
                return true;
            }
            if (eff <= 0) return true;
            if (target.hp >= 2 && target.countCards('he') >= 2 && player.hasSkill('yunqingleng') && player.getHistory('useCard', function (evt) {
                return evt.card.name == 'jiu'
            }).length <= 0) return true;
            if (target.hp == 1) return false;
            if (player.getHistory('useCard', function (evt) {
                return evt.card.name == 'jiu'
            }).length >= 1) return false;
            if (event.num > 1 || player.hasSkill('tianxianjiu') ||
                player.hasSkill('luoyi2') || player.hasSkill('reluoyi2')) return false;
            if (target.countCards('he') < 2) return false;
            var num = 0;
            var cards = target.getCards('he');
            for (var i = 0; i < cards.length; i++) {
                if (get.value(cards[i]) >= 6) num++;
            }
            if (num >= 3 && player.getHistory('useCard', function (evt) {
                return evt.card.name == 'jiu'
            }).length <= 0) return true;
            if (num >= 2 && target.hasSkillTag("maixie") && player.getHistory('useCard', function (evt) {
                return evt.card.name == 'jiu'
            }).length <= 0) return true;
            if (num >= 2 && player.hasSkill('yunqingleng') && player.getHistory('useCard', function (evt) {
                return evt.card.name == 'jiu'
            }).length <= 0) return true;
            return false;
        },
        logTarget: "player",
        content: function () {
            "step 0"
            event.num1 = trigger.num * 2;
            //game.log(trigger.num, event.num1)
            trigger.cancel();
            "step 1"
            if (trigger.player.countDiscardableCards(player, 'he')) {
                player.line(trigger.player);
                player.discardPlayerCard('he', trigger.player, true); player.addMark('_hanbing_gai');
            } else {
                var a = Math.floor((event.num1 - player.countMark('_hanbing_gai')) / 2);
                //game.log(event.num1, Math.floor((event.num1 - player.countMark('_hanbing_gai')) / 2));
                player.removeMark('_hanbing_gai', player.countMark('_hanbing_gai')); trigger.player.damage(a); event.finish();
            };
            "step 2"
            if (player.countMark('_hanbing_gai') < event.num1 && player.countMark('_hanbing_gai')) { event.goto(1) } else {
                player.removeMark('_hanbing_gai', player.countMark('_hanbing_gai'));
            };
        },
        intro: { content: function () { return get.translation('__hanbing_gai' + '_info'); }, },
    },
    _tiaozhanbiaojiang: {
        superCharlotte: true, usable: 1, silent: true,
        trigger: { global: "gameStart", },
        filter: function (event, player) {
            if (lib.config.extension_舰R牌将__tiaozhanbiaojiang === false) return false;
            return true;
        },
        content: function () {
            if (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai') {
                if (!player.hasSkill('gzbuqu')) {
                    //game.log(player.identity)
                    player.addSkill('gzbuqu');
                    player.addSkill('tiaozhanzhuangbei');
                    player.useSkill('tiaozhanzhuangbei');
                    player.loseHp(player.hp - 1); player.draw(player.hp * 2 - 1);
                };
            };
        },
    },
    tiaozhanzhuangbei: {
        trigger: {
            global: "phaseBefore",
            player: "enterGame",
        },
        forced: true,
        firstDo: true,
        filter: function (event, player) {//"huijiahuihe",
            if (lib.config.extension_舰R牌将__tiaozhanbiaojiang === false) return false;
            return (event.name != 'phase' || game.phaseNumber == 0) && get.mode() == 'boss';
        },
        content: function () {
            if (player.hasSkill('qianting')) { player.equip(game.createCard2('yuleiqianting3', 'club', 1)); player.equip(game.createCard2('xingyun', 'club', 1)); }
            if (player.hasSkill('quzhudd')) { player.equip(game.createCard2('quzhupao3', 'club', 1)); player.equip(game.createCard2('xingyun', 'club', 1)); }
            if (player.hasSkill('qingxuncl')) { player.equip(game.createCard2('qingxunpao3', 'club', 1)); player.equip(game.createCard2('xingyun', 'club', 1)); }
            if (player.hasSkill('zhongxunca')) { player.equip(game.createCard2('zhongxunpao3', 'club', 1)); player.equip(game.createCard2('huokongld_equip', 'club', 1)); }
            if (player.hasSkill('zhanliebb')) { player.equip(game.createCard2('zhanliepao3', 'club', 1)); player.equip(game.createCard2('huokongld_equip', 'club', 1)); }
            if (player.hasSkill('hangmucv')) { player.equip(game.createCard2('zhandouji3', 'club', 1)); player.equip(game.createCard2('tansheqi3', 'club', 1)); }
            if (player.hasSkill('junfu')) { player.equip(game.createCard2('yuleiji3', 'club', 1)); player.equip(game.createCard2('xingyun', 'club', 1)); }
            if (player.hasSkill('daoqu')) { player.equip(game.createCard2('jianzaidaodan3', 'club', 1)); player.equip(game.createCard2('fasheqi3', 'club', 1)); }

            player.equip(game.createCard2('xingyun', 'club', 1));
            player.equip(game.createCard2('miki_binoculars', 'diamond', 1));
        },
        mod: {
            canBeDiscarded: function (card) {
                if (lib.config.extension_舰R牌将__tiaozhanbiaojiang === false) return true;
                if (get.position(card) == 'e' && get.mode() == 'boss' && ['equip1', 'equip5', 'equip6'].includes(get.subtype(card))) return false;
            },
        },
        intro: { content: function () { return get.translation(skill + '_info'); }, },
    },
    danzong: {
        trigger: {
            player: "useCard1",
        },
        filter: function (event, player, card) {
            var chusha = player.getAllHistory('useCard', function (evt) {
                return get.name(evt.card, 'sha') == 'sha';
            }).length, danzong = player.getAllHistory('useSkill', function (evt) { return evt.skill == "danzong"; }).length;
            var e = Math.random(), f = 0.4;
            if (player.hasSkill('quzhudd')) var f = 0.35;
            if (player.hasSkill('qingxuncl')) var f = 0.45;
            if (player.hasSkill('zhongxunca')) var f = 0.55;
            return event.card.name == 'sha' && !event.card.nature && !player.hasSkill('danzong_damage') && e < f || chusha > danzong * 4 + 4;
        },
        audio: "ext:1牌将修改:true",
        usable: 2,
        priority: 2,
        name: "附加属性杀",
        check: function (event, player) {//"useCard1",history.length%5==0;
            var eff = 0;
            for (var i = 0; i < event.targets.length; i++) {
                var target = event.targets[i];
                var eff1 = get.damageEffect(target, player, player);
                var eff2 = get.damageEffect(target, player, player, 'fire');
                if (player.hasSkill('quzhudd') || player.hasSkill('qianting')) var eff2 = get.damageEffect(target, player, player, 'thunder');
                if (player.hasSkill('zhanliebb') || player.hasSkill('hangmucv')) var eff2 = get.damageEffect(target, player, player, 'thunder');
                eff += eff2;
                eff -= eff1;
            }
            return eff >= 0;
        },
        prompt: function (event, player) {
            {
                if (player.hasSkill('quzhudd') || player.hasSkill('qianting')) { return '穿甲鱼雷' };
                if (player.hasSkill('zhanliebb') || player.hasSkill('hangmucv')) { return '弃牌穿甲弹' };
                return '点燃'
            };
        },
        "prompt2": function (event, player) {
            var evt = event;
            var chusha = player.getAllHistory('useCard', function (evt) {
                return get.name(evt.card, 'sha');
            }).length, danzong = player.getAllHistory('useSkill', function (evt) { return evt.skill == "danzong"; }).length;
            var tishi = '总计可用' + Math.floor(chusha / 4 - danzong) + '次,每回合限2次,令非属性' + get.translation(event.card) + '在计算伤害前：<br>', xiaochuan = player.hasSkill('quzhudd') || player.hasSkill('qianting'), dachuan = player.hasSkill('zhanliebb') || player.hasSkill('hangmucv');
            {
                if (xiaochuan) { tishi += ('获得雷属性（命中后：目标有护甲时,伤害穿透护甲；减少对手1点防御距离)。<br>被集火了,快跑') };
                if (dachuan) { tishi += ('获得雷属性（命中后：目标有护甲时,加1伤；减少对手1点手牌上限；放弃伤害,改为弃置对手的卡牌）<br>一般般啦,绝境求生。') };
                if (!dachuan && !xiaochuan) { tishi += ('获得火属性（命中后：目标出牌阶段结束时受到一点火焰伤害,并摸一张牌）。<br>团战利器') }
            }; tishi += (',每使用三张杀,使用次数+1'); return tishi
        },
        content: function () {//player.addTempSkill('qinggang_skill','useCard1');
            var chusha = player.getAllHistory('useCard', function (evt) {
                return get.name(evt.card, 'sha');
            }).length, danzong = player.getAllHistory('useSkill', function (evt) { return evt.skill == "danzong"; }).length;
            //return event.card.name=='sha'&&!event.card.nature&&chusha/2-danzong>0;   
            //game.log(chusha, danzong);

            /* trigger.card.nature = 'fire';
            if ((player.hasSkill('quzhudd') || player.hasSkill('qianting'))) { trigger.card.nature = 'thunder' }; if ((player.hasSkill('zhanliebb') || player.hasSkill('hangmucv'))) { trigger.card.nature = 'thunder'; };
            if (get.itemtype(trigger.card) == 'card') {
                var next = game.createEvent('zhuque_clear');
                next.card = trigger.card;
                event.next.remove(next);
                trigger.after.push(next);
                next.setContent(function () {
                    delete card.nature;
                });
            } */
            player.addSkill('danzong_damage');
        },
        subSkill: {
            damage: {
                equipSkill: true, frequent: true,
                trigger: { source: "damageBefore", },
                filter: function (event, player, card) {
                    return !event.nature;
                },
                prompt: "增强杀", "prompt2": "下一次造成伤害时,可以改变伤害属性（接近伤害的触发时机,几乎就是个特效）",
                content: function () {//player.addTempSkill('qinggang_skill','useCard1');
                    trigger.nature = 'fire';
                    if ((player.hasSkill('quzhudd') || player.hasSkill('qianting'))) { trigger.nature = 'thunder' }; if ((player.hasSkill('zhanliebb') || player.hasSkill('hangmucv'))) { trigger.nature = 'ice'; };
                    player.removeSkill('danzong_damage');
                },
                mark: true, intro: { marktext: "增强", content: function (storage, player) { return ('下一次造成伤害时,可以改变伤害属性（接近伤害的触发时机,几乎就是个特效）'); }, },
                sub: true,
            },
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    _kaishimopai: {
        audio: "ext:1牌将修改:2",
        group: ["_kaishimopai_jieshu", "_kaishimopai_mark", "_kaishimopai_discover", "_kaishimopai_draw", "_kaishimopai_jieshudraw"],
        subSkill: {
            jieshu: {
                trigger: { player: "phaseJieshuBegin", },
                priority: 1, fixed: true, silent: true,  frequent: true, forced: true, popup: false,
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__kaishimopai === false) return false;
                    return true;
                },
                content: function () {
                    'step 0'
                    if (player.countMark('_kaishimopai_jieshudraw')) { player.draw(player.countMark('_kaishimopai_jieshudraw')); player.removeMark('_kaishimopai_jieshudraw', player.countMark('_kaishimopai_jieshudraw')) };
                }, sub: true,
            },
            mark: {
                trigger: { player: "gainBegin", global: "phaseBeginStart", },
                priority: 1, silent: true, forced: true, popup: false,
                filter: function (event, player) {
                    return event.name != 'gain' || player == _status.currentPhase;
                },
                content: function () {
                    if (lib.config.extension_舰R牌将__kaishimopai === false) return false;
                    if (trigger.name == 'gain' && !player.isPhaseUsing()) trigger.gaintag.add('kaishimopai'); else player.removeGaintag('kaishimopai');
                },
                mark: false, intro: { marktext: "摸牌", content: function (storage, player) { return ('摸牌阶段获得的一些牌'); }, }, sub: true,
            },
            discover: {
                trigger: { player: "phaseDrawEnd", }, forced: true,
                filter: function (event, player) {//xinfu_bijing
                    if (lib.config.extension_舰R牌将__kaishimopai === false) return false;
                    return player.getCards('h', function (card) {
                        return card.hasGaintag('_kaishimopai') && card.hasGaintag('_kaishimopai');
                    }).length > 1;
                },
                content: function () {
                    'step 0'
                    event.cards = player.getCards('h', function (card) { return card.hasGaintag('_kaishimopai'); });
                    player.chooseToDiscard('he', false, event.cards.length).set('prompt2', '弃置等同于于摸牌阶段获得的牌数,然后随机获得一张你指定类别的卡牌。').set('ai', function (card) {
                        if (ui.selected.cards.length > 2) return -1;
                        if (card.name == 'tao') return -10;
                        if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
                        return 5 - get.value(card);
                    });
                    'step 1'
                    if (result.bool) {
                        player.chooseControl('<span class=yellowtext>基本', '<span class=yellowtext>装备', '<span class=yellowtext>锦囊', 'cancel2').set('prompt', get.prompt('_kaishimopai')).set('prompt2', '选择一张牌并发现之').set('ai', function (event, player) { var player = get.player(); return 1; });
                    };
                    'step 2'
                    if (result.control != 'cancel2') {
                        //game.log(); 
                        var i = result.index; if (i == 0) { var a = ('basic') }; if (i == 1) { var a = ('equip') }; if (i == 2) { var a = ('trick') };
                        event.cards = [];
                        var cardPile = Array.from(ui.cardPile.childNodes);
                        var discardPile = Array.from(ui.discardPile.childNodes);
                        var cardList = cardPile.concat(discardPile);
                        event.cards.addArray(cardList.filter(function (card) {
                            return get.type(card, a) == a;
                            //game.log(get.type(card,a)==a);
                        }));
                        player.gain(event.cards[0], 'gain2');
                    }
                }, sub: true,
            },
            draw: {
                priority: 4, forced: true, popup: false, mark: false,
                trigger: { player: "phaseDrawBegin", },
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__kaishimopai === false) return false;
                    return true;
                },
                content: function () {
                    'step 0'
                    for (var i = 0; i < trigger.num; i += (1)) { if (trigger.num > 0 && player.countMark('_kaishimopai_draw')) { trigger.num -= (1); player.removeMark('_kaishimopai_draw', 1) } }
                }, sub: true, intro: { marktext: "减摸牌数", content: function (storage, player) { return ('减少摸牌阶段摸牌数'); }, },
            },
            jieshudraw: {
                trigger: { player: "phaseJudgeBefore", },
                name: "闭月", forced: true, usable: 1,
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__kaishimopai === false) return false;
                    return player.countCards('j') > 0
                },
                content: function () {
                    'step 0'
                    player.chooseControl('<span class=yellowtext>少摸一张牌' + '</span>', 'cancel2').set('prompt', get.prompt('判定藏牌')).set('prompt2', '准备阶段,若你的判定区有牌时,<br>你可以令自己的摸牌阶段少摸一张牌,<br>然后在自己的回合结束时摸一张牌。').set('ai', function (event, player) { var player = get.player(); return 0; });
                    'step 1'
                    if (result.control != 'cancel2') { player.addMark('_kaishimopai_jieshudraw'); player.addMark('_kaishimopai_draw'); };
                }, sub: true, mark: false, intro: { marktext: "闭月", content: function (storage, player) { return ('结束时摸一张牌'); }, },
            },
        },
        intro: { marktext: "摸牌", content: function (storage, player) { return ('获得一个技能时的标记'); }, },
    },
    zhongpaoduijue: {
        enable: "phaseUse", usable: 1, position: "hejs", complexCard: true,
        selectCard: function (card, player) { var player = get.player(); return [2, player.countMark('jinengup') + 2] },
        filterTarget: function (card, player, target) { if (target != player && player.inRange(target)) return true; },
        filter: function (event, player) {
            return !player.countCards('h', 'sha') || !player.canUse('sha', player);
        },
        filterCard: function (card, player) {
            if (ui.selected.cards.length) {
                return get.suit(card) == get.suit(ui.selected.cards[0]);
            }
            var cards = player.getCards('he');
            for (var i = 0; i < cards.length; i++) {
                if (card != cards[i]) {
                    if (get.suit(card) == get.suit(cards[i])) return true;
                }
            }
            return false;
        },
        check: function (card) {
            if (get.subtype(card) == 'equip2') { return false }; return 5 - get.value(card);
        },
        prompt: "当你无法使用杀时,你可以指定一个目标,弃置最多（2/3/4）张相同花色的牌,并与目标摸等量的牌,<br>然后你与目标轮流视为对对方使用一张决斗,<br>直到双方的决斗次数超过2n,n为你弃置的牌数。强化以减少对方摸的牌",
        content: function () {
            'step 0'//你获得技能[]player.addTempSkill('touxichuan','phaseAfter');
            event.num = event.cards.length;
            var d = game.countPlayer(function (current) { return current != player && (get.attitude(player, current) < 1) && (current.hasSkill('bagua_skill') || current.hasSkill('re_bagua_skill')); });
            //game.log('有八卦的角色:', d);
            player.chooseTarget(get.prompt2('选择攻击目标'), function (card, player, target) {
                return target.maxHp > 0 && player.inRange(target);
            }).set('ai', function (target) {
                var att = -get.attitude(_status.event.player, target) / target.countCards('h');
                if (target.hasSkill('quzhudd') || target.hasSkill('hangmucv')) { att *= 1.1 };
                if (Math.ceil(target.hp * 2) <= target.maxHp) { att *= 1.1 }; if (target.countCards('h') < 3) { att *= 1.1 };
                if (target.hasSkill('bagua_skill') || target.hasSkill('re_bagua_skill')) { att *= 0.5 };
                return att
            });
            'step 1'
            if (result.bool) {
                event.target = result.targets[0];
                player.draw(event.num);
                event.target.draw(event.num - player.countMark('jinengup'));
                if (event.num > 1) {
                    player.useCard({ name: 'juedou' }, event.target);
                    event.target.useCard({ name: 'juedou' }, player);
                };
            } else {
                event.finish();
                return;
            }
            'step 2'
            if (event.num > 2) {
                player.useCard({ name: 'juedou' }, event.target);
                event.target.useCard({ name: 'juedou' }, player);
            };
            'step 3'
            if (event.num > 3) {
                player.useCard({ name: 'juedou', nature: 'fire', isCard: false }, event.target);
                event.target.useCard({ name: 'juedou' }, player);
            };
            'step 4'
            if (event.num > 4) {
                player.useCard({ name: 'juedou', nature: 'fire', isCard: false }, event.target);
                event.target.useCard({ name: 'juedou' }, player);
            };
        },
        ai: {
            expose: 0,
            threaten: 0.8,
            order: 4,
            result: {
                target: function (target, player) {
                    if (get.attitude(player, target) < 0 && target.inRange(player)) {
                        if (player.countCards('he') > 3) { if (target.countCards('h') < 4) return -2; return -1 }; return 0
                    };
                },
            },
        },
        intro: {
            content: function () {
                return get.translation(skill);
            },
        },
    },
    _qyzhugeliang: {
        trigger: {
            global: "phaseBefore", player: "enterGame",

        }, forced: true,
        filter: function (event, player) {
            if (lib.config.extension_舰R牌将__qyzhugeliang === false) return false;
            return (event.name != 'phase' || game.phaseNumber == 0) && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));
        },
        content: function () {
            'step 0'
            if (player.identity == 'zhu') {
                event.choiceList = []; event.skills = []; event.cao = cards; event.jieshao = [];
                event.skills = ['qixing', 'nzry_cunmu', 'huogong', 'repojun', 'nlianji', 'new_reyiji']; for (var skill of event.skills) {
                    event.jieshao.push([skill, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + '】</div><div>' + lib.translate[skill + '_info'] + '</div></div>'],);
                };
                event.choiceList = (event.jieshao);
                event.first = true;    //存了6个变量,可以导出为button,与textbutton样式,看需求
                var next = player.chooseButton(['令所有人获得一组技能或一张卡牌的使用权,用于熟悉游戏;这些技能（与附赠的技能）会在下一个回合开始后移除。', [event.choiceList, 'textbutton'],]);
                next.set('selectButton', [1]);//可以选择多个按钮,可计算可加变量。
                next.set('ai', function (button) {
                    switch (ui.selected.buttons.length) {
                        case 0: return Math.random(); default: return 0;
                    }
                });
            };
            'step 1'
            //game.log(result.links, result.bool);//只能返还这两个,所以更适合技能,更需要循环的方式进行计算。
            if (result.bool) {  //player.addMark('Expup',event.cadechangdu);//先给经验再计算         miki_binoculars smyyingshi  gwjingtian gushe tongxie jyzongshi reqiaoshui nlianji zhuandui reluoyi zhongji
                if (result.bool != 'cancel2') {
                    //game.log(); 
                    var targets = game.filterPlayer();
                    var f = result.index; for (var i = 0; i < targets.length; i++) {
                        if (result.links.includes('qixing')) { targets[i].addTempSkill('qixing', 'roundStart'); targets[i].addTempSkill('qixing2', 'roundStart') };
                        if (result.links.includes('reguanxing')) { targets[i].addTempSkill('reguanxing', 'roundStart'); targets[i].addTempSkill('nzry_cunmu', 'roundStart'); targets[i].addTempSkill('gwjingtian', 'phaseZhunbeiBegin'); if (i < targets.length / 2 - 1) { var s = targets.length - i; targets[s].useSkill('reguanxing'); }; };
                        if (result.links.includes('repojun')) { targets[i].addTempSkill('repojun', 'roundStart'); targets[i].addTempSkill('zhongji', 'roundStart'); targets[i].addTempSkill('tongxie', 'roundStart'); targets[i].addTempSkill('kaikang', 'roundStart') };
                        if (result.links.includes('nlianji')) { targets[i].addTempSkill('nlianji', 'roundStart'); targets[i].addTempSkill('songshu', 'roundStart'); targets[i].addTempSkill('weimu', 'roundStart'); };
                        if (result.links.includes('new_reyiji')) { targets[i].addTempSkill('jianxiong', 'roundStart'); targets[i].addTempSkill('ganglie', 'roundStart'); targets[i].addTempSkill('new_reyiji', 'roundStart'); };
                        if (result.links.includes('huogong')) { targets[i].chooseUseTarget({ name: 'huogong' }); };
                    };
                };
            }
        },
    },
    _yidong: {
        name: "移动座位", enable: "phaseUse", usable: 1,
        prompt: "与相邻的队友交换座次,适合互相攻击临近的目标。<br>事件过程为：双方交换座次,之后若你的座次靠后并处于出牌阶段,<br>翻面,目标获得额外回合。",
        filterTarget: function (card, player, target) {
            return get.attitude(player, target) > 0 && player != target && target == player.next || target == player.previous;
        }, selectTarget: 1,
        filter: function (event, player) {
            if (lib.config.extension_舰R牌将__yidong === false) return false;
            return player.hasSkill('_yuanhang');
        },
        content: function () {
            game.log(game.countPlayer(function (current) { return current != player && (get.distance(current, player) == 1 && player.countCards('h', function (card) { return get.type(card, 'trick') == 'trick' }) || get.distance(current, player, 'attack') == 1 && lib.filter.cardUsable({ name: 'sha' }, player)) && get.attitude(player, current) < 0 }));
            game.swapSeat(player, target);
            if (target == player.previous) {
                var evt = _status.event.getParent('phaseUse');
                if (evt && evt.name == 'phaseUse') {//player.turnOver();
                    if (player.hasSkill('_yidong_yidong2')) { target.insertPhase(); player.addSkill('_yidong_yidong2'); }; event.finish();
                }
            };
            if (target == player.next) { target.turnOver(); event.finish() };
        },
        ai: {
            order: 1,
            result: {
                target: function (player, target) {
                    var ziji = game.countPlayer(function (current) { return current != player && (get.distance(current, player) == 1 || get.distance(current, player, 'attack') == 1) && get.attitude(player, current) < 0 }), mubiao = game.countPlayer(function (current) { return current != player && (get.distance(current, player) == 2 && get.distance(current, player, 'pure') == 2) && get.attitude(player, current) < 0 });
                    if (player.hasUnknown() || ziji > 0 || mubiao > 0) return 0;
                    var distance = Math.pow(get.distance(player, target, 'absolute'), 2);
                    if (!ui.selected.targets.length) return distance;
                    var distance2 = Math.pow(get.distance(player, ui.selected.targets[0], 'absolute'), 2); return Math.min(0, distance - distance2);
                },
            },
        },
        intro: { content: function () { return get.translation('_yidong2_info'); }, },
        subSkill: {
            yidong2: {
                name: "移动",
                trigger: { player: ["phaseJieshuBegin"], }, priority: 3, forced: true,
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__yidong === false) return false;
                    return player.hasMark('_yidong_yidong2')
                },
                content: function () {
                    if (player.hasMark('_yidong_yidong2')) { player.removeSkill('_yidong_yidong2'); player.removeMark('_yidong_yidong2', player.countMark('_yidong_yidong2')); };
                }, intro: { content: function () { return ('移动过'); }, },
            },
        },
    },
};
export { globalskills };