//写在前面：本文件中变量名大小写敏感，且需要注意是否有s（例如target-targets）
//filter中使用event.，不能使用trigger.。trigger.在contant中使用。
//filter函数（条件函数）里的event是触发事件，但content函数（效果函数）里的trigger才是触发事件，event是当前的技能事件，event.getParent()是当前技能事件的上一级父事件，event.getParent(2)是当前技能事件的上二级父事件。
//"step 0"必须从0开始，引号可以是单引号或双引号，但是整个技能里面不能变
/*yield 可以跨步骤储存变量，用于一个技能里需要多次选择目标/牌等造成系统自带result.targets和result.links失效的情况。该方法需要content:function*(event,map),并且内容中player和trigger.player(已验证),result（待验证）需要分别使用map.player和map.trigger.player（已验证）,map.result（待验证）代替
yield需要无名杀版本1.10.10或更高版本的支持
示例： 
    var result = yield player.chooseCardButton('Z驱领舰：选择一张“Z”移动', true, cards);
    "step 2"
    game.log("result.links");*/
//player.useCard({ name: '牌名' }, result.card, result.targets);可以不使用viewas而使用转化牌.
//dialog = ui.create.dialog在多人模式中不可用，目前使用chosebutton{}（参考神郭嘉佐幸）。
//content中的ai返回值为正数越大越容易则选择目标，返回值为负数则不选择、不发动；ai里的ai返回值为正数则选择友方，返回值为负数则选择敌方，返回值0不发动技能。
//注意每个全局技能（前面有下划线的）代码在本文件钟有两个，单机前一个（带lib.的）生效，多人后一个生效。
//目录：全局技能、武将列表、武将技能、武将和技能翻译、卡牌包与卡牌技能、卡牌翻译、配置（config）、单机武将列表、扩展简介、全局函数模块

