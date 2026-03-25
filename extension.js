
//===================================

//【基础语法注意事项】
//写在前面：本文件中变量名大小写敏感,且需要注意是否有s（例如target-targets）
//filter中使用event.,不能使用trigger.。trigger.在content中使用。
//filter函数（条件函数）里的event是触发事件,但content函数（效果函数）里的trigger才是触发事件,event是当前的技能事件。
//event.getParent()是当前技能事件的上一级父事件,event.getParent(2)是当前技能事件的上二级父事件。
//"step 0"必须从0开始,引号可以是单引号或双引号,但是整个技能里面不能变。

//【yield用法】（需要无名杀版本1.10.10或更高版本）
//yield可以跨步骤储存变量,用于一个技能里需要多次选择目标/牌等造成系统自带result.targets和result.links失效的情况。
//该方法需要content:function*(event,map),并且内容中player和trigger.player需要分别使用map.player和map.trigger.player代替。
//示例：var result = yield player.chooseCardButton('选择一张牌', true, cards);

//【AI相关】
//content中的ai返回值为正数越大越容易选择目标,返回值为负数则不选择、不发动。
//ai里的ai返回值为正数则选择友方,返回值为负数则选择敌方,返回值0不发动技能。
//主动技能的ai中需要写明result例如result:{player:1,},AI才会发动技能。

//【storage使用方式】
//有直接用player.storage的方式,但是更建议使用如下三个函数（好处在于不仅会自己广播还自带初始值,联机用起来很方便）：
//getStorage() - 获取对应的storage数组,非数组均可
//setStorage() - 直接赋值storage数组,非数组均可
//markAuto()   - 向storage中添加元素（数组）

//【其他注意事项】
//nobracket:true - 该属性可以让技能显示完整名称（而不是只有前两个字）
//var player = get.player(); - 指的是当前正在做选择的角色
//useCard时机牌已经离开手牌区,牌上的tag已经清除。
//JS中数组之间==比较的是数组地址,不比较内容。不能通过card==[]判断数组为空或不为空。
//mod尽量放在主技能中。放在子技能中时会由于未知原因结算两遍。
//联机时客机出牌阶段所在的_status.event.name是game,不是phaseUse。
//.set("key",val)传递参数后使用数值时应当取后一个参数（val）。

//【目录】
//武将列表、武将技能、武将和技能翻译、卡牌包与卡牌技能、卡牌翻译、配置（config）、扩展简介

