//目录：全局技能、武将列表、武将技能、武将和技能翻译、卡牌包与卡牌技能、卡牌翻译、配置（config）、单机武将列表、扩展简介、全局函数模块

game.import("extension", function (lib, game, ui, get, ai, _status) {

    return {
        name: "舰R牌将", 
        content: function (config, pack) {
            /*lib.group.push('RN');
            lib.translate.RN = '<span style="color:#FFCD7F32">英</span>';
            lib.group.push('USN');
            lib.translate.USN = '<span style="color:#FF000000">美</span>';
            lib.group.push('IJN');
            lib.translate.IJN = '<span style="color:#FFCCCCCC">日</span>';*///添加势力，但是由于未知原因显示的字体相当模糊，解决问题之前不采用

            lib.groupnature.PLAN = 'PLAN';
            //将势力添加到势力库中 并指定势力的中文名称
            lib.group.push('PLAN');
            lib.translate['PLAN'] = 'C';

            lib.groupnature.KMS = 'KMS';
            lib.group.push('KMS');
            lib.translate['KMS'] = 'G';

            lib.groupnature.USN = 'USN';
            lib.group.push('USN');
            lib.translate['USN'] = 'U';

            lib.groupnature.ΒΜΦCCCP = 'ΒΜΦCCCP';
            lib.group.push('ΒΜΦCCCP');
            lib.translate['ΒΜΦCCCP'] = 'S';

            lib.groupnature.IJN = 'IJN';
            lib.group.push('IJN');
            lib.translate['IJN'] = 'J';

            lib.groupnature.MN = 'MN';
            lib.group.push('MN');
            lib.translate['MN'] = 'F';

            lib.groupnature.RN = 'RN';
            lib.group.push('RN');
            lib.translate['RN'] = 'E';

            lib.groupnature.RM = 'RM';
            lib.group.push('RM');
            lib.translate['RM'] = 'I';

            lib.groupnature.ROCN = 'ROCN';
            lib.group.push('ROCN');
            lib.translate['ROCN'] = 'C';

            lib.groupnature.OTHER = 'OTHER';
            lib.group.push('OTHER');
            lib.translate['OTHER'] = 'OTHER';

            var style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='PLAN'],";
            style2.innerHTML += "div[data-nature='PLAN'],";
            style2.innerHTML += "span[data-nature='PLAN'] {text-shadow: black 0 0 1px,rgba(255, 0, 0,1) 0 0 2px,rgba(255, 0, 0,1) 0 0 5px,rgba(255, 0, 0,1) 0 0 10px,rgba(255, 0, 0,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='PLANm'],";
            style2.innerHTML += "span[data-nature='PLANm'] {text-shadow: black 0 0 1px,rgba(255, 0, 0,1) 0 0 2px,rgba(255, 0, 0,1) 0 0 5px,rgba(255, 0, 0,1) 0 0 5px,rgba(255, 0, 0,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='PLANmm'],";
            style2.innerHTML += "span[data-nature='PLANmm'] {text-shadow: black 0 0 1px,rgba(255, 0, 0,1) 0 0 2px,rgba(255, 0, 0,1) 0 0 2px,rgba(255, 0, 0,1) 0 0 2px,rgba(255, 0, 0,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            var style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='KMS'],";
            style2.innerHTML += "div[data-nature='KMS'],";
            style2.innerHTML += "span[data-nature='KMS'] {text-shadow: black 0 0 1px,rgba(128, 0, 0,1) 0 0 2px,rgba(128, 0, 0,1) 0 0 5px,rgba(128, 0, 0,1) 0 0 10px,rgba(128, 0, 0,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='KMSm'],";
            style2.innerHTML += "span[data-nature='KMSm'] {text-shadow: black 0 0 1px,rgba(128, 0, 0,1) 0 0 2px,rgba(128, 0, 0,1) 0 0 5px,rgba(128, 0, 0,1) 0 0 5px,rgba(128, 0, 0,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='KMSmm'],";
            style2.innerHTML += "span[data-nature='KMSmm'] {text-shadow: black 0 0 1px,rgba(128, 0, 0,1) 0 0 2px,rgba(128, 0, 0,1) 0 0 2px,rgba(128, 0, 0,1) 0 0 2px,rgba(128, 0, 0,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            var style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='USN'],";
            style2.innerHTML += "div[data-nature='USN'],";
            style2.innerHTML += "span[data-nature='USN'] {text-shadow: black 0 0 1px,rgba(0, 0, 160,1) 0 0 2px,rgba(0, 0, 160,1) 0 0 5px,rgba(0, 0, 160,1) 0 0 10px,rgba(0, 0, 160,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='USNm'],";
            style2.innerHTML += "span[data-nature='USNm'] {text-shadow: black 0 0 1px,rgba(0, 0, 160,1) 0 0 2px,rgba(0, 0, 160,1) 0 0 5px,rgba(0, 0, 160,1) 0 0 5px,rgba(0, 0, 160,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='USNmm'],";
            style2.innerHTML += "span[data-nature='USNmm'] {text-shadow: black 0 0 1px,rgba(0, 0, 160,1) 0 0 2px,rgba(0, 0, 160,1) 0 0 2px,rgba(0, 0, 160,1) 0 0 2px,rgba(0, 0, 160,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            var style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='RN'],";
            style2.innerHTML += "div[data-nature='RN'],";
            style2.innerHTML += "span[data-nature='RN'] {text-shadow: black 0 0 1px,rgba(0, 255, 128,1) 0 0 2px,rgba(0, 255, 128,1) 0 0 5px,rgba(0, 255, 128,1) 0 0 10px,rgba(0, 255, 128,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='RNm'],";
            style2.innerHTML += "span[data-nature='RNm'] {text-shadow: black 0 0 1px,rgba(0, 255, 128,1) 0 0 2px,rgba(0, 255, 128,1) 0 0 5px,rgba(0, 255, 128,1) 0 0 5px,rgba(0, 255, 128,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='RNmm'],";
            style2.innerHTML += "span[data-nature='RNmm'] {text-shadow: black 0 0 1px,rgba(0, 255, 128,1) 0 0 2px,rgba(0, 255, 128,1) 0 0 2px,rgba(0, 255, 128,1) 0 0 2px,rgba(0, 255, 128,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            var style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='IJN'],";
            style2.innerHTML += "div[data-nature='IJN'],";
            style2.innerHTML += "span[data-nature='IJN'] {text-shadow: black 0 0 1px,rgba(255, 255, 128,1) 0 0 2px,rgba(255, 255, 128,1) 0 0 5px,rgba(255, 255, 128,1) 0 0 10px,rgba(255, 255, 128,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='IJNm'],";
            style2.innerHTML += "span[data-nature='IJNm'] {text-shadow: black 0 0 1px,rgba(255, 255, 128,1) 0 0 2px,rgba(255, 255, 128,1) 0 0 5px,rgba(255, 255, 128,1) 0 0 5px,rgba(255, 255, 128,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='IJNmm'],";
            style2.innerHTML += "span[data-nature='IJNmm'] {text-shadow: black 0 0 1px,rgba(255, 255, 128,1) 0 0 2px,rgba(255, 255, 128,1) 0 0 2px,rgba(255, 255, 128,1) 0 0 2px,rgba(255, 255, 128,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            var style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='MN'],";
            style2.innerHTML += "div[data-nature='MN'],";
            style2.innerHTML += "span[data-nature='MN'] {text-shadow: black 0 0 1px,rgba(0, 128, 255,1) 0 0 2px,rgba(0, 128, 255,1) 0 0 5px,rgba(0, 128, 255,1) 0 0 10px,rgba(0, 128, 255,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='MNm'],";
            style2.innerHTML += "span[data-nature='MNm'] {text-shadow: black 0 0 1px,rgba(0, 128, 255,1) 0 0 2px,rgba(0, 128, 255,1) 0 0 5px,rgba(0, 128, 255,1) 0 0 5px,rgba(0, 128, 255,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='MNmm'],";
            style2.innerHTML += "span[data-nature='MNmm'] {text-shadow: black 0 0 1px,rgba(0, 128, 255,1) 0 0 2px,rgba(0, 128, 255,1) 0 0 2px,rgba(0, 128, 255,1) 0 0 2px,rgba(0, 128, 255,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            var style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='RM'],";
            style2.innerHTML += "div[data-nature='RM'],";
            style2.innerHTML += "span[data-nature='RM'] {text-shadow: black 0 0 1px,rgba(128, 0, 128) 0 0 2px,rgba(128, 0, 128) 0 0 5px,rgba(128, 0, 128) 0 0 10px,rgba(128, 0, 128) 0 0 10px}";
            style2.innerHTML += "div[data-nature='RMm'],";
            style2.innerHTML += "span[data-nature='RMm'] {text-shadow: black 0 0 1px,rgba(128, 0, 128) 0 0 2px,rgba(128, 0, 128) 0 0 5px,rgba(128, 0, 128) 0 0 5px,rgba(128, 0, 128) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='RMmm'],";
            style2.innerHTML += "span[data-nature='RMmm'] {text-shadow: black 0 0 1px,rgba(128, 0, 128) 0 0 2px,rgba(128, 0, 128) 0 0 2px,rgba(128, 0, 128) 0 0 2px,rgba(128, 0, 128) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            var style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='ΒΜΦCCCP'],";
            style2.innerHTML += "div[data-nature='ΒΜΦCCCP'],";
            style2.innerHTML += "span[data-nature='ΒΜΦCCCP'] {text-shadow: black 0 0 1px,rgba(255, 128, 0) 0 0 2px,rgba(255, 128, 0) 0 0 5px,rgba(255, 128, 0) 0 0 10px,rgba(255, 128, 0) 0 0 10px}";
            style2.innerHTML += "div[data-nature='ΒΜΦCCCPm'],";
            style2.innerHTML += "span[data-nature='ΒΜΦCCCPm'] {text-shadow: black 0 0 1px,rgba(255, 128, 0) 0 0 2px,rgba(255, 128, 0) 0 0 5px,rgba(255, 128, 0) 0 0 5px,rgba(255, 128, 0) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='ΒΜΦCCCPmm'],";
            style2.innerHTML += "span[data-nature='ΒΜΦCCCPmm'] {text-shadow: black 0 0 1px,rgba(255, 128, 0) 0 0 2px,rgba(255, 128, 0) 0 0 2px,rgba(255, 128, 0) 0 0 2px,rgba(255, 128, 0) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            var style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='ROCN'],";
            style2.innerHTML += "div[data-nature='ROCN'],";
            style2.innerHTML += "span[data-nature='ROCN'] {text-shadow: black 0 0 1px,rgba(255, 128, 128) 0 0 2px,rgba(255, 128, 128) 0 0 5px,rgba(255, 128, 128) 0 0 10px,rgba(255, 128, 128) 0 0 10px}";
            style2.innerHTML += "div[data-nature='ROCNm'],";
            style2.innerHTML += "span[data-nature='ROCNm'] {text-shadow: black 0 0 1px,rgba(255, 128, 128)8) 0 0 2px,rgba(255, 128, 128) 0 0 5px,rgba(255, 128, 128) 0 0 5px,rgba(255, 128, 128)8)8) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='ROCNmm'],";
            style2.innerHTML += "span[data-nature='ROCNmm'] {text-shadow: black 0 0 1px,rgba(255, 128, 128) 0 0 2px,rgba(255, 128, 128) 0 0 2px,rgba(255, 128, 128) 0 0 2px,rgba(255, 128, 128) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            var style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='OTHER'],";
            style2.innerHTML += "div[data-nature='OTHER'],";
            style2.innerHTML += "span[data-nature='OTHER'] {text-shadow: black 0 0 1px,rgba(0, 0, 0) 0 0 2px,rgba(0, 0, 0) 0 0 5px,rgba(0, 0, 0) 10px,rgba(0, 0, 0) 0 0 10px}";
            style2.innerHTML += "div[data-nature='OTHERm'],";
            style2.innerHTML += "span[data-nature='OTHERm'] {text-shadow: black 0 0 1px,rgba(0, 0, 0) 0 0 2px,rgba(0, 0, 0) 5px,rgba(0, 0, 0) 0 0 5px,rgba(0, 0, 0) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='OTHERmm'],";
            style2.innerHTML += "span[data-nature='OTHERmm'] {text-shadow: black 0 0 1px,rgba(0, 0, 0) 0 0 2px,rgba(0, 0, 0) 0 0 2px,rgba(0, 0, 0),rgba(0, 0, 0) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            if (config._yuanhang) {//优化摸牌时牌的质量的技能，全局技能需要下划线作为前缀，才能被无名杀识别。
                lib.skill._yuanhang = {
                    name: "远航", "prompt2": "当你有摸牌标记时，你失去手牌后能摸1张牌，然后失去1个摸牌标记，自己回合暂时+1标记上限并回满标记，标记上限x个，可在强化中提升X值。", intro: { marktext: "摸牌", content: function (player, mark) { ; var a = game.me.countMark('_yuanhang_mopai'); return '手牌较少时，失去手牌可以摸一张牌，还可以摸' + a + '次，其他角色回合开始时会回复一个标记'; }, },
                    group: ["_yuanhang_mopai", "_yuanhang_kaishi", "_yuanhang_bingsimopai", "_yuanhang_dietogain"],
                    mod: {
                        maxHandcard: function (player, num) {
                            var a = 0; if (player.hasSkill('qianting')) { var a = a + 1 };
                            if (player.hp < player.maxHp) { a += (1) }; if (player.hp <= 0) { a += (1) };
                            return num = (num + a);
                        },
                    },
                    trigger: { global: "phaseBefore", player: "enterGame", }, forced: true, priority: -1,
                    filter: function (event, player) {
                        return (event.name != 'phase' || game.phaseNumber == 0) && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai'));
                    },
                    content: function () {
                        if (player.identity == 'zhu') { player.changeHujia(1); game.log() };
                    },
                    intro: { content: function () { return get.translation(_yuanhang + '_info'); }, },
                    subSkill: {
                        mopai: {
                            name: "远航摸牌", frequent: true,
                            trigger: { player: "loseAfter", global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"], },
                            filter: function (event, player) {
                                var d = (player.getHandcardLimit() / 2), a = 0; if (player == _status.currentPhase) { a += (1) };
                                if (player.countCards('h') > d) return false;
                                var evt = event.getl(player);
                                if (!player.countMark('_yuanhang_mopai')) return false;
                                return evt && evt.player == player && evt.hs && evt.hs.length > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai'));
                            },
                            content: function () { player.draw(1); player.removeMark('_yuanhang_mopai'); },
                            sub: true,
                        },
                        kaishi: {
                            name: "远航回合开始时", fixed: true, silent: true, friquent: true,
                            trigger: { global: "phaseBegin", },
                            content: function () {//else if(!player.countMark('mopaiup')<1&&player.countCards('h','shan')<1){player.draw()}
                                var a = player.countMark('mopaiup'); var b = player.countMark('_yuanhang_mopai'); game.log(event.skill != 'huijiahuihe');
                                if (player == _status.currentPhase && event.getParent('phase').skill != 'huijiahuihe') { a += (1); if (a - b > 0) player.addMark('_yuanhang_mopai', a - b); };
                                /*if(a>b&&player!=_status.currentPhase){player.addMark('_yuanhang_mopai',1);};*/
                            },//远航每回合恢复标记被砍掉了。现在只有每轮开始恢复标记。
                            sub: true,
                        },
                        dietogain: {
                            name: "远航死后给牌", trigger: { player: ["dieAfter"], }, direct: true, forceDie: true,
                            filter: function (event, player) { if (event.name == 'die') return player.identity != 'fan'; return player.isAlive() && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai'));; },
                            content: function () {
                                'step 0'
                                event.count = trigger.num || 1;
                                'step 1'
                                event.count--;//让优势方有一轮的挑战，因为第二轮对手就因为过牌量下降而失去威胁。
                                player.chooseTarget(get.prompt2('在离开战斗前，若你的身份：<br>是忠臣，你可令一名角色摸1张牌；<br>内奸，令一名角色获得一张闪。<br>或许会有转机出现。'), function (card, player, target) { return target.maxHp > 0; }).set('ai', function (target) {
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
                            name: "濒死摸牌", usable: 2, fixed: true, mark: false,
                            trigger: { player: "changeHp", },
                            filter: function (event, player) { return player.hp <= 0 && event.num < 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai')); },
                            "prompt2": function (event, player) {
                                if ((player.hasMark('_yuanhang_bingsimopai'))) { return '当你进入濒死状态时，你可以摸一张牌,<br>若血量上限大于2，你需失去一点体力上限，摸一张牌。' };
                                if ((!player.hasMark('_yuanhang_bingsimopai'))) { return '当你进入濒死状态时，你可以摸一张牌,<br>若血量上限大于2，你需失去一点体力上限，摸一张牌。同时，依据舰种获得以下技能：<br>潜艇-志继（姜维）、重生（）；驱逐-镇卫（文聘）、齐攻（）；<br>轻巡-齐攻；重巡-刚烈改（改自夏侯惇）；<br>战列-刚烈改（夏侯惇)；航母-界连营（陆逊）；军辅：藏匿（）；导驱-界连营（陆逊）' };
                            },
                            content: function () {//兵粮寸断与据守，刚烈， 镇卫同疾吸伤害，国风防锦囊牌。
                                //轻巡提升己方防守与攻击距离，粮策全体发牌。重巡提供免伤。战列刚烈反击。 
                                player.draw(1); if (player.maxHp > 2) { player.loseMaxHp(1); player.draw(); } else /*game.playAudio('..','extension','舰R牌将/audio','bingsimosanpai')*/; if (player.maxHp > 5) { player.loseMaxHp(1); player.draw(); game.log('血量上限好高啊，额外来一次扣血摸牌吧', player); }
                                if (!player.hasMark('_yuanhang_bingsimopai')) {
                                    //if(player.hasSkill('qianting')){player.addSkill('olzhiji');;};
                                    //if(player.hasSkill('quzhudd')){player.addSkill('hzhenwei');player.addSkill('qigong')};
                                    //if(player.hasSkill('qingxuncl')){player.addSkill('qigong')};
                                    // if(player.hasSkill('zhongxunca')){player.addSkill('ganglie_gai')};
                                    //if(player.hasSkill('zhanliebb')){player.addSkill('ganglie_gai')};
                                    // if(player.hasSkill('hangmucv')){player.addSkill('relianying')};
                                    // if(player.hasSkill('junfu')){player.addSkill('spcangni')};
                                    //if(player.hasSkill('daoqu')){player.addSkill('relianying')}; 
                                }; trigger.player.addMark('_yuanhang_bingsimopai', 1);
                            },
                            intro: {
                                marktext: "濒死", content: function (player) {
                                    var player = _status.event.player, a = player.countMark('_yuanhang_bingsimopai'), tishi = '因濒死而减少的体力上限，牺牲上限，获得应急的牌，保一时的平安。<br>'; if (a > 0 && a <= 2 && player.hp <= 2) { tishi += ('勇敢的前锋<br>') }; if (a > 2 && a < 4 && player.hp <= 2) { tishi += ('rn勇的中坚<br>') }; if (a >= 4 && player.hp <= 2) { tishi += ('顽强的、折磨对手的大将<br>') };
                                    return tishi;
                                },
                            }, sub: true,
                        },
                    },
                };
            };
            if (config._jianzaochuan) {//弃牌提升血量上限或回血的技能，也解锁强化上限
                lib.skill._jianzaochuan = {
                    name: "建造", prompt: function (event, player) {//<br>或弃置三张牌，回复一点血量。或弃置四张牌，回复两点体力,两个改动的测试结果是过于强悍.
                        if (event.parent.name == 'phaseUse') { return '1.出牌阶段，<br>你可以弃置3张不同花色的牌，提升一点血量上限。' }; //if (event.type == 'dying') { return "2.当你濒死时，<br>你可以弃置4张不同花色的牌，回复一点体力。" };
                    }, limited: false, complexCard: true,
                    enable: "chooseToUse", position: "hejs",
                    filter: function (event, player) {
                        if (config._qianghuazhuang) {
                            var info = lib.skill._qianghuazhuang.getInfo(player); var a = info[0] + info[1] + info[2] + info[3] + info[4] + info[5]
                        } else { var a = 1 };
                        /*if (event.type == 'dying') { if (player != event.dying) return false; return player.countCards('hejs') >= 3; }
                        else*/ if (event.parent.name == 'phaseUse' && (a) > 0 && !player.hasMark('_jianzaochuan')) { return (player.countCards('hejs') >= 2) && a && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai')); } return false;//没有建造标记时才能建造，即主动建造上限1次，
                    },
                    selectCard: function (event, player) { var event = _status.event; /*if (event.type == 'dying') return [4, 4]; */return [3, 3]; },
                    filterCard: function (card) {
                        var suit = get.suit(card);
                        for (var i = 0; i < ui.selected.cards.length; i++) {
                            if (get.suit(ui.selected.cards[i]) == suit) return false;
                        }
                        return true;
                    },
                    check: function (card) {
                        var player = _status.event.player; var event = _status.event; var huifu = player.countCards('h', 'jiu') + player.countCards('h', 'tao');
                        if (player != event.dying && (player.hp < player.maxHp) && (player.countCards('h') > 4 || !player.hasMark('_jianzaochuan'))) return 11 - get.value(card);
                        if (player.hp <= 0 && (huifu < (-player.hp + 1) || !player.hasMark('_jianzaochuan'))) return 15 - get.value(card);
                    },
                    content: function () {
                        player.addMark('_jianzaochuan'); game.log(event.parent.name, event.cards);
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
                    mark: false, intro: { content: function () { return get.translation('建造的次数，用于提升升级上限。'); }, },
                };
            };

            if (config._qianghuazhuang) {//优化摸牌时牌的质量的技能
                lib.skill._qianghuazhuang = {
                    name: "强化装备", prompt: "每回合限一次，你可以弃置二至四张牌，将手牌转化为强化点数，<br>每2点强化点数换一个永久的效果升级。<br>（可选择如减少技能消耗、增加武器攻击距离、提高手牌上限等）<br>强化上限为建造的次数，最高强化至2级。<br>已存储的经验会降低弃牌最低牌数", mark: true, intro: {
                        marktext: "装备", content: function (storage, player) {//只有content与mark可以function吧，内容，介绍的文字与内容。
                            var info = lib.skill._qianghuazhuang.getInfo(player);
                            return '<div class="text center"><span class=greentext>用一摸一:' + info[0] + '<br>技能耗牌：' + info[1] + '</span><br><span class=firetext>出杀距离：-' + info[2] + '<br>攻击次数:' + info[3] + '</span><br><span class=thundertext>被杀距离：+' + info[4] + '<br>手牌上限:' + info[5] + '<br>Exp:' + info[7] + '</span></div>';
                        },
                    },
                    mod: {
                        attackFrom: function (from, to, distance) {
                            var a = 0; if (from.countMark('wuqiup')) { var a = a + from.countMark('wuqiup') }; return distance = (distance - a)
                        },
                        attackTo: function (from, to, distance) {
                            var a = 0; if (to.countMark('jidongup')) { var a = a + to.countMark('jidongup') }; return distance = (distance + a)
                        },
                        cardUsable: function (card, player, num) {
                            var a = 0; if (card.name == 'sha') return num = num += (player.countMark('useshaup'))
                        },
                        maxHandcard: function (player, num) {
                            var a = 0; if (player.countMark('shoupaiup')) { var a = a + player.countMark('shoupaiup') }; return num = (num + a);
                        },
                    },
                    direct: true, enable: "phaseUse", usable: 1,
                    init: function (player) {//初始化数组，也可以运行事件再加if后面的内容
                        if (!player.storage._qianghuazhuang) player.storage._qianghuazhuang = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                    },
                    getInfo: function (player) {//让其他技能可以更简单的获取该技能的数组。
                        if (!player.storage._qianghuazhuang) player.storage._qianghuazhuang = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                        return player.storage._qianghuazhuang;
                    },
                    filter: function (event, player) {//
                        var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, lv = 0; if (k < 3) { lv = k * 6 };/*if(k>=3){lv=k+10};*///远航上限降低为2，总可用强化数量公式作相应修改
                        if (player.countCards('h') > 0) { if ((a + b + c + d + e + f + g) >= (lv)) return false }; return player.countCards('h') > 1 || player.countMark('Expup') > 1;
                        //比较保守的设计，便于设计与更改。
                        ;
                    }, filterCard: {}, position: "h", selectCard: function (card) {
                        var player = _status.event.player, num = 0;/*num+=(player.countMark('Expup'));if(ui.selected.cards.length&&get.type(ui.selected.cards[0],'equip')=='equip'){num+=(1)};if(ui.selected.cards.length>1&&get.type(ui.selected.cards[1],'equip')=='equip'){num+=(1)};*///装备不再记为2强化点数
                        return [Math.max(2 - num, 0), Math.max(4 - num, 2)];
                    },

                    check: function (card) {//ui，参考仁德，ai执行判断，卡牌价值大于1就执行（只管卡片）当然，能把玩家设置进来就可以if玩家没桃 return-1。
                        var player = _status.event.player;
                        if (ui.selected.cards.length && get.type(ui.selected.cards[0], 'equip') == 'equip') return 5 - get.value(card);
                        if (ui.selected.cards.length >= Math.max(1, player.countCards('h') / 2)) return 0;
                        if (game.phaseNumber < 3) return 7 - get.value(card);
                        return 3 - get.value(card);
                    },
                    content: function () {//choiceList.unshift
                        'step 0'
                        var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, exp1 = 0;
                        player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h, k]; event.cadechangdu = event.cards.length;
                        event.choiceList = []; event.list = []; event.cao = cards;
                        for (var i = 0; i < event.cao.length; i += (1)) { if (get.type(event.cao[i], 'equip') == 'equip') { player.addMark('Expup1', 1) } else player.addMark('Expup1', 1); game.log(player.countMark('Expup1'), '卡牌:', event.cao[0], '类别', get.type(event.cao[i], 'equip'), get.type(event.cao[i], 'equip') == 'equip'); }; exp1 = player.countMark('Expup1');
                        event.jieshao = ['后勤保障：上限+' + (a + 1) + '→' + (a + 2) + '远航（用一摸一）标记上限，<br>手牌少于手牌上限1/2时，失去手牌会摸一张牌。防守反击的保障<br>每轮上限1/2/3，在自己的回合重置使用次数。', '技能升级：+' + (b) + '→' + (b + 1) + '，重巡-降低必中攻击限制(杀/黑牌/任意牌)、轻巡-增加无效群体锦囊牌范围(1/2/3)、航母-降低万箭齐发限制(黑桃与梅花/黑桃与梅花与红桃/任意牌);<br>战列舰-增加防护范围(杀造成的伤害/杀和锦囊牌造成的伤害/所有伤害)，导驱-增加射程(2/3/4)、潜艇-降低雷杀条件(红桃/红桃或黑桃/红桃或黑桃或方块);<br>驱逐-增加回避概率(0.25/0.33/0.50)、军辅-增加存牌上限(1/2/3)。', '射程升级：+' + c + '→' + (c + 1) + '武器（出杀）攻击距离，<br>增加出杀范围，虽然不增加锦囊牌距离，但胜在永久', '速射炮管：+' + d + '→' + (d + 1) + '出杀次数，<br>作为连弩的临时替代，进行多刀输出。', '改良推进器：+' + e + '→' + (e + 1) + '武器（被杀）防御距离<br>对手有更远的出杀范围才能对你出杀时，但不能防御锦囊牌。', '物流运输：+' + f + '→' + (f + 1) + '手牌上限，且蝶舞递装备给杀的距离提升，<br>双方状态差距越大，保牌效果越强。', '经验：+' + h + '→' + (player.countMark('Expup1')) + '，将卡牌转为经验，供下次升级。（直接点确定也行）<br>1级技能需要两张牌才能强化，2级技能需要三张牌才能强化。<br>但无名杀不能读取这个界面的文本，导致四点经验即可强化两个不同等级技能']//player.getEquip(1)，定义空数组，push填充它，事件变量可以自定义名字，什么都可以存。game.log('已强化:',a+b+c+d);
                        var info = lib.skill._qianghuazhuang.getInfo(player);
                        if (info[0] < k && (info[0] + 2 <= info[7] + exp1) && info[0] <= 2) {
                            event.list.push('mopaiup');
                            event.choiceList.push(['mopaiup', event.jieshao[0]]);
                        };
                        if (info[1] < k && (info[1] + 2 <= info[7] + exp1) && info[1] <= 2) {
                            event.list.push('jinengup');
                            event.choiceList.push(['jinengup', event.jieshao[1]]);
                        };
                        if (info[2] < k && (info[2] + 2 <= info[7] + exp1) && info[2] <= 2) {
                            event.list.push('wuqiup');
                            event.choiceList.push(['wuqiup', event.jieshao[2]]);
                        };//若此值：你强化的比目标多时，+1含锦囊牌防御距离。
                        if (info[3] < k && (info[3] + 2 <= info[7] + exp1) && info[3] <= 2) {
                            event.list.push('useshaup');
                            event.choiceList.push(['useshaup', event.jieshao[3]]);
                        };
                        if (info[4] < k && (info[4] + 2 <= info[7] + exp1) && info[4] <= 2) {
                            event.list.push('jidongup');
                            event.choiceList.push(['jidongup', event.jieshao[4]]);
                        };
                        if (info[5] < k && (info[5] + 2 <= info[7] + exp1) && info[5] <= 2) {
                            event.list.push('shoupaiup');
                            event.choiceList.push(['shoupaiup', event.jieshao[5]]);
                        };
                        //      if(info[6]<k&&(info[0]+2<=info[7])&&info[6]<2){event.list.push('songpaiup');
                        //  event.choiceList.push('+'+g+'→'+(g+1)+'给牌次数，<br>提升“先进雷达”技能的送牌范围。');};
                        if (info[7] <= k && info[7] < 6) {
                            event.list.push('Expup');
                            event.choiceList.push(['Expup', event.jieshao[6]]);
                        };
                        event.first = true;    //存了6个变量，可以导出为button，与textbutton样式，看需求
                        var next = player.chooseButton([
                            '将手牌转化为强化点数强化以下能力；取消将返还卡牌，<br>未使用完的点数将保留，上限默认为1，发动建造技能后提高。',
                            [event.choiceList, 'textbutton'],
                        ]);
                        var xuanze = event.cao.length;/*xuanze+=(player.countMark('Expup'));if(event.cao.length&&get.type(event.cao[0],'equip')=='equip'){xuanze+=(1)};if(event.cao.length>1&&get.type(event.cao[1],'equip')=='equip'){xuanze+=(1)};*///装备不再记为两张牌
                        next.set('selectButton', function (button) { return [0, Math.max(Math.floor(xuanze / 2), 0)] });//else {next.set('selectButton',[0,Math.max(xuanze,0)])}; //可以选择多个按钮，可计算可加变量。get.select(event.selectButton)为其调取结果。
                        next.set('filterButton', function (button) {
                            var event = _status.event; if (ui.selected.buttons) {//for(var i=0;i<event.cao.length;i+=(1)){};测试失败的函数组合game.log(ui.selected.buttons,get.selectableButtons().contains(ui.selected.buttons),get.selectableButtons());游戏无名杀Button的限制，这个代码并没有起到实时计算的作用。
                                return true; return xuanze >= player.countMark(ui.selected.buttons[0]) * 0.5 + 1;
                            }
                        });
                        next.set('prompt', get.prompt('_qianghuazhuang'), '令其中一项+1,好吧不显示这个info');
                        next.set('ai', function (button) {
                            var haode = [event.jieshao[0], event.jieshao[1]]; var yingji = []; var tunpai = [event.jieshao[5]];//其实一个例子就行，不如直接if(){return 2;};
                            if (game.hasPlayer(function (current) { return current.inRange(player) && get.attitude(player, current) < 0; }) < 1) { yingji.push(event.jieshao[2]) } else if (player.countCards('h', { name: 'sha' }) > 1) { yingji.push(event.jieshao[3]) };
                            if (game.hasPlayer(function (current) { return player.inRange(current) && get.attitude(player, current) < 0; }) > 0) yingji.push(event.jieshao[4]);
                            switch (ui.selected.buttons.length) {
                                case 0:
                                    if (haode.contains(button.link)) return 3;
                                    if (yingji.contains(button.link)) return 2;
                                    if (tunpai.contains(button.link)) return 1;
                                    return Math.random();
                                case 1:
                                    if (haode.contains(button.link)) return 3;
                                    if (yingji.contains(button.link)) return 2;
                                    if (tunpai.contains(button.link)) return 1;
                                    return Math.random();
                                case 2:
                                    return Math.random();
                                default: return 0;
                            }
                        });
                        'step 1'
                        game.log(result.links, result.bool)//只能返还这两个，所以更适合技能，更需要循环的方式进行计算。
                        if (!result.bool) { ; player.gain(event.cao, player); player.removeMark('Expup1', player.countMark('Expup1')); event.finish(); };//返还牌再计算
                        if (result.bool) {  //player.addMark('Expup',event.cadechangdu);//先给经验再计算扣除经验升级，随着此项目的升级，花费也越多。通过一个有序的清单，遍历比对返回的内容，来定位要增加的标记/数组。
                            player.addMark('Expup', player.countMark('Expup1')); player.removeMark('Expup1', player.countMark('Expup1'));
                            for (var i = 0; i < result.links.length; i += (1)) { if (!result.links.contains('Expup')) { player.addMark(result.links[i], 1); player.removeMark('Expup', 1 + player.countMark(result.links[i])); game.log('数组识别:', result.links[i], '编号', i, '，总编号', result.links.length - 1); } }
                        };
                        //    if(event.choiceList.length<event.cao){player.addMark('Expup',1);};从0开始，当介绍数组有内容==选项数组的内容（第i个），就加的简称数组第i个(内容)标签。并通过game.log()调试,在出牌记录中查看执行效果。result.links.contains(event.list[i])&&
                        'step 2'
                        var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1; game.log('结束', a, b, c, d, e, f, g, h, k);
                        player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h];
                    },
                    ai: {
                        order: function (player) { var player = _status.event.player; if (player.countMark('_jianzaochuan') < 3) { return 7 }; return 1 }, threaten: 0,
                        result: {
                            player: function (player) {
                                var player = _status.event.player;
                                var num = player.countCards('e') + player.countCards('h', { name: 'shan' }) - 1;
                                return num;
                            },
                        },
                    },//装备上装备以后，ai剩下的装备可以考虑强化，应该会保留防具吧。
                };
            };

            if (config._wulidebuff) {//属性伤害灾害效果
                lib.skill._wulidebuff = {
                    name: "属性效果", lastDo: true, forced: true, trigger: { source: "damageBefore", },
                    filter: function (event, player) {
                        if ((event.nature && player != event.player) && event.num > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai')))
                            return true
                    },
                    content: function () {
                        var link = (game.hasPlayer(function (current) { return get.attitude(player, current) < 0 && current == trigger.player && current.isLinked(); }) - game.hasPlayer(function (current) { return get.attitude(player, current) > 0 && current == trigger.player && current.isLinked(); }));
                        if (trigger.nature == 'fire') {
                            {
                                trigger.player.addSkill('_wulidebuff_ranshao'); trigger.player.addMark('_wulidebuff_ranshao', 1);
                                game.log(get.translation(player.name) + '<span class=firetext>燃烧</span>' + get.translation(trigger.player.name) + '<span class=thundertext>,ta还能坚持到出完牌');
                            };
                            if (trigger.player.hp * 2 < trigger.player.maxHp) { player.$throwEmotion(trigger.player, 'yanhua') };/*game.playAudio('..','extension','舰R牌将/audio','_wulidebuff')*/;
                        };


                        if (trigger.nature == 'ice' || (player.hasSkill('hanbing_skill') && trigger.nature == 'thunder')) {
                            trigger.player.addSkill('_wulidebuff_jiansu'); trigger.player.addMark('_wulidebuff_jiansu');
                            if (trigger.player.hujia > 0) { trigger.num += (1); game.log('冰杀/寒冰剑雷杀对护甲加伤' + 1) };
                            game.log(get.translation(player.name) + '<span class=thundertext>减速了:</span>' + get.translation(trigger.player.name) + '小心随之而来的集火');
                            if (trigger.player.hp * 2 < trigger.player.maxHp) { player.$throwEmotion(trigger.player, 'wine') };
                        };

                        if (trigger.nature == 'thunder' && !player.hasSkill('hanbing_skill')) {
                            trigger.player.addSkill('_wulidebuff_jinshui'); trigger.player.addMark('_wulidebuff_jinshui', 1);
                            if ((trigger.player.hujia > 0 || trigger.player.hasSkillTag('maixie_defend')) && (!trigger.player.isLinked() || (trigger.player.isLinked() && link < 2 || trigger.num < 2))) {
                                trigger.player.loseHp(trigger.num); game.log('雷杀穿透护甲:', trigger.num); trigger.num -= (trigger.num), trigger.cancel
                            };
                            game.log(get.translation(player.name) + '让:' + get.translation(trigger.player.name) + '进水减手牌上限了');
                            if (trigger.player.hp * 2 < trigger.player.maxHp) { player.$throwEmotion(trigger.player, 'hehua') };
                        };
                        trigger.player.updateMarks();
                    },
                    subSkill: {
                        jiansu: {
                            name: "减速", intro: { marktext: "减速", content: function (player) { return ('减少1点与其他角色的防御距离，令舰船更容易被对手集火，雷杀的效果，不叠加计算'); }, },
                            priority: 3, forced: true, trigger: { player: ["phaseJieshuBegin", "dying"], },
                            filter: function (event, player) { return player.hasMark('_wulidebuff_jiansu') },
                            mod: { globalTo: function (from, to, distance) { return distance - to.hasMark('_wulidebuff_jiansu'); }, },
                            content: function () {
                                if (player.hasSkill('_wulidebuff_jiansu')) {
                                    player.removeSkill('_wulidebuff_jiansu'); player.removeMark('_wulidebuff_jiansu', player.countMark('_wulidebuff_jiansu'));
                                };
                            }, sub: true,
                        },
                        jinshui: {
                            mod: {
                                maxHandcard: function (player, num) {//手牌上限
                                    if (player.hasMark('_wulidebuff_jinshui')) { return num = num - 1 };
                                },
                            },
                            name: "进水", intro: { marktext: "进水", content: function (player) { return ('减少1点手牌上限，在出牌阶段会恢复，冰杀与袭击运输船的效果，不叠加计算也很可怕了'); }, },
                            priority: 2, forced: true, trigger: { player: ["phaseBegin", "phaseJieshuBegin", "dying"], }, filter: function (event, player) { return player.hasMark('_wulidebuff_jinshui') },
                            content: function () {
                                if (player.hasSkill('_wulidebuff_jinshui')) { player.removeSkill('_wulidebuff_jinshui'); player.removeMark('_wulidebuff_jinshui', player.countMark('_wulidebuff_jinshui')); };
                            },
                            sub: true,
                        },
                        ranshao: {
                            name: "燃烧",
                            forced: true, priority: 1, trigger: { player: ["phaseJieshuBegin", "dying"], },
                            filter: function (event, player) { return player.hasMark('_wulidebuff_ranshao') },
                            content: function () {
                                if (player.hasSkill('_wulidebuff_ranshao')) { if (event.triggername != 'dying') { if (player.hujia == 0) { player.draw(2); } else player.draw(1); player.damage(1, 'fire'); }; player.removeSkill('_wulidebuff_ranshao'); player.removeMark('_wulidebuff_ranshao', player.countMark('_wulidebuff_ranshao')); };
                            },
                            intro: {
                                marktext: "燃烧", content: function (player) {//+player.countMark('_wulidebuff_ranshao')+'次，'+tishi
                                    var player = _status.event.player; var tishi = '回合结束受到一点火焰伤害，摸两张牌（有护甲则不会触发摸牌），火杀带来的负面效果，本回合被攻击了' + player.countMark('_wulidebuff_ranshao') + '次，'; if (player.countMark('_wulidebuff_ranshao') > 0 && player.hp <= 2) { tishi += ('可能小命不保，求求队友给点力，发挥抽卡游戏的玄学力量。”') }; if (player.countMark('_wulidebuff_ranshao') > 2 && player.hp <= 2) { tishi += ('“被集火了，希望队友能能继续扛起重任。') }; if (player.identity == 'nei') { tishi += ('为了自己的光辉岁月，我内奸一定能苟住，一定要苟住') }; if (player.identity == 'zhu') { tishi += ('我的生命在燃烧，') }; if (player.identity == 'zho') { tishi += ('同志，救我，我被火力压制了。') }; if (player.identity == 'fan') { tishi += ('就怕火攻一大片啊，我们的大好前程被火杀打到功亏一篑') };
                                    return tishi;
                                },
                            }, sub: true,
                            ai: {
                                effect: {
                                    player: function (card, player) {
                                        var a = game.countPlayer(function (current) { return current != player && (!get.attitude(player, current) < 0 && (player.hasSkill == 'zhongxunca' || player.hasSkill == 'qingxun')); });
                                        if (card.name == 'tengjia') {
                                            var equip1 = player.getEquip(1); if (a > 0 || player.hasSkill == '_wulidebuff_ranshao') { return -10; };
                                            if (a > 0) return -1;
                                        }
                                    },
                                },
                            },
                        },
                    },
                    intro: { content: function () { return "属性效果"; }, },
                };
            };
            if (config.kaishimopao) {//优化摸牌时牌的质量的技能
                lib.skill._kaishimopao2 = {
                    superCharlotte: true, usable: 1, silent: true,
                    trigger: { global: "useCardToPlayered", },
                    filter: function (event, player) { return (game.phaseNumber == 1); },
                    content: function () {
                        if ((get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai')) && !player.hasSkill('kaishimopao')) {
                            player.addSkill('kaishimopao');
                        };
                    },
                };
            };
            if (config.diewulimitai) {//队友递杀
                lib.skill._diewulimitai2 = {
                    superCharlotte: true, usable: 1, silent: true,
                    trigger: { global: "useCardToPlayered", },
                    filter: function (event, player) { return (game.phaseNumber == 1); },
                    content: function () {
                        if ((get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai'))) {
                            if (!player.hasSkill('rendeonly2')) { player.addSkill('diewulimitai'); };
                        };
                    },
                };
            };
            if (config._hanbing_gai) {//增强寒冰剑
                lib.skill._hanbing_gai = {
                    inherit: "hanbing_skill",
                    trigger: { source: "damageBegin2", },
                    equipSkill: false, ruleSkill: true, firstDo: true,
                    filter: function (event, player) {//||player.hasSkill('hanbing_gai')
                        return (event.nature == 'ice' || player.hasSkill('hanbing_skill') && event.card && event.card.name == 'sha') && event.notLink() && event.player.getCards('he').length > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai'));
                    },
                    audio: "ext:舰R牌将:true",
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
                        event.num1 = trigger.num * 2; game.log(trigger.num, event.num1)
                        trigger.cancel();
                        "step 1"
                        if (trigger.player.countDiscardableCards(player, 'he')) {
                            player.line(trigger.player);
                            player.discardPlayerCard('he', trigger.player, true); player.addMark('_hanbing_gai');
                        } else {
                            var a = Math.floor((event.num1 - player.countMark('_hanbing_gai')) / 2); game.log(event.num1, Math.floor((event.num1 - player.countMark('_hanbing_gai')) / 2));
                            player.removeMark('_hanbing_gai', player.countMark('_hanbing_gai')); trigger.player.damage(a); event.finish();
                        };
                        "step 2"
                        if (player.countMark('_hanbing_gai') < event.num1 && player.countMark('_hanbing_gai')) { event.goto(1) } else {
                            player.removeMark('_hanbing_gai', player.countMark('_hanbing_gai'));
                        };
                    },
                    intro: { content: function () { return get.translation('__hanbing_gai' + '_info'); }, },
                };
            };
            if (config.tiaozhanbiaojiang) {//挑战技能，全局技能每一个人都有，所有人都受相同的一次触发条件触发此技能。
                lib.skill._tiaozhan3 = {
                    superCharlotte: true, usable: 1, silent: true,
                    trigger: { global: "useCardToPlayered", },
                    filter: function (event, player) { return (game.phaseNumber == 1); },
                    content: function () {
                        if (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai') {
                            if (!player.hasSkill('gzbuqu')) {
                                game.log(player.identity)
                                player.addSkill('gzbuqu'); player.addSkill('tiaozhanzhuanbei'); player.useSkill('tiaozhanzhuanbei'); player.loseHp(player.hp - 1); player.draw(player.hp * 2 - 1);
                            };
                        };
                    },
                };
            };
            if (config.qyzhugeliang) { //开局休闲类技能。
                lib.skill._qyzhugeliang = {
                    trigger: { global: "phaseBefore", player: "enterGame", }, forced: true,
                    filter: function (event, player) { return (event.name != 'phase' || game.phaseNumber == 0) && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai')); },
                    content: function () {
                        'step 0'
                        if (player.identity == 'zhu') {
                            event.choiceList = []; event.skills = []; event.cao = cards; event.jieshao = [];
                            event.skills = ['qixing', 'nzry_cunmu', 'huogong', 'repojun', 'nlianji', 'new_reyiji']; for (var skill of event.skills) {
                                event.jieshao.push([skill, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + '】</div><div>' + lib.translate[skill + '_info'] + '</div></div>'],);
                            };
                            event.choiceList = (event.jieshao);
                            event.first = true;    //存了6个变量，可以导出为button，与textbutton样式，看需求
                            var next = player.chooseButton(['令所有人获得一组技能或一张卡牌的使用权,用于熟悉游戏;这些技能（与附赠的技能）会在下一个回合开始后移除。', [event.choiceList, 'textbutton'],]);
                            next.set('selectButton', [1]);//可以选择多个按钮，可计算可加变量。
                            next.set('ai', function (button) {
                                switch (ui.selected.buttons.length) {
                                    case 0: return Math.random(); default: return 0;
                                }
                            });
                        };
                        'step 1'
                        game.log(result.links, result.bool);//只能返还这两个，所以更适合技能，更需要循环的方式进行计算。
                        if (result.bool) {  //player.addMark('Expup',event.cadechangdu);//先给经验再计算         miki_binoculars smyyingshi  gwjingtian gushe tongxie jyzongshi reqiaoshui nlianji zhuandui reluoyi zhongji
                            if (result.bool != 'cancel2') {
                                game.log(); var targets = game.filterPlayer();
                                var f = result.index; for (var i = 0; i < targets.length; i++) {
                                    if (result.links.contains('qixing')) { targets[i].addTempSkill('qixing', 'roundStart'); targets[i].addTempSkill('qixing2', 'roundStart') };
                                    if (result.links.contains('reguanxing')) { targets[i].addTempSkill('reguanxing', 'roundStart'); targets[i].addTempSkill('nzry_cunmu', 'roundStart'); targets[i].addTempSkill('gwjingtian', 'phaseZhunbeiBegin'); if (i < targets.length / 2 - 1) { var s = targets.length - i; targets[s].useSkill('reguanxing'); }; };
                                    if (result.links.contains('repojun')) { targets[i].addTempSkill('repojun', 'roundStart'); targets[i].addTempSkill('zhongji', 'roundStart'); targets[i].addTempSkill('tongxie', 'roundStart'); targets[i].addTempSkill('kaikang', 'roundStart') };
                                    if (result.links.contains('nlianji')) { targets[i].addTempSkill('nlianji', 'roundStart'); targets[i].addTempSkill('songshu', 'roundStart'); targets[i].addTempSkill('weimu', 'roundStart'); };
                                    if (result.links.contains('new_reyiji')) { targets[i].addTempSkill('jianxiong', 'roundStart'); targets[i].addTempSkill('ganglie', 'roundStart'); targets[i].addTempSkill('new_reyiji', 'roundStart'); };
                                    if (result.links.contains('huogong')) { targets[i].chooseUseTarget({ name: 'huogong' }); };
                                };
                            };
                        }
                    },
                }
            };
            if (config.yidong) {
                lib.skill._yidong = {
                    name: "移动座位", enable: "phaseUse", usable: 1,
                    prompt: "与相邻的队友交换座次，适合互相攻击临近的目标。<br>事件过程为：双方交换座次，之后若你的座次靠后并处于出牌阶段，<br>翻面，目标获得额外回合。",
                    filterTarget: function (card, player, target) {
                        return get.attitude(player, target) > 0 && player != target && target == player.next || target == player.previous;
                    }, selectTarget: 1,
                    filter: function (event, player) { return player.hasSkill('_yuanhang') },
                    content: function () {
                        game.log(game.countPlayer(function (current) { return current != player && (get.distance(current, player) == 1 && player.countCards('h', function (card) { return get.type(card, 'trick') == 'trick' }) || get.distance(current, player, 'attack') == 1 && lib.filter.cardUsable({ name: 'sha' }, player)) && get.attitude(player, current) < 0 }));
                        game.swapSeat(player, target);
                        if (target == player.previous) {
                            var evt = _status.event.getParent('phaseUse');
                            if (evt && evt.name == 'phaseUse') {//player.turnOver();
                                if (player.hasSkill('_yidong_yidong2')) { target.insertPhase(); palyer.addSkill('_yidong_yidong2'); }; event.finish();
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
                            filter: function (event, player) { return player.hasMark('_yidong_yidong2') },
                            content: function () {
                                if (player.hasMark('_yidong_yidong2')) { player.removeSkill('_yidong_yidong2'); player.removeMark('_yidong_yidong2', player.countMark('_yidong_yidong2')); };
                            }, intro: { content: function () { return ('移动过'); }, },
                        },
                    },
                };
            };
            if (config.jianrjinji) {
                for (var i in lib.characterPack['jianrjinji']) {
                    if (lib.character[i][4].indexOf("forbidai") < 0) lib.character[i][4].push("forbidai");
                };
            };//选项触发内容，原因见config

            lib.skill._DieSound = {//死亡时台词
                trigger: { global: 'dieBegin', },
                //direct:true,
                priority: 2,
                forced: true,
                unique: true,
                frequent: true,
                filter: function (event, player) {
                    game.log("死亡台词判断");
                    return true;
                },
                content: function () {
                    game.log("死亡台词触发");
                    game.playAudio('..', 'extension', '舰R牌将', trigger.player.name + ".mp3");
                    setTimeout(function () {
                        if (player.name2) {
                            game.playAudio('..', 'extension', '舰R牌将', trigger.player.name + ".mp3");
                        }
                    }, 1500);

                },
            }

            //全局技能写在这上面
        }, precontent: function (jianrjinji) {

            if (jianrjinji.enable) {
                //武将包,"qigong","qingnang"
                game.import('character', function () {
                    var jianrjinji = {
                        name: 'jianrjinji',//武将包命名（必填）
                        connect: true,//该武将包是否可以联机（必填）,"xianjinld""zhiyangai","baiyin_skill",
                        //全局技能"_yuanhang","_jianzaochuan","_qianghuazhuang",
                        characterSort:{
                            jianrjinji:{
                                jianrbiaozhun:[ "liekexingdun","qixichicheng","wufenzhongchicheng","dumuchenglinqiye","bisimai","misuli","weineituo","lisailiu","1913","changmen","kunxi","ougengqi","qingye","beianpudun","jiujinshan","jiujinshan","yixian","tianlangxing","dadianrendian","yatelanda","z31","xuefeng","kangfusi","47project","guzhuyizhichuixue","shuileizhanduichuixue","minsike","yinghuochong","u1405","baiyanjuren","changchun"],
                                lishizhanyi_naerweike:["",""],
                                lishizhanyi_matapanjiao:["",""],
                                lishizhanyi_danmaihaixia:["",""],
                                lishizhanyi_shanhuhai:["",""],
                                lishizhanyi_haixiafujizhan:["",""],
                            },
                          
                        },
                        character: {
                            liekexingdun: ["female", "USN", 4, ["hangmucv", "hangkongzhanshuxianqu"], ["zhu", "des:血量中等的航母，温柔，体贴，过渡期追着大船打的航母。"]],
                            qixichicheng: ["female", "IJN", 4, ["hangmucv", "qixi_cv"], ["zhu", "des:大佬友情放出精美壁纸，坚定与自信的姿态"]],
                            wufenzhongchicheng: ["female", "IJN", 4, ["hangmucv", "mingyundewufenzhong"], ["des:大佬友情放出精美壁纸，坚定与自信的姿态"]],
                            dumuchenglinqiye: ["female", "USN", 4, ["hangmucv", "dumuchenglin"], ["des:有必中攻击，快跑"]],
                            bisimai: ["female", "KMS", 4, ["zhuangjiafh", "zhanliebb", "qijianshashou"], ["zhu", "des:更多刮痧炮，更多炮弹，更多削弱光环，更多护甲模组，更多血量。"]],
                            misuli: ["female", "USN", 4, ["zhuangjiafh", "zhanliebb", "jueshengzhibing", "zhanfu"], ["des:用精巧的手枪去质疑，用绝对的火力回击对手。"]],
                            weineituo: ["female", "RM", 4, ["zhuangjiafh", "zhanliebb", "yishisheji", "yishisheji_1"], ["des:身材小，而强度惊人。"]],
                            lisailiu: ["female", "MN", 4, ["zhuangjiafh", "zhanliebb", "kaixuanzhige"], ["des:幸运的象征之一，同时有着丰富的精神象征。"]],
                            changmen: ["female", "IJN", 4, ["zhuangjiafh", "zhanliebb", "zhudaojiandui"], ["des:。"]],
                            "1913": ["female", "ROCN", 4, ["zhuangjiafh", "zhanliebb", "jujianmengxiang", "jujianmengxiang_reflash"], ["zhu", "des:在大舰巨炮的黄金年代，让国人也拥有主力战舰，堪称最为奢侈的海军梦想了——而今日，妾身有幸以此姿态回应诸位之诉求。"]],
                            kunxi: ["female", "USN", 4, ["huokongld", "zhongxunca", "gaosusheji"], ["des:画师优秀的功底让这名角色美而可爱，这是出色的角色塑造。"]],
                            ougengqi: ["female", "KMS", 4, ["huokongld", "zhongxunca", "zhanxianfangyu", "zhanxianfangyu1"], ["des:励志偶像，与标志性舰装，给人以强大的保护。"]],
                            qingye: ["female", "IJN", 4, ["huokongld", "zhongxunca", "sawohaizhan", "qingyeqingyeqing"], ["des:励志偶像，与一首动人的歌，与一段坎坷旅途。"]],
                            beianpudun: ["female", "USN", 4, ["huokongld", "zhongxunca", "huhangyuanhu"], ["des:励志青年，在旅途中成长，与恋人坚定的望向远方。"]],
                            jiujinshan: ["female", "USN", 4, ["huokongld", "zhongxunca", "jiujingzhanzhen"], ["des:航海服饰，侦查员与火炮观瞄。"]],
                            yixian: ["female", "ROCN", 3, ["fangkong2", "qingxuncl", "shizhibuyu", "shizhibuyu1"], ["des:经典美术设计的款式，意气风发，威猛先生"]],
                            tianlangxing: ["female", "RN", 3, ["fangkong2", "qingxuncl", "duomianshou"], ["des:阻敌计谋表现优秀，这是先发制敌的优势所在，"]],
                            dadianrendian: ["female", "IJN", 3, ["fangkong2", "qingxuncl", "jilizhixin"], ["des:手持竹伞的轻巡，辅助队友，防御攻击。"]],
                            //degelasi: ["female", "MN", 3, ["fangkong2", "qingxuncl"], ["des:现代文职服饰，一看就很会办公。"]],
                            yatelanda: ["female", "USN", 3, ["fangkong2", "qingxuncl", "duikongfangyu"], ["des:双枪射手点形象，其双枪能以极快的射速打出爆炸弹匣，清空一小片区域。"]],
                            "z31": ["female", "KMS", 3, ["huibi", "quzhudd", "Zqujingying"], ["des:婚纱与轻纱是多数人的美梦,与绿草平原，与绿水青山"]],
                            xuefeng: ["female", "IJN", 3, ["huibi", "quzhudd", "xiangrui", "yumian"], ["des:幸运的驱逐舰，多位画师、花了大款的大佬亲情奉献。"]],
                            kangfusi: ["female", "USN", 3, ["huibi", "quzhudd", "31jiezhongdui"], ["des:水手服欸,优秀的构图，不过图少改造晚。"]],
                            "47project": ["female", "ΒΜΦCCCP", 3, ["huibi", "quzhudd", "xinqidian"], ["des:这是个依赖科技的舰船，有着科幻的舰装，与兼备温柔体贴与意气风发的表现。"]],
                            guzhuyizhichuixue: ["female", "IJN", 3, ["huibi", "quzhudd", "guzhuyizhi"], ["des:水手服与宽袖的结合，给人以温柔的感觉。"]],
                            shuileizhanduichuixue: ["female", "IJN", 3, ["huibi", "quzhudd", "shuileizhandui",], ["des:水手服与宽袖的结合，给人以温柔的感觉。"]],
                            minsike: ["female", "ΒΜΦCCCP", 3, ["huibi", "quzhudd", "manchangzhanyi", "manchangzhanyi_1"], ["des:跑得快，看得多。"]],
                            yinghuochong: ["female", "RN", 3, ["huibi", "quzhudd", "zhongzhuangcike", "wuweizhuangji"], ["des:为你施加勇气的魔法!"]],
                            "u1405": ["female", "KMS", 3, ["qianting", "qianxingtuxi"], ["des:无需隐匿的偷袭大师，马上就让对手的后勤捉襟见肘。"]],
                            baiyanjuren: ["female", "RN", 3, ["junfu", "hangkongzhanshuguang"], ["des:需要武器支援，伙计倒下了。"]],
                            changchun: ["female", "PLAN", 3, ["daoqu", "rand", "sidajingang"], ["des:尚处于正能量之时。"]],

                            skilltest: ["male", "OTHER", 9, ["zhanlie"], ["forbidai", "des:测试用"]],
                        },
                        skill: {
                            _yuanhang: {
                                name: "远航", "prompt2": "当你有摸牌标记时，你失去手牌后能摸1张牌，然后失去1个摸牌标记，自己回合暂时+1标记上限并回满标记，标记上限x个，可在强化中提升X值。", intro: { marktext: "摸牌", content: function (player, mark) { ; var a = game.me.countMark('_yuanhang_mopai'); return '手牌较少时，失去手牌可以摸一张牌，还可以摸' + a + '次，其他角色回合开始时会回复一个标记'; }, },
                                group: ["_yuanhang_mopai", "_yuanhang_kaishi", "_yuanhang_bingsimopai", "_yuanhang_dietogain"],
                                mod: {
                                    maxHandcard: function (player, num) {
                                        var a = 0; if (player.hasSkill('qianting')) { var a = a + 1 };
                                        if (player.hp < player.maxHp) { a += (1) }; if (player.hp <= 0) { a += (1) };
                                        return num = (num + a);
                                    },
                                },
                                trigger: { global: "phaseBefore", player: "enterGame", }, forced: true, priority: -1,
                                filter: function (event, player) {
                                    return (event.name != 'phase' || game.phaseNumber == 0) && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai'));
                                },
                                content: function () {
                                    if (player.identity == 'zhu') { player.changeHujia(1); game.log() };
                                },
                                intro: { content: function () { return get.translation(_yuanhang + '_info'); }, },
                                subSkill: {
                                    mopai: {
                                        name: "远航摸牌", frequent: true,
                                        trigger: { player: "loseAfter", global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"], },
                                        filter: function (event, player) {
                                            var d = (player.getHandcardLimit() / 2), a = 0; if (player == _status.currentPhase) { a += (1) };
                                            if (player.countCards('h') > d) return false;
                                            var evt = event.getl(player);
                                            if (!player.countMark('_yuanhang_mopai')) return false;
                                            return evt && evt.player == player && evt.hs && evt.hs.length > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai'));
                                        },
                                        content: function () { player.draw(1); player.removeMark('_yuanhang_mopai'); },
                                        sub: true,
                                    },
                                    kaishi: {
                                        name: "远航回合开始时", fixed: true, silent: true, friquent: true,
                                        trigger: { global: "phaseBegin", },
                                        content: function () {//else if(!player.countMark('mopaiup')<1&&player.countCards('h','shan')<1){player.draw()}
                                            var a = player.countMark('mopaiup'); var b = player.countMark('_yuanhang_mopai'); game.log(event.skill != 'huijiahuihe');
                                            if (player == _status.currentPhase && event.getParent('phase').skill != 'huijiahuihe') { a += (1); if (a - b > 0) player.addMark('_yuanhang_mopai', a - b); };
                                            /*if(a>b&&player!=_status.currentPhase){player.addMark('_yuanhang_mopai',1);};*/
                                        },//远航每回合恢复标记被砍掉了。现在只有每轮开始恢复标记。
                                        sub: true,
                                    },
                                    dietogain: {
                                        name: "远航死后给牌", trigger: { player: ["dieAfter"], }, direct: true, forceDie: true,
                                        filter: function (event, player) { if (event.name == 'die') return true; return player.isAlive() && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai'));; },
                                        content: function () {
                                            'step 0'
                                            event.count = trigger.num || 1;
                                            'step 1'
                                            event.count--;//让优势方有一轮的挑战，因为第二轮对手就因为过牌量下降而失去威胁。
                                            player.chooseTarget(get.prompt2('在离开战斗前，若你的身份：<br>是忠臣，你可令一名角色摸2张牌；<br>是反贼，令一名角色摸1张牌；<br>内奸，令一名角色获得一张闪。<br>或许会有转机出现。'), function (card, player, target) { return target.maxHp > 0; }).set('ai', function (target) {
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
                                        name: "濒死摸牌", usable: 2, fixed: true, mark: false,
                                        trigger: { player: "changeHp", },
                                        filter: function (event, player) { return player.hp <= 0 && event.num < 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai')); },
                                        "prompt2": function (event, player) {
                                            if ((player.hasMark('_yuanhang_bingsimopai'))) { return '当你进入濒死状态时，你可以摸一张牌,<br>若血量上限大于2，你需失去一点体力上限，摸一张牌。' };
                                            if ((!player.hasMark('_yuanhang_bingsimopai'))) { return '当你进入濒死状态时，你可以摸一张牌,<br>若血量上限大于2，你需失去一点体力上限，摸一张牌。同时，依据舰种获得以下技能：<br>潜艇-志继（姜维）、重生（）；驱逐-镇卫（文聘）、齐攻（）；<br>轻巡-齐攻；重巡-刚烈改（改自夏侯惇）；<br>战列-刚烈改（夏侯惇)；航母-界连营（陆逊）；军辅：藏匿（）；导驱-界连营（陆逊）' };
                                        },
                                        content: function () {//兵粮寸断与据守，刚烈， 镇卫同疾吸伤害，国风防锦囊牌。
                                            //轻巡提升己方防守与攻击距离，粮策全体发牌。重巡提供免伤。战列刚烈反击。 
                                            player.draw(1); if (player.maxHp > 2) { player.loseMaxHp(1); player.draw(); } else /*game.playAudio('..','extension','舰R牌将/audio','bingsimosanpai')*/; if (player.maxHp > 5) { player.loseMaxHp(1); player.draw(); game.log('血量上限好高啊，额外来一次扣血摸牌吧', player); }
                                            if (!player.hasMark('_yuanhang_bingsimopai')) {
                                                //if(player.hasSkill('qianting')){player.addSkill('olzhiji');;};
                                                //if(player.hasSkill('quzhudd')){player.addSkill('hzhenwei');player.addSkill('qigong')};
                                                //if(player.hasSkill('qingxuncl')){player.addSkill('qigong')};
                                                // if(player.hasSkill('zhongxunca')){player.addSkill('ganglie_gai')};
                                                //if(player.hasSkill('zhanliebb')){player.addSkill('ganglie_gai')};
                                                // if(player.hasSkill('hangmucv')){player.addSkill('relianying')};
                                                // if(player.hasSkill('junfu')){player.addSkill('spcangni')};
                                                //if(player.hasSkill('daoqu')){player.addSkill('relianying')}; 
                                            }; trigger.player.addMark('_yuanhang_bingsimopai', 1);
                                        },
                                        intro: {
                                            marktext: "濒死", content: function (player) {
                                                var player = _status.event.player, a = player.countMark('_yuanhang_bingsimopai'), tishi = '因濒死而减少的体力上限，牺牲上限，获得应急的牌，保一时的平安。<br>'; if (a > 0 && a <= 2 && player.hp <= 2) { tishi += ('勇敢的前锋<br>') }; if (a > 2 && a < 4 && player.hp <= 2) { tishi += ('rn勇的中坚<br>') }; if (a >= 4 && player.hp <= 2) { tishi += ('顽强的、折磨对手的大将<br>') };
                                                return tishi;
                                            },
                                        }, sub: true,
                                    },
                                },
                            },
                            _jianzaochuan: {
                                name: "建造", prompt: function (event, player) {//<br>或弃置三张牌，回复一点血量。或弃置四张牌，回复两点体力,两个改动的测试结果是过于强悍.
                                    if (event.parent.name == 'phaseUse') { return '1.出牌阶段，<br>你可以弃置3张不同花色的牌，提升一点血量上限。' }; if (event.type == 'dying') { return "2.当你濒死时，<br>你可以弃置4张不同花色的牌，回复一点体力。" };
                                }, limited: false, complexCard: true,
                                enable: "chooseToUse", position: "hejs",
                                filter: function (event, player) {
                                    var info = lib.skill._qianghuazhuang.getInfo(player); var a = info[0] + info[1] + info[2] + info[3] + info[4] + info[5];
                                    /*if (event.type == 'dying') { if (player != event.dying) return false; return player.countCards('hejs') >= 3; }
                                    else*/ if (event.parent.name == 'phaseUse' && (a) > 0 && !player.hasMark('_jianzaochuan')) { return (player.countCards('hejs') >= 2) && a && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai')); } return false;//没有建造标记时才能建造，即主动建造上限1次，
                                },
                                selectCard: function (event, player) { var event = _status.event; /*if (event.type == 'dying') return [4, 4];*/ return [3, 3]; },
                                filterCard: function (card) {
                                    var suit = get.suit(card);
                                    for (var i = 0; i < ui.selected.cards.length; i++) {
                                        if (get.suit(ui.selected.cards[i]) == suit) return false;
                                    }
                                    return true;
                                },
                                check: function (card) {
                                    var player = _status.event.player; var event = _status.event; var huifu = player.countCards('h', 'jiu') + player.countCards('h', 'tao');
                                    if (player != event.dying && (player.hp < player.maxHp) && (player.countCards('h') > 4 || !player.hasMark('_jianzaochuan'))) return 11 - get.value(card);
                                    if (player.hp <= 0 && (huifu < (-player.hp + 1) || !player.hasMark('_jianzaochuan'))) return 15 - get.value(card);
                                },
                                content: function () {
                                    player.addMark('_jianzaochuan'); game.log(event.parent.name, event.cards);
                                    if (event.cards.length <= 3) { player.gainMaxHp(1); }; /*if (event.cards.length > 3) { player.recover(); };*/
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
                                mark: false, intro: { content: function () { return get.translation('建造的次数，用于提升升级上限。'); }, },
                            },
                            _qianghuazhuang: {
                                name: "强化装备", prompt: "每回合限一次，你可以弃置二至四张牌，将手牌转化为强化点数，<br>每2点强化点数换一个永久的效果升级。<br>（可选择如减少技能消耗、增加武器攻击距离、提高手牌上限等）<br>强化上限为建造的次数，最高强化至2级。<br>已存储的经验会降低弃牌最低牌数", mark: true, intro: {
                                    marktext: "装备", content: function (storage, player) {//只有content与mark可以function吧，内容，介绍的文字与内容。
                                        var info = lib.skill._qianghuazhuang.getInfo(player);
                                        return '<div class="text center"><span class=greentext>用一摸一:' + info[0] + '<br>技能耗牌：' + info[1] + '</span><br><span class=firetext>出杀距离：-' + info[2] + '<br>攻击次数:' + info[3] + '</span><br><span class=thundertext>被杀距离：+' + info[4] + '<br>手牌上限:' + info[5] + '<br>Exp:' + info[7] + '</span></div>';
                                    },
                                },
                                mod: {
                                    attackFrom: function (from, to, distance) {
                                        var a = 0; if (from.countMark('wuqiup')) { var a = a + from.countMark('wuqiup') }; return distance = (distance - a)
                                    },
                                    attackTo: function (from, to, distance) {
                                        var a = 0; if (to.countMark('jidongup')) { var a = a + to.countMark('jidongup') }; return distance = (distance + a)
                                    },
                                    cardUsable: function (card, player, num) {
                                        var a = 0; if (card.name == 'sha') return num = num += (player.countMark('useshaup'))
                                    },
                                    maxHandcard: function (player, num) {
                                        var a = 0; if (player.countMark('shoupaiup')) { var a = a + player.countMark('shoupaiup') }; return num = (num + a);
                                    },
                                },
                                direct: true, enable: "phaseUse", usable: 1,
                                init: function (player) {//初始化数组，也可以运行事件再加if后面的内容
                                    if (!player.storage._qianghuazhuang) player.storage._qianghuazhuang = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                                },
                                getInfo: function (player) {//让其他技能可以更简单的获取该技能的数组。
                                    if (!player.storage._qianghuazhuang) player.storage._qianghuazhuang = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                                    return player.storage._qianghuazhuang;
                                },
                                filter: function (event, player) {//
                                    var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, lv = 0; if (k < 3) { lv = k * 6 };/*if(k>=3){lv=k+10};*///远航上限降低为2，总可用强化数量公式作相应修改
                                    if (player.countCards('h') > 0) { if ((a + b + c + d + e + f + g) >= (lv)) return false }; return player.countCards('h') > 1 || player.countMark('Expup') > 1;
                                    //比较保守的设计，便于设计与更改。
                                    ;
                                }, filterCard: {}, position: "h", selectCard: function (card) {
                                    var player = _status.event.player, num = 0;/*num+=(player.countMark('Expup'));if(ui.selected.cards.length&&get.type(ui.selected.cards[0],'equip')=='equip'){num+=(1)};if(ui.selected.cards.length>1&&get.type(ui.selected.cards[1],'equip')=='equip'){num+=(1)};*///装备不再记为2强化点数
                                    return [Math.max(2 - num, 0), Math.max(4 - num, 2)];
                                },

                                check: function (card) {//ui，参考仁德，ai执行判断，卡牌价值大于1就执行（只管卡片）当然，能把玩家设置进来就可以if玩家没桃 return-1。
                                    var player = _status.event.player;
                                    if (ui.selected.cards.length && get.type(ui.selected.cards[0], 'equip') == 'equip') return 5 - get.value(card);
                                    if (ui.selected.cards.length >= Math.max(1, player.countCards('h') / 2)) return 0;
                                    if (game.phaseNumber < 3) return 7 - get.value(card);
                                    return 3 - get.value(card);
                                },
                                content: function () {//choiceList.unshift
                                    'step 0'
                                    var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, exp1 = 0;
                                    player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h, k]; event.cadechangdu = event.cards.length;
                                    event.choiceList = []; event.list = []; event.cao = cards;
                                    for (var i = 0; i < event.cao.length; i += (1)) { if (get.type(event.cao[i], 'equip') == 'equip') { player.addMark('Expup1', 1) } else player.addMark('Expup1', 1); game.log(player.countMark('Expup1'), '卡牌:', event.cao[0], '类别', get.type(event.cao[i], 'equip'), get.type(event.cao[i], 'equip') == 'equip'); }; exp1 = player.countMark('Expup1');
                                    event.jieshao = ['后勤保障：上限+' + (a + 1) + '→' + (a + 2) + '远航（用一摸一）标记上限，<br>手牌少于手牌上限1/2时，失去手牌会摸一张牌。防守反击的保障<br>每轮上限1/2/3，在自己的回合重置使用次数。', '技能升级：+' + (b) + '→' + (b + 1) + '，重巡-降低必中攻击限制(杀/黑牌/任意牌)、轻巡-增加无效群体锦囊牌范围(1/2/3)、航母-降低万箭齐发限制(黑桃与梅花/黑桃与梅花与红桃/任意牌);<br>战列舰-增加防护范围(杀造成的伤害/杀和锦囊牌造成的伤害/所有伤害)，导驱-增加射程(2/3/4)、潜艇-降低雷杀条件(红桃/红桃或黑桃/红桃或黑桃或方块);<br>驱逐-增加回避概率(0.25/0.33/0.50)、军辅-增加存牌上限(1/2/3)。', '射程升级：+' + c + '→' + (c + 1) + '武器（出杀）攻击距离，<br>增加出杀范围，虽然不增加锦囊牌距离，但胜在永久', '速射炮管：+' + d + '→' + (d + 1) + '出杀次数，<br>作为连弩的临时替代，进行多刀输出。', '改良推进器：+' + e + '→' + (e + 1) + '武器（被杀）防御距离<br>对手有更远的出杀范围才能对你出杀时，但不能防御锦囊牌。', '物流运输：+' + f + '→' + (f + 1) + '手牌上限，且蝶舞递装备给杀的距离提升，<br>双方状态差距越大，保牌效果越强。', '经验：+' + h + '→' + (player.countMark('Expup1')) + '，将卡牌转为经验，供下次升级。（直接点确定也行）<br>1级技能需要两张牌才能强化，2级技能需要三张牌才能强化。<br>但无名杀不能读取这个界面的文本，导致四点经验即可强化两个不同等级技能']//player.getEquip(1)，定义空数组，push填充它，事件变量可以自定义名字，什么都可以存。game.log('已强化:',a+b+c+d);
                                    var info = lib.skill._qianghuazhuang.getInfo(player);
                                    if (info[0] < k && (info[0] + 2 <= info[7] + exp1) && info[0] <= 2) {
                                        event.list.push('mopaiup');
                                        event.choiceList.push(['mopaiup', event.jieshao[0]]);
                                    };
                                    if (info[1] < k && (info[1] + 2 <= info[7] + exp1) && info[1] <= 2) {
                                        event.list.push('jinengup');
                                        event.choiceList.push(['jinengup', event.jieshao[1]]);
                                    };
                                    if (info[2] < k && (info[2] + 2 <= info[7] + exp1) && info[2] <= 2) {
                                        event.list.push('wuqiup');
                                        event.choiceList.push(['wuqiup', event.jieshao[2]]);
                                    };//若此值：你强化的比目标多时，+1含锦囊牌防御距离。
                                    if (info[3] < k && (info[3] + 2 <= info[7] + exp1) && info[3] <= 2) {
                                        event.list.push('useshaup');
                                        event.choiceList.push(['useshaup', event.jieshao[3]]);
                                    };
                                    if (info[4] < k && (info[4] + 2 <= info[7] + exp1) && info[4] <= 2) {
                                        event.list.push('jidongup');
                                        event.choiceList.push(['jidongup', event.jieshao[4]]);
                                    };
                                    if (info[5] < k && (info[5] + 2 <= info[7] + exp1) && info[5] <= 2) {
                                        event.list.push('shoupaiup');
                                        event.choiceList.push(['shoupaiup', event.jieshao[5]]);
                                    };
                                    //      if(info[6]<k&&(info[0]+2<=info[7])&&info[6]<2){event.list.push('songpaiup');
                                    //  event.choiceList.push('+'+g+'→'+(g+1)+'给牌次数，<br>提升“先进雷达”技能的送牌范围。');};
                                    if (info[7] <= k && info[7] < 6) {
                                        event.list.push('Expup');
                                        event.choiceList.push(['Expup', event.jieshao[6]]);
                                    };
                                    event.first = true;    //存了6个变量，可以导出为button，与textbutton样式，看需求
                                    var next = player.chooseButton([
                                        '将手牌转化为强化点数强化以下能力；取消将返还卡牌，<br>未使用完的点数将保留，上限默认为1，发动建造技能后提高。',
                                        [event.choiceList, 'textbutton'],
                                    ]);
                                    var xuanze = event.cao.length;/*xuanze+=(player.countMark('Expup'));if(event.cao.length&&get.type(event.cao[0],'equip')=='equip'){xuanze+=(1)};if(event.cao.length>1&&get.type(event.cao[1],'equip')=='equip'){xuanze+=(1)};*///装备不再记为两张牌
                                    next.set('selectButton', function (button) { return [0, Math.max(Math.floor(xuanze / 2), 0)] });//else {next.set('selectButton',[0,Math.max(xuanze,0)])}; //可以选择多个按钮，可计算可加变量。get.select(event.selectButton)为其调取结果。
                                    next.set('filterButton', function (button) {
                                        var event = _status.event; if (ui.selected.buttons) {//for(var i=0;i<event.cao.length;i+=(1)){};测试失败的函数组合game.log(ui.selected.buttons,get.selectableButtons().contains(ui.selected.buttons),get.selectableButtons());游戏无名杀Button的限制，这个代码并没有起到实时计算的作用。
                                            return true; return xuanze >= player.countMark(ui.selected.buttons[0]) * 0.5 + 1;
                                        }
                                    });
                                    next.set('prompt', get.prompt('_qianghuazhuang'), '令其中一项+1,好吧不显示这个info');
                                    next.set('ai', function (button) {
                                        var haode = [event.jieshao[0], event.jieshao[1]]; var yingji = []; var tunpai = [event.jieshao[5]];//其实一个例子就行，不如直接if(){return 2;};
                                        if (game.hasPlayer(function (current) { return current.inRange(player) && get.attitude(player, current) < 0; }) < 1) { yingji.push(event.jieshao[2]) } else if (player.countCards('h', { name: 'sha' }) > 1) { yingji.push(event.jieshao[3]) };
                                        if (game.hasPlayer(function (current) { return player.inRange(current) && get.attitude(player, current) < 0; }) > 0) yingji.push(event.jieshao[4]);
                                        switch (ui.selected.buttons.length) {
                                            case 0:
                                                if (haode.contains(button.link)) return 3;
                                                if (yingji.contains(button.link)) return 2;
                                                if (tunpai.contains(button.link)) return 1;
                                                return Math.random();
                                            case 1:
                                                if (haode.contains(button.link)) return 3;
                                                if (yingji.contains(button.link)) return 2;
                                                if (tunpai.contains(button.link)) return 1;
                                                return Math.random();
                                            case 2:
                                                return Math.random();
                                            default: return 0;
                                        }
                                    });
                                    'step 1'
                                    game.log(result.links, result.bool)//只能返还这两个，所以更适合技能，更需要循环的方式进行计算。
                                    if (!result.bool) { ; player.gain(event.cao, player); player.removeMark('Expup1', player.countMark('Expup1')); event.finish(); };//返还牌再计算
                                    if (result.bool) {  //player.addMark('Expup',event.cadechangdu);//先给经验再计算扣除经验升级，随着此项目的升级，花费也越多。通过一个有序的清单，遍历比对返回的内容，来定位要增加的标记/数组。
                                        player.addMark('Expup', player.countMark('Expup1')); player.removeMark('Expup1', player.countMark('Expup1'));
                                        for (var i = 0; i < result.links.length; i += (1)) { if (!result.links.contains('Expup')) { player.addMark(result.links[i], 1); player.removeMark('Expup', 1 + player.countMark(result.links[i])); game.log('数组识别:', result.links[i], '编号', i, '，总编号', result.links.length - 1); } }
                                    };
                                    //    if(event.choiceList.length<event.cao){player.addMark('Expup',1);};从0开始，当介绍数组有内容==选项数组的内容（第i个），就加的简称数组第i个(内容)标签。并通过game.log()调试,在出牌记录中查看执行效果。result.links.contains(event.list[i])&&
                                    'step 2'
                                    var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1; game.log('结束', a, b, c, d, e, f, g, h, k);
                                    player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h];
                                },
                                ai: {
                                    order: function (player) { var player = _status.event.player; if (player.countMark('_jianzaochuan') < 3) { return 7 }; return 1 }, threaten: 0,
                                    result: {
                                        player: function (player) {
                                            var player = _status.event.player;
                                            var num = player.countCards('e') + player.countCards('h', { name: 'shan' }) - 1;
                                            return num;
                                        },
                                    },
                                },//装备上装备以后，ai剩下的装备可以考虑强化，应该会保留防具吧。
                            },
                            _wulidebuff: {
                                name: "属性效果", lastDo: true, forced: true, trigger: { source: "damageBefore", },
                                filter: function (event, player) {
                                    if ((event.nature && player != event.player) && event.num > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai')))
                                        return true
                                },
                                content: function () {
                                    var link = (game.hasPlayer(function (current) { return get.attitude(player, current) < 0 && current == trigger.player && current.isLinked(); }) - game.hasPlayer(function (current) { return get.attitude(player, current) > 0 && current == trigger.player && current.isLinked(); }));
                                    if (trigger.nature == 'fire') {
                                        {
                                            trigger.player.addSkill('_wulidebuff_ranshao'); trigger.player.addMark('_wulidebuff_ranshao', 1);
                                            game.log(get.translation(player.name) + '<span class=firetext>燃烧</span>' + get.translation(trigger.player.name) + '<span class=thundertext>,ta还能坚持到出完牌');
                                        };
                                        if (trigger.player.hp * 2 < trigger.player.maxHp) { player.$throwEmotion(trigger.player, 'yanhua') };/*game.playAudio('..','extension','舰R牌将/audio','_wulidebuff')*/;
                                    };


                                    if (trigger.nature == 'ice' || (player.hasSkill('hanbing_skill') && trigger.nature == 'thunder')) {
                                        trigger.player.addSkill('_wulidebuff_jiansu'); trigger.player.addMark('_wulidebuff_jiansu');
                                        if (trigger.player.hujia > 0) { trigger.num += (1); game.log('冰杀/寒冰剑雷杀对护甲加伤' + 1) };
                                        game.log(get.translation(player.name) + '<span class=thundertext>减速了:</span>' + get.translation(trigger.player.name) + '小心随之而来的集火');
                                        if (trigger.player.hp * 2 < trigger.player.maxHp) { player.$throwEmotion(trigger.player, 'wine') };
                                    };

                                    if (trigger.nature == 'thunder' && !player.hasSkill('hanbing_skill')) {
                                        trigger.player.addSkill('_wulidebuff_jinshui'); trigger.player.addMark('_wulidebuff_jinshui', 1);
                                        if ((trigger.player.hujia > 0 || trigger.player.hasSkillTag('maixie_defend')) && (!trigger.player.isLinked() || (trigger.player.isLinked() && link < 2 || trigger.num < 2))) {
                                            trigger.player.loseHp(trigger.num); game.log('雷杀穿透护甲:', trigger.num); trigger.num -= (trigger.num), trigger.cancel
                                        };
                                        game.log(get.translation(player.name) + '让:' + get.translation(trigger.player.name) + '进水减手牌上限了');
                                        if (trigger.player.hp * 2 < trigger.player.maxHp) { player.$throwEmotion(trigger.player, 'hehua') };
                                    };
                                    trigger.player.updateMarks();
                                },
                                subSkill: {
                                    jiansu: {
                                        name: "减速", intro: { marktext: "减速", content: function (player) { return ('减少1点与其他角色的防御距离，令舰船更容易被对手集火，雷杀的效果，不叠加计算'); }, },
                                        priority: 3, forced: true, trigger: { player: ["phaseJieshuBegin", "dying"], },
                                        filter: function (event, player) { return player.hasMark('_wulidebuff_jiansu') },
                                        mod: { globalTo: function (from, to, distance) { return distance - to.hasMark('_wulidebuff_jiansu'); }, },
                                        content: function () {
                                            if (player.hasSkill('_wulidebuff_jiansu')) {
                                                player.removeSkill('_wulidebuff_jiansu'); player.removeMark('_wulidebuff_jiansu', player.countMark('_wulidebuff_jiansu'));
                                            };
                                        }, sub: true,
                                    },
                                    jinshui: {
                                        mod: {
                                            maxHandcard: function (player, num) {//手牌上限
                                                if (player.hasMark('_wulidebuff_jinshui')) { return num = num - 1 };
                                            },
                                        },
                                        name: "进水", intro: { marktext: "进水", content: function (player) { return ('减少1点手牌上限，在出牌阶段会恢复，冰杀与袭击运输船的效果，不叠加计算也很可怕了'); }, },
                                        priority: 2, forced: true, trigger: { player: ["phaseBegin", "phaseJieshuBegin", "dying"], }, filter: function (event, player) { return player.hasMark('_wulidebuff_jinshui') },
                                        content: function () {
                                            if (player.hasSkill('_wulidebuff_jinshui')) { player.removeSkill('_wulidebuff_jinshui'); player.removeMark('_wulidebuff_jinshui', player.countMark('_wulidebuff_jinshui')); };
                                        },
                                        sub: true,
                                    },
                                    ranshao: {
                                        name: "燃烧",
                                        forced: true, priority: 1, trigger: { player: ["phaseJieshuBegin", "dying"], },
                                        filter: function (event, player) { return player.hasMark('_wulidebuff_ranshao') },
                                        content: function () {
                                            if (player.hasSkill('_wulidebuff_ranshao')) { if (event.triggername != 'dying') { if (player.hujia == 0) { player.draw(2); } else player.draw(1); player.damage(1, 'fire'); }; player.removeSkill('_wulidebuff_ranshao'); player.removeMark('_wulidebuff_ranshao', player.countMark('_wulidebuff_ranshao')); };
                                        },
                                        intro: {
                                            marktext: "燃烧", content: function (player) {//+player.countMark('_wulidebuff_ranshao')+'次，'+tishi
                                                var player = _status.event.player; var tishi = '回合结束受到一点火焰伤害，摸两张牌（有护甲则不会触发摸牌），火杀带来的负面效果，本回合被攻击了' + player.countMark('_wulidebuff_ranshao') + '次，'; if (player.countMark('_wulidebuff_ranshao') > 0 && player.hp <= 2) { tishi += ('可能小命不保，求求队友给点力，发挥抽卡游戏的玄学力量。”') }; if (player.countMark('_wulidebuff_ranshao') > 2 && player.hp <= 2) { tishi += ('“被集火了，希望队友能能继续扛起重任。') }; if (player.identity == 'nei') { tishi += ('为了自己的光辉岁月，我内奸一定能苟住，一定要苟住') }; if (player.identity == 'zhu') { tishi += ('我的生命在燃烧，') }; if (player.identity == 'zho') { tishi += ('同志，救我，我被火力压制了。') }; if (player.identity == 'fan') { tishi += ('就怕火攻一大片啊，我们的大好前程被火杀打到功亏一篑') };
                                                return tishi;
                                            },
                                        }, sub: true,
                                        ai: {
                                            effect: {
                                                player: function (card, player) {
                                                    var a = game.countPlayer(function (current) { return current != player && (!get.attitude(player, current) < 0 && (player.hasSkill == 'zhongxunca' || player.hasSkill == 'qingxun')); });
                                                    if (card.name == 'tengjia') {
                                                        var equip1 = player.getEquip(1); if (a > 0 || player.hasSkill == '_wulidebuff_ranshao') { return -10; };
                                                        if (a > 0) return -1;
                                                    }
                                                },
                                            },
                                        },
                                    },
                                },
                                intro: { content: function () { return "属性效果"; }, },
                            },
                            _hanbing_gai: {
                                inherit: "hanbing_skill",
                                trigger: { source: "damageBegin2", },
                                equipSkill: false, ruleSkill: true, firstDo: true,
                                filter: function (event, player) {//||player.hasSkill('hanbing_gai')
                                    return (event.nature == 'ice' || player.hasSkill('hanbing_skill') && event.card && event.card.name == 'sha') && event.notLink() && event.player.getCards('he').length > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].contains('boss') && player.identity == 'cai'));
                                },
                                audio: "ext:舰R牌将:true",
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
                                    event.num1 = trigger.num * 2; game.log(trigger.num, event.num1)
                                    trigger.cancel();
                                    "step 1"
                                    if (trigger.player.countDiscardableCards(player, 'he')) {
                                        player.line(trigger.player);
                                        player.discardPlayerCard('he', trigger.player, true); player.addMark('_hanbing_gai');
                                    } else {
                                        var a = Math.floor((event.num1 - player.countMark('_hanbing_gai')) / 2); game.log(event.num1, Math.floor((event.num1 - player.countMark('_hanbing_gai')) / 2));
                                        player.removeMark('_hanbing_gai', player.countMark('_hanbing_gai')); trigger.player.damage(a); event.finish();
                                    };
                                    "step 2"
                                    if (player.countMark('_hanbing_gai') < event.num1 && player.countMark('_hanbing_gai')) { event.goto(1) } else {
                                        player.removeMark('_hanbing_gai', player.countMark('_hanbing_gai'));
                                    };
                                },
                                intro: { content: function () { return get.translation('__hanbing_gai' + '_info'); }, },
                            },
                            //
                            tiaozhanzhuanbei: {
                                trigger: {
                                    global: "phaseBefore",
                                    player: "enterGame",
                                },
                                forced: true,
                                firstDo: true,
                                filter: function (event, player) {//"huijiahuihe",
                                    return (event.name != 'phase' || game.phaseNumber == 0) && get.mode() == 'boss';
                                },
                                content: function () {
                                    if (player.hasSkill('qianting')) { player.equip(game.createCard2('yuleiqianting3', 'club', 0)); player.equip(game.createCard2('xingyun', 'club', 0)); };
                                    if (player.hasSkill('quzhudd')) { player.equip(game.createCard2('quzhupao3', 'club', 0)); player.equip(game.createCard2('xingyun', 'club', 0)); };
                                    if (player.hasSkill('qingxuncl')) { player.equip(game.createCard2('qingxunpao3', 'club', 0)); player.equip(game.createCard2('xingyun', 'club', 0)); };
                                    if (player.hasSkill('zhongxunca')) { player.equip(game.createCard2('zhongxunpao3', 'club', 0)); player.equip(game.createCard2('huokongld', 'club', 0)); };
                                    if (player.hasSkill('zhanliebb')) { player.equip(game.createCard2('zhanliepao3', 'club', 0)); player.equip(game.createCard2('huokongld', 'club', 0)); };
                                    if (player.hasSkill('hangmucv')) { player.equip(game.createCard2('zhandouji3', 'club', 0)); player.equip(game.createCard2('tansheqi3', 'club', 0)); };
                                    if (player.hasSkill('junfu')) { player.equip(game.createCard2('yuleiji3', 'club', 0)); player.equip(game.createCard2('xingyun', 'club', 0)); };
                                    if (player.hasSkill('daoqu')) { player.equip(game.createCard2('jianzaidaodan3', 'club', 0)); player.equip(game.createCard2('fasheqi3', 'club', 0)); };

                                    player.equip(game.createCard2('xingyun', 'club', 0));
                                    player.equip(game.createCard2('miki_binoculars', 'diamond', 0));
                                },
                                mod: {
                                    canBeDiscarded: function (card) {
                                        if (get.position(card) == 'e' && get.mode() == 'boss' && ['equip1', 'equip5', 'equip6'].contains(get.subtype(card))) return false;
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
                                    }).length, danzong = player.getAllHistory('useSkill', function (evt) { return evt.skill == "danzong"; }).length; var e = Math.random(), f = 0.4; if (player.hasSkill('quzhudd')) var f = 0.35; if (player.hasSkill('qingxuncl')) var f = 0.45; if (player.hasSkill('zhongxunca')) var f = 0.55;
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
                                    var tishi = '总计可用' + Math.floor(chusha / 4 - danzong) + '次，每回合限2次，令非属性' + get.translation(event.card) + '在计算伤害前：<br>', xiaochuan = player.hasSkill('quzhudd') || player.hasSkill('qianting'), dachuan = player.hasSkill('zhanliebb') || player.hasSkill('hangmucv');
                                    {
                                        if (xiaochuan) { tishi += ('获得雷属性（命中后：目标有护甲时，伤害穿透护甲；减少对手1点防御距离)。<br>被集火了，快跑') };
                                        if (dachuan) { tishi += ('获得雷属性（命中后：目标有护甲时，加1伤；减少对手1点手牌上限；放弃伤害，改为弃置对手的卡牌）<br>一般般啦，绝境求生。') };
                                        if (!dachuan && !xiaochuan) { tishi += ('获得火属性（命中后：目标出牌阶段结束时受到一点火焰伤害，并摸一张牌）。<br>团战利器') }
                                    }; tishi += ('，每使用三张杀，使用次数+1'); return tishi
                                },
                                content: function () {//player.addTempSkill('qinggang_skill','useCard1');
                                    var chusha = player.getAllHistory('useCard', function (evt) {
                                        return get.name(evt.card, 'sha');
                                    }).length, danzong = player.getAllHistory('useSkill', function (evt) { return evt.skill == "danzong"; }).length;
                                    //return event.card.name=='sha'&&!event.card.nature&&chusha/2-danzong>0;   
                                    game.log(chusha, danzong);
                                    if (1 > 2) {
                                        trigger.card.nature = 'fire';
                                        if ((player.hasSkill('quzhudd') | player.hasSkill('qianting'))) { trigger.card.nature = 'thunder' }; if ((player.hasSkill('zhanliebb') | player.hasSkill('hangmucv'))) { trigger.card.nature = 'thunder'; };
                                        if (get.itemtype(trigger.card) == 'card') {
                                            var next = game.createEvent('zhuque_clear');
                                            next.card = trigger.card;
                                            event.next.remove(next);
                                            trigger.after.push(next);
                                            next.setContent(function () {
                                                delete card.nature;
                                            });
                                        }
                                    } else player.addSkill('danzong_damage');
                                },
                                subSkill: {
                                    damage: {
                                        equipSkill: true, frequent: true,
                                        trigger: { source: "damageBefore", },
                                        filter: function (event, player, card) {
                                            return !event.nature;
                                        },
                                        prompt: "增强杀", "prompt2": "下一次造成伤害时，可以改变伤害属性（接近伤害的触发时机,几乎就是个特效）",
                                        content: function () {//player.addTempSkill('qinggang_skill','useCard1');
                                            trigger.nature = 'fire';
                                            if ((player.hasSkill('quzhudd') | player.hasSkill('qianting'))) { trigger.nature = 'thunder' }; if ((player.hasSkill('zhanliebb') | player.hasSkill('hangmucv'))) { trigger.nature = 'ice'; };
                                            player.removeSkill('danzong_damage');
                                        },
                                        mark: true, intro: { marktext: "增强", content: function (player) { return ('下一次造成伤害时，可以改变伤害属性（接近伤害的触发时机,几乎就是个特效）'); }, },
                                        sub: true,
                                    },
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            kaishimopao: {
                                audio: "ext:1牌将修改:2",
                                group: ["kaishimopao_jieshu", "kaishimopao_mark", "kaishimopao_discover", "kaishimopao_draw", "kaishimopao_jieshudraw"],
                                subSkill: {
                                    jieshu: {
                                        trigger: { player: "phaseJieshuBegin", },
                                        priority: 1, fixed: true, silent: true, friquent: true, forced: true, popup: false,
                                        content: function () {
                                            'step 0'
                                            if (player.countMark('kaishimopao_jieshudraw')) { player.draw(player.countMark('kaishimopao_jieshudraw')); player.removeMark('kaishimopao_jieshudraw', player.countMark('kaishimopao_jieshudraw')) };
                                        }, sub: true,
                                    },
                                    mark: {
                                        trigger: { player: "gainBegin", global: "phaseBeginStart", },
                                        priority: 1, silent: true, forced: true, popup: false,
                                        filter: function (event, player) {
                                            return event.name != 'gain' || player == _status.currentPhase;
                                        },
                                        content: function () {
                                            if (trigger.name == 'gain' && !player.isPhaseUsing()) trigger.gaintag.add('kaishimopao'); else player.removeGaintag('kaishimopao');
                                        },
                                        mark: false, intro: { marktext: "摸牌", content: function (player) { return ('摸牌阶段获得的一些牌'); }, }, sub: true,
                                    },
                                    discover: {
                                        trigger: { player: "phaseDrawEnd", }, forced: true,
                                        filter: function (event, player) {//xinfu_bijing
                                            return player.getCards('h', function (card) {
                                                return card.hasGaintag('kaishimopao') && card.hasGaintag('kaishimopao');
                                            }).length > 1;
                                        },
                                        content: function () {
                                            'step 0'
                                            event.cards = player.getCards('h', function (card) { return card.hasGaintag('kaishimopao'); });
                                            player.chooseToDiscard('he', false, event.cards.length).set('prompt2', '弃置等同于于摸牌阶段获得的牌数，然后随机获得一张你指定类别的卡牌。').set('ai', function (card) {
                                                if (ui.selected.cards.length > 2) return -1;
                                                if (card.name == 'tao') return -10;
                                                if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
                                                return 5 - get.value(card);
                                            });
                                            'step 1'
                                            if (result.bool) {
                                                player.chooseControl('<span class=yellowtext>基本', '<span class=yellowtext>装备', '<span class=yellowtext>锦囊', 'cancel2').set('prompt', get.prompt('kaishimopao')).set('prompt2', '选择一张牌并发现之').set('ai', function (event, player) { var player = _status.event.player; return 1; });
                                            };
                                            'step 2'
                                            if (result.control != 'cancel2') {
                                                game.log(); var i = result.index; if (i == 0) { var a = ('basic') }; if (i == 1) { var a = ('equip') }; if (i == 2) { var a = ('trick') };
                                                event.cards = [];
                                                var cardPile = Array.from(ui.cardPile.childNodes);
                                                var discardPile = Array.from(ui.discardPile.childNodes);
                                                var cardList = cardPile.concat(discardPile);
                                                event.cards.addArray(cardList.filter(function (card) {
                                                    return get.type(card, a) == a;//game.log(get.type(card,a)==a);
                                                }));
                                                player.gain(event.cards[0], 'gain2');
                                            }
                                        }, sub: true,
                                    },
                                    draw: {
                                        priority: 4, forced: true, popup: false, mark: false,
                                        trigger: { player: "phaseDrawBegin", },
                                        content: function () {
                                            'step 0'
                                            for (var i = 0; i < trigger.num; i += (1)) { if (trigger.num > 0 && player.countMark('kaishimopao_draw')) { trigger.num -= (1); player.removeMark('kaishimopao_draw', 1) } }
                                        }, sub: true, intro: { marktext: "减摸牌数", content: function (player) { return ('减少摸牌阶段摸牌数'); }, },
                                    },
                                    jieshudraw: {
                                        trigger: { player: "phaseJudgeBefore", },
                                        name: "闭月", forced: true, usable: 1,
                                        filter: function (event, player) { return player.countCards('j') > 0 },
                                        content: function () {
                                            'step 0'
                                            player.chooseControl('<span class=yellowtext>少摸一张牌' + '</span>', 'cancel2').set('prompt', get.prompt('判定藏牌')).set('prompt2', '准备阶段，若你的判定区有牌时，<br>你可以令自己的摸牌阶段少摸一张牌，<br>然后在自己的回合结束时摸一张牌。').set('ai', function (event, player) { var player = _status.event.player; return 0; });
                                            'step 1'
                                            if (result.control != 'cancel2') { player.addMark('kaishimopao_jieshudraw'); player.addMark('kaishimopao_draw'); };
                                        }, sub: true, mark: false, intro: { marktext: "闭月", content: function (player) { return ('结束时摸一张牌'); }, },
                                    },
                                },
                                intro: { marktext: "摸牌", content: function (player) { return ('获得一个技能时的标记'); }, },
                            },
                            "paohuozb_skill": {
                                mod: {
                                    maxHandcard: function (player, num) { return num - 1; },
                                    cardUsable: function (card, player, num) { if (card.name == 'sha') return num + 1; },
                                },
                                trigger: {
                                    player: "equipAfter",
                                },
                                forced: true,
                                equipSkill: true,
                                filter: function (event, player) {
                                    return event.card.name == 'paohuozb';
                                },
                                content: function () {
                                    player.loseHp();
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill);
                                    },
                                },
                            },
                            zhongpaoduijue: {
                                enable: "phaseUse", usable: 1, position: "hejs", complexCard: true,
                                selectCard: function (card, player) { var player = _status.event.player; return [2, player.countMark('jinengup') + 2] },
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
                                prompt: "当你无法使用杀时，你可以指定一个目标，弃置最多（2/3/4）张相同花色的牌，并与目标摸等量的牌,<br>然后你与目标轮流视为对对方使用一张决斗,<br>直到双方的决斗次数超过2n，n为你弃置的牌数。强化以减少对方摸的牌",
                                content: function () {
                                    'step 0'//你获得技能[]player.addTempSkill('touxichuan','phaseAfter');
                                    event.num = event.cards.length;
                                    var d = game.countPlayer(function (current) { return current != player && (get.attitude(player, current) < 1) && (current.hasSkill('bagua_skill') | current.hasSkill('re_bagua_skill')); });
                                    game.log('有八卦的角色:', d);
                                    player.chooseTarget(get.prompt2('选择攻击目标'), function (card, player, target) {
                                        return target.maxHp > 0 && player.inRange(target);
                                    }).set('ai', function (target) {
                                        var att = -get.attitude(_status.event.player, target) / target.countCards('h');
                                        if (target.hasSkill('quzhudd') || target.hasSkill('hangmucv')) { att *= 1.1 };
                                        if (Math.ceil(target.hp * 2) <= target.maxHp) { att *= 1.1 }; if (target.countCards('h') < 3) { att *= 1.1 };
                                        if (target.hasSkill('bagua_skill') | target.hasSkill('re_bagua_skill')) { att *= 0.5 };
                                        return att
                                    });
                                    'step 1'
                                    if (result.bool) {
                                        event.target = result.targets[0]; player.draw(event.num); event.target.draw(event.num - player.countMark('jinengup'));
                                        if (event.num > 1) { player.useCard({ name: 'juedou' }, event.target); event.target.useCard({ name: 'juedou' }, player); };
                                        if (event.num > 2) { player.useCard({ name: 'juedou' }, event.target); event.target.useCard({ name: 'juedou' }, player); };
                                        if (event.num > 3) { player.useCard({ name: 'juedou', nature: 'fire', isCard: false }, event.target); event.target.useCard({ name: 'juedou' }, player); };
                                        if (event.num > 4) { player.useCard({ name: 'juedou', nature: 'fire', isCard: false }, event.target); event.target.useCard({ name: 'juedou' }, player); };
                                    } else event.finish();
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
                            zhuangjiafh: {
                                //mod:{maxHandcard:function(player,num){var a=0;if(player.hujia>0){a+=(player.hujia)};return num=(num-a);},},//取消护甲技能减少手牌上限的效果2023.8.7
                                trigger: { player: ["damageEnd"], },
                                direct: true, firstDo: true, usable: 1,
                                filter: function (event, player) { return true },
                                content: function () {
                                    //  game.log(event.triggername,!trigger.hujia);//灵血&&!player.countCards('h',{color:'red'})
                                    if (player.countMark('jinengup') <= 0) {
                                        if (trigger.card && (trigger.card.name == 'sha' || trigger.card.name == 'sheji9') && trigger.source && event.triggername == 'damageEnd' && !trigger.hujia && player.hujia == 0) { player.changeHujia(1); game.log(player, '发动了技能【装甲防护】，增加了 1 点护甲值！'); }
                                    } else if (player.countMark('jinengup') == 1) {
                                        if (trigger.cards && event.triggername == 'damageEnd' && !trigger.hujia && player.hujia == 0) { player.changeHujia(1); game.log(player, '发动了技能【装甲防护】，增加了 1 点护甲值！'); }
                                    } else if (player.countMark('jinengup') >= 2) {
                                        if (event.triggername == 'damageEnd' && !trigger.hujia && player.hujia == 0) { player.changeHujia(1); game.log(player, '发动了技能【装甲防护】，增加了 1 点护甲值！'); }
                                    }
                                    /*if(player.countCards('h',{color:'red'})){
                                    var next=player.chooseToDiscard('hejs',{color:'red'},[1,2],get.prompt('叠甲'),('你拥有护甲时，会减少等同于护甲值的手牌上限。<br>当你结算完回复/受伤时,你可以弃置至多2张红色牌，获得X点护甲。（X为弃牌数）<br>若你没有用护甲承受过此次伤害，会额外获得1点护甲。<br>你的出牌阶段开始时，会清除你的护甲，然后摸等量的牌（牺牲防御的制衡）'));
                                    next.ai=function(card){var player=_status.event.player;
                                     if(player.countCards({name:'tao'})&&player.hasSkill('lingxue'))return -1;
                                     if(event.triggername=='damageBefore'&&event.nature=="thunder")return-1;
                                     return 4-get.value(card);
                                    };*///移除了可以弃置红色牌获得等量护甲值的技能效果2023.8.7
                                    //if(result.bool&&result.cards){var num=result.cards.length;player.changeHujia(num);}
                                },
                                /*group:["zhuangjiafh_hujialose"],
                                subSkill:{hujialose:{
                                         trigger:{
                                             player:"phaseUseBegin",
                                         },forced:true,
                                         name:"回合",
                                         lastDo:true,
                                         filter:function(event,player){//yichuhujia
                                 return player.hujia>0;
                             },
                                         check:function(event,player){
                                 return player.hujia>0&&player.hp>0;
                             },
                                         content:function(){player.draw(player.hujia);player.changeHujia(-player.hujia);
                             },},},
                                         ai:{
                                             nohujia:true,
                                             "maixie_hp":true,
                                             skillTagFilter:function(event){return event.nature=="thunder";},
                                         },*///移除回合开始时玩家可以移除自己的护甲值并摸等量的牌的技能。2023.8.7
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },

                            hangmucv: {
                                trigger: { player: "phaseUseBegin" },
                                filter: function (event, player) {
                                    return player.countCards('h') > 0;
                                },
                                check: function (card) {
                                    return 17 - get.value(card);
                                },
                                direct: true,
                                content: function () {
                                    "step 0"
                                    if (player.countMark('jinengup') <= 0) {
                                        player.chooseToDiscard(2, "h", function (card) {
                                            return get.color(card) === 'black';
                                        }, "弃置两张黑桃或梅花手牌，视为使用【万箭齐发】").set("ai", function (card) {
                                            return 4 - get.value(card);
                                        });
                                    } else if (player.countMark('jinengup') == 1) {
                                        player.chooseToDiscard(2, "h", function (card) {
                                            return get.suit(card) === 'spade' || get.suit(card) === 'club' || get.suit(card) === 'heart';
                                        }, "弃置两张黑桃或梅花或红桃手牌，视为使用【万箭齐发】").set("ai", function (card) {
                                            return 4 - get.value(card);
                                        });
                                    } else if (player.countMark('jinengup') >= 2) {
                                        player.chooseToDiscard(2, "h", function (card) {
                                            return true;
                                        }, "弃置两张手牌，视为使用【万箭齐发】").set("ai", function (card) {
                                            return 4 - get.value(card);
                                        });
                                    }
                                    "step 1"
                                    if (result.bool && result.cards && result.cards.length === 2) {
                                        player.chooseTarget("请选择目标，视为使用【万箭齐发】", [1, Infinity], function (card, player, target) {
                                            return player != target;
                                        }).set("ai", function (target) {
                                            return -get.attitude(player, target);
                                        });
                                    }
                                    "step 2"
                                    if (result.targets && result.targets.length > 0) {
                                        player.useCard({ name: 'jinjuzy' }, result.targets, false);
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
                                        /*"target_use": function (player, target) {
                                            if (player.hasUnknown(2) && get.mode() != 'guozhan') return 0;
                                            var nh = target.countCards('h');
                                            if (get.mode() == 'identity') {
                                                if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
                                            }
                                            if (nh == 0) return -2;
                                            if (nh == 1) return -1.7
                                            return -1.5;
                                        },
                                        target: function (player, target) {
                                            var nh = target.countCards('h');
                                            if (get.mode() == 'identity') {
                                                if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
                                            }
                                            if (nh == 0) return -2;
                                            if (nh == 1) return -1.7
                                            return -1.5;
                                        },*/
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
                                    },
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },


                            /*hangmucv:{
                            group:["hangmucv_roundonefire"],
                            subSkill:{
                            roundonefire:{
                                audio:"ext:1牌将修改:2",trigger:{player:"phaseUseBegin",},forced:true,lastDo:true,
                                filter:function(event,player){//意外发现function应用广泛，然而解决不了自动显示隐藏标记。航母开幕，然后根据舰种判断具体出什么杀game.log();不必考虑队友状态的全体攻击，但用完后容易去世
                    return player.countCards('h')>0;},
                                content:function(){
                        'step 0'
                event.targets=player.getEnemies();
                //game.playAudio('..','extension','舰R牌将/audio',player.name);
                //<br>'+player.countMark('jinengup')+'级技能<br>'+num+'：'+d+'的收益，<br>if(player.hasSkill('hangmucv')||player.countCards('e','hangkongzhan')) {
                   d=game.countPlayer(function(current){return current!=player&&event.targets.contains(current)&&!current.hasSkill('bagua_skill')&&!current.hasSkill('re_bagua_skill')&&!current.hasSkill('tengjia1');});event.tishi='';
                     if(player.countMark('jinengup')>=1){event.tishi='你的出牌阶段开始时，<br>你可以弃置2张牌，视为对接下来的两位对手使用万箭齐发，<br>';var num=[2,2];}
                        else if(player.countMark('jinengup')>=1){var num=[1,3];event.tishi+=('弃置1至3张牌，对之后等量的非友方武将使用万箭齐发');}
                        else if(player.countMark('jinengup')>=2){var num=[1,4];event.tishi+=('弃置4张牌，对下一位对手连续使用三张万箭齐发');}
                    if(player.countCards('h')>=1){
                        {player.chooseToDiscard(num).set('prompt2',event.tishi).set('ai',function(card){
                            if(ui.selected.cards.length>2) return -1;if(card.name=='tao') return -10;
                            if(card.name=='jiu'&&_status.event.player.hp==1) return -10;return 11-get.value(card);        
                            }
                            );
                        };
                        if(num<1){player.chooseControl('<span class=yellowtext>友军远射攻击'+'</span>','cancel2').set('prompt',get.prompt('hangmucv')).set('prompt2',event.tishi).set('ai',function(event,player){return 0;});};};
                        "step 1"//game.log(result.cards);  
                      if(result.bool||result.control){event.targets=[];event.current=player.next;
                      for(var i=0;i<game.countPlayer()-1;i++){game.log(event.targets);if(player.getEnemies().contains(event.current)&&result.cards.length>event.targets.length){event.targets.push(event.current)};event.current=event.current.next;};
                          if(!event.targets==''&&result.cards.length<4){player.chooseUseTarget({name:'wanjian'},event.targets);}else if(!event.targets==''&&result.cards.length<4){player.chooseUseTarget({name:'wanjian'},event.targets[0]);player.chooseUseTarget({name:'wanjian'},event.targets[0]);player.chooseUseTarget({name:'wanjian'},event.targets[0]);
                          };
                          }else event.finish();
                //var e1=player.countCards('e','hangkongzhan'),xiaohao=Math.floor(Math.min(2,event.targets.length/2+0.5));player.gain(result.cards,player,'giveAuto');
                //if(player.countCards('h')>=1&&(player.hasSkill('hangmucv')||e1>0)){if(player.countCards('h')>=0&&xiaohao>=2){player.discard(player.getCards('h').randomGet());};player.update();player.discard(player.getCards('h').randomGet());player.useCard({name:'jinjuzy',nature:'thunder'},event.targets)};                  //wanjian,jinjuzy                                       content:function(){          
                },},},
                                intro:{content:function(){return get.translation(skill+'_info');},
                                },  },*/

                            zhanliebb: {
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            qingxuncl: {
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            zhongxunca: {
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            misscoversha: {
                                trigger: {
                                    player: "shaMiss",
                                },
                                silent: true,
                                filter: function (event) {//return event.getParent(2).name=='zhongpaoduijue'
                                    ;
                                },
                                content: function () {
                                    player.getStat().card.sha--
                                },
                                forced: true,
                                popup: false,
                                ai: {
                                    expose: 0.3,
                                    threaten: 8.8,
                                    order: 5,
                                    result: {
                                        player: 1,
                                    },
                                },
                            },
                            xianjinld: {
                                enable: "phaseUse",
                                usable: 2,
                                init: function (player) {
                                    if (!player.hasMark('xianjinld_difend') && !player.hasMark('xianjinld_attack')) player.addMark('xianjinld_difend');
                                },
                                content: function () {
                                    'step 0'
                                    player.chooseControl('<span class=yellowtext>友军摸牌防御' + '</span>', '<span class=yellowtext>友军远射攻击' + '</span>', 'cancel2').set('prompt', get.prompt('huokongld')).set('prompt2', '<br>防御：你让实际距离此角色为' + (1 + player.countMark('songpaiup')) + '的队友：<br>防御距离+1，但用杀攻击的距离-1，令自己的摸牌阶段摸牌数-1。<br>攻击：让距离自己' + (1 + player.countMark('jinengup')) + '的队友及自己的攻击距离+1，但防御杀的距离-1,队友的摸牌阶段摸牌数+1。<br>强化技能可以增加这两个技能的作用距离').set('ai', function (event, player) {
                                        var player = _status.event.player, chusha = lib.filter.cardEnabled({ name: 'sha' }, player), renshu = game.countPlayer(function (current) { return get.attitude(player, current) > 0 && get.distance(from, current, 'pure') <= 1 + current.countMark('jinengup'); });
                                        if (renshu < 2 || chusha) return 1; if (renshu >= 2 && !chusha) return 0;
                                    });
                                    'step 1'
                                    if (result.contron != 'cancel2') { var i = result.index; game.log(i, 'xianjinld'); if (i == 0 && !player.hasMark('xianjinld_difend')) { player.addMark('xianjinld_difend'); player.removeMark('xianjinld_attack') }; if (i == 1 && !player.hasMark('xianjinld_attack')) { player.addMark('xianjinld_attack'); player.removeMark('xianjinld_difend') }; };
                                },
                                ai: {
                                    order: function (player) { if (lib.filter.cardEnabled({ name: 'sha' }, player)) { return 8; } return 3; },
                                },
                                onremove: function (player) { player.removeGaintag('xianjinld'); },
                                mark: true,
                                mod: {
                                    aiOrder: function (player, card, num) { if (get.itemtype(card) == 'card' && card.hasGaintag('xianjinld')) return num + 3; },
                                },
                                intro: {
                                    mark: function (dialog, content, player) {
                                        var tishi = ''; if (player.hasMark('xianjinld_difend')) { var tishi = '实际距离此角色为' + (1 + player.countMark('songpaiup')) + '的队友：防御距离+1，但用杀攻击的距离-1，令自己的摸牌阶段摸牌数-1' }; if (player.hasMark('xianjinld_attack')) { var tishi = '实际距离此角色为' + (1 + player.countMark('songpaiup')) + '的队友及自己：攻击距离+1，但防御杀的距离-1,队友的摸牌阶段摸牌数+1。' };
                                        if (get.attitude(game.me, player) <= 0 || player.hasMark('xianjinld_difend')) { return get.translation(player) + '观看牌堆中...' + '<br>增益' + tishi; };
                                        if (get.itemtype(_status.pileTop) != 'card') return '牌堆顶无牌'; var cardPile = Array.from(ui.cardPile.childNodes); var cardPile = cardPile.slice(0, Math.min(3, cardPile.length)); dialog.addAuto(cardPile, tishi);
                                    },
                                },
                                global: ["xianjinld_attack", "xianjinld_difend"],
                                group: ["xianjinld_difend1"],
                                subSkill: {
                                    attack: {
                                        mod: {
                                            golbalFrom: function (from, to, num) {
                                                return num - game.hasPlayer(function (current) {
                                                    return get.attitude(from, current) > 0 && get.distance(from, current, 'pure') <= 1 + current.countMark('jinengup') && current.hasSkill('xianjinld') && current.hasMark('xianjinld_attack');
                                                });
                                            },
                                            attackTo: function (from, to, num) {
                                                return num - game.hasPlayer(function (current) {
                                                    return get.attitude(to, current) > 0 && get.distance(to, current, 'pure') <= 1 + current.countMark('jinengup') && current.hasSkill('xianjinld') && current.hasMark('xianjinld_attack');
                                                });
                                            },
                                        },
                                        sub: true,
                                    },
                                    difend: {
                                        mod: {
                                            globalTo: function (from, to, num) {
                                                return num + game.hasPlayer(function (current) {
                                                    return current != to && get.attitude(to, current) > 0 && get.distance(to, current, 'pure') <= 1 + current.countMark('jinengup') && current.hasSkill('xianjinld') && current.hasMark('xianjinld_difend');
                                                });
                                            },
                                            attackFrom: function (from, to, num) {
                                                return num + game.hasPlayer(function (current) {
                                                    return current != from && get.attitude(from, current) > 0 && get.distance(from, current, 'pure') <= 1 + current.countMark('jinengup') && current.hasSkill('xianjinld') && current.hasMark('xianjinld_defend');
                                                });
                                            },
                                        },
                                        sub: true,
                                    },
                                    "difend1": {
                                        trigger: {
                                            global: "phaseDrawBegin",
                                        },
                                        frequent: function (event, player) { if (get.attitude(player, event.player) > 0) return true; return false },
                                        check: function (event, player) { if (get.attitude(player, event.player) < 0) return false; return true },
                                        logTarget: "player",
                                        filter: function (event, player) {//spshicai与云将技能在下面，除了帮助队友外还可以看牌顶。
                                            return (get.attitude(player, event.player) >= 0 || player.identity == 'nei') && get.distance(player, event.player, 'pure') <= 1 + player.countMark('jinengup');
                                        },
                                        "prompt2": function (event, player) {
                                            var a = get.translation('xianjinld_info');
                                            if (player.identity == 'nei') { a += ('<br>控制全场状态有一手；<br>内奸需要辅助弱势方，攻击实力出色的角色，平衡场上局势，保持自己的状态，伺机实现连破。') }; return a;
                                        },
                                        content: function () { if (trigger.player == player && player.hasMark('xianjinld_difend')) { trigger.num-- }; if (trigger.player != player && player.hasMark('xianjinld_attack')) { trigger.num++; }; },
                                        sub: true,
                                    },
                                },
                            },
                            "rendeonly2": {
                                audio: "ext:舰R牌将:2",
                                audioname: ["gz_jun_liubei", "shen_caopi"],
                                enable: "phaseUse",
                                filterCard: true,
                                position: "hejs",
                                selectCard: [1, 2],
                                discard: false,
                                usable: 2,
                                lose: false,
                                delay: false,
                                filterTarget: function (card, player, target) {
                                    if (player.storage.rerende2 && player.storage.rerende2.contains(target)) return false;
                                    return player != target && get.distance(player, target, 'pure') <= 2 + player.countMark('shoupaiup');
                                },
                                onremove: ["rerende", "rerende2"],
                                check: function (card) {
                                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
                                    if (!ui.selected.cards.length && card.name == 'du') return 20;
                                    var player = get.owner(card);
                                    if (ui.selected.cards.length >= Math.max(2, player.countCards('h') - player.hp)) return 0;
                                    if (player.hp == player.maxHp || player.storage.rerende < 0 || player.countCards('h') <= 1) {
                                        var players = game.filterPlayer();
                                        for (var i = 0; i < players.length; i++) {
                                            if (players[i].hasSkill('haoshi') &&
                                                !players[i].isTurnedOver() &&
                                                !players[i].hasJudge('lebu') &&
                                                get.attitude(player, players[i]) >= 3 &&
                                                get.attitude(players[i], player) >= 3) {
                                                return 11 - get.value(card);
                                            }
                                        }
                                        if (player.countCards('h') > player.hp) return 10 - get.value(card);
                                        if (player.countCards('h') > 2) return 6 - get.value(card);
                                        return -1;
                                    }
                                    return 10 - get.value(card);
                                },
                                content: function () {
                                    'step 0'
                                    var evt = _status.event.getParent('phaseUse');
                                    if (evt && evt.name == 'phaseUse' && !evt.rerende) {
                                        var next = game.createEvent('rerende_clear');
                                        _status.event.next.remove(next);
                                        evt.after.push(next);
                                        evt.rerende = true;
                                        next.player = player;
                                        next.setContent(lib.skill.rerende1.content);
                                    }
                                    if (!Array.isArray(player.storage.rerende2)) {
                                        player.storage.rerende2 = [];
                                    }
                                    player.storage.rerende2.push(target);
                                    target.gain(cards, player, 'giveAuto');//var usecard=cards[0];target.chooseUseTarget(usecard);
                                    for (var i = 0; i < cards.length; i += (1)) { var usecard = cards[i]; if (usecard.name != 'sha' || !target.hasSkill('diewulimitai_shale')) { target.chooseUseTarget(usecard) }; if (usecard.name == 'sha') { target.addSkill('diewulimitai_shale'); target.update(); }; };
                                    if (typeof player.storage.rerende != 'number') {
                                        player.storage.rerende = 0;
                                    }
                                    if (player.storage.rerende >= 0) {
                                        player.storage.rerende += cards.length;
                                        if (player.storage.rerende >= 2) {
                                            var list = [];
                                            if (lib.filter.cardUsable({ name: 'sha' }, player, event.getParent('chooseToUse')) && game.hasPlayer(function (current) {
                                                return player.canUse('sha', current);
                                            })) {
                                                list.push(['基本', '', 'sha']);
                                            }
                                            for (var i of lib.inpile_nature) {
                                                if (lib.filter.cardUsable({ name: 'sha', nature: i }, player, event.getParent('chooseToUse')) && game.hasPlayer(function (current) {
                                                    return player.canUse({ name: 'sha', nature: i }, current);
                                                })) {
                                                    list.push(['基本', '', 'sha', i]);
                                                }
                                            }
                                            //      if(lib.filter.cardUsable({name:'tao'},player,event.getParent('chooseToUse'))&&game.hasPlayer(function(current){
                                            //              return player.canUse('tao',current);
                                            //     })){
                                            //            list.push(['基本','','tao']);
                                            //          }
                                            if (lib.filter.cardUsable({ name: 'jiu' }, player, event.getParent('chooseToUse')) && game.hasPlayer(function (current) {
                                                return player.canUse('jiu', current);
                                            })) {
                                                list.push(['基本', '', 'jiu']);
                                            }
                                            if (list.length) {
                                                player.chooseButton(['是否视为使用一张基本牌？', [list, 'vcard']]).set('ai', function (button) {
                                                    var player = _status.event.player;
                                                    var card = { name: button.link[2], nature: button.link[3] };
                                                    if (card.name == 'tao') {
                                                        if (player.hp == 1 || (player.hp == 2 && !player.hasShan()) || player.needsToDiscard()) {
                                                            return 5;
                                                        }
                                                        return 1;
                                                    }
                                                    if (card.name == 'sha') {
                                                        if (game.hasPlayer(function (current) {
                                                            return player.canUse(card, current) && get.effect(current, card, player, player) > 0
                                                        })) {
                                                            if (card.nature == 'fire') return 2.95;
                                                            if (card.nature == 'thunder' || card.nature == 'ice') return 2.92;
                                                            return 2.9;
                                                        }
                                                        return 0;
                                                    }
                                                    if (card.name == 'jiu') {
                                                        return 0.5;
                                                    }
                                                    return 0;
                                                });
                                            }
                                            else {
                                                event.finish();
                                            }
                                            player.storage.rerende = -1;
                                        }
                                        else {
                                            event.finish();
                                        }
                                    }
                                    else {
                                        event.finish();
                                    }
                                    'step 1'
                                    if (result && result.bool && result.links[0]) {
                                        var card = { name: result.links[0][2], nature: result.links[0][3] };
                                        player.chooseUseTarget(card, true);
                                    }
                                },
                                ai: {
                                    thunderAttack: true,
                                    order: function (skill, player) {
                                        if (player.hp < player.maxHp && player.storage.rerende < 2 && player.countCards('h') > 1) {
                                            return 7;
                                        }
                                        return 3;
                                    },
                                    result: {
                                        target: function (player, target) {
                                            if (target.hasSkillTag('nogain')) return 0;
                                            if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                                                if (target.hasSkillTag('nodu')) return 0;
                                                return -10;
                                            }
                                            if (target.hasJudge('lebu')) return 0;
                                            var nh = target.countCards('h');
                                            var np = player.countCards('h');
                                            if (player.hp == player.maxHp || player.storage.rerende < 0 || player.countCards('h') <= 1) {
                                                if (nh >= np - 1 && np <= player.hp && !target.hasSkill('haoshi')) return 0;
                                            }
                                            return Math.max(1, 5 - nh);
                                        },
                                    },
                                    effect: {
                                        target: function (card, player, target) {
                                            if (player == target && get.type(card) == 'equip') {
                                                if (player.countCards('e', { subtype: get.subtype(card) }) < 2) {
                                                    if (game.hasPlayer(function (current) {
                                                        return current != player && get.attitude(player, current) > 0;
                                                    })) {
                                                        return 0;
                                                    }
                                                }
                                            }
                                        },
                                    },
                                    threaten: 0.8,
                                },
                            },
                            diewulimitai: {
                                enable: "phaseUse",
                                filter: function (event, player) {
                                    return player.countCards('h', 'sha') > 0 || player.countCards('he', { type: 'equip' }) > 0;
                                },
                                filterCard: function (card) {
                                    var player = _status.event.player;
                                    return card.name == 'sheji9' || card.name == 'zziqi9' || card.name == 'sha' || card.name == 'jiu' || get.type(card) == 'equip';
                                },
                                filterTarget: function (card, player, target) {
                                    if ((get.attitude(player, target) >= 0 || player.identity == 'nei')) return target != player && get.distance(player, target, 'pure') <= 1 + player.countMark('shoupaiup');
                                },
                                usable: 2,
                                position: "hejs",
                                prompt: function () { return "给队友一张杀或装备牌，每回合限2次。<br>之后目标可以选择使用此牌，如果因使用此牌而造成伤害，你摸一张牌。" },
                                prepare: "give",
                                discard: false,
                                content: function () {//group:["diewulimitai_2"],
                                    'step 0'
                                    targets[0].gain(cards, player);
                                    for (var i = 0; i < cards.length; i += (1)) { var usecard = cards[i]; if (usecard.name != 'sha' || !targets[0].hasSkill('diewulimitai_shale')) { targets[0].chooseUseTarget(usecard); } };
                                    if (!target.hasSkill('diewulimitai_shale')) { target.addSkill('diewulimitai_shale'); }


                                },
                                subSkill: {
                                    shale: {
                                        trigger: {
                                            player: "phaseJieshuBegin",
                                        },
                                        fixed: true,
                                        silent: true,
                                        content: function () {
                                            if (player.hasSkill('diewulimitai_shale')) { player.removeSkill('diewulimitai_shale'); };
                                        },
                                        intro: {
                                            marktext: "给了杀",
                                            content: function (player) {
                                                return ('此角色于其回合开始前，不能立即使用获得到的杀。<br>（通过改良仁德与改良递杀获得的杀）');
                                            },
                                        },
                                        sub: true,
                                        forced: true,
                                        popup: false,
                                    },
                                },
                                ai: {
                                    order: function (skill, player) {
                                        if (player.countCards('h', 'nanman') > 0 && player.countCards('he', 'zhuge') < 1) {
                                            return 10;
                                        }
                                        return 1;
                                    },
                                    expose: 0,
                                    result: {
                                        target: function (player, target) {
                                            if (!player.canUse('sha', player) && player.countCards('h', 'sha') > 1 && get.attitude(player, target) >= 0 && get.distance(player, target, 'pure') <= 1 + player.countMark('shoupaiup')) {
                                                var e1 = target.get('e', '1');
                                                if (e1) {
                                                    if ((e1.name == 'zhuge') || (e1.name == 'rewrite_zhuge')) return 1.1;
                                                };
                                                if ((target.hasSkill('qigong') || target.hasSkill('guanshi_skill'))) return 1;
                                            }; return 0;
                                        },
                                    },
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            kanpolimitai: {
                                enable: "chooseToUse",
                                locked: false,
                                filter: function (event, player) {
                                    return player.countCards('hs', { color: 'black' }) > 0 && player.countMark('kanpolimitai_wuxiele') < player.countMark('jinengup') + 2
                                },
                                filterCard: function (card) {
                                    return get.color(card) == 'black';
                                },
                                viewAsFilter: function (player) {
                                    return player.countCards('hs', { color: 'black' }) > 0 && player.countMark('kanpolimitai_wuxiele') < player.countMark('jinengup') + 2
                                },
                                viewAs: {
                                    name: "wuxie",
                                },
                                position: "hejs",
                                prompt: "将一张黑色手牌当无懈可击使用；每轮你最多使用x+1次无懈可击，x为技能强化次数",
                                check: function (card) {
                                    var tri = _status.event.getTrigger();
                                    if (tri && tri.card && tri.card.name == 'chiling') return -1;
                                    return 8 - get.value(card);
                                },
                                threaten: 1.2,
                                hiddenCard: function (player, name) {
                                    if (name == 'wuxie' && _status.connectMode && player.countCards('hs') > 0) return true;
                                    if (name == 'wuxie') return player.countCards('hs', { color: 'black' }) > 0;

                                },
                                content: function () {
                                    if (!player.hasMark('kanpolimitai_wuxiele')) { player.addSkill('kanpolimitai_wuxiele'); }; player.addMark('kanpolimitai_wuxiele');
                                },
                                group: ["kanpolimitai_wuxiele", "kanpolimitai_canwuxie"],
                                subSkill: {
                                    wuxiele: {
                                        trigger: {
                                            golbal: "phaseJieshuBegin",
                                            player: "phaseJieshuBegin",
                                        },
                                        force: true,
                                        silent: true,
                                        content: function () {//,player.countMark('diewulimitai_2_shale')player.removeSkill('kanpolimitai_wuxiele');
                                            // if(player.hasMark('kanpolimitai_wuxiele')){
                                            player.removeMark('kanpolimitai_wuxiele', player.countMark('kanpolimitai_wuxiele'));
                                            // };
                                        },
                                        intro: {
                                            marktext: "",
                                            content: function (player) {
                                                return ('使用无懈的次数');
                                            },
                                        },
                                        sub: true,
                                        forced: true,
                                        popup: false,
                                    },
                                    canwuxie: {
                                        trigger: {
                                            player: "useCardAfter",
                                        },
                                        filter: function (event, player) {
                                            return event.card.name == 'wuxie';
                                        },
                                        fixed: true,
                                        silent: true,
                                        content: function () {//,player.countMark('diewulimitai_2_shale')player.removeSkill('kanpolimitai_wuxiele');
                                            //   if(!player.hasMark('kanpolimitai_wuxiele')){
                                            player.addMark('kanpolimitai_wuxiele', 1);
                                            // };
                                        },
                                        intro: {
                                            marktext: "给了杀",
                                            content: function (player) {
                                                return ('使用无懈的次数');
                                            },
                                        },
                                        sub: true,
                                        forced: true,
                                        popup: false,
                                    },
                                },
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
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            kaifa: {
                                position: "hejs",
                                audio: "xinfu_jingxie",
                                enable: "phaseUse",
                                filter: function (event, player) {//group:["xinfu_jingxie2"],
                                    var he = player.getCards('he');
                                    for (var i = 0; i < he.length; i++) {
                                        if (["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].contains(he[i].name)) return true;
                                    }
                                    return false;
                                },
                                filterCard: function (card) {
                                    return ["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].contains(card.name);
                                },
                                discard: false,
                                lose: false,
                                delay: false,
                                check: function () {
                                    return 1;
                                },
                                content: function () {
                                    "step 0"
                                    player.showCards(cards);
                                    "step 1"
                                    var card = cards[0];
                                    var bool = (get.position(card) == 'e');
                                    if (bool) player.removeEquipTrigger(card);
                                    game.addVideo('skill', player, ['xinfu_jingxie', [bool, get.cardInfo(card)]])
                                    game.broadcastAll(function (card) {
                                        card.init([card.suit, card.number, 'rewrite_' + card.name]);
                                    }, card);
                                    if (bool) {
                                        var info = get.info(card);
                                        if (info.skills) {
                                            for (var i = 0; i < info.skills.length; i++) {
                                                player.addSkillTrigger(info.skills[i]);
                                            }
                                        }
                                    }
                                },
                                ai: {
                                    basic: {
                                        order: 10,
                                    },
                                    result: {
                                        player: 1,
                                    },
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            huijiahuihe: {
                                trigger: { player: "phaseEnd", },
                                round: 1, name: "回合", lastDo: true,
                                filter: function (event, player) {//暂时不用
                                    return player.hujia > 0;
                                },
                                check: function (event, player) {
                                    return player.hujia > 0 && player.hp > 0;
                                },
                                content: function () {
                                    player.storage.huijiahuihe = player.hujia;
                                    player.changeHujia(-player.hujia);
                                    player.insertPhase();
                                },
                                group: ["huijiahuihe_hp", "huijiahuihe_draw", "huijiahuihe_roundcount"],
                                subSkill: {
                                    hp: {
                                        trigger: {
                                            player: "phaseAfter",
                                        },
                                        silent: true,
                                        filter: function (event, player) {
                                            return event.skill == 'huijiahuihe' && !player.getStat('damage');
                                        },
                                        content: function () {
                                            game.log('没输出还是来抽张牌吧')
                                            player.draw();
                                        },
                                        sub: true,
                                        forced: true,
                                        popup: false,
                                    },
                                    draw: {
                                        trigger: {
                                            player: "phaseDrawBegin",
                                        },
                                        filter: function (event) {
                                            return event.getParent('phase').skill == 'huijiahuihe';
                                        },
                                        silent: true,
                                        content: function () {
                                            game.log('要少摸牌了')
                                            trigger.num -= (2 - player.storage.huijiahuihe);
                                        },
                                        sub: true,
                                        forced: true,
                                        popup: false,
                                    },
                                },
                            },
                            qianting_xiji: {
                                audio: "ext:舰R牌将:2",
                                audioname: ["re_ganning", "re_heqi"],
                                mod: {
                                    attackFrom: function (from, to, distance) { var a = 0; if (from.hasSkill('quzhudd') && to.hasSkill('qianting')) { var a = a - 1 }; return distance = (distance + a) },
                                    selectTarget: function (card, player, range) { if ((card.name == 'huogong' || card.name == 'guohe' || card.name == 'zhaomingdan9' || card.name == 'xiji9') && player.countMark('jinengup') && range[1] != -1) range[1] += (Math.min(player.countMark('jinengup'), game.players.length - 1)); },
                                    targetInRange: function (card, player, target) {
                                        var type = get.type(card);
                                        if (type == 'trick' || type == 'delay') { if (get.distance(player, target) <= 2) return true; };
                                    },
                                },
                                enable: "chooseToUse",
                                usable: 2,
                                position: "hejs",
                                prompt: "将♦/♥非锦囊牌当做顺手牵羊，♣/♠非锦囊牌当做兵粮寸断使用，<br>限两次。张辽与徐晃合体版<br>锦囊牌可以对距离你为2以内的角色使用。",
                                filter: function (event, player) { if (event.parent.name == 'phaseUse') return player.countCards('hs') > 0; },
                                viewAs: function (cards, player) {
                                    var name = false;
                                    switch (get.suit(cards[0], player)) {
                                        case 'club': name = 'bingliang'; break;
                                        case 'diamond': name = 'shunshou'; break;
                                        case 'spade': name = 'bingliang'; break;
                                        case 'heart': name = 'shunshou'; break;
                                    }
                                    if (name) return { name: name };
                                    return null;
                                },
                                filterCard: function (card, player, event) { return true },
                                selectCard: function (card) { return 1 },
                                check: function (card) {
                                    var player = _status.event.player; return 7 - get.value(card)//if(get.suit(card)=='club'&&player.countMark('jinengup')<1){return -1};，本回合内不能再对同一目标使用此技能
                                },
                                content: function () { },
                                ai: {
                                    basic: {
                                        order: 1,
                                        useful: 3,
                                        value: 3,
                                    },
                                    yingbian: function (card, player, targets, viewer) {
                                        if (get.attitude(viewer, player) <= 0) return 0;
                                        if (game.hasPlayer(function (current) {
                                            return !targets.contains(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                                        })) return 6;
                                        return 0;
                                    },
                                    result: {
                                        target: function (player, target) {
                                            var att = get.attitude(player, target);
                                            var nh = target.countCards('h');
                                            if (att > 0) {
                                                if (target.countCards('j', function (card) {
                                                    var cardj = card.viewAs ? { name: card.viewAs } : card;
                                                    return get.effect(target, cardj, target, player) < 0;
                                                }) > 0) return 3;
                                                if (target.getEquip('baiyin') && target.isDamaged() &&
                                                    get.recoverEffect(target, player, player) > 0) {
                                                    if (target.hp == 1 && !target.hujia) return 1.6;
                                                }
                                                if (target.countCards('e', function (card) {
                                                    if (get.position(card) == 'e') return get.value(card, target) < 0;
                                                }) > 0) return 1;
                                            }
                                            var es = target.getCards('e');
                                            var noe = (es.length == 0 || target.hasSkillTag('noe'));
                                            var noe2 = (es.filter(function (esx) {
                                                return get.value(esx, target) > 0;
                                            }).length == 0);
                                            var noh = (nh == 0 || target.hasSkillTag('noh'));
                                            if (noh && (noe || noe2)) return 0;
                                            if (att <= 0 && !target.countCards('he')) return 1.5;
                                            return -1.5;
                                        },
                                    },
                                    tag: {
                                        loseCard: 1,
                                        discard: 1,
                                    },
                                },
                                intro: {
                                    content: function () { return get.translation(skill + '_info'); },
                                },
                                group: [],
                                subSkill: {},
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            qianting_jiezi: {
                                trigger: {
                                    global: ["phaseJieshuBegin"],
                                },
                                forced: true,
                                filter: function (event, player) {
                                    if (event.player != player) {//touxichuan_mod:{cardDiscardable:function(card,player,name){if(name=='dying') return false;},},&&event.trigger.name=="phaseUseBegin"&&event.trigger.name=="phaseUseBegin"
                                        if (event.player.getHistory('skipped').contains('phaseJudge')) return true;
                                        if (event.player.getHistory('skipped').contains('phaseDraw')) return true;
                                        if (event.player.getHistory('skipped').contains('phaseUse')) return true;
                                        if (event.player.getHistory('skipped').contains('discard')) return true;
                                    }; return false;
                                },
                                content: function () {
                                    player.logSkill('jiezi', trigger.player);
                                    //if(player.getHistory('skipped').length>0) player.draw(player.getHistory('skipped').length);
                                    if (trigger.player.getHistory('skipped').contains('phaseJudge')) player.draw();
                                    if (trigger.player.getHistory('skipped').contains('phaseDraw')) player.draw();
                                    if (trigger.player.getHistory('skipped').contains('phaseUse')) player.draw();
                                    if (trigger.player.getHistory('skipped').contains('discard')) player.draw();
                                },
                                sub: true,
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            qianting: {
                                audio: "ext:1牌将修改:2",
                                trigger: {
                                    global: "phaseZhunbeiBegin",
                                },
                                lastDo: true,
                                round: 1,
                                "prompt2": function (event, player) {
                                },
                                filter: function (event, player) {//意外发现function应用广泛，然而解决不了自动显示隐藏标记。航母开幕，然后根据舰种判断具体出什么杀game.log();
                                    return player.countCards('h') > 0;
                                },
                                content: function () {
                                    'step 0'
                                    var next = player.chooseToDiscard(function (card, player) {
                                        if (player.countMark('jinengup') <= 0) {
                                            if (card.suit == 'heart') {
                                                return lib.filter.cardDiscardable(card, player);
                                            }
                                        }
                                        else if (player.countMark('jinengup') == 1) {
                                            if (card.suit == 'heart' || card.suit == 'spade') {
                                                return lib.filter.cardDiscardable(card, player);
                                            }
                                        }
                                        else if (player.countMark('jinengup') >= 2) {
                                            if (card.suit == 'heart' || card.suit == 'spade' || card.suit == 'diamond') {
                                                return lib.filter.cardDiscardable(card, player);
                                            }
                                        }
                                        return false;
                                    }, 'h')
                                        .set('prompt', '雷杀')
                                        .set('prompt2', '弃置一张符合要求的牌')
                                        .set('ai', card => {
                                            return 5 - get.useful(card);
                                        }).set('logSkill', '潜艇');

                                    /*var next = player.chooseCardTarget({
                                        prompt: ('雷杀'),
                                        prompt2: ('弃置一张符合要求的牌'),
                                        position: 'hejs',//hej代指牌的位置，加个j即可用木流流马的牌。
                                        selectCard: function () {
                                            var player = _status.event.player; if (ui.selected.targets) return [1, 1]; return 1;
                                        },//要气质的卡牌，可以return[1,3]
                                        selectTarget: function () {
                                            var player = _status.event.player; if (ui.selected.cards) return [ui.selected.cards.length, ui.selected.cards.length]; return 1;
                                        },//要选择的目标，同上，目标上限跟着手牌数走，怕报错跟个判定。
                                        
                                        filterCard: function (card, player) {
                                            if (player.countMark('jinengup') <= 0) {
                                                if (card.suit == 'heart') {
                                                    return lib.filter.cardDiscardable(card, player);
                                                }
                                            }
                                            else if (player.countMark('jinengup') == 1) {
                                                if (card.suit == 'heart' || card.suit == 'spade') {
                                                    return lib.filter.cardDiscardable(card, player);
                                                }
                                            }
                                            else if (player.countMark('jinengup') >= 2) {
                                                if (card.suit == 'heart' || card.suit == 'spade' || card.suit == 'diamond') {
                                                    return lib.filter.cardDiscardable(card, player);
                                                }
                                            }
                                            return false;
                                        },
                                        filterTarget: function (card, player, target) {
                                            return player.inRange(target);
                                        },//选择事件包含的目标，同trigger的目标。有其他同技能的角色时，ai不要重复选择目标。
                                        ai1: function (card) {
                                            return 5 - get.useful(card);
                                        },//以5为标准就行。
                                        ai2: function (target) {
                                            var att = -get.attitude(_status.event.player, target);
                                            if (target.hasSkill('zhanliebb') | target.hasSkill('zhanliebb')) { att *= 1.5 };
                                            if (Math.ceil(target.hp * 2) <= target.maxHp) { att *= 2 };
                                            if (target.hasSkill('bagua_skill') | target.hasSkill('re_bagua_skill')) { att *= 0.5 };
                                            return att;
                                        }, targets: trigger.targets,//这个代码不能照搬到content以外的地方。贯石斧、朱雀羽扇有类似代码。还有recover版的。
                                    });//技能还没扩起来，括起来。*///移除选择目标这一过程，视为使用牌自带选择目标。2024.2.18
                                    'step 1'
                                    if (result.bool) {//只能判断你有没有选择，然后给你true与false，没其他文本。
                                        player.discard(result.cards);//前面有卡牌card，可以返回card，不同于仁德主动技能直接写card。
                                        //event.target = result.targets;//前面有目标target，可以返回target。player.discard(player.getCards('h').randomGet()),
                                        //if (player.countCards('h') > 0) { player.useCard({ name: 'sha', nature: 'thunder', isCard: true }, event.target); }//移除选择目标这一过程，视为使用牌自带选择目标。2024.2.18
                                        player.chooseUseTarget({
                                            name: 'sha',
                                            nature: 'thunder',
                                            isCard: true,
                                        }, false,);
                                    } else event.finish();
                                },
                                ai: {
                                    order: 1,
                                    result: {
                                        player: 1,
                                    },
                                    threaten: 1.5,
                                },
                                //a=game.countPlayer(function(current){return get.attitude(player,current)<0&&current.inRange(player)})-1;
                                //if(a=0)event.finish();
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            junfu: {
                                trigger: {
                                    global: ["phaseBegin"],
                                },
                                direct: true,
                                lastDo: true,
                                frequent: true,
                                preHidden: true,
                                locked: false,
                                filter: function (event, player, name) {//输粮改
                                    var a = (event.name == 'phase');
                                    return player.getCards('s', function (card) { return card.hasGaintag('tunchu') }).length > 0 && event.player.countCards('h') < 8 && event.player.isAlive() && event.player != player && a == true;
                                },
                                content: function () {
                                    'step 0'
                                    var goon = (get.attitude(player, trigger.player) > 0); game.log(trigger.name)
                                    player.chooseCardButton(get.prompt('junfu', trigger.player), player.getCards('s', function (card) { return card.hasGaintag('tunchu') }), [1, 3]).set('ai', function () {
                                        if (_status.event.goon) return 1;
                                        return -1;
                                    }).set('goon', goon);
                                    'step 1'
                                    if (result.bool) {
                                        player.logSkill('shuliang', trigger.player);
                                        //player.loseToDiscardpile(result.links);player.discoverCard(get.inpile('trick'));target.loseToSpecial(event.cards2,'asara_yingwei',player).visible=true;player.draw(1);player.draw(1);player.loseToSpecial(,'tunchu',player).visible=true;
                                        trigger.player.gain(result.links, player); player.draw(1);
                                    } else event.finish();
                                    'step 2'

                                },
                                ai: { combo: "tunchu", },
                                group: ["junfu_choose"],
                                onremove: function (player, skill) {
                                    var cards = player.getExpansions(skill);
                                    if (cards.length) player.loseToDiscardpile(cards);
                                },
                                intro: {
                                    content: "expansion",
                                    markcount: "expansion",
                                },
                                subSkill: {
                                    choose: {
                                        trigger: {
                                            player: "phaseBegin",
                                        },
                                        forced: true,
                                        popup: false,
                                        firstDo: true,
                                        filter: function (event, player) {
                                            var zongshu = 1 + player.countMark('jinengup'), cunpaishu = player.getExpansions('tunchu').length + player.getCards('s', function (card) { return card.hasGaintag('tunchu') }).length;
                                            return zongshu > cunpaishu && player.countCards('h');
                                        },
                                        charlotte: true,
                                        content: function () {
                                            'step 0'
                                            var nh = Math.min(player.countCards('h'), Math.ceil(player.getHandcardLimit()));
                                            var duiyou = game.countPlayer(function (current) { return get.attitude(player, current) > 0; });
                                            var zongshu = 1 + player.countMark('jinengup'), cunpaishu = player.getExpansions('tunchu').length + player.getCards('s', function (card) { return card.hasGaintag('tunchu') }).length;
                                            if (nh && zongshu > cunpaishu) {
                                                player.chooseCard('h', [1, Math.min(nh, zongshu - cunpaishu)], '将任意张手牌置于你的武将牌上,<br>存牌上限为1+技能强化等级。<br>单次存牌量上限为手牌上限,<br>这些牌可以在回合外递给其他角色').set('ai', function (card) {
                                                    var player = _status.event.player;
                                                    if (ui.selected.cards.type == "equip") return -get.value(card);
                                                    if (ui.selected.cards.length >= duiyou) return -get.value(card);
                                                    return 9 - get.value(card);
                                                });
                                            }
                                            else { event.finish(); }
                                            'step 1'
                                            if (result.bool) {
                                                // player.addToExpansion(result.cards,player,'giveAuto').gaintag.add('tunchu');player.update();
                                                player.loseToSpecial(result.cards, 'tunchu', player).visible = true;
                                            }
                                            'step 2'

                                        },
                                        sub: true,
                                    }
                                    ,
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            quzhudd: {
                                mod: { globalFrom: function (from, to, distance) { return distance - (to.hasSkill('qianting')); }, },
                                group: [],
                                ai: {
                                    expose: 0,
                                    threaten: 4.8,
                                    order: 5,
                                    result: {
                                        player: 1,
                                    },
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill);
                                    },
                                },
                            },
                            daoqu: {
                                mod: {
                                    //selectTarget:function(card,player,range){///是卡片作用时可选的目标数量，输出range给牌的发起事件阶段用。
                                    //if(range[1]==-1) return;var a=game.countPlayer(function(current){return get.attitude(player,current)<=0&&current.inRange(player)})-1;
                                    //if(card.name=='sha') range[1]+=Math.min(player.countMark('jinengup'),a);},
                                    attackRange: function (from, distance) {
                                        return distance + (2 + from.getExpansions('jinengup').length);
                                    },
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            huibi: {
                                inherit: "bagua_skill",
                                audio: "bagua_skill",
                                firstDo: true,
                                content: function () {//已经有一个给牌技能了
                                    "step 0"
                                    event.cards = [];
                                    player.judge('huibi', function (card) {
                                        if (player.countMark('jinengup') <= 0) {
                                            return (get.suit(card) == 'diamond') ? 1.6 : -0.5
                                        } else if (player.countMark('jinengup') == 1) {
                                            return (get.name(card) == 'huibi9' || get.name(card) == 'kuaixiu9' || get.name(card) == 'tao' || get.name(card) == 'shan' || get.suit(card) == 'diamond') ? 1.6 : -0.5
                                        } else if (player.countMark('jinengup') >= 2) {
                                            return (get.suit(card) == 'heart' || get.suit(card) == 'diamond') ? 1.6 : -0.5
                                        }
                                    }).judge2 = function (result) {
                                        return result.bool;
                                    };
                                    //以下部分是回避判定失败后摸牌。2023.8.6移除
                                    /*if(result.judge<=0){event.cards.push(result.card);if(Math.max(player.getHandcardLimit(),3)>=player.countCards('h')){player.gain(event.cards);
                              //var next=player.chooseToDiscard(get.prompt('回避弃牌事件'),1,'手牌数超过上限，请弃置一张手牌',true);
                                //    next.ai=function(card){
                                          //  return 30-get.useful(card);}
                                        
                                          };
                               //if(player.hasSkill('quzhudd')){if(!player.countMark('huibi')){player.addMark('huibi');event.goto(0);}else {player.removeMark('huibi',player.countMark('huibi'));};};
                                    };*/
                                    "step 1"
                                    if (result.judge > 0) {
                                        trigger.untrigger(); player.removeMark('huibi', player.countMark('huibi'));
                                        trigger.set('responded', true);
                                        trigger.result = { bool: true, card: { name: 'shan' } }
                                    };
                                },
                                equipSkill: true,
                                trigger: {
                                    player: ["chooseToRespondBegin", "chooseToUseBegin"],
                                },
                                filter: function (event, player) {
                                    if (event.responded) return false;
                                    if (event.huibi) return false;
                                    if (!player.isEmpty(2)) return false;
                                    if (!event.filterCard || !event.filterCard({ name: 'shan' }, player, event)) return false;
                                    if (event.filterCard({ name: 'tao' }, player, event)) return false;
                                    if (event.name == 'chooseToRespond' && !lib.filter.cardRespondable({ name: 'shan' }, player, event)) return false;
                                    if (player.hasSkillTag('unequip2')) return false;
                                    var evt = event.getParent();
                                    if (evt.player && evt.player.hasSkillTag('unequip', false, {
                                        name: evt.card ? evt.card.name : null,
                                        target: player,
                                        card: evt.card
                                    })) return false;
                                    return true;
                                },
                                check: function (event, player) {
                                    if (event && (event.ai || event.ai1)) {
                                        var ai = event.ai || event.ai1;
                                        var tmp = _status.event;
                                        _status.event = event;
                                        var result = ai({ name: 'shan' }, _status.event.player, event);
                                        _status.event = tmp;
                                        return result > 0;
                                    }
                                    return true;
                                },
                                ai: {
                                    respondShan: true,
                                    effect: {
                                        target: function (card, player, target, effect) {
                                            if (target.hasSkillTag('unequip2')) return;
                                            if (player.hasSkillTag('unequip', false, {
                                                name: card ? card.name : null,
                                                target: target,
                                                card: card
                                            }) || player.hasSkillTag('unequip_ai', false, {
                                                name: card ? card.name : null,
                                                target: target,
                                                card: card
                                            })) return;
                                            if (get.tag(card, 'respondShan')) return 0.5;
                                        },
                                    },
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },


                            huokongld: {
                                equipSkill: true, firstDo: true, direct: true,
                                trigger: { player: ["shaMiss", "eventNeutralized"], }, audio: "ext:舰R牌将:true",
                                filter: function (event, player) {
                                    if (event.type != 'card' || event.card.name != 'sha') return false;

                                    return player.countCards('he', function (card) { return card != player.getEquip('guanshi'); }) >= 1 && event.target.isAlive();
                                },
                                content: function () {
                                    "step 0"
                                    //get.prompt2('huokongld')Math.max(0,2-player.countMark('jinengup'))player.chooseToCompare(trigger.player);if(player.countMark('jinengup')>1){player.chooseToCompare(trigger.target);event.goto(2);};else if(player.countMark('jinengup')>1){player.}
                                    var evt = _status.event.getTrigger(), num = evt.baseDamage + evt.extraDamage, a = player.countMark('jinengup'); if (player.countMark('jinengup') > 1) { a = 1 };
                                    /*if(player.hasSkill('guanshi_skill')||player.getEquip('shangyouyh9')){
                                   player.chooseControl('<span class=yellowtext>强制命中'+'</span>','cancel2').set('prompt',get.prompt('huokongld')).set('prompt2','令本次攻击命中对手,<br>装备贯石斧时，此技能反转了贯石斧的效果，使其更为强悍，<br>根据技能强化等级*此次伤害量：对面摸2/1/0*'+num+'张牌。').set('ai',function(card){
                                   var evt=_status.event.getTrigger();
                                        if(get.attitude(evt.player,evt.target)<0){
                                            if(evt.baseDamage+evt.extraDamage>=Math.min(2,evt.target.hp)){
                                                return 1.1}return 1}return -1;});
                                    }else {*///以上是同时拥有火控技能与贯石斧时的处理方法。2023.8.6移除。
                                    var next = player.chooseToDiscard('令本次攻击改为命中对手,<br>0级，你弃置一张杀，一级，你弃置一张黑色牌，二级，你弃置1张牌。', 'he', function (card) {
                                        if (player.countMark('jinengup') <= 0) {
                                            return get.name(card) == 'sha';
                                        } else if (player.countMark('jinengup') == 1) {
                                            return (get.suit(card) == 'spade' || get.suit(card) == 'club') && _status.event.player.getEquip('guanshi') != card;
                                        } else if (player.countMark('jinengup') >= 2) {
                                            return _status.event.player.getEquip('guanshi') != card;
                                        }
                                    });
                                    next.logSkill = 'guanshi_skill';
                                    next.set('ai', function (card) {
                                        var evt = _status.event.getTrigger();
                                        if (get.attitude(evt.player, evt.target) < 0) {
                                            if (evt.baseDamage + evt.extraDamage >= Math.min(2, evt.target.hp)) {
                                                return 7 - get.value(card)
                                            } return 5 - get.value(card)
                                        } return -1;
                                    });
                                    "step 1"
                                    if (result.bool || result.index == 0) {
                                        if (event.triggername == 'shaMiss') {
                                            var evt = _status.event.getTrigger();
                                            /*if(!player.hasSkill('guanshi_skill')&&!player.getEquip('huokongld')){if(player.countMark('jinengup')=1){trigger.target.draw((evt.baseDamage+evt.extraDamage));};}else{evt.target.draw((2-player.countMark('jinengup'))*(evt.baseDamage+evt.extraDamage));};*///移除对方摸牌的部分，2023.8.6
                                            trigger.untrigger(); trigger.trigger('shaHit');
                                            trigger._result.bool = false; trigger._result.result = null;
                                        }
                                        else { trigger.unneutralize(); }
                                    }
                                    "step 2"
                                    if (result.bool) {
                                        trigger.untrigger(); trigger.trigger('shaHit');
                                        trigger._result.bool = false; trigger._result.result = null;
                                    };
                                },
                                ai: {
                                    "directHit_ai": true,
                                    skillTagFilter: function (player, tag, arg) {
                                        if (player._guanshi_temp) return;
                                        player._guanshi_temp = true;
                                        var bool = (get.attitude(player, arg.target) < 0 && arg.card.name == 'sha' && player.countCards('he', function (card) {
                                            return card != player.getEquip('guanshi') && card != arg.card && (!arg.card.cards || !arg.card.cards.contains(card)) && get.value(card) < 5;
                                        }) > 1);
                                        delete player._guanshi_temp;
                                        return bool;
                                    },
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            "ganglie_gai": {
                                audio: "ext:舰R牌将:2",
                                trigger: { player: "damageEnd", },
                                filter: function (event, player) {
                                    return (event.source != undefined && event.source != player && event.player.hp <= event.player.maxHp / 2);
                                },
                                check: function (event, player) {
                                    return (get.attitude(player, event.source) <= 0);
                                },
                                logTarget: "source",
                                content: function () {
                                    "step 0"//if(player.countCards('h')>=3) event.tishi+=('');
                                    event.num = trigger.num; if (trigger.hujia) { event.num = 1 }; event.tishi = '你可以弃置(0-2)张牌并进行判定。<br>若结果不为红桃，则伤害来源选择一项：<br>1.弃置x+1张手牌，<br>2.选择交给你一张牌;<br>3.失去一点体力(无视护甲)。<br>若你先弃置了两张牌，<br>则1.判定失败时可以获得目标的一张牌;<br>2.目标未选择弃牌时，会额外失去一张牌。'; var shili = trigger.source.countCards('he') / player.countCards('he');
                                    if (player.countCards('h') >= 3) { event.tishi += ('<br>'); if (shili >= 1.5) { event.tishi += ('对手处于优势，希望此技能 能成功减弱对手的攻势吧') }; if (shili < 1.5 && shili >= 1.2) { event.tishi += ('对手处于优势，尝试获取廉价的收益吧') }; if (shili < 1.2 && shili >= 0.8) { event.tishi += ('即将打破的僵持状况，稳住心态') }; if (shili < 0.8) { event.tishi += ('稳妥起见，多弃置一张也无妨，有一个弱化的顺手牵羊作为保底嘛') }; };
                                    "step 1"
                                    if (trigger.source.isAlive()) {
                                        player.chooseToDiscard([0, 2]).set('prompt2', event.tishi).set('ai', function (card) {
                                            if (ui.selected.cards.length) return -1;
                                            if (card.name == 'tao') return -10;
                                            if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
                                            return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
                                        });
                                    };
                                    "step 2"//game.log(result.cards);  
                                    //   if(result.bool){
                                    event.num -= (1); if (result.bool) { event.qipai = result.cards.length; } else event.qipai = 0;
                                    player.judge(function (card) {
                                        if (get.suit(card) == 'heart') return -2;
                                        return 2;
                                    }).judge2 = function (result) {
                                        return result.bool;
                                    };//}else event.finish();
                                    "step 3"
                                    if (result.judge < 2) {
                                        event.finish(); if (event.qipai > 1) { player.gainPlayerCard(true, trigger.source, 'he'); };
                                    } else {
                                        event.tishi = '作为伤害来源，选择一项：<br>现在是：1.弃置x+1张手牌，<br>接下来是：2.选择交给' + get.translation(player) + '一张手牌;<br>3.失去一点体力(无视护甲)。<br>'; if (event.qipai > 1) { event.tishi += ('对手先弃置了两张牌，其判定失败时，可以获得你的一张牌；你进行选择2前，会额外失去一张牌。') };
                                        trigger.source.chooseToDiscard(1 + event.qipai).set('prompt2', event.tishi).set('ai', function (card) {
                                            if (card.name == 'tao') return -10;
                                            if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
                                            return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
                                        });
                                    };
                                    "step 4"
                                    if (result.bool == false) {
                                        event.tishi = '作为伤害来源：2.选择交给' + get.translation(player) + '一张手牌;<br>3.不执行，则自己失去一点体力(无视护甲)。<br>'; if (event.qipai > 1) { event.tishi += ('对手先弃置了两张牌，你进行选择2前，若手牌大于1，会额外失去一张牌。<br>'); if (trigger.source.countCards('h') >= 2) { trigger.source.discard(trigger.source.getCards('h').randomGet()); }; };
                                        if (trigger.source.countCards('h', { name: 'tao' }) >= 0) { event.tishi += ('有桃，不怕扣血；') }; if (trigger.source.countCards('h', { name: 'jiu' }) >= 0) { event.tishi += ('有酒,没血不慌；') }; if (trigger.source.countCards('h', { name: 'shandian' }) + trigger.source.countCards('h', { name: 'taoyuan' }) >= 0) { event.tishi += ('有些稀有卡牌能变废为宝，转给对手') };
                                        if (!trigger.source.countCards('h')) event._result = { bool: false };
                                        else trigger.source.chooseCard('h').set('prompt2', event.tishi).set('ai', function (card) {
                                            if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
                                                if (card.name == 'tao') return -10; if (card.name == 'jiu' && _status.event.player.hp != 1) return -10;
                                                if (event.qipai < 1) { return -10; };
                                                if (get.suit(card) != 'heart') return 7 - get.value(card);
                                                return 5 - get.value(card);
                                            }
                                            else {
                                                if (card.name == 'tao') return -10;
                                                if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
                                                return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
                                            }
                                        });
                                    };
                                    'step 5'
                                    if (result.bool) {
                                        var card = result.cards[0];

                                        trigger.source.give(card, player);
                                    }
                                    else {
                                        trigger.source.loseHp();
                                    };
                                    if (event.num > 0) { event.goto(1) };
                                },
                                ai: {
                                    "maixie_defend": true,
                                    effect: {
                                        target: function (card, player, target) {
                                            if (player.hasSkillTag('jueqing', false, target)) return [1, -1];
                                            return 0.8;
                                            // if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
                                        },
                                    },
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            zhiyangai: {
                                audio: "ext:舰R牌将:2",
                                audioname: ["gexuan", "re_yufan"],
                                trigger: {
                                    player: "phaseJieshuBegin",
                                },
                                direct: true,
                                content: function () {
                                    "step 0"
                                    event.num1 = player.countMark('jinengup') + 1; event.num2 = 0;
                                    var a = game.countPlayer(function (current) { return get.attitude(player, current) > 0 });
                                    player.chooseTarget(get.prompt('zhiyan'), [1, Math.min(event.num1, a)], '令目标角色摸一张牌并展示之。<br>若为装备牌，则其选择是否装备。<br>(每强化一次技能，便+1技能的可以选择的目标数)', function (card, player, target) {
                                        return get.distance(player, target, 'pure') <= 1 + player.countMark('jinengup');
                                    }).set('ai', function (target) {
                                        return get.attitude(_status.event.player, target);
                                    });
                                    "step 1"
                                    if (result.bool) {
                                        event.target = result.targets;
                                        player.logSkill('zhiyan', result.targets);
                                    }
                                    else {
                                        event.finish();
                                    }
                                    "step 2"
                                    event.target[event.num2].draw('visible');
                                    "step 3"
                                    var card = result[0];
                                    if (get.type(card) == 'equip') {
                                        if (event.target[event.num2].getCards('h').contains(card) && event.target[event.num2].hasUseTarget(card)) {
                                            event.target[event.num2].chooseUseTarget(card);
                                            game.delay();
                                        }
                                    }
                                    "step 4"
                                    if (event.target.length - 1 > event.num2) {
                                        event.num2 += (1); event.goto(2);
                                    }
                                },
                                ai: {
                                    expose: 0.2,
                                    threaten: 1.2,
                                },
                            },
                            "fangkong2": {
                                name: "防空", //audio: "ext:舰R牌将:1", audioname: ["yixian", "reganning", "sunce", "re_sunben", "re_sunce", "ol_sunjian"],
                                unique: true, nodelay: true, lastDo: true,
                                trigger: { global: "useCardToPlayered", },
                                filter: function (event, player) {
                                    if (event.getParent().triggeredTargets3.length > 1) return false;//万箭要作用七个目标,而你不想跟着遍历七次技能。
                                    if (get.type(event.card) != 'trick') return false;
                                    if (get.info(event.card).multitarget) return false;
                                    if (!player.countCards('he')) return false;
                                    if (event.targets.length < 2) return false;
                                    return true;
                                },
                                direct: true,
                                content: function () {
                                    'step 0'
                                    var next = player.chooseCardTarget({
                                        prompt: get.prompt('防空保护对象'),
                                        prompt2: ('当一名角色使用的锦囊牌指定了至少两名角色为目标时，<br>你可弃置两张牌令此牌对距离你为' + (player.countMark('jinengup') + 1) + '的任意名角色无效。<br>技能强化:+' + (player.countMark('jinengup')) + '技能覆盖范围。'),
                                        position: 'hejs',//hej代指牌的位置，加个s即可用木流流马的牌。
                                        selectCard: function () {
                                            var player = _status.event.player;/*if(ui.selected.targets)return [1,Math.min(trigger.targets.length,Math.floor(player.countCards('he')))];*///取消弃牌数与选择目标数相等改为固定弃置两张牌2023.8.7
                                            return 2;
                                        },//要气质的卡牌，可以return[1,3]if(ui.selected.cards)return [ui.selected.cards.length,ui.selected.cards.length+player.countMark('jinengup')];return 1;-player.countMark('jinengup')
                                        selectTarget: function () {
                                            var player = _status.event.player;/*if(ui.selected.cards)return [ui.selected.cards.length,ui.selected.cards.length];*/return [1, 7];
                                        },//要选择的目标，同上，目标上限跟着手牌数走，怕报错跟个判定。
                                        filterCard: function (card, player) {
                                            return lib.filter.cardDiscardable(card, player);
                                        },//气质能气质掉的卡牌。
                                        filterTarget: function (card, player, target) {
                                            return _status.event.targets.contains(target) && !target.hasSkill('fangkong2_aibiexuan') && get.distance(player, target) <= (1 + player.countMark('jinengup'));
                                        },//选择事件包含的目标，同trigger的目标。有其他同技能的角色时，ai不要重复选择目标。
                                        ai1: function (card) {
                                            return 7 - get.useful(card);
                                        },//建议卡牌以7为标准就行，怕ai不救队友，所以调高了。同时ai顺次选择卡牌时不要选太多卡牌，要形成持续的牵制。
                                        ai2: function (target) {
                                            var trigger = _status.event.getTrigger();
                                            return -get.effect(target, trigger.card, trigger.player, _status.event.player);
                                        }, targets: trigger.targets,//这个代码不能照搬到content以外的地方。贯石斧、朱雀羽扇有类似代码。还有recover版的。
                                    });//技能还没扩起来，括起来。
                                    'step 1'
                                    if (result.bool) {//只能判断你有没有选择，然后给你true与false，没其他文本。
                                        player.discard(result.cards);//前面有卡牌card，可以返回card，不同于仁德主动技能直接写card。
                                        event.target = result.targets;//前面有目标target，可以返回target。
                                        if (event.target != undefined) { for (var i = 0; i < trigger.targets.length; i += (1)) { if (event.target.contains(trigger.targets[i])) { trigger.getParent().excluded.add(trigger.targets[i]); trigger.targets[i].addSkill('fangkong_aibiexuan'); game.log('取消卡牌目标', trigger.targets[i], '编号', i) } } };//三级选择，集合target是否包含trigger.target。同时测试是否选到了目标。
                                        player.logSkill('fangkong2', event.target);

                                        if (player.hasSkill('duikongfangyu') && _status.currentPhase != player) player.draw(2);//对空防御的技能效果。若玩家拥有对空防御，则发动防空后可以摸牌。
                                    }//让技能发语音，发历史记录。
                                },
                                subSkill: {
                                    d: {
                                        trigger: {
                                            global: "useCardEnd",
                                        },
                                        forced: true,
                                        content: function () { game.log('保护结束'); player.removeSkill('fangkong2_aibiexuan'); },
                                        sub: true,
                                    },
                                },
                            },

                            manchangzhanyi: {
                                trigger: { global: "phaseZhunbeiBegin" }, // 触发时机：其他角色的准备阶段
                                filter: function (event, player) {
                                    return player.inRange(event.player); // 在你的攻击范围内
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
                            manchangzhanyi_1: {
                                group: ["manchangzhanyi_1_mianyi"],
                                subSkill: {
                                    mianyi: {
                                        trigger:
                                        {
                                            player: "damageBefore",
                                            source: "damageSource",
                                            filter: function (event, player) { return true },
                                        },
                                        forced: true,
                                        content: function () {

                                            if (!player.hasSkill('manchangzhanyi_1_disable') && trigger.card && trigger.card.name != 'sha' && trigger.card.name != 'sheji9') {
                                                trigger.cancel();
                                                game.log(player, "免疫了一次锦囊牌造成的伤害。");
                                                player.addTempSkill('manchangzhanyi_1_disable', 'roundStart');
                                            }
                                        },
                                        mark: false,
                                        sub: true,
                                    },
                                    disable: {
                                        mark: true,
                                        intro: {
                                            content: "本轮已发动",
                                        },
                                        sub: true,
                                    },
                                },
                            },




                            guzhuyizhi: {
                                audio: "ext:舰R牌将:true",
                                trigger: { player: 'phaseUseBegin' },

                                check: function (event, player) {
                                    var nh = player.countCards('h') - player.countCards('h', { type: 'equip' });
                                    if (nh <= 1) return true;
                                    if (player.countCards('h', 'tao')) return false;
                                    if (nh <= 2) return Math.random() < 0.7;
                                    if (nh <= 3) return Math.random() < 0.4;
                                    return false;
                                },
                                content: function () {
                                    player.draw(2);
                                    player.discard(player.getCards("h"));
                                    player.draw(player.countCards("h"));
                                    player.addTempSkill('guzhuyizhi2', { player: 'phaseBegin' });
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
                                    cardEnabled: function (card) {
                                        if (card.name == 'tao' || card.name == 'kuaixiu9') return false;
                                    },
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

                            shuileizhandui: {
                                audio: "ext:舰R牌将:true",
                                enable: "phaseUse",
                                filterCard: true,
                                position: 'hejs',
                                discard: false,
                                selectCard: [1, Infinity],
                                lose: false, check: function (card) {
                                    var player = _status.event.player;
                                    var val = 5;
                                    if (player.needsToDiscard()) val = 15;
                                    return val - get.value(card);
                                },
                                filterTarget: function (card, player, target) {
                                    return player != target;
                                },
                                //使用give必须要以上这三条属性
                                prompt: function () { return ('选择一名角色并交给其任意张牌') },
                                content: function () {
                                    "step 0";
                                    player.give(cards, targets[0],);
                                    "step 1";
                                    if (!player.hasSkill("shuileizhandui_1")) {
                                        var card = get.cardPile(function (card) {
                                            return card.name == 'sheji9' && card.nature == 'thunder';
                                        });
                                        if (card) {
                                            game.log("在牌堆中查找到了雷属性射击");
                                            player.gain(card, 'gain2');
                                        }
                                        player.addTempSkill("shuileizhandui_1", { player: 'phaseJieshuBegin' });
                                    }
                                    game.log("step end");
                                }, ai: {
                                    expose: 0.1,
                                    order: 5,
                                    result: {
                                        target: function (player, target) {
                                            if (!ui.selected.cards.length) return 0;
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


                            shuileizhandui_1: {
                                /*trigger: { player: "gainEnd" }, // 当你获得牌时触发
                                direct: true,
                                filter: function (event, player) {
                                    return !player.hasMark('shuileizhandui_1');
                                },
                                content: function () {
                                    "step 0"
                                    player.chooseCardTarget({
                                        prompt: get.prompt('战队支援'),
                                        prompt2: ('选择一张卡牌，令指定的一名本回合内未因“水雷战队1”获得牌的角色获得之'),
                                        position: 'hejs',//hej代指牌的位置，加个s即可用木流流马的牌。
                                        selectCard: function () {
                                            var player = _status.event.player;
                                            return 1;
                                        },//要气质的卡牌，可以return[1,3]
                                        selectTarget: function () {
                                            var player = _status.event.player; return [1];
                                        },//要选择的目标，同上，目标上限跟着手牌数走，怕报错跟个判定。
                                        filterCard: function (card, player) {
                                            return lib.filter.cardDiscardable(card, player);
                                        },//气质能气质掉的卡牌。
                                        filterTarget: function (card, player, target) {
                                            return target != player && !target.hasMark("shuileizhandui_1");
                                        },//选择事件包含的目标,有其他同技能的角色时，ai不要重复选择目标。
                                        ai1: function (card) {
                                            return 12 - get.useful(card);
                                        },//建议卡牌以7为标准就行，不要选太多卡牌，要形成持续的牵制。
                                        ai2: function (target) {
                                            return get.attitude(player, target);
                                        }, //targets: trigger.targets,//贯石斧、朱雀羽扇有类似代码。还有recover版的。
                                    });//技能还没扩起来，括起来。
                                    "step 1";
                                    if (result.bool) {
                                        result.targets[0].addTempSkill("shuileizhandui_1", { player: 'phaseJieshuBegin' });
                                        if (game.countPlayer(function (current) {
                                            return current.hasMark('shuileizhandui_1');
                                        }) == 3) {
                                            for (var i = 0; i < game.players.length; i++) {
                                                var current = game.players[i];
                                                if (current.hasSkill('shuileizhandui')) {
                                                    current.draw(1);
                                                }
                                            }
                                        }
                                        player.give(result.cards[0], result.targets[0]);
                                        result.targets[0].addMark("shuileizhandui_1");
                                        result.targets[0].useSkill('shuileizhandui_1');
                                    };
                                },
                                onremove: function (player) { player.removeGaintag('shuileizhandui_1'); },
                                ai: {
                                    order: function (skill, player) {
                                        return 1;
                                    },
                                    result: {
                                        target: function (player, target) {
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
                                trigger: {
                                    global: "gameStart",
                                },
                                forced: true,
                                content: function () {
                                    game.log("获得“回避”");
                                    player.addSkill("huibi");
                                    var num = game.countPlayer(function (current) {
                                        return current.hasSkill('hangmucv');
                                    });
                                    if (num <= 1) {
                                        game.log("获得多刀加伤");
                                        player.addSkill("dumuchenglin_2");
                                    }
                                },

                            },
                            dumuchenglin_2: {
                                audio: "ext:舰R牌将:true",
                                mod: {
                                    cardUsable: function (card, player, num) {
                                        if (card.name == 'sha') return num + 1;
                                    },
                                },
                                trigger: {
                                    source: "damageBegin1",
                                },
                                filter: function (event, player) {
                                    if (player != event.player) {
                                        game.log("本回合造成伤害量：" + player.getStat().damage);

                                        if (player.getStat().damage == undefined || player.getStat().damage <= 1) {  //这个神奇变量的变化过程是：undefined，2,3,4...
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
                            },
                            xiangrui: {
                                audio: "ext:舰R牌将:true",
                                trigger: { player: "damageBegin4", },
                                usable: 1,
                                mark: true,
                                content: function () {
                                    "step 0"
                                    player.judge(function (card) {
                                        if (get.suit(card) == 'spade') {
                                            trigger.cancel();
                                            player.addMark('xiangrui', 1);
                                        }
                                    });
                                },
                                marktext: "祥瑞",
                                intro: {
                                    name: "祥瑞",
                                    content: "幸运值$",
                                },
                            },
                            yumian: {
                                audio: "ext:舰R牌将:true",
                                trigger: {
                                    player: "phaseJieshuBegin",
                                },
                                forced: true,
                                preHidden: true,
                                content: function () {
                                    "step 0"
                                    //player.addMark('xiangrui', 1);
                                    var i = player.countMark('xiangrui');
                                    player.removeMark('xiangrui', i);
                                    game.log(i);
                                    var s = (i <= 0);

                                    //if (s) {
                                    //game.log("finish");
                                    //event.finish;
                                    //} else {
                                    player.chooseTarget(get.prompt2('yumian'), function (card, player, target) { if (s) { return get.distance(player, target) <= 1; } else { return true } }).set('ai', function (target) {
                                        if (get.attitude(_status.event.player, target) < 0) {
                                            return 1 / Math.sqrt(target.hp + 1);
                                        }
                                        return 0;
                                    }).animate = false;
                                    //}
                                    "step 1"
                                    if (result.bool && result.targets.length) {
                                        result.targets[0].loseHp(1);
                                        result.targets[0].draw(2);
                                    }
                                },
                            },
                            hangkongzhanshuxianqu: {
                                //audio: "ext:舰R牌将:true",
                                trigger: {
                                    player: "useCardToPlayered",
                                },
                                direct: true,
                                frequent: true,
                                filter: function (event, player) {
                                    if (event.getParent().triggeredTargets3.length > 1) return false;
                                    return event.targets.length > 0 && (get.type(event.card) == 'trick' && !event.card.isCard);
                                },
                                content() {
                                    "step 0"
                                    event.cards = get.cards(trigger.targets.length);
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
                                    for (var i of cards) list.add(get.suit(i, false));
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
                                    }
                                    var time = 1000 - (get.utc() - event.time);
                                    if (time > 0) {
                                        game.delay(0, time);
                                    }
                                    "step 3"
                                    game.broadcastAll('closeDialog', event.videoId);
                                    var cards2 = event.cards2;
                                    player.gain(cards2, 'log', 'gain2');
                                },
                                ai: {
                                    threaten: 3,
                                },
                            },
                            gaosusheji: {
                                audio: "ext:舰R牌将:true",
                                zhuanhuanji: true,
                                mark: true,
                                marktext: "☯",
                                intro: {
                                    content: function (storage, player) {
                                        if (storage) return '出牌阶段你使用的第一张牌为普通锦囊牌时，你可以令此牌额外结算一次。';
                                        return '出牌阶段你使用的第一张牌为基本牌时，你可以令此牌额外结算一次。';
                                    },
                                },
                                trigger: {
                                    player: "useCard",
                                },
                                
                                filter: function (event, player) {
                                    var evtx = event.getParent('phaseUse');
                                    if (!evtx || evtx.player != player) return false;
                                    if (player.countUsed() != 1) return false;
                                    game.log(evtx);
                                    if (player.storage.gaosusheji) {
                                        game.log("阳");
                                        return _status.currentPhase == player && (get.type(event.card) == 'trick') & event.getParent('phaseUse') == evtx;
                                    } else {
                                        game.log("阴");
                                        return _status.currentPhase == player && (get.type(event.card) == 'basic') & event.getParent('phaseUse') == evtx;

                                    }

                                },
                                //direct: true,
                                content: function () {
                                    player.changeZhuanhuanji('gaosusheji');
                                    trigger.effectCount++;
                                    game.logskill(gaosusheji);
                                },
                            },
                            qixi_cv: {
                                audio: "ext:舰R牌将:true",
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
                                    game.log(event.targets);
                                    'step 1'
                                    lib.target = event.targets.shift();
                                    if (lib.target.countCards('he') < 1) event._result = { index: 2 };
                                    else lib.target.chooseControlList(
                                        ['令' + get.translation(player) + '弃置你区域内的两张牌',
                                            '本回合不能使用或打出手牌', '翻面'],
                                        true).set('ai', function (event, player) {
                                            var target = _status.event.getParent().player;
                                            var player = _status.event.player;
                                            var options = [
                                                { name: "弃牌", weight: 3 },
                                                { name: "沉默", weight: 3 },
                                                { name: "翻面", weight: 1 },
                                            ];
                                            //根据条件修改权重
                                            if (get.attitude(player, target) > 0) options[1].weight += 1;
                                            if (!lib.target.hasEmptySlot(2)) options[0].weight -= 2;
                                            else if (lib.target.countCards("h") > 3) options[0].weight += 1;
                                            if (lib.target.hp <= 2) options[1].weight -= 1;

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
                                            game.log('selectedOption' + selectedOption);
                                            if (selectedOption == "弃牌") return 0;
                                            else if (selectedOption == "沉默") return 1;
                                            else if (selectedOption == "翻面") return 2;


                                            return 2;
                                        });


                                    game.log(lib.target);
                                    game.log("选择完成");
                                    'step 2'
                                    if (result.index == 0) {
                                        game.log("弃牌");
                                        player.discardPlayerCard(lib.target, 2, 'hej', true)

                                    } else if (result.index == 1) {
                                        game.log("不能使用手牌");
                                        lib.target.addTempSkill('qixi_cv_block');

                                    } else {
                                        game.log("翻面");
                                        lib.target.turnOver();

                                    }

                                    game.log("操作完成");

                                    'step 2'
                                    if (event.num < targets.length) event.goto(1);
                                    else game.delayx();
                                    game.log("技能结束");
                                    'step 3'
                                    player.chooseTarget("请选择目标，视为使用【万箭齐发】", [1, Infinity], function (card, player, target) {
                                        return player != target;
                                    }).set("ai", function (target) {
                                        return -get.attitude(player, target);
                                    });
                                    "step 4"
                                    if (result.targets && result.targets.length > 0) {
                                        player.useCard({ name: 'jinjuzy' }, result.targets, false);
                                    }
                                    /*var next = game.createEvent('hangmucv');
                                    next.player = player;
                                    next.setContent(lib.skill.hangmucv.content);*/
                                },
                                subSkill: {
                                    block: {
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
                                ai: {
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
                                        { name: "六", weight: 1 },
                                    ];

                                    game.log(options);
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
                                forced: true,


                                ai: {
                                    notrick: true,
                                    effect: {
                                        target: function (card, player, target, current) {
                                            if (target.countCards('he') <= 1) return;
                                            if (get.type(card) == 'trick' && (get.name(card) == 'nanman' || get.name(card) == 'wanjian' || get.name(card) == 'jinjuzy9' || get.name(card) == 'manchangyy9' || get.name(card) == 'zhiyuangj9' || get.name(card) == 'lastfriend9' || get.name(card) == 'paohuofg9')) {
                                                return 0.6;
                                            }
                                        },
                                    },
                                },

                                "_priority": 0,

                            },
                            zhudaojiandui: {
                                audio: "ext:舰R牌将:true",
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
                                audio: "ext:舰R牌将:true",
                                group: ["sawohaizhan_1", "sawohaizhan_2"],
                                preHidden: ["sawohaizhan_1", "sawohaizhan_2"],
                                "_priority": 0,
                            },
                            sawohaizhan_1: {
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
                                },
                                prompt: "将一张黑色牌当雷杀使用",
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
                                "_priority": 0,

                            },
                            sawohaizhan_2: {
                                enable: "phaseUse",
                                usable: 1,
                                viewAsFilter: function (player) {
                                    return player.countCards('hes', { color: 'red' }) > 0;
                                },
                                viewAs: {
                                    name: "dongzhuxianji",
                                },
                                filterCard: {
                                    color: "red",
                                },
                                check: function (card) {
                                    return 8 - get.value(card);
                                },
                                prompt: "你可以将一张红牌当作洞烛先机使用（洞烛先机：观星2，然后摸两张牌）",
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
                                audio: "ext:舰R牌将:true",
                                trigger: {
                                    target: "useCardToTarget",
                                },
                                filter: function (event, player) {
                                    return event.player != player && event.targets.length == 1;
                                },
                                check: function (event, player) {
                                    return get.effect(player, event.card, event.player, player) < 0;
                                },
                                content: function () {
                                    'step 0'
                                    player.chooseTarget(get.prompt2('qingyeqingyeqing'), function (card, player, target) {
                                        var evt = _status.event.getTrigger();
                                        return target != player && !evt.targets.includes(target) && lib.filter.targetEnabled(evt.card, evt.player, target);
                                    }).set('ai', function (target) {
                                        var trigger = _status.event.getTrigger();
                                        var player = _status.event.player;
                                        return get.effect(target, trigger.card, trigger.player, player) + 0.1;
                                    }).set('targets', trigger.targets).set('playerx', trigger.player);
                                    'step 1'
                                    if (result.bool) {
                                        var target = result.targets[0];
                                        player.logSkill('qingyeqingyeqing', target);
                                        event.target = target;
                                        target.chooseToDiscard("he", '弃置一张非基本牌令此牌对' + get.translation(player) +
                                            '无效，或袖手旁观', function (card) {
                                                return get.type(card) != 'basic';
                                            }).set('ai', function (card) {
                                                return get.attitude(target, player) >= 0 ? 1 : -1;
                                            });
                                        game.delay();
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

                                group: ["wufenzhong1", "wufenzhong2", "wufenzhong4"],
                                "_priority": 0,
                            },
                            wufenzhong1: {
                                audio: "ext:舰R牌将:true",
                                trigger: {
                                    player: "phaseJudgeBefore",
                                },
                                direct: true,
                                content: function () {
                                    "step 0"
                                    var check = player.countCards('h') > 2;
                                    player.chooseTarget(get.prompt("mingyundewufenzhong"), "跳过判定阶段和摸牌阶段，视为对一名其他角色使用一张【杀】", function (card, player, target) {
                                        if (player == target) return false;
                                        return player.canUse({ name: 'sha' }, target, false);
                                    }).set('check', check).set('ai', function (target) {
                                        if (!_status.event.check) return 0;
                                        return get.effect(target, { name: 'sha' }, _status.event.player);
                                    }).setHiddenSkill('wufenzhong1');
                                    "step 1"
                                    if (result.bool) {
                                        player.logSkill('wufenzhong1', result.targets);
                                        player.storage.AttTarget = result.targets[0]
                                        var list = ["thunder", "fire"];
                                        game.log(JSON.stringify(list));
                                        player.chooseControl(list).set('prompt', get.prompt('mingyundewufenzhong')).set('prompt2', '视为使用一张属性杀');
                                        "step 2"
                                        player.popup(get.translation(result.control) + '杀', result.control);
                                        game.log(result.control);
                                        player.useCard({ name: 'sha', nature: result.control, isCard: true }, player.storage.AttTarget, false);
                                        trigger.cancel();
                                        player.skip('phaseDraw');
                                    }
                                },
                                "_priority": 0,
                            },
                            wufenzhong2: {
                                audio: "ext:舰R牌将:true",
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
                                        prompt2: "弃置一张装备牌并跳过出牌阶段，视为对一名其他角色使用一张【杀】",
                                        filterCard: function (card, player) {
                                            return get.type(card) == 'equip' && lib.filter.cardDiscardable(card, player)
                                        },
                                        position: 'he',
                                        filterTarget: function (card, player, target) {
                                            if (player == target) return false;
                                            return player.canUse({ name: 'sha' }, target, false);
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
                                        player.storage.AttTarget = result.targets[0]
                                        var list = ["thunder", "fire"];
                                        game.log(JSON.stringify(list));
                                        player.chooseControl(list).set('prompt', get.prompt('mingyundewufenzhong')).set('prompt2', '视为使用一张属性杀');
                                        "step 2"
                                        player.popup(get.translation(result.control) + '杀', result.control);
                                        game.log(result.control);
                                        player.useCard({ name: 'sha', nature: result.control, isCard: true }, player.storage.AttTarget, false);
                                        trigger.cancel();
                                    }
                                },
                                "_priority": 0,
                            },
                            wufenzhong4: {
                                audio: "ext:舰R牌将:true",
                                trigger: {
                                    player: "phaseDiscardBefore",
                                },
                                direct: true,
                                content: function () {
                                    "step 0"
                                    var check = player.needsToDiscard() || player.isTurnedOver() || (player.hasSkill('shebian') && player.canMoveCard(true, true));
                                    player.chooseTarget(get.prompt('mingyundewufenzhong'), "跳过弃牌阶段并将武将牌翻面，视为对一名其他角色使用一张【杀】", function (card, player, target) {
                                        if (player == target) return false;
                                        return player.canUse({ name: 'sha' }, target, false);
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
                                        game.log(JSON.stringify(list));
                                        player.chooseControl(list).set('prompt', get.prompt('mingyundewufenzhong')).set('prompt2', '视为使用一张属性杀');
                                        "step 2"
                                        player.popup(get.translation(result.control) + '杀', result.control);
                                        game.log(result.control);
                                        player.useCard({ name: 'sha', nature: result.control, isCard: true }, player.storage.AttTarget, false);

                                        trigger.cancel();
                                    }
                                },
                                "_priority": 0,
                            },
                            qijianshashou: {
                                audio: "ext:舰R牌将:true",
                                trigger: {
                                    player: "phaseUseBegin",
                                },
                                direct: true,
                                content: function () {
                                    'step 0'
                                    player.chooseTarget(get.prompt2('qijianshashou'), function (card, player, target) {
                                        return player.canCompare(target);
                                    }).set('ai', function (target) {
                                        return -get.attitude(player, target);
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
                                    game.log("拼点结果" + result.bool);
                                    if (result.bool) {
                                        player.markAuto('qijianshashou_1', [target]);
                                        player.addTempSkill("qijianshashou_1");
                                        game.log("拼点赢");
                                    } else {
                                        trigger.cancel();
                                        player.skip('phaseDiscard');
                                        game.log("拼点没赢");
                                    }
                                },
                                ai: {
                                    expose: 0.2,
                                },
                            },
                            qijianshashou_1: {
                                mark: "character",
                                onremove: true,
                                intro: {
                                    content: "到$的距离视为1",
                                },
                                mod: {
                                    globalFrom: function (from, to) {
                                        if (from.getStorage('qijianshashou_1').contains(to)) {
                                            return -Infinity;
                                        }
                                    },
                                },
                                trigger: {
                                    source: "damageBegin",
                                },
                                charlotte: true,
                                forced: true,
                                filter: function (event, player) {

                                    return event.card && (event.card.name == "sha" || event.card.name == "sheji9") && player.getStorage('qijianshashou_1') && event.player != player;
                                },
                                content: function () {
                                    game.log("目标" + trigger.player.name);
                                    game.log("目标包含" + player.getStorage('qijianshashou_1').contains(trigger.player));
                                    if (player.getStorage('qijianshashou_1').contains(trigger.player)) {
                                        trigger.num++;
                                        game.log("伤害+1");
                                    }
                                },
                                "_priority": 0,
                            },
                            zhanxianfangyu: {
                                audio: "ext:舰R牌将:true",
                                usable: 1,
                                trigger: {
                                    global: "useCardToTarget",
                                },
                                //direct:true,//自动发动
                                priority: 5,
                                check: function (event, player) {

                                    return get.attitude(player, event.target) > 1;
                                },
                                filter: function (event, player) {
                                    if (player.countCards == 0) return false;
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

                                    player.chooseToDiscard(1);
                                    'step 1'
                                    if (result.bool) {
                                        game.log('zhanxianfangyu', trigger.target);
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
                                usable: 1,
                                trigger: {
                                    target: "shaBefore",
                                },
                                popup: false,
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
                            },
                            Zqujingying: {
                                trigger: {
                                    player: "phaseZhunbeiBegin",
                                },
                                direct: true,
                                forceaudio: true,
                                filter: function (event, player) {
                                    return true;
                                },
                                content: function () {
                                    'step 0'
                                    event.num = game.countGroup();
                                    'step 1'
                                    var list = [];
                                    if (event.num >= 1 && !player.hasSkill('leiji')) list.push('leiji');
                                    if (event.num >= 2 && !player.hasSkill('reyiji')) list.push('reyiji');
                                    if (event.num >= 3 && !player.hasSkill('reshengxi')) list.push('reshengxi');
                                    if (event.num >= 4 && !player.hasSkill('tiandu')) list.push('tiandu');
                                    if (!list.length) {
                                        event.finish();
                                        return;
                                    }
                                    var prompt2 = '你可以获得下列一项技能直到下回合开始';
                                    /*if (event.done) {
                                        prompt2 += ' (2/2)';
                                    }
                                    else {
                                        prompt2 += ' (1/2)';
                                    }*/
                                    list.push('cancel2');
                                    player.chooseControl(list).set('prompt', get.translation('Zqujingying')).
                                        set('prompt2', prompt2).set('centerprompt2', true).set('ai', function (evt, player) {
                                            var controls = _status.event.controls;
                                            if (controls.contains('leiji')) {
                                                return 'leiji';
                                            }
                                            if (controls.contains('reyiji')) {
                                                return 'reyiji';
                                            }
                                            if (controls.contains('reshengxi')) {
                                                return 'reshengxi';
                                            }
                                            if (controls.contains('tiandu')) {
                                                return 'tiandu';
                                            }
                                            return controls.randomGet();
                                        });
                                    'step 2'
                                    if (result.control != 'cancel2') {
                                        player.addTempSkill(result.control, { player: 'phaseBegin' });
                                        //if (!event.done) player.logSkill('jiahe_put');
                                        game.log(player, '获得了技能', '【' + get.translation(skill) + '】');
                                        /*if (!event.done) {
                                            event.done = true;
                                            event.goto(1);
                                        }*/
                                    }
                                },
                                "_priority": 0,

                            },
                            wuziliangjiangdao: {//军争可用的五子良将纛

                                trigger: {
                                    player: ["phaseZhunbeiBegin"],
                                },
                                filter: function (event, player, name) {
                                    if (name != 'phaseZhunbeiBegin') return get.is.jun(player) && player.identity == 'wei';
                                    return true;
                                },
                                direct: true,
                                content: function () {
                                    'step 0'
                                    var skills = ['new_retuxi', 'qiaobian', 'gzxiaoguo', 'gzjieyue', 'new_duanliang'];
                                    game.countPlayer(function (current) {
                                        if (current == player) return;
                                        if (current.hasSkill('new_retuxi')) skills.remove('new_retuxi');
                                        if (current.hasSkill('qiaobian')) skills.remove('qiaobian');
                                        if (current.hasSkill('gzxiaoguo')) skills.remove('gzxiaoguo');
                                        if (current.hasSkill('gzjieyue')) skills.remove('gzjieyue');
                                        if (current.hasSkill('new_duanliang')) skills.remove('new_duanliang');
                                    });
                                    if (!skills.length) event.finish();
                                    else {
                                        event.skills = skills;
                                        var next = player.chooseToDiscard('he');
                                        var str = '';
                                        for (var i = 0; i < skills.length; i++) {
                                            str += '、【';
                                            str += get.translation(skills[i]);
                                            str += '】';
                                        }
                                        next.set('prompt', '是否发动【五子良将纛】？')
                                        next.set('prompt2', get.translation('弃置一张牌，获得以下技能中的一个直到下回合开始：' + str.slice(1)));
                                        next.logSkill = 'g_jianan';
                                        next.skills = skills;
                                        next.ai = function (card) {
                                            var skills = _status.event.skills;
                                            var player = _status.event.player;
                                            var rank = 0;
                                            if (skills.contains('new_retuxi') && game.countPlayer(function (current) {
                                                return get.attitude(player, current) < 0 && current.countGainableCards(player, 'h')
                                            }) > 1) rank = 4;
                                            if (skills.contains('gzjieyue') && player.countCards('h', function (card) {
                                                return get.value(card) < 7;
                                            }) > 1) rank = 5;
                                            if (skills.contains('qiaobian') && player.countCards('h') > 4) rank = 6;
                                            if ((get.guozhanRank(player.name1, player) < rank && !player.isUnseen(0)) || (get.guozhanRank(player.name2, player) < rank && !player.isUnseen(1))) return rank + 1 - get.value(card);
                                            return -1;
                                        };
                                    }

                                    'step 1'
                                    player.chooseControl(event.skills).set('ai', function () {
                                        var skills = event.skills;
                                        if (skills.contains('qiaobian') && player.countCards('h') > 3) return 'qiaobian';
                                        if (skills.contains('gzjieyue') && player.countCards('h', function (card) {
                                            return get.value(card) < 7;
                                        })) return 'gzjieyue';
                                        if (skills.contains('new_retuxi')) return 'new_retuxi';
                                        return skills.randomGet();
                                    }).set("prompt", "选择获得其中的一个技能直到下回合开始");
                                    'step 2'
                                    var link = result.control;
                                    player.addTempSkill(link, { player: 'phaseBegin' });
                                    //player.addTempSkill("jianan_eff","jiananUpdate");
                                    game.log(player, "获得了技能", "#g【" + get.translation(result.control) + "】");
                                },
                                "_priority": 0,

                            },
                            huhangyuanhu: {
                                trigger: {
                                    global: "useCardToTargeted",
                                },
                                filter: function (event, player) {
                                    return (event.card.name == 'sha' || event.card.name == 'sheji9') && get.distance(player, event.target) <= 1 && event.target.isIn() && player != event.target;
                                },
                                check: function (event, player) {
                                    return get.attitude(player, event.target) >= 0;
                                },
                                logTarget: "target",
                                content: function () {
                                    "step 0"
                                    player.draw();
                                    if (trigger.target != player) {
                                        player.chooseCard(true, 'he', '交给' + get.translation(trigger.target) + '一张牌').set('ai', function (card) {
                                            if (get.position(card) == 'e') return -1;
                                            if (card.name == 'shan' || card.name == 'huibi9') return 1;
                                            if (get.type(card) == 'equip') return 0.5;
                                            return 0;
                                        });
                                    }
                                    else {
                                        event.finish();
                                    }
                                    "step 1"
                                    player.give(result.cards, trigger.target, 'give');
                                    game.delay();
                                    event.card = result.cards[0];
                                    "step 2"
                                    if (trigger.target.getCards('h').contains(card) && get.type(card) == 'equip') {
                                        trigger.target.chooseUseTarget(card);
                                    }
                                },
                                ai: {
                                    threaten: 1.1,
                                },
                                "_priority": 0,
                            },
                            shizhibuyu: {
                                audio: "ext:舰R牌将:true",
                                trigger: {
                                    player: "damageBegin3",
                                },
                                filter: function (event, player) {
                                    return event.num > 0;
                                },
                                direct: true,
                                preHidden: true,
                                content: function () {
                                    'step 0'
                                    var check = (player.countCards('h', { color: 'red' }) > 1 || player.countCards('h', { color: 'black' }) > 1);
                                    player.chooseCard(get.prompt('shizhibuyu'), '弃置两张颜色相同的牌，令即将受到的伤害-1', 'he', 2, function (card) {
                                        if (ui.selected.cards.length) return get.color(card) == get.color(ui.selected.cards[0]);
                                        return true;
                                    }).set('complexCard', true).set('ai', function (card) {
                                        if (!_status.event.check) return 0;
                                        var player = _status.event.player;
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
                                        player.logSkill('shizhibuyu');
                                        player.discard(result.cards);
                                        trigger.num--;
                                    }
                                    if (!player.isUnseen() && !game.hasPlayer(function (current) {
                                        return current != player && current.isFriendOf(player);
                                    })) {
                                        if (!logged) player.logSkill('shizhibuyu');
                                        player.judge(function (card) {
                                            if (get.color(card) == 'red') return 1;
                                            return 0;
                                        });
                                    }
                                    else event.finish();
                                    'step 2'
                                    if (result.judge > 0) player.draw();
                                },
                                "_priority": 0,
                            },
                            shizhibuyu1: {
                                audio: "ext:舰R牌将:true",
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
                                preHidden: true,
                                content: function () {
                                    'step 0'
                                    //player.gain(trigger.result.card, 'gain2');
                                    player.chooseTarget(get.prompt2('选择一名角色本回合的手牌上限和使用【杀】的次数上限+1')).ai = function (target) {
                                        return get.attitude(player, target) > 0;
                                    }
                                    'step 1'
                                    if (result.bool) {
                                        game.log(result.targets[0] + "矢志不渝");
                                        if (!result.targets[0].hasSkill('shizhibuyu1_eff')) {
                                            result.targets[0].addTempSkill('shizhibuyu1_eff', { player: 'phaseEnd' });
                                            result.targets[0].storage.shizhibuyu1_eff = 1;
                                        }
                                        else result.targets[0].storage.shizhibuyu1_eff++;
                                        result.targets[0].updateMarks();
                                        //target.addTempSkill('mingjian2',{player:'phaseAfter'});
                                        //target.storage.mingjian2++;
                                        //target.updateMarks('mingjian2');
                                    }
                                },
                                subSkill: {
                                    eff: {
                                        sub: true,
                                        mod: {
                                            cardUsable: function (card, player, num) {
                                                if (card.name == 'sha' || card.name == 'sha') return num + player.storage.shizhibuyu1_eff;
                                            },
                                            maxHandcard: function (player, num) { return num + player.storage.shizhibuyu1_eff },
                                        },
                                        mark: true,
                                        charlotte: true,
                                        intro: {
                                            content: function (storage) { if (storage) return '使用【杀】的次数上限+' + storage + '，手牌上限+' + storage },
                                        },
                                        "_priority": 0,
                                    },
                                },
                                "_priority": 0,
                            },
                            qianxingtuxi: {
                                audio: "ext:舰R牌将:true",
                                mod: {
                                    attackFrom: function (from, to, distance) {
                                        return 1
                                    },
                                },
                                trigger: {
                                    source: "damageSource",
                                },
                                forced: true,
                                filter: function (event, player) {
                                    return _status.currentPhase != player;
                                },
                                content: function () {
                                    "step 0"
                                    player.addTempSkill("huibi", "roundstart");
                                    trigger.player.addTempSkill("qianxingtuxi_debuff", 'phaseEnd');
                                },
                                "_priority": 0,
                            },
                            qianxingtuxi_debuff: {
                                usable: 1,
                                trigger: {
                                    source: "damageBegin1",
                                },
                                force: true,
                                content: function () {
                                    "step 0"
                                    player.judge(function (card) {
                                        if (get.suit(card) == 'spade') {
                                            trigger.num--;
                                        }
                                    });
                                },
                            },
                            "31jiezhongdui": {
                                audio: "ext:舰R牌将:true",
                                usable: 1,
                                direct: true,
                                trigger: {
                                    global: "useCardToPlayered",
                                },
                                filter: function (event, player) {
                                    return (event.card.name == 'sha' || event.card.name == 'sheji9') && !player.countMark('31jiezhongdui') && _status.currentPhase.hp < event.target.hp;
                                },
                                content: function () {
                                    'step 0'
                                    var str = get.translation(trigger.target), card = get.translation(trigger.card);
                                    player.chooseControl('cancel2').set('choiceList', [
                                        '令' + card + '对' + str + '的伤害+1',
                                        '令' + str + '不能响应' + card,
                                        '令当前回合角色摸两张牌，然后"31节中队"暂时失效',
                                    ]).set('prompt', get.prompt('31jiezhongdui', trigger.target)).setHiddenSkill('31jiezhongdui').set('ai', function () {
                                        var player = _status.event.player, target = _status.event.getTrigger().target;
                                        if (get.attitude(player, trigger.target) > 0) {
                                            game.log("return'cancel2'");
                                            return 'cancel2';
                                        }
                                        if (trigger.target.Hp + trigger.target.hujia <= 2 && _status.currentPhase.countCards("h") > 1) {
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
                                            _status.currentPhase.draw(2);
                                            player.addMark('31jiezhongdui', 1);
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
                                audio: "ext:舰R牌将:true",
                                enable: "phaseUse",
                                prompt: "失去一点体力并视为使用一张基本牌或非延时类锦囊牌（每回合每种牌名限一次）。",

                                content: function () {
                                    "step 0"

                                    //
                                    var list = [];
                                    for (var i = 0; i < lib.inpile.length; i++) {
                                        var name = lib.inpile[i];
                                        var type = get.type(name);
                                        if (type == 'trick' || type == 'basic') {
                                            if (lib.filter.cardEnabled({ name: name }, player) && !player.storage.jujianmengxiang.contains(name)) {
                                                list.push([get.translation(type), '', name]);
                                            }
                                        }
                                    }
                                    var dialog = ui.create.dialog('巨舰梦想', [list, 'vcard']);

                                    game.log("巨舰梦想列表已生成")
                                    if (!list == "" && (lib.inpile.includes("juedouba9") && lib.inpile.includes("manchangyy9") && lib.inpile.includes("jingjixiuli9") && lib.inpile.includes("ewaibuji9"))) {
                                        player.chooseButton(dialog).ai = function (button) {
                                            var player = _status.event.player;
                                            var recover = 0, lose = 1, players = game.filterPlayer();
                                            for (var i = 0; i < players.length; i++) {
                                                if (!player.storage.jujianmengxiang.contains('juedouba9') && players[i].hp == 1 && get.damageEffect(players[i], player, player) > 0 && !players[i].hasSha()) {
                                                    game.log('juedouba9' + (button.link[2] == 'juedouba9'));
                                                    return (button.link[2] == 'juedouba9') ? 2 : -1;
                                                }
                                                if (!players[i].isOut()) {
                                                    if (players[i].hp < players[i].maxHp) {
                                                        if (get.attitude(player, players[i]) > 0) {
                                                            if (players[i].hp < 2) {
                                                                lose--;
                                                                recover += 0.5;
                                                            }
                                                            lose--;
                                                            recover++;
                                                        }
                                                        else if (get.attitude(player, players[i]) < 0) {
                                                            if (players[i].hp < 2) {
                                                                lose++;
                                                                recover -= 0.5;
                                                            }
                                                            lose++;
                                                            recover--;
                                                        }
                                                    }
                                                    else {
                                                        if (get.attitude(player, players[i]) > 0) {
                                                            lose--;
                                                        }
                                                        else if (get.attitude(player, players[i]) < 0) {
                                                            lose++;
                                                        }
                                                    }
                                                }
                                            }
                                            if (!player.storage.jujianmengxiang.contains('manchangyy9') && lose > recover && lose > 0) {
                                                game.log('manchangyy9' + (button.link[2] == 'manchangyy9'));
                                                return (button.link[2] == 'manchangyy9') ? 1 : -1;
                                            }
                                            else if (!player.storage.jujianmengxiang.contains('jingjixiuli9') && lose < recover && recover > 0) {
                                                game.log('jingjixiuli9' + (button.link[2] == 'jingjixiuli9'));
                                                return (button.link[2] == 'jingjixiuli9') ? 1 : -1;
                                            }
                                            else {
                                                game.log('ewaibuji9' + (button.link[2] == 'ewaibuji9'));
                                                return (button.link[2] == 'ewaibuji9') ? 1 : -1;
                                            }

                                        }
                                    } else {
                                        game.log("AI没有可用的牌了！</br>也许您没有正确安装并启用‘舰r美化’卡牌包？");
                                        player.storage.jujianmengxiang.add("error");
                                        event.finish();
                                    }
                                    'step 1'
                                    game.log("结果bool" + result.bool);

                                    if (!result.bool) {
                                        game.log("没有选择牌！</br>如果AI没有选择牌，也许您没有正确安装并启用‘舰r美化’卡牌包？");
                                        player.storage.jujianmengxiang.add("error");
                                        event.finish();
                                    }

                                    if (result && result.bool && result.links[0][2]) {
                                        game.log("选择的牌" + result.links[0][2]);
                                        player.chooseUseTarget(true, result.links[0][2]);
                                        player.storage.jujianmengxiang.add(result.links[0][2]);
                                        player.loseHp(1);
                                    }


                                    //
                                },
                                ai: {
                                    basic: {
                                        order: 4,
                                    },
                                    result: {
                                        player: function (player) {
                                            if (player.storage.jujianmengxiang.contains('error')) return -1;
                                            if (player.countCards('h') >= player.hp - 1) return -1;
                                            if (player.hp < 3) return -1;
                                            if (player.storage.jujianmengxiang.contains('ewaibuji9')) return -1;
                                            return 1;
                                        },
                                    },
                                },
                                "_priority": 0,

                            },
                            jujianmengxiang_reflash: {
                                trigger: {
                                    player: ["phaseZhunbeiBegin"],
                                },
                                force: true,
                                frequent: true,
                                content: function () {

                                    if (player.storage.jujianmengxiang) {
                                        delete player.storage.jujianmengxiang;
                                    }
                                    player.storage.jujianmengxiang = [];
                                    game.log("巨舰梦想");

                                },
                            },
                            sidajingang: {
                                group: ["sidajingang_mopai", "sidajingang_pindian"],
                                subSkill: {
                                    mopai: {
                                        audio: "ext:舰R牌将:true",
                                        trigger: {
                                            player: "logSkill",
                                        },
                                        filter: function (event, player) {
                                            return event.skill == '_yuanhang_mopai';
                                        },
                                        //forced: true,
                                        content: function () {
                                            game.log("_yuanhang")
                                            player.draw(1);
                                        },

                                        "_priority": 0,
                                    },
                                    pindian: {
                                        audio: "ext:舰R牌将:true",
                                        shaRelated: true,
                                        trigger: {
                                            source: "damageSource",
                                        },
                                        filter: function (event, player) {
                                            if (event._notrigger.contains(event.player)) return false;
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
                                audio: "ext:舰R牌将:true",
                                count: function () {
                                    var num = 0;
                                    game.countPlayer2(function (current) {
                                        current.getHistory('lose', function (evt) {
                                            if (evt.position == ui.discardPile) {
                                                for (var i = 0; i < evt.cards.length; i++) {
                                                    if (get.color(evt.cards[i]) == 'red') num++;
                                                }
                                            }
                                        })
                                    });
                                    /*game.getGlobalHistory('cardMove', function (evt) {
                                        if (evt.name == 'cardsDiscard') {
                                            for (var i = 0; i < evt.cards.length; i++) {
                                                if (get.color(evt.cards[i]) == 'red') num++;
                                            }
                                        }
                                    })*/
                                    return num;
                                },
                                direct: true,
                                filter: function (event, player) {
                                    return lib.skill.jiujingzhanzhen.count() > 0;
                                    /*return player.hasHistory('lose', function (evt) {
                                        return evt.hs && evt.hs.length > 0;
                                    });*/
                                },
                                trigger: {
                                    player: "phaseJieshuBegin",
                                },

                                content: function () {
                                    'step 0'
                                    player.chooseTarget([1, lib.skill.jiujingzhanzhen.count()], get.prompt2('jiujingzhanzhen')).ai = function (target) {
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
                                    game.delay();
                                    if (targets.length) event.goto(2);
                                },
                                "_priority": 0,

                            },
                            wuweizhuangji: {
                                audio: "ext:舰R牌将:true",
                                unique: true,
                                enable: "phaseUse",
                                skillAnimation: true,
                                animationColor: "gray",
                                mark: true,

                                limited: true,
                                filter: function (event, player) {
                                    return player.isMinHp();
                                },
                                filterTarget: function (card, player, target) {
                                    return true;
                                },
                                content: function () {
                                    player.awakenSkill('wuweizhuangji');
                                    var num = player.maxHp;
                                    player.loseHp(player.hp);
                                    target.damage(num);

                                },
                            },
                            zhongzhuangcike: {
                                group: ["wushifangju", "liushitili"],
                                "_priority": 0,
                            },
                            wushifangju: {
                                audio: "ext:舰R牌将:true",
                                trigger: {
                                    player: "useCardToPlayered",
                                },
                                filter: function (event) {
                                    //game.log("重装刺客1判断条件：使用杀指定目标");
                                    return (event.card.name == 'sha' || event.card.name == 'sheji9');
                                },
                                forced: true,
                                direct: true,
                                logTarget: "target",
                                content: function () {
                                    game.log("重装刺客1执行代码");
                                    if (player.countCards('e')) {
                                        trigger.target.addTempSkill('qinggang2');
                                        trigger.target.storage.qinggang2.add(trigger.card);
                                        trigger.target.markSkill('qinggang2');
                                    }
                                    game.log("重装刺客1执行结束");
                                    event.finish;
                                },
                                prompt: "你装备区内有牌时，你使用的杀无视防具",
                            },

                            liushitili:{
                                audio: "ext:舰R牌将:true",
                                trigger:{
                                    source:"damageBefore",
                                },
                                forced:true,
                                audio:2,
                                check:function(){return false;},
                                content:function(){
                                    trigger.cancel();
                                    trigger.player.loseHp(trigger.num);
                                },
                                ai:{
                                    jueqing:true,
                                },
                                "_priority":0,
                            },
                            /*zhongzhuangcike_2: {
                                trigger: {
                                    source: "damageSource",
                                },
                                filter: function (event, player) {
                                    if (event._notrigger.contains(event.player)) return false;
                                    return (event.card && (event.card.name == 'sha' || event.card.name == 'sheji9') && (event.getParent().name == 'sha' || event.getParent().name == 'sheji9'));
                                },
                                content: function () {
                                    game.log("重装刺客2执行代码");
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
                                audio: "ext:舰R牌将:true",
                                enable: "phaseUse",
                                usable: 1,
                                init: function (player) {
                                    player.storage.duomianshou = [];

                                },
                                filterCard(card, player) {
                                    var player = _status.event.player;
                                    //var event = _status.event;
                                    game.log("选择卡牌过滤器" + JSON.stringify(player.storage.duomianshou));
                                    var numbers = [];

                                    if (player.storage.duomianshou.length) {
                                        game.log("进入了if");
                                        for (var i = 0; i < player.storage.duomianshou.length; i++) {
                                            numbers.add(get.number(player.storage.duomianshou[i]));
                                        }
                                    }

                                    if (!numbers.includes(get.number(card))) {
                                        return true;
                                    }

                                    return false;
                                    // return true;
                                },

                                position: "hs",
                                discard: false,
                                lose: false,
                                check: function (card) {
                                    /*var event = _status.event;
                                    var numbers=[];
            for(var i=0;i<player.storage.duomianshou.length;i++){
                numbers.add(get.number(event.player.storage.duomianshou[i],'trick'));
            }
           
                if(!numbers.includes(get.number(cards,'trick'))){
                    return 7.5 - get.value(card);
        
            }
            return false;*/
                                    return 7.5 - get.value(card);
                                },

                                content: function () {
                                    'step 0'
                                    game.log("记录的卡牌" + JSON.stringify(player.storage.duomianshou));
                                    var card = cards[0];
                                    //var cardtype=get.type(card);
                                    game.log("卡牌价值" + get.value(card));
                                    game.log("卡牌类型" + get.type(card));
                                    var list = [];
                                    //game.log(JSON.stringify(lib.cardPile));
                                    for (var i of ui.cardPile.childNodes) {

                                        var name = get.name(i);
                                        var type = get.type(i);
                                        if (type == 'trick' || type == 'basic') {
                                            if (lib.filter.cardEnabled({ name: name }, player) && type != get.type(card) && get.number(card) == get.number(i)) {
                                                game.log(type);
                                                game.log(i);
                                                list.push(i);
                                                //list.push(game.createCard2(get.name(i), get.suit(card), get.number(i), get.nature(i)));
                                            }
                                        }
                                    }
                                    if (list == "") {
                                        game.log('牌堆中没有符合要求的牌');
                                        delete player.getStat('skill').duomianshou;
                                        player.storage.duomianshou.push(card);
                                        event.finish();
                                    }
                                    var dialog = ui.create.dialog('多面手', [list, 'card']);
                                    game.log("多面手列表已生成");


                                    player.chooseButton(dialog).ai = function (button) {
                                        var MostValue = 0;
                                        var MostValuableCard = card;

                                        for (var j of list) {
                                            game.log("目标卡牌价值" + get.value(j));
                                            game.log("最大卡牌价值" + MostValue);

                                            if (get.value(j) > MostValue) {
                                                MostValuableCard = j;
                                                MostValue = get.value(j);
                                                game.log("最有价值的卡牌变更为" + get.name(MostValuableCard));
                                            }

                                        }
                                        //game.log("button.link[0]"+JSON.stringify(button.link));
                                        //game.log("MostValuableCard"+JSON.stringify(MostValuableCard));
                                        return (button.link == MostValuableCard) ? 1 : -1;
                                    }
                                    'step 1'
                                    game.log("结果bool" + result.bool);

                                    if (result.bool) {
                                        event.finish();
                                    }

                                    if (result && result.bool && result.links[0]) {
                                        game.log("选中的结果" + JSON.stringify(get.name(result.links[0])));
                                        player.discard(cards[0]);
                                        player.addTempSkill("duomianshou_1", "useCardToTargeted");
                                        player.chooseUseTarget(true, get.name(result.links[0]));
                                        //player.removeSkill("duomianshou_1");
                                        player.storage.duomianshou = [];
                                    }
                                },
                                ai: {
                                    order: 10,
                                    result: {
                                        player: 1,
                                    },
                                },
                                "_priority": 0,

                            },
                            duomianshou_1: {
                                usable: 1,
                                trigger: {
                                    player: "useCardToPlayered",
                                },
                                direct: true,
                                frequent: true,
                                logTarget: "target",
                                check: function (event, player) {
                                    if (get.attitude(player, event.target) > 0) return true;
                                    var target = event.target;
                                    return target.countCards('h') == 0 || !target.hasSkillTag('noh');
                                },
                                filter: function (event, player) {
                                    if (event.target.hasSkill('quzhudd') || event.target.hasSkill('qingxuncl') || event.target.hasSkill('qianting') || event.target.hasSkill('zhongxunca'))
                                        return event.target != player;
                                },
                                content: function () {
                                    "step 0"
                                    game.log(trigger.target.name + "多面手触发");
                                    if (!trigger.target.countCards('h')) event._result = { bool: false };
                                    else trigger.target.chooseToDiscard('弃置一张手牌，或令' + get.translation(player) + '摸一张牌').set('ai', function (card) {
                                        var trigger = _status.event.getTrigger();
                                        return -get.attitude(trigger.target, trigger.player) - get.value(card) - Math.max(0, 4 - trigger.target.hp) * 2;
                                    });
                                    "step 1"
                                    if (result.bool == false) player.draw();
                                },
                                ai: {
                                    threaten: 8,
                                },
                                "_priority": 0,
                            },
                            kaixuanzhige: {
                                audio: "ext:舰R牌将:true",
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
                                    player.judge(function () { return 0 });

                                    //game.log("trigger.target1"+JSON.stringify(trigger.target[0]));
                                    "step 1"
                                    game.log("此杀伤害基数" + trigger.getParent().baseDamage);
                                    game.log(get.type(result));
                                    game.log(trigger.target);
                                    if (get.type(result) == "trick") {
                                        //game.log("进入if");
                                        trigger.getParent().baseDamage++;
                                        //game.log("trigger.target2"+JSON.stringify(trigger.target[0]));
                                        trigger.target.addTempSkill('qinggang2');
                                        trigger.target.storage.qinggang2.add(trigger.card);
                                        trigger.target.markSkill('qinggang2');

                                    }
                                    if (player.hp < 3 && !trigger.target.hasSkill('qinggang2')) {
                                        trigger.target.addTempSkill('qinggang2');
                                        trigger.target.storage.qinggang2.add(trigger.card);
                                        trigger.target.markSkill('qinggang2');
                                    }
                                },
                                ai: {
                                    expose: 0.2,
                                    threaten: 1.3,
                                },
                                "_priority": 0,
                            },
                            yishisheji: {
                                audio: "ext:舰R牌将:true",
                                mod: {

                                    targetInRange(card, player, target) {
                                        game.log(player.getHistory('useCard', evt => get.name(evt.card) == 'sha' || "sheji9"));
                                        if ((get.name(card) == 'sha' || get.name(card) == "sheji9") && !player.getHistory('useCard', evt => get.name(evt.card) == 'sha' || "sheji9").length) return true;
                                    },
                                },
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
                                    player.judge(function () { return 0 });
                                    "step 1"
                                    game.log("此杀伤害基数" + trigger.getParent().baseDamage);
                                    game.log(get.suit(result));
                                    game.log(trigger.target);
                                    if (get.suit(result) != "heart") {
                                        trigger.getParent().baseDamage++;

                                    } else if (get.suit(result) == "heart") {
                                        game.log("else");
                                        trigger.targets.length = 0;
                                        trigger.getParent().triggeredTargets1.length = 0;//取消所有目标，来自秦宓谏征
                                    }

                                },
                                ai: {
                                    expose: 0.2,
                                    threaten: 1.3,
                                },
                                "_priority": 0,
                            },
                            yishisheji_1: {
                                group: ["yishisheji_1_mianyi"],
                                subSkill: {
                                    mianyi: {
                                        trigger:
                                        {
                                            player: "damageBefore",
                                            //source: "damageSource",
                                            filter: function (event, player) { return true },
                                        },
                                        forced: true,
                                        content: function () {

                                            if (!player.hasSkill('yishisheji_1_disable') && trigger.card) {
                                                trigger.cancel();
                                                game.log(player, "免疫了一次伤害。");
                                                player.addTempSkill('yishisheji_1_disable', 'roundStart');
                                            }
                                        },
                                        mark: false,
                                        sub: true,
                                    },
                                    disable: {
                                        mark: true,
                                        intro: {
                                            content: "本轮已发动",
                                        },
                                        sub: true,
                                    },
                                },
                            },
                            jueshengzhibing: {
                                audio: "ext:舰R牌将:true",
                                derivation: "zhiyu",
                                trigger: {
                                    player: "phaseJieshuBegin",
                                },
                                forced: true,
                                filter: function (event, player) {
                                    return player.countMark('jueshengzhibing_count') < 2;
                                },
                                content: function () {
                                    player.addTempSkill('zhiyu', { player: 'phaseBegin' });
                                },
                                group: ["jueshengzhibing_discard", "jueshengzhibing_draw"],
                                preHidden: ["jueshengzhibing_discard", "jueshengzhibing_draw"],
                                subSkill: {
                                    discard: {
                                        audio: "ext:舰R牌将:true",
                                        logTarget: "target",
                                        trigger: {
                                            player: "useCardToPlayered",
                                        },
                                        filter: function (event, player) {
                                            game.log(event.target.hujia);
                                            return player == _status.currentPhase && player.countMark('jueshengzhibing_count') < 2 && event.target.hujia > 0 &&
                                                (event.card.name == 'sha' || event.card.name == 'sheji9');
                                        },
                                        check: function (event, player) {
                                            return get.attitude(player, event.target) <= 0;
                                        },
                                        content: function () {
                                            player.discardPlayerCard('he', trigger.target, 1, true);
                                            player.addTempSkill('jueshengzhibing_count');
                                            player.addMark('jueshengzhibing_count', 1, false);

                                            if (player.countMark('jueshengzhibing_count') >= 2) {
                                                var evt = _status.event.getParent('phaseUse');
                                                if (evt && evt.name == 'phaseUse') {
                                                    evt.skipped = true;
                                                    event.finish();
                                                }
                                            }
                                        },
                                        sub: true,
                                        "_priority": 0,
                                    },
                                    draw: {
                                        audio: "ext:舰R牌将:true",
                                        trigger: {
                                            player: "useCard",
                                        },
                                        filter: function (event, player) {
                                            return player == _status.currentPhase && player.countMark('jueshengzhibing_count') < 2 && event.card.isCard && get.type2(event.card) == 'trick';
                                        },
                                        content: function () {
                                            player.draw();
                                            player.addTempSkill('jueshengzhibing_count');
                                            player.addMark('jueshengzhibing_count', 1, false);

                                            if (player.countMark('jueshengzhibing_count') >= 2) {
                                                var evt = _status.event.getParent('phaseUse');
                                                if (evt && evt.name == 'phaseUse') {
                                                    evt.skipped = true;
                                                    event.finish();
                                                }
                                            }
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
                            zhanfu: {
                                mod: {
                                    targetInRange(card, player, target) {
                                        if ((card.name == 'sha' || card.name == 'sheji9') && player.isMaxHandcard()) return true;
                                    },

                                },

                            },
                            xinqidian: {

                                enable: "phaseUse",
                                usable: 1,

                                filterTarget: function (card, player, target) {
                                    return player != target && target.countCards("h");
                                },
                                selectTarget: function () {
                                    return [1, 3];
                                },
                                multiline: true,
                                multitarget: true,
                                async content(event, trigger, player) {//这里由“浮海”（卫温诸葛直）修改而来，可能因为目标选择不同存在部分bug，需要注意。能跑就行暂不动他。2024.3.9

                                    const targets = event.targets.sortBySeat();
                                    //game.log(targets);
                                    targets.push(player);
                                    game.log(targets);
                                    const next = player.chooseCardOL(targets, '请展示一张手牌', true).set('ai', card => {
                                        return -get.value(card);
                                    }).set('aiCard', target => {
                                        const hs = target.getCards('h');
                                        return { bool: true, cards: [hs.randomGet()] };
                                    });
                                    //game.log(next);
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
                                        var dialog = ui.create.dialog(get.translation(player) + '发动了【新起点】', cards);
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
                                    await game.asyncDelay(4);
                                    game.broadcastAll('closeDialog', videoId);


                                    const suit = get.suit(cards[0], false);
                                    game.log("flag0" + suit);
                                    let flag = false;
                                    for (let i = 0; i < targets.length; i++) {
                                        for (let j = 0; j < i; j++) {
                                            if (get.suit(cards[j], false) != get.suit(cards[i], false)) {
                                                game.log("flag=true" + get.suit(cards[i], false));
                                                flag = true;
                                            }
                                            else {
                                                game.log("flag=false" + get.suit(cards[i], false));
                                                flag = false;
                                                i = targets.length;//触发上级停止条件，跳出循环

                                                break;
                                            }

                                        }

                                    }
                                    game.log("花色不同？" + flag);
                                    game.log(targets);
                                    for (let j = 0; j < targets.length; j++) {
                                        if (flag) {

                                            game.log(targets[j].name + "摸牌");
                                            targets[j].draw();
                                        }

                                        if (!flag) {

                                            game.log(targets[j].name + "获得技能");
                                            targets[j].addTempSkill("mashu", { player: "phaseJieshuBegin" });
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
                                    },
                                },
                            },
                            jilizhixin: {
                                trigger: {
                                    player: "phaseUseBefore",
                                },
                                filter: function (event, player) {
                                    return player.countCards('h') > 0 && !player.hasSkill('jilizhixin3');
                                },
                                direct: true,
                                preHidden: true,
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
                                        player.chooseToDiscard('是否弃置一张牌并令一名其他角色进行一个额外回合？').set('logSkill', 'jilizhixin').ai = function (card) {
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
                                ai: {
                                    viewHandcard: true,
                                    skillTagFilter(player, tag, arg) {
                                        if (player == arg) return false;
                                    },

                                },
                                "_priority": 0,
                            },
                            jilizhixin2: {
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

                                    player.chooseTarget(true, '请选择进行额外回合的目标角色', lib.filter.notMe).ai = function (target) {
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
                                usable: 1,
                                enable: "phaseUse",
                                filterTarget: true,
                                content: function () {
                                    game.log(target);
                                    if (target.hasSkill("hangmucv")) {
                                        game.log("CV");
                                        target.draw(2);
                                    }
                                    else {
                                        game.log("!=CV");
                                        target.draw(1);
                                    }
                                },
                                ai: {
                                    order: 7.2,
                                    result: {
                                        target(player, target) {
                                            if (get.attitude(player, target) >= 0) return 1;
                                            return 0;
                                        },
                                    },
                                },
                            },
                            //在这里添加新技能。

                            //这下面的大括号是整个skill数组的末尾，有且只有一个大括号。


                        },
                        translate: {
                            addskilltest: "addskilltest",
                            liekexingdun: "列克星敦",
                            qixichicheng: "奇袭赤城",
                            wufenzhongchicheng: "五分钟赤城",
                            dumuchenglinqiye: "独木成林企业",
                            bisimai: "俾斯麦&北宅", misuli: "密苏里",
                            changmen: "长门", weineituo: "维内托",
                            lisailiu: "黎塞留",
                            kunxi: "昆西", ougengqi: "欧根",
                            qingye: "青叶", beianpudun: "北安普顿",
                            jiujinshan: "旧金山",
                            tianlangxing: "天狼星", yixian: "逸仙",
                            degelasi: "德格拉斯", yatelanda: "亚特兰大",
                            dadianrendian: "大淀仁淀",
                            kangfusi: "康弗斯", "z31": "z31",
                            "47project": "47工程", xuefeng: "雪风",
                            shuileizhanduichuixue: "水雷战队吹雪",
                            guzhuyizhichuixue: "孤注一掷吹雪",
                            minsike: "明斯克",
                            baiyanjuren: "百眼巨人",
                            "u1405": "u1405",
                            changchun: "长春",
                            "1913": "1913战巡",
                            yinghuochong: "萤火虫",
                            skilltest: "skill测试武将test",
                            quzhudd: "驱逐舰", "quzhudd_info": "",
                            qingxuncl: "轻巡", "qingxuncl_info": "",
                            zhongxunca: "重巡", "zhongxunca_info": "",
                            zhanliebb: "战列", "zhanliebb_info": "",
                            daoqu: "导驱", "daoqu_info": "你的攻击范围增加2+X(x为技能强化次数)",
                            hangmucv: "航母", "hangmucv_info": "(可强化)你的出牌阶段开始时，<br>你可以弃置2张：零级强化，黑桃或梅花手牌；一级强化，黑桃或梅花或红桃手牌；二级强化，任意手牌。视为对你选择的任意个目标使用万箭齐发",
                            qianting_xiji: "袭击", "qianting_xiji_info": "每回合限两次，将♦/♥牌当做顺手牵羊，♣/♠牌当做兵粮寸断使用<br>你使用的锦囊牌可以对距离你2以内的角色使用。",
                            qianting: "潜艇", "qianting_info": "（可强化）一轮游戏开始时，你可以弃置一张红桃/红桃或黑桃/红桃或黑桃或方片牌，对一个目标使用一张雷杀。没有手牌会结束此技能。",
                            qianting_jiezi: "截辎", "qianting_jiezi_info": "其他角色跳过阶段时，你摸一张牌",
                            "_yuanhang": "远航", "_yuanhang_info": "受伤时手牌上限+1<br>当你失去手牌后，且手牌数<手牌上限值时，你摸一张牌。使用次数上限0/1/2次，处于自己的回合时+1，每回合回复一次使用次数。<br>当你进入濒死状态时，你摸一张牌，体力上限大于二时需减少一点体力上限，额外摸一张牌；死亡后，你可以按自己的身份，令一名角色摸-/2/1/1（主/忠/反/内）张牌。",
                            kaishimopao: "开始摸牌", "kaishimopao_info": "<br>，判定阶段你可以减少一次摸牌阶段的摸牌，然后在回合结束时摸一张牌。",
                            "_jianzaochuan": "建造", "_jianzaochuan_info": "限一次，当你进行了至少一次强化后<br>1.出牌阶段<br>你可以弃置3张不同花色的牌，提升一点血量上限与强化上限。<br>2.当你濒死时，<br>你可以弃置4张不同花色的牌，回复一点体力。<br>（未开启强化，则无需强化即可使用建造。未开启建造，则强化上限仅为1级。）",
                            "_qianghuazhuang": "强化装备",
                            "_qianghuazhuang_info": "你可以消耗经验，或弃置二至四张牌，选择一至两个永久效果升级。<br>（摸牌、技能、攻击范围、防御距离、手牌上限）每回合限两次。<br>一级强化消耗两点经验，二级强化消耗三点经验",//装备牌代表两张牌
                            diewulimitai: "递杀", "diewulimitai_info": "给实际距离为1的队友递一张杀或装备牌，可以立即使用（杀只能用一次），一回合限2次。可强化",
                            "_wulidebuff": "属性伤害效果",
                            "_wulidebuff_info": "火杀：令目标回合结束后，受到一点火焰伤害，摸两张牌。</br>冰杀：护甲加1伤；减少对手1点防御距离。</br>雷杀：自动判断是否流失对手体力；减少对手1点手牌上限；。</br>此角色回合结束后移除所有的进水、减速、燃烧。",
                            "_hanbing_gai": "寒冰-改",
                            "_hanbing_gai_info": "1.开启“属性伤害效果”的情况下，你对拥有护甲的目标造成雷属性伤害前，+1伤害值。<br>2.在你造成伤害前，若你拥有寒冰剑_技能/造成的伤害为冰属性，你可以防止此伤害并弃置目标2*X张牌，x为伤害值。与伤害效果技能配合时",
                            _yidong: "移动座位", "_yidong_info": "",
                            tiaozhanzhuanbei: "挑战装备",
                            "tiaozhanzhuanbei_info": "挑战锁定技，游戏开始时，你将一张【回避】【此舰种的武器】和一张【望远镜】置入你的装备区。你装备区内的武器牌和宝物牌不能被其他角色弃置。",
                            danzong: "增强杀",
                            "danzong_info": "每使用六张杀，你便可以在造成无属性伤害附加属性：<br>潜艇、驱逐：获得雷属性的效果，<br>战列、航母：获得雷属性与改进型冰杀的效果。<br>其他舰种时：获得火属性,点燃目标。<br>效果持续到伤害结算完成时（打不穿藤甲的高爆弹与暴击藤甲的决斗）",
                            "paohuozb_skill": "炮火准备1", "paohuozb_skill_info": "装备技能",
                            huibi: "回避(八卦)", "huibi_info": "（可强化）你需要打出闪时可以进行一次判定，判定结果为：零级强化，方块/一级强化，桃、闪、方块/二级强化，红桃或方块，视为你打出了一张闪。",
                            "rendeonly2": "仁德界改", "rendeonly2_info": "给实际距离为2的队友最多两张牌，一回合限2次，给出第二张牌时，你视为使用一张基本牌。可强化",
                            zhiyangai: "直言",
                            "zhiyangai_info": "令一名目标角色摸一张牌并展示之。<br>若为装备牌，则其可以选择是否装备。<br>可强化(每强化一次技能，便+1技能的目标数)",
                            "fangkong2": "防空",
                            "fangkong2_info": "当一名角色使用的锦囊牌指定了至少两名角色为目标时，<br>你可弃置两张牌令此牌对距离你为1/2/3的任意名角色无效,可强化",
                            huokongld: "火控雷达", "huokongld_info": "（可强化）当你使用的【杀】被目标角色使用的【闪】抵消时，你可以弃置：零级，一张杀/一级，一张黑色牌/二级，一张牌，令此【杀】依然对其造成伤害。",
                            "ganglie_gai": "刚烈弱化",
                            "ganglie_gai_info": "每当你受到1点伤害后，若你的体力不大于2，你可以弃置x张牌并进行判定。<br>若结果不为红桃，则伤害来源选择执行一项：1.弃置x+1张手牌，2.选择交给你一张牌;3.失去一点体力(无视护甲)。<br>若你先弃置了两张牌，则判定失败时随机获得目标的一张牌;判定成功后，目标不选择弃牌时会额外失去一张牌。可强化",
                            zhongpaoduijue: "对决",
                            "zhongpaoduijue_info": "当你无法使用杀时，你可以指定一个目标，弃置最多（2/3/4）张相同花色的牌，并与目标摸等量的牌,<br>然后你与目标轮流视为对对方使用一张决斗,<br>直到双方的决斗次数超过2n，n为你弃置的牌数。强化以-1对方摸的牌",
                            zhuangjiafh: "装甲防护",
                            "zhuangjiafh_info": "（可强化）每回合限一次，当你受到：零级强化，杀的伤害/一级强化，杀和锦囊牌的伤害/二级强化，任意伤害时,若你没有用护甲承受过此次伤害，你可以获得1点护甲。",
                            misscoversha: "回出杀数", "misscoversha_info": "杀被回避会回复当回合出杀次数",
                            xianjinld: "先进雷达",
                            "xianjinld_info": "可以选择一个增益：1.攻击，实际距离此角色为1的队友：武器攻击距离+1;但防御杀的距离-1，队友的摸牌阶段多摸一张牌。或：2.防御距离+1，但是攻击距离-1，自己的摸牌阶段少抽一张牌。",
                            kanpolimitai: "制空权",
                            "kanpolimitai_info": "每轮限一次，你可以将一张黑色手牌当无懈可击使用。可强化",
                            kaifa: "开发装备",
                            "kaifa_info": "出牌阶段，你可以展示一张未强化过的【诸葛连弩】或标准包/军争包/SP包中的防具牌，然后对其进行强化。当你处于濒死状态时，你可以重铸一张防具牌，然后将体力回复至1点。",
                            huijiahuihe: "额外回合",
                            "huijiahuihe_info": "当你有护甲时，你可以移除所有护甲并进行一个额外的回合；额外回合的摸牌数等于护甲数。此回合没有输出时，摸一张牌。",
                            junfu: "军辅船",
                            "junfu_info": "回合开始时,你可以把至多1/2/3张手牌存于武将牌上，如手牌般使用。<br>其他角色回合开始时，你可以把存储的牌交给ta，然后你摸一张牌。<br>可以强化(目标的手牌数<8才能使用此技能)<br>拥有技能强化和远航强化即可起飞。",
                            manchangzhanyi: "漫长战役", "manchangzhanyi_info": "每轮限一次，你受到锦囊牌的伤害时，你免疫此伤害。你攻击范围内的其他角色的准备阶段，你可以弃置其一张手牌。",
                            manchangzhanyi_1: "漫长战役", "manchangzhanyi_1_info": "",
                            guzhuyizhi: "孤注一掷", "guzhuyizhi_info": "出牌阶段开始时，你可以摸两张牌并弃置所有手牌，然后摸等量的牌，如此做，你的其他技能失效且你不能使用桃或快修直到你的下回合开始，你计算与其他角色的距离-1，杀使用次数+1，你的手牌上限等于本回合造成的伤害。-1，杀使用次数+1，你的手牌上限等于本回合造成的伤害。",
                            guzhuyizhi2: "孤注一掷", "guzhuyizhi2_info": "",
                            shuileizhandui_1: "水雷战队", "shuileizhandui_1_info": "",
                            shuileizhandui: "水雷战队", "shuileizhandui_info": "你可以交给一名角色任意张牌。若你是本回合第一次发动本技能，你可以从牌堆和弃牌堆获得一张雷杀。",
                            dumuchenglin: "独木成林", "dumuchenglin_info": "你获得【规避】。当场上没有其他航母时，杀使用次数+1，你于你的回合造成的第一次伤害时若受伤角色不是你此伤害+1。",
                            dumuchenglin_2: "独木成林2", "dumuchenglin_2_info": "杀使用次数+1，你于你的回合造成的第一次伤害时若受伤角色不是你此伤害+1。",
                            xiangrui: "祥瑞", "xiangrui_info": "每名玩家的回合限一次，当你受到伤害前，你可以进行判定，判定结果为黑桃，免疫此次伤害，然后获得[祥瑞]标记。",
                            yumian: "御免", "yumian_info": "锁定技，结束阶段，你移除所有[祥瑞]标记。你可以选择距你为1的目标，让其失去一点体力并摸两张牌。若你失去了一个或以上的祥瑞标记，你可以选择的目标不受距离限制",
                            hangkongzhanshuxianqu: "航空战术先驱", "hangkongzhanshuxianqu_info": "你使用转化的锦囊牌指定目标时，你可以展示牌堆顶的x张牌，获取其中花色各不相同的牌(x为你指定的目标数，至多为4)",
                            gaosusheji: "高速射击", "gaosusheji_info": "转换技，出牌阶段你使用的第一张牌为：阳：基本牌时；阴：普通锦囊牌时。你可以令此牌额外结算一次。",
                            qixi_cv: "奇袭", "qixi_cv_info": "限定技，出牌阶段，你可以令所有其他角色依次选择一项:1你弃置其区域内的两张牌，2本回合不能使用或打出手牌，3翻面。然后你可以视为使用【近距支援】。",
                            rand: "随机数", "rand_info": "遇事不决？扔一个骰子吧。该技能可以生成1~6的随机数",
                            duikongfangyu: "对空防御", "duikongfangyu_info": "你在回合外发动[防空]后，你摸2张牌",
                            zhudaojiandui: "柱岛舰队", "zhudaojiandui_info": "锁定技，每当你使用或打出一张非虚拟非转化的基本牌，你获得一个[柱]标记。你可以移去三个柱标记视为使用一张不计入次数限制的杀。",
                            sawohaizhan: "萨沃海战", "sawohaizhan_info": "出牌阶段各限一次。你可以将一张红牌当做",
                            sawohaizhan_1: "雷杀", "sawohaizhan_1_info": "你可以将一张黑牌当作雷杀使用。",
                            sawohaizhan_2: "洞烛先机", "sawohaizhan_2_info": "你可以将一张红牌当作洞烛先机使用（洞烛先机：观星2，然后摸两张牌）。",
                            qingyeqingyeqing: "青叶青叶青", "qingyeqingyeqing_info": "当你成为牌的唯一目标时，你可以指定一名其他角色，其可以选择弃置一张非基本牌令此牌对你无效。",
                            mingyundewufenzhong: "命运的五分钟", "mingyundewufenzhong_info": "你可以跳过判定和摸牌阶段，视为使用一张雷杀或火杀，你可以弃置一张装备牌并跳过出牌阶段，视为使用一张雷杀或火杀，你可以跳过弃牌阶段并翻面，视为使用一张雷杀或火杀。",
                            wufenzhong1: "命运的五分钟", "wufenzhong1_info": "你可以跳过判定和摸牌阶段，视为使用一张雷杀或火杀",
                            wufenzhong2: "命运的五分钟", "wufenzhong2_info": "你可以弃置一张装备牌并跳过出牌阶段，视为使用一张雷杀或火杀",
                            wufenzhong4: "命运的五分钟", "wufenzhong4_info": "你可以跳过弃牌阶段并翻面，视为使用一张雷杀或火杀。",
                            qijianshashou: "旗舰杀手", "qijianshashou_info": "出牌阶段开始时，你可以与一名角色进行拼点，若你赢，本回合你与该角色距离视为1，你对该目标使用杀伤害+1，若你没赢，你跳过出牌阶段和弃牌阶段。",
                            qijianshashou_1: "旗舰杀手", "qijianshashou_1_info": "",
                            zhanxianfangyu: "战线防御", "zhanxianfangyu_info": "每名角色回合回合限一次，若你没有装备防具，你成为黑色杀的目标时，取消之。每回合限一次，距你为1的角色成为杀的目标时，你可以弃置一张牌并代替该名角色成为此杀的目标。",
                            zhanxianfangyu1: "战线防御", "zhanxianfangyu1_info": "",
                            Zqujingying: "Z驱菁英", "Zqujingying_info": "准备阶段，根据场上势力数，你可以选择获得以下技能中的一项:大于等于一，雷击;大于等于二，遗计;大于等于三，生息;大于等于四，天妒。直到你的下回合开始。",
                            huhangyuanhu: "护航援护", "huhangyuanhu_info": "当一名其他角色成为杀的目标后，若你至该角色的距离为一，你可以摸一张牌，若如此做，你交给其一张牌并展示之。若为装备牌，该角色可以使用此牌。",
                            shizhibuyu: "矢志不渝", "shizhibuyu_info": "当你受到伤害时，你可以弃置两张颜色相同的牌令此伤害-1，然后进行判定，若结果为红色，你摸一张牌。 当你的判定牌生效后，你可以令一名角色使用杀次数+1和手牌上限+1直到你的下回合开始。",
                            shizhibuyu1: "矢志不渝", "shizhibuyu1_info": "",
                            shizhibuyu1_eff: "矢志不渝", "shizhibuyu1_eff_info": "直到回合结束，手牌上限+1，出杀次数+1",
                            qianxingtuxi: "潜行突袭", "qianxingtuxi_info": "你使用牌无视距离限制；若你在回合外造成伤害，你于此轮获得规避且受到伤害的角色下个回合第一次造成伤害时须进行一次判定，如果为黑桃，此次伤害-1。",
                            qianxingtuxi_debuff: "被袭", "qianxingtuxi_debuff_info": "锁定技，你第一次造成伤害时须进行一次判定，如果为黑桃，此次伤害-1。",
                            "31jiezhongdui": "31节中队", "31jiezhongdui_info": "每名玩家每回合限一次，有角色使用杀指定目标后，若使用者的体力值小于目标的体力值，你可以选择一项:1令此杀不可响应;2令此杀伤害+1;3令此杀使用者摸两张牌然后直到你的回合开始不能发动此技能。:1令此杀不可响应;2令此杀伤害+1;3令此杀使用者摸两张牌然后本轮不能发动此技能。",
                            jujianmengxiang: "巨舰梦想", "jujianmengxiang_info": "出牌阶段，你可以失去一点体力，视为使用一张基本牌或非延时锦囊牌（每回合每种牌名限一次）。",
                            sidajingang: "四大金刚", "sidajingang_info": "你使用杀造成伤害后，你可以与目标拼点，若你赢你获得其一张牌。你发动[远航摸牌]后可以摸一张牌。",
                            jiujingzhanzhen: "久经战阵", "jiujingzhanzhen_info": "结束阶段，你可以选择X名角色，其各选择一项:1摸一张牌，2令你获得一点护甲(至多为一)。X为你本回合弃置的红牌数。",
                            wuweizhuangji: "无畏撞击", "wuweizhuangji_info": "限定技，出牌阶段，若你的体力值最少，你可以失去所有体力，然后对一名角色造成x点伤害(x为你当前的体力上限)",
                            zhongzhuangcike: "重装刺客", "zhongzhuangcike_info": "你装备区内有牌时，你使用的杀无视防具；你即将造成的伤害视为体力流失",
                            duomianshou: "多面手", "duomianshou_info": "出牌阶段限一次，你可以弃置一张手牌，视为使用一张牌堆中点数相同的牌(不受次数限制），若牌堆中没有相同点数的牌名，重置该技能发动次数，且本回合不能再使用该点数发动技能；每回合限一次，你对其他中小型船使用转化牌时，其选择弃置一张牌或令你摸一张牌。",
                            duomianshou_1: "多面手", "duomianshou_1_info": "每回合限一次，你对其他中小型船使用转化后的牌时其选择一项：1弃置一张牌，2令你摸一张牌。",
                            kaixuanzhige: "凯旋之歌", "kaixuanzhige_info": "当你使用【杀】指定唯一其他角色为目标后，你可以进行判定，若结果为锦囊牌，此【杀】伤害+1且无视防具。你的体力值小于3时，你使用的【杀】无视防具。",
                            yishisheji: "意式设计", "yishisheji_info": "每轮限一次，你可以免疫一次伤害。你使用杀指定唯一目标时可以进行判定，若判定结果不为红桃，此杀基础伤害+1，否则此杀无效。出牌阶段你使用或打出的第一张杀无距离限制。",
                            yishisheji_1: "意式设计", "yishisheji_1_info": "",
                            jueshengzhibing: "决胜之兵", "juezhanzhibing_info": "你使用杀指定有护甲的目标时，你可以弃置其一张牌；你使用锦囊牌时，你可以摸一张牌。若你以此法摸或弃置了总计两张牌，你结束出牌阶段，反之，回合结束时你获得'智愚'直到下回合开始。",
                            zhanfu: "战斧", "zhanfu_info": "你手牌数为场上最多时，你使用杀无视距离",
                            xinqidian: "新起点", "xinqidian_info": "出牌阶段限一次，你可以选择至多3名角色，你与这些角色各展示一张牌:若展示的牌花色均不相同，每人摸1张牌;否则，参与展示牌的角色计算与其他角色距离-1直至其的下个回合结束。",
                            //xinqidian_1:"新起点",xinqidian_1_info:"",
                            jilizhixin: "激励之心", 'jilizhixin_info': "若你的宝物栏为空，你视为装备着'侦察机'。你可以弃一张牌并跳过出牌阶段，令一名角色获得一个额外回合。",
                            hangkongzhanshuguang: "航空战曙光", 'hangkongzhanshuguang_info': "出牌阶段限一次，你可以令一名角色摸一张牌。若目标是航母，改为摸两张牌。",
                            jianrjinji:"舰r武将",
                            jianrbiaozhun:"舰r标准",
                            lishizhanyi:'历史战役',
                            lishizhanyi_naerweike:'历史战役-纳尔维克',
                            lishizhanyi_matapanjiao:'历史战役-马塔潘角',
                            lishizhanyi_danmaihaixia:'历史战役-丹麦海峡',
                            lishizhanyi_shanhuhai:'历史战役-珊瑚海',
                            lishizhanyi_haixiafujizhan:'历史战役-海峡伏击战',
                        },
                    };
                    if (lib.device || lib.node) {
                        for (var i in jianrjinji.character) { jianrjinji.character[i][4].push('ext:舰R牌将/' + i + '.jpg'); }
                    } else {
                        for (var i in jianrjinji.character) { jianrjinji.character[i][4].push('db:extension-舰R牌将:' + i + '.jpg'); }
                    }//由于以此法加入的武将包武将图片是用源文件的，所以要用此法改变路径。可以多指定x个目标数（x技能强化的次数），
                    return jianrjinji;
                });
                lib.config.all.characters.push('jianrjinji');
                if (!lib.config.characters.contains('jianrjinji')) lib.config.characters.push('jianrjinji');
                lib.translate['jianrjinji_character_config'] = '舰R武将';// 包名翻译
                //卡包（手牌）
                game.import('card', function () {
                    var jianrjinjibao = {
                        name: 'jianrjinjibao',//卡包命名
                        connect: true,//卡包是否可以联机
                        card: {
                            jinjuzy: {
                                audio: true,
                                image: 'ext:舰R牌将/jinjuzy.jpg',
                                type: "trick",
                                enable: true,
                                //selectTarget: -1,
                                selectTarget: [1, Infinity],
                                reverseOrder: true,
                                "yingbian_prompt": "当你使用此牌选择目标后，你可为此牌减少一个目标",
                                "yingbian_tags": ["remove"],
                                yingbian: function (event) {
                                    event.yingbian_removeTarget = true;
                                },
                                filterTarget: function (card, player, target) {
                                    return player != target;
                                },
                                content: function () {
                                    "step 0"
                                    if (typeof event.baseDamage != 'number') event.baseDamage = 1;
                                    if (event.directHit) event._result = { bool: false };
                                    else {
                                        var next = target.chooseToRespond({ name: 'shan' || 'huibi9' });
                                        next.set('ai', function (card) {
                                            var evt = _status.event.getParent();
                                            if (get.damageEffect(evt.target, evt.player, evt.target) >= 0) return 0;
                                            if (evt.player.hasSkillTag('notricksource')) return 0;
                                            if (evt.target.hasSkillTag('notrick')) return 0;
                                            if (evt.target.hasSkillTag('noShan')) {
                                                return -1;
                                            }
                                            return get.order(card);
                                        });
                                        next.autochoose = lib.filter.autoRespondShan;
                                    }
                                    "step 1"
                                    if (result.bool == false) {
                                        if (target.getEquip(2) != 'tengjia') target.damage(event.baseDamage);
                                    }
                                },
                                ai: {

                                    wuxie: function (target, card, player, viewer) {
                                        if (get.attitude(viewer, target) > 0 && target.countCards('h', 'shan')) {
                                            if (!target.countCards('h') || target.hp == 1 || Math.random() < 0.7) return 0;
                                        }
                                    },
                                    basic: {
                                        order: 9,
                                        useful: 1,
                                        value: 7,
                                    },
                                    result: {
                                        player(player, target) {
                                            var att = get.attitude(player, target);
                                            if (att > 0) return 0;
                                            return 1;
                                        },
                                        "target_use": function (player, target) {
                                            if (player.hasUnknown(2) && get.mode() != 'guozhan') return 0;
                                            var nh = target.countCards('h');
                                            if (get.mode() == 'identity') {
                                                if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
                                            }
                                            if (nh == 0) return -2;
                                            if (nh == 1) return -1.7
                                            return -1.5;
                                        },
                                        target: function (player, target) {
                                            var nh = target.countCards('h');
                                            if (get.mode() == 'identity') {
                                                if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
                                            }
                                            if (nh == 0) return -2;
                                            if (nh == 1) return -1.7
                                            return -1.5;
                                        },
                                    },
                                    tag: {
                                        respond: 1,
                                        respondShan: 1,
                                        damage: 1,
                                        multitarget: 1,
                                        multineg: 1,
                                    },
                                },
                                fullimage: true,
                            },
                            jiakongls: {
                                image: 'ext:舰R牌将/jiakongls.jpg',
                                audio: true,
                                type: "trick",
                                enable: true,
                                cardcolor: "red",
                                selectTarget: -1,
                                filterTarget: true,
                                contentBefore: function () {
                                    "step 0"
                                    if (!targets.length) {
                                        event.finish();
                                        return;
                                    }
                                    if (get.is.versus()) {
                                        player.chooseControl('顺时针', '逆时针', function (event, player) {
                                            if (player.next.side == player.side) return '逆时针';
                                            return '顺时针';
                                        }).set('prompt', '选择' + get.translation(card) + '的结算方向');
                                    }
                                    else {
                                        event.goto(2);
                                    }
                                    "step 1"
                                    if (result && result.control == '顺时针') {
                                        var evt = event.getParent(), sorter = (_status.currentPhase || player);
                                        evt.fixedSeat = true;
                                        evt.targets.sortBySeat(sorter);
                                        evt.targets.reverse();
                                        if (evt.targets[evt.targets.length - 1] == sorter) {
                                            evt.targets.unshift(evt.targets.pop());
                                        }
                                    }
                                    "step 2"
                                    ui.clear();
                                    var num;
                                    if (event.targets) {
                                        num = Math.floor(event.targets.length * 1.5);
                                    }
                                    else {
                                        num = game.countPlayer() * 2;
                                    }
                                    var cards = get.cards(num);
                                    game.cardsGotoOrdering(cards).relatedEvent = event.getParent();
                                    var dialog = ui.create.dialog('五谷丰登', cards, true);
                                    _status.dieClose.push(dialog);
                                    dialog.videoId = lib.status.videoId++;
                                    game.addVideo('cardDialog', null, ['五谷丰登', get.cardsInfo(cards), dialog.videoId]);
                                    event.getParent().preResult = dialog.videoId;
                                    game.broadcast(function (cards, id) {
                                        var dialog = ui.create.dialog('五谷丰登', cards, true);
                                        _status.dieClose.push(dialog);
                                        dialog.videoId = id;
                                    }, cards, dialog.videoId);
                                    game.log(event.card, '亮出了', cards);
                                },
                                content: function () {
                                    "step 0"
                                    for (var i = 0; i < ui.dialogs.length; i++) {
                                        if (ui.dialogs[i].videoId == event.preResult) {
                                            event.dialog = ui.dialogs[i]; break;
                                        }
                                    }
                                    if (!event.dialog) {
                                        event.finish();
                                        return;
                                    }
                                    if (event.dialog.buttons.length > 1) {
                                        var next = target.chooseButton(true, function (button) {
                                            return get.value(button.link, _status.event.player);
                                        });
                                        next.set('dialog', event.preResult);
                                        next.set('closeDialog', false);
                                        next.set('dialogdisplay', true);
                                    }
                                    else {
                                        event.directButton = event.dialog.buttons[0];
                                    }
                                    "step 1"
                                    var dialog = event.dialog;
                                    var card;
                                    if (event.directButton) {
                                        card = event.directButton.link;
                                    }
                                    else {
                                        for (var i of dialog.buttons) {
                                            if (i.link == result.links[0]) {
                                                card = i.link;
                                                break;
                                            }
                                        }
                                        if (!card) card = event.dialog.buttons[0].link;
                                    }

                                    var button;
                                    for (var i = 0; i < dialog.buttons.length; i++) {
                                        if (dialog.buttons[i].link == card) {
                                            button = dialog.buttons[i];
                                            button.querySelector('.info').innerHTML = function (target) {
                                                if (target._tempTranslate) return target._tempTranslate;
                                                var name = target.name;
                                                if (lib.translate[name + '_ab']) return lib.translate[name + '_ab'];
                                                return get.translation(name);
                                            }(target);
                                            dialog.buttons.remove(button);
                                            break;
                                        }
                                    }
                                    var capt = get.translation(target) + '选择了' + get.translation(button.link);
                                    if (card) {
                                        target.gain(card, 'visible');
                                        target.$gain2(card);
                                        game.broadcast(function (card, id, name, capt) {
                                            var dialog = get.idDialog(id);
                                            if (dialog) {
                                                dialog.content.firstChild.innerHTML = capt;
                                                for (var i = 0; i < dialog.buttons.length; i++) {
                                                    if (dialog.buttons[i].link == card) {
                                                        dialog.buttons[i].querySelector('.info').innerHTML = name;
                                                        dialog.buttons.splice(i--, 1);
                                                        break;
                                                    }
                                                }
                                            }
                                        }, card, dialog.videoId, function (target) {
                                            if (target._tempTranslate) return target._tempTranslate;
                                            var name = target.name;
                                            if (lib.translate[name + '_ab']) return lib.translate[name + '_ab'];
                                            return get.translation(name);
                                        }(target), capt);
                                    }
                                    dialog.content.firstChild.innerHTML = capt;
                                    game.addVideo('dialogCapt', null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
                                    game.log(target, '选择了', button.link);
                                    game.delay();
                                },
                                contentAfter: function () {
                                    for (var i = 0; i < ui.dialogs.length; i++) {
                                        if (ui.dialogs[i].videoId == event.preResult) {
                                            var dialog = ui.dialogs[i];
                                            dialog.close();
                                            _status.dieClose.remove(dialog);
                                            if (dialog.buttons.length) {
                                                event.remained = [];
                                                for (var i = 0; i < dialog.buttons.length; i++) {
                                                    event.remained.push(dialog.buttons[i].link);
                                                }
                                                event.trigger('wuguRemained');
                                            }
                                            break;
                                        }
                                    }
                                    game.broadcast(function (id) {
                                        var dialog = get.idDialog(id);
                                        if (dialog) {
                                            dialog.close();
                                            _status.dieClose.remove(dialog);
                                        }
                                    }, event.preResult);
                                    game.addVideo('cardDialog', null, event.preResult); if (!player.countMark('jiakongls')) { player.addMark('jiakongls'); player.chooseUseTarget(true, 'jiakongls') };
                                },
                                ai: {
                                    wuxie: function () {
                                        if (Math.random() < 0.5) return 0;
                                    },
                                    basic: {
                                        order: 10,
                                        useful: 0.5,
                                    },
                                    result: {
                                        target: function (player, target) {
                                            var sorter = (_status.currentPhase || player);
                                            if (get.is.versus()) {
                                                if (target == sorter) return 1.5;
                                                return 1;
                                            }
                                            if (player.hasUnknown(2)) {
                                                return 0;
                                            }
                                            return (3 - get.distance(sorter, target, 'absolute') / game.countPlayer()) * get.attitude(player, target) > 0 ? 0.5 : 0.7;
                                        },
                                    },
                                    tag: {
                                        draw: 1,
                                        multitarget: 1,
                                    },
                                },
                                fullimage: true,
                            },
                            mingzuyq: {
                                image: 'ext:舰R牌将/mingzuyq.jpg',
                                audio: true,
                                mode: ["guozhan"],
                                type: "equip",
                                subtype: "equip5",
                                distance: {
                                    attackFrom: -1,
                                },
                                nomod: true,
                                nopower: true,
                                unique: true,
                                global: "g_dinglanyemingzhu_ai",
                                skills: ["dinglanyemingzhu_skill"],
                                ai: {
                                    equipValue: function (card, player) {
                                        if (player.hasSkill('jubao')) return 8;
                                        if (player.hasSkill('gzzhiheng')) return 6;
                                        if (game.hasPlayer(function (current) {
                                            return current.hasSkill('jubao') && get.attitude(player, current) <= 0;
                                        })) {
                                            return 0;
                                        }
                                        return 7;
                                    },
                                    basic: {
                                        equipValue: 6.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                                fullimage: true,
                            },
                            hangkongzhan: {
                                audio: "ext:舰R牌将:true",
                                image: 'ext:舰R牌将/hangkongzhan.jpg',
                                type: "equip",
                                subtype: "equip4",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 7.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: ["hangmucv"],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                                fullimage: true,
                            },
                            paohuozb: {
                                image: 'ext:舰R牌将/paohuozb.png',
                                type: "equip",
                                subtype: "equip1",
                                distance: {
                                    attackFrom: -2,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2,
                                        order: function (card, player) {
                                            if (player.hp > 2) return true
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 2.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 0 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.hp < 2 || player.countCards('h', 'sha') < 1 || !player.canUse('sha', player)) return 0.01
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: ["paohuozb_skill", "danzong"],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: false,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                                fullskin: true,
                            },
                            xingyun: {
                                image: 'ext:舰R牌将/xingyun.png',
                                derivation: "majun",
                                type: "equip",
                                subtype: "equip3",
                                ai: {
                                    basic: {
                                        equipValue: 7.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: ["huibi"],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: false,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: false,
                                fullskin: true,
                            },
                            lianxugongji: {
                                image: 'ext:舰R牌将/lianxugongji.png',
                                type: "basic",
                                cardcolor: "club",
                                derivation: "gjqt_xieyi",
                                enable: true,
                                selectTarget: 1,
                                filter: function (event, player) { return player.canUse('sha'); },
                                filterTarget: function (card, player, target) { return target != player && player.canUse('sha', target); },
                                content: function () {
                                    'step 0'
                                    event.num = 0;
                                    'step 1'
                                    game.log("event.num" + event.num);
                                    event.num++;
                                    /*var choice = 'liutouge';
                                    player.chooseVCardButton('选择一张牌视为使用之', ['sha', 'sha', 'sha']).set('ai', function (button) {
                                        if (button.link[2] == _status.event.choice) return 2;
                                        return Math.random();
                                    }).set('choice', choice).set('filterButton', function (button) {
                                        return _status.event.player.hasUseTarget(button.link[2]);
                                    });*/
                                    player.chooseUseTarget({
                                        name: 'sha',
                                        //nature:'fire',
                                        isCard: true,
                                    }, '请选择【杀】的目标（' + (event.num == 2 ? '2' : event.num) + '/2）', false);

                                    'step 2'
                                    if (result.bool && event.num < 2) event.goto(1);
                                    else {
                                        event.finish();
                                    }
                                },
                                ai: {
                                    order: 5,
                                    result: {
                                        player: 1,
                                    },
                                },
                                fullimage: true,
                            },
                            "quzhupao3": {
                                image: 'ext:舰R牌将/quzhupao3.png',
                                fullskin: true,
                                type: "equip",
                                subtype: "equip1",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                            },
                            "qingxunpao3": {
                                image: 'ext:舰R牌将/qingxunpao3.png',
                                fullskin: true,
                                type: "equip",
                                subtype: "equip1",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                            },
                            "zhongxunpao3": {
                                image: 'ext:舰R牌将/zhongxunpao3.png',
                                fullskin: true,
                                type: "equip",
                                subtype: "equip1",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                            },
                            "zhanliepao3": {
                                image: 'ext:舰R牌将/zhanliepao3.png',
                                fullskin: true,
                                type: "equip",
                                subtype: "equip1",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                            },
                            "zhandouji3": {
                                image: 'ext:舰R牌将/zhandouji3.png',
                                fullskin: true,
                                type: "equip",
                                subtype: "equip1",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                            },
                            huokongld: {
                                image: 'ext:舰R牌将/huokongld.png',
                                fullskin: true,
                                type: "equip",
                                subtype: "equip4",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                            },
                            "yuleiqianting3": {
                                image: 'ext:舰R牌将/yuleiqianting3.png',
                                fullskin: true,
                                type: "equip",
                                subtype: "equip1",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                            },
                            "jianzaidaodan3": {
                                image: 'ext:舰R牌将/jianzaidaodan3.png',
                                fullskin: true,
                                type: "equip",
                                subtype: "equip1",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                            },
                            "yuleiji3": {
                                image: 'ext:舰R牌将/yuleiji3.png',
                                fullskin: true,
                                type: "equip",
                                subtype: "equip1",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                            },
                            "tansheqi3": {
                                image: 'ext:舰R牌将/tansheqi3.png',
                                derivation: "majun",
                                type: "equip",
                                subtype: "equip4",
                                ai: {
                                    basic: {
                                        equipValue: 7.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: false,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: false,
                                fullskin: true,
                            },
                            "fasheqi3": {
                                image: 'ext:舰R牌将/fasheqi3.png',
                                fullskin: true,
                                type: "equip",
                                subtype: "equip4",
                                distance: {
                                    attackFrom: -1,
                                },
                                ai: {
                                    basic: {
                                        equipValue: 2.5,
                                        order: function (card, player) {
                                            if (player && player.hasSkillTag('reverseEquip')) {
                                                return 8.5 - get.equipValue(card, player) / 20;
                                            }
                                            else {
                                                return 8 + get.equipValue(card, player) / 20;
                                            }
                                        },
                                        useful: 2,
                                        value: function (card, player, index, method) {
                                            if (player.isDisabled(get.subtype(card))) return 0.01;
                                            var value = 0;
                                            var info = get.info(card);
                                            var current = player.getEquip(info.subtype);
                                            if (current && card != current) {
                                                value = get.value(current, player);
                                            }
                                            var equipValue = info.ai.equipValue;
                                            if (equipValue == undefined) {
                                                equipValue = info.ai.basic.equipValue;
                                            }
                                            if (typeof equipValue == 'function') {
                                                if (method == 'raw') return equipValue(card, player);
                                                if (method == 'raw2') return equipValue(card, player) - value;
                                                return Math.max(0.1, equipValue(card, player) - value);
                                            }
                                            if (typeof equipValue != 'number') equipValue = 0;
                                            if (method == 'raw') return equipValue;
                                            if (method == 'raw2') return equipValue - value;
                                            return Math.max(0.1, equipValue - value);
                                        },
                                    },
                                    result: {
                                        target: function (player, target, card) {
                                            return get.equipResult(player, target, card.name);
                                        },
                                    },
                                },
                                skills: [],
                                enable: true,
                                selectTarget: -1,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                modTarget: true,
                                allowMultiple: false,
                                content: function () {
                                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                                },
                                toself: true,
                            },
                        },
                        translate: {
                            jinjuzy: "近距支援",
                            "jinjuzy_info": "出牌阶段，对所有其他角色使用。每名目标角色需打出一张【闪】，否则受到1点伤害。",
                            jiakongls: "架空历史",
                            "jiakongls_info": "群星璀璨，欧陆风云，该武将首次使用会有两轮1.5展示牌量的五谷丰登，再次使用仅有一轮。",
                            mingzuyq: "民族乐器",
                            "mingzuyq_info": "北境之地的文化艺术。锁定技，你视为拥有技能国战“制衡”，若你已经有“制衡”，则改为取消可弃置牌数的限制。",
                            hangkongzhan: "航空战",
                            "hangkongzhan_info": "建树丰厚，参与每轮开始时的三连杀战斗吗，每轮最多弃置三张牌。",
                            paohuozb: "炮火准备",
                            "paohuozb_info": "试试就逝世，扣一血得属性杀增强效果，然而现在所有舰船都有这个，可以图加一杀次数。",
                            xingyun: "强力规避",
                            "xingyun_info": "可以进行一次判定，为桃、闪则视为打出闪。<br>若判定未生效,会获得判定牌。<br>若武将为驱逐且没有判定成功，可以额外触发一次。",
                            lianxugongji: "连续攻击",
                            "lianxugongji_info": "其实就是杀，但此杀能连打两次。。",
                            "sushepao3": "速射炮",
                            "sushepao3_info": "射速与精度很吓人，当然消耗也很惊人（没有特殊效果）",
                            "quzhupao3": "速射炮",
                            "quzhupao3_info": "可以连续使用水弹击退敌人（没有特殊效果）",
                            "qingxunpao3": "两用炮",
                            "qingxunpao3_info": "对地对空的好帮手（没有特殊效果）",
                            "zhongxunpao3": "中型主炮",
                            "zhongxunpao3_info": "对付轻巡很给力，对付大船则充满了不幸（没有特殊效果）",
                            "zhanliepao3": "大型主炮",
                            "zhanliepao3_info": "能击穿才是传奇，有严重损害更好（没有特殊效果）",
                            "zhandouji3": "战斗机",
                            "zhandouji3_info": "适合满速轻型航母的战斗机，启航，编队，狗斗，加速降落（没有特殊效果）",
                            huokongld: "火控雷达",
                            "huokongld_info": "强大的雷达，可以精准的命中对手。（没有技能的装备）",
                            "yuleiqianting3": "鱼雷(潜艇用)",
                            "yuleiqianting3_info": "来偷袭，我一个英姿闭月双刀的老头子，这合理吗（没有特殊效果）",
                            "jianzaidaodan3": "反舰导弹",
                            "jianzaidaodan3_info": "融合卫星定位，（没有特殊效果）",
                            "yuleiji3": "鱼雷机",
                            "yuleiji3_info": "可以反潜，较小的起飞距离则能支援主力作战，。（没有特殊效果）",
                            "tansheqi3": "弹射器",
                            "tansheqi3_info": "加速飞机起飞，缩短航母甲板或者增加飞机承载量（没有特殊效果）",
                            "fasheqi3": "发射器",
                            "fasheqi3_info": "发射导弹的同时要牺牲一个火控雷达槽位（没有特殊效果）",
                        },
                        list: [["heart", "1", "hangkongzhan"], ["heart", "1", "xingyun"], ["heart", "1", "lianxugongji"], ["heart", "1", "jinjuzy"], ["heart", "1", "jiakongls"]],//牌堆添加
                    }
                    return jianrjinjibao
                });
                lib.translate['jianrjinjibao_card_config'] = '舰R卡牌';
                lib.config.all.cards.push('jianrjinjibao');
                //if (!lib.config.cards.contains('jianrjinjibao')) lib.config.cards.push('jianrjinjibao');//包名翻译，失败了：,"jianrjinjibao":{"name":"禁用舰R测试内卡包","intro":"联机卡组在游戏内运行时才添加至游戏内，禁用添加这些卡组的技能，才能真正禁用这些卡组","init":true},
                //闪避（响应）对面的攻击，通过攻击减少对手手牌数，config.diewulimitaiconfig.hanbing_gaiconfig.tiaozhanbiaojiang
            };
        }, help: {}, config: {//config就是配置文件，类似于minecraft的模组设置文本。无名将其可视化了....。当你进行了至少一次强化后<br>1.出牌阶段<br>你可以弃置3张不同花色的牌，提升一点血量上限。<br>2.当你濒死时，<br>你可以弃置4张不同花色的牌，回复一点体力。<br>（未开启强化，则无需强化即可使用建造。未开启建造，则强化上限仅为1级。）火杀：令目标回合结束后，受到一点火焰伤害，摸两张牌。</br>冰杀：护甲加1伤；减少对手1点防御距离。</br>雷杀：自动判断是否流失对手体力；减少对手1点手牌上限；。</br>此角色回合结束后移除所有的进水、减速、燃烧。
            jianrjinji: { "name": "禁用舰R联机武将/可自定义角色技能", "intro": "在游戏运行时，扩展通过运行一个技能，将联机武将添加至游戏内，<br>禁用此技能，才能禁用联机武将。<br>禁用后，单机武将不会被联机部分覆盖。<br>进入修改武将的界面：点击上方的编辑扩展-武将。", "init": false },
            _yuanhang: { "name": "远航-用一张牌摸一张牌，轮到自己后能用一次", "intro": "开启后，非BOSS武将：受伤时手牌上限+1；<br>当你失去手牌后，且手牌数<手牌上限值时，你摸一张牌。使用次数上限0/1/2次，处于自己的回合时+1，每回合回复一次使用次数。<br>当你进入濒死状态时，你摸一张牌，体力上限>2时需减少一点体力上限，额外摸一张牌；死亡后，你可以按自己的身份，令一名角色摸-/2/1/1（主/忠/反/内）张牌。", "init": true },
            _jianzaochuan: { "name": "建造-用三张牌提升血量上限，用四张牌回血", "intro": "开启后，非BOSS武将进行了至少一次强化后：<br>1.出牌阶段，<br>你可以弃置3张不同花色的牌，提升一点血量上限。<br>2.当你濒死时，<br>你可以弃置4张不同花色的牌，回复一点体力。<br>（未开启强化，则无需强化即可使用建造。未开启建造，则强化上限仅为1级。）", "init": true },
            _qianghuazhuang: { "name": "强化-用牌增加攻击距离、防御距离", "intro": "开启后，非BOSS武将可以消耗经验，或弃置二至四张牌，选择一至两个永久效果升级。<br>（如摸牌、攻击距离、手牌上限等）每回合限两次。装备牌代表两张牌。", "init": true },
            _wulidebuff: { "name": "火杀燃烧、雷杀穿甲、寒冰剑对甲加伤", "intro": "开启后，非BOSS武将的属性伤害会有额外效果。<br>火杀：令目标回合结束后，受到一点火焰伤害，摸两张牌（有护甲则不会触发摸牌）。</br>冰杀/寒冰剑雷杀：护甲加1伤；减少对手1点防御距离。</br>雷杀：自动判断是否流失对手体力；减少对手1点手牌上限；。</br>此角色回合结束后/濒死时移除进水、减速、燃烧。", "init": true },
            qyzhugeliang: { "name": "第一轮休闲局-添加原版技能", "intro": "开启后，主公可以在回合开始时，选择一组技能，直到下一回合开始前，所有角色都能使用这些技能；还有火攻一类的卡组可供选择，让每一个玩家选择打出这些卡", "init": false },
            diewulimitai: { "name": "蝶舞-给队友递一张杀、装备", "intro": "开启后，非BOSS武将获得辅助类技能【蝶舞】，<br>出牌阶段，可以给队友递一张装备/杀，队友得到此牌后可以立即使用，但每轮只能以此法只能出一次杀。", "init": false },
            yidong: { "name": "回合内，与相邻玩家互换座位", "intro": "开启后，非BOSS武将获得辅助类技能【移动】：<br>1.可以在局内移动自己角色的座位，<br>限制为相邻座位，<br>对ai的限制为队友/目标距离此角色为2。", "init": false },
            kaishimopao: { "name": "更好的摸牌阶段", "intro": "开启后，非BOSS武将获得摸牌类技能【摸牌】，<br>摸牌阶段摸牌量>1时：<br>可以弃置等同于摸牌数的牌，改为获得1张由你指定类别的牌，<br>在你判定延时锦囊牌前，<br>可令1.下一个摸牌阶段--少摸一张牌;2.本回合结束时--摸一张牌。", "init": false },
            _hanbing_gai: { "name": "寒冰剑-增强", "intro": "开启后，拥有寒冰剑时，寒冰剑的弃牌数改为你造成的伤害*2，<br>弃置到没有手牌时，会将没有计算完的伤害继续打出（以普通伤害的属性）。", "init": true },
            tiaozhanbiaojiang: { "name": "挑战模式全员国战不屈", "intro": "开启后，非BOSS武将获得技能【挑战技能】：<br>全员一血开局，根据流失的体力数多摸等量的牌；<br>全员国战不屈，唤醒界标武将的力量。<br>暂缺能一个按钮，扶起负数血队友的技能", "init": true },
        }, package: {
            character: {
                character: {//单机部分，在联机框架开启时，联机武将会覆盖同名武将应该不生效。
                    /*liekexingdun: ["female", "wu", 4, ["hangmucv", "hangkongzhanshuxianqu"], ["zhu", "des:血量中等的航母，温柔，体贴，过渡期追着大船打的航母。"]],
                    qixichicheng: ["female", "shu", 4, ["hangmucv", "qixi_cv"], ["des:大佬友情放出精美壁纸，坚定与自信的姿态"]],
                    wufenzhongchicheng: ["female", "shu", 4, ["hangmucv", "mingyundewufenzhong"], ["des:大佬友情放出精美壁纸，坚定与自信的姿态"]],
         
                    dumuchenglinqiye: ["female", "USN", 4, ["hangmucv", "dumuchenglin"], ["des:有必中攻击，快跑"]],
                    bisimai: ["female", "shu", 4, ["zhuangjiafh", "zhanliebb"], ["zhu", "des:更多刮痧炮，更多炮弹，更多削弱光环，更多护甲模组，更多血量。"]],
                    misuli: ["female", "shu", 4, ["zhuangjiafh", "zhanliebb"], ["des:用精巧的手枪去质疑，用绝对的火力回击对手。"]],
                    weineituo: ["female", "shu", 4, ["zhuangjiafh", "zhanliebb"], ["des:身材小，而强度惊人。"]],
                    lisailiu: ["female", "shu", 4, ["zhuangjiafh", "zhanliebb"], ["des:幸运的象征之一，同时有着丰富的精神象征。"]],
                    changmen: ["female", "shu", 4, ["zhuangjiafh", "zhanliebb"], ["des:。"]],
                    kunxi: ["female", "shu", 4, ["huokongld", "zhongxunca", "gaosusheji"], ["des:画师优秀的功底让这名角色美而可爱，这是出色的角色塑造。"]],
                    ougengqi: ["female", "shu", 4, ["huokongld", "zhongxunca"], ["des:励志偶像，与标志性舰装，给人以强大的保护。"]],
                    qingye: ["female", "shu", 4, ["huokongld", "zhongxunca", "sawohaizhan"], ["des:励志偶像，与一首动人的歌，与一段坎坷旅途。"]],
                    beianpudun: ["female", "shu", 4, ["huokongld", "zhongxunca"], ["des:励志青年，在旅途中成长，与恋人坚定的望向远方。"]],
                    jiujinshan: ["female", "shu", 4, ["huokongld", "zhongxunca"], ["des:航海服饰，侦查员与火炮观瞄。"]],
                    yixian: ["female", "USN", 3, ["fangkong2", "qingxuncl"], ["des:经典美术设计的款式，意气风发，威猛先生"]],
                    tianlangxing: ["female", "USN", 3, ["fangkong2", "qingxuncl"], ["des:阻敌计谋表现优秀，这是先发制敌的优势所在，"]],
                    dading: ["female", "USN", 3, ["fangkong2", "qingxuncl"], ["des:手持竹伞的轻巡，辅助队友，防御攻击。"]],
                    degelasi: ["female", "USN", 3, ["fangkong2", "qingxuncl"], ["des:现代文职服饰，一看就很会办公。"]],
                    yatelanda: ["female", "USN", 3, ["fangkong2", "qingxuncl"], ["des:双枪射手点形象，其双枪能以极快的射速打出爆炸弹匣，清空一小片区域。"]],
                    "z31": ["female", "USN", 3, ["huibi", "quzhudd"], ["des:婚纱与轻纱是多数人的美梦,与绿草平原，与绿水青山"]],
                    xuefeng: ["female", "shu", 3, ["huibi", "quzhudd", "xiangrui", "yumian"], ["des:幸运的驱逐舰，多位画师、花了大款的大佬亲情奉献。"]],
                    kangfusi: ["female", "USN", 3, ["huibi", "quzhudd"], ["des:水手服欸,优秀的构图，不过图少改造晚。"]],
                    "47project": ["female", "USN", 3, ["huibi", "quzhudd"], ["des:这是个依赖科技的舰船，有着科幻的舰装，与兼备温柔体贴与意气风发的表现。"]],
                    guzhuyizhichuixue: ["female", "shu", 3, ["huibi", "quzhudd", "guzhuyizhi"], ["des:水手服与宽袖的结合，给人以温柔的感觉。"]],
                    shuileizhanduichuixue: ["female", "shu", 3, ["huibi", "quzhudd", "shuileizhandui",], ["des:水手服与宽袖的结合，给人以温柔的感觉。"]],
                    minsike: ["female", "qun", 3, ["huibi", "quzhudd", "manchangzhanyi", "manchangzhanyi_1"], ["des:跑得快，看得多。"]],
                    "u1405": ["female", "wu", 2, ["qianting", "baiyin_skill"], ["des:无需隐匿的偷袭大师，马上就让对手的后勤捉襟见肘。"]],
                    baiyanjuren: ["female", "wu", 3, ["junfu"], ["des:需要武器支援，伙计倒下了。"]],
                    changchun: ["female", "wu", 3, ["daoqu", "tianyi"], ["des:尚处于正能量之时。"]],*/
                },
                translate: {

                },
            },
            card: {
                card: {},
                translate: {

                },
                list: [],
            },
            skill: {

                translate: {

                },
            },
            intro: "制作组群，730255133，#(滑稽)。<br>建议：1.使用懒人包，开启扩展-十周年UI，技能标记卡顿时，可以关闭获得技能提示，提高体验感。<br>2.点击透明时钟-选项-武将>将其他武将包设为点将才能用，体验丰富而简单的卡牌对战。<br>3.选项-降低字体缩放，提升视野，玩16人扩展也好操作。<br>玩法：本扩展增加了与队友互给关键牌、用装备强化自己的玩法，间接让牌的质量有所提高，可以在下方做限制。 <br>特殊规则：雷杀对有护甲或者有失血反击技能的目标流失体力（穿甲），冰杀对有护甲的目标加1伤，火杀会让对手于其自己的出牌阶段结束后扣一血。<br>卡牌里也有作者尝试的身影，可以编辑牌堆尝试哦。<br>扩展设置：附带增强原版体验的全局技能，可根据需要开关。长按或右键全局技能的简介可以查看详情",
            author: "※人杰地灵游戏中",
            diskURL: "https://pan.baidu.com/s/1VPMQuAUgucpRRbef9Dmy3g?pwd=gfmv",
            forumURL: "",
            version: "1.92+",
        }, files: { "character": ["changchun.jpg"], "card": ["fasheqi3.png"], "skill": [] }
    }

})
//functions
//加权随机函数，输入包含选项和选项的权重的数组，输出随机到的选项
/*调用示例
    var options = [
    { name: "选项一", weight: 2 },
    { name: "选项二", weight: 3 },
    { name: "选项三", weight: 1 },
  ];
  
  var selectedOption = weightedRandom(options);
  console.log("随机选择的选项是:", selectedOption);*/
function weightedRandom(options) {
    var totalWeight = options.reduce((acc, option) => acc + option.weight, 0);
    var randomValue = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (var option of options) {
        cumulativeWeight += option.weight;
        if (randomValue <= cumulativeWeight) {
            return option.name;
        }
    }

    // This should not happen, but just in case.
    return null;
};