//nobracket:true,该属性可以让技能显示完整名称（而不是只有前两个字）
//var player = get.player();指的是当前正在做选择的角色，如果是玩家让其他角色选择，这个选择的ai里get.player()就是“其他角色“。此写法中获取到的player等价于_status.event.player但不包含对客机的广播（也就是_status.event.player在单机中可用，联机时可能出错）
let connect;
try {
    const ws = require("ws");
    connect = ws.connect;
} catch (error) {
    console.warn("require('ws') failed");
}
//const { connect } = require("ws");///vscode生成出来的，vscodeAI检测到enable认为没导入自动添加了导入但其实enable只是一个标签。目前使用try-catch包裹起来。
import { lib, game, ui, get, ai, _status } from '../../noname.js'
import { checkBegin } from '../../noname/library/assembly/buildin.js';
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

            // Sueyuki DEV 扩展专用alert对话框（允许自定义样式）
            game.jianRAlert = (str, options = {}) => {
                const {
                    containerStyle = {},
                    dialogStyle = {},
                    confirmStyle = {}
                } = options;
                let promptContainer = ui.create.div(".popup-container", ui.window, function () {
                    if (this.clicked) {
                        this.clicked = false;
                    }
                });
                Object.assign(promptContainer.style, {
                    overflowY: "auto",     // 垂直滚动条
                    overflowX: "hidden",   // 不允许横向滚动
                    ...containerStyle
                });

                // 主容器
                let dialogContainer = ui.create.div(".prompt-container", promptContainer);

                // 内容框
                let dialog = ui.create.div(".menubg", dialogContainer, function () {
                    promptContainer.clicked = true;
                });
                Object.assign(dialog.style, dialogStyle);
                ui.create.div("", str || "", dialog);
                let controls = ui.create.div(dialog);
                let clickConfirm = function () {
                    promptContainer.remove();
                };
                let confirmButton = ui.create.div(".menubutton.large", "确定", controls, clickConfirm);
                Object.assign(confirmButton.style, confirmStyle);
            }

            // 参考全能搜索创建舰r教程指南的按钮与实例
            const getSystem = setInterval(() => {
                if (ui.system1 || ui.system2) {
                    // @ts-ignore
                    clearInterval(getSystem);
                    ui.jian_R_readme = ui.create.system('舰r杀机制介绍', function () {
                        game.jianRAlert(
                            "所有全局技能均可在扩展详情中查看说明和配置开关，" +
                            "以下是默认开启的全局技能<br><br>" +
                            "<b>远航:</b>你受伤时手牌上限+1；每轮限1/2/3次，失去手牌后，若手牌数少于一半，你可以摸一张牌。<br>" +
                            "当你进入濒死状态时，若你的体力上限大于2，你可以减少一点体力上限，摸两张牌，否则摸一张牌；<br>" +
                            "你死亡后，若你为忠臣，你可以令主公摸一张牌。<br><br>" +
                            "<b>建造:</b>若你进行了至少一次强化：出牌阶段" +
                            "你可以弃置3张不同花色的牌，提升一点血量上限，解锁强化二级效果。<br>" +
                            "<b>强化:</b>出牌阶段限一次，你可以弃置二至四张牌，选择一至两个效果升级。（如摸牌、攻击距离、手牌上限等）<br><br>" +
                            "<b>属性伤害:</b>火杀燃烧:令目标回合结束后，受到一点火焰伤害，摸两张张牌。<br>" +
                            "冰杀减速:对有护甲的目标加1伤害；减少1点其他角色计算与目标的距离。<br>" +
                            "雷杀进水:有护甲时改为造成目标流失体力；减少目标1点手牌上限。<br>" +
                            "目标回合结束后或濒死时移除进水、减速、燃烧。",
                            {
                                containerStyle: {
                                    width: '60%',
                                    // height: '80%',
                                    padding: '5px 20px 5px 20px',
                                },
                            }
                        );
                    });
                }
            }, 500);


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
                    trigger: { global: "phaseBefore", player: "enterGame", },
                    forced: true,
                    priority: -1,
                    filter: function (event, player) {
                        return (event.name != 'phase' || game.phaseNumber == 0) && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));
                    },
                    content: function () {
                        if (player.identity == 'zhu') { player.changeHujia(1); };
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
                                return evt && evt.player == player && evt.hs && evt.hs.length > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));
                            },
                            content: function () { player.draw(1); player.removeMark('_yuanhang_mopai'); },
                            sub: true,
                        },
                        kaishi: {
                            name: "远航回合开始时", fixed: true, silent: true, friquent: true,
                            trigger: { global: "phaseBegin", },
                            content: function () {//else if(!player.countMark('mopaiup')<1&&player.countCards('h','shan')<1){player.draw()}
                                var a = player.countMark('mopaiup'); var b = player.countMark('_yuanhang_mopai'); //game.log(event.skill != 'huijiahuihe');
                                if (player == _status.currentPhase && event.getParent('phase').skill != 'huijiahuihe') { a += (1); if (a - b > 0) player.addMark('_yuanhang_mopai', a - b); };
                                /*if(a>b&&player!=_status.currentPhase){player.addMark('_yuanhang_mopai',1);};*/
                            },//远航每回合恢复标记被砍掉了。现在只有每轮开始恢复标记。
                            sub: true,
                        },
                        dietogain: {
                            name: "远航死后给牌", trigger: { player: ["dieAfter"], },
                            direct: true,
                            forceDie: true,
                            filter: function (event, player) { if (event.name == 'die') return get.mode() === "identity" && player.identity === "zhong"; return player.isAlive() && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));; },
                            content: function () {
                                'step 0'
                                event.count = trigger.num || 1;
                                'step 1'
                                event.count--;//让优势方有一轮的挑战，因为第二轮对手就因为过牌量下降而失去威胁。
                                player.chooseTarget(get.prompt2('在离开战斗前，若你的身份：<br>是忠臣，你可令一名角色摸1张牌。<br>或许会有转机出现。'), function (card, player, target) { return target.maxHp > 0; }).set('ai', function (target) {
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
                            filter: function (event, player) { return player.hp <= 0 && event.num < 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai')); },
                            "prompt2": function (event, player) {
                                return '当你进入濒死状态时，你可以摸一张牌,<br>若血量上限大于2，你须失去一点体力上限，改为摸两张牌。'
                            },
                            content: function () {
                                if (player.maxHp <= 2) {
                                    player.draw(1);
                                } else if (player.maxHp > 2) {
                                    player.loseMaxHp(1);
                                    player.draw(2);
                                }
                            },
                            /* intro: {
                                marktext: "濒死", content: function (player) {
                                    var player = get.player(), a = player.countMark('_yuanhang_bingsimopai'), tishi = '因濒死而减少的体力上限，牺牲上限，获得应急的牌，保一时的平安。<br>'; if (a > 0 && a <= 2 && player.hp <= 2) { tishi += ('勇敢的前锋<br>') }; if (a > 2 && a < 4 && player.hp <= 2) { tishi += ('rn勇的中坚<br>') }; if (a >= 4 && player.hp <= 2) { tishi += ('顽强的、折磨对手的大将<br>') };
                                    return tishi;
                                },
                            },  */
                            sub: true,
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
                        else*/ if (event.parent.name == 'phaseUse' && (a) > 0 && !player.hasMark('_jianzaochuan')) { return (player.countCards('hejs') >= 2) && a && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai')); } return false;//没有建造标记时才能建造，即主动建造上限1次，
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
                    enable: "phaseUse",
                    usable: 1,
                    init: function (player) {//初始化数组，也可以运行事件再加if后面的内容
                        if (!player.storage._qianghuazhuang) player.storage._qianghuazhuang = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                    },
                    getInfo: function (player) {//让其他技能可以更简单的获取该技能的数组。
                        if (!player.storage._qianghuazhuang) player.storage._qianghuazhuang = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                        return player.storage._qianghuazhuang;
                    },
                    filter: function (event, player) {//
                        if (player.hasSkill("guzhuyizhi2")) { return 0; }//孤注一掷发动后禁用强化。
                        var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, lv = 0; if (k < 3) { lv = k * 6 };/*if(k>=3){lv=k+10};*///远航上限降低为2，总可用强化数量公式作相应修改
                        if (player.countCards('h') > 0) { if ((a + b + c + d + e + f + g) >= (lv)) return false }; return player.countCards('h') > 1 || player.countMark('Expup') > 1;
                        //比较保守的设计，便于设计与更改。
                        ;
                    },
                    filterCard: {}, position: "h", selectCard: function (card) {
                        var player = get.player(), num = 0;/*num+=(player.countMark('Expup'));if(ui.selected.cards.length&&get.type(ui.selected.cards[0],'equip')=='equip'){num+=(1)};if(ui.selected.cards.length>1&&get.type(ui.selected.cards[1],'equip')=='equip'){num+=(1)};*///装备不再记为2强化点数
                        return [Math.max(2 - num, 0), Math.max(4 - num, 2)];
                    },
                    discard: false,
                    lose: false,
                    check: function (card) {//ui，参考仁德，ai执行判断，卡牌价值大于1就执行（只管卡片）当然，能把玩家设置进来就可以if玩家没桃 return-1。
                        var player = get.player();
                        if (ui.selected.cards.length && get.type(ui.selected.cards[0], 'equip') == 'equip') return 5 - get.value(card);
                        if (ui.selected.cards.length >= Math.max(1, player.countCards('h') / 2)) return 0;
                        if (game.phaseNumber < 3) return 7 - get.value(card);
                        return 3 - get.value(card);
                    },
                    content: function () {//choiceList.unshift
                        'step 0'
                        var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, exp1 = 0;
                        player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h, k];
                        exp1 = cards.length;
                        var choiceList = [];
                        var list = [];
                        //game.log(cards);
                        event.cao = cards;
                        //game.log(event.cao);
                        //exp1 = player.countMark('Expup1');
                        jieshao = ['后勤保障：上限+' + (a + 1) + '→' + (a + 2) + '远航（用一摸一）标记上限，<br>手牌少于手牌上限1/2时，失去手牌会摸一张牌。防守反击的保障<br>每轮上限1/2/3，在自己的回合重置使用次数。', '技能升级：+' + (b) + '→' + (b + 1) + '，重巡-降低必中攻击限制(杀/黑牌/任意牌)、轻巡-增加无效群体锦囊牌范围(1/2/3)、航母-降低万箭齐发限制(黑桃与梅花/黑桃与梅花与红桃/任意牌);<br>战列舰-增加防护范围(杀造成的伤害/杀和锦囊牌造成的伤害/所有伤害)，导驱-增加射程(2/3/4)、潜艇-降低雷杀条件(红桃/红桃或黑桃/红桃或黑桃或方块);<br>驱逐-增加回避概率(0.25/0.33/0.50)、军辅-增加存牌上限(1/2/3)。', '射程升级：+' + c + '→' + (c + 1) + '武器（出杀）攻击距离，<br>增加出杀范围，虽然不增加锦囊牌距离，但胜在永久', '速射炮管：+' + d + '→' + (d + 1) + '出杀次数，<br>作为连弩的临时替代，进行多刀输出。', '改良推进器：+' + e + '→' + (e + 1) + '武器（被杀）防御距离<br>对手有更远的出杀范围才能对你出杀时，但不能防御锦囊牌。', '物流运输：+' + f + '→' + (f + 1) + '手牌上限，且蝶舞递装备给杀的距离提升，<br>双方状态差距越大，保牌效果越强。', '经验：+' + h + '→' + (player.countMark('Expup1')) + '，将卡牌转为经验，供下次升级。（直接点确定也行）<br>1级技能需要两张牌才能强化，2级技能需要三张牌才能强化。<br>但无名杀不能读取这个界面的文本，导致四点经验即可强化两个不同等级技能']//player.getEquip(1)，定义空数组，push填充它，事件变量可以自定义名字，什么都可以存。game.log('已强化:',a+b+c+d);
                        var info = lib.skill._qianghuazhuang.getInfo(player);
                        //game.log(info);
                        if (info[0] < k && (info[0] + 2 <= info[7] + exp1) && info[0] <= 2) {
                            list.push('mopaiup');
                            choiceList.push(['mopaiup', jieshao[0]]);
                        };
                        if (info[1] < k && (info[1] + 2 <= info[7] + exp1) && info[1] <= 2 && !player.hasSkill("shixiangquanneng")) {
                            list.push('jinengup');
                            choiceList.push(['jinengup', jieshao[1]]);
                        };
                        if (info[2] < k && (info[2] + 2 <= info[7] + exp1) && info[2] <= 2) {
                            list.push('wuqiup');
                            choiceList.push(['wuqiup', jieshao[2]]);
                        };//若此值：你强化的比目标多时，+1含锦囊牌防御距离。
                        if (info[3] < k && (info[3] + 2 <= info[7] + exp1) && info[3] <= 2) {
                            list.push('useshaup');
                            choiceList.push(['useshaup', jieshao[3]]);
                        };
                        if (info[4] < k && (info[4] + 2 <= info[7] + exp1) && info[4] <= 2) {
                            list.push('jidongup');
                            choiceList.push(['jidongup', jieshao[4]]);
                        };
                        if (info[5] < k && (info[5] + 2 <= info[7] + exp1) && info[5] <= 2) {
                            list.push('shoupaiup');
                            choiceList.push(['shoupaiup', jieshao[5]]);
                        };
                        //      if(info[6]<k&&(info[0]+2<=info[7])&&info[6]<2){event.list.push('songpaiup');
                        //  event.choiceList.push('+'+g+'→'+(g+1)+'给牌次数，<br>提升“先进雷达”技能的送牌范围。');};
                        if (info[7] <= k && info[7] < 6) {
                            list.push('Expup');
                            choiceList.push(['Expup', jieshao[6]]);
                        };
                        //game.log(choiceList);
                        event.first = true;    //存了6个变量，可以导出为button，与textbutton样式，看需求
                        var xuanze = Math.max(Math.floor(event.cao.length / 2 + info[7]), 1);
                        //game.log("xuanze" + xuanze);
                        player.chooseButton([
                            '将手牌转化为强化点数强化以下能力；取消将返还卡牌，<br>未使用完的点数将保留，上限默认为1，发动建造技能后提高。',
                            [choiceList, 'textbutton'],
                        ]).set('filterButton', button => {
                            var event = _status.event;
                            if (ui.selected.buttons) {//for(var i=0;i<event.cao.length;i+=(1)){};测试失败的函数组合game.log(ui.selected.buttons,get.selectableButtons().includes(ui.selected.buttons),get.selectableButtons());游戏无名杀Button的限制，这个代码并没有起到实时计算的作用。
                                return true; //return xuanze >= player.countMark(ui.selected.buttons[0]) * 0.5 + 1;
                            }
                        }).set('ai', function (button) {
                            var haode = [jieshao[0], jieshao[1]]; var yingji = []; var tunpai = [jieshao[5]];//其实一个例子就行，不如直接if(){return 2;};
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
                        //game.log(result.links, result.bool)//只能返还这两个，所以更适合技能，更需要循环的方式进行计算。
                        if (!result.bool) { player.removeMark('Expup1', player.countMark('Expup1')); event.finish(); };//取消强化
                        if (result.bool) {  //player.addMark('Expup',event.cadechangdu);//先给经验再计算扣除经验升级，随着此项目的升级，花费也越多。通过一个有序的清单，遍历比对返回的内容，来定位要增加的标记/数组。
                            player.addMark('Expup', player.countMark('Expup1')); player.removeMark('Expup1', player.countMark('Expup1'));
                            for (var i = 0; i < result.links.length; i += (1)) { if (!result.links.includes('Expup')) { player.addMark(result.links[i], 1); player.removeMark('Expup', 1 + player.countMark(result.links[i])); game.log('数组识别:', result.links[i], '编号', i, '，总编号', result.links.length - 1); } }
                            player.discard(event.cao);
                        };
                        //    if(event.choiceList.length<event.cao){player.addMark('Expup',1);};从0开始，当介绍数组有内容==选项数组的内容（第i个），就加的简称数组第i个(内容)标签。并通过game.log()调试,在出牌记录中查看执行效果。result.links.includes(event.list[i])&&
                        'step 2'
                        var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1; game.log('结束', a, b, c, d, e, f, g, h, k);
                        player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h];
                    },
                    ai: {
                        order: function (player) { var player = get.player(); if (player.countMark('_jianzaochuan') < 3) { return 7 }; return 1 }, threaten: 0,
                        result: {
                            player: function (player) {
                                var player = get.player();
                                var num = player.countCards('h', { name: 'shan' }) - 1;
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
                        if ((event.nature && player != event.player) && event.num > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai')))
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
                            if (trigger.player.hujia > 0) {
                                trigger.num += (1);
                                game.log('冰杀/寒冰剑雷杀对护甲加伤' + 1)
                            };
                            game.log(get.translation(player.name) + '<span class=thundertext>减速了:</span>' + get.translation(trigger.player.name) + '小心随之而来的集火');
                            if (trigger.player.hp * 2 < trigger.player.maxHp) { player.$throwEmotion(trigger.player, 'wine') };
                        };

                        if (trigger.nature == 'thunder' && !player.hasSkill('hanbing_skill')) {
                            trigger.player.addSkill('_wulidebuff_jinshui'); trigger.player.addMark('_wulidebuff_jinshui', 1);
                            if ((trigger.player.hujia > 0 || trigger.player.hasSkillTag('maixie_defend')) && (!trigger.player.isLinked() || (trigger.player.isLinked() && link < 2 || trigger.num < 2))) {
                                trigger.player.loseHp(trigger.num);
                                game.log('雷杀穿透护甲:', trigger.num); trigger.num -= (trigger.num), trigger.cancel
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
                                    var player = get.player(); var tishi = '回合结束受到一点火焰伤害，摸两张牌（有护甲则不会触发摸牌），火杀带来的负面效果，本回合被攻击了' + player.countMark('_wulidebuff_ranshao') + '次，'; if (player.countMark('_wulidebuff_ranshao') > 0 && player.hp <= 2) { tishi += ('可能小命不保，求求队友给点力，发挥抽卡游戏的玄学力量。”') }; if (player.countMark('_wulidebuff_ranshao') > 2 && player.hp <= 2) { tishi += ('“被集火了，希望队友能能继续扛起重任。') }; if (player.identity == 'nei') { tishi += ('为了自己的光辉岁月，我内奸一定能苟住，一定要苟住') }; if (player.identity == 'zhu') { tishi += ('我的生命在燃烧，') }; if (player.identity == 'zho') { tishi += ('同志，救我，我被火力压制了。') }; if (player.identity == 'fan') { tishi += ('就怕火攻一大片啊，我们的大好前程被火杀打到功亏一篑') };
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
                        if ((get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai')) && !player.hasSkill('kaishimopao')) {
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
                        if ((get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'))) {
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
                };
            };
            if (config.tiaozhanbiaojiang) {//挑战技能，全局技能每一个人都有，所有人都受相同的一次触发条件触发此技能。
                lib.skill._tiaozhan3 = {
                    superCharlotte: true, usable: 1, silent: true,
                    trigger: { global: "useCardToPlayered", },
                    filter: function (event, player) { return (game.phaseNumber == 1); },
                    content: function () {
                        if (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai') {
                            if (!player.hasSkill('gzbuqu')) {
                                //game.log(player.identity)
                                player.addSkill('gzbuqu'); player.addSkill('tiaozhanzhuanbei'); player.useSkill('tiaozhanzhuanbei'); player.loseHp(player.hp - 1); player.draw(player.hp * 2 - 1);
                            };
                        };
                    },
                };
            };
            if (config.qyzhugeliang) { //开局休闲类技能。
                lib.skill._qyzhugeliang = {
                    trigger: { global: "phaseBefore", player: "enterGame", }, forced: true,
                    filter: function (event, player) { return (event.name != 'phase' || game.phaseNumber == 0) && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai')); },
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
                        //game.log(result.links, result.bool);//只能返还这两个，所以更适合技能，更需要循环的方式进行计算。
                        if (result.bool) {  //player.addMark('Expup',event.cadechangdu);//先给经验再计算         miki_binoculars smyyingshi  gwjingtian gushe tongxie jyzongshi reqiaoshui nlianji zhuandui reluoyi zhongji
                            if (result.bool != 'cancel2') {
                                game.log(); var targets = game.filterPlayer();
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
                trigger: { player: 'dieBegin', },
                priority: 2,
                forced: true,
                unique: true,
                frequent: true,
                filter: function (event, player) {
                    //game.log("死亡台词判断");
                    return true;
                },
                content: function () {
                    //game.log("死亡台词触发");
                    game.playAudio('..', 'extension', '舰R牌将/audio/die', trigger.player.name + ".mp3");
                    /*setTimeout(function () {
                        if (player.name2) {
                            game.playAudio('..', 'extension', '舰R牌将/audio/die', trigger.player.name + ".mp3");
                        }
                    }, 1500);*/

                },
            }//即将替换为:为character实例的dieAudio属性赋值，例如
            //*eg.* `lib.character.guanyu.dieAudios = [true, "ext:无名扩展/audio/die:true"]`
            //在Character的数组形式中填写任意个"die:xxx"。
            //*eg.* `guanyu: ["male", "shu", 4, ["wusheng"], ["die:true", "die:ext:无名扩展/audio/die:true"]]`


            //全局技能写在这上面
        },
        precontent: function (jianrjinji) {
            if (jianrjinji.enable) {
                //武将包,"qigong","qingnang"
                game.import('character', function () {
                    var jianrjinji = {
                        name: 'jianrjinji',//武将包命名（必填）
                        connect: true,//该武将包是否可以联机（必填）,"xianjinld""zhiyangai","baiyin_skill",
                        //全局技能"_yuanhang","_jianzaochuan","_qianghuazhuang",
                        characterSort: {
                            jianrjinji: {
                                jianrbiaozhun: ["liekexingdun", "qixichicheng", "wufenzhongchicheng", "qiye", "bisimai", "misuli", "weineituo", "lisailiu", "1913", "changmen", "kunxi", "ougengqi", "qingye", "beianpudun", "jiujinshan", "jiujinshan", "yixian", "tianlangxing", "dadianrendian", "yatelanda", "z31", "xuefeng", "kangfusi", "47project", "guzhuyizhichuixue", "shuileizhanduichuixue", "mingsike", "yinghuochong", "u1405", "baiyanjuren", "changchun"],
                                lishizhanyi_naerweike: ["shengwang", "z17", "z18", "z21", "z22", "gesakeren", "biaoqiang"],
                                lishizhanyi_matapanjiao: ["kewei", "shengqiaozhi", "luodeni", "boerzanuo", "jialibodi"],
                                lishizhanyi_danmaihaixia: ["hude", "shenluopujun", "weiershiqinwang", "z1", "z16"],
                                lishizhanyi_shanhuhai: ["lafei", "shiyu", "salemu", "dahuangfeng", "yuekecheng", "qiuyue", "weilianDbote", "xianghe", "ruihe", "yuhei"],
                                lishizhanyi_haixiafujizhan: ["u47", "u81", "u505", "jinqu", "kente"],
                                weijingzhizhi: ["jifu", "dujiaoshou", "sp_lafei", "getelan", "sp_aisaikesi", "sp_ninghai"],
                                cangqinghuanying: ["mist_dujiaoshou", "mist_xiawu"],
                            },

                        },
                        character: {
                            liekexingdun: ["female", "USN", 4, ["hangmucv", "hangkongzhanshuxianqu"], ["zhu", "des:　由列克星敦级战列巡洋舰改装而来。1927年服役之后同姐妹舰萨拉托加号多次参加美国海军的各种演习，为航母的使用和发展积累了大量经验。日军偷袭珍珠港时列克星敦号因正向威克岛运输飞机而躲过一劫。1942年的珊瑚海海战中，列克星敦号击沉击伤日军航母各一艘，但自身也被日本航母重创，后因损管不利，油气爆炸而沉没。"]],
                            qixichicheng: ["female", "IJN", 4, ["hangmucv", "qixi_cv"], ["zhu", "des:　原本是日本海军天城级战列巡洋舰2番舰，后因条约限制改建成为舰队航母。建成时拥有特别的三段飞行甲板，不过这个设计被证明并不实用。35年的大改装中拆除了这个不实用的设计，变为常见的全通飞行甲板。41年赤城号作为日军的旗舰参加了偷袭珍珠港。42年的中途岛海战中赤城号遭到企业号俯冲轰炸机的攻击，诱发了堆放的鱼雷和炸弹，次日由日军自沉。"]],
                            wufenzhongchicheng: ["female", "IJN", 4, ["hangmucv", "mingyundewufenzhong"], ["des:　原本是日本海军天城级战列巡洋舰2番舰，后因条约限制改建成为舰队航母。建成时拥有特别的三段飞行甲板，不过这个设计被证明并不实用。35年的大改装中拆除了这个不实用的设计，变为常见的全通飞行甲板。41年赤城号作为日军的旗舰参加了偷袭珍珠港。42年的中途岛海战中赤城号遭到企业号俯冲轰炸机的攻击，诱发了堆放的鱼雷和炸弹，次日由日军自沉。"]],
                            qiye: ["female", "USN", 4, ["hangmucv", "dajiaoduguibi", "dumuchenglin", "bigE"], ["des:　企业号是美国获得战斗之星最多的军舰，在42年的中途岛战役中，正是企业号的轰炸机摧毁了赤城、加贺以及飞龙。随后的圣克鲁斯海战中企业号被击伤，但企业号边修边走，放出的飞机空袭了比睿。在这次海战后，美军在太平洋上只剩下了企业号一艘舰队航母。这时期企业号挂起了一条史诗般的标语：企业单挑日本（Enterprise VS Japan）。在43年，企业号改造为最早搭载全天候战机的航母。莱特湾海战中，企业号是唯一对全部日本舰队都空袭过的航母。在击沉武藏号跟大和号的战斗中也有企业号的身影。"]],
                            bisimai: ["female", "KMS", 4, ["zhuangjiafh", "zhanliebb", "qijianshashou", "yongbuchenmodezhanjian"], ["zhu", "des:德国于30年代建造的俾斯麦级战列舰首舰，建成之后连英国首相也称赞其是出色的设计。服役之后41年俾斯麦号在欧根亲王号的护航下前出大西洋执行破交任务，在战斗中俾斯麦号击沉了前来拦截的英国胡德号、击伤了威尔士亲王号。之后英国集结大规模兵力围歼俾斯麦号，战斗中皇家方舟号航母的剑鱼击伤了俾斯麦号的船舵，大大影响了俾斯麦号的航行，之后俾斯麦号在英国舰队的围攻下沉没。"]],
                            misuli: ["female", "USN", 4, ["zhuangjiafh", "zhanliebb", "jueshengzhibing", "zhanfu"], ["des:密苏里是新锐衣阿华级战列舰的三号舰，衣阿华级沿用了南达级的防护设计，她装备了当时功率最大的动力系统，所以航速甚至比很多战巡还快。密苏里于45年才赶赴战场，并没有参加多少战斗，只是在45年3月被神风撞中一次，受损不大。让密苏里名垂青史的是日本投降签字仪式在她的甲板上举行，这代表了战争的正式结束。在冷战期间密苏里继续活跃，在80年代甚至重启并进行了导弹化改造，以符合现代海战的需要。91的海湾战争也是战列舰最后一次参加实战。在98年，密苏里作为纪念舰退役，她停泊在珍珠港，正前方正是亚利桑那博物馆，她们分别代表了战争的开始和结束。"]],
                            weineituo: ["female", "RM", 3, ["zhuangjiafh", "zhanliebb", "yishisheji"], ["des:维内托级是意大利的新锐战列舰。该级的整体设计十分出色，值得称道的是381mm主炮的部分威力指标可以达到406mm炮水平。防护设计上，船体采用了普列赛水下防护系统，装甲使用倾斜多层的剥被帽设计。二战中，她在41年的马塔潘角海战中被鱼雷击伤，之后因为缺油不再出动。意大利投降后维内托号疏散到了马耳他，途中还曾被德军的制导炸弹击伤。维内托号最终幸存到了战后。"]],
                            lisailiu: ["female", "MN", 4, ["zhuangjiafh", "zhanliebb", "kaixuan", "changge", "xiongjiaqibin"], ["des:黎塞留级是法国在30年代设计的新锐战列舰。该级依然沿袭敦刻尔克级的主炮全前置设计。40年，法国迅速战败，未完工的黎塞留号为了避免落入德军之手，于6月15日启航疏散到达喀尔。因惧怕处于流亡状态的六艘法国战列舰落入德国手中，英国舰队制定了名为“抛石机”的行动计划，对法国舰队进行了攻击。交火中黎塞留号被击伤，在此之后流亡非洲的法国舰队一直对战争局势持观望状态。42年黎塞留号同美国达成协议，加入同盟国作战。在美国进行改装后的黎塞留号参加了对日作战，并见证了二战的胜利。战后黎塞留号于1959年退役。"]],
                            changmen: ["female", "IJN", 4, ["zhuangjiafh", "zhanliebb", "zhudaojiandui"], ["des:她与妹妹都是高火力型日本战列舰的代表，被称为海军假日七巨头之一。她建成时就有高大的六脚桅楼，可看做是日式高塔舰桥的开端。二战开始后，太平洋战场的形势变为航空主导。一直到44年的莱特湾海战，她才得到了一线作战的机会：她所在的栗田编队抓到了美军护航航母编队，但是在美军的拼命反抗下日军没能取得多大的战果。回到本土的她在搁置中迎来了日本投降。美军缴获之后将她用作“十字路口计划”核试验的靶船，于1946年7月沉没。"]],
                            "1913": ["female", "ROCN", 4, ["zhuangjiafh", "zhanliebb", "jujianmengxiang"], ["zhu", "des:1913年时，为针对邻国的海军威胁，国民政府参谋部在海军造舰计划书中提出了颇为夸张的海军扩建计划，其中便包括大量的战列巡洋舰。该型战列巡洋所设想的性能参数为：排水量28000吨，装备10门14英寸火炮，航速29节左右。当然在那个穷困动荡的年代，海军意图获取主力舰无非是不切实际的妄想罢了……"]],
                            kunxi: ["female", "USN", 4, ["huokongld", "zhongxunca", "gaosusheji"], ["des:新奥尔良级重巡洋舰6号舰。新奥尔良级是北安普顿级的改良版本，增强了防护。战争爆发后，昆西号先是执行了在大西洋的岛屿巡逻任务，后于42年5月通过巴拿马运河来到太平洋战场。在萨沃岛海战中，昆西号击中了鸟海号的舰桥，但是之后昆西号被日军集火射击，最终不幸被鱼雷击沉。"]],
                            ougengqi: ["female", "KMS", 4, ["huokongld", "zhongxunca", "zhanxianfangyu"], ["des:希佩尔海军上将级重巡3号舰，有着不死鸟的绰号。相比前两艘，她的外形设计进行了一些改进。服役之后她同俾斯麦号一起行动参加了丹麦海峡海战，战斗结束后，她和俾斯麦号分头行动。俾斯麦号最终被击沉，而欧根亲王号则安全抵达法国。42年欧根亲王号同两艘沙恩霍斯特级执行了瑟布鲁斯行动，44年欧根亲王号在德军沿岸提供火力支援。战败后，欧根亲王号被赔偿给美国，在经历核试验和海洋风暴后，于拖拽过程中沉没。"]],
                            qingye: ["female", "IJN", 4, ["huokongld", "zhongxunca", "sawohaizhan", "qingyeqingyeqing"], ["des:青叶型本属古鹰型的后续，但是由于修改了设计，所以这二艘被单独列为青叶型。在37年，青叶型进行了大规模改装。战争中青叶型和古鹰型编入同一部队作战，42年10月的海战中，青叶号将美军误认为友军，对美军打出“我是青叶”的信号，遭到了美军射击，在友舰的掩护下青叶号幸运逃脱，然而古鹰号却因此沉没。青叶号在44年遭到了潜艇袭击，返回日本修理之后不再出动，在坐沉中迎来了日本战败。"]],
                            beianpudun: ["female", "USN", 4, ["huokongld", "zhongxunca", "huhangyuanhu"], ["des:北安普顿级是美国最早重巡彭萨科拉号的改进版本。在战争爆发后，北安普顿号参加了针对日军的报复性反击，这些反击行动极大鼓舞了美国的士气。北安普顿号主要被用于航母护航，在圣克鲁斯海战中，北安普顿号一度试图拖带受创的大黄蜂号，但由于日军不断的攻击而被迫放弃。在塔萨法隆加海战中北安普顿号被日军鱼雷击中沉没，由于损管和撤退有序，大部分舰员得以幸存。"]],
                            jiujinshan: ["female", "USN", 4, ["huokongld", "zhongxunca", "jiujingzhanzhen"], ["des:旧金山号重巡洋舰属新奥尔良级重巡洋舰，和昆西等舰同级。旧金山号重巡洋舰作为旗舰参加了埃斯佩恩斯角海战。在第一次瓜岛海战中，旧金山依然担任舰队旗舰，尽管舰队指挥官牺牲，舰队损失较大，但是依然完成了拦截日军编队的任务，并重创比叡，导致其最终沉没。旧金山打满了战争全程，并获得了总统集体嘉奖。她17颗战役之星的获得数量仅次于企业和圣地亚哥。"]],
                            yixian: ["female", "ROCN", 3, ["fangkong2", "qingxuncl", "shizhibuyu"], ["des:逸仙号是30年代中国自行设计建造的一艘巡洋舰。该舰从规格上讲只相当于列强的大型炮舰。抗战中，在宁海级相继殉国后逸仙号接替担任旗舰，在缺乏高射弹药的情况下，她曾经用前部150毫米主炮击落日本飞机。逸仙号最终不幸殉国，然而日本将其打捞修理使用，并一直幸存到了1945年。在抗战胜利后，这艘军舰又回归了中国，一直使用到了60年代。"]],
                            tianlangxing: ["female", "RN", 3, ["fangkong2", "qingxuncl", "duomianshou"], ["des:属于黛朵级防空巡洋舰第二批，相比四座主炮的黛朵级第一批，第二批加强到了五座高平两用主炮，防空能力有所提升。天狼星完工后加入地中海舰队，参与了火炬行动，并见证了轴心国在北非投降，之后在地中海执行封锁任务。44年参与了诺曼底的支援行动，天狼星号在战后继续服役到了56年。"]],
                            dadianrendian: ["female", "IJN", 3, ["fangkong2", "qingxuncl", "jilizhixin"], ["des:丙型巡洋舰设计要求有着很强的侦察和通讯能力。在早期的设计中，巡洋舰W105搭载有两座弹射器，全部集中在后部。舰载机除了机库外，两架系留于弹射器上。在W105阶段，丙型巡洋舰也并未强调对海火力，主要武器以127高炮为主。虽然一度考虑过鱼雷装备，但最终取消这个要求。W105案提交后，又增加了对海火力要求，安装之前巡洋舰拆下来的三联155主炮，这个设计最终演变为正式的丙型巡洋舰。"]],
                            //degelasi: ["female", "MN", 3, ["fangkong2", "qingxuncl"], ["des:。"]],
                            yatelanda: ["female", "USN", 3, ["fangkong2", "qingxuncl", "duikongfangyu"], ["des:　30年代末期设计的一级轻巡洋舰，最大特点是主炮数量极多，共安装了八座双联5吋炮。亚特兰大级初衷是作为驱逐舰旗舰使用，后来发现这种设计亦适合作为防空舰使用。战争中亚特兰大号护卫大黄蜂号参加了中途岛海战，战役结束后又参加了惨烈的瓜岛战役。1942年10月参加了圣克鲁斯海战，11月在瓜岛以北的海战中，亚特兰大号被日本晓号驱逐舰的鱼雷击中，13日被放弃。"]],
                            "z31": ["female", "KMS", 3, ["dajiaoduguibi", "quzhudd", "Z_qianghua", "Zqujingying"], ["des:1936年AM型驱逐舰首舰，该级建造于战争爆发后，相比1936A型改动很少。该舰装备150毫米主炮，强于一般驱逐舰。Z-31主要参与海峡和北欧的战斗，幸存到了战后并赔偿给法国。"]],
                            xuefeng: ["female", "IJN", 3, ["dajiaoduguibi", "quzhudd", "xiangrui", "yumian"], ["des:雪风号是日本名气最大的驱逐舰，出名的原因是她玄幻般的运气。雪风号参加了日军几乎所有恶战：包括中途岛，瓜岛战役，莱特湾海战和菊水特攻等，也曾为金刚号，大和号，信浓号等大舰护航。神奇的是不管战况多激烈，同行的军舰损失多惨重，但是雪风号却屡屡无损生还，连中破都不曾有过。战争结束后，美国抽到雪风作为赔偿，但是却转交给了民国，改名为丹阳号。三年后，丹阳随校长一起撤到了台湾。作为台湾少有的可用大舰，台湾时期的丹阳还进行了美式装备改装，一直服役到60年代。"]],
                            kangfusi: ["female", "USN", 3, ["dajiaoduguibi", "quzhudd", "31jiezhongdui"], ["des:康弗斯属弗莱彻级驱逐舰，她也是著名的第23驱逐舰中队的一员，该中队在圣乔治角海战等一系列战斗中表现出色，指挥官阿利伯克也因此有着31节伯克的外号。康弗斯参加了后期的诸多重大战役，曾救援了遭遇神风的友军。战争胜利后整个中队被授予总统集体嘉奖，康弗斯于59年转交西班牙海军。"]],
                            "47project": ["female", "ΒΜΦCCCP", 3, ["dajiaoduguibi", "quzhudd", "xinqidian"], ["des:　海军计划的一级大型驱逐舰，与传统驱逐舰不同的是她设计有装甲带与舰载机，由于工业不足与设计指标过高，47工程修改设计后才具备可行性，但战争爆发打断了建造。战后47工程修改了设计，并且延续到41型驱逐舰不惧号上。"]],
                            guzhuyizhichuixue: ["female", "IJN", 3, ["dajiaoduguibi", "quzhudd", "guzhuyizhi"], ["des:吹雪型特型驱逐舰首舰，相比之前的老式驱逐舰，该型是一种新式设计，采用艏楼船型和连装主炮，特型驱逐舰也奠定了之后日本驱逐舰特征基础。吹雪号在第四舰队事件后进行了改装，以克服重心和强度问题。战争开始后在马来海域作战，42年1月海战中协同击沉了英国驱逐舰珊耐特号。1942年10月的萨沃岛海战中被美军击沉。"]],
                            shuileizhanduichuixue: ["female", "IJN", 3, ["dajiaoduguibi", "quzhudd", "shuileizhandui",], ["des:吹雪型特型驱逐舰首舰，相比之前的老式驱逐舰，该型是一种新式设计，采用艏楼船型和连装主炮，特型驱逐舰也奠定了之后日本驱逐舰特征基础。吹雪号在第四舰队事件后进行了改装，以克服重心和强度问题。战争开始后在马来海域作战，42年1月海战中协同击沉了英国驱逐舰珊耐特号。1942年10月的萨沃岛海战中被美军击沉。"]],
                            mingsike: ["female", "ΒΜΦCCCP", 3, ["dajiaoduguibi", "quzhudd", "manchangzhanyi"], ["des:明斯克级驱逐舰是之前列宁格勒级的完善型，除了稳定质量和设计外，基本保留了列宁格勒级的设计。明斯克号驱逐舰在战争期间主要执行对岸火力支援任务，曾经被敌机炸沉，但是在之后又浮起并修复。战争胜利后明斯克改为训练舰使用。"]],
                            yinghuochong: ["female", "RN", 3, ["dajiaoduguibi", "quzhudd", "zhongzhuangcike", "wuweizhuangji"], ["des:G级驱逐舰之一，G级于30年代后期建造了24艘，主炮为四座单装主炮。40年她参加了挪威战役，4月8日萤火虫号与德军希佩尔海军上将号重巡洋舰遭遇，在激烈的战斗中萤火虫号释放烟雾并发射鱼雷，最终借助烟雾掩护猛烈撞击了希佩尔海军上将号，造成希佩尔海军上将号500吨进水，而萤火虫号也因为这次英勇的战斗而沉没。"]],
                            "u1405": ["female", "KMS", 3, ["qianting", "qianxingtuxi"], ["des:由于普通潜艇水下动力受电池性能限制，德国海军考虑研发一种不依赖空气的高效水下动力系统。U-1405的动力系统采用使用过氧化氢的瓦尔特发动机，这种动力可以在水下运行，并且能让潜艇在水下达到超过20节的高速。不过发动机的缺陷是自带燃料用光后，潜艇就失去动力。U-1405是作为实战目的建造的瓦尔特潜艇，其吨位只有400吨左右。虽然是实战型号，但是她只参与了训练和实验。"]],
                            baiyanjuren: ["female", "RN", 3, ["junfu", "hangkongzhanshuguang"], ["des:百眼巨人号航母是世界上第一级全通甲板的航空母舰。在飞机运用到海战中之后，为了加强飞机的运用能力，英国人便改装了一些军舰以搭载飞机，经过经验的积累，英国人改装了百眼巨人号航母，使用了全通的飞行甲板。百眼巨人号没有赶上一战，在二战中主要执行训练任务。"]],
                            changchun: ["female", "PLAN", 3, ["daoqu", "sidajingang"], ["des:　苏联愤怒级驱逐舰17号舰，苏联建造的愤怒级借鉴了意大利的设计经验。前后背负式布置了4门130毫米舰炮。由于苏联对德国战争中，海战并不是主战场，因此果敢号主要执行护航任务。果敢号参加了二战并幸存下来，战后在1955年被出售给新中国海军，改名为长春号，90年退役后保存在山东乳山市。"]],

                            "u47": ["female", "KMS", 3, ["qianting", "u47_xinbiao", "u47_huxi"], ["des:U-47号是德军的一艘王牌潜艇，属VIIB型。1939年10月她大胆穿越了斯卡帕湾的封锁线，潜入英国海军的基地内，当晚用鱼雷击沉了英国皇家橡树号战列舰。回到港口后U-47号受到了热烈的欢迎，并被授予了骑士十字勋章。在随后的战斗巡航中，U-47号总共击沉了16万吨的船只。1941年3月7日的第九次战斗巡航中U-47号失踪，至今没有其下落和定论。"]],
                            "u81": ["female", "KMS", 3, ["qianting", "u81_langben", "u81_zonglie", "u81_xunyi"], ["des:U-81号潜艇最著名的战例发生在1941年的地中海。当时皇家方舟号航母从马耳他驶出后，遭到了U-81的雷击，尽管U-81只命中了皇家方舟号一枚鱼雷，但是处置不当导致这艘在追歼俾斯麦中立下功劳的航母最终沉没。此后的U-81在破交作战中击沉了不少商船。1944年1月，U-81遭到空袭沉没。"]],
                            "z1": ["female", "KMS", 3, ["dajiaoduguibi", "quzhudd", "Z", "z1_Zqulingjian"], ["des:1934型舰队驱逐舰首舰。德国突破条约之后开始建造大型驱逐舰，吨位比他国驱逐舰都略大一些，装备5门单装127毫米炮。由于高温锅炉的技术问题，她动力系统稳定性不高。Z1号（莱伯勒希特·马斯号）的服役生涯很短暂，1939年执行了布雷任务，在1940年破交战中遭到己方HE111轰炸机误击沉没。"]],
                            "z16": ["female", "KMS", 3, ["dajiaoduguibi", "quzhudd", "Z", "z16_lianhuanbaopo", "z16_shuileibuzhi"], ["des:1934A型驱逐舰11号舰，1934A是1934的改良型，改进了适航性与动力系统设计。Z16号（弗里德里希·埃科尔特号）开战之后主要执行对英国的布雷任务。在巴伦支海海战中被英国轻巡洋舰谢菲尔德号击沉。"]],
                            "z18": ["female", "KMS", 3, ["dajiaoduguibi", "quzhudd", "z18_weisebaoxingdong"], ["des:德国1936型驱逐舰六艘都参加了挪威战役，并在战役中损失了五艘。Z18（汉斯·吕德曼）在纳尔维克海战中被击伤，之后在海岸搁浅。"]],
                            "z17": ["female", "KMS", 3, ["dajiaoduguibi", "quzhudd", "z17_naerweikejingjie"], ["des:　德国1936型驱逐舰总体上加大了吨位，改善了舰艏设计以提高适航性。Z17（迪特尔·冯·勒德尔）号驱逐舰在纳尔维克海战中击伤了哥萨克人号，最终被英军击沉。"]],
                            "z21": ["female", "KMS", 3, ["dajiaoduguibi", "quzhudd", "z21_tuxi"], ["des:1936型驱逐舰5号舰，1936年型是是1934型的放大改良型，表现出了不俗的性能，可以与英国部族级对攻而不落下风。Z21号（威廉·海德坎姆号）于1939年服役，1940年参与了攻击北欧行动，并占领了纳尔维克，之后英军驱逐舰突袭了港内的德国驱逐舰，旗舰Z21号遭到英军厌战号战列舰的炮击沉没。"]],
                            "z22": ["female", "KMS", 3, ["dajiaoduguibi", "quzhudd", "z22_tuxixiawan"], ["des:1936型驱逐舰6号舰。1940年6艘1936型驱逐舰都参加了攻击北欧行动，在纳尔维克海战中，Z22号（安东·施米特号）被英国海军击沉，而这次海战中，参战的6艘1936型全部被击沉。"]],
                            kewei: ["female", "RN", 4, ["hangmucv", "matapanjiaozhijian", "zhongbangtuxi"], ["des:      装甲航母可畏号在地中海战场有着出色的表现，在马塔潘角海战中，可畏出色的航空掩护有力支援了英国舰队的作战，她的鱼雷机击伤了维内托和意大利巡洋舰，直接助攻了厌战等主力舰的战绩。尽管在克里特战役期间可畏号遭到轰炸，但由于防护出色，可畏号并未战沉。在战争末期的太平洋战场，受到神风攻击的可畏号受损程度也明显小于美式航母，证明了自身设计的价值。可畏号在战争胜利后，于47年退役。"]],
                            hude: ["female", "RN", 4, ["zhuangjiafh", "zhanliebb", "huangjiahaijunderongyao", "huangjiaxunyou", "tianshi"], ["zhu", "des:      英国史上最著名的战列巡洋舰。在20至30年代，胡德号长期作为英国海军的象征，频繁出访世界各地。胡德号在40年参与了针对投降后法国舰队的抛石机行动，重创了法国海军。41年的海战中，胡德号同威尔士亲王号一同拦截俾斯麦号和欧根亲王号。"]],
                            gesakeren: ["female", "RN", 3, ["dajiaoduguibi", "quzhudd", "tiaobangzuozhan"], ["des:部族级驱逐舰的4号舰，该级驱逐舰是最著名的英国驱逐舰。哥萨克人号参加了第二次纳尔维克海战，痛击了德军驱逐舰。41年参与过围歼俾斯麦号的行动。1941年10月哥萨克人号被德军潜艇击沉。"]],
                            kente: ["female", "RN", 3, ["huokongld", "zhongxunca", "guochuan", "baixiang"], ["des:该舰为肯特级重巡洋舰首舰，由于防护薄弱，经常被戏称为“白象”。肯特号于20年代服役，初期水线装甲带只有25.4毫米。在30年代末期，肯特号和其余重巡都进行了改装，加强了防护。肯特号在二战中参加了围捕斯佩伯爵海军上将号的战斗，1940年在地中海被击伤，回到本土修理时加装了大量雷达设备。1941年年末肯特号搭载外交官前往苏联会见总书记。肯特号平安的度过了战争，于1948年退役。"]],
                            shengwang: ["female", "RN", 4, ["zhuangjiafh", "zhanliebb", "zuihouderongyao", "29jienaerxun"], ["des:声望级战列巡洋舰首舰。声望级追求高航速而防护不足，在30年代的改装中，声望级重点加强了装甲防护。在战争开始前进行了更彻底的改装，更新了舰桥和防空火力。战争爆发后声望号参加挪威战役，在韦斯特湾海战中声望号利用有利条件单舰击退了两艘沙恩霍斯特级。1941年参与了围歼俾斯麦号行动，后长期担任直布罗陀H舰队旗舰，并幸存到战后，也是英国三艘战巡中唯一幸存到战后的。"]],
                            shenluopujun: ["female", "RN", 4, ["huokongld", "zhongxunca", "hongseqiangwei"], ["des:什罗普郡是伦敦级重巡洋舰四号舰。在战争早期，什罗普郡主要执行护航与武装巡逻任务。在萨沃岛海战中，原澳海军堪培拉号重巡洋舰战沉。皇家海军将什罗普郡转交澳海军顶替堪培拉号巡洋舰的战损。什罗普郡参加了太平洋战场诸多战役，在苏里高海战中与盟军一道截击了来袭战列舰。在战争胜利时，什罗普郡参加了签字仪式。"]],
                            lafei: ["female", "USN", 4, ["dajiaoduguibi", "quzhudd", "bujushenfeng"], ["des:艾伦·萨姆纳级拉菲号驱逐舰（DD724）的舰名继承自一艘英雄军舰，前代拉菲号曾经在所罗门海战中勇敢地挑战日军的比睿号战列舰。而这一代拉菲也毫不逊色。在冲绳战役期间，她执行雷达哨舰任务时在短时间内遭到了约五十架神风飞机的攻击，被直接撞击六架，命中四弹。但是拉菲坚持战斗，舰长拒绝弃舰并率舰返回了关岛。这是战争史上的一个奇迹，而这艘坚毅的驱逐舰一直服役到了冷战时期。75年退役后成为了博物馆。"]],
                            sp_lafei: ["female", "USN", 3, ["dajiaoduguibi", "quzhudd", "shenfeng", "buju", "qiangyun", "yuanjun"], ["des:艾伦·萨姆纳级拉菲号驱逐舰（DD724）的舰名继承自一艘英雄军舰，前代拉菲号曾经在所罗门海战中勇敢地挑战日军的比睿号战列舰。而这一代拉菲也毫不逊色。在冲绳战役期间，她执行雷达哨舰任务时在短时间内遭到了约五十架神风飞机的攻击，被直接撞击六架，命中四弹。但是拉菲坚持战斗，舰长拒绝弃舰并率舰返回了关岛。这是战争史上的一个奇迹，而这艘坚毅的驱逐舰一直服役到了冷战时期。75年退役后成为了博物馆。"]],
                            salemu: ["female", "USN", 4, ["huokongld", "zhongxunca", "jingruizhuangbei"], ["des:新奥尔良级重巡洋舰6号舰。新奥尔良级是北安普顿级的改良版本，增强了防护。战争爆发后，昆西号先是执行了在大西洋的岛屿巡逻任务，后于42年5月通过巴拿马运河来到太平洋战场。在萨沃岛海战中，昆西号击中了鸟海号的舰桥，但是之后昆西号被日军集火射击，最终不幸被鱼雷击沉。"]],
                            "u505": ["female", "KMS", 3, ["qianting", "dananbusi", "houfu"], ["des:该艇属IX-C型潜艇，于42年建成，她在德军服役生涯中一共击沉了8艘总计4万吨的盟军船只。让U-505成名的事件发生在44年6月。当时U-505被美军的反潜编队发现并击伤，鉴于形势，艇员浮出水面并弃艇。这艘潜艇之后被美军俘获并进行了抢修运回本土，上面的一些发报机和密码本被盟军获得。至今这个特别的战利品依然在美国的博物馆中对外展出，这也是唯一存世的IX-C型潜艇。"]],
                            jialifuniya: ["female", "USN", 4, ["zhanliebb", "zhuangjiafh", "zhanliexianfuchou"], ["des:田纳西级2号舰，在20年代的年度大演习中，她表现优秀。1940年成为美军最早装备CXAM雷达的几艘军舰之一。在日军偷袭珍珠港中加利福尼亚号被重创，一直到1944年才修复完毕重返战场，修复的同时加利福尼亚号也进行了性能上的改装。苏里高海战中，加利福尼亚号同其余在珍珠港受难的姐妹一道，用战舰的方式完成了对日军的复仇。"]],
                            jifu: ["female", "ΒΜΦCCCP", 2, ["quzhudd", "dajiaoduguibi", "jifu_weicheng", "jifu_yuanjing", "jifu_lingwei", "jifu_yuanqin", "jifu_yuanqin"], ["des:基辅是苏联海军大舰队计划中的一环，她的设计吸取了塔什干和列宁格勒等驱逐舰的技术，同时航速和火力也保持了非常强的水平。尽管基辅在战前已经开工，但还是因为战况的影响而停工。在战争末期，未完工的基辅被拖回船厂，并修改了设计准备继续建造，但由于相比战后的新驱逐舰设计优势不大，所以并没有最终建造完成。"]],
                            yi25: ["female", "IJN", 3, ["qianting", "liaowangtai"], ["des:　该舰于1939年开工，1941年10月服役，其超过3000吨的大排水量允许携带更多设备，包括一架零式小型水侦，以及一门被广为使用的14cm甲板炮。该舰自太平洋战争起便执行了多次巡航任务，如在战争初期于美国西海岸的军事行动，以及在次年9月大胆地炮击及空袭了美国本土目标。该舰在近3年的巡逻任务中屡次取得瞩目战绩，直至1943年9月在圣埃斯皮里图岛东北侧240km外的海域，被多艘美国驱逐舰围剿战沉。"]],
                            shiyu: ["female", "IJN", 3, ["dajiaoduguibi", "quzhudd", "jishiyu", "jishiyu1"], ["des:她在海军中以幸运而著名，参加过多次激烈海战都能最终幸存下来。在激烈的苏里高海战和维拉湾海战中，她都是编队中唯一的幸存。不过到45年，她还是被一艘潜艇击中沉没。"]],
                            dujiaoshou: ["female", "RN", 3, ["junfu", "xiuqi", "wanbei"], ["des:30年代英国设计了一级飞机修理舰，以修理航母部队载机，由于要求修复的飞机可以直接起飞，索性将她设计成了航母的结构，可当成航母使用。独角兽号于1942年完工，初期主要被当作航母使用，在地中海执行支援任务。1943年年末起，独角兽号加入太平洋战场作为航母支援舰使用，在冲绳战役期间修复了大量飞机。冷战时期独角兽号还参加了朝鲜战争，最终于50年代退役。"]],
                            jiate: ["female", "USN", 3, ["fangqu", "mbmeibu"], ["des:基林级驱逐舰之一，由于服役太晚没有参加二战的实战。服役之后主要在大西洋活动。在1955年基阿特进行了改装，成为世界上第一艘导弹驱逐舰，其换装了双联防空导弹发射架，76毫米高炮和反潜鱼雷。在1957年为了显示其地位，刷上了DDG-1的编号。这艘划时代的军舰于1968年退役。"]],
                            getelan: ["female", "OTHER", 3, ["mujizhengren", "pingduzhanhuo", "shixiangquanneng"], ["des:出于海防和海军航空的需求，瑞典设计建造了这一级航空巡洋舰。尽管吨位在5000吨左右，但是哥特兰的装备齐全，载机量也达到了6-8架。哥特兰也是最早的航空巡洋舰，之后的类似军舰或多或少均受其影响。哥特兰漫长的服役期中最著名的事迹是发现了俾斯麦和欧根的编队。而在这之前英海军正在满世界找她们。"]],
                            rangbaer: ["female", "MN", 4, ["zhanliebb", "zhuangjiafh", "pangguanzhe"], ["des:让巴尔号战列舰是黎塞留级2号舰。在陆地战场失利时，黎塞留接近完工并撤退到海外，而让巴尔仅完成了一座炮塔，且具备航行能力，撤退到了达喀尔。在停泊期间，她还受到了马萨诸塞炮击和突击者的轰炸。两舰在后来都加入盟军作战，但由于让巴尔完工程度不高，并未参加战斗。在战争胜利后，考虑到战列舰巨大的象征意义，让巴尔以战列舰状态建造完工。她的电子设备和防空能力比黎塞留更强，船体也修改了设计，有更好的水下防护系统。在运河冲突中，让巴尔也曾开火支援。"]],
                            dafeng: ["female", "IJN", 4, ["hangmucv", "chuansuohongzha", "hangkongyazhi"], ["des:　大凤号是日本设计建造的装甲航空母舰。与其它日本海军航空母舰不同的是，大凤号预备在舰队中承担起支援其他航母作战的功能，因此大凤号将船舰的防护性摆在首位，重点增强装甲。竣工后被编入第三舰队第一航空战队，担任旗舰参加了马里亚纳海战。6月19日，大凤号在飞机起飞作业时，被美国潜艇大青花鱼号发射鱼雷并命中其右舷，最终因损管不当而沉没。"]],
                            dahuangfeng: ["female", "USN", 4, ["hangmucv", "yuanyangpoxi"], ["des:　　大黄蜂号是约克城级航母3号舰。她服役后第一项作战任务就是搭载B25轰炸机轰炸东京。在4月18日，杜立特带领的B25机群从大黄蜂号上起飞，完成了轰炸任务并在中国迫降。5月中旬，大黄蜂号在内的全部约克级航母作为主力参加了中途岛海战并击溃了日本机动部队，可以说正是她们三位扭转了太平洋的局势。在42年10月的圣克鲁斯海战中，大黄蜂号击伤了翔鹤号和筑摩号，但是自身也被重创，之后被驱逐舰击沉。"]],
                            biaoqiang: ["female", "RN", 14, ["dajiaoduguibi", "quzhudd", "juejingfengsheng"], ["des:　标枪级驱逐舰首舰。英国于部族级之后建造的驱逐舰，其设计也成为战时应急驱逐舰的范本。二战中标枪号参加了纳尔维克海战，战斗中标枪号被德国驱逐舰击伤了船首。修复之后主要在地中海作战，并于1949年退役。"]],
                            yuekecheng: ["female", "USN", 4, ["hangmucv", "saqijian", "fangkong"], ["des:　　约克城级是美国二战前期的主力航母，她的设计吸取了之前级别的经验，布局更加合理。约克城号同列克星敦号一起参加了珊瑚海海战，在海战中被击伤。因为前线急需航母应对中途岛战事，在短短72小时内她就修复完毕。中途岛战役中，三艘约克城级航母联手将日军最精锐的航母部队歼灭，但约克城号自己也被飞龙号两波攻击击伤，最后被I168号潜艇击沉。值得一提的是著名的萨奇少校当时就在约克城号上，他发明的萨奇剪战术使得美军战机可以发挥优势对付零战。"]],
                            shengqiaozhi: ["female", "RN", 4, ["zhuangjiafh", "zhanliebb", "jupaohuoli"], ["des:针对日德兰和之前经验设计的皇家海军新式战列舰N3型。和之前战舰不同，该级战列舰在设计上有很多创新，圣乔治采用了独特的前中置主炮塔布局。优点是可以缩短主装甲带，集中更多的防护在武器系统。圣乔治的主炮也远大于之前的战列舰，达到了18英寸。由于华盛顿条约的签订，明显超出规格的N3型战列舰受到限制，圣乔治从未完工。"]],
                            weiershiqinwang: ["female", "RN", 4, ["zhuangjiafh", "zhanliebb", "guanjianyiji"], ["des:英王乔治五世级2号舰。服役之后同胡德号一同参与了截击俾斯麦号的战斗，在战斗中被击伤撤退，不过她也击伤了俾斯麦号的油舱。修复之后威尔士亲王号搭载英国首相与美国总统进行了会晤，之后双方发表了著名的《大西洋宪章》。41年年末，威尔士亲王号编入Z舰队被派往远东对日本作战，在海战中包括反击号与威尔士亲王号在内的Z舰队被日本空袭击沉。"]],
                            qiuyue: ["female", "IJN", 3, ["dajiaoduguibi", "quzhudd", "duikongzhiwei",], ["des:　秋月型是日本少有的以护卫和对空为任务的驱逐舰，为了区别雷击用的甲驱而被称做乙驱，主炮使用100毫米双联高炮。秋月号建成后主要伴随航母提供防空掩护，经历了马里亚纳海战，目睹了日本航母部队的失败。同年10月在恩加诺海战中被美军飞机炸沉。"]],
                            luodeni: ["female", "RN", 4, ["zhuangjiafh", "zhanliebb", "bigseven"], ["des:　纳尔逊级2号舰，于1927年服役。罗德尼号同纳尔逊号、科罗拉多级、长门级一起被称为海军假日七巨头。二战爆发后罗德尼号参与了围歼击沉俾斯麦号的最后战斗，之后由于航速较慢，主要执行护航和支援任务。43年参与了在地中海的一系列作战，44年罗德尼号参与了支援诺曼底的行动，战后退役拆解。"]],
                            weilianDbote: ["female", "USN", 3, ["dajiaoduguibi", "quzhudd", "saobaxing", "shaojie"], ["des:　这是一艘有着戏剧性经历的驱逐舰，在43年为总统座舰衣阿华号护航时她不慎对衣阿华号发射鱼雷，幸好衣阿华号躲避及时，没有造成更大后果。在冲绳战役中，她担任危险的雷达哨舰时被神风攻击撞中，整个船体都被抬离水面并最终沉没，但是幸运的是在过程中没有一名船员牺牲。"]],
                            xianghe: ["female", "IJN", 4, ["hangmucv", "beihaidandang"], ["des:　翔鹤型是日本退出条约后建造的舰队航母，由于不再受条约限制，所以她的设计比之前的日本航母更加成熟。1941年8月翔鹤竣工，同一个月后完工的瑞鹤号编为第五航空战队，一起参加了12月的偷袭珍珠港。1942年两舰参加了珊瑚海海战，海战中翔鹤号被重创，因此错过了中途岛海战，在之后的战争中作为主力鏖战在南太平洋。44年6月的阿号作战中，翔鹤号被美国潜艇棘鳍号命中四发。由于损管得力，一度控制了进水，但最终油气爆炸而沉没。"]],
                            ruihe: ["female", "IJN", 4, ["hangmucv", "xingyundeyunyuqu"], ["des:　翔鹤型航母2番舰，41年9月服役后编入第五航空战队参加了偷袭珍珠港。在珊瑚海海战中，瑞鹤号凭借雨云躲开了美军的空袭，而翔鹤号被美军命中受创。两舰因此错过了中途岛战役。后来翔鹤号和瑞鹤号编为一航战参加了圣克鲁斯海战，这也是日本最后一次航母的战术胜利。在44年6月的阿号作战中，大凤号被击沉，瑞鹤号顶替其成为旗舰。10月，恩加诺海战中，编入诱饵舰队的瑞鹤号被CV16列克星敦号（又称：蓝色幽灵）的舰载机所击沉。"]],
                            yuhei: ["female", "IJN", 4, ["huokongld", "zhongxunca", "diwuzhandui"], ["des:她是该级重巡洋舰的三号舰。装备五座双联主炮。在该级相继完工后，她们被编为第5战队。在战前时期，本舰及其姐妹舰均经过了数次改造以提升性能。在战争爆发后，第5战队随队参与了南方作战。爪哇海战中本舰及其舰队击沉盟军德·鲁伊特等军舰。在43年的奥古斯塔皇后湾海战中曾同美国巡洋舰交手。莱特湾海战中羽黑一度受损，并且并未返回本土，受损一直没有彻底修复。在45年的一次运输任务中，遭遇索玛雷兹等英国驱逐舰，最终被维纳斯号驱逐舰击沉。"]],
                            jinqu: ["female", "RN", 3, ["fangkong2", "qingxuncl", "bisikaiwanshoulie"], ["des:进取号是翡翠级2号舰，其舰首采用连装主炮取代了之前的单装主炮，这种连装炮设计也被后来的英国巡洋舰沿用。战争中进取号主要执行搜捕德国袭击舰的任务，43年在比斯开湾的战斗中她曾经重创德国舰艇。同翡翠号一样，进取号也参加了对诺曼底的支援任务，战争胜利后进取号于46年退役。"]],
                            sp_aisaikesi: ["female", "USN", 4, ["hangmucv", "maliyanaliehuoji"], ["des:埃塞克斯级舰队航母设计上汲取了此前诸多级别航母的经验，使其性能达到了一个全新的高度。美国参战后，其惊人的工业机器全力开动，埃塞克斯号在42年12月服役。这一量产舰队航母开始如下饺子般陆续下水。埃塞克斯级是美国二战后期的主力航母。马里亚纳海战中埃塞克斯号在内的美国航母将日军航母部队彻底击溃，奠定了战争的走向。冲绳战役中，她参加了对大和号的围攻。东京湾，她见证了战争的胜利。在冷战中经过改造的埃塞克斯号也继续活跃，一直到69年才退役。"]],
                            boerzhanuo: ["female", "RM", 4, ["shixiangquanneng", "tebiekongxi"], ["des:波尔扎诺号是意大利建造的第3级重巡洋舰，前者分别是高航速轻防护的塔兰托级和重防护的扎拉级。波尔扎诺保持了高航速，并一定程度加强了防护。在战争期间，虽然波尔扎诺参加了历次重大海战，但都没有出色表现，反倒两次被潜艇击伤，波尔扎诺受伤后，有过改造为航空巡洋舰的计划。但随着意大利的停战，波尔扎诺落入德方，于44年被英军击沉。"]],
                            jialibodi: ["female", "RM", 4, ["qingxuncl", "fangkong2", "beijixingweishe"], ["des:加里波第是阿布鲁奇公爵级巡洋舰2号舰（佣兵队长5批次）该级巡洋舰有着很强的防护力。 在战争中，加里波第号作为主力巡洋舰参加了多次海战，表现不错并最终幸存到战后，在战后中继续服役。冷战期间，加里波第加装了新的电子设备和武器继续服役，并担任海军旗舰。1957年根据协议，加里波第进行了二战之后的第二次改造，装备了全新的小猎犬防空导弹与北极星发射筒。"]],
                            ninghai: ["female", "ROCN", 3, ["fangkong2", "qingxuncl", "jianduixunlian"], ["des:　1931年中国向日本订购的一艘轻巡洋舰。该舰吸取了夕张号的设计经验，布局紧凑，火力强于一般同吨位军舰。出于训练目的，该舰虽然只有2600吨左右，但是水上飞机，鱼雷均齐备，也正因为过多的装备导致该舰适航性不佳。1937年全面抗战爆发，宁海号死守江阴防线，并战沉于此。"]],
                            sp_ninghai: ["female", "ROCN", 3, ["fangkong2", "qingxuncl", "aizhi", "longgu", "jianghun"], ["des:　1931年中国向日本订购的一艘轻巡洋舰。该舰吸取了夕张号的设计经验，布局紧凑，火力强于一般同吨位军舰。出于训练目的，该舰虽然只有2600吨左右，但是水上飞机，鱼雷均齐备，也正因为过多的装备导致该舰适航性不佳。1937年全面抗战爆发，宁海号死守江阴防线，并战沉于此。"]],
                            yiahua: ["female", "USN", 4, ["zhuangjiafh", "zhanliebb", "zhizhanzhige"], ["des:衣阿华级战列舰是U海军在战争期间最新式的战列舰，在火力与防护有所增强的情况下，相比前代的南达与北卡，衣阿华的航速超过30节。衣阿华于43年服役，并于同年负责运送总统参加德黑兰会议。44年衣阿华转战太平洋战场，在莱特湾海战期间，衣阿华及其姐妹舰本有与大和级交手的机会，但敌方舰队已经先行转向。在战争后期，衣阿华主要依靠其高速执行护航与火力支援任务。在冲绳战役时本舰预备拦截大和号，但大和号最终被航母空袭击沉，双方最强战列舰就此失去交手机会。"]],
                            dajingbeishang: ["female", "IJN", 3, ["zhongleizhuangjiantuxi", "jianjianleiji"], ["des:球磨型轻巡3番舰。41年北上号被改装为了雷击巡洋舰，全舰共装备了十座四联装鱼雷发射器，单边齐射达到了二十枚鱼雷。但由于海战环境的变化，她始终没有派上用场。她在1942年拆除了八座鱼雷发射器，改为了高速运输舰。44年北上号改装为人操鱼雷“回天”母舰。北上号也是唯一残存到战后的球磨级，在1946年拆毁。"]],
                            wugelini: ["female", "RM", 3, ["dajiaoduguibi", "quzhudd", "fenzhandaodi"], ["des:　乌戈里尼•维瓦尔迪号属航海家级驱逐舰5号舰。乌戈里尼•维瓦尔迪号也同姐妹舰安东尼奥•达诺利号一样坚持到了1943年意大利投降，在接应意大利主力舰队一同前往盟军港口时遭到了德军阻截，在规避中触雷，两姐妹舰在不到一天的时间内相继沉没。"]],
                            xukufu: ["female", "MN", 3, ["qianting", "huofu", "xunqian"], ["des:絮库夫号是法国建造的一艘大型潜艇，她搭载了潜艇上罕见的203毫米双联主炮，同时还搭载了水上飞机，这些一般是重巡洋舰的配备。她还在甲板上装备了类似驱逐舰的回旋式的鱼雷发射器。40年法国迅速战败后，絮库夫号在盟军阵营参加作战，在42年与商船相撞的事故中沉没。"]],
                            yaergushuishou: ["female", "RN", 3, ["fangkong2", "qingxuncl", "jinyangmaozhishi", "zhengzhansihai"], ["des:亚尔古水手号是黛朵级巡洋舰的一艘。如同她的名字一样，亚尔古水手号巡洋舰的航迹也遍布东西。在战争初期亚尔古水手号主要在大西洋战场作战。在一次出击中，亚尔古水手号遭到潜艇雷击，舰艏艉都被炸飞，瞬间舰身短了约50米。进行临时修理后，亚尔古水手号单独穿越大西洋前往后方进行修理。在修理完成后，亚尔古水手号参与了诺曼底作战与远东作战。"]],
                            mist_dujiaoshou: ["female", "RN", 3, ["junfu", "shuqinzhiyin",], ["des:指挥官大人，您贵安。我是轻型航空母舰独角兽。为守护我们第四舰队那些美丽的花朵，也为了指挥官大人，我会尽心尽力工作。今后还望请多指教。"]],
                            mist_xiawu: ["female", "IJN", 3, ["quzhudd", "dajiaoduguibi", "yixinyiyi"], ["des:我是属于NeoForce第一舰队，识别号码NF001的夏霧。我是个初来乍到的新人，敬请提督指教。"]],
                            mist_shanhuhai: ["female", "USN", 4, ["hangmucv", "buxiuzhanshi"], ["des:Nice to meet you~航空母舰珊瑚海~。经历比较丰富，现在担任指导员工作。海战不用说，陆战也很在行~。啊，当然陆战的时候要卸掉舰装，拿枪战斗。"]],

                            skilltest: ["male", "OTHER", 9, [], ["forbidai", "des:测试用"]],
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
                                    return (event.name != 'phase' || game.phaseNumber == 0) && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));
                                },
                                content: function () {
                                    if (player.identity == 'zhu') { player.changeHujia(1); };
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
                                            return evt && evt.player == player && evt.hs && evt.hs.length > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));
                                        },
                                        content: function () { player.draw(1); player.removeMark('_yuanhang_mopai'); },
                                        sub: true,
                                    },
                                    kaishi: {
                                        name: "远航回合开始时", fixed: true, silent: true, friquent: true,
                                        trigger: { global: "phaseBegin", },
                                        content: function () {//else if(!player.countMark('mopaiup')<1&&player.countCards('h','shan')<1){player.draw()}
                                            var a = player.countMark('mopaiup'); var b = player.countMark('_yuanhang_mopai');
                                            //game.log(event.skill != 'huijiahuihe');
                                            if (player == _status.currentPhase && event.getParent('phase').skill != 'huijiahuihe') { a += (1); if (a - b > 0) player.addMark('_yuanhang_mopai', a - b); };
                                            /*if(a>b&&player!=_status.currentPhase){player.addMark('_yuanhang_mopai',1);};*/
                                        },//远航每回合恢复标记被砍掉了。现在只有每轮开始恢复标记。
                                        sub: true,
                                    },
                                    dietogain: {
                                        name: "远航死后给牌",
                                        trigger: { player: ["dieAfter"], },
                                        direct: true,
                                        forceDie: true,
                                        filter: function (event, player) { if (event.name == 'die') return get.mode() === "identity" && player.identity === "zhong"; return player.isAlive() && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai'));; },
                                        content: function () {
                                            'step 0'
                                            event.count = trigger.num || 1;
                                            'step 1'
                                            event.count--;//让优势方有一轮的挑战，因为第二轮对手就因为过牌量下降而失去威胁。
                                            player.chooseTarget(get.prompt2('在离开战斗前，若你的身份：<br>是忠臣，你可令一名角色摸1张牌.<br>或许会有转机出现。'), function (card, player, target) { return target.maxHp > 0; }).set('ai', function (target) {/*<br>是反贼，令一名角色摸1张牌；<br>内奸，令一名角色获得一张闪。*/
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
                                        filter: function (event, player) { return player.hp <= 0 && event.num < 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai')); },
                                        "prompt2": function (event, player) {
                                            return '当你进入濒死状态时，你可以摸一张牌,<br>若血量上限大于2，你须失去一点体力上限，改为摸两张牌。';
                                        },
                                        content: function () {//兵粮寸断与据守，刚烈， 镇卫同疾吸伤害，国风防锦囊牌。
                                            //轻巡提升己方防守与攻击距离，粮策全体发牌。重巡提供免伤。战列刚烈反击。 
                                            if (player.maxHp <= 2) {
                                                player.draw(1);
                                            } else if (player.maxHp > 2) {
                                                player.loseMaxHp(1);
                                                player.draw(2);
                                            }/*game.playAudio('..','extension','舰R牌将/audio','bingsimosanpai')*/
                                            //trigger.player.addMark('_yuanhang_bingsimopai', 1);
                                        },
                                        /* intro: {
                                            marktext: "濒死", content: function (player) {
                                                var player = get.player(), a = player.countMark('_yuanhang_bingsimopai'), tishi = '因濒死而减少的体力上限，牺牲上限，获得应急的牌，保一时的平安。<br>'; if (a > 0 && a <= 2 && player.hp <= 2) { tishi += ('勇敢的前锋<br>') }; if (a > 2 && a < 4 && player.hp <= 2) { tishi += ('rn勇的中坚<br>') }; if (a >= 4 && player.hp <= 2) { tishi += ('顽强的、折磨对手的大将<br>') };
                                                return tishi;
                                            },
                                        },  */
                                        sub: true,
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
                                    else*/ if (event.parent.name == 'phaseUse' && (a) > 0 && !player.hasMark('_jianzaochuan')) { return (player.countCards('hejs') >= 2) && a && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai')); } return false;//没有建造标记时才能建造，即主动建造上限1次，
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
                                    var player = get.player(); var event = _status.event; var huifu = player.countCards('h', 'jiu') + player.countCards('h', 'tao');
                                    if (player != event.dying && (player.hp < player.maxHp) && (player.countCards('h') > 4 || !player.hasMark('_jianzaochuan'))) return 11 - get.value(card);
                                    if (player.hp <= 0 && (huifu < (-player.hp + 1) || !player.hasMark('_jianzaochuan'))) return 15 - get.value(card);
                                },
                                content: function () {
                                    player.addMark('_jianzaochuan');
                                    //game.log(event.parent.name, event.cards);
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
                                enable: "phaseUse",
                                usable: 1,
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
                                },
                                filterCard: {}, position: "h", selectCard: function (card) {
                                    var player = get.player(), num = 0;/*num+=(player.countMark('Expup'));if(ui.selected.cards.length&&get.type(ui.selected.cards[0],'equip')=='equip'){num+=(1)};if(ui.selected.cards.length>1&&get.type(ui.selected.cards[1],'equip')=='equip'){num+=(1)};*///装备不再记为2强化点数
                                    return [Math.max(2 - num, 0), Math.max(4 - num, 2)];
                                },

                                discard: false,
                                lose: false,
                                check: function (card) {//ui，参考仁德，ai执行判断，卡牌价值大于1就执行（只管卡片）当然，能把玩家设置进来就可以if玩家没桃 return-1。
                                    var player = get.player();
                                    if (ui.selected.cards.length && get.type(ui.selected.cards[0], 'equip') == 'equip') return 5 - get.value(card);
                                    if (ui.selected.cards.length >= Math.max(1, player.countCards('h') / 2)) return 0;
                                    if (game.phaseNumber < 3) return 7 - get.value(card);
                                    return 3 - get.value(card);
                                },
                                content: function () {//choiceList.unshift//原有强化，多人游戏无法运行
                                    'step 0'
                                    var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, exp1 = 0;
                                    player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h, k];
                                    exp1 = cards.length;
                                    var choiceList = [];
                                    var list = [];
                                    //game.log(cards);
                                    event.cao = cards;
                                    //game.log(event.cao);
                                    //exp1 = player.countMark('Expup1');
                                    jieshao = ['后勤保障：上限+' + (a + 1) + '→' + (a + 2) + '远航（用一摸一）标记上限，<br>手牌少于手牌上限1/2时，失去手牌会摸一张牌。防守反击的保障<br>每轮上限1/2/3，在自己的回合重置使用次数。', '技能升级：+' + (b) + '→' + (b + 1) + '，重巡-降低必中攻击限制(杀/黑牌/任意牌)、轻巡-增加无效群体锦囊牌范围(1/2/3)、航母-降低万箭齐发限制(黑桃与梅花/黑桃与梅花与红桃/任意牌);<br>战列舰-增加防护范围(杀造成的伤害/杀和锦囊牌造成的伤害/所有伤害)，导驱-增加射程(2/3/4)、潜艇-降低雷杀条件(红桃/红桃或黑桃/红桃或黑桃或方块);<br>驱逐-增加回避概率(0.25/0.33/0.50)、军辅-增加存牌上限(1/2/3)。', '射程升级：+' + c + '→' + (c + 1) + '武器（出杀）攻击距离，<br>增加出杀范围，虽然不增加锦囊牌距离，但胜在永久', '速射炮管：+' + d + '→' + (d + 1) + '出杀次数，<br>作为连弩的临时替代，进行多刀输出。', '改良推进器：+' + e + '→' + (e + 1) + '武器（被杀）防御距离<br>对手有更远的出杀范围才能对你出杀时，但不能防御锦囊牌。', '物流运输：+' + f + '→' + (f + 1) + '手牌上限，且蝶舞递装备给杀的距离提升，<br>双方状态差距越大，保牌效果越强。', '经验：+' + h + '→' + (player.countMark('Expup1')) + '，将卡牌转为经验，供下次升级。（直接点确定也行）<br>1级技能需要两张牌才能强化，2级技能需要三张牌才能强化。<br>但无名杀不能读取这个界面的文本，导致四点经验即可强化两个不同等级技能']//player.getEquip(1)，定义空数组，push填充它，事件变量可以自定义名字，什么都可以存。game.log('已强化:',a+b+c+d);
                                    var info = lib.skill._qianghuazhuang.getInfo(player);
                                    //game.log(info);
                                    if (info[0] < k && (info[0] + 2 <= info[7] + exp1) && info[0] <= 2) {
                                        list.push('mopaiup');
                                        choiceList.push(['mopaiup', jieshao[0]]);
                                    };
                                    if (info[1] < k && (info[1] + 2 <= info[7] + exp1) && info[1] <= 2 && !player.hasSkill("shixiangquanneng")) {
                                        list.push('jinengup');
                                        choiceList.push(['jinengup', jieshao[1]]);
                                    };
                                    if (info[2] < k && (info[2] + 2 <= info[7] + exp1) && info[2] <= 2) {
                                        list.push('wuqiup');
                                        choiceList.push(['wuqiup', jieshao[2]]);
                                    };//若此值：你强化的比目标多时，+1含锦囊牌防御距离。
                                    if (info[3] < k && (info[3] + 2 <= info[7] + exp1) && info[3] <= 2) {
                                        list.push('useshaup');
                                        choiceList.push(['useshaup', jieshao[3]]);
                                    };
                                    if (info[4] < k && (info[4] + 2 <= info[7] + exp1) && info[4] <= 2) {
                                        list.push('jidongup');
                                        choiceList.push(['jidongup', jieshao[4]]);
                                    };
                                    if (info[5] < k && (info[5] + 2 <= info[7] + exp1) && info[5] <= 2) {
                                        list.push('shoupaiup');
                                        choiceList.push(['shoupaiup', jieshao[5]]);
                                    };
                                    //      if(info[6]<k&&(info[0]+2<=info[7])&&info[6]<2){event.list.push('songpaiup');
                                    //  event.choiceList.push('+'+g+'→'+(g+1)+'给牌次数，<br>提升“先进雷达”技能的送牌范围。');};
                                    if (info[7] <= k && info[7] < 6) {
                                        list.push('Expup');
                                        choiceList.push(['Expup', jieshao[6]]);
                                    };
                                    //game.log(choiceList);
                                    event.first = true;    //存了6个变量，可以导出为button，与textbutton样式，看需求
                                    var xuanze = Math.max(Math.floor(event.cao.length / 2), 1);
                                    //game.log("xuanze" + xuanze);
                                    player.chooseButton([
                                        '将手牌转化为强化点数强化以下能力；取消将返还卡牌，<br>未使用完的点数将保留，上限默认为1，发动建造技能后提高。',
                                        [choiceList, 'textbutton'],
                                    ]).set('filterButton', button => {
                                        var event = _status.event;
                                        if (ui.selected.buttons) {//for(var i=0;i<event.cao.length;i+=(1)){};测试失败的函数组合game.log(ui.selected.buttons,get.selectableButtons().includes(ui.selected.buttons),get.selectableButtons());游戏无名杀Button的限制，这个代码并没有起到实时计算的作用。
                                            return true; //return xuanze >= player.countMark(ui.selected.buttons[0]) * 0.5 + 1;
                                        }
                                    }).set('ai', function (button) {
                                        var haode = [jieshao[0], jieshao[1]]; var yingji = []; var tunpai = [jieshao[5]];//其实一个例子就行，不如直接if(){return 2;};
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
                                    //game.log(result.links, result.bool)//只能返还这两个，所以更适合技能，更需要循环的方式进行计算。
                                    if (!result.bool) { player.removeMark('Expup1', player.countMark('Expup1')); event.finish(); };//返还牌再计算
                                    if (result.bool) {  //player.addMark('Expup',event.cadechangdu);//先给经验再计算扣除经验升级，随着此项目的升级，花费也越多。通过一个有序的清单，遍历比对返回的内容，来定位要增加的标记/数组。
                                        player.addMark('Expup', player.countMark('Expup1')); player.removeMark('Expup1', player.countMark('Expup1'));
                                        for (var i = 0; i < result.links.length; i += (1)) {
                                            if (!result.links.includes('Expup')) {
                                                player.addMark(result.links[i], 1); player.removeMark('Expup', 1 + player.countMark(result.links[i]));
                                                //game.log('数组识别:', result.links[i], '编号', i, '，总编号', result.links.length - 1);
                                            }
                                        }
                                        player.discard(event.cao);
                                    };
                                    //    if(event.choiceList.length<event.cao){player.addMark('Expup',1);};从0开始，当介绍数组有内容==选项数组的内容（第i个），就加的简称数组第i个(内容)标签。并通过game.log()调试,在出牌记录中查看执行效果。result.links.includes(event.list[i])&&
                                    'step 2'
                                    var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1;
                                    //game.log('结束', a, b, c, d, e, f, g, h, k);
                                    player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h];
                                },
                                ai: {
                                    order: function (player) { var player = get.player(); if (player.countMark('_jianzaochuan') < 3) { return 7 }; return 1 }, threaten: 0,
                                    result: {
                                        player: function (player) {
                                            var player = get.player();
                                            var num = player.countCards('h', { name: 'shan' }) - 1;
                                            return num;
                                        },
                                    },
                                },//装备上装备以后，ai剩下的装备可以考虑强化，应该会保留防具吧。
                            },
                            _wulidebuff: {
                                name: "属性效果", lastDo: true, forced: true, trigger: { source: "damageBefore", },
                                filter: function (event, player) {
                                    if ((event.nature && player != event.player) && event.num > 0 && (get.mode() != 'boss' || (get.mode() == 'boss' && !lib.character[player.name][4].includes('boss') && player.identity == 'cai')))
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
                                                var player = get.player(); var tishi = '回合结束受到一点火焰伤害，摸两张牌（有护甲则不会触发摸牌），火杀带来的负面效果，本回合被攻击了' + player.countMark('_wulidebuff_ranshao') + '次，'; if (player.countMark('_wulidebuff_ranshao') > 0 && player.hp <= 2) { tishi += ('可能小命不保，求求队友给点力，发挥抽卡游戏的玄学力量。”') }; if (player.countMark('_wulidebuff_ranshao') > 2 && player.hp <= 2) { tishi += ('“被集火了，希望队友能能继续扛起重任。') }; if (player.identity == 'nei') { tishi += ('为了自己的光辉岁月，我内奸一定能苟住，一定要苟住') }; if (player.identity == 'zhu') { tishi += ('我的生命在燃烧，') }; if (player.identity == 'zho') { tishi += ('同志，救我，我被火力压制了。') }; if (player.identity == 'fan') { tishi += ('就怕火攻一大片啊，我们的大好前程被火杀打到功亏一篑') };
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
                                    //game.log(trigger.num, event.num1);
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
                                    //game.log(chusha, danzong);
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
                                                player.chooseControl('<span class=yellowtext>基本', '<span class=yellowtext>装备', '<span class=yellowtext>锦囊', 'cancel2').set('prompt', get.prompt('kaishimopao')).set('prompt2', '选择一张牌并发现之').set('ai', function (event, player) { var player = get.player(); return 1; });
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
                                            player.chooseControl('<span class=yellowtext>少摸一张牌' + '</span>', 'cancel2').set('prompt', get.prompt('判定藏牌')).set('prompt2', '准备阶段，若你的判定区有牌时，<br>你可以令自己的摸牌阶段少摸一张牌，<br>然后在自己的回合结束时摸一张牌。').set('ai', function (event, player) { var player = get.player(); return 0; });
                                            'step 1'
                                            if (result.control != 'cancel2') { player.addMark('kaishimopao_jieshudraw'); player.addMark('kaishimopao_draw'); };
                                        }, sub: true, mark: false, intro: { marktext: "闭月", content: function (player) { return ('结束时摸一张牌'); }, },
                                    },
                                },
                                intro: { marktext: "摸牌", content: function (player) { return ('获得一个技能时的标记'); }, },
                            },
                            huokongld_equip_skill: {
                                equipSkill: true,
                                firstDo: true,
                                direct: true,
                                trigger: { player: ["shaMiss", "eventNeutralized"], },
                                audio: "ext:舰R牌将/audio/skill:true",
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
                                            return card != player.getEquip('guanshi') && card != arg.card && (!arg.card.cards || !arg.card.cards.includes(card)) && get.value(card) < 5;
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
                                prompt: "当你无法使用杀时，你可以指定一个目标，弃置最多（2/3/4）张相同花色的牌，并与目标摸等量的牌,<br>然后你与目标轮流视为对对方使用一张决斗,<br>直到双方的决斗次数超过2n，n为你弃置的牌数。强化以减少对方摸的牌",
                                content: function () {
                                    'step 0'//你获得技能[]player.addTempSkill('touxichuan','phaseAfter');
                                    event.num = event.cards.length;
                                    var d = game.countPlayer(function (current) { return current != player && (get.attitude(player, current) < 1) && (current.hasSkill('bagua_skill') | current.hasSkill('re_bagua_skill')); });
                                    //game.log('有八卦的角色:', d);
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
                                audio: "ext:舰R牌将/audio/skill:true",
                                frequent: true,
                                firstDo: true,
                                usable: 1,
                                filter: function (event, player) { return true },
                                content: function () {
                                    //  game.log(event.triggername,!trigger.hujia);//灵血&&!player.countCards('h',{color:'red'})
                                    if (player.countMark('jinengup') <= 0) {
                                        if (trigger.card && (trigger.card.name == 'sha' || trigger.card.name == 'sheji9') && trigger.source && event.triggername == 'damageEnd' && !trigger.hujia && player.hujia == 0) {
                                            player.changeHujia(1);
                                            game.log(get.translation(player), '发动了技能【装甲防护】，增加了 1 点护甲值！');
                                        }
                                    } else if (player.countMark('jinengup') == 1) {
                                        if (trigger.cards && event.triggername == 'damageEnd' && !trigger.hujia && player.hujia == 0) {
                                            player.changeHujia(1);
                                            game.log(get.translation(player), '发动了技能【装甲防护】，增加了 1 点护甲值！');
                                        }
                                    } else if (player.countMark('jinengup') >= 2) {
                                        if (event.triggername == 'damageEnd' && !trigger.hujia && player.hujia == 0) {
                                            player.changeHujia(1);
                                            game.log(get.translation(player), '发动了技能【装甲防护】，增加了 1 点护甲值！');
                                        }
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
                                audio: "ext:舰R牌将/audio/skill:true",
                                trigger: { player: "phaseUseBegin" },
                                filter: function (event, player) {
                                    return player.countCards('h') > 0;
                                },
                                check: function (event, player) {
                                    return 1;
                                },
                                frequent: true,
                                content: function () {
                                    "step 0"
                                    if (player.countMark('jinengup') <= 0) {
                                        player.chooseCardTarget({
                                            prompt: "弃置任意张黑桃或梅花手牌，视为使用【万箭齐发】",
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
                                        /*player.chooseToDiscard(2, "h", function (card) {
                                            return get.color(card) === 'black';
                                        }, "弃置两张黑桃或梅花手牌，视为使用【万箭齐发】").set("ai", function (card) {
                                            return 4 - get.value(card);
                                        });*/
                                    } else if (player.countMark('jinengup') == 1) {
                                        player.chooseCardTarget({
                                            prompt: "弃置任意张黑桃或梅花或红桃手牌，视为使用【万箭齐发】",
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
                                        /*player.chooseToDiscard(2, "h", function (card) {
                                            return get.suit(card) === 'spade' || get.suit(card) === 'club' || get.suit(card) === 'heart';
                                        }, "弃置两张黑桃或梅花或红桃手牌，视为使用【万箭齐发】").set("ai", function (card) {
                                            return 4 - get.value(card);
                                        });*/
                                    } else if (player.countMark('jinengup') >= 2) {
                                        player.chooseCardTarget({
                                            prompt: "弃置任意手牌，视为使用【万箭齐发】",
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
                                        /*player.chooseToDiscard(2, "h", function (card) {
                                            return true;
                                        }, "弃置两张手牌，视为使用【万箭齐发】").set("ai", function (card) {
                                            return 4 - get.value(card);
                                        });*/
                                    }
                                    /*"step 1"
                                    if (result.bool && result.cards && result.cards.length === 2) {
                                        player.chooseTarget("请选择目标，视为使用【万箭齐发】", [1, Infinity], function (card, player, target) {
                                            return player != target;
                                        }).set("ai", function (target) {
                                            return -get.attitude(player, target);
                                        });
                                    }*/
                                    "step 1"
                                    if (result.targets && result.targets.length > 0) {
                                        player.useCard({ name: 'wanjian' }, result.cards, result.targets);
                                        //player.useCard({ name: 'wanjian' }, result.targets, false);
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
                                    threaten: 1.8,
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
                                        var player = get.player(), chusha = lib.filter.cardEnabled({ name: 'sha' }, player), renshu = game.countPlayer(function (current) { return get.attitude(player, current) > 0 && get.distance(from, current, 'pure') <= 1 + current.countMark('jinengup'); });
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
                                audio: "ext:舰R牌将/audio/skill:2",
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
                                    if (player.getStorage("rerende2").includes(target)) return false;
                                    return player != target && get.distance(player, target, 'pure') <= 2 + player.countMark('shoupaiup');
                                },
                                onremove: ["rerende", "rerende2"],
                                check: function (card) {
                                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
                                    if (!ui.selected.cards.length && card.name == 'du') return 20;
                                    var player = get.owner(card);
                                    if (ui.selected.cards.length >= Math.max(2, player.countCards('h') - player.hp)) return 0;
                                    if (player.hp == player.maxHp || player.getStorage("rerende") < 0 || player.countCards('h') <= 1) {
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
                                                    var player = get.player();
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
                                    var player = get.player();
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
                                        charlotte: true,
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
                                        forced: true,
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
                                        if (["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].includes(he[i].name)) return true;
                                    }
                                    return false;
                                },
                                filterCard: function (card) {
                                    return ["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].includes(card.name);
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
                                audio: "ext:舰R牌将/audio/skill:2",
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
                                discard: false,
                                check: function (card) {
                                    var player = get.player(); return 7 - get.value(card)//if(get.suit(card)=='club'&&player.countMark('jinengup')<1){return -1};，本回合内不能再对同一目标使用此技能
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
                                            return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
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
                                        if (event.player.getHistory('skipped').includes('phaseJudge')) return true;
                                        if (event.player.getHistory('skipped').includes('phaseDraw')) return true;
                                        if (event.player.getHistory('skipped').includes('phaseUse')) return true;
                                        if (event.player.getHistory('skipped').includes('discard')) return true;
                                    }; return false;
                                },
                                content: function () {
                                    player.logSkill('jiezi', trigger.player);
                                    //if(player.getHistory('skipped').length>0) player.draw(player.getHistory('skipped').length);
                                    if (trigger.player.getHistory('skipped').includes('phaseJudge')) player.draw();
                                    if (trigger.player.getHistory('skipped').includes('phaseDraw')) player.draw();
                                    if (trigger.player.getHistory('skipped').includes('phaseUse')) player.draw();
                                    if (trigger.player.getHistory('skipped').includes('discard')) player.draw();
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
                                    player: "phaseZhunbeiBegin",
                                },
                                lastDo: true,
                                //round: 1,
                                "prompt2": function (event, player) {
                                },
                                filter: function (event, player) {//意外发现function应用广泛，然而解决不了自动显示隐藏标记。航母开幕，然后根据舰种判断具体出什么杀game.log();
                                    return player.countCards('h') > 0;
                                },
                                content: function () {
                                    'step 0'
                                    var next = player.chooseToDiscard(function (card, player) {
                                        if (player.countMark('jinengup') <= 0) {
                                            if (card.suit == 'heart' || card.suit == 'spade') {
                                                return lib.filter.cardDiscardable(card, player);
                                            }
                                        }
                                        else if (player.countMark('jinengup') == 1) {
                                            if (card.suit == 'heart' || card.suit == 'spade' || card.suit == 'diamond') {
                                                return lib.filter.cardDiscardable(card, player);
                                            }
                                        }
                                        else if (player.countMark('jinengup') >= 2) {
                                            return lib.filter.cardDiscardable(card, player);
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
                                            var player = get.player(); if (ui.selected.targets) return [1, 1]; return 1;
                                        },//要气质的卡牌，可以return[1,3]
                                        selectTarget: function () {
                                            var player = get.player(); if (ui.selected.cards) return [ui.selected.cards.length, ui.selected.cards.length]; return 1;
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
                                    global: ["phaseZhunbeiBegin"],
                                },
                                lastDo: true,
                                frequent: true,
                                //preHidden: true,
                                locked: false,
                                filter: function (event, player, name) {//输粮改
                                    //var a = (event.name == 'phase');
                                    return player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length > 0 && event.player.isAlive() && event.player != player;//&& a == true
                                },
                                content: function () {
                                    'step 0'
                                    var goon = (get.attitude(player, trigger.player) > 0);
                                    player.chooseCardButton(get.prompt('junfu', trigger.player), player.getCards('s', function (card) { return card.hasGaintag('junfu') }), [1, 3]).set('ai', function () {
                                        if (_status.event.goon) return 1;
                                        return -1;
                                    }).set('goon', goon);
                                    'step 1'
                                    if (result.bool) {
                                        player.logSkill('junfu', trigger.player);
                                        //player.loseToDiscardpile(result.links);player.discoverCard(get.inpile('trick'));target.loseToSpecial(event.cards2,'asara_yingwei',player).visible=true;player.draw(1);player.draw(1);player.loseToSpecial(,'junfu',player).visible=true;
                                        trigger.player.gain(result.links, player);
                                        //独角兽的技能修葺
                                        if (player.hasSkill("xiuqi") && (!trigger.player.hasSkill("xiuqi2"))) {
                                            game.log(get.translation(trigger.player) + "获得了【修葺】带来的提升！");
                                            trigger.player.addTempSkill('xiuqi2', { player: 'phaseAfter' });
                                        }

                                        //
                                        player.draw(1);
                                    } else event.finish();

                                },
                                ai: { combo: "junfu", },
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
                                            player: "phaseUseEnd",
                                        },
                                        forced: true,
                                        popup: false,
                                        firstDo: true,
                                        filter: function (event, player) {
                                            var zongshu = 1 + player.countMark('jinengup'), cunpaishu = player.getExpansions('junfu').length + player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length;
                                            return zongshu > cunpaishu && player.countCards('h');
                                        },
                                        content: function () {
                                            'step 0'
                                            var nh = Math.min(player.countCards('h'), Math.ceil(player.getHandcardLimit()));
                                            var duiyou = game.countPlayer(function (current) { return get.attitude(player, current) > 0; });
                                            var zongshu = 1 + player.countMark('jinengup'), cunpaishu = player.getExpansions('junfu').length + player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length;
                                            if (nh && zongshu > cunpaishu) {
                                                player.chooseCard('h', [1, Math.min(nh, zongshu - cunpaishu)], '将任意张手牌置于你的武将牌上,<br>存牌上限为1+技能强化等级。<br>单次存牌量上限为手牌上限,<br>这些牌可以在回合外递给其他角色').set('ai', function (card) {
                                                    var player = get.player();
                                                    if (ui.selected.cards.type == "equip") return -get.value(card);
                                                    if (ui.selected.cards.length >= duiyou) return -get.value(card);
                                                    return 9 - get.value(card);
                                                });
                                            }
                                            else { event.finish(); }
                                            'step 1'
                                            if (result.bool) {
                                                // player.addToExpansion(result.cards,player,'giveAuto').gaintag.add('junfu');player.update();
                                                player.loseToSpecial(result.cards, 'junfu', player).visible = true;
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
                                    threaten: 1.8,
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
                            fangqu: {
                                trigger: {
                                    player: "phaseZhunbeiBegin",
                                    global: "gameStart",
                                },
                                frequent: true,
                                firstDo: true,
                                filter: function (event, player) {
                                    var zongshu = 1 + player.countMark('jinengup'), cunpaishu = player.getExpansions('daodan').length + player.getCards('s', function (card) { return card.hasGaintag('daodan') }).length;
                                    return zongshu > cunpaishu && player.countCards('h');
                                },
                                content: function () {
                                    'step 0'
                                    var nh = Math.min(player.countCards('h'), Math.ceil(player.getHandcardLimit()));
                                    var zongshu = 1 + player.countMark('jinengup'), cunpaishu = player.getExpansions('daodan').length + player.getCards('s', function (card) { return card.hasGaintag('daodan') }).length;
                                    if (nh && zongshu > cunpaishu) {
                                        player.chooseCard('h', [1, Math.min(nh, zongshu - cunpaishu)], '将任意张手牌置于你的武将牌上,<br>存牌上限为1+技能强化等级。<br>单次存牌量上限为手牌上限,<br>这些牌可以使锦囊牌无效').set('ai', function (card) {
                                            var player = get.player();
                                            if (ui.selected.cards.type == "equip") return -get.value(card);
                                            return 9 - get.value(card);
                                        });
                                    }
                                    else { event.finish(); }
                                    'step 1'
                                    if (result.bool) {
                                        // player.addToExpansion(result.cards,player,'giveAuto').gaintag.add('junfu');player.update();
                                        player.loseToSpecial(result.cards, 'daodan', player).visible = true;
                                    }

                                },
                                ai: {
                                    combo: "daodan",
                                },
                                group: ["fangqu_wuxie"],
                                onremove: function (player, skill) {
                                    var cards = player.getExpansions(skill);
                                    if (cards.length) player.loseToDiscardpile(cards);
                                },
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                                subSkill: {
                                    wuxie: {
                                        trigger: {
                                            global: ["useCard"],
                                        },
                                        filter: function (event, player) {
                                            return player.countCards("s") > 0 && get.type(event.card) == "trick";
                                        },
                                        check: function (event, player) {
                                            var effect = 0;
                                            if (event.card.name == "wuxie") {
                                                if (get.attitude(player, event.player) < -1) {
                                                    effect = -1;
                                                }
                                            } else if (event.targets && event.targets.length) {
                                                for (var i = 0; i < event.targets.length; i++) {
                                                    effect += get.effect(event.targets[i], event.card, event.player, player);
                                                }
                                            }
                                            return effect < 0;
                                        },
                                        prompt: function (event, player) {
                                            var str = "防驱：是否拦截" + get.translation(event.player);
                                            if (event.targets && event.targets.length) {
                                                str += "对" + get.translation(event.targets);
                                            }
                                            str += "使用的" + get.translation(event.card);
                                            return str;
                                        },
                                        content: function () {
                                            "step 0";
                                            game.log(player.getCards('s', function (card) { return card.hasGaintag('daodan') }));
                                            player.chooseCardButton('移去一张防空导弹', player.getCards('s', function (card) { return card.hasGaintag('daodan') }), 1).set('ai', function (button) {
                                                return 1;
                                            });
                                            "step 1";
                                            if (result.bool) {
                                                var cards = result.links;
                                                player.loseToDiscardpile(cards);
                                                trigger.targets.length = 0;
                                                trigger.all_excluded = true;
                                            }
                                        },
                                        ai: {
                                            threaten: 1.8,
                                            expose: 0.3,
                                        },
                                        "_priority": 0,
                                    }
                                }
                            },
                            daoqu: {
                                mod: {
                                    //selectTarget:function(card,player,range){///是卡片作用时可选的目标数量，输出range给牌的发起事件阶段用。
                                    //if(range[1]==-1) return;var a=game.countPlayer(function(current){return get.attitude(player,current)<=0&&current.inRange(player)})-1;
                                    //if(card.name=='sha') range[1]+=Math.min(player.countMark('jinengup'),a);},
                                    attackRange: function (from, distance) {
                                        return distance + (2 + 2 * from.countMark('jinengup'));
                                    },
                                },
                                usable: 1,
                                filterTarget(card, player, target) {
                                    if (player == target) return false;
                                    return true;
                                },
                                enable: "phaseUse",
                                filterCard: function (card) {
                                    var player = get.player();
                                    if (player.countMark('jinengup') <= 0) {
                                        return get.subtype(card) == "equip1";
                                    } else if (player.countMark('jinengup') == 1) {
                                        return get.type(card) == "equip";
                                    } else if (player.countMark('jinengup') >= 2) {
                                        return get.type(card) != "basic";
                                    }
                                },
                                selectCard: 1,
                                content: function () {
                                    var card = {
                                        name: "paohuofg9",
                                        isCard: true,

                                    };
                                    player.useCard(card, target, false).set("oncard", function () {
                                        _status.event.directHit.addArray(game.filterPlayer());
                                    });
                                    //target.damage("nocard");
                                },
                                check: function (card) {
                                    return 10 - get.value(card);
                                },
                                position: "he",
                                ai: {
                                    order: 8.5,
                                    result: {
                                        target: function (player, target) {
                                            return get.damageEffect(target, player);
                                        },
                                    },
                                },
                                threaten: 1.5,
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                            },
                            dajiaoduguibi: {
                                //inherit: "bagua_skill",//继承：八卦
                                audio: "bagua_skill",
                                firstDo: true,
                                content: function () {//已经有一个给牌技能了
                                    "step 0"
                                    event.cards = [];
                                    player.judge('dajiaoduguibi', function (card) {
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
                               //if(player.hasSkill('quzhudd')){if(!player.countMark('dajiaoduguibi')){player.addMark('dajiaoduguibi');event.goto(0);}else {player.removeMark('dajiaoduguibi',player.countMark('dajiaoduguibi'));};};
                                    };*/
                                    "step 1"
                                    if (result.judge > 0) {
                                        trigger.untrigger(); player.removeMark('dajiaoduguibi', player.countMark('dajiaoduguibi'));
                                        trigger.set('responded', true);
                                        trigger.result = { bool: true, card: { name: 'shan' } }
                                    };
                                },
                                trigger: {
                                    player: ["chooseToRespondBegin", "chooseToUseBegin"],
                                },
                                filter: function (event, player) {
                                    if (event.responded) return false;
                                    if (event.dajiaoduguibi) return false;
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
                                firstDo: true,
                                frequent: true,
                                trigger: { player: ["shaMiss", "eventNeutralized"], }, audio: "ext:舰R牌将/audio/skill:true",
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
                                            return card != player.getEquip('guanshi') && card != arg.card && (!arg.card.cards || !arg.card.cards.includes(card)) && get.value(card) < 5;
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
                                audio: "ext:舰R牌将/audio/skill:2",
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
                                audio: "ext:舰R牌将/audio/skill:2",
                                audioname: ["gexuan", "re_yufan"],
                                trigger: {
                                    player: "phaseJieshuBegin",
                                },
                                frequent: true,
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
                                        if (event.target[event.num2].getCards('h').includes(card) && event.target[event.num2].hasUseTarget(card)) {
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
                                name: "防空", //audio: "ext:舰R牌将/audio/skill:1", audioname: ["yixian", "reganning", "sunce", "re_sunben", "re_sunce", "ol_sunjian"],
                                unique: true, nodelay: true, lastDo: true,
                                trigger: { global: "useCardToPlayered", },
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
                                content: function () {
                                    'step 0'
                                    var next = player.chooseCardTarget({
                                        prompt: get.prompt('防空保护对象'),
                                        prompt2: ('当一名角色使用的锦囊牌指定了至少两名角色为目标时，<br>你可弃置两张牌（拥有对空防御则改为一张）令此牌对距离你' + (player.countMark('jinengup') + 1) + '内的任意名角色无效。'),
                                        position: 'hejs',//hej代指牌的位置，加个s即可用木流流马的牌。
                                        selectCard: function () {
                                            var player = get.player();/*if(ui.selected.targets)return [1,Math.min(trigger.targets.length,Math.floor(player.countCards('he')))];*///取消弃牌数与选择目标数相等改为固定弃置两张牌2023.8.7
                                            if (player.hasSkill('duikongfangyu')) {
                                                return 1;//对空防御的技能效果。若玩家拥有对空防御，则视为满级强化。
                                            }
                                            return 2;
                                        },//要气质的卡牌，可以return[1,3]if(ui.selected.cards)return [ui.selected.cards.length,ui.selected.cards.length+player.countMark('jinengup')];return 1;-player.countMark('jinengup')
                                        selectTarget: function () {
                                            var player = get.player();/*if(ui.selected.cards)return [ui.selected.cards.length,ui.selected.cards.length];*/return [1, 7];
                                        },//要选择的目标，同上，目标上限跟着手牌数走，怕报错跟个判定。
                                        filterCard: function (card, player) {
                                            return lib.filter.cardDiscardable(card, player);
                                        },//气质能气质掉的卡牌。
                                        filterTarget: function (card, player, target) {
                                            if (_status.event.targets.includes(target) && !target.hasSkill('fangkong2_aibiexuan')) {
                                                if (player.hasSkill('duikongfangyu')) {
                                                    return get.distance(player, target) <= (5);//对空防御的技能效果。若玩家拥有对空防御，则视为满级强化。
                                                }
                                                return get.distance(player, target) <= (1 + 2 * player.countMark('jinengup'));
                                            }
                                        },//选择事件包含的目标，同trigger的目标。有其他同技能的角色时，ai不要重复选择目标。
                                        ai1: function (card) {
                                            return 7 - get.useful(card);
                                        },//建议卡牌以7为标准就行，怕ai不救队友，所以调高了。同时ai顺次选择卡牌时不要选太多卡牌，要形成持续的牵制。
                                        ai2: function (target) {
                                            var player = get.player(); var trigger = _status.event.getTrigger();
                                            //game.log(get.translation(_status.event.player)); 
                                            if (!target.hasSkill("fangkong2_aibiexuan")) { return -get.effect(target, trigger.card, trigger.player, _status.event.player); }
                                            return 0;
                                        }, targets: trigger.targets,//这个代码不能照搬到content以外的地方。贯石斧、朱雀羽扇有类似代码。还有recover版的。
                                    });//技能还没扩起来，括起来。
                                    'step 1'
                                    if (result.bool) {//只能判断你有没有选择，然后给你true与false，没其他文本。
                                        player.discard(result.cards);//前面有卡牌card，可以返回card，不同于仁德主动技能直接写card。
                                        event.target = result.targets;//前面有目标target，可以返回target。
                                        if (event.target != undefined) { for (var i = 0; i < trigger.targets.length; i += (1)) { if (event.target.includes(trigger.targets[i])) { trigger.getParent().excluded.add(trigger.targets[i]); trigger.targets[i].addSkill('fangkong_aibiexuan'); game.log('取消卡牌目标', trigger.targets[i], '编号', i) } } };//三级选择，集合target是否包含trigger.target。同时测试是否选到了目标。
                                        player.logSkill('fangkong2', event.target);
                                        //if (player.hasSkill('duikongfangyu') && _status.currentPhase != player) player.draw(2);//对空防御的技能效果。若玩家拥有对空防御，则发动防空后可以摸牌。
                                    }//让技能发语音，发历史记录。
                                },
                                subSkill: {
                                    aibiexuan: {
                                        trigger: {
                                            global: "useCardEnd",
                                        },
                                        forced: true,
                                        content: function () {
                                            game.log('保护结束');
                                            player.removeSkill('fangkong2_aibiexuan');
                                        },
                                        sub: true,
                                    },
                                },
                            },

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
                                round: 1, trigger:
                                {
                                    player: "damageBefore",
                                    source: "damageSource",

                                },
                                filter: function (event, player) { return event.card && event.card.name != 'sha' && event.card.name != 'sheji9' },
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
                                    var nh = player.countCards('h') - player.countCards('h', { type: 'equip' });
                                    if (nh <= 2) return true;
                                    //if (player.countCards('h', 'tao')) return false;
                                    if (nh <= 3) return Math.random() < 0.7;
                                    if (nh <= 4) return Math.random() < 0.4;
                                    return false;
                                },
                                content: function () {

                                    player.addTempSkill('guzhuyizhi2', { player: 'phaseBegin' });
                                    player.discard(player.getCards("h"));
                                    player.draw(player.countCards("h") + 2);
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

                            shuileizhandui: {
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

                                    noh: true,
                                    skillTagFilter(player, tag) {
                                        if (tag == 'noh') {
                                            if (player.countCards('h') != 1) return false;
                                        }
                                    }, result: {
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
                                //direct: true,
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
                                            var player = get.player();
                                            return 1;
                                        },//要气质的卡牌，可以return[1,3]
                                        selectTarget: function () {
                                            var player = get.player(); return [1];
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
                                nobracket: true,
                                trigger: {
                                    player: "phaseZhunbeiBegin",
                                },
                                forced: true,
                                popup: false,
                                content: function () {
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
                                nobracket: true,
                                //audio: "ext:舰R牌将/audio/skill:true",
                                mod: {
                                    cardUsable: function (card, player, num) {
                                        if (card.name == 'sha') return num + 1;
                                    },
                                },
                                /*
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
                                */
                            },

                            bigE: {
                                prompt: "你令使用的第一张杀不可响应",
                                trigger: {
                                    player: "useCard",
                                },
                                audio: "ext:舰R牌将/audio/skill:true",
                                forced: true,
                                filter: function (event, player) {
                                    return event.card.name == 'sha' && player.getHistory('useCard', function (event) {
                                        return (event.card.name == 'sha' || event.card.name == 'sheji9') && event.cards && event.cards.length;
                                    }).indexOf(event) == 0;
                                },
                                content: function () {
                                    trigger.directHit.addArray(game.players);
                                },
                                group: ["bigE_effect"],
                                subSkill: {
                                    effect: {
                                        prompt: "你令受到伤害的角色进水（手牌上限-1直到其回合结束）",
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
                                    //player.addMark('xiangrui', 1);
                                    var i = player.countMark('xiangrui');
                                    player.removeMark('xiangrui', i);
                                    //game.log("i" + i);
                                    player.chooseTarget(get.prompt2('yumian'), true, function (card, player, target) {
                                        return get.distance(player, target) <= 1;
                                    }).set('ai', function (target) {
                                        var player = get.player();
                                        return get.effect(target, { name: 'losehp' }, player, target);
                                    });
                                    "step 1"
                                    //game.log("result.bool" + result.bool);
                                    if (result.bool) {
                                        result.targets[0].loseHp(1);
                                        result.targets[0].draw(2);
                                    } else event.finish();
                                },
                                ai: {
                                    damage: true,
                                    threaten: 1.3,
                                },
                            },
                            hangkongzhanshuxianqu: {
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
                                    //game.log("高速射击初始化检查");
                                    //game.log(typeof player.storage.gaosusheji);
                                    if (typeof player.storage.gaosusheji === 'undefined') player.storage.gaosusheji = false;
                                    if (player.storage.gaosusheji) {
                                        game.log("阳");
                                        return (_status.currentPhase == player && (get.type(event.card) == 'trick') & event.getParent('phaseUse') == evtx);
                                    } else {
                                        game.log("阴");
                                        return (_status.currentPhase == player && (get.type(event.card) == 'basic') & event.getParent('phaseUse') == evtx);

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
                                    //game.log(event.targets);
                                    'step 1'
                                    lib.target = event.targets.shift();
                                    if (lib.target.countCards('he') < 1) event._result = { index: 2 };
                                    else lib.target.chooseControlList(
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
                                            //game.log('selectedOption' + selectedOption);
                                            if (selectedOption == "弃牌") return 0;
                                            else if (selectedOption == "沉默") return 1;
                                            else if (selectedOption == "翻面") return 2;


                                            return 2;
                                        });


                                    //game.log(lib.target);
                                    //game.log("选择完成");
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

                                    'step 3'
                                    if (event.num < targets.length) event.goto(1);
                                    else game.delayx();
                                    game.log("技能结束");
                                    'step 4'
                                    player.chooseTarget("请选择目标，视为使用【万箭齐发】", [1, Infinity], function (card, player, target) {
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
                                            if (get.type(card) == 'trick' && (get.name(card) == 'nanman' || get.name(card) == 'wanjian' || get.name(card) == 'wanjian9' || get.name(card) == 'manchangyy9' || get.name(card) == 'zhiyuangj9' || get.name(card) == 'lastfriend9' || get.name(card) == 'paohuofg9')) {
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
                                nobracket: true,
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
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
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
                                        var player = get.player();
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

                                                //game.log(get.attitude(target, player));                                
                                                //game.log(get.effect(player, trigger.card, trigger.player, player));                       
                                                //game.log(card.name+get.value(card));                     
                                                return (get.effect(player, trigger.card, trigger.player, player)) - get.value(card);
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
                                        //game.log(JSON.stringify(list));
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
                                        //game.log(JSON.stringify(list));
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
                                        //game.log(JSON.stringify(list));
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
                                    order: 8,
                                    result: {
                                        target(player, target) {
                                            var hs = player.getCards("h");
                                            if (hs.length < 3) return 0;
                                            var bool = false;
                                            for (var i = 0; i < hs.length; i++) {
                                                if (hs[i].number >= 9 && get.value(hs[i]) < 7) {
                                                    bool = true;
                                                    break;
                                                }
                                            }
                                            if (!bool) return 0;
                                            return -1;
                                        },
                                    },
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
                                            if (card.name == "sha" && get.color(card) == "black") return "zerotarget";
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
                                position: "h",
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
                                prompt: "按顺序选择卡牌和角色，并将卡牌交给对应顺序的角色。",
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
                                    lib.target = event.targets.shift();
                                    var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1, lv = 0; if (k < 3) { lv = k * 6 };//远航上限为2
                                    if ((a + b + c + d + e + f + g) >= (lv)) event._result = { index: 0 };
                                    else lib.target.chooseControlList(
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
                                    //game.log(get.translation(lib.target) + "选择完成");
                                    'step 4'
                                    if (result.index == 0) {
                                        game.log("给牌");
                                        player.gainPlayerCard(2, lib.target, true);
                                        event.goto(7);

                                    } else if (result.index == 1) {
                                        game.log("强化");

                                    }

                                    'step 5'
                                    //game.log(lib.target);
                                    lib.target.chooseCard('h', true, '将一张手牌置于' + get.translation(player) + '武将牌上称为Z').set('ai', card => {
                                        return - get.value(card);
                                    });
                                    'step 6'
                                    if (result.cards) {
                                        //game.log(result.cards);
                                        player.addToExpansion(lib.target, 'give', result.cards).gaintag.add('Z');
                                    }
                                    'step 7'
                                    game.log("操作完成");
                                    if (event.num < targets.length) event.goto(3);
                                    else game.delayx();
                                    game.log("技能结束");
                                },
                                ai: {
                                    order: 10,
                                    result: {
                                        target: function (player, target) {
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
                                init: function (player) {//初始化数组，也可以运行事件再加if后面的内容
                                    if (!player.storage._qianghuazhuang) player.storage._qianghuazhuang = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                                },
                                enable: "phaseUse",
                                prompt: "你可以移去一张Z，强化一项或摸两张牌",
                                filter: function (event, player) {
                                    return player.getExpansions('Z').length;

                                },
                                content: function () {
                                    'step 0'
                                    var cards = player.getExpansions('Z'), count = cards.length;
                                    if (count > 0) {
                                        player.chooseCardButton('移去一张Z，然后强化一项。', true, cards).set('ai', function (button) {
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
                                    exp1 = 2;
                                    var choiceList = [];
                                    var list = [];
                                    jieshao = ['后勤保障：上限+' + (a + 1) + '→' + (a + 2) + '远航（用一摸一）标记上限，<br>手牌少于手牌上限1/2时，失去手牌会摸一张牌。防守反击的保障<br>每轮上限1/2/3，在自己的回合重置使用次数。', '技能升级：+' + (b) + '→' + (b + 1) + '，重巡-降低必中攻击限制(杀/黑牌/任意牌)、轻巡-增加无效群体锦囊牌范围(1/2/3)、航母-降低万箭齐发限制(黑桃与梅花/黑桃与梅花与红桃/任意牌);<br>战列舰-增加防护范围(杀造成的伤害/杀和锦囊牌造成的伤害/所有伤害)，导驱-增加射程(2/3/4)、潜艇-降低雷杀条件(红桃/红桃或黑桃/红桃或黑桃或方块);<br>驱逐-增加回避概率(0.25/0.33/0.50)、军辅-增加存牌上限(1/2/3)。', '射程升级：+' + c + '→' + (c + 1) + '武器（出杀）攻击距离，<br>增加出杀范围，虽然不增加锦囊牌距离，但胜在永久', '速射炮管：+' + d + '→' + (d + 1) + '出杀次数，<br>作为连弩的临时替代，进行多刀输出。', '改良推进器：+' + e + '→' + (e + 1) + '武器（被杀）防御距离<br>对手有更远的出杀范围才能对你出杀时，但不能防御锦囊牌。', '物流运输：+' + f + '→' + (f + 1) + '手牌上限，且蝶舞递装备给杀的距离提升，<br>双方状态差距越大，保牌效果越强。', '经验：+' + h + '→' + (player.countMark('Expup1')) + '，将卡牌转为经验，供下次升级。（直接点确定也行）<br>1级技能需要两张牌才能强化，2级技能需要三张牌才能强化。<br>但无名杀不能读取这个界面的文本，导致四点经验即可强化两个不同等级技能']//player.getEquip(1)，定义空数组，push填充它，事件变量可以自定义名字，什么都可以存。game.log('已强化:',a+b+c+d);
                                    var info = lib.skill._qianghuazhuang.getInfo(player);
                                    //game.log(info);
                                    if (info[0] < k && (info[0] + 2 <= info[7] + exp1) && info[0] <= 2) {
                                        list.push('mopaiup');
                                        choiceList.push(['mopaiup', jieshao[0]]);
                                    };
                                    if (info[1] < k && (info[1] + 2 <= info[7] + exp1) && info[1] <= 2 && !player.hasSkill("shixiangquanneng")) {
                                        list.push('jinengup');
                                        choiceList.push(['jinengup', jieshao[1]]);
                                    };
                                    if (info[2] < k && (info[2] + 2 <= info[7] + exp1) && info[2] <= 2) {
                                        list.push('wuqiup');
                                        choiceList.push(['wuqiup', jieshao[2]]);
                                    };//若此值：你强化的比目标多时，+1含锦囊牌防御距离。
                                    if (info[3] < k && (info[3] + 2 <= info[7] + exp1) && info[3] <= 2) {
                                        list.push('useshaup');
                                        choiceList.push(['useshaup', jieshao[3]]);
                                    };
                                    if (info[4] < k && (info[4] + 2 <= info[7] + exp1) && info[4] <= 2) {
                                        list.push('jidongup');
                                        choiceList.push(['jidongup', jieshao[4]]);
                                    };
                                    if (info[5] < k && (info[5] + 2 <= info[7] + exp1) && info[5] <= 2) {
                                        list.push('shoupaiup');
                                        choiceList.push(['shoupaiup', jieshao[5]]);
                                    };
                                    //      if(info[6]<k&&(info[0]+2<=info[7])&&info[6]<2){event.list.push('songpaiup');
                                    //  event.choiceList.push('+'+g+'→'+(g+1)+'给牌次数，<br>提升“先进雷达”技能的送牌范围。');};
                                    if (info[7] <= k && info[7] < 6) {
                                        list.push('Expup');
                                        choiceList.push(['Expup', jieshao[6]]);
                                    };
                                    //game.log(choiceList);
                                    event.first = true;    //存了6个变量，可以导出为button，与textbutton样式，看需求
                                    var xuanze = Math.max(h + 1, 1);
                                    //game.log("xuanze" + xuanze);
                                    player.chooseButton([
                                        '将手牌转化为强化点数强化以下能力；取消将返还卡牌，<br>未使用完的点数将保留，上限默认为1，发动建造技能后提高。',
                                        [choiceList, 'textbutton'],
                                    ]).set('filterButton', button => {
                                        var event = _status.event;
                                        if (ui.selected.buttons) {//for(var i=0;i<event.cao.length;i+=(1)){};测试失败的函数组合game.log(ui.selected.buttons,get.selectableButtons().includes(ui.selected.buttons),get.selectableButtons());游戏无名杀Button的限制，这个代码并没有起到实时计算的作用。
                                            return true; //return xuanze >= player.countMark(ui.selected.buttons[0]) * 0.5 + 1;
                                        }
                                    }).set('ai', function (button) {
                                        var haode = [jieshao[0], jieshao[1]]; var yingji = []; var tunpai = [jieshao[5]];//其实一个例子就行，不如直接if(){return 2;};
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
                                    //game.log(result.links, result.bool)//只能返还这两个，所以更适合技能，更需要循环的方式进行计算。
                                    if (!result.bool) { player.draw(2);/*player.addToExpansion(player, 'give', event.cards).gaintag.add('Z');*/ player.removeMark('Expup1', player.countMark('Expup1')); event.finish(); };//返还牌再计算
                                    if (result.bool) {  //player.addMark('Expup',event.cadechangdu);//先给经验再计算扣除经验升级，随着此项目的升级，花费也越多。通过一个有序的清单，遍历比对返回的内容，来定位要增加的标记/数组。
                                        player.addMark('Expup', player.countMark('Expup1')); player.removeMark('Expup1', player.countMark('Expup1'));
                                        for (var i = 0; i < result.links.length; i += (1)) { if (!result.links.includes('Expup')) { player.addMark(result.links[i], 1); player.removeMark('Expup', 1 + player.countMark(result.links[i])); game.log('数组识别:', result.links[i], '编号', i, '，总编号', result.links.length - 1); } }
                                    };
                                    //    if(event.choiceList.length<event.cao){player.addMark('Expup',1);};从0开始，当介绍数组有内容==选项数组的内容（第i个），就加的简称数组第i个(内容)标签。并通过game.log()调试,在出牌记录中查看执行效果。result.links.includes(event.list[i])&&
                                    'step 4'
                                    var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1; //game.log('结束', a, b, c, d, e, f, g, h, k);
                                    player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h];
                                },
                                ai: {
                                    threaten: 1,
                                },
                            },
                            wuziliangjiangdao: {//军争可用的五子良将纛
                                nobracket: true,
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
                                            var player = get.player();
                                            var rank = 0;
                                            if (skills.includes('new_retuxi') && game.countPlayer(function (current) {
                                                return get.attitude(player, current) < 0 && current.countGainableCards(player, 'h')
                                            }) > 1) rank = 4;
                                            if (skills.includes('gzjieyue') && player.countCards('h', function (card) {
                                                return get.value(card) < 7;
                                            }) > 1) rank = 5;
                                            if (skills.includes('qiaobian') && player.countCards('h') > 4) rank = 6;
                                            if ((get.guozhanRank(player.name1, player) < rank && !player.isUnseen(0)) || (get.guozhanRank(player.name2, player) < rank && !player.isUnseen(1))) return rank + 1 - get.value(card);
                                            return -1;
                                        };
                                    }

                                    'step 1'
                                    player.chooseControl(event.skills).set('ai', function () {
                                        var skills = event.skills;
                                        if (skills.includes('qiaobian') && player.countCards('h') > 3) return 'qiaobian';
                                        if (skills.includes('gzjieyue') && player.countCards('h', function (card) {
                                            return get.value(card) < 7;
                                        })) return 'gzjieyue';
                                        if (skills.includes('new_retuxi')) return 'new_retuxi';
                                        return skills.randomGet();
                                    }).set("prompt", "选择获得其中的一个技能直到下回合开始");
                                    'step 2'
                                    var link = result.control;
                                    player.addTempSkill(link, { player: 'phaseBegin' });
                                    //player.addTempSkill("jianan_eff","jiananUpdate");
                                    game.log(get.translation(player), "获得了技能", "#g【" + get.translation(result.control) + "】");
                                },
                                "_priority": 0,

                            },
                            huhangyuanhu: {
                                nobracket: true,
                                trigger: {
                                    global: "useCardToTargeted",
                                },
                                filter: function (event, player) {
                                    return (event.card.name == 'sha' || event.card.name == 'sheji9') && event.target.isIn();
                                },
                                check: function (event, player) {
                                    return get.attitude(player, event.target) >= 0 || player == event.target;
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
                                    game.delay();
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
                                        return 1;
                                    }, "你可以选择一名其他角色，其可以交给你一张牌并获得你场上的一张牌。").set('ai', function (ard, player, target) {
                                        return get.attitude(player, target) > 0;
                                    });
                                    "step 3"
                                    if (result.bool) {
                                        event.target = result.targets[0];
                                        event.target.chooseCard('he', '交给' + get.translation(player) + '一张牌，并获得其场上的一张牌').set('ai', function (card) {
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
                                        //game.delay();
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
                                    player.chooseCard(get.prompt('shizhibuyu'), '弃置两张颜色相同的牌，令即将受到的伤害-1', 'he', 2, function (card) {
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
                                    player.chooseTarget(get.prompt2('选择一名角色本回合的手牌上限和使用【杀】的次数上限+1')).ai = function (target) {
                                        return get.attitude(player, target) > 0;
                                    }
                                    'step 1'
                                    if (result.bool) {
                                        game.log(get.translation(result.targets[0]) + "矢志不渝");
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
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
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
                                    if (player.isPhaseUsing()) { return false; }
                                    return true;
                                },
                                content: function () {
                                    "step 0"
                                    player.addTempSkill("dajiaoduguibi", "roundstart");
                                    trigger.player.addTempSkill("qianxingtuxi_debuff", 'phaseEnd');
                                },
                                "_priority": 0,
                            },
                            qianxingtuxi_debuff: {
                                usable: 1,
                                trigger: {
                                    source: "damageBegin1",
                                },
                                forced: true,
                                content: function () {
                                    "step 0"
                                    player.judge(function (card) {
                                        if (get.suit(card) == 'spade') {
                                            trigger.num--;
                                            return 1;
                                        }
                                        return 0;
                                    });
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
                                filter: function (event, player) {
                                    return (event.card.name == 'sha' || event.card.name == 'sheji9') && !player.countMark('31jiezhongdui') && _status.currentPhase.hp <= event.target.hp;
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
                                        if (trigger.target.Hp + trigger.target.hujia <= 2 || _status.currentPhase.countCards("h") > 2) {
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
                                audio: "ext:舰R牌将/audio/skill:true",
                                enable: "phaseUse",
                                //prompt: "失去一点体力并视为使用一张基本牌或非延时类锦囊牌（每回合每种牌名限一次）。",
                                filter(event, player) {
                                    for (var i of lib.inpile) {
                                        if ((get.type(i) == "trick" || get.type(i) == "basic") && event.filterCard({ name: i, isCard: true }, player, event)) return true;
                                    }
                                    return false;
                                },
                                chooseButton: {
                                    dialog(event, player) {
                                        var list = [];
                                        for (var i = 0; i < lib.inpile.length; i++) {
                                            var name = lib.inpile[i];
                                            var type = get.type(name);
                                            if (type == 'trick' || type == 'basic') {
                                                if (lib.filter.cardEnabled({ name: name }, player) && !player.getStorage('jujianmengxiang').includes(name)) {
                                                    list.push([get.translation(type), '', name]);
                                                }
                                            }
                                        }
                                        game.log("巨舰梦想列表已生成");
                                        if (list == "") {
                                            game.log("没有可用的牌了！");
                                            player.storage.jujianmengxiang_error = true;
                                            event.finish();
                                        }
                                        return ui.create.dialog('巨舰梦想', [list, "vcard"]);

                                    },
                                    check(button) {
                                        const player = get.player();
                                        if ((lib.inpile.includes("juedouba9") && lib.inpile.includes("manchangyy9") && lib.inpile.includes("jingjixiuli9") && lib.inpile.includes("ewaibuji9"))) {
                                            var recover = 0, lose = 1, players = game.filterPlayer();
                                            //game.log("s" + player.storage.jujianmengxiang);
                                            for (var i = 0; i < players.length; i++) {
                                                if (!player.getStorage('jujianmengxiang').includes('juedouba9') && players[i].hp == 1 && get.damageEffect(players[i], player, player) > 0 && !players[i].hasSha()) {
                                                    //game.log('juedouba9' + (button.link[2] == 'juedouba9'));
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
                                            if (!player.getStorage('jujianmengxiang').includes('manchangyy9') && lose > recover && lose > 0) {
                                                //game.log('manchangyy9' + (button.link[2] == 'manchangyy9'));
                                                return (button.link[2] == 'manchangyy9') ? 1 : -1;
                                            }
                                            else if (!player.getStorage('jujianmengxiang').includes('jingjixiuli9') && lose < recover && recover > 0) {
                                                //game.log('jingjixiuli9' + (button.link[2] == 'jingjixiuli9'));
                                                return (button.link[2] == 'jingjixiuli9') ? 1 : -1;
                                            }
                                            else {
                                                //game.log('ewaibuji9' + (button.link[2] == 'ewaibuji9'));
                                                return (button.link[2] == 'ewaibuji9') ? 1 : -1;
                                            }
                                        } else {
                                            game.log("AI没有可用的牌了！</br>也许您没有正确安装并启用‘舰r美化’卡牌包？");
                                            player.storage.jujianmengxiang_error = true;
                                        }
                                    },
                                    backup(links, player) {
                                        return {
                                            viewAs: {
                                                name: links[0][2],
                                                isCard: true,

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
                                                player.markAuto('jujianmengxiang', [result.card.name]);
                                                player.loseHp(1);
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
                                            if (player.countCards('h') >= player.hp - 1) return -1;
                                            if (player.hp < 3) return -1;
                                            if (player.storage.jujianmengxiang.includes('ewaibuji9')) return -1;
                                            return 1;
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
                                frequent: true,
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
                                    player.loseHp(player.hp);
                                    target.damage(num);

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
                                    event.finish;
                                },
                                prompt: "你装备区内有牌时，你使用的杀无视防具",
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
                                    trigger.cancel();
                                    trigger.player.loseHp(trigger.num);
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
                                usable: 3,
                                init: function (player) {
                                    player.storage.duomianshou = [];

                                },
                                filterCard(card, player) {
                                    var player = get.player();
                                    //var event = _status.event;
                                    //game.log("选择卡牌过滤器" + JSON.stringify(player.storage.duomianshou));
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
                                        var str = "已发动次数：" + get.translation(player.getStat('skill').duomianshou);
                                        return str;
                                    },
                                },
                                position: "hs",
                                discard: false,
                                lose: false,
                                check: function (card) {
                                    return 7.5 - get.value(card);
                                },
                                content: function () {
                                    'step 0'
                                    game.log("记录的卡牌" + JSON.stringify(player.storage.duomianshou));
                                    var card = cards[0];
                                    //var cardtype=get.type(card);
                                    //game.log("卡牌价值" + get.value(card));
                                    // game.log("卡牌类型" + get.type(card));
                                    var list = [];
                                    //game.log(JSON.stringify(lib.cardPile));
                                    for (var i of ui.cardPile.childNodes) {

                                        var name = get.name(i);
                                        var type = get.type(i);
                                        if (type == 'trick' || type == 'basic') {
                                            if (lib.filter.cardEnabled({ name: name }, player) && type != get.type(card) && get.number(card) == get.number(i)) {
                                                //game.log(type);
                                                //game.log(i);
                                                list.push(i);
                                                //list.push(game.createCard2(get.name(i), get.suit(card), get.number(i), get.nature(i)));
                                            }
                                        }
                                    }
                                    if (list == "") {
                                        game.log('牌堆中没有符合要求的牌');
                                        player.getStat('skill').duomianshou -= 1;
                                        player.storage.duomianshou.push(card);
                                        event.finish();
                                    }
                                    player.chooseButton([
                                        '多面手',
                                        [list, 'vcard'],
                                    ]).set('filterButton', button => {
                                        var event = _status.event;
                                        if (ui.selected.buttons) {
                                            return true;
                                        }
                                    }).set('ai', function (button) {
                                        var MostValue = -1;
                                        var MostValuableCard = card;
                                        //game.log(get.translation(button.link) + "价值" + get.value(button.link));

                                        //game.log("最大卡牌价值" + MostValue);

                                        /* if (get.value(button.link) > MostValue) {
                                            MostValuableCard = button.link;
                                            MostValue = get.value(button.link);
                                            //game.log("最有价值的卡牌变更为" + get.name(MostValuableCard));
                                        } */
                                        //game.log("button.link[0]"+JSON.stringify(button.link));
                                        //game.log("MostValuableCard"+JSON.stringify(MostValuableCard));
                                        return (get.value(button.link) || 1);//(button.link == MostValuableCard) ? 1 : -1;

                                    }).set('selectButton', 1);

                                    //var dialog = ui.create.dialog('多面手', [list, 'vcard']);
                                    game.log("多面手列表已生成");


                                    /*player.chooseButton(dialog).ai = function (button) {
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
                                    
                                    }*/
                                    'step 1'
                                    //game.log("结果bool" + result.bool);



                                    if (result && result.bool && result.links[0]) {
                                        //game.log("选中的结果" + JSON.stringify(get.name(result.links[0])));
                                        player.discard(cards[0]);
                                        //player.addTempSkill("duomianshou_1", "useCardToTargeted");
                                        player.chooseUseTarget(true, get.name(result.links[0]));
                                        player.storage.duomianshou = [];
                                    } else {
                                        player.getStat('skill').duomianshou -= 1;
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
                                    if (event.target.hasSkill('quzhudd') || event.target.hasSkill('qingxuncl') || event.target.hasSkill('qianting') || event.target.hasSkill('zhongxunca'))
                                        return event.target != player;
                                },
                                content: function () {
                                    "step 0"
                                    //game.log(get.translation(trigger.target.name) + "多面手触发");
                                    if (!trigger.target.countCards('h')) event._result = { bool: false };
                                    else trigger.target.chooseToDiscard('弃置一张手牌，或令' + get.translation(player) + '摸一张牌').set('ai', function (card) {
                                        var trigger = _status.event.getTrigger();
                                        return -get.attitude(trigger.target, trigger.player) - get.value(card) - Math.max(0, 4 - trigger.target.hp) * 2;
                                    });
                                    "step 1"
                                    if (result.bool == false) player.draw();
                                },
                                ai: {
                                    threaten: 2.6,
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

                                    player.chooseToDiscard(1);
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
                                forced: true,
                                trigger: {
                                    player: "useCardToPlayered",
                                },
                                filter: function (event, player) {
                                    return event.card.name == "sha";
                                },

                                content: function () {
                                    if (trigger.getParent().baseDamage > 1 || player.hp <= 2) {
                                        //game.log("此杀伤害基数" + trigger.getParent().baseDamage);
                                        trigger.target.addTempSkill("qinggang2");
                                        trigger.target.storage.qinggang2.add(trigger.card);
                                        trigger.target.markSkill("qinggang2");
                                    }
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
                                mod: {

                                    targetInRange(card, player, target) {
                                        //game.log(player.getHistory('useCard', evt => get.name(evt.card) == 'sha' || "sheji9"));
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
                                        trigger.getParent().triggeredTargets1.length = 0;//取消所有目标，来自秦宓谏征
                                    }

                                },
                                ai: {
                                    expose: 0.2,
                                    threaten: 1.3,
                                },
                                "_priority": 0,
                                group: ["yishisheji_mianyi"],
                                subSkill: {
                                    mianyi: {
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
                                        audio: "ext:舰R牌将/audio/skill:true",
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
                                    //game.log(targets);
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
                                            dialog.buttons[i].querySelector('.info').innerHTML = getName(targets[i]) + '|' + get.translation(cards[i].suit);
                                        }
                                    }, targets, cards, videoId, player);
                                    await game.asyncDelay(4);
                                    game.broadcastAll('closeDialog', videoId);


                                    const suit = get.suit(cards[0], false);
                                    //game.log("flag0" + suit);
                                    let flag = false;
                                    for (let i = 0; i < targets.length; i++) {
                                        for (let j = 0; j < i; j++) {
                                            if (get.suit(cards[j], false) != get.suit(cards[i], false)) {
                                                //game.log("flag=true" + get.suit(cards[i], false));
                                                flag = true;
                                            }
                                            else {
                                                //game.log("flag=false" + get.suit(cards[i], false));
                                                flag = false;
                                                i = targets.length;//触发上级停止条件，跳出循环

                                                break;
                                            }

                                        }

                                    }
                                    //game.log("花色不同？" + flag);
                                    //game.log(targets);
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
                                nobracket: true,
                                trigger: {
                                    player: "phaseUseBefore",
                                },
                                filter: function (event, player) {
                                    return player.countCards('h') > 0 && !player.hasSkill('jilizhixin3');
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
                                            if (get.attitude(player, target) >= 0) return 1;
                                            return 0;
                                        },
                                    },
                                },
                            },
                            jifu_weicheng: {
                                audio: "ext:舰R牌将/audio/skill:true",
                                nobracket: true,
                                mod: {
                                    maxHandcard: function (player, num) {
                                        return num = (num + 1);
                                    },
                                },
                                trigger: { player: "phaseZhunbeiBegin" },
                                forced: true,
                                content: function () {
                                    "step 0"
                                    player.judge(function (card) {
                                        if (get.color(card) == "red") return 1;
                                        return -1;
                                    });
                                    "step 1"
                                    if (result.color == 'red') {
                                        player.recover(1);
                                        player.draw(1);
                                        //player.addTempSkill('jifu_shanghai', { player: 'phaseJieshuBegin' });
                                    }
                                    if (result.color == 'black') {
                                        player.loseHp(1);
                                    }
                                },
                                "_priority": 0,
                            },
                            jifu_yuanjing: {
                                audio: "ext:舰R牌将/audio/skill:true",
                                nobracket: true,
                                trigger: {
                                    player: "dying",
                                },
                                unique: true,
                                juexingji: true,
                                forced: true,
                                skillAnimation: true,
                                animationColor: "gray",
                                filter: function (event, player) {
                                    if (player.storage.jifu_yuanjing) return false;
                                    return player.hasSkill("jifu_weicheng") && player.hp <= 0;
                                },
                                content: function () {
                                    'step 0'
                                    player.awakenSkill('jifu_yuanjing');
                                    'step 1'
                                    player.gainMaxHp(1);
                                    'step 2'
                                    player.recover(player.maxHp - player.hp);
                                    player.removeSkill('jifu_weicheng');
                                },
                            },
                            jifu_lingwei: {
                                nobracket: true,
                                trigger: {
                                    global: "useCardToPlayered",
                                },
                                audio: "ext:舰R牌将/audio/skill:true",
                                filter: function (event, player) {
                                    return player != event.target && event.targets.length == 1 && get.tag(event.card, 'damage') && player.countCards("hes");
                                },
                                content: function () {
                                    'step 0'
                                    player.chooseToDiscard(1);
                                    'step 1'
                                    if (result.bool == true) {
                                        var str = get.translation(trigger.player);
                                        player.chooseControl('cancel2').set('choiceList', [
                                            '令此牌伤害+1',
                                            '令此牌无法响应',
                                        ]).set('ai', function () {
                                            var player = get.player(), target = _status.event.getTrigger().target;
                                            if (get.attitude(player, trigger.target) > 0) {
                                                //game.log("return'cancel2'");
                                                return 'cancel2';
                                            }
                                            if (trigger.target.Hp + trigger.target.hujia <= 2 && _status.currentPhase.countCards("h") > 1) {
                                                return target.mayHaveShan() ? 1 : 0;
                                            }
                                            return 1;
                                        });
                                    } else {
                                        event.finish();
                                    }
                                    'step 2'
                                    if (result.control != 'cancel2') {
                                        var target = trigger.target;
                                        player.logSkill('jifu_lingwei', target);
                                        if (result.index == 1) {
                                            game.log(trigger.card, '不可被响应');
                                            trigger.directHit.add(target);
                                        }
                                        else {
                                            game.log(trigger.card, '伤害+1');
                                            var map = trigger.getParent().customArgs, id = target.playerid;
                                            if (!map[id]) map[id] = {};
                                            if (!map[id].extraDamage) map[id].extraDamage = 0;
                                            map[id].extraDamage++;
                                        }
                                    }
                                    'step 3'
                                    //game.log(_status.currentPhase.group);
                                    if (_status.currentPhase.hasSkill("quzhudd") || _status.currentPhase.group == 'ΒΜΦCCCP') {

                                        if (_status.currentPhase != player) { _status.currentPhase.draw(1); }
                                        player.draw(1);
                                    }
                                    'step 4'
                                    //game.log(player.hasHistory('sourceDamage'));
                                    if (player.isIn() && player.getHistory('sourceDamage', function (evt) {
                                        return evt.getParent(2) == event.parent;
                                    }).length > 0) {
                                        player.tempBanSkill('jifu_lingwei', 'roundStart');
                                    }


                                },
                                group: "jifu_lingwei_ban",
                                subSkill: {
                                    ban: {
                                        trigger: {
                                            global: "useCardAfter",
                                        },
                                        forced: true,
                                        filter: function (event, player) {
                                            return (player.getHistory('useSkill', function (evt) {
                                                return evt.skill == 'jifu_lingwei';
                                            }).length) && event.targets.length == 1 && event.player.hasHistory('sourceDamage', function (evt) {
                                                return evt.card == event.card;
                                            });
                                        },
                                        content: function () {
                                            player.tempBanSkill('jifu_lingwei', 'roundStart');
                                        },
                                        sub: true,
                                        "_priority": 0,
                                    },
                                },



                                "_priority": 0,

                            },
                            jifu_yuanqin: {
                                nobracket: true,
                                trigger: {
                                    target: "taoBegin",
                                },
                                forced: true,
                                filter(event, player) {
                                    if (event.player == player) { return false; }
                                    //game.log(event.player);
                                    //game.log(event.player.group);
                                    if (event.player != player && (event.player.group == 'RM' || event.player.name == 'tashigan')) { return true; }
                                    return false;
                                },
                                async content(event, trigger, player) {
                                    trigger.baseDamage++;
                                },
                                "_priority": 0,
                            },
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
                                    var allplayers = game.players.sortBySeat(player);
                                    //game.log(allplayers.length);
                                    for (i = 0; i < allplayers.length; i++) {
                                        //game.log(allplayers[i], i);

                                        if (allplayers[i].hasSkill("u47_xinbiao_hp")) {

                                            //game.log(allplayers[i].group);
                                            //game.log(event.player.group);
                                            if (allplayers[i].group == event.player.group) {
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
                                        if (get.attitude(player, target >= 0)) {
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
                                        trigger.player.markAuto("u47_xinbiao_hp", [trigger.player.hp]);
                                        trigger.player.storage.u47_xinbiao_hp.sort();
                                        trigger.player.markAuto("u47_xinbiao_cards", [trigger.player.countCards('h')]);
                                        trigger.player.storage.u47_xinbiao_cards.sort();
                                    }
                                },
                            },
                            u47_xinbiao_hp: {
                                mark: true,
                                marktext: "体力",
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
                                    return game.countPlayer(function (current) {
                                        return current.hasSkill('u47_xinbiao_hp');
                                    }) /*&& get.tag(event.card, 'damage') && !event.player.hasHistory('sourceDamage', function (evt) {
                                        return evt.card == event.card;
                                    });*/
                                },
                                content: function () {
                                    "step 0"
                                    player.chooseTarget(get.prompt2('u47_huxi'), function (card, player, target) {
                                        return target.hasSkill('u47_xinbiao_hp');
                                    }).set('ai', target => {
                                        var att = get.attitude(player, target);
                                        if (att >= 0) {
                                            return (target.storage.u47_xinbiao_hp - target.hp) * 2 + (target.storage.u47_xinbiao_cards - target.countCards("h"));
                                        } else if (att < 0) {
                                            return (target.hp - target.storage.u47_xinbiao_hp) * 2 + (target.countCards("h") - target.storage.u47_xinbiao_cards);
                                        } else {
                                            return 1;
                                        }
                                    });
                                    'step 1'
                                    if (result.bool) {
                                        player.logSkill('u47_huxi');
                                        var target = result.targets[0];
                                        var i1 = target.storage.u47_xinbiao_hp;
                                        target.removeMark('u47_xinbiao_hp', target.countMark('u47_xinbiao_hp'));
                                        var i2 = target.storage.u47_xinbiao_cards;
                                        target.removeMark('u47_xinbiao_cards', target.countMark('u47_xinbiao_cards'));
                                        var hp = target.hp - i1;
                                        var cards = target.countCards("h") - i2;
                                        //game.log("hp", hp, "cards", cards);
                                        //game.log("hp", Math.abs(hp), "cards", Math.abs(cards));
                                        if (hp > 0) {
                                            target.loseHp(Math.abs(hp));

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
                                        player.unmarkAuto("u47_xinbiao_hp", [i1]);
                                        player.unmarkAuto("u47_xinbiao_cards", [i2]);
                                        target.removeSkill('u47_xinbiao_hp');
                                        target.removeSkill('u47_xinbiao_cards');
                                        player.draw(1);
                                    } else {
                                        //game.log("结束结算");
                                        event.finish();
                                    }
                                },
                                ai: {
                                    order: 10,
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
                                    "step0"
                                    var player = map.player, trigger = map.trigger;
                                    //game.log(event.player);
                                    //game.log(trigger.player);

                                    var result1 = yield trigger.player.chooseCard('h', '是否交给' + get.translation(player) + '一张手牌免疫此次伤害并摸一张牌？').set('ai', function (card) { return 7 - get.value(card) });
                                    "step1"
                                    if (result1.bool) {
                                        game.log("给牌免伤");
                                        //game.log(result1.cards);
                                        // game.log(result1.bool);
                                        //game.log(JSON.stringify(result1));
                                        trigger.player.give(result1.cards, player);
                                        trigger.player.draw(1);
                                        trigger.cancel();
                                        if (!trigger.player.hasSkill("u81_zonglie_shanghai")) {
                                            game.log("添加技能");
                                            trigger.player.addTempSkill("u81_zonglie_shanghai");
                                        }
                                        trigger.player.addMark('u81_zonglie_shanghai', 1, false);
                                    } else {
                                        game.log("不给牌结束");
                                        event.finish();
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
                                usable: 3,
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
                                async content(event, trigger, player) {

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
                                    await game.asyncDelay(4);
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
                                                i = targets.length;//触发上级停止条件，跳出循环
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

                                },
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
                                    } else {
                                        //game.log("不满足发动条件");
                                        return false;
                                    }
                                },
                                content: function () {
                                    "step 0"
                                    player.addToExpansion(trigger.cards, 'gain2').gaintag.add('Z');
                                },
                                group: ["z1_Zqulingjian_source", "z1_Zqulingjian_damage", "z1_Zqulingjian_move"],
                                subSkill: {
                                    source: {
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
                                            var result = yield player.chooseTarget('Z驱领舰：请选择移动一张Z', true, 2, (card, player, target) => {
                                                if (ui.selected.targets.length) {
                                                    return true;
                                                }
                                                return target.getExpansions('Z').length;
                                            }).set('targetprompt', ['移走Z', '获得Z']).set('multitarget', true).set('ai', target => {
                                                if (!ui.selected.targets.length) {
                                                    if (get.attitude(player, target) < 0) { return -get.attitude(player, target) }
                                                    else if (player.getExpansions('Z').length > 1 && target.getExpansions('Z').length < 1) {
                                                        return 4 - get.attitude(player, target);
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
                                            }
                                            "step 2"
                                            //game.log(result1.links);
                                            //game.log(result.targets[0]);
                                            var cards = result1.links;
                                            result.targets[0].loseToDiscardpile(cards);
                                            result.targets[1].addToExpansion(cards, 'gain2').gaintag.add('Z');
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
                                    return "移去所有Z，然后防止此伤害";
                                },
                                filter: function (event, player) {
                                    //game.log("检测是否拥有Z标记");
                                    return player.getExpansions('Z').length;
                                },
                                visible: true,
                                check: function (event, player) {
                                    return event.number > 1 || player.hp <= 1;
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
                            Z_gain: {//准备阶段获得一张Z，Z驱测试用。
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
                            },
                            z16_shuileibuzhi: {
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
                                    return "移去一张Z，然后移去判定区内所有花色与之相同的牌";
                                },
                                filter: function (event, player) {
                                    return player.countCards('j') && player.getExpansions('Z').length;
                                },
                                content: function () {
                                    'step 0'
                                    var cards = player.getExpansions('Z'), count = cards.length;
                                    if (count > 0) {
                                        player.chooseCardButton('移去一张Z，然后移去判定区内所有花色与之相同的牌', true, cards).set('ai', function (button) {
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
                            },
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
                                prompt: "你可以将至多两张手牌置于等量角色武将牌上，称为Z。", group: ["z18_weisebaoxingdong_huogong"],
                                subSkill: {
                                    huogong: {
                                        enable: "phaseUse",
                                        prompt: "你可以移去一张Z，观看一名角色的手牌，然后视为使用一张火攻。",
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
                                                player.chooseCardButton('移去一张Z，观看一名角色的手牌，然后视为使用一张火攻。', true, cards).set('ai', function (button) {
                                                    return 1;
                                                });
                                            }
                                            else event.finish();
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
                                            threaten: 1.5,
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
                                    for (i = 0; i < player.getExpansions('Z').length; i++) {
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
                                prompt: "出牌阶段，你可以将任意张手牌置于武将牌上，称为Z，然后将一名角色至多等量张手牌置于其武将牌上，也称为Z。",
                                check: function (card) {
                                    var player = get.player();
                                    if ((36 - player.getExpansions('old_jijun').length) <= player.countCards('h')) return 1;
                                    return 5 - get.value(card);
                                },
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
                                    "unequip_ai": true,
                                    skillTagFilter: function (player, tag, arg) {
                                        if (!arg || !arg.name) return false;
                                        if (!arg.target) return false;
                                        var card = arg.target.getEquip(2);
                                        return card && get.value(card) > 0 && player.hasCard(cardx => {
                                            return lib.filter.cardDiscardable(cardx, player, 'jsrgjuelie_discard') && get.value(cardx) < 5;
                                        });
                                    },
                                },
                            },
                            Z_reward: {
                                direct: true,
                                charlotte: true,
                                trigger: {
                                    player: "damageEnd",
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
                                prompt: "你可以选择一名攻击范围内的角色，将其一张牌置于你的武将牌上，称为Z。", //group: ["z21_tuxi_discard"],
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
                                        prompt: "你可以令其随机弃置一张牌并弃置一张Z",
                                        content: function () {

                                            'step 0'
                                            var cards = player.getExpansions('Z'), count = cards.length;
                                            if (count > 0) {
                                                player.chooseCardButton('移去一张Z', true, cards).set('ai', function (button) {
                                                    return 1;
                                                });
                                            }
                                            else event.finish();
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
                                        prompt: "你可以令其进行一次判定，本回合无法使用或打出与判定牌相同颜色的牌",
                                        content: function () {
                                            'step 0'
                                            var cards = player.getExpansions('Z'), count = cards.length;
                                            if (count > 0) {
                                                player.chooseCardButton('移去一张Z', true, cards).set('ai', function (button) {
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
                                                trigger.source.markAuto('cardsDisabled_color', [get.suit(card)]);
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
                                    player: 'phaseEnd',
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

                                },
                                ai: {

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
                                    tag: {
                                        respond: 1,
                                        respondShan: 1,
                                    },
                                },
                                content: function () {
                                    'step 0'
                                    player.chooseToDiscard(get.prompt('matapanjiaozhijian', trigger.target), "弃置任意张牌，然后指定至多等量名角色为目标", [1, Infinity], 'hes').set('ai', card => {
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
                                            return att * get.damageEffect(target, player, player, "fire");//如果返回值为负数，会对敌方发动，如果返回值为正，会对右方发动
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
                                        get.translation(trigger.player.judging[0]) + '，' + get.prompt('tianshi2'), get.mode() == 'guozhan' ? 'hes' : 'hs', card => {
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
                                    game.asyncDelay(2);
                                },
                                ai: {
                                    rejudge: true,
                                    tag: {
                                        rejudge: 1,
                                    },
                                },
                                "_priority": 0,
                            },
                            jishiyu: {//天妒
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
                            jishiyu1: {
                                nobracket: true,
                                group: ["jishiyu1_use", "jishiyu1_respond"],
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
                                            player.judge("jishiyu1", function (card) {
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
                                            trigger.jishiyu1 = true;
                                            player.judge("jishiyu1", function (card) {
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
                                    player: "damageBegin",
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
                            xiuqi: {
                                audio: "ext:舰R牌将/audio/skill:true",
                                nobracket: true,
                                intro: {
                                    content: function () {
                                        return get.translation(skill + '_info');
                                    },
                                },
                                /*able: 1,
                                trigger: {
                                    global: "useCardAfter",
                                },
                                forced: true,
                                filter(event, player) {
                                    return (event.card.name == "jinjuzy" || event.card.name == "wanjian") && event.player != player && event.cards.someInD();
                                },
                                content() {
                                    player.gain(trigger.cards.filterInD(), "gain2");
                                },
                                ai: {
                                    effect: {
                                        target(card) {
                                            if (card.name == "jinjuzy" || card.name == "wanjian") return [0, 1];
                                        },
                                    },
                                },*/
                                "_priority": 0,
                            },
                            xiuqi2: {
                                nobracket: true,
                                usable: 1,
                                trigger: {
                                    source: "damageSource",
                                },
                                filter(event, player) {
                                    return event.num > 0;
                                },
                                content() {
                                    player.recover(1);
                                },
                            },
                            /*xiuqi2: {//上一版本的修葺
                                name: "修葺",
                                intro: {
                                    marktext: "修葺",
                                    content: function (player) { return ('您的舰种技能【航空】临时提升了一级！在您发动【航空】后该效果消失。'); },
                                },
                                forced: true,
                                trigger: {
                                    player: "phaseUseEnd",
                                },
                                filter: function (event, player) {
                                    var hangmucv = false;
                                    player.getHistory('useSkill', evt => {
                                        if (evt.skill == 'hangmucv') hangmucv = true;
                                    });
                                    return !hangmucv;
                                },
                                content: function () {
                                    "step 0"
                                    game.log('xiuqi2');
                                    var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1;
                                    if (b > 0) {
                                        b = b - 1;
                                        player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h];
                                    }
                                    if (player.hasSkill('xiuqi2')) { player.removeSkill('xiuqi2'); player.removeMark('xiuqi2', player.countMark('xiuqi2')); };
                                },
                                "_priority": 200,
                                sub: true,
                            },*/
                            wanbei: {
                                nobracket: true,
                                forced: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                mod: {
                                    maxHandcard: function (player, num) {
                                        return num = (num + player.countCards("s"));
                                    },
                                },
                                trigger: { player: "phaseUseBegin" },
                                filter: function (event, player) {
                                    return player.countCards('h') > 0;
                                },
                                check: function (card) {
                                    return 17 - get.value(card);
                                },
                                frequent: true,
                                content: function () {//hangmucv
                                    "step 0"
                                    player.chooseCardTarget({
                                        prompt: "弃置两张黑桃或梅花手牌，视为使用【万箭齐发】",
                                        filterCard: { color: 'black' },
                                        position: 'h',
                                        selectCard: 2,
                                        selectTarget: [1, Infinity],
                                        filterTarget: function (card, player, target) {
                                            return player.canUse({ name: 'wanjian' }, target);
                                        },
                                        ai1: function (card) {
                                            return 4 - get.value(card);
                                        },
                                        ai2: function (target) {
                                            return get.effect(target, { name: 'wanjian' }, player, player);
                                        }
                                    });


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
                                    },
                                },
                                intro: {
                                    content: function () {
                                        return get.translation('hangmucv_info');
                                    },
                                },
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
                                    nofire: true,
                                    effect: {
                                        target: function (card, player, target, current) {
                                            if (get.tag(card, 'fireDamage')) return 'zerotarget';
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
                                        target.damage(event.num);
                                        target.draw(event.num);
                                    }
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
                                        var str = "你的攻击距离增加" + get.translation(player.getStorage("zuihouderongyao") + game.dead.length);
                                        return str;
                                    },
                                },
                                mod: {
                                    attackFrom: function (from, to, distance) {
                                        var number = game.dead.length;
                                        return distance = (distance - number - from.storage.zuihouderongyao);
                                    },
                                    maxHandcard: function (player, num) {
                                        var number = game.dead.length;
                                        return num = (num + number);
                                    },
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
                                    player.chooseControl("zuihouderongyao_less", "zuihouderongyao_more", "cancel2", function () {
                                        var player = get.player();
                                        if (player.countCards("h") > 3) {
                                            return "zuihouderongyao_less";
                                        }
                                        if (player.hp - player.countCards("h") > 1) {
                                            return "zuihouderongyao_more";
                                        }
                                        return "cancel2";
                                    });
                                    "step 1";
                                    if (result.control == "zuihouderongyao_less") {
                                        trigger.num--;
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
                                    if (player.getAttackRange() >= 3) {
                                        game.log(trigger.card, '不可被', trigger.target, '响应');
                                        trigger.directHit.add(trigger.target);
                                    }
                                    if (player.isMaxHp()) {
                                        game.log(trigger.card, '对', trigger.target, '的伤害+1');
                                        var map = trigger.getParent().customArgs, id = trigger.target.playerid;
                                        if (!map[id]) map[id] = {};
                                        if (!map[id].extraDamage) map[id].extraDamage = 0;
                                        //game.log(map[id].extraDamage);
                                        map[id].extraDamage++;
                                    }
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
                                            for (i = 0; i < player.getExpansions('hongseqiangwei').length; i++) {
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
                            buju: {
                                nobracket: true,
                                group: ["buju_wuxie", "buju_jiu"],
                            },
                            buju_wuxie: {
                                audio: "ext:舰R牌将/audio/skill:true",
                                nobracket: true,
                                enable: "chooseToUse",
                                viewAs: {
                                    name: "wuxie",
                                    isCard: true,
                                },
                                viewAsFilter: function (player) {
                                    return (!player.hasSkill('buju_wuxie_disable')) && player.countMark('shenfeng') >= 1;
                                },
                                filterCard: () => false,
                                prompt: "视为使用【无懈可击】",
                                selectCard: 0,
                                check: () => 1,
                                precontent: function () {
                                    player.logSkill("buju_wuxie");
                                    player.removeMark('shenfeng', 1);
                                    player.addTempSkill('buju_wuxie_disable', 'roundStart');
                                    player.restoreSkill("yuanjun");
                                    delete event.result.skill;
                                },
                                ai: {
                                    order: 4,
                                    basic: {
                                        useful: [6, 4, 3],
                                        value: [6, 4, 3],
                                    },
                                    result: {
                                        player: 1,
                                    },
                                    expose: 0.2,
                                },
                                sub: true,
                                "_priority": 0,
                            },
                            buju_wuxie_disable: {
                                mark: true,
                                marktext: "禁",
                                intro: {
                                    content: "无懈_本轮已发动",
                                },
                                sub: true,
                            },
                            buju_jiu: {
                                nobracket: true,
                                enable: "chooseToUse",
                                audio: "ext:舰R牌将/audio/skill:true",
                                hiddenCard: function (player, name) {
                                    if (name == "jiu") return player.countMark('shenfeng') >= 1;
                                    return false;
                                },
                                filter: function (event, player) {
                                    return (!player.hasSkill('buju_jiu_disable')) && player.countMark('shenfeng') >= 1 && event.filterCard({ name: "jiu", isCard: true }, player, event);
                                },
                                content: function () {
                                    if (_status.event.getParent(2).type == "dying") {
                                        event.dying = player;
                                        event.type = "dying";
                                    }
                                    player.removeMark('shenfeng', 1);
                                    player.addTempSkill('buju_jiu_disable', 'roundStart');
                                    player.useCard({ name: "jiu", isCard: true }, player);
                                },
                                ai: {
                                    order: 5,
                                    result: {
                                        player: function (player) {
                                            if (_status.event.parent.name == "phaseUse") {
                                                if (player.countCards("h", "jiu") > 0) return 0;
                                                if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) return 0;
                                                if (!player.countCards("h", "sha")) return 0;
                                                var targets = [];
                                                var target;
                                                var players = game.filterPlayer();
                                                for (var i = 0; i < players.length; i++) {
                                                    if (get.attitude(player, players[i]) < 0) {
                                                        if (player.canUse("sha", players[i], true, true)) {
                                                            targets.push(players[i]);
                                                        }
                                                    }
                                                }
                                                if (targets.length) {
                                                    target = targets[0];
                                                } else {
                                                    return 0;
                                                }
                                                var num = get.effect(target, { name: "sha" }, player, player);
                                                for (var i = 1; i < targets.length; i++) {
                                                    var num2 = get.effect(targets[i], { name: "sha" }, player, player);
                                                    if (num2 > num) {
                                                        target = targets[i];
                                                        num = num2;
                                                    }
                                                }
                                                if (num <= 0) return 0;
                                                var e2 = target.getEquip(2);
                                                if (e2) {
                                                    if (e2.name == "tengjia") {
                                                        if (!player.countCards("h", { name: "sha", nature: "fire" }) && !player.getEquip("zhuque")) return 0;
                                                    }
                                                    if (e2.name == "renwang") {
                                                        if (!player.countCards("h", { name: "sha", color: "red" })) return 0;
                                                    }
                                                    if (e2.name == "baiyin") return 0;
                                                }
                                                if (player.getEquip("guanshi") && player.countCards("he") > 2) return 1;
                                                return target.countCards("h") > 3 ? 0 : 1;
                                            }
                                            if (player == _status.event.dying) return 3;
                                        },
                                    },
                                    effect: {
                                        target: function (card, player, target) {
                                            if (card.name == "guiyoujie") return [0, 0.5];
                                        },
                                    },
                                },
                            },
                            buju_jiu_disable: {
                                mark: true,
                                marktext: "禁",
                                intro: {
                                    content: "酒_本轮已发动",
                                },
                                sub: true,
                            },
                            shenfeng: {
                                audio: "ext:舰R牌将/audio/skill:true",
                                nobracket: true,
                                mark: true,
                                marktext: "风",
                                intro: {
                                    name: "风",
                                    content: "拥有$个风标记",
                                },
                                trigger: {
                                    player: "damageEnd",
                                    source: "damageSource",
                                },
                                frequent: true,
                                filter: function (event) {
                                    return event.num > 0;
                                },
                                /*getIndex(event, player, triggername) {
                                    return event.num;
                                },*/
                                content: function () {
                                    event.count = trigger.num;
                                    player.addMark('shenfeng', event.count);
                                },
                                ai: {
                                    maixie: true,
                                    "maixie_hp": true,
                                },
                            },
                            qiangyun: {
                                nobracket: true,
                                mark: true,
                                marktext: "运",
                                intro: {
                                    name: "强运",
                                    content: "强运未发动",
                                },
                                trigger: {
                                    player: "dying",
                                },
                                unique: true,
                                juexingji: true,
                                forced: true,
                                skillAnimation: true,
                                animationColor: "metal",
                                filter: function (event, player) {
                                    if (player.storage.qiangyun) return false;
                                    return player.hasSkill("qiangyun") && player.hp <= 0;
                                },
                                content: function () {
                                    'step 0'
                                    player.awakenSkill('qiangyun');
                                    'step 1'
                                    player.recover(1 - player.hp);
                                    player.removeSkill('qiangyun');
                                },
                                "_priority": 0,
                            },
                            yuanjun: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                unique: true,
                                enable: "phaseUse",
                                skillAnimation: true,
                                animationColor: "gray",
                                mark: true,
                                limited: true,
                                filter: function (event, player) {
                                    return player.countMark('shenfeng') >= 6;
                                },
                                content: function () {
                                    player.awakenSkill('yuanjun');
                                    var i = player.countMark('shenfeng');
                                    player.removeMark('shenfeng', i);
                                    player.chooseUseTarget("wanjian", true);
                                },
                                ai: {
                                    basic: {
                                        order: 8.5,
                                        useful: 1,
                                        value: 5,
                                    },
                                    wuxie(target, card, player, viewer, status) {
                                        let att = get.attitude(viewer, target),
                                            eff = get.effect(target, card, player, target);
                                        if (Math.abs(att) < 1 || status * eff * att >= 0) return 0;
                                        let evt = _status.event.getParent("useCard"),
                                            pri = 1,
                                            bonus = player.hasSkillTag("damageBonus", true, {
                                                target: target,
                                                card: card,
                                            }),
                                            damage = 1,
                                            isZhu = function (tar) {
                                                return (
                                                    tar.isZhu ||
                                                    tar === game.boss ||
                                                    tar === game.trueZhu ||
                                                    tar === game.falseZhu
                                                );
                                            },
                                            canShan = function (tar, blur) {
                                                let known = tar.getKnownCards(viewer);
                                                if (!blur)
                                                    return known.some((card) => {
                                                        let name = get.name(card, tar);
                                                        return (
                                                            (name === "shan" || name === "hufu") &&
                                                            lib.filter.cardRespondable(card, tar)
                                                        );
                                                    });
                                                if (
                                                    tar.countCards("hs", (i) => !known.includes(i)) >
                                                    3.67 - (2 * tar.hp) / tar.maxHp
                                                )
                                                    return true;
                                                if (!tar.hasSkillTag("respondShan", true, "respond", true)) return false;
                                                if (tar.hp <= damage) return false;
                                                if (tar.hp <= damage + 1) return isZhu(tar);
                                                return true;
                                            },
                                            self = false;
                                        if (canShan(target)) return 0;
                                        if (
                                            bonus &&
                                            !viewer.hasSkillTag("filterDamage", null, {
                                                player: player,
                                                card: card,
                                            })
                                        )
                                            damage = 2;
                                        if (
                                            (viewer.hp <= damage || (viewer.hp <= damage + 1 && isZhu(viewer))) &&
                                            !canShan(viewer)
                                        ) {
                                            if (viewer === target) return status;
                                            let fv = true;
                                            if (evt && evt.targets)
                                                for (let i of evt.targets) {
                                                    if (fv) {
                                                        if (target === i) fv = false;
                                                        continue;
                                                    }
                                                    if (viewer == i) {
                                                        if (isZhu(viewer)) return 0;
                                                        self = true;
                                                        break;
                                                    }
                                                }
                                        }
                                        let mayShan = canShan(target, true);
                                        if (
                                            bonus &&
                                            !target.hasSkillTag("filterDamage", null, {
                                                player: player,
                                                card: card,
                                            })
                                        )
                                            damage = 2;
                                        else damage = 1;
                                        if (isZhu(target)) {
                                            if (eff < 0) {
                                                if (target.hp <= damage + 1 || (!mayShan && target.hp <= damage + 2))
                                                    return 1;
                                                if (mayShan && target.hp > damage + 2) return 0;
                                                else if (mayShan || target.hp > damage + 2) pri = 3;
                                                else pri = 4;
                                            } else if (target.hp > damage + 1) pri = 2;
                                            else return 0;
                                        } else if (self) return 0;
                                        else if (eff < 0) {
                                            if (!mayShan && target.hp <= damage) pri = 5;
                                            else if (mayShan) return 0;
                                            else if (target.hp > damage + 1) pri = 2;
                                            else if (target.hp === damage + 1) pri = 3;
                                            else pri = 4;
                                        } else if (target.hp <= damage) return 0;
                                        let find = false;
                                        if (evt && evt.targets)
                                            for (let i = 0; i < evt.targets.length; i++) {
                                                if (!find) {
                                                    if (evt.targets[i] === target) find = true;
                                                    continue;
                                                }
                                                let att1 = get.attitude(viewer, evt.targets[i]),
                                                    eff1 = get.effect(evt.targets[i], card, player, evt.targets[i]),
                                                    temp = 1;
                                                if (Math.abs(att1) < 1 || att1 * eff1 >= 0 || canShan(evt.targets[i]))
                                                    continue;
                                                mayShan = canShan(evt.targets[i], true);
                                                if (
                                                    bonus &&
                                                    !evt.targets[i].hasSkillTag("filterDamage", null, {
                                                        player: player,
                                                        card: card,
                                                    })
                                                )
                                                    damage = 2;
                                                else damage = 1;
                                                if (isZhu(evt.targets[i])) {
                                                    if (eff1 < 0) {
                                                        if (
                                                            evt.targets[i].hp <= damage + 1 ||
                                                            (!mayShan && evt.targets[i].hp <= damage + 2)
                                                        )
                                                            return 0;
                                                        if (mayShan && evt.targets[i].hp > damage + 2) continue;
                                                        if (mayShan || evt.targets[i].hp > damage + 2) temp = 3;
                                                        else temp = 4;
                                                    } else if (evt.targets[i].hp > damage + 1) temp = 2;
                                                    else continue;
                                                } else if (eff1 < 0) {
                                                    if (!mayShan && evt.targets[i].hp <= damage) temp = 5;
                                                    else if (mayShan) continue;
                                                    else if (evt.targets[i].hp > damage + 1) temp = 2;
                                                    else if (evt.targets[i].hp === damage + 1) temp = 3;
                                                    else temp = 4;
                                                } else if (evt.targets[i].hp > damage + 1) temp = 2;
                                                if (temp > pri) return 0;
                                            }
                                        return 1;
                                    },
                                    result: {
                                        player(player, target) {
                                            if (player._wanjian_temp || player.hasSkillTag("jueqing", false, target))
                                                return 0;
                                            player._wanjian_temp = true;
                                            let eff = get.effect(
                                                target,
                                                new lib.element.VCard({ name: "wanjian" }),
                                                player,
                                                target
                                            );
                                            delete player._wanjian_temp;
                                            if (eff >= 0) return 0;
                                            if (
                                                target.hp > 2 ||
                                                (target.hp > 1 &&
                                                    !target.isZhu &&
                                                    target != game.boss &&
                                                    target != game.trueZhu &&
                                                    target != game.falseZhu)
                                            )
                                                return 0;
                                            if (target.hp > 1 && target.hasSkillTag("respondShan", true, "respond", true))
                                                return 0;
                                            let known = target.getKnownCards(player);
                                            if (
                                                known.some((card) => {
                                                    let name = get.name(card, target);
                                                    if (name === "shan" || name === "hufu")
                                                        return lib.filter.cardRespondable(card, target);
                                                    if (name === "wuxie")
                                                        return lib.filter.cardEnabled(card, target, "forceEnable");
                                                })
                                            )
                                                return 0;
                                            if (
                                                target.hp > 1 ||
                                                target.countCards("hs", (i) => !known.includes(i)) >
                                                3.67 - (2 * target.hp) / target.maxHp
                                            )
                                                return 0;
                                            let res = 0,
                                                att = get.sgnAttitude(player, target);
                                            res -= att * (0.8 * target.countCards("hs") + 0.6 * target.countCards("e") + 3.6);
                                            if (get.mode() === "identity" && target.identity === "fan") res += 2.4;
                                            if (
                                                (get.mode() === "guozhan" &&
                                                    player.identity !== "ye" &&
                                                    player.identity === target.identity) ||
                                                (get.mode() === "identity" &&
                                                    player.identity === "zhu" &&
                                                    (target.identity === "zhong" || target.identity === "mingzhong"))
                                            )
                                                res -= 0.8 * player.countCards("he");
                                            return res;
                                        },
                                        target(player, target) {
                                            let zhu = (get.mode() === "identity" && isZhu(target)) || target.identity === "zhu";
                                            if (!lib.filter.cardRespondable({ name: "shan" }, target)) {
                                                if (zhu) {
                                                    if (target.hp < 2) return -99;
                                                    if (target.hp === 2) return -3.6;
                                                }
                                                return -2;
                                            }
                                            let known = target.getKnownCards(player);
                                            if (
                                                known.some((card) => {
                                                    let name = get.name(card, target);
                                                    if (name === "shan" || name === "hufu")
                                                        return lib.filter.cardRespondable(card, target);
                                                    if (name === "wuxie")
                                                        return lib.filter.cardEnabled(card, target, "forceEnable");
                                                })
                                            )
                                                return -1.2;
                                            let nh = target.countCards("hs", (i) => !known.includes(i));
                                            if (zhu && target.hp <= 1) {
                                                if (nh === 0) return -99;
                                                if (nh === 1) return -60;
                                                if (nh === 2) return -36;
                                                if (nh === 3) return -8;
                                                return -5;
                                            }
                                            if (target.hasSkillTag("respondShan", true, "respond", true)) return -1.35;
                                            if (!nh) return -2;
                                            if (nh === 1) return -1.65;
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
                                intro: {
                                    content: "limited",
                                },
                                init: (player, skill) => (player.storage[skill] = false),
                                "_priority": 0,
                            },
                            liaowangtai: {
                                nobracket: true,
                                usable: 1,
                                enable: "phaseUse",

                                filter: function (event, player) {
                                    return game.hasPlayer(function (current) {
                                        return current.countCards("h") && player.inRangeOf(current);
                                    });
                                },
                                check: function (event, player) {
                                    return game.hasPlayer(function (current) {
                                        return current.countCards("h") && player.inRangeOf(current) && get.attitude(player, current);
                                    });
                                },
                                logTarget: function (event, player) {
                                    return game.filterPlayer(function (current) {
                                        return current.countCards("h") && player.inRangeOf(current);
                                    });
                                },
                                check: () => false,
                                content: function () {
                                    "step 0";
                                    event.targets = game
                                        .filterPlayer(function (current) {
                                            return current.countCards("h") && player.inRangeOf(current);
                                        })
                                        .sortBySeat();
                                    "step 1";
                                    var target = event.targets.shift();
                                    if (target.isIn()) {
                                        event.target = target;
                                        player.useCard({ name: "huogong", isCard: true }, target, "liaowangtai");
                                    } else if (targets.length) event.redo();
                                    else event.finish();
                                    "step 2";
                                    if (targets.length) event.goto(1);
                                },
                                ai: {
                                    threaten: 1.1,
                                    order: 10,
                                    expose: 0.2,
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
                                            //game.log("salemu1");
                                            if (!player.getEquip(1)) return false;
                                            //game.log("salemu2");
                                            return 1 || (event.card && (event.card.name == 'sha' || event.card.name == 'sheji9') && event.player.isIn());//&& (event.getParent().name == 'sha' || event.getParent().name == 'sheji9') 
                                        },
                                        content: function () {
                                            //game.log("salemu3");
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
                                    player.storage.oldniepan = true;
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
                                        event.target = result.targets[0];
                                        event.target.chooseControlList([
                                            '视为对' + player.name + '使用一张杀',
                                            '令' + player.name + '从牌堆中获得一张基本牌',
                                        ]).set('prompt', get.prompt('houfu', event.target)).setHiddenSkill('houfu').set('ai', function () {
                                            //var player = get.player();
                                            //game.log(get.attitude(event.target, player));
                                            if (get.attitude(event.target, player) < 0) {
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
                                        if (target.canUse(card, player, false)) {
                                            target.useCard(card, player, false);
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
                            zhanliexianfuchou: {
                                nobracket: true,
                                usable:1,
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
                                    game.log(history);
                                    trigger.num += history;
                                },
                                ai: {
                                    threaten: 0.8,
                                },
                            },
                            pingduzhanhuo: {
                                nobracket: true,
                                group: ["pingduzhanhuo_jieshu", "pingduzhanhuo_zhunbei", "pingduzhanhuo_zhunbei_damage"],
                                subSkill: {
                                    jieshu: {
                                        trigger: { player: "phaseJieshuBegin", },
                                        frequent: true,
                                        filter: function (event, player) {

                                            return player.getHistory("sourceDamage").length == 0;
                                        },
                                        content: function () {
                                            //game.logSkill("pingduzhanhuo");
                                            player.draw(1);

                                        },
                                    },
                                    zhunbei: {
                                        trigger: { player: "phaseZhunbeiBegin", },
                                        frequent: true,
                                        filter: function (event, player) {
                                            return !player.hasSkill("pingduzhanhuo_zhunbei_disable");
                                            //return player.getRoundHistory("damage").length == 0;
                                        },
                                        content: function () {
                                            player.draw(1);
                                        },
                                    },
                                    zhunbei_damage: {
                                        forced: true,
                                        popup: false,
                                        charlotte: true,
                                        trigger: {
                                            player: "damageEnd",
                                        },
                                        filter: function (event, player) {
                                            return !player.hasSkill("pingduzhanhuo_zhunbei_disable");
                                        },
                                        content: function () {
                                            player.addTempSkill("pingduzhanhuo_zhunbei_disable", "phaseJieshuBegin");

                                        },
                                    },
                                    zhunbei_disable: {
                                        charlotte: true,
                                        marktext: "平",
                                        intro: {
                                            name: "平",
                                            content: "平度战火_下个准备阶段不能摸牌",
                                        },
                                    },

                                },

                                "_priority": 0,
                            },
                            mujizhengren: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                unique: true,
                                enable: "phaseUse",
                                skillAnimation: true,
                                animationColor: "gray",
                                mark: true,
                                limited: true,
                                filterCard: true,
                                selectCard: 3,
                                filter: function (event, player) {
                                    return player.countCards("h") >= player.maxHp;
                                },
                                filterTarget: function (card, player, target) {
                                    return true;
                                },
                                content: function () {
                                    player.awakenSkill('mujizhengren');
                                    target.turnOver();
                                },
                                intro: {
                                    content: "limited",
                                },
                                init: (player, skill) => (player.storage[skill] = false),
                                "_priority": 0,
                                ai: {
                                    order: 2,
                                    expose: 0.3,
                                    threaten: 1.2,
                                    result: {
                                        target: function (player, target) {
                                            if (target.hasSkillTag("noturn")) return 0;
                                            if (target.isTurnedOver()) return 2;
                                            return -1;
                                        },
                                    },
                                },
                            },
                            shixiangquanneng: {
                                init: function (player) {
                                    player.storage.shixiangquanneng = [];
                                },
                                nobracket: true,
                                trigger: { global: "roundStart", },
                                forced: true,
                                content() {
                                    "step 0"
                                    if (player.storage.shixiangquanneng.length) {
                                        player.removeSkills(player.storage.shixiangquanneng[0]);

                                    }
                                    player.storage.shixiangquanneng = [];
                                    "step 1"
                                    event.skills = ["junfu", "fangkong2", "hangmucv"]
                                    player
                                        .chooseControl(event.skills)
                                        .set("prompt", "请选择要获得的技能")
                                        .set("ai", function () {
                                            return event.skills.randomGet();
                                        });
                                    "step 2"
                                    player.addTempSkills(result.control, { player: "dieAfter" });
                                    player.storage.shixiangquanneng = [result.control];
                                },
                                "_priority": 0,
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
                                bannedList: ["pangguanzhe", "zhanliebb", "hangmucv", "zhongxunca", "qingxuncl", "quzhudd", "qianting", "junfu", "daoqu", "fangqu", "zhuangjiafh", "dajiaoduguibi", "huokongld", "fangkong2", "shixiangquanneng"],
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
                                            game.log("chuansuohongzha1");
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
                                unique: true,
                                juexingji: true,
                                forced: true,
                                trigger: {
                                    player: "damageBefore",
                                },
                                skillAnimation: true,
                                animationColor: "wood",
                                mark: true,
                                filter: function (event, player) {
                                    if (player.storage.juejingfengsheng) return false;
                                    return player.hp <= event.num;
                                },
                                filterTarget: function (card, player, target) {
                                    return true;
                                },
                                content: function () {
                                    player.awakenSkill('juejingfengsheng');
                                    trigger.cancel();
                                    game.log(player, "免疫了一次伤害。");
                                },
                                intro: {
                                    content: "limited",
                                },
                                init: (player, skill) => (player.storage[skill] = false),
                                "_priority": 0,
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
                                    return player.countCards("h") > event.player.countCards("h") && event.notLink();
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
                                //popup:false,
                                filter: function (event, player) {
                                    return !player.hasSkill("guanjianyiji_disable");
                                },
                                check: function (event, player) {
                                    return -get.attitude(player, event.target) > 0;
                                },
                                content: function () {
                                    "step 0";
                                    player.choosePlayerCard(trigger.target, "he", 1, get.prompt("guanjianyiji", trigger.target), true).set("forceAuto", true);
                                    "step 1";
                                    if (result.bool && result.links.length) {
                                        var target = trigger.target;
                                        target.addToExpansion(result.cards, "giveAuto", target).gaintag.add("guanjianyiji_pojun");
                                        target.addSkill("guanjianyiji_pojun");
                                    }
                                    "step 2";
                                    if (!trigger.target.hasSkill("zhanliebb") || player != _status.currentPhase) {
                                        player.addTempSkill('guanjianyiji_disable', 'phaseEnd');
                                    }
                                },
                                mark: false,
                                sub: true,
                                subSkill: {
                                    disable: {
                                        mark: true,
                                        intro: {
                                            content: "本回合已发动",
                                        },
                                        sub: true,
                                        "_priority": 0,
                                    },
                                    pojun: {
                                        trigger: {
                                            global: "phaseEnd",
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
                                        prompt2: ('当一名角色使用的锦囊牌指定了至少两名角色为目标时，<br>你可弃置一张牌令此牌对距离你一以内的角色无效。'),
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
                                        },//选择事件包含的目标，同trigger的目标。有其他同技能的角色时，ai不要重复选择目标。
                                        ai1: function (card) {
                                            return 7 - get.useful(card);
                                        },//建议卡牌以7为标准就行，怕ai不救队友，所以调高了。同时ai顺次选择卡牌时不要选太多卡牌，要形成持续的牵制。
                                        /* ai2: function (target) {
                                            var trigger = _status.event.getTrigger();
                                            return -get.effect(target, trigger.card, trigger.player, _status.event.player);
                                        },  */
                                        targets: trigger.targets,//这个代码不能照搬到content以外的地方。贯石斧、朱雀羽扇有类似代码。还有recover版的。
                                    });
                                    'step 1'
                                    if (result.bool) {//只能判断你有没有选择，然后给你true与false，没其他文本。
                                        player.discard(result.cards);//前面有卡牌card，可以返回card，不同于仁德主动技能直接写card。
                                        event.target = result.targets;//前面有目标target，可以返回target。
                                        if (event.target != undefined) { for (var i = 0; i < trigger.targets.length; i += (1)) { if (event.target.includes(trigger.targets[i])) { trigger.getParent().excluded.add(trigger.targets[i]); trigger.targets[i].addSkill('fangkong2_aibiexuan'); game.log('取消卡牌目标', trigger.targets[i], '编号', i) } } };//三级选择，集合target是否包含trigger.target。同时测试是否选到了目标。
                                        player.logSkill('duikongzhiwei', event.target);
                                    }//让技能发语音，发历史记录。
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
                                            return !trigger.targets.includes(target) && player.canUse(trigger.card, target);
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
                                force: true,
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
                                    game.delay(2);
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
                                    if (trigger.card && (trigger.card.name == "wanjian" || trigger.card.name == "jinjuzy" || trigger.card.name == "zhiyuangj9") && trigger.source && event.triggername == 'damageEnd') {
                                        player.changeHujia(1);
                                        game.log(get.translation(player), '发动了技能【哨戒】，增加了 1 点护甲值！');
                                    }
                                },
                                group: ["shaojie_ban"],
                                subSkill: {
                                    ban: {
                                        trigger: {
                                            global: "useCard1",
                                        },
                                        filter: function (event, player) {
                                            return event.card.name == "wanjian" || event.card.name == "jinjuzy" || event.card.name == "zhiyuangj9";
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
                                    return get.attitude(player, event.player) > 2;
                                },
                                prompt2: function (event, player) {
                                    return "你可以代替" + get.translation(event.player) + "承受此伤害，然后摸x张牌，将x张手牌交给一名其他角色或弃置(x为你已损失的体力值)。若目标为航母，此伤害值-1。";
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
                                            prompt: "选择" + (player.maxHp - player.hp) + "张牌，交给一名其他角色。",
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
                                    threaten: 1.5,
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
                                        game.delay(0, time);
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
                                    game.delay();
                                },
                            },
                            maliyanaliehuoji: {
                                audio: "ext:舰R牌将/audio/skill:true",
                                nobracket: true,
                                trigger: {
                                    global: ["phaseDiscardEnd"],
                                },
                                filter(event, player) {
                                    var cards = [];
                                    event.player.getHistory("lose", function (evt) {
                                        if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) cards.addArray(evt.cards2);
                                    });
                                    return cards.length > 0;
                                },
                                frequent: true,
                                content: function () {
                                    "step 0"
                                    //var cards = Array.from(ui.discardPile.childNodes);
                                    var cards = [];
                                    trigger.player.getHistory("lose", evt => {
                                        if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) cards.addArray(evt.cards2.filterInD("d"));
                                    });
                                    //game.log(get.translation(cards));
                                    /* var history = game.getGlobalHistory("cardMove", evt => {
                                        if (evt.name == "lose") return evt.position == ui.discardPile;
                                        return evt.name == "cardsDiscard";
                                    });
                                    for (var i = history.length - 1; i >= 0; i--) {
                                        var evt = history[i];
                                        var cards2 = evt.cards.filter(card => {
                                            return cards.includes(card);
                                        });
                                        if (cards2.length) {
                                            gains.addArray(cards2);
                                            cards.removeArray(cards2);
                                        }
                                        if (!cards.length) break; 
                                    }*/
                                    //game.log(gains);
                                    if (cards.length) {
                                        player.chooseButton(["选择至多三张牌？", cards], [1, 3], true).set("ai", get.buttonValue);
                                    } else event._result = { bool: false };
                                    "step 1"
                                    if (result.links.length) {
                                        event.cards2 = result.links;
                                        var suits = event.cards2.map(card => get.suit(card));
                                        var uniqueSuits = [...new Set(suits)];
                                        event.suitNum = uniqueSuits.length;
                                        player.chooseTarget(1, get.prompt("maliyanaliehuoji"), "令一名其他角色使用区域内任意张花色数为" + event.suitNum + "的牌交换", function (card, player, target) {
                                            if (player == target) { return false; }
                                            var cards1 = target.getCards('hej');
                                            var suits3 = cards1.map(card => get.suit(card));
                                            var uniqueSuits3 = [...new Set(suits3)];
                                            return uniqueSuits3.length >= event.suitNum;
                                        }).ai = function (target) {
                                            var player = get.player();
                                            if (target.countCards("j") == 0 && target.countCards("h") < event.cards2.length) { return -get.attitude(player, target); }
                                            return get.attitude(player, target);
                                        };
                                    }
                                    "step 2"
                                    if (result.bool) {
                                        event.targets = result.targets[0];
                                        //game.log(event.targets);
                                        var targetCards = event.targets.getCards('hej');
                                        event.targets.chooseCardButton('选择区域内任意张花色数为' + event.suitNum + '的牌与' + get.translation(event.cards2) + '交换', targetCards, [1, Infinity], true, function (card, player) {
                                            return true;
                                        })
                                            .set("ai", function (button) {
                                                //game.log(get.translation(button.link));
                                                //game.log(get.value(button.link));
                                                let player = get.player();
                                                if (ui.selected.buttons.length >= event.cards2.length) return 0;
                                                if (get.position(button.link) == 'j') { return 12; }
                                                if (player.hp < 3) return 7 - get.value(button.link, player);
                                                return 10 - get.value(button.link, player);
                                            })
                                            .set("filterButton", function (button) {
                                                var filtersuit = [...new Set(ui.selected.buttons.map(card => get.suit(card)))]
                                                if (filtersuit.length >= event.suitNum && !filtersuit.includes(get.suit(button.link))) { return false; }
                                                return true;
                                            });
                                    }
                                    "step 3"
                                    if (result.bool) {
                                        event.targets.gain(event.cards2, "gain2");
                                        event.targets.discard(result.links);
                                        if (event.cards2.length - result.links.length > 0) {
                                            var fireDamage = event.cards2.length - result.links.length;
                                            event.targets.damage(fireDamage, "fire");
                                        }
                                    } else {
                                        event.finish();
                                    }
                                },
                            },
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
                                        if (player.storage.tebiekongxi) return '你的回合内，当你因使用打出或弃置而一次性失去两张或更多牌时，你可以将其中一张牌置于武将牌上，称为“战”(至多三张)。';
                                        return '你的回合外，当你因使用打出或弃置而一次性失去两张或更多牌时，你可以将其中一张牌置于武将牌上，称为“战”(至多三张)。';
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
                                        game.log("阳");
                                        return _status.currentPhase == player;
                                    } else {
                                        game.log("阴");
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
                                        player.chooseCardButton('将一张牌置于你的武将牌上，称为“战”，<br>至多为三<br>这些牌可以当作无懈可击使用', true, trigger.getl(player).cards2).set('ai', function (card) {
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
                                        force: true,
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
                            jianduixunlian: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                enable: "phaseUse",
                                usable: 1,
                                filter: function (event, player) {
                                    return player.countCards("h") > 0 && game.hasPlayer(current => lib.skill.spshangyi.filterTarget(null, player, current));
                                },
                                filterTarget: function (card, player, target) {
                                    return target != player && target.countCards("h") > 0;
                                },
                                content: function () {
                                    player.viewHandcards(target);
                                    var handcards1 = player.getCards("h");
                                    var handcards2 = target.getCards("h");
                                    var list1 = [], list2 = [];
                                    for (var i of handcards1) {
                                        list1.add(get.type2(i, player));
                                        if (list1.length >= 3) break;
                                    }
                                    for (var i of handcards2) {
                                        list2.add(get.type2(i, player));
                                        if (list2.length >= 3) break;
                                    }
                                    if (list1.length != list2.length) { player.draw(1); }
                                },
                                ai: {
                                    order: 6,
                                    result: {
                                        player: 1,
                                        target: function (player, target) {
                                            if (target.hasSkillTag("noh")) return 0;
                                            return -0.5;
                                        },
                                    },
                                },
                                "_priority": 0,
                            },
                            aizhi: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                enable: "phaseUse",
                                usable: 1,
                                content: function () {
                                    'step 0'
                                    event.num = 0;
                                    event.targets = game.filterPlayer(function (current) {
                                        var player = get.player();
                                        return current != player && player.inRange(current) && current.countCards("h") > 0;
                                    }).sortBySeat();
                                    'step 1'
                                    lib.target = event.targets.shift();
                                    game.log("展示牌角色" + get.translation(lib.target));
                                    player.choosePlayerCard(lib.target, "h", true);
                                    'step 2'
                                    event.card = result.cards[0];
                                    player.showCards(event.card, get.translation(player) + "对" + get.translation(lib.target) + "发动了【爱知】");
                                    let cardtype = get.type(event.card);
                                    //game.log(cardtype);
                                    'step 3'
                                    if (get.type(event.card) != "trick") {
                                        event.goto(5);
                                    } else {
                                        player.chooseTarget("可以令一名角色弃置一张牌，然后其视为使用" + get.translation(result.cards) + "(若不能使用则只弃牌)").set("ai", function (target) {
                                            var player = get.player();
                                            if (target.hasUseTarget(result.cards, null, false)) { return get.attitude(player, target); }
                                            else { return get.attitude(player, target); }
                                            return 0;
                                        });
                                    }
                                    'step 4'
                                    if (result.bool) {
                                        game.log("弃牌角色" + get.translation(result.targets[0]));
                                        result.targets[0].chooseToDiscard(1, true);
                                        result.targets[0].chooseUseTarget(
                                            {
                                                name: event.card.name,
                                                isCard: true,
                                            },
                                            "请选择" + get.translation(event.card) + "的目标",
                                            false
                                        );
                                    }
                                    'step 5'
                                    if (event.num < targets.length) { event.goto(1); }
                                    else {
                                        game.log("技能结束");
                                    }
                                },
                            },
                            longgu: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                global: "longgu_skill",
                            },
                            longgu_skill: {
                                trigger: {
                                    player: "phaseZhunbeiBegin",
                                },
                                filter: function (event, player) {
                                    if (game.hasPlayer(function (current) {
                                        return current.hasSkill("longgu") && current.isAlive();
                                    })
                                    ) {
                                        if (!(player.hasSkill("longgu_basic") || player.hasSkill("longgu_trick"))) {
                                            return player == game.zhu || player.group == "ROCN";
                                        }
                                    }
                                },
                                check: function (event, player) {
                                    return player.hp <= 2;
                                },
                                content: function () {
                                    'step 0'
                                    player.skip('phaseDraw');
                                    var str = get.translation(trigger.player);
                                    player.chooseControl().set('choiceList', [
                                        '不能成为基本牌的目标',
                                        '不能成为普通锦囊牌和延时锦囊牌的目标',
                                    ]).set('ai', function () {
                                        if (player.countCards("h", card => get.type(card) === "trick") > 1) return 0;
                                        return 1;
                                    });
                                    'step 1'
                                    if (result.control) {
                                        if (result.index == 1) {
                                            game.log(get.translation(player), '不能成为普通锦囊牌和延时锦囊牌的目标');
                                            player.addSkill("longgu_trick");
                                        }
                                        else if (result.index == 0) {
                                            game.log(get.translation(player), '不能成为基本牌的目标');
                                            player.addSkill("longgu_basic");
                                        }
                                    }
                                }
                            },
                            longgu_trick: {
                                mod: {
                                    targetEnabled(card, player, target, now) {
                                        //game.log(get.translation(card));
                                        //game.log(get.type(card));
                                        if (get.type(card) == "trick" || get.type(card) == "delay") return false;
                                    },
                                },
                                force: true,
                                direct: true,
                                trigger: {
                                    player: "useCard",
                                },
                                filter: function (event, player) {
                                    return get.type(event.card) == "trick" || get.type(event.card) == "delay";
                                },
                                content: function (event, player) {
                                    player.removeSkill("longgu_trick");
                                },
                                "_priority": 0,
                            },
                            longgu_basic: {
                                mod: {
                                    targetEnabled(card, player, target, now) {
                                        //game.log(get.translation(card));
                                        //game.log(get.type(card));
                                        if (get.type(card) == "basic") return false;
                                    },
                                },
                                force: true,
                                direct: true,
                                trigger: {
                                    player: "useCard",
                                },
                                filter: function (event, player) {
                                    return get.type(event.card) == "basic";
                                },
                                content: function (event, player) {
                                    player.removeSkill("longgu_basic");
                                },
                                "_priority": 0,
                            },
                            jianghun: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                trigger: {
                                    player: "die",
                                },
                                direct: true,
                                skillAnimation: true,
                                animationColor: "wood",
                                forceDie: true,
                                content: function (event, player) {
                                    game.addGlobalSkill("jianghun_effect");
                                    player.$fullscreenpop("江魂！", "thunder");
                                },
                            },
                            jianghun_effect: {
                                mod: {
                                    globalTo(from, to, distance) {
                                        if (to.group == "ROCN" || to.group == "PLAN") {
                                            return distance + 1;
                                        }
                                    },
                                },
                                forced: true,
                                silent: true,
                            },
                            zhizhanzhige: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                trigger: {
                                    player: "phaseZhunbeiBegin",
                                },
                                check: function (event, player) {
                                    return 1;
                                },
                                content: function (event, player) {
                                    player.draw(2);
                                    player.turnOver();
                                    trigger.getParent("phase").phaseList.splice(trigger.getParent("phase").num + 1, 0, "phaseUse");
                                },
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
                            zhongleizhuangjiantuxi: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                skillAnimation: true,
                                animationColor: "wood",
                                juexingji: true,
                                unique: true,
                                trigger: {
                                    player: "phaseZhunbeiBegin",
                                },
                                filter(event, player) {
                                    return player.hp <= 1 && !player.storage.zhongleizhuangjiantuxi;
                                },
                                forced: true,
                                content() {
                                    "step 0"
                                    player.awakenSkill(event.name);
                                    player.addSkill("zhongleizhuangjiantuxi_count");
                                    player
                                        .chooseTarget(get.prompt("zhongleizhuangjiantuxi"), "对一名其他角色视为使用三张雷杀", function (card, player, target) {
                                            return target != player;
                                        })
                                        .set("ai", function (target) {
                                            var player = get.player();
                                            return get.damageEffect(target, player, player, "thunder") * (target.hp == 1 ? 2 : 1);
                                        });
                                    "step 1"
                                    if (result.bool) {
                                        var target = result.targets[0];
                                        for (var i = 0; i < 3; i++) {
                                            player.useCard({ name: "sha", isCard: true }, target);
                                        }
                                    } else event.finish();
                                    "step 2"
                                    var list = player.getStorage("zhongleizhuangjiantuxi_count").filter(function (target) {
                                        return 1;
                                    });
                                    //game.log(list);
                                    if (list.length) {
                                        player.removeSkill("zhongleizhuangjiantuxi_count");
                                        event.finish();
                                    } else {
                                        player.discard(player.getCards("he"));
                                        player.removeSkill("zhongleizhuangjiantuxi_count");
                                    }
                                },
                                ai: {
                                    threaten(player, target) {
                                        if (target.hp == 1) return 2;
                                        return 0.5;
                                    },
                                    maixie: true,
                                    effect: {
                                        target(card, player, target) {
                                            if (!target.hasFriend()) return;
                                            if (target.hp === 2 && get.tag(card, "damage") == 1 && !target.isTurnedOver() && _status.currentPhase !== target && get.distance(_status.currentPhase, target, "absolute") <= 3) return [0.5, 1];
                                            if (target.hp === 1 && get.tag(card, "recover") && !target.isTurnedOver() && _status.currentPhase !== target && get.distance(_status.currentPhase, target, "absolute") <= 3) return [1, -3];
                                        },
                                    },
                                },
                                "_priority": 0,
                                subSkill: {
                                    count: {
                                        sub: true,
                                        trigger: {
                                            global: "dyingBegin",
                                        },
                                        silent: true,
                                        charlotte: true,
                                        filter: function (event, player) {
                                            return event.getParent("zhongleizhuangjiantuxi").player == player;
                                        },
                                        content: function () {
                                            player.markAuto("zhongleizhuangjiantuxi_count", [trigger.player]);
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
                            huofu: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                count: function () {
                                    var num = 0;
                                    game.countPlayer2(function (current) {
                                        current.getHistory('lose', function (evt) {
                                            if (evt.position == ui.discardPile) {
                                                for (var i = 0; i < evt.cards.length; i++) {
                                                    if (get.color(evt.cards[i]) == 'red' && get.type(evt.cards[i]) == 'basic') num++;
                                                }
                                            }
                                        })
                                    });
                                    return num;
                                },
                                direct: true,
                                force: true,
                                filter: function (event, player) {
                                    return lib.skill.huofu.count() > 0;

                                },
                                trigger: {
                                    player: "phaseJieshuBegin",
                                },
                                content: function () {
                                    if (lib.skill.huofu.count() > 0) player.addTempSkill("huofu_mianyi", { player: 'phaseBegin' })
                                },
                                group: "huofu_mianyi",
                                subSkill: {
                                    mianyi: {
                                        audio: "ext:舰R牌将/audio/skill:2",
                                        trigger: {
                                            player: "damageBegin4",
                                        },
                                        forced: true,
                                        filter: function (event, player) {
                                            return get.color(event.card) == "red";
                                        },
                                        content: function () {
                                            trigger.cancel();
                                        },
                                        ai: {
                                            effect: {
                                                target: function (card, player, target, current) {
                                                    if (get.color(card) == "red" && get.tag(card, "damage")) {
                                                        return "zeroplayertarget";
                                                    }
                                                },
                                            },
                                        },
                                        sub: true,
                                    },
                                },
                            },
                            xunqian: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                trigger: {
                                    player: "useCard",
                                },
                                frequent: true,
                                filter: function (event) {
                                    return get.type(event.card, "trick") == "trick" && event.card.isCard;
                                },
                                init: function (player) {
                                    player.storage.xunqian = 0;
                                },
                                content: function () {
                                    "step 0";
                                    player.draw();
                                    "step 1";
                                    player.chooseControl().set('choiceList', [
                                        '弃置一张牌',
                                        '将任意张牌交给一名其他角色',
                                    ]).set('prompt', get.prompt('xunqian')).setHiddenSkill('xunqian').set('ai', function () {
                                        var player = get.player();
                                        if (game.countPlayer(function (current) {
                                            return get.attitude(player, current) > 0;
                                        })) { return 1; }
                                        return 0;

                                    });
                                    "step 2";
                                    if (result.index == 1) {
                                        player.chooseCardTarget({
                                            filterCard: function (card) {
                                                return get.itemtype(card) == "card";
                                            },
                                            filterTarget: lib.filter.notMe,
                                            selectCard: [1, Infinity],
                                            prompt: "请选择要分配的卡牌和目标",
                                            ai1: function (card) {
                                                if (!ui.selected.cards.length) return 1;
                                                return 0;
                                            },
                                            ai2: function (target) {
                                                var player = _status.event.player,
                                                    card = ui.selected.cards[0];
                                                var val = target.getUseValue(card);
                                                if (val > 0) return val * get.attitude(player, target) * 2;
                                                return get.value(card, target) * get.attitude(player, target);
                                            },
                                        });
                                    }
                                    else if (result.index == 0) {
                                        player.chooseToDiscard(1);
                                        event.finish();
                                    }
                                    "step 3";
                                    if (result.bool) {
                                        //game.log(get.translation(result.cards));
                                        //game.log(get.translation(result.targets));
                                        player.give(result.cards, result.targets[0]);
                                    }
                                },
                                ai: {
                                    threaten: 1.4,
                                    noautowuxie: true,
                                },

                                intro: {
                                    content: "本回合手牌上限+#",
                                },
                                "_priority": 0,
                            },
                            jinyangmaozhishi: {
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
                            },
                            zhengzhansihai: {
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
                                            if (target.hasFriend()) {
                                                if ((get.tag(card, "damage") == 1 || get.tag(card, "loseHp")) && target.hp == target.maxHp) return [0, 1];
                                            }
                                        },
                                    },
                                    threaten: function (player, target) {
                                        if (target.maxHp == 1) return 4;
                                        if (target.maxHp == 2) return 2;
                                        return 1;
                                    },
                                },
                            },
                            shuqinzhiyin: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                round: 1,
                                trigger: {
                                    global: ["useSkillAfter", "logSkill"],
                                },
                                filter: function (event, player) {
                                    //game.log(get.translation(event.type));
                                    //game.log(get.translation(event.player));
                                    return event.type == "player" && event.player != player;
                                },
                                check(event, player) {
                                    return get.attitude(player, event.player) > 0;
                                },
                                content() {
                                    "step 0";
                                    player
                                        .chooseToDiscard(2, "hes", get.prompt("shuqinzhiyin"))
                                        .set("ai", function (card) {
                                            return 5 - get.value(card);
                                        });
                                    "step 1";
                                    if (result.bool) {
                                        player.chooseTarget(get.prompt2("shuqinzhiyin"), function (card, player, target) {
                                            return target != player;
                                        })
                                            .set("ai", function (target) {
                                                var player = get.player();
                                                var skills = target.getOriginalSkills();
                                                var list = [];
                                                for (var i = 0; i < skills.length; i++) {
                                                    var info = get.info(skills[i]);
                                                    if (typeof info.usable == "number") {
                                                        if (target.hasSkill("counttrigger") && target.storage.counttrigger[skills[i]] && target.storage.counttrigger[skills[i]] >= 1) {
                                                            list.push(skills[i]);
                                                        }
                                                        if (typeof get.skillCount(skills[i]) == "number" && get.skillCount(skills[i]) >= 1) {
                                                            list.push(skills[i]);
                                                        }
                                                    }
                                                    if (info.round && target.storage[skills[i] + "_roundcount"]) {
                                                        list.push(skills[i]);
                                                    }
                                                    if (target.storage[`temp_ban_${skills[i]}`]) {
                                                        list.push(skills[i]);
                                                    }
                                                    if (target.awakenedSkills.includes(skills[i])) {
                                                        list.push(skills[i]);
                                                    }
                                                }
                                                //game.log(list);
                                                if (target.isDamaged() || list.length >= 1) {
                                                    return get.attitude(player, target);
                                                }
                                                return 0;
                                            });
                                    }
                                    "step 2";
                                    if (result.bool) {
                                        var target = result.targets[0];
                                        var skills = target.getStockSkills(true, true);
                                        game.expandSkills(skills);
                                        var resetSkills = [];
                                        var suffixs = ["used", "round", "block", "blocker"];
                                        for (var skill of skills) {
                                            var info = get.info(skill);
                                            if (typeof info.usable == "number") {
                                                if (target.hasSkill("counttrigger") && target.storage.counttrigger[skill] && target.storage.counttrigger[skill] >= 1) {
                                                    delete target.storage.counttrigger[skill];
                                                    resetSkills.add(skill);
                                                }
                                                if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
                                                    delete target.getStat("skill")[skill];
                                                    resetSkills.add(skill);
                                                }
                                            }
                                            if (info.round && target.storage[skill + "_roundcount"]) {
                                                delete target.storage[skill + "_roundcount"];
                                                resetSkills.add(skill);
                                            }
                                            if (target.storage[`temp_ban_${skill}`]) {
                                                delete target.storage[`temp_ban_${skill}`];
                                            }
                                            if (target.awakenedSkills.includes(skill)) {
                                                target.restoreSkill(skill);
                                                resetSkills.add(skill);
                                            }
                                            for (var suffix of suffixs) {
                                                if (target.hasSkill(skill + "_" + suffix)) {
                                                    target.removeSkill(skill + "_" + suffix);
                                                    resetSkills.add(skill);
                                                }
                                            }
                                        }
                                        if (resetSkills.length) {
                                            var str = "";
                                            for (var i of resetSkills) {
                                                str += "【" + get.translation(i) + "】、";
                                            }
                                            game.log(target, "重置了技能", "#g" + str.slice(0, -1));
                                        }

                                        target.recover(1);
                                    }
                                },
                                "_priority": 0,


                            },
                            yixinyiyi: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                enable: ["chooseToRespond", "chooseToUse"],
                                mod: {
                                    cardUsable: function (card) {
                                        var check1 = game.countPlayer(function (current) {
                                            return current.isZhu2() && current.getDamagedHp() >= 2;
                                        });
                                        if (card.storage && card.storage.yixinyiyi && check1) return Infinity;
                                    },
                                    targetInRange(card, player, target, now) {
                                        var check2 = game.countPlayer(function (current) {
                                            return current.isZhu2() && current.getDamagedHp() >= 1;
                                        });
                                        if (card.storage && card.storage.yixinyiyi && check2) return true;
                                    },
                                },
                                filterCard(card) {
                                    return true;
                                },
                                position: "hes",
                                viewAs: {
                                    name: "sha",
                                    nature: "thunder",
                                    storage: {
                                        yixinyiyi: true,
                                    },
                                },
                                viewAsFilter(player) {
                                    if (!player.countCards('hes')) return false;
                                },
                                prompt: "将一张牌当雷杀使用",
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
                                group: ["yixinyiyi_damage"],
                                subSkill: {
                                    damage: {
                                        trigger: { player: "useCard" },
                                        filter: function (event, player) {
                                            var check3 = game.countPlayer(function (current) {
                                                return current.isZhu2() && current.getDamagedHp() >= 3;
                                            });
                                            return get.name(event.card, false) == 'sha' && event.card.storage && event.card.storage.yixinyiyi && check3;
                                        },
                                        forced: true,
                                        silent: true,
                                        popup: false,
                                        content: function () {
                                            if (!trigger.baseDamage) trigger.baseDamage = 1;
                                            trigger.baseDamage += 1;
                                            game.log(trigger.card, '的伤害值', '#y+' + 1);
                                        },
                                    },
                                },
                            },
                            buxiuzhanshi: {
                                nobracket: true,
                                audio: "ext:舰R牌将/audio/skill:true",
                                usable: 1,
                                enable: "phaseUse",
                                init: function (player) {
                                    if (typeof player.storage.buxiuzhanshi === 'undefined') player.storage.buxiuzhanshi = 0;
                                },
                                filter: function (event, player) {
                                    return player.countCards("h") > 0;
                                },
                                filterCard: true,
                                filterTarget: function (card, player, target) {
                                    return player != target && player.canUse("juedou", target, false);
                                },
                                selectCard: [1, Infinity],
                                selectTarget: [1, Infinity],
                                position: "h",
                                filterOk: function () {
                                    return ui.selected.cards.length == ui.selected.targets.length;
                                },
                                check: function (card) {
                                    var player = get.player();
                                    if (ui.selected.cards.length >= game.countPlayer(current => {
                                        return current != player && get.attitude(player, current) <= 0;
                                    })) return 0;
                                    if (card.name == "sha" || card.name == "sheji9") {
                                        return player.countCards("h", function (card) { return card.name == "sha" || card.name == "sheji9"; }) - ui.selected.cards.length;
                                    }
                                    return 7 - get.value(card);
                                },
                                prompt: "弃置任意张手牌并视为对等量角色使用决斗",
                                complexSelect: true,
                                multitarget: true,
                                multiline: true,
                                delay: false,
                                contentBefore: function () {
                                    event.getParent()._buxiuzhanshi_targets = targets.slice();
                                },
                                content: function () {
                                    "step 0"
                                    var targets = event.getParent()._buxiuzhanshi_targets;
                                    var card = {
                                        name: "juedou",
                                        isCard: true,
                                    };
                                    player.useCard(card, targets, false);
                                    /* for (var i = 0; i < targets.length; i++) {
                                        var target = targets[i];
                                        var card = {
                                            name: "juedou",
                                            isCard: true,
                                        };
                                        if (player.canUse(card, target, false)) {
                                            player.useCard(card, target, false);
                                        }
                                    }  */
                                    "step 1"
                                    player.getHistory('sourceDamage', function (evt) {
                                        var player = get.player();
                                        //game.log("不朽战士" + evt.getParent("buxiuzhanshi").name + get.translation(evt.player) + get.translation(player));
                                        if (evt.getParent("buxiuzhanshi").name == "buxiuzhanshi") {
                                            player.addMark("buxiuzhanshi", 1);
                                            return 1;
                                        }
                                        return 0;
                                    });
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
                                },
                                mark: true,
                                intro: {
                                    name: "不朽战士",
                                    content: function (storage, player) {
                                        var str = "下回合摸牌增加" + get.translation(player.getStorage("buxiuzhanshi"));
                                        return str;
                                    },
                                },
                                group: ["buxiuzhanshi_draw"],
                                subSkill: {
                                    draw: {
                                        trigger: {
                                            player: "phaseDrawBegin2",
                                        },
                                        frequent: true,
                                        filter(event, player) {
                                            return !event.numFixed && player.countMark("buxiuzhanshi") > 0;
                                        },
                                        async content(event, trigger, player) {
                                            var drawNum = player.countMark("buxiuzhanshi");
                                            trigger.num += drawNum;
                                            player.removeMark("buxiuzhanshi", drawNum);
                                        },
                                        ai: {
                                            threaten: 1.3,
                                        },
                                    },
                                },
                            },
                            //在这里添加新技能。

                            //这下面的大括号是整个skill数组的末尾，有且只有一个大括号。


                        },
                        translate: {
                            skilltest: "测试武将",
                            liekexingdun: "列克星敦",
                            qixichicheng: "奇袭赤城",
                            wufenzhongchicheng: "五分钟赤城",
                            qiye: "企业",
                            bisimai: "俾斯麦", misuli: "密苏里",
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
                            mingsike: "明斯克",
                            baiyanjuren: "百眼巨人",
                            "u1405": "u1405",
                            changchun: "长春",
                            "1913": "1913战巡",
                            yinghuochong: "萤火虫",
                            jifu: "基辅",
                            "u47": "u47",
                            "u81": "u81",
                            "z1": "z1",
                            "z16": "z16",
                            "z18": "z18",
                            "z17": "z17",
                            "z21": "z21",
                            "z22": "z22",
                            kewei: "可畏",
                            hude: "胡德",
                            shiyu: "时雨",
                            dujiaoshou: "独角兽",
                            gesakeren: "哥萨克人",
                            kente: "肯特",
                            shengwang: "声望",
                            shenluopujun: "什罗普郡",
                            lafei: "拉菲",
                            sp_lafei: "SP拉菲",
                            yi25: "伊25",
                            jiate: "基阿特",
                            salemu: "萨勒姆",
                            "u505": "u505",
                            jialifuniya: "加利福尼亚",
                            getelan: "哥特兰",
                            rangbaer: "让巴尔",
                            dafeng: "大凤",
                            dahuangfeng: "大黄蜂",
                            biaoqiang: "标枪",
                            yuekecheng: "约克城",
                            shengqiaozhi: "圣乔治",
                            weiershiqinwang: "威尔士亲王",
                            qiuyue: "秋月",
                            luodeni: "罗德尼",
                            weilianDbote: "威廉D波特",
                            xianghe: "翔鹤",
                            ruihe: "瑞鹤",
                            yuhei: "羽黑",
                            jinqu: "进取",
                            sp_aisaikesi: "sp埃塞克斯",
                            boerzhanuo: "波尔扎诺",
                            jialibodi: "加里波第",
                            ninghai: "宁海",
                            sp_ninghai: "SP宁海",
                            yiahua: "衣阿华",
                            dajingbeishang: "大井北上",
                            wugelini: "乌戈里尼",
                            xukufu: "絮库夫",
                            yaergushuishou: "亚尔古水手",
                            mist_dujiaoshou: "MIST独角兽",
                            mist_xiawu: "MIST夏雾",
                            mist_shanhuhai: "MIST珊瑚海",

                            quzhudd: "驱逐", "quzhudd_info": "",
                            qingxuncl: "轻巡", "qingxuncl_info": "",
                            zhongxunca: "重巡", "zhongxunca_info": "",
                            zhanliebb: "战列", "zhanliebb_info": "",
                            daoqu: "导驱", "daoqu_info": "你的攻击范围增加2+2X(x为技能强化次数),出牌阶段限一次，你可以弃置一张武器/装备牌，对一名角色使用一张不可响应的炮火覆盖。",
                            fangqu: "防驱",
                            daodan: "防空导弹",
                            zhandouji: "战斗机",
                            "fangqu_info": "游戏开始时/出牌阶段开始时，将至多1/2/3张手牌放到武将牌上.称为防空导弹。锦囊牌被使用时，你可以移去一枚防空导弹，令其无效。",
                            "fangqu_wuxie": "发射防空导弹",
                            hangmucv: "航母", "hangmucv_info": "(可强化)你的出牌阶段开始时，<br>你可以将2张：零级强化，黑桃或梅花手牌；一级强化，黑桃或梅花或红桃手牌；二级强化，任意手牌。当作万箭齐发对你选择的任意个目标使用",
                            qianting_xiji: "袭击", "qianting_xiji_info": "每回合限两次，将♦/♥牌当做顺手牵羊，♣/♠牌当做兵粮寸断使用<br>你使用的锦囊牌可以对距离你2以内的角色使用。",
                            qianting: "潜艇", "qianting_info": "（可强化）准备阶段，你可以弃置一张红桃或黑桃/红桃或黑桃或方片/牌，视为对一个目标使用一张雷杀。",
                            qianting_jiezi: "截辎", "qianting_jiezi_info": "其他角色跳过阶段时，你摸一张牌",
                            "_yuanhang": "远航", "_yuanhang_info": "受伤时手牌上限+1<br>当你失去手牌后，且手牌数<手牌上限值时，你摸一张牌。使用次数上限0/1/2次，处于自己的回合时+1，每回合回复一次使用次数。<br>当你进入濒死状态时，你摸一张牌，体力上限大于二时需减少一点体力上限，额外摸一张牌；死亡后，你可以按自己的身份，令一名角色摸-/2/1/1（主/忠/反/内）张牌。",
                            kaishimopao: "开始摸牌", "kaishimopao_info": "<br>，判定阶段你可以减少一次摸牌阶段的摸牌，然后在回合结束时摸一张牌。",
                            "_jianzaochuan": "建造", "_jianzaochuan_info": "限一次，当你进行了至少一次强化后<br>1.出牌阶段<br>你可以弃置3张不同花色的牌，提升一点血量上限与强化上限。<br>2.当你濒死时，<br>你可以弃置4张不同花色的牌，回复一点体力。<br>（未开启强化，则无需强化即可使用建造。未开启建造，则强化上限仅为1级。）",
                            "_qianghuazhuang": "强化装备",
                            "_qianghuazhuang_info": "你可以消耗经验，或弃置二至四张牌，选择一至两个永久效果升级。<br>（摸牌、技能、攻击范围、防御距离、手牌上限）每回合限一次。<br>一级强化消耗两点经验，二级强化消耗三点经验",//装备牌代表两张牌
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
                            dajiaoduguibi: "规避",
                            "dajiaoduguibi_info": "（可强化）你需要打出闪时可以进行一次判定，判定结果为：零级强化，方块/一级强化，桃、闪、方块/二级强化，红桃或方块，视为你打出了一张闪。",
                            "rendeonly2": "仁德界改",
                            "rendeonly2_info": "给实际距离为2的队友最多两张牌，一回合限2次，给出第二张牌时，你视为使用一张基本牌。可强化",
                            zhiyangai: "直言",
                            "zhiyangai_info": "令一名目标角色摸一张牌并展示之。<br>若为装备牌，则其可以选择是否装备。<br>可强化(每强化一次技能，便+1技能的目标数)",
                            "fangkong2": "防空",
                            "fangkong2_info": "当一名角色使用的锦囊牌指定了至少两名角色为目标时，<br>你可弃置两张牌令此牌对距离你为1/3/5的任意名角色无效,可强化",
                            huokongld: "火控雷达",
                            "huokongld_info": "（可强化）当你使用的【杀】被目标角色使用的【闪】抵消时，你可以弃置：零级，一张杀/一级，一张黑色牌/二级，一张牌，令此【杀】依然对其造成伤害。",
                            "ganglie_gai": "刚烈弱化",
                            "ganglie_gai_info": "每当你受到1点伤害后，若你的体力不大于2，你可以弃置x张牌并进行判定。<br>若结果不为红桃，则伤害来源选择执行一项：1.弃置x+1张手牌，2.选择交给你一张牌;3.失去一点体力(无视护甲)。<br>若你先弃置了两张牌，则判定失败时随机获得目标的一张牌;判定成功后，目标不选择弃牌时会额外失去一张牌。可强化",
                            "zhongpaoduijue": "对决",
                            "zhongpaoduijue_info": "当你无法使用杀时，你可以指定一个目标，弃置最多（2/3/4）张相同花色的牌，并与目标摸等量的牌,<br>然后你与目标轮流视为对对方使用一张决斗,<br>直到双方的决斗次数超过2n，n为你弃置的牌数。强化以-1对方摸的牌",
                            "zhuangjiafh": "装甲防护",
                            "zhuangjiafh_info": "（可强化）每回合限一次，当你受到：零级强化，杀的伤害/一级强化，杀和锦囊牌的伤害/二级强化，任意伤害时,若你没有用护甲承受过此次伤害，你可以获得1点护甲。",
                            "misscoversha": "回出杀数", "misscoversha_info": "杀被回避会回复当回合出杀次数",
                            "xianjinld": "先进雷达",
                            "xianjinld_info": "可以选择一个增益：1.攻击，实际距离此角色为1的队友：武器攻击距离+1;但防御杀的距离-1，队友的摸牌阶段多摸一张牌。或：2.防御距离+1，但是攻击距离-1，自己的摸牌阶段少抽一张牌。",
                            "kanpolimitai": "制空权",
                            "kanpolimitai_info": "每轮限一次，你可以将一张黑色手牌当无懈可击使用。可强化",
                            kaifa: "开发装备",
                            "kaifa_info": "出牌阶段，你可以展示一张未强化过的【诸葛连弩】或标准包/军争包/SP包中的防具牌，然后对其进行强化。当你处于濒死状态时，你可以重铸一张防具牌，然后将体力回复至1点。",
                            huijiahuihe: "额外回合",
                            "huijiahuihe_info": "当你有护甲时，你可以移除所有护甲并进行一个额外的回合；额外回合的摸牌数等于护甲数。此回合没有输出时，摸一张牌。",
                            junfu: "军辅船",
                            "junfu_info": "（可强化）出牌阶段结束时,你可以把至多1/2/3张手牌存于武将牌上，如手牌般使用。<br>其他角色回合开始时，你可以把存储的牌交给ta，然后你摸一张牌。",
                            manchangzhanyi: "漫长战役", "manchangzhanyi_info": "每轮限一次，你受到锦囊牌的伤害时，你免疫此伤害。你攻击范围内的其他角色的准备阶段，你可以弃置其一张手牌。",
                            manchangzhanyi_mianyi: "漫长战役", "manchangzhanyi_mianyi_info": "",
                            guzhuyizhi: "孤注一掷", "guzhuyizhi_info": "准备阶段，你可以摸两张牌并弃置所有手牌，然后摸等量的牌，如此做，你的其他技能失效直到你的下回合开始，你计算与其他角色的距离-1，杀使用次数+1，你的手牌上限等于本回合造成的伤害。",
                            guzhuyizhi2: "孤注一掷", "guzhuyizhi2_info": "",
                            shuileizhandui_1: "水雷战队", "shuileizhandui_1_info": "",
                            shuileizhandui: "水雷战队", "shuileizhandui_info": "你可以交给一名角色任意张牌。若你是本回合第一次发动本技能，你可以从牌堆和弃牌堆获得一张雷杀。你没有手牌时，不能成为杀的目标。",
                            dumuchenglin: "独木成林", "dumuchenglin_info": "你获得【规避】。当场上没有其他航母时，杀使用次数+1，你于你的回合对其他角色造成的第一次伤害时此伤害+1。",
                            dumuchenglin_2: "独木成林2", "dumuchenglin_2_info": "杀使用次数+1",
                            bigE: "大E", bigE_info: "你使用的第一张杀不能被响应。受到你使用杀造成的伤害的角色手牌上限-1直到其回合结束",
                            xiangrui: "祥瑞", "xiangrui_info": "每名玩家的回合限一次，当你受到伤害前，你可以进行判定，判定结果为黑桃，免疫此次伤害，然后获得[祥瑞]标记。",
                            yumian: "御免", "yumian_info": "锁定技，结束阶段，你移除所有[祥瑞]标记。你可以选择距你1以内的目标，让其失去一点体力并摸两张牌。若你失去了一个或以上的祥瑞标记，你可以选择的目标不受距离限制",
                            hangkongzhanshuxianqu: "航空战术先驱", "hangkongzhanshuxianqu_info": "你使用转化的锦囊牌结算后，你可以展示牌堆顶的x张牌，获取其中花色各不相同的牌(x为你指定的目标数，至多为4)",
                            gaosusheji: "高速射击", "gaosusheji_info": "转换技，出牌阶段你使用的第一张牌为：阳：基本牌时；阴：普通锦囊牌时。你可以令此牌额外结算一次。",
                            qixi_cv: "奇袭", "qixi_cv_info": "限定技，出牌阶段，你可以令所有其他角色依次选择一项:1你弃置其区域内的两张牌，2本回合不能使用或打出手牌，3翻面。然后你可以视为使用【近距支援】。",
                            rand: "随机数", "rand_info": "遇事不决？扔一个骰子吧。该技能可以生成1~6的随机数",
                            duikongfangyu: "对空防御", "duikongfangyu_info": "锁定技，你发动防空时技能等级视为满级。你发动[防空]仅需弃置一张牌。",
                            zhudaojiandui: "柱岛舰队", "zhudaojiandui_info": "锁定技，每当你使用或打出一张非虚拟非转化的基本牌，你获得一个[柱]标记。你可以移去三个柱标记视为使用一张不计入次数限制的杀。",
                            sawohaizhan: "萨沃海战", "sawohaizhan_info": "出牌阶段各限一次。你可以将一张红牌当做当作洞烛先机使用,你可以将一张黑牌当作雷杀使用。",
                            sawohaizhan_1: "雷杀", "sawohaizhan_1_info": "你可以将一张黑牌当作雷杀使用。",
                            sawohaizhan_2: "洞烛先机", "sawohaizhan_2_info": "你可以将一张红牌当作洞烛先机使用（洞烛先机：观星2，然后摸两张牌）。",
                            qingyeqingyeqing: "青叶青叶青", "qingyeqingyeqing_info": "当你成为牌的唯一目标时，你可以指定一名其他角色，其可以选择弃置一张非基本牌令此牌对你无效。",
                            mingyundewufenzhong: "命运的五分钟", "mingyundewufenzhong_info": "你可以跳过判定和摸牌阶段，视为使用一张雷杀或火杀，你可以弃置一张装备牌并跳过出牌阶段，视为使用一张雷杀或火杀，你可以跳过弃牌阶段并翻面，视为使用一张雷杀或火杀。",
                            wufenzhong1: "命运的五分钟", "wufenzhong1_info": "你可以跳过判定和摸牌阶段，视为使用一张雷杀或火杀",
                            wufenzhong2: "命运的五分钟", "wufenzhong2_info": "你可以弃置一张装备牌并跳过出牌阶段，视为使用一张雷杀或火杀",
                            wufenzhong4: "命运的五分钟", "wufenzhong4_info": "你可以跳过弃牌阶段并翻面，视为使用一张雷杀或火杀。",
                            qijianshashou: "旗舰杀手", "qijianshashou_info": "出牌阶段限一次，你可以与一名角色进行拼点，若你赢，本回合你与该角色距离视为1，你对该目标使用杀无次数限制且伤害+1，若你没赢，你跳过出牌阶段和弃牌阶段。",
                            qijianshashou_1: "旗舰杀手", "qijianshashou_1_info": "",
                            zhanxianfangyu: "战线防御", "zhanxianfangyu_info": "每名角色回合限一次，若你没有装备防具，你成为黑色杀的目标时，取消之。每回合限一次，距你为1的角色成为杀的目标时，你可以弃置一张牌并代替该名角色成为此杀的目标。",
                            zhanxianfangyu1: "战线防御", "zhanxianfangyu1_info": "",
                            Zqujingying: "Z驱菁英", "Zqujingying_info": "出牌阶段限一次，你可以把任意张牌交给等量名角色，获得牌的角色依次选择:其交给你一张牌作为Z或令你获得其两张牌。",
                            Z_qianghua: "Z强化", "Z_qianghua_info": "出牌阶段，你可以移去一张Z,强化一项。",
                            huhangyuanhu: "护航援护", "huhangyuanhu_info": "其他角色成为杀的唯一目标时，你可以交给其一张牌并获得其区域内的一张牌；当你成为杀的唯一目标时，你可以选择一名目标，其可以选择交给你一张牌并获得你区域内的一张牌",
                            shizhibuyu: "矢志不渝", "shizhibuyu_info": "当你受到伤害时，你可以弃置两张颜色相同的牌令此伤害-1。你受到伤害时进行判定，若结果为红色，你摸一张牌，黑色，你弃置一名角色的一张牌。 当你的判定牌生效后，你可以令一名角色使用杀次数+1和手牌上限+1直到你的下回合开始。",
                            shizhibuyu1: "矢志不渝", "shizhibuyu1_info": "",
                            shizhibuyu1_eff: "矢志不渝", "shizhibuyu1_eff_info": "直到回合结束，手牌上限+1，出杀次数+1",
                            qianxingtuxi: "潜行突袭", "qianxingtuxi_info": "你使用牌无视距离限制；若你在出牌阶段以外造成伤害，你于此轮获得规避且受到伤害的角色下个回合第一次造成伤害时须进行一次判定，如果为黑桃，此次伤害-1。",
                            qianxingtuxi_debuff: "被袭", "qianxingtuxi_debuff_info": "锁定技，你第一次造成伤害时须进行一次判定，如果为黑桃，此次伤害-1。",
                            "31jiezhongdui": "31节中队", "31jiezhongdui_info": "每每回合限一次，有角色使用杀指定目标后，若其体力值小于等于目标，你可以选择一项:1令此杀不可响应;2令此杀伤害+1;3令当前回合角色摸一张牌。",
                            jujianmengxiang: "巨舰梦想", "jujianmengxiang_info": "出牌阶段，你可以失去一点体力，视为使用一张基本牌或非延时锦囊牌（每回合每种牌名限一次）。",
                            sidajingang: "四大金刚", "sidajingang_info": "你使用杀造成伤害后，你可以与目标拼点，若你赢你获得其一张牌。你发动[远航摸牌]后可以摸一张牌。",
                            jiujingzhanzhen: "久经战阵", "jiujingzhanzhen_info": "出牌阶段限两次，你可以重铸一张红牌。结束阶段，你可以选择X名角色，其各选择一项:1摸一张牌，2令你获得一点护甲(至多为一)。X为你本回合弃置的红牌数。",
                            wuweizhuangji: "无畏撞击", "wuweizhuangji_info": "限定技，出牌阶段，若你的体力值最少，你可以失去所有体力，然后对一名角色造成x点伤害(x为你当前的体力上限)",
                            zhongzhuangcike: "重装刺客", "zhongzhuangcike_info": "你装备区内有牌时，你使用的杀无视防具；你即将造成的伤害视为体力流失",
                            duomianshou: "多面手", "duomianshou_info": "出牌阶段限三次，你可以弃置一张手牌，视为使用一张牌堆中点数相同的不同类型的牌(不受次数限制），若牌堆中没有相同点数的牌名，重置该技能发动次数，且本回合不能再使用该点数发动技能.",/*每回合限一次，你对其他中小型船使用转化牌时，其选择弃置一张牌或令你摸一张牌。*/
                            duomianshou_1: "多面手", "duomianshou_1_info": "每回合限一次，你对其他中小型船使用转化后的牌时其选择一项：1弃置一张牌，2令你摸一张牌。",
                            kaixuan: "凯旋", "kaixuan_info": "你使用杀指定唯一目标时，你可弃置一张牌，令此杀伤害+1。",
                            changge: "长歌", "changge_info": "锁定技，你使用杀即将造成的伤害≥2时，或你的体力值≤2时，你的杀无视防具。",
                            xiongjiaqibin: "胸甲骑兵", "xiongjiaqibin_info": "锁定技，你计算与座次比你靠后的角色距离-1。",
                            yishisheji: "意式设计", "yishisheji_info": "每轮限一次，你可以免疫一次牌造成的伤害。你使用杀指定唯一目标时可以进行判定，若判定结果不为红桃，此杀基础伤害+1，否则此杀无效。出牌阶段你使用或打出的第一张杀无距离限制。",
                            jueshengzhibing: "决胜之兵", "jueshengzhibing_info": "你使用杀指定有护甲的目标时，你可以弃置其一张牌；你使用锦囊牌时，你可以摸一张牌。若你以此法摸或弃置了总计两张牌，你结束出牌阶段，反之，回合结束时你获得[智愚]直到下回合开始。",
                            zhanfu: "战斧", "zhanfu_info": "你手牌数为场上最多时，你使用杀无视距离",
                            xinqidian: "新起点", "xinqidian_info": "出牌阶段限一次，你可以选择至多3名角色，你与这些角色各展示一张牌:若展示的牌花色均不相同，每人摸1张牌;否则，参与展示牌的角色计算与其他角色距离-1直至其的下个回合结束。",
                            jilizhixin: "激励之心", 'jilizhixin_info': "若你的宝物栏为空，你视为装备着'侦察机'。你可以弃一张牌并跳过出牌阶段，令一名角色获得一个额外回合。",
                            hangkongzhanshuguang: "航空战曙光", "hangkongzhanshuguang_info": "出牌阶段限一次，你可以令一名角色摸一张牌。若目标是航母，改为摸两张牌。",

                            jifu_weicheng: "未成", 'jifu_weicheng_info': "锁定技，你的手牌上限+1。准备阶段你进行判定，若结果为红色：你回复一点体力，摸一张牌。若结果为黑色，你流失一点体力。",
                            jifu_yuanjing: "愿景", 'jifu_yuanjing_info': "觉醒技，当你进入濒死时，体力上限+1，将体力恢复至上限，然后失去未成",
                            jifu_lingwei: "领卫", 'jifu_lingwei_info': "当有角色使用伤害类牌指定唯一目标时，你可以弃置一张牌，然后选择一项：1、令此牌伤害+1。2、此牌无法被响应。若此牌的使用者是驱逐或S国船，则你与此牌的使用者各摸一张牌。（若此牌的使用者是你自己，则只摸一张牌）若因“领卫”技能效果造成了伤害，则本轮失去“领卫”。",
                            jifu_yuanqin: "远亲", 'jifu_yuanqin_info': "锁定技，塔什干与I国船使你回复体力时，回复的体力值+1。",
                            u81_langben: "狼奔", u81_langben_info: "你可以将一张非基本牌交给本回合未以此法选择过的角色，令其他角色计算与其的距离为1直到其下个回合开始时。",
                            u81_langben_target: "狼奔目标", u81_langben_target_info: "其他角色计算与你距离为1。",
                            u47_xinbiao: "信标", u47_xinbiao_info: "有角色体力值减少后，你可以弃置一张黑色牌并记录该角色当前的体力值与手牌数。每个势力只能有一名角色被记录。",
                            u47_xinbiao_hp: "信标", u47_xinbiao_hp_info: "信标",
                            u47_xinbiao_cards: "信标", u47_xinbiao_cards_info: "信标",
                            u47_huxi: "虎袭", u47_huxi_info: "出牌阶段限一次，你可以将一名被记录的角色的体力值和手牌数调整为记录值，然后摸一张牌并移除记录，",
                            u81_zonglie_shanghai: "纵猎", u81_zonglie_shanghai_info: "",
                            u81_zonglie: "纵猎", u81_zonglie_info: "每回每名角色限一次，你对其他角色造成伤害时，若其手牌与你不相等，其可以交给你一张手牌并摸一张牌，防止此伤害，如此做，其本回合不能响应你的牌。",
                            u81_xunyi: "巡弋", u81_xunyi_info: "锁定技，每回合限三次，你攻击范围内的角色在回合外获得牌时，若其不处于濒死状态，你与其各展示一张牌，若类型相同，视为对其使用一张雷杀。",
                            z1_Zqulingjian: "Z驱领舰", z1_Zqulingjian_info: "当G国驱逐舰受到/造成伤害后，你可以将造成伤害的牌置于武将牌上称为“Z”。有其他角色受到雷属性伤害时，你可以弃置一张“Z”，令此伤害-1；当你造成雷属性伤害时，你可以弃置一张“Z”，令此伤害+1。准备阶段，你可以移动一张“Z”。(全局)有Z的角色受到伤害时，可以移去所有Z，防止此伤害。",
                            z1_Zqulingjian_source: "Z驱领舰_加伤", z1_Zqulingjian_source_info: "当你造成雷属性伤害时，你可以弃置一张“Z”，令此伤害+1。",
                            z1_Zqulingjian_damage: "Z驱领舰_减伤", z1_Zqulingjian_damage_info: "有其他角色受到雷属性伤害时，你可以弃置一张“Z”，令此伤害-1。",
                            z1_Zqulingjian_move: "Z驱领舰_移动Z", z1_Zqulingjian_move_info: "准备阶段，你可以移动一张“Z”。",

                            z16_lianhuanbaopo: "连环爆破", z16_lianhuanbaopo_info: "你的黑色【杀】可以当做【雷杀】使用，你的其他黑色牌可以当做【杀】使用或打出，你使用【雷杀】时无距离次数限制防具。",
                            z16_lianhuanbaopo_sha: "黑牌当杀", z16_lianhuanbaopo_sha_info: "你的黑色牌可以当做【杀】使用或打出",
                            z16_shuileibuzhi: "水雷布置", z16_shuileibuzhi_info: "当你每回合第一次造成伤害时，你可以将牌堆顶的一张牌置于武将牌上，称为Z。出牌阶段，你可以将一张Z当作兵粮寸断使用。(全局)有Z的角色准备阶段，可以弃置一张Z并弃置判定区内所有与此牌花色相同的牌。",
                            z16_shuileibuzhi_bingliang: "兵粮寸断", z16_shuileibuzhi_bingliang_info: "出牌阶段，你可以将一张Z当作兵粮寸断使用。",
                            z18_weisebaoxingdong: "威瑟堡行动", z18_weisebaoxingdong_info: "每回合限一次，你可以将至多两张手牌置于等量角色的武将牌上，称为Z。出牌阶段，你可以移去一张Z，观看一名角色的手牌，然后视为使用一张火攻。(全局)武将牌上有Z的角色出牌阶段使用杀的次数+1；使用与Z中包含类型相同的牌时须弃一张牌(没有则不弃)，然后可以弃置一张与使用的牌相同牌名的Z。",
                            z18_weisebaoxingdong_huogong: "火攻", z18_weisebaoxingdong_huogong_info: "你可以移去一张Z，观看一名角色的手牌，然后视为使用一张火攻。",
                            z17_naerweikejingjie: "纳尔维克警戒", z17_naerweikejingjie_info: "出牌阶段，你可以将任意张手牌置于武将牌上，称为Z，然后将一名角色至多等量张手牌置于其武将牌上，也称为Z。(全局)对有Z的角色造成伤害时，可以摸一张牌。",
                            z21_tuxi: "突袭", z21_tuxi_info: "出牌阶段开始时，你可以选择攻击范围内的一名角色，将其一张牌置于你的武将牌上，称为Z。（全局）若你有Z，你使用牌指定其他角色为目标后，你可以令其随机弃置一张牌，然后移去一张Z",
                            z22_tuxixiawan: "突袭峡湾", z22_tuxixiawan_info: "出牌阶段开始时，你可以将任意角色一张牌置于自己的武将牌上，称为Z。(全局）其他角色造成伤害后，若你有Z，你可以移去一枚Z，进行一次判定，令当前回合角色不能使用或打出与判定牌花色相同的牌直到回合结束。",
                            cardsDisabled_color: "不能使用_颜色", cardsDisabled_color_info: "你不能使用或打出对应颜色的手牌。",
                            matapanjiaozhijian: "马塔潘角之箭", matapanjiaozhijian_info: "你使用锦囊牌指定目标后，你可以弃置任意张牌，令等量目标不可响应此牌。",
                            zhongbangtuxi: "重磅突袭", zhongbangtuxi_info: "限定技，出牌阶段，你可以弃置任意张红色牌对等量角色各造成一点火焰伤害。",
                            huangjiahaijunderongyao: "皇家海军的荣耀", huangjiahaijunderongyao_info: "锁定技，你对其他角色造成伤害或受到其他角色的伤害时，你弃置对方的一张牌，若此牌点数小于等于受伤角色的手牌数，此伤害+1",
                            huangjiaxunyou: "皇家巡游", huangjiaxunyou_info: "锁定技，你计算与其他角色距离-1.",
                            tianshi: "天使", tianshi_info: "主公技，你的判定牌生效前，E国势力的角色可以打出一张红牌代替之",
                            tianshi2: "天使2", tianshi2_info: "拥有“天使”的角色判定牌生效前，E国势力的角色可以打出一张红牌代替之",
                            jishiyu: "及时雨", jishiyu_info: "每回合限三次，若你的体力值全场最少，你的判定牌生效后，你可以获得之。",
                            jishiyu1: "及时雨", jishiyu1_info: "每回合各限一次，当你需要使用或打出杀时，你可以进行判定，判定结果为黑色则视为你使用或打出了杀。",
                            yongbuchenmodezhanjian: "永不沉没的战舰", yongbuchenmodezhanjian_info: "主公技，每回合限一次，你有护甲值时，你可以弃置一张牌令受到的伤害-1。",
                            xiuqi: "修葺", xiuqi_info: "当你发动军辅将牌交给一名其他角色时，你可以令其获得以下效果：你首次造成伤害时，可以回复一点体力。直到其回合结束。",
                            xiuqi2: "修葺", xiuqi2_info: "每回合限一次，你造成伤害时可以回复一点体力。",
                            wanbei: "完备", wanbei_info: "锁定技，你获得开幕航空，你的开幕航空无法升级。你的手牌上限+X，X为你发动军辅置于武将牌上的牌的数量",
                            //iuqi2: "修葺2", xiuqi2_info: "下一次发动开幕航空的技能等级+1",
                            tiaobangzuozhan: "跳帮作战", tiaobangzuozhan_info: "出牌阶段限一次，你可以视为对一名角色使用决斗。若你以此法造成伤害，你观看其手牌并获得其区域内一张牌；若你因此受到伤害，你令其获得你一张手牌，然后防止此伤害。",
                            baixiang: "白象", baixiang_info: "锁定技，你无法使用防具牌。当你受到雷属性伤害时，防止之。",
                            guochuan: "过穿", guochuan_info: "锁定技，你受到伤害时，你可以弃置一张防具牌或失去一点体力防止此伤害。然后你可以选择一名与你距离为一的角色(不能是伤害来源)，令其承受此伤害并摸伤害值张牌。",
                            zuihouderongyao: "最后的荣耀", zuihouderongyao_info: "锁定技，摸牌阶段开始时，你选择以下一项：1，多摸一张牌且你的攻击范围-1。2，少摸一张牌且你的攻击范围+1。你的攻击范围与手牌上限+X。(X已阵亡角色数)",
                            '29jienaerxun': "29节纳尔逊", '29jienaerxun_info': "当你本回合内第一次使用“杀”指定目标时，若你的攻击范围大于等于3，此杀不可响应，若你的体力为全场最高时，此杀伤害+1。",
                            zuihouderongyao_less: "少摸加距离",
                            zuihouderongyao_more: "多摸减距离",
                            hongseqiangwei: "红色蔷薇", hongseqiangwei_info: "你使用伤害类牌后，可以将一张手牌置于武将牌上称为[花]。[花]包含对应座次（点数超出游戏人数则减去游戏人数）的角色受到伤害时，你可以弃置一张对应点数的[花]并防止此伤害。",
                            bujushenfeng: "不惧神风", bujushenfeng_info: "当你受到伤害时，你可以获得造成伤害的牌。你的手牌上限基数为你的体力上限。",
                            shenfeng: "神风", shenfeng_info: "当你造成或受到一点伤害时，你获得一个“风”标记。",
                            buju: "不惧", buju_info: "每轮各限一次，你可以移去一个“风”视为使用酒或无懈可击。 以此法使用的无懈可击结算后，你重置[援军]。",
                            qiangyun: "强运", qiangyun_info: "觉醒技，当你进入濒死时，恢复一点体力。",
                            yuanjun: "援军", yuanjun_info: "限定技，若你有至少6个“风”标记，你可以移去所有“风”视为使用万箭齐发。",
                            buju_wuxie: "不惧_无懈", buju_wuxie_disable: "无懈_不可用",
                            buju_jiu: "不惧_酒", buju_jiu_disable: "酒_不可用",
                            liaowangtai: "瞭望台", liaowangtai_info: "出牌阶段限一次，你视为对所有攻击范围包括你的角色依次使用一张【火攻】。",
                            jingruizhuangbei: "精锐装备", jingruizhuangbei_info: "当你装备武器时，你使用射击造成伤害时可以摸一张牌；当你使用射击指定目标时，你可以进行一次判定，若与此“射击”颜色相同，则你可以额外指定一个目标",
                            jingruizhuangbei_mopai: "精锐装备_摸牌",
                            jingruizhuangbei_fencha: "精锐装备_分叉",
                            dananbusi: "大难不死", dananbusi_info: "限定技，当你受到的伤害不小于你当前体力值时，你可以防止之。",
                            houfu: "后福", houfu_info: "出牌阶段限一次，你可以选择一名其他角色，其选择一项:1视为对你使用一张杀(无距离限制)，2令你从牌堆中获得一张基本牌。",
                            zhanliexianfuchou: "战列线复仇", zhanliexianfuchou_info: "每回合限一次，你造成的伤害+X，X=你本轮受到伤害的次数",
                            pingduzhanhuo: "平度战火", pingduzhanhuo_info: "结束阶段，若你本回合未造成伤害，你摸一张牌；准备阶段，若你自上个结束阶段起未受到伤害，你摸一张牌",
                            mujizhengren: "目击证人", mujizhengren_info: "限定技，出牌阶段，你可以弃置3张手牌，然后令一名角色翻面。",
                            shixiangquanneng: "十项全能", shixiangquanneng_info: "锁定技，你的舰种技能无法升级，每轮开始时，你失去以此法获得的技能，然后从以下技能中选择一项获得：1、防空，2、开幕航空，3、军辅",
                            pangguanzhe: "旁观者", pangguanzhe_info: "锁定技，你的回合开始时，失去上回合以此法获得的技能，随机获得在场角色武将牌上的一个技能。若该技能带有判定，你可以选择判定结果。(远航，强化，航母，战列，巡洋，驱逐，潜艇，开幕航空，火控雷达，先制鱼雷，十项全能除外;主公技，限定技，使命技，觉醒技除外)",
                            hangkongyazhi: "航空压制", "hangkongyazhi_info": "限定技，你可以失去开幕航空，令一名角色失去所有护甲且本轮技能失效。",
                            chuansuohongzha: "穿梭轰炸", "chuansuohongzha_info": "每轮限一次，其他角色使用伤害类牌结算结束后，若你未受伤，你可以获得此牌对应的所有实体牌。每回合限一次，你使用的伤害类牌结算结束后，你可以将其交给一名未受伤角色。",
                            chuansuohongzha_get: "穿梭轰炸", "chuansuohongzha_get_info": "每轮限一次，其他角色使用伤害类牌结算结束后，若你未受伤，你可以获得此牌对应的所有实体牌。",
                            chuansuohongzha_send: "穿梭轰炸", "chuansuohongzha_send_info": "每回合限一次，你使用的伤害类牌结算结束后，你可以将其交给一名未受伤角色。",
                            hangkongyazhi_fengyin: "航空压制_封印",
                            yuanyangpoxi: "远洋破袭", "yuanyangpoxi_info": "锁定技，你使用锦囊牌对攻击范围内的角色造成伤害+1；你出牌阶段使用杀的次数-1.",
                            juejingfengsheng: "绝境逢生", juejingfengsheng_info: "锁定技，你的最大耐久增加11。免疫一次致命伤害。",
                            saqijian: "萨奇剪", "saqijian_info": "你获得【防空】。你可以将一张黑色牌当无懈可击使用",
                            jupaohuoli: "巨炮火力", "jupaohuoli_info": "你使用杀造成伤害时，若你手牌数大于目标手牌数，此伤害+1。",
                            guanjianyiji: "关键一击", "guanjianyiji_info": "每回合限一次，有牌指定目标后，你可以扣置目标的一张牌于武将牌上，此回合结束后再获得之。若此时是你的回合内且指定战列舰为目标，不计入发动次数限制。",
                            duikongzhiwei: "对空直卫", "duikongzhiwei_info": "每轮限一次，当一名角色使用锦囊牌指定至少两名角色为目标时，你可以弃置一张牌，令此牌对你和距离1的角色无效。",
                            bigseven: "BIGSEVEN", "bigseven_info": "你使用基本牌和非延时锦囊牌指定唯一目标后，可以进行判定。若结果与使用的牌类型相同，你可以额外指一名角色为目标。(场上每有一名自己以外拥有bigseven的角色，目标+1)",
                            saobaxing: "扫把星", "saobaxing_info": "锁定技，每回合限一次，当一名角色的判定牌生效前，若判定结果为红色，你须令其重新判定。",
                            shaojie: "哨戒", "shaojie_info": "锁定技，你无法打出闪响应万箭齐发/近距支援。当你受到万箭齐发/近距支援伤害时，你获得一点护甲。",
                            zhiyu_R: "智愚", "zhiyu_R_info": "当你受到伤害后你可以摸一张牌，然后展示所有手牌。若颜色均相同，你令伤害来源弃置一张手牌。",
                            beihaidandang: "被害担当", "beihaidandang_info": "每回合限一次，其他角色受到伤害时，你可以代替其受此伤害，然后摸x张牌，将x张手牌交给一名其他角色或弃置(x为你已损失的体力值)。若目标为航母，此伤害值-1。",
                            xingyundeyunyuqu: "幸运的云雨区", "xingyundeyunyuqu_info": "结束阶段，你可以将一张牌当作乐不思蜀对自己使用然后恢复一点体力，然后将手牌摸至体力上限(至多为5)。你的判定区有牌时计算与其他角色距离+1。",
                            diwuzhandui: "第五战队", "diwuzhandui_info": "准备阶段，你可以展示牌顶堆X张牌，你可以使用其中一张牌，若你在结算过程中造成了伤害，你可以将剩余的牌交给任意角色。（X为场上巡洋舰数量且至多为3）",
                            bisikaiwanshoulie: "比斯开湾狩猎", "bisikaiwanshoulie_info": "当你一次性失去两张牌时，你可以令任意名角色各摸一张牌",
                            maliyanaliehuoji: "马里亚纳猎火鸡", "maliyanaliehuoji_info": "每名角色的弃牌阶段结束时，你可以本阶段进入弃牌堆的牌中选择至多3张牌，令一名其他角色用自己区域内任意张花色数相等的牌置换之。若其置换后手牌数增加，则其受到X点火属性伤害，X=增加的手牌数。",
                            tebiekongxi: "特别空袭", "tebiekongxi_info": "转换技，阳:你的回合外；阴:你的回合内，当你因使用打出或弃置而一次性失去两张或更多牌时，你可以将其中一张牌置于武将牌上，称为“战”(至多三张)。你可以将“战”当作无懈可击使用或如手牌般使用打出。",
                            beijixingweishe: "北极星威慑", "beijixingweishe_info": "你使用杀对其他角色造成伤害后，目标不能使用或打出杀直到其回合结束。",
                            beijixingweishe_effect: "北极星威慑效果", "beijixingweishe_info": "不能使用或打出杀直到回合结束。",
                            jianduixunlian: "舰队训练", "jianduixunlian_info": "出牌阶段限一次，你可以观看一名角色的手牌，若你与其手牌包含的类型数不同则你摸一张牌",
                            aizhi: "爱知", "aizhi_info": "出牌阶段限一次，你可以依次选择并展示攻击范围内其他角色的一张手牌，若为锦囊牌，你可以选择一名角色，令其弃置一张牌并视为其使用该锦囊（若不能使用则只弃牌）。",
                            longgu: "龙崮", "longgu_info": "你存活时，与你同势力的角色和主公准备阶段时，可以跳过摸牌阶段并选择一项：不能成为基本牌/普通锦囊牌和延时锦囊牌的目标，直至其下一次使用基本牌/普通锦囊牌和延时锦囊牌。",
                            longgu_skill: "龙崮", "longgu_skill_info": "准备阶段时，你可以跳过摸牌阶段并选择一项：不能成为基本牌/普通锦囊牌和延时锦囊牌的目标，直至其下一次使用基本牌/普通锦囊牌和延时锦囊牌。",
                            longgu_basic: "龙崮_基本", "longgu_basic_info": "锁定技，你不能成为基本牌的目标，直至其下一次使用基本牌。",
                            longgu_trick: "龙崮_锦囊", "longgu_trick_info": "锁定技，你不能成为锦囊牌和延时锦囊牌的目标，直至其下一次使用普通锦囊牌和延时锦囊牌。",
                            jianghun: "江魂", "jianghun_info": "你阵亡时，令其他角色与全部C势力计算距离时始终+1。",
                            zhizhanzhige: "止战之戈", "zhizhanzhige_info": "准备阶段，你可以摸两张牌，额外执行一个出牌阶段，然后翻面。",
                            zhongleizhuangjiantuxi: "重雷装舰突袭", "zhongleizhuangjiantuxi_info": "觉醒技，准备阶段若你体力值为一，你可以视为对一名角色使用三张无次数限制的雷杀，若此技能结算流程中目标未进入过濒死状态，你弃置所有手牌与装备牌",
                            jianjianleiji: "渐减雷击", "jianjianleiji_info": "每回合限一次，你可以将一张装备牌当作无距离次数限制的雷杀使用",
                            fenzhandaodi: "奋战到底", "fenzhandaodi_info": "你的手牌上限基数为你的体力上限。你可以将红色牌当作雷杀使用。你使用杀指定的目标不能使用花色与此杀不相同的牌响应。",
                            huofu: "祸福", "huofu_info": "锁定技，若你于回合内弃置了红色基本牌，则防止你受到由红色牌造成的伤害直至你下回合开始。",
                            xunqian: "巡潜", "xunqian_info": "你使用锦囊牌时，你可以摸一张牌，然后你选择：1.弃置一张牌；2.将任意张牌交给一名其他角色。",
                            jinyangmaozhishi: "金羊毛之誓", "jinyangmaozhishi_info": "锁定技，你进入濒死时，若你体力上限大于一，你扣减一点体力上限并回复一点体力。",
                            zhengzhansihai: "征战四海", "zhengzhansihai_info": "锁定技，你的手牌上限+X，你造成的伤害+X（X为你损失的体力上限数）",
                            shuqinzhiyin: "竖琴之音", "shuqinzhiyin_info": "每轮限一次，其他角色技能结算后，你可以弃置两张牌，重置一名其他角色武将牌上的技能，然后其回复一点体力",
                            yixinyiyi: "一心一意", "yixinyiyi_info": "你可以将一张牌当作雷杀使用。此杀根据主公已损失体力值:不小于一点，无距离限制，不小于两点，无次数限制，不小于三点，伤害+1。",
                            buxiuzhanshi: "不朽战士", "buxiuzhanshi_info": "出牌阶段限一次，你可以弃置任意张牌，视为对等量名角色使用决斗。下个回合摸牌阶段，你的摸牌数量+x（x为你本回合以此法对造成的伤害数）",


                            jianrbiaozhun: "舰r标准",
                            lishizhanyi: '历史战役',
                            lishizhanyi_naerweike: '历史战役-纳尔维克',
                            lishizhanyi_matapanjiao: '历史战役-马塔潘角',
                            lishizhanyi_danmaihaixia: '历史战役-丹麦海峡',
                            lishizhanyi_shanhuhai: '历史战役-珊瑚海',
                            lishizhanyi_haixiafujizhan: '历史战役-海峡伏击战',
                            weijingzhizhi: '未竟之志',
                            cangqinghuanying: '苍青幻影',
                        },
                    };
                    if (lib.device || lib.node) {
                        for (var i in jianrjinji.character) { jianrjinji.character[i][4].push('ext:舰R牌将/image/character/' + i + '.jpg'); }
                    } else {
                        for (var i in jianrjinji.character) { jianrjinji.character[i][4].push('db:extension-舰R牌将:image/character/' + i + '.jpg'); }
                    }//由于以此法加入的武将包武将图片是用源文件的，所以要用此法改变路径。可以多指定x个目标数（x技能强化的次数），
                    return jianrjinji;
                });
                //lib.config.all.characters.push('jianrjinji');//无名杀新版本已弃用。如要兼容旧版本可以重新使用
                //if (!lib.config.characters.includes('jianrjinji')) lib.config.characters.push('jianrjinji');
                lib.translate['jianrjinji_character_config'] = '舰R武将';// 包名翻译
                //卡包（手牌）
                game.import('card', function () {
                    var jianrjinjibao = {
                        name: 'jianrjinjibao',//卡包命名
                        connect: true,//卡包是否可以联机
                        card: {
                            /* jinjuzy: {
                                audio: "ext:舰R牌将/audio/skill:true",
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
                                audio: "ext:舰R牌将/audio/skill:true",
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
                                audio: "ext:舰R牌将/audio/skill:true",
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
                                audio: "ext:舰R牌将/audio/skill:true",
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
                            }, */
                            xingyun: {
                                image: 'ext:舰R牌将/image/card/xingyun.png',
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
                                skills: ["dajiaoduguibi"],
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
                            /* lianxugongji: {
                                image: 'ext:舰R牌将/yishichuanjiadan.jpg',
                                type: "basic",
                                enable: true,
                                selectTarget: 1,
                                filter: function (event, player) { return player.canUse('sha'); },
                                filterTarget: function (card, player, target) { return target != player && player.canUse('sha', target); },
                                content: function () {
                                    'step 0'
                                    player.useCard({ name: 'sha' }, target, true);
                                    player.useCard({ name: 'sha' }, target, true);
                                },
                                ai: {
                                    order: 5,
                                    result: {
                                        player: 1,
                                    },
                                },
                                fullimage: true,
                            }, */
                            "quzhupao3": {
                                image: 'ext:舰R牌将/image/card/quzhupao3.png',
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
                                image: 'ext:舰R牌将/image/card//qingxunpao3.png',
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
                                image: 'ext:舰R牌将/image/card/zhongxunpao3.png',
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
                                image: 'ext:舰R牌将/image/card/zhanliepao3.png',
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
                                image: 'ext:舰R牌将/image/card/zhandouji3.png',
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
                            huokongld_equip: {
                                image: 'ext:舰R牌将/image/card/huokongld_equip.png',
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
                                skills: [""],
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
                                image: 'ext:舰R牌将/image/card/yuleiqianting3.png',
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
                                image: 'ext:舰R牌将/image/card/jianzaidaodan3.png',
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
                                image: 'ext:舰R牌将/image/card/yuleiji3.png',
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
                                image: 'ext:舰R牌将/image/card/tansheqi3.png',
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
                                image: 'ext:舰R牌将/image/card/fasheqi3.png',
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
                            huokongld_equip: "火控雷达",
                            "huokongld_equip_info": "强大的雷达，可以精准的命中对手。（没有技能的装备）",
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
                        list: [/* ["heart", "1", "hangkongzhan"], ["diamond", "1", "xingyun"], ["spade", "1", "lianxugongji"], ["club", "1", "jinjuzy"], ["heart", "1", "jiakongls"] */],//牌堆添加
                    }
                    return jianrjinjibao
                });
                lib.translate['jianrjinjibao_card_config'] = '舰R卡牌';
                lib.config.all.cards.push('jianrjinjibao');
                //if (!lib.config.cards.includes('jianrjinjibao')) lib.config.cards.push('jianrjinjibao');//包名翻译，失败了：,"jianrjinjibao":{"name":"禁用舰R测试内卡包","intro":"联机卡组在游戏内运行时才添加至游戏内，禁用添加这些卡组的技能，才能真正禁用这些卡组","init":true},
                //闪避（响应）对面的攻击，通过攻击减少对手手牌数，config.diewulimitaiconfig.hanbing_gaiconfig.tiaozhanbiaojiang
            };
        }, help: {}, config: {//config就是配置文件，类似于minecraft的模组设置文本。无名将其可视化了....。当你进行了至少一次强化后<br>1.出牌阶段<br>你可以弃置3张不同花色的牌，提升一点血量上限。<br>2.当你濒死时，<br>你可以弃置4张不同花色的牌，回复一点体力。<br>（未开启强化，则无需强化即可使用建造。未开启建造，则强化上限仅为1级。）火杀：令目标回合结束后，受到一点火焰伤害，摸两张牌。</br>冰杀：护甲加1伤；减少对手1点防御距离。</br>雷杀：自动判断是否流失对手体力；减少对手1点手牌上限；。</br>此角色回合结束后移除所有的进水、减速、燃烧。
            jianrjinji: { "name": "禁用舰R联机武将/可自定义角色技能", "intro": "在游戏运行时，扩展通过运行一个技能，将联机武将添加至游戏内，<br>启用此技能，才能禁用联机武将。<br>禁用后，单机武将不会被联机部分覆盖。<br>进入修改武将的界面：点击上方的编辑扩展-武将。", "init": false },
            _yuanhang: { "name": "远航-用一张牌摸一张牌，濒死可摸牌", "intro": "开启后，所有玩家受伤时手牌上限+1；<br>每轮限1/2/3次，当失去手牌后，且手牌数<手牌上限的一半时，你摸一张牌。<br>当你进入濒死状态时，你可以摸一张牌，体力上限>2时需减少一点体力上限，额外摸一张牌；死亡后，若你为忠臣，你可以令主公摸一张牌。", "init": true },
            _jianzaochuan: { "name": "建造-用三张牌提升血量上限，用四张牌回血", "intro": "开启后，若任意玩家进行了至少一次强化：<br>1.出牌阶段，<br>你可以弃置3张不同花色的牌，提升一点血量上限。<br>2.当你濒死时，<br>你可以弃置4张不同花色的牌，回复一点体力。<br>（未开启强化，则无需强化即可使用建造。未开启建造，则强化上限仅为1级。）", "init": true },
            _qianghuazhuang: { "name": "强化-消耗牌增加自身能力", "intro": "开启后，出牌阶段限一次，所有玩家可以弃置二至四张牌或消耗经验，选择一至两个永久效果升级。<br>（如摸牌、攻击距离、手牌上限等）", "init": true },
            _wulidebuff: { "name": "火杀燃烧、雷杀穿甲、寒冰剑对甲加伤", "intro": "开启后，属性伤害会有额外效果。<br>火杀：令目标回合结束后，受到一点火焰伤害，摸两张牌（有护甲则不会触发摸牌）。</br>冰杀/寒冰剑雷杀：护甲加1伤；减少对手1点防御距离。</br>雷杀：有护甲时改为造成对手流失体力；减少对手1点手牌上限；。</br>此角色回合结束后/濒死时移除进水、减速、燃烧。", "init": true },
            qyzhugeliang: { "name": "第一轮休闲局-添加原版技能", "intro": "开启后，主公可以在回合开始时，选择一组技能，直到下一回合开始前，所有角色都能使用这些技能；还有火攻一类的卡组可供选择，让每一个玩家选择打出这些卡", "init": false },
            diewulimitai: { "name": "蝶舞-给队友递一张杀、装备", "intro": "开启后，所有玩家获得辅助类技能【蝶舞】，<br>出牌阶段，可以给队友递一张装备/杀，队友得到此牌后可以立即使用，但每轮只能以此法只能出一次杀。", "init": false },
            yidong: { "name": "回合内，与相邻玩家互换座位", "intro": "开启后，所有玩家获得辅助类技能【移动】：<br>1.可以在局内移动自己角色的座位，<br>限制为相邻座位，<br>对ai的限制为队友/目标距离此角色为2。", "init": false },
            kaishimopao: { "name": "更好的摸牌阶段", "intro": "开启后，所有玩家获得摸牌类技能【摸牌】，<br>摸牌阶段摸牌量>1时：<br>可以弃置等同于摸牌数的牌，改为获得1张由你指定类别的牌，<br>在你判定延时锦囊牌前，<br>可令1.下一个摸牌阶段--少摸一张牌;2.本回合结束时--摸一张牌。", "init": false },
            _hanbing_gai: { "name": "寒冰剑-增强", "intro": "开启后，拥有寒冰剑时，寒冰剑的弃牌数改为你造成的伤害*2，<br>弃置到没有手牌时，会将没有计算完的伤害继续打出（以普通伤害的属性）。", "init": true },
            tiaozhanbiaojiang: { "name": "挑战模式全员国战不屈", "intro": "开启后，所有玩家获得技能【挑战技能】：<br>开局流失体力到剩余1血，根据流失的体力数多摸等量的牌；<br>全员获得国战不屈，唤醒界标武将的力量。<br>暂缺一个扶起负数血队友的技能", "init": true },
        }, package: {
            character: {
                character: {//单机部分，在联机框架开启时，联机武将会覆盖同名武将应该不生效。
                    /*liekexingdun: ["female", "wu", 4, ["hangmucv", "hangkongzhanshuxianqu"], ["zhu", "des:血量中等的航母，温柔，体贴，过渡期追着大船打的航母。"]],
                    qixichicheng: ["female", "shu", 4, ["hangmucv", "qixi_cv"], ["des:大佬友情放出精美壁纸，坚定与自信的姿态"]],
                    wufenzhongchicheng: ["female", "shu", 4, ["hangmucv", "mingyundewufenzhong"], ["des:大佬友情放出精美壁纸，坚定与自信的姿态"]],
         
                    qiye: ["female", "USN", 4, ["hangmucv", "dumuchenglin"], ["des:有必中攻击，快跑"]],
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
                    "z31": ["female", "USN", 3, ["dajiaoduguibi", "quzhudd"], ["des:婚纱与轻纱是多数人的美梦,与绿草平原，与绿水青山"]],
                    xuefeng: ["female", "shu", 3, ["dajiaoduguibi", "quzhudd", "xiangrui", "yumian"], ["des:幸运的驱逐舰，多位画师、花了大款的大佬亲情奉献。"]],
                    kangfusi: ["female", "USN", 3, ["dajiaoduguibi", "quzhudd"], ["des:水手服欸,优秀的构图，不过图少改造晚。"]],
                    "47project": ["female", "USN", 3, ["dajiaoduguibi", "quzhudd"], ["des:这是个依赖科技的舰船，有着科幻的舰装，与兼备温柔体贴与意气风发的表现。"]],
                    guzhuyizhichuixue: ["female", "shu", 3, ["dajiaoduguibi", "quzhudd", "guzhuyizhi"], ["des:水手服与宽袖的结合，给人以温柔的感觉。"]],
                    shuileizhanduichuixue: ["female", "shu", 3, ["dajiaoduguibi", "quzhudd", "shuileizhandui",], ["des:水手服与宽袖的结合，给人以温柔的感觉。"]],
                    mingsike: ["female", "qun", 3, ["dajiaoduguibi", "quzhudd", "manchangzhanyi", "manchangzhanyi_1"], ["des:跑得快，看得多。"]],
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
            intro: "制作组群，730255133。<br>长按或右键下方全局技能的选项简介查看技能详情，可根据需要开关",
            author: "※人杰地灵游戏中",
            diskURL: "https://pan.baidu.com/s/1VPMQuAUgucpRRbef9Dmy3g?pwd=gfmv",
            forumURL: "",
            version: "2.140+",
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