//===================================
let connect;
try {
    const ws = require("ws");
    connect = ws.connect;
} catch (error) {
    console.warn("require('ws') failed");
}
//const { connect } = require("ws");///vscode生成出来的,vscodeAI检测到enable认为没导入自动添加了导入但其实enable只是一个标签。目前使用try-catch包裹起来。
import { lib, game, ui, get, ai, _status } from '../../noname.js'
import { checkBegin } from '../../noname/library/assembly/buildin.js';
import { delay, freezeButExtensible } from '../../noname/util/index.js';
import {jianrjinji} from "./jianrjinji.js";
import { weightedRandom } from "./utils.js";
game.import("extension", function (lib, game, ui, get, ai, _status) {

    return {
        name: "舰R牌将",
        content: function (config, pack) {
            /*lib.group.push('RN');
            lib.translate.RN = '<span style="color:#FFCD7F32">英</span>';
            lib.group.push('USN');
            lib.translate.USN = '<span style="color:#FF000000">美</span>';
            lib.group.push('IJN');
            lib.translate.IJN = '<span style="color:#FFCCCCCC">日</span>';*///添加势力,但是由于未知原因显示的字体相当模糊,解决问题之前不采用

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
            //2026.2.12豆包修改样式
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
                    overflowY: "auto",     // 仅垂直滚动,水平不截断
                    overflowX: "visible",  // 关键：取消水平隐藏,改为可见（避免截断右侧）
                    boxSizing: "border-box", // 盒模型：padding/border计入宽度,不挤压内容
                    ...containerStyle
                });

                // 主容器
                let dialogContainer = ui.create.div(".prompt-container", promptContainer);
                Object.assign(dialogContainer.style, {
                    width: "100%",         // 占满父容器宽度
                    boxSizing: "border-box",
                    padding: "0 5px",      // 给主容器左右预留基础边距
                });

                // 内容框：flex布局,文本在上,按钮在下
                let dialog = ui.create.div(".menubg", dialogContainer, function () {
                    promptContainer.clicked = true;
                });
                Object.assign(dialog.style, {
                    textAlign: 'left',
                    lineHeight: '1.8',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '300px',
                    width: '100%',
                    boxSizing: "border-box", // 核心：padding不超出宽度
                    padding: '15px 20px',    // 优化：右侧padding从15px增至20px,预留更多空间
                    ...dialogStyle
                });

                // 文本容器：承载所有说明文本,避免文字贴边
                let textContainer = ui.create.div("", str || "", dialog);
                Object.assign(textContainer.style, {
                    width: "100%",
                    boxSizing: "border-box",
                    wordWrap: "break-word",  // 关键：长文本自动换行,不溢出
                    wordBreak: "break-all",  // 兼容：中英文混排时强制换行
                    paddingRight: "5px",     // 文本容器额外右侧边距,双重保障
                });

                // 按钮容器：强制占满宽度 + 居中
                let controls = ui.create.div(dialog);
                Object.assign(controls.style, {
                    textAlign: 'center',
                    width: '100%',
                    marginTop: '20px',
                    padding: '10px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    boxSizing: "border-box"
                });

                let clickConfirm = function () {
                    promptContainer.remove();
                };
                // 确定按钮：双重居中保障
                let confirmButton = ui.create.div(".menubutton.large", "确定", controls, clickConfirm);
                Object.assign(confirmButton.style, {
                    padding: '8px 30px',
                    margin: '0 auto',
                    display: 'block',
                    ...confirmStyle
                });
            }
            const getSystem = setInterval(() => {
                if (ui.system1 || ui.system2) {
                    // @ts-ignore
                    clearInterval(getSystem);
                    ui.jian_R_readme = ui.create.system('舰r杀机制介绍', function () {
                        game.jianRAlert(
                            // 保留悬挂缩进的文本结构
                            "<p style='margin: 0; padding: 0; margin-bottom: 12px;'><b>开启军争篇卡牌包或舰r美化包战术包时装备栏共有五个,分别是：武器、防具、+1马、-1马、宝物。</b></p>" +
                            "<p style='margin: 0; padding: 0; margin-bottom: 12px;'>所有全局技能均可在扩展详情中查看说明和配置开关,以下是默认开启的全局技能</p>" +
                            "<p style='margin: 0; padding: 0; margin-bottom: 10px; text-indent: -3em; padding-left: 3em;'><b>远航：</b>你受伤时手牌上限+1,挑战模式不屈时手牌上限+1；<br>每轮限1/2/3次,失去手牌后,若手牌数少于一半,你可以摸一张牌。<br>当你进入濒死状态时,若你的体力上限大于2,你可以减少一点体力上限,摸两张牌,否则摸一张牌；<br>你死亡后,若你为忠臣,你可以令主公摸一张牌。</p>" +
                            "<p style='margin: 0; padding: 0; margin-bottom: 10px; text-indent: -3em; padding-left: 3em;'><b>建造：</b>若你进行了至少一次强化：出牌阶段你可以弃置3张不同花色的牌,提升一点血量上限,解锁强化二级效果。</p>" +
                            "<p style='margin: 0; padding: 0; margin-bottom: 10px; text-indent: -3em; padding-left: 3em;'><b>强化：</b>出牌阶段限一次,你可以弃置二至四张牌,选择一至两个效果升级。（如摸牌、攻击距离、手牌上限等）。一级效果需要两张牌；二级效果需要3张牌。</p>" +
                            "<p style='margin: 0; padding: 0; text-indent: -3em; padding-left: 3em;'><b>属性：</b>火杀燃烧:令目标回合结束后,受到一点火焰伤害,摸两张张牌。<br>冰杀减速:对有护甲的目标加1伤害；减少1点其他角色计算与目标的距离。<br>雷杀进水:有护甲时改为造成目标流失体力；减少目标1点手牌上限。<br>目标回合结束后或濒死时移除进水、减速、燃烧。</p>",
                            {
                                containerStyle: {
                                    width: '60%',       // 建议：若仍遮挡,可改为max-width: '800px' + width: '90%'
                                    maxWidth: '800px',  // 新增：限制最大宽度,避免宽屏时文本过长
                                    padding: '5px 25px 5px 25px', // 优化：右侧padding从20px增至25px
                                },
                                dialogStyle: {
                                    textAlign: 'left',
                                }
                            }
                        );
                    });
                }
            }, 500);
            if (config.jianrjinji) {
                for (var i in lib.characterPack['jianrjinji']) {
                    if (lib.character[i][4].indexOf("forbidai") < 0) lib.character[i][4].push("forbidai");
                };
            };//选项触发内容,原因见config

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
                    // 这里必须使用扩展目录的真实文件夹名。
                    // 扩展内部展示名是“舰R牌将”,但磁盘目录实际是“舰r牌将”。
                    // 浏览器模式下通过静态路径读取资源时,目录名大小写不一致会导致资源 404。
                    game.playAudio('..', 'extension', '舰r牌将/audio/die', trigger.player.name + ".mp3");
                },
            }//即将替换为:为character实例的dieAudio属性赋值,例如
            //*eg.* `lib.character.guanyu.dieAudios = [true, "ext:无名扩展/audio/die:true"]`
            //在Character的数组形式中填写任意个"die:xxx"。
            //*eg.* `guanyu: ["male", "shu", 4, ["wusheng"], ["die:true", "die:ext:无名扩展/audio/die:true"]]`


            //全局技能写在这上面
        },
        precontent: function () {
            //挂载工具函数
            window.weightedRandom = weightedRandom;
           
                var jianrExtensionDisplayName = '舰R牌将';
                var jianrExtensionDirectoryName = '舰r牌将';
                // 这个扩展之前用 `lib.device || lib.node` 来判断角色图应该走 `ext:` 还是 `db:`。
                // 这种写法会把“桌面浏览器 + 直接读取 extension 目录”的情况误判成 `db:`,
                // 于是角色图会去 IndexedDB 里找资源,最终在浏览器模式下出现整包头像不显示的问题。
                //
                // 引擎真正区分“目录直读扩展”和“数据库导入扩展”的标志其实是 `_status.evaluatingExtension`：
                // - `false`：当前扩展来自 `extension/舰R牌将/...` 目录,资源应该走 `ext:`
                // - `true`：当前扩展来自浏览器本地数据库,资源应该走 `db:`
                //
                // 因此这里把图片路径解析抽出来,和引擎自己的判定逻辑保持一致。
                // 另外顺手兼容两张不是标准 `.jpg` 命名的角色图,避免只修主分支后还残留个别空白头像。
                var jianrCharacterImagePathOverrides = {
                    weineituo_R: 'image/character/weineituo_R.JPG',
                    yinghuochong_R: 'image/character/yinghuochong_R.png',
                };
                var getJianRCharacterImageRelativePath = function (characterName) {
                    // 扩展若是从压缩包导入,`extensionInfo.file` 中会记录真实文件名。
                    // 这里优先按“角色名 -> 实际文件路径”反查,可以保留正确的后缀和大小写。
                    var extensionInfo = lib.config && lib.config.extensionInfo && lib.config.extensionInfo['舰R牌将'];
                    var importedFileList = extensionInfo && Array.isArray(extensionInfo.file) ? extensionInfo.file : [];
                    var normalizedCharacterName = String(characterName).toLowerCase();
                    for (var index = 0; index < importedFileList.length; index++) {
                        var filePath = importedFileList[index];
                        if (typeof filePath !== 'string' || filePath.indexOf('image/character/') !== 0) continue;
                        var fileName = filePath.slice('image/character/'.length);
                        var dotIndex = fileName.lastIndexOf('.');
                        if (dotIndex <= 0) continue;
                        if (fileName.slice(0, dotIndex).toLowerCase() === normalizedCharacterName) {
                            return filePath;
                        }
                    }
                    // 目录模式下不会有这份数据库清单,此时回退到扩展目录里的默认路径。
                    return jianrCharacterImagePathOverrides[characterName] || ('image/character/' + characterName + '.jpg');
                };
                var getJianRCharacterImageTag = function (characterName) {
                    var relativePath = getJianRCharacterImageRelativePath(characterName);
                    // 这里直接对齐引擎的资源选择方式,不再通过“是不是浏览器/设备”做环境猜测。
                    if (_status.evaluatingExtension) {
                        return 'db:extension-' + jianrExtensionDisplayName + ':' + relativePath;
                    }
                    return 'ext:' + jianrExtensionDirectoryName + '/' + relativePath;
                };
                var normalizeJianRDirectoryAssetReference = function (value) {
                    // 目录直读模式下,所有 `ext:` 资源都必须指向真实文件夹名“舰r牌将”；
                    // 但扩展源码里历史上大量写成了展示名“舰R牌将”。
                    // 这里统一做一次前缀纠正,避免逐条手改数百个音频/贴图字段。
                    if (_status.evaluatingExtension || typeof value !== 'string') return value;
                    return value.split('ext:' + jianrExtensionDisplayName + '/').join('ext:' + jianrExtensionDirectoryName + '/');
                };
                var normalizeJianRDirectoryAssetReferenceDeep = function (target, seen) {
                    if (_status.evaluatingExtension) return target;
                    if (!target || typeof target !== 'object') return target;
                    if (!seen) seen = [];
                    if (seen.indexOf(target) !== -1) return target;
                    seen.push(target);
                    if (Array.isArray(target)) {
                        for (var arrayIndex = 0; arrayIndex < target.length; arrayIndex++) {
                            if (typeof target[arrayIndex] === 'string') {
                                target[arrayIndex] = normalizeJianRDirectoryAssetReference(target[arrayIndex]);
                            } else {
                                normalizeJianRDirectoryAssetReferenceDeep(target[arrayIndex], seen);
                            }
                        }
                        return target;
                    }
                    for (var key in target) {
                        if (!Object.prototype.hasOwnProperty.call(target, key)) continue;
                        if (typeof target[key] === 'string') {
                            target[key] = normalizeJianRDirectoryAssetReference(target[key]);
                        } else {
                            normalizeJianRDirectoryAssetReferenceDeep(target[key], seen);
                        }
                    }
                    return target;
                };
                //武将包,"qigong","qingnang"
                game.import('character', function () {
                    
                    // 这里统一通过上面的解析函数补角色图标签：
                    // 1. 浏览器直接读取扩展目录时返回 `ext:` 路径；
                    // 2. 浏览器读取本地数据库中的导入扩展时返回 `db:` 路径；
                    // 3. 少数特殊后缀/大小写的角色图也会在这里被自动修正。
                    for (var i in jianrjinji.character) {
                        if (!Array.isArray(jianrjinji.character[i][4])) jianrjinji.character[i][4] = [];
                        jianrjinji.character[i][4].push(getJianRCharacterImageTag(i));
                    }//由于以此法加入的武将包武将图片是用源文件的,所以要用此法改变路径。
                    normalizeJianRDirectoryAssetReferenceDeep(jianrjinji);
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
                            /* jinjuzhiyuan9: {
                                audio: "ext:舰R牌将/audio/skill:true",
                                image: 'ext:舰R牌将/jinjuzhiyuan9.jpg',
                                type: "trick",
                                enable: true,
                                //selectTarget: -1,
                                selectTarget: [1, Infinity],
                                reverseOrder: true,
                                "yingbian_prompt": "当你使用此牌选择目标后,你可为此牌减少一个目标",
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
                            jiakonglishi9: {
                                image: 'ext:舰R牌将/jiakonglishi9.jpg',
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
                                    game.addVideo('cardDialog', null, event.preResult); if (!player.countMark('jiakonglishi9')) { player.addMark('jiakonglishi9'); player.chooseUseTarget(true, 'jiakonglishi9') };
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
                            mingzuyueqi9: {
                                image: 'ext:舰R牌将/mingzuyueqi9.jpg',
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
                            hangkongzhan9: {
                                audio: "ext:舰R牌将/audio/skill:true",
                                image: 'ext:舰R牌将/hangkongzhan9.jpg',
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
                            paohuozhunbei9: {
                                image: 'ext:舰R牌将/paohuozhunbei9.png',
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
                                skills: ["paohuozhunbei9_skill", "danzong"],
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
                            /* lianxugongji9: {
                                image: 'ext:舰R牌将/lianxugongji9.jpg',
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
                                image: 'ext:舰R牌将/image/card/qingxunpao3.png',
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
                            /* jinjuzhiyuan9: "近距支援",
                            "jinjuzhiyuan9_info": "出牌阶段,对所有其他角色使用。每名目标角色需打出一张【闪】,否则受到1点伤害。",
                            jiakonglishi9: "架空历史",
                            "jiakonglishi9_info": "群星璀璨,欧陆风云,该武将首次使用会有两轮1.5展示牌量的五谷丰登,再次使用仅有一轮。",
                            mingzuyueqi9: "民族乐器",
                            "mingzuyueqi9_info": "北境之地的文化艺术。锁定技,你视为拥有技能国战“制衡”,若你已经有“制衡”,则改为取消可弃置牌数的限制。",
                            hangkongzhan9: "航空战",
                            "hangkongzhan9_info": "建树丰厚,参与每轮开始时的三连杀战斗吗,每轮最多弃置三张牌。", 
                            paohuozhunbei9: "炮火准备",
                            "paohuozhunbei9_info": "试试就逝世,扣一血得属性杀增强效果,然而现在所有舰船都有这个,可以图加一杀次数。", 
                            qiangliguibi9: "强力规避",
                            "qiangliguibi9_info": "可以进行一次判定,为桃、闪则视为打出闪。<br>若判定未生效,会获得判定牌。<br>若武将为驱逐且没有判定成功,可以额外触发一次。",
                            lianxugongji9: "连续攻击",
                            "lianxugongji9_info": "其实就是杀,但此杀能连打两次。。",*/
                            "sushepao3": "速射炮",
                            "sushepao3_info": "射速与精度很吓人,当然消耗也很惊人（没有特殊效果）",
                            "quzhupao3": "速射炮",
                            "quzhupao3_info": "可以连续使用水弹击退敌人（没有特殊效果）",
                            "qingxunpao3": "两用炮",
                            "qingxunpao3_info": "对地对空的好帮手（没有特殊效果）",
                            "zhongxunpao3": "中型主炮",
                            "zhongxunpao3_info": "对付轻巡很给力,对付大船则充满了不幸（没有特殊效果）",
                            "zhanliepao3": "大型主炮",
                            "zhanliepao3_info": "能击穿才是传奇,有严重损害更好（没有特殊效果）",
                            "zhandouji3": "战斗机",
                            "zhandouji3_info": "适合满速轻型航母的战斗机,启航,编队,狗斗,加速降落（没有特殊效果）",
                            huokongld_equip: "火控雷达",
                            "huokongld_equip_info": "强大的雷达,可以精准的命中对手。（没有技能的装备）",
                            "yuleiqianting3": "鱼雷(潜艇用)",
                            "yuleiqianting3_info": "来偷袭,我一个英姿闭月双刀的老头子,这合理吗（没有特殊效果）",
                            "jianzaidaodan3": "反舰导弹",
                            "jianzaidaodan3_info": "融合卫星定位,（没有特殊效果）",
                            "yuleiji3": "鱼雷机",
                            "yuleiji3_info": "可以反潜,较小的起飞距离则能支援主力作战,。（没有特殊效果）",
                            "tansheqi3": "弹射器",
                            "tansheqi3_info": "加速飞机起飞,缩短航母甲板或者增加飞机承载量（没有特殊效果）",
                            "fasheqi3": "发射器",
                            "fasheqi3_info": "发射导弹的同时要牺牲一个火控雷达槽位（没有特殊效果）",
                        },
                        list: [/* ["heart", "1", "hangkongzhan9"], ["diamond", "1", "xingyun"], ["spade", "1", "lianxugongji9"], ["club", "1", "jinjuzhiyuan9"], ["heart", "1", "jiakonglishi9"] */],//牌堆添加
                    }
                    normalizeJianRDirectoryAssetReferenceDeep(jianrjinjibao);
                    return jianrjinjibao
                });
                lib.translate['jianrjinjibao_card_config'] = '舰R卡牌';
                lib.config.all.cards.push('jianrjinjibao');

                //if (!lib.config.cards.includes('jianrjinjibao')) lib.config.cards.push('jianrjinjibao');//包名翻译,失败了：,"jianrjinjibao":{"name":"禁用舰R测试内卡包","intro":"联机卡组在游戏内运行时才添加至游戏内,禁用添加这些卡组的技能,才能真正禁用这些卡组","init":true},
                //闪避（响应）对面的攻击,通过攻击减少对手手牌数,config.diewulimitaiconfig.hanbing_gaiconfig.tiaozhanbiaojiang
            
        }, help: {}, config: {//config就是配置文件,类似于minecraft的模组设置文本。无名将其可视化了....。当你进行了至少一次强化后<br>1.出牌阶段<br>你可以弃置3张不同花色的牌,提升一点血量上限。<br>2.当你濒死时,<br>你可以弃置4张不同花色的牌,回复一点体力。<br>（未开启强化,则无需强化即可使用建造。未开启建造,则强化上限仅为1级。）火杀：令目标回合结束后,受到一点火焰伤害,摸两张牌。</br>冰杀：护甲加1伤；减少对手1点防御距离。</br>雷杀：自动判断是否流失对手体力；减少对手1点手牌上限；。</br>此角色回合结束后移除所有的进水、减速、燃烧。
            jianrjinji: { "name": "禁用舰R联机武将/可自定义角色技能", "intro": "在游戏运行时,扩展通过运行一个技能,将联机武将添加至游戏内,<br>启用此技能,才能禁用联机武将。<br>禁用后,单机武将不会被联机部分覆盖。<br>进入修改武将的界面：点击上方的编辑扩展-武将。", "init": false },
            _yuanhang: { "name": "远航-用一张牌摸一张牌,濒死可摸牌", "intro": "开启后,所有玩家受伤时手牌上限+1；挑战模式不屈时手牌上限+1<br>每轮限1/2/3次,当失去手牌后,且手牌数<手牌上限的一半时,你摸一张牌。<br>当你进入濒死状态时,你可以摸一张牌,体力上限>2时需减少一点体力上限,额外摸一张牌；死亡后,若你为忠臣,你可以令主公摸一张牌。", "init": true },
            _jianzaochuan: { "name": "建造-用三张牌提升血量上限,用四张牌回血", "intro": "开启后,若任意玩家进行了至少一次强化：<br>1.出牌阶段,<br>你可以弃置3张不同花色的牌,提升一点血量上限。<br>2.当你濒死时,<br>你可以弃置4张不同花色的牌,回复一点体力。<br>（未开启强化,则无需强化即可使用建造。未开启建造,则强化上限仅为1级。）", "init": true },
            _qianghuazhuang: { "name": "强化-消耗牌增加自身能力", "intro": "开启后,出牌阶段限一次,所有玩家可以弃置二至四张牌或消耗经验,选择一至两个永久效果升级。<br>（如摸牌、攻击距离、手牌上限等）", "init": true },
            _wulidebuff: { "name": "火杀燃烧、雷杀穿甲、寒冰剑对甲加伤", "intro": "开启后,属性伤害会有额外效果。<br>火杀：令目标回合结束后,受到一点火焰伤害,摸两张牌（有护甲则不会触发摸牌）。</br>冰杀/寒冰剑雷杀：护甲加1伤；减少对手1点防御距离。</br>雷杀：有护甲时改为造成对手流失体力；减少对手1点手牌上限；。</br>此角色回合结束后/濒死时移除进水、减速、燃烧。", "init": true },
            _qyzhugeliang: { "name": "第一轮休闲局-添加原版技能", "intro": "开启后,主公可以在回合开始时,选择一组技能,直到下一回合开始前,所有角色都能使用这些技能；还有火攻一类的卡组可供选择,让每一个玩家选择打出这些卡", "init": false },
            _diewulimitai: { "name": "蝶舞-给队友递一张杀、装备", "intro": "开启后,所有玩家获得辅助类技能【蝶舞】,<br>出牌阶段,可以给队友递一张装备/杀,队友得到此牌后可以立即使用,但每轮只能以此法只能出一次杀。", "init": false },
            _yidong: { "name": "回合内,与相邻玩家互换座位", "intro": "开启后,所有玩家获得辅助类技能【移动】：<br>1.可以在局内移动自己角色的座位,<br>限制为相邻座位,<br>对ai的限制为队友/目标距离此角色为2。", "init": false },
            _kaishimopai: { "name": "更好的摸牌阶段", "intro": "开启后,所有玩家获得摸牌类技能【摸牌】,<br>摸牌阶段摸牌量>1时：<br>可以弃置等同于摸牌数的牌,改为获得1张由你指定类别的牌,<br>在你判定延时锦囊牌前,<br>可令1.下一个摸牌阶段--少摸一张牌;2.本回合结束时--摸一张牌。", "init": false },
            _hanbing_gai: { "name": "寒冰剑-增强", "intro": "开启后,拥有寒冰剑时,寒冰剑的弃牌数改为你造成的伤害*2,<br>弃置到没有手牌时,会将没有计算完的伤害继续打出（以普通伤害的属性）。", "init": true },
            tiaozhanbiaojiang: { "name": "挑战模式全员国战不屈", "intro": "开启后,所有玩家获得技能【挑战技能】：<br>开局流失体力到剩余1血,根据流失的体力数多摸等量的牌；<br>全员获得国战不屈,唤醒界标武将的力量。<br>暂缺一个扶起负数血队友的技能", "init": true },
        }, package: {
            character: {
                character: {//单机部分,在联机框架开启时,联机武将会覆盖同名武将应该不生效。
                    /*liekexingdun_R: ["female", "wu", 4, ["hangmucv", "hangkongzhanshuxianqu"], ["zhu", "des:血量中等的航母,温柔,体贴,过渡期追着大船打的航母。"]],
                    qixichicheng_R: ["female", "shu", 4, ["hangmucv", "qixi_cv"], ["des:大佬友情放出精美壁纸,坚定与自信的姿态"]],
                    wufenzhongchicheng_R: ["female", "shu", 4, ["hangmucv", "mingyundewufenzhong"], ["des:大佬友情放出精美壁纸,坚定与自信的姿态"]],
         
                    qiye_R: ["female", "USN", 4, ["hangmucv", "dumuchenglin"], ["des:有必中攻击,快跑"]],
                    bisimai_R: ["female", "shu", 4, ["zhuangjiafh", "zhanliebb"], ["zhu", "des:更多刮痧炮,更多炮弹,更多削弱光环,更多护甲模组,更多血量。"]],
                    misuli_R: ["female", "shu", 4, ["zhuangjiafh", "zhanliebb"], ["des:用精巧的手枪去质疑,用绝对的火力回击对手。"]],
                    weineituo_R: ["female", "shu", 4, ["zhuangjiafh", "zhanliebb"], ["des:身材小,而强度惊人。"]],
                    lisailiu_R: ["female", "shu", 4, ["zhuangjiafh", "zhanliebb"], ["des:幸运的象征之一,同时有着丰富的精神象征。"]],
                    changmen_R: ["female", "shu", 4, ["zhuangjiafh", "zhanliebb"], ["des:。"]],
                    kunxi_R: ["female", "shu", 4, ["huokongld", "zhongxunca", "gaosusheji"], ["des:画师优秀的功底让这名角色美而可爱,这是出色的角色塑造。"]],
                    ougengqi_R: ["female", "shu", 4, ["huokongld", "zhongxunca"], ["des:励志偶像,与标志性舰装,给人以强大的保护。"]],
                    qingye_R: ["female", "shu", 4, ["huokongld", "zhongxunca", "sawohaizhan"], ["des:励志偶像,与一首动人的歌,与一段坎坷旅途。"]],
                    beianpudun_R: ["female", "shu", 4, ["huokongld", "zhongxunca"], ["des:励志青年,在旅途中成长,与恋人坚定的望向远方。"]],
                    jiujinshan_R: ["female", "shu", 4, ["huokongld", "zhongxunca"], ["des:航海服饰,侦查员与火炮观瞄。"]],
                    yixian_R: ["female", "USN", 3, ["fangkong2", "qingxuncl"], ["des:经典美术设计的款式,意气风发,威猛先生"]],
                    tianlangxing_R: ["female", "USN", 3, ["fangkong2", "qingxuncl"], ["des:阻敌计谋表现优秀,这是先发制敌的优势所在,"]],
                    dading: ["female", "USN", 3, ["fangkong2", "qingxuncl"], ["des:手持竹伞的轻巡,辅助队友,防御攻击。"]],
                    degelasi: ["female", "USN", 3, ["fangkong2", "qingxuncl"], ["des:现代文职服饰,一看就很会办公。"]],
                    yatelanda_R: ["female", "USN", 3, ["fangkong2", "qingxuncl"], ["des:双枪射手点形象,其双枪能以极快的射速打出爆炸弹匣,清空一小片区域。"]],
                    "z31_R": ["female", "USN", 3, ["dajiaoduguibi", "quzhudd"], ["des:婚纱与轻纱是多数人的美梦,与绿草平原,与绿水青山"]],
                    xuefeng_R: ["female", "shu", 3, ["dajiaoduguibi", "quzhudd", "xiangrui", "yumian"], ["des:幸运的驱逐舰,多位画师、花了大款的大佬亲情奉献。"]],
                    kangfusi_R: ["female", "USN", 3, ["dajiaoduguibi", "quzhudd"], ["des:水手服欸,优秀的构图,不过图少改造晚。"]],
                    "47project_R": ["female", "USN", 3, ["dajiaoduguibi", "quzhudd"], ["des:这是个依赖科技的舰船,有着科幻的舰装,与兼备温柔体贴与意气风发的表现。"]],
                    guzhuyizhichuixue_R: ["female", "shu", 3, ["dajiaoduguibi", "quzhudd", "guzhuyizhi"], ["des:水手服与宽袖的结合,给人以温柔的感觉。"]],
                    shuileizhanduichuixue_R: ["female", "shu", 3, ["dajiaoduguibi", "quzhudd", "shuileizhandui",], ["des:水手服与宽袖的结合,给人以温柔的感觉。"]],
                    mingsike_R: ["female", "qun", 3, ["dajiaoduguibi", "quzhudd", "manchangzhanyi", "manchangzhanyi_1"], ["des:跑得快,看得多。"]],
                    "u1405_R": ["female", "wu", 2, ["qianting", "baiyin_skill"], ["des:无需隐匿的偷袭大师,马上就让对手的后勤捉襟见肘。"]],
                    baiyanjuren_R: ["female", "wu", 3, ["junfu"], ["des:需要武器支援,伙计倒下了。"]],
                    changchun_R: ["female", "wu", 3, ["daoqu", "tianyi"], ["des:尚处于正能量之时。"]],*/
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
            intro: "制作组群,730255133。<br>长按或右键下方全局技能的选项简介查看技能详情,可根据需要开关",
            author: "※人杰地灵游戏中",
            diskURL: "https://pan.baidu.com/s/1VPMQuAUgucpRRbef9Dmy3g?pwd=gfmv",
            forumURL: "",
            version: "4.0+",
        }, files: { "character": [], "card": [], "skill": [] }
    }

})
