
//===================================

//【基础语法注意事项】
//写在前面：本文件中变量名大小写敏感,且需要注意是否有s（例如target-targets）
//filter中使用event.,不能使用trigger.。trigger.在content中使用。
//filter函数（条件函数）里的event是触发事件,但content函数（效果函数）里的trigger才是触发事件,event是当前的技能事件。
//event.getParent()是当前技能事件的上一级父事件,event.getParent(2)是当前技能事件的上二级父事件。
//"step 0"必须从0开始,引号可以是单引号或双引号,但是整个技能里面不能变。
//本扩展名称和路径中“舰R牌将”一律大写

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
//import { checkBegin } from '../../noname/library/assembly/buildin.js';
//import { delay, freezeButExtensible } from '../../noname/util/index.js';
import { jianrjinji } from "./jianrjinji.js";
import { weightedRandom } from "./utils.js";
import { skillAnimations } from "./skillAnimations.js";
import { skinRegistry } from "./skinSystem.js";
import { initLimitedBanner } from "./limitedBanner.js";

// —— 扩展名缓存与探测 ——
// 目录模式下启动时探测每张立绘真实扩展名：先试 .png，404 再试 .jpg。
// 结果存入 skinAssetCache，后续调用全部同步查表。
// 值约定：'.png' / '.jpg' = 已探测存在；null = 已探测但都不存在；undefined = 尚未探测
// 放在主文件里是因为异步版要用 lib.assetURL（依赖 noname.js 已初始化的 lib），
// 同步版和异步版共享同一个缓存，所以一起放这里。
var skinAssetCache = {};

// Electron 下尝试拿到 fs，纯浏览器模式会拿不到，留给 Image 异步探测回退
var jianrFs = null;
try {
    jianrFs = require('fs');
} catch (e) {
    jianrFs = null;
}

// 同步探测：Electron 环境下直接 fs.existsSync 查磁盘，能在 precontent 同步流程里
// 拿到结果。纯浏览器模式无 fs，返回 undefined，调用方应退回 probeJianRAssetExt 异步方案。
// 返回值和异步版一致：'.png' / '.jpg' / null / undefined（此处 undefined = 没有 fs，无法同步探测）
function probeJianRAssetExtSync(relativeBase) {
    var key = relativeBase;
    if (skinAssetCache[key] !== undefined) return skinAssetCache[key];
    if (!jianrFs) return undefined;
    try {
        var base = 'extension/舰R牌将/' + relativeBase;
        if (jianrFs.existsSync(base + '.png')) {
            skinAssetCache[key] = '.png';
            return '.png';
        }
        if (jianrFs.existsSync(base + '.jpg')) {
            skinAssetCache[key] = '.jpg';
            return '.jpg';
        }
        // 两个后缀都找不到时不写 null 进缓存 —— 这里的相对路径依赖 process.cwd(),
        // Windows 打包后 cwd 未必是游戏根目录,existsSync 会全部 false,
        // 写 null 进缓存会把后续异步 probe 的 Image() 探测也短路掉。
        return null;
    } catch (e) {
        console.warn('[舰R牌将 probeSync] error', key, e);
        return undefined;
    }
}

function probeJianRAssetExt(relativeBase) {
    var key = relativeBase;
    if (skinAssetCache[key] !== undefined) {
        console.log('[舰R牌将 probe] cache hit', key, '=', skinAssetCache[key]);
        return Promise.resolve(skinAssetCache[key]);
    }
    return new Promise(function (resolve) {
        var base = lib.assetURL + 'extension/' + '舰R牌将' + '/' + relativeBase;
        console.log('[舰R牌将 probe] start', key, 'base=', base);
        var pngImg = new Image();
        pngImg.onload = function () {
            skinAssetCache[key] = '.png';
            console.log('[舰R牌将 probe] hit .png', key);
            resolve('.png');
        };
        pngImg.onerror = function () {
            var jpgImg = new Image();
            jpgImg.onload = function () {
                skinAssetCache[key] = '.jpg';
                console.log('[舰R牌将 probe] hit .jpg', key);
                resolve('.jpg');
            };
            jpgImg.onerror = function () {
                skinAssetCache[key] = null;
                console.warn('[舰R牌将 probe] miss both', key);
                resolve(null);
            };
            jpgImg.src = base + '.jpg';
        };
        pngImg.src = base + '.png';
    });
}

game.import("extension", function (lib, game, ui, get, ai, _status) {

    return {
        name: "舰R牌将",
        content: function (config, pack) {
            // ╔══════════════════════════════════════════════════════════════╗
            // ║ 1. 势力注册 + 发光 CSS                                        ║
            // ╚══════════════════════════════════════════════════════════════╝
            // 每个势力依次注入 lib.groupnature / lib.group / lib.translate，
            // 再 append 三条 CSS：data-nature='{势力}'（外发光）/ {势力}m（中）/ {势力}mm（小）。
            // 新增势力：复制一段，改 rgba 颜色与势力名。

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

            style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='KMS'],";
            style2.innerHTML += "div[data-nature='KMS'],";
            style2.innerHTML += "span[data-nature='KMS'] {text-shadow: black 0 0 1px,rgba(128, 0, 0,1) 0 0 2px,rgba(128, 0, 0,1) 0 0 5px,rgba(128, 0, 0,1) 0 0 10px,rgba(128, 0, 0,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='KMSm'],";
            style2.innerHTML += "span[data-nature='KMSm'] {text-shadow: black 0 0 1px,rgba(128, 0, 0,1) 0 0 2px,rgba(128, 0, 0,1) 0 0 5px,rgba(128, 0, 0,1) 0 0 5px,rgba(128, 0, 0,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='KMSmm'],";
            style2.innerHTML += "span[data-nature='KMSmm'] {text-shadow: black 0 0 1px,rgba(128, 0, 0,1) 0 0 2px,rgba(128, 0, 0,1) 0 0 2px,rgba(128, 0, 0,1) 0 0 2px,rgba(128, 0, 0,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='USN'],";
            style2.innerHTML += "div[data-nature='USN'],";
            style2.innerHTML += "span[data-nature='USN'] {text-shadow: black 0 0 1px,rgba(0, 0, 160,1) 0 0 2px,rgba(0, 0, 160,1) 0 0 5px,rgba(0, 0, 160,1) 0 0 10px,rgba(0, 0, 160,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='USNm'],";
            style2.innerHTML += "span[data-nature='USNm'] {text-shadow: black 0 0 1px,rgba(0, 0, 160,1) 0 0 2px,rgba(0, 0, 160,1) 0 0 5px,rgba(0, 0, 160,1) 0 0 5px,rgba(0, 0, 160,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='USNmm'],";
            style2.innerHTML += "span[data-nature='USNmm'] {text-shadow: black 0 0 1px,rgba(0, 0, 160,1) 0 0 2px,rgba(0, 0, 160,1) 0 0 2px,rgba(0, 0, 160,1) 0 0 2px,rgba(0, 0, 160,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='RN'],";
            style2.innerHTML += "div[data-nature='RN'],";
            style2.innerHTML += "span[data-nature='RN'] {text-shadow: black 0 0 1px,rgba(0, 255, 128,1) 0 0 2px,rgba(0, 255, 128,1) 0 0 5px,rgba(0, 255, 128,1) 0 0 10px,rgba(0, 255, 128,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='RNm'],";
            style2.innerHTML += "span[data-nature='RNm'] {text-shadow: black 0 0 1px,rgba(0, 255, 128,1) 0 0 2px,rgba(0, 255, 128,1) 0 0 5px,rgba(0, 255, 128,1) 0 0 5px,rgba(0, 255, 128,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='RNmm'],";
            style2.innerHTML += "span[data-nature='RNmm'] {text-shadow: black 0 0 1px,rgba(0, 255, 128,1) 0 0 2px,rgba(0, 255, 128,1) 0 0 2px,rgba(0, 255, 128,1) 0 0 2px,rgba(0, 255, 128,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='IJN'],";
            style2.innerHTML += "div[data-nature='IJN'],";
            style2.innerHTML += "span[data-nature='IJN'] {text-shadow: black 0 0 1px,rgba(255, 255, 128,1) 0 0 2px,rgba(255, 255, 128,1) 0 0 5px,rgba(255, 255, 128,1) 0 0 10px,rgba(255, 255, 128,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='IJNm'],";
            style2.innerHTML += "span[data-nature='IJNm'] {text-shadow: black 0 0 1px,rgba(255, 255, 128,1) 0 0 2px,rgba(255, 255, 128,1) 0 0 5px,rgba(255, 255, 128,1) 0 0 5px,rgba(255, 255, 128,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='IJNmm'],";
            style2.innerHTML += "span[data-nature='IJNmm'] {text-shadow: black 0 0 1px,rgba(255, 255, 128,1) 0 0 2px,rgba(255, 255, 128,1) 0 0 2px,rgba(255, 255, 128,1) 0 0 2px,rgba(255, 255, 128,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='MN'],";
            style2.innerHTML += "div[data-nature='MN'],";
            style2.innerHTML += "span[data-nature='MN'] {text-shadow: black 0 0 1px,rgba(0, 128, 255,1) 0 0 2px,rgba(0, 128, 255,1) 0 0 5px,rgba(0, 128, 255,1) 0 0 10px,rgba(0, 128, 255,1) 0 0 10px}";
            style2.innerHTML += "div[data-nature='MNm'],";
            style2.innerHTML += "span[data-nature='MNm'] {text-shadow: black 0 0 1px,rgba(0, 128, 255,1) 0 0 2px,rgba(0, 128, 255,1) 0 0 5px,rgba(0, 128, 255,1) 0 0 5px,rgba(0, 128, 255,1) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='MNmm'],";
            style2.innerHTML += "span[data-nature='MNmm'] {text-shadow: black 0 0 1px,rgba(0, 128, 255,1) 0 0 2px,rgba(0, 128, 255,1) 0 0 2px,rgba(0, 128, 255,1) 0 0 2px,rgba(0, 128, 255,1) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='RM'],";
            style2.innerHTML += "div[data-nature='RM'],";
            style2.innerHTML += "span[data-nature='RM'] {text-shadow: black 0 0 1px,rgba(128, 0, 128) 0 0 2px,rgba(128, 0, 128) 0 0 5px,rgba(128, 0, 128) 0 0 10px,rgba(128, 0, 128) 0 0 10px}";
            style2.innerHTML += "div[data-nature='RMm'],";
            style2.innerHTML += "span[data-nature='RMm'] {text-shadow: black 0 0 1px,rgba(128, 0, 128) 0 0 2px,rgba(128, 0, 128) 0 0 5px,rgba(128, 0, 128) 0 0 5px,rgba(128, 0, 128) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='RMmm'],";
            style2.innerHTML += "span[data-nature='RMmm'] {text-shadow: black 0 0 1px,rgba(128, 0, 128) 0 0 2px,rgba(128, 0, 128) 0 0 2px,rgba(128, 0, 128) 0 0 2px,rgba(128, 0, 128) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='ΒΜΦCCCP'],";
            style2.innerHTML += "div[data-nature='ΒΜΦCCCP'],";
            style2.innerHTML += "span[data-nature='ΒΜΦCCCP'] {text-shadow: black 0 0 1px,rgba(255, 128, 0) 0 0 2px,rgba(255, 128, 0) 0 0 5px,rgba(255, 128, 0) 0 0 10px,rgba(255, 128, 0) 0 0 10px}";
            style2.innerHTML += "div[data-nature='ΒΜΦCCCPm'],";
            style2.innerHTML += "span[data-nature='ΒΜΦCCCPm'] {text-shadow: black 0 0 1px,rgba(255, 128, 0) 0 0 2px,rgba(255, 128, 0) 0 0 5px,rgba(255, 128, 0) 0 0 5px,rgba(255, 128, 0) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='ΒΜΦCCCPmm'],";
            style2.innerHTML += "span[data-nature='ΒΜΦCCCPmm'] {text-shadow: black 0 0 1px,rgba(255, 128, 0) 0 0 2px,rgba(255, 128, 0) 0 0 2px,rgba(255, 128, 0) 0 0 2px,rgba(255, 128, 0) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='ROCN'],";
            style2.innerHTML += "div[data-nature='ROCN'],";
            style2.innerHTML += "span[data-nature='ROCN'] {text-shadow: black 0 0 1px,rgba(255, 128, 128) 0 0 2px,rgba(255, 128, 128) 0 0 5px,rgba(255, 128, 128) 0 0 10px,rgba(255, 128, 128) 0 0 10px}";
            style2.innerHTML += "div[data-nature='ROCNm'],";
            style2.innerHTML += "span[data-nature='ROCNm'] {text-shadow: black 0 0 1px,rgba(255, 128, 128) 0 0 2px,rgba(255, 128, 128) 0 0 5px,rgba(255, 128, 128) 0 0 5px,rgba(255, 128, 128)8)8) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='ROCNmm'],";
            style2.innerHTML += "span[data-nature='ROCNmm'] {text-shadow: black 0 0 1px,rgba(255, 128, 128) 0 0 2px,rgba(255, 128, 128) 0 0 2px,rgba(255, 128, 128) 0 0 2px,rgba(255, 128, 128) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            style2 = document.createElement('style');
            style2.innerHTML = ".player.identity[data-color='OTHER'],";
            style2.innerHTML += "div[data-nature='OTHER'],";
            style2.innerHTML += "span[data-nature='OTHER'] {text-shadow: black 0 0 1px,rgba(0, 0, 0) 0 0 2px,rgba(0, 0, 0) 0 0 5px,rgba(0, 0, 0) 0 0 10px,rgba(0, 0, 0) 0 0 10px}";
            style2.innerHTML += "div[data-nature='OTHERm'],";
            style2.innerHTML += "span[data-nature='OTHERm'] {text-shadow: black 0 0 1px,rgba(0, 0, 0) 0 0 2px,rgba(0, 0, 0) 0 0 5px,rgba(0, 0, 0) 0 0 5px,rgba(0, 0, 0) 0 0 5px,black 0 0 1px;}";
            style2.innerHTML += "div[data-nature='OTHERmm'],";
            style2.innerHTML += "span[data-nature='OTHERmm'] {text-shadow: black 0 0 1px,rgba(0, 0, 0) 0 0 2px,rgba(0, 0, 0) 0 0 2px,rgba(0, 0, 0) 0 0 2px,rgba(0, 0, 0) 0 0 2px,black 0 0 1px;}";
            document.head.appendChild(style2);

            // ╔══════════════════════════════════════════════════════════════╗
            // ║ 2. 通用模式判定 + 资源 URL 解析（后续模块共用）                ║
            // ╚══════════════════════════════════════════════════════════════╝
            // isImportedMode：true=DB 导入模式（资源走 db:），false=目录直读模式（走 ext:）。
            // resolveImageUrl(relativePath, cb)：异步拿到一个可直接喂 backgroundImage 的 URL。
            // 这两位被 战斗特效 / 限定技横幅 / 使命变装 / 皮肤系统 / 默认剪影背景 共用。
            var isImportedMode = !!_status.evaluatingExtension;

            function createImageResolver(isImportedMode) {
                var cache = {};
                return function resolveImageUrl(relativePath, callback) {
                    if (cache[relativePath]) {
                        callback(cache[relativePath]);
                        return;
                    }
                    if (isImportedMode) {
                        var dbKey = "extension-" + '舰R牌将' + ":" + relativePath;
                        if (typeof game.getDB === "function") {
                            game.getDB("image", dbKey).then(function (url) {
                                if (!url) return;
                                cache[relativePath] = url;
                                callback(url);
                            });
                        }
                    } else {
                        var url = lib.assetURL + "extension/" + '舰R牌将' + "/" + relativePath;
                        cache[relativePath] = url;
                        callback(url);
                    }
                };
            }
            var resolveImageUrl = createImageResolver(isImportedMode);

            // ╔══════════════════════════════════════════════════════════════╗
            // ║ 3. 舰R战斗特效动画                                            ║
            // ╚══════════════════════════════════════════════════════════════╝
            // 钩子点：lib.animate.skill[技能id]，由 trySkillAnimate 在 logSkill 时自动调用。
            // 动画素材映射在 skillAnimations.js，本段把它包装到 lib.animate.skill。
            var CONFIG_ANIMATION_ENABLE = "extension_" + '舰R牌将' + "_enable_effects";
            var CONFIG_ANIMATION_OPACITY = "extension_" + '舰R牌将' + "_effect_opacity";
            function resolveAnimationImageUrl(fileName, callback) {
                resolveImageUrl("image/animation/" + fileName, callback);
            }

            // 注入战斗特效 CSS
            if (!document.getElementById("jianr-battle-animation-style")) {
                var animationStyleEl = document.createElement("style");
                animationStyleEl.id = "jianr-battle-animation-style";
                animationStyleEl.textContent =
                    ".jianr-battle-animation{" +
                    "pointer-events:none;" +
                    "z-index:10;" +
                    "background-size:contain;" +
                    "background-repeat:no-repeat;" +
                    "background-position:center;" +
                    "opacity:0;" +
                    "transition:opacity 0.3s ease-in;" +
                    "}" +
                    ".jianr-battle-animation.jianr-animation-active{opacity:var(--jianr-animation-opacity,1);}" +
                    ".jianr-battle-animation.jianr-animation-fadeout{opacity:0 !important;transition:opacity 0.5s ease-out;}" +
                    ".jianr-battle-animation.jianr-animation-fullscreen{" +
                    "position:fixed;top:0;left:0;width:100%;height:100%;" +
                    "}" +
                    ".jianr-battle-animation.jianr-animation-local{" +
                    "position:absolute;top:0;left:0;width:100%;height:100%;" +
                    "}";
                document.head.appendChild(animationStyleEl);
            }

            // 运行时取配置
            function getAnimationOpacity() {
                var choice = lib.config[CONFIG_ANIMATION_OPACITY];
                var map = { opacity100: 1, opacity80: 0.8, opacity60: 0.6, opacity40: 0.4 };
                return map[choice] != null ? map[choice] : 1;
            }
            function isAnimationEnabled() {
                return lib.config[CONFIG_ANIMATION_ENABLE] !== false;
            }

            // 解析 GIF89a 各帧 Graphic Control Extension 的延时之和（毫秒）
            // 找不到或非 GIF 时返回 0，让调用方走兜底时长
            function parseGifDuration(buffer) {
                var bytes = new Uint8Array(buffer);
                if (bytes.length < 6 || bytes[0] !== 0x47 || bytes[1] !== 0x49 || bytes[2] !== 0x46) return 0;
                var totalCs = 0;
                for (var i = 0; i < bytes.length - 8; i++) {
                    // GCE 块头：0x21 0xF9 0x04 [packed] [delay_lo] [delay_hi] [trans_idx] 0x00
                    if (bytes[i] === 0x21 && bytes[i + 1] === 0xF9 && bytes[i + 2] === 0x04 && bytes[i + 7] === 0x00) {
                        totalCs += bytes[i + 4] | (bytes[i + 5] << 8);
                        i += 7;
                    }
                }
                return totalCs * 10;
            }

            // 缓存每个 URL 的解析结果，避免每次触发都重新 fetch
            var gifDurationCache = {};
            function getGifDuration(url, fallback, callback) {
                if (gifDurationCache[url] != null) { callback(gifDurationCache[url]); return; }
                try {
                    fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
                        var ms = parseGifDuration(buf);
                        if (!ms || ms < 100) ms = fallback;
                        gifDurationCache[url] = ms;
                        callback(ms);
                    }).catch(function () { callback(fallback); });
                } catch (e) { callback(fallback); }
            }

            // 用 <video preload="metadata"> 探测视频时长
            var videoDurationCache = {};
            function getVideoDuration(url, fallback, callback) {
                if (videoDurationCache[url] != null) { callback(videoDurationCache[url]); return; }
                try {
                    var probe = document.createElement("video");
                    probe.preload = "metadata";
                    probe.muted = true;
                    probe.onloadedmetadata = function () {
                        var ms = (probe.duration && isFinite(probe.duration)) ? Math.round(probe.duration * 1000) : 0;
                        if (!ms || ms < 100) ms = fallback;
                        videoDurationCache[url] = ms;
                        callback(ms);
                    };
                    probe.onerror = function () { callback(fallback); };
                    probe.src = url;
                } catch (e) { callback(fallback); }
            }

            // 按文件后缀分类。视频/GIF 走自适应时长，普通图片用 options.duration
            function getMediaType(fileName) {
                var lower = (fileName || "").toLowerCase();
                if (/\.(mp4|webm|mov|m4v|ogv)$/.test(lower)) return "video";
                if (/\.gif$/.test(lower)) return "gif";
                return "image";
            }

            function getMediaDuration(url, mediaType, fallback, callback) {
                if (mediaType === "gif") { getGifDuration(url, fallback, callback); return; }
                if (mediaType === "video") { getVideoDuration(url, fallback, callback); return; }
                callback(fallback); // 普通图片维持配置时长
            }

            // 动画显示核心函数
            function showBattleEffect(player, fileName, options) {
                if (!isAnimationEnabled()) return;
                if (!player) return;
                if (lib.config && lib.config.low_performance) return;

                var node = ui.create.div(".jianr-battle-animation");
                if (options.fullscreen) {
                    node.classList.add("jianr-animation-fullscreen");
                    // size: 0~1 之间时，按窗口比例缩放并居中（默认占满）
                    if (options.size && options.size > 0 && options.size < 1) {
                        var pct = (options.size * 100) + "%";
                        node.style.width = pct;
                        node.style.height = pct;
                        node.style.top = "50%";
                        node.style.left = "50%";
                        node.style.transform = "translate(-50%, -50%)";
                    }
                    ui.window.appendChild(node);
                } else {
                    node.classList.add("jianr-animation-local");
                    player.appendChild(node);
                }
                node.style.setProperty("--jianr-animation-opacity", getAnimationOpacity());

                var cleaned = false;
                var safetyTimer = null;
                function cleanup() {
                    if (cleaned) return;
                    cleaned = true;
                    if (safetyTimer) clearTimeout(safetyTimer);
                    if (node.parentNode) node.parentNode.removeChild(node);
                }
                // 兜底：在拿到真实时长前，先按 fallback+宽裕量挂一个清理定时器
                var fallbackDuration = options.duration || 2000;
                safetyTimer = setTimeout(cleanup, fallbackDuration + 5000);

                var mediaType = getMediaType(fileName);

                // 视频用 <video> 元素呈现，图片/GIF 走 background-image
                function presentMedia(url, onReady) {
                    if (mediaType === "video") {
                        var video = document.createElement("video");
                        video.muted = true;
                        video.playsInline = true;
                        video.autoplay = true;
                        video.loop = false;
                        video.style.position = "absolute";
                        video.style.top = "0";
                        video.style.left = "0";
                        video.style.width = "100%";
                        video.style.height = "100%";
                        video.style.objectFit = "contain";
                        video.onloadeddata = function () { onReady(true); };
                        video.onerror = function () { onReady(false); };
                        video.src = url;
                        node.appendChild(video);
                    } else {
                        var img = new Image();
                        img.onload = function () {
                            node.style.backgroundImage = 'url("' + url + '")';
                            ui.refresh(node);
                            onReady(true);
                        };
                        img.onerror = function () { onReady(false); };
                        img.src = url;
                    }
                }

                resolveAnimationImageUrl(fileName, function (url) {
                    if (cleaned || !node.parentNode) return;
                    getMediaDuration(url, mediaType, fallbackDuration, function (duration) {
                        if (cleaned || !node.parentNode) return;
                        // 真实时长拿到后，刷新兜底定时器
                        if (safetyTimer) clearTimeout(safetyTimer);
                        safetyTimer = setTimeout(cleanup, duration + 5000);
                        presentMedia(url, function (ok) {
                            if (cleaned || !node.parentNode) return;
                            if (!ok) { cleanup(); return; }
                            node.classList.add("jianr-animation-active");
                            setTimeout(function () {
                                if (cleaned) return;
                                node.classList.add("jianr-animation-fadeout");
                                setTimeout(cleanup, 520);
                            }, duration);
                        });
                    });
                });
            }

            // 技能 → 动画映射（7 个主动/被动触发的技能），见 skillAnimations.js
            // 注册到 lib.animate.skill：trySkillAnimate 会在 logSkill 时用 player 作 this 调用
            if (!lib.animate) lib.animate = { skill: {}, card: {} };
            if (!lib.animate.skill) lib.animate.skill = {};
            for (var skillId in skillAnimations) {
                (function (id, cfg) {
                    lib.animate.skill[id] = function (skillName) {
                        showBattleEffect(this, cfg.image, cfg);
                    };
                })(skillId, skillAnimations[skillId]);
            }

            // ╔══════════════════════════════════════════════════════════════╗
            // ║ 4. 弹窗工具 + 系统按钮（机制介绍）                             ║
            // ╚══════════════════════════════════════════════════════════════╝
            // game.jianRAlert：可自定义样式的 alert 对话框，限本扩展使用。
            // setInterval 等待 ui.system1/2 出现后，挂一个"舰R杀机制介绍"系统按钮。

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
                    ui.jian_R_readme = ui.create.system('舰R杀机制介绍', function () {
                        game.jianRAlert(
                            // 保留悬挂缩进的文本结构
                            "<p style='margin: 0; padding: 0; margin-bottom: 12px;'><b>开启军争篇卡牌包或舰R美化包战术包时装备栏共有五个,分别是：武器、防具、+1马、-1马、宝物。</b></p>" +
                            "<p style='margin: 0; padding: 0; margin-bottom: 12px;'>皮肤系统：可以在武将编辑界面左键单击，或对局中左键双击武将立绘呼出武将详情，点击详情立绘下滑选择、点击切换皮肤</p>" +
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

            // ╔══════════════════════════════════════════════════════════════╗
            // ║ 5. 全局武将标签 + 死亡台词                                    ║
            // ╚══════════════════════════════════════════════════════════════╝
            // 配置开关 jianrjinji=true 时禁用 AI（forbidai）；_DieSound 注册全局阵亡音效。
            // TODO（保留原作者备注）：阵亡音效后续应迁移到 character 数组里的 die: 标签，
            //   eg. lib.character.guanyu.dieAudios = [true, "ext:无名扩展/audio/die:true"]

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
                    // 浏览器模式下通过静态路径读取资源时,目录名大小写不一致会导致资源 404。
                    game.playAudio('..', 'extension', '舰R牌将/audio/die', trigger.player.name + ".mp3");
                },
            }

            // ╔══════════════════════════════════════════════════════════════╗
            // ║ 6. 限定技横幅动画                                             ║
            // ╚══════════════════════════════════════════════════════════════╝
            // 立绘位 GIF 替换 + 自定义发光色，具体逻辑在 limitedBanner.js。
            initLimitedBanner(resolveImageUrl);

            // ╔══════════════════════════════════════════════════════════════╗
            // ║ 7. 使命变装（自动识别 dutySkill: true 标签）                   ║
            // ╚══════════════════════════════════════════════════════════════╝
            // 使命技能成功/失败时自动切换武将立绘。
            // 添加新武将：把 <武将ID>_victory.jpg / <武将ID>_defeat.jpg 放入 image/character/，
            // 技能定义中设置 dutySkill: true 即可自动生效，无需手动配置。

            function buildMissionImageTag(relativePath) {
                if (isImportedMode) {
                    return "db:extension-" + '舰R牌将' + ":" + relativePath;
                }
                return "ext:" + '舰R牌将' + "/" + relativePath;
            }

            // 自动扫描所有武将，找出拥有使命技的武将并注册替代皮肤
            if (!lib.characterSubstitute) lib.characterSubstitute = {};
            for (var mpCharName in lib.character) {
                var mpCharData = lib.character[mpCharName];
                if (!mpCharData || !mpCharData[3]) continue;
                var mpSkills = mpCharData[3];
                for (var msi = 0; msi < mpSkills.length; msi++) {
                    var mpSkillDef = lib.skill[mpSkills[msi]];
                    if (mpSkillDef && mpSkillDef.dutySkill) {
                        if (!lib.characterSubstitute[mpCharName]) lib.characterSubstitute[mpCharName] = [];
                        registerMissionSubstitute(mpCharName, mpCharName + "_victory");
                        registerMissionSubstitute(mpCharName, mpCharName + "_defeat");
                        break; // 每个武将只需注册一次
                    }
                }
            }
            // 查找使命立绘的实际文件扩展名（兼容 .jpg 和 .png）
            // 必须同步返回：调用方 registerMissionSubstitute 要在启动阶段同步把
            // lib.character[skinName] 填好，晚于使命技 awakenSkill 就会拿到空条目。
            function getMissionImageExt(skinName) {
                if (isImportedMode) {
                    var extInfo = lib.config && lib.config.extensionInfo && lib.config.extensionInfo['舰R牌将'];
                    var fileList = extInfo && Array.isArray(extInfo.file) ? extInfo.file : [];
                    var prefix = 'image/character/' + skinName;
                    for (var fi = 0; fi < fileList.length; fi++) {
                        var fp = fileList[fi];
                        if (typeof fp === 'string' && fp.indexOf(prefix) === 0) {
                            return fp.slice(prefix.length);
                        }
                    }
                    return '.jpg';
                }
                // 目录模式：fs.existsSync 同步探测；纯浏览器无 fs 时 fallback .jpg
                var syncExt = probeJianRAssetExtSync('image/character/' + skinName);
                return syncExt || '.jpg';
            }
            function registerMissionSubstitute(origCharName, skinName) {
                var list = lib.characterSubstitute[origCharName];
                for (var si = 0; si < list.length; si++) {
                    if (list[si] && list[si][0] === skinName) return;
                }
                var ext = getMissionImageExt(skinName);
                var tag = buildMissionImageTag("image/character/" + skinName + ext);
                list.push([skinName, [tag]]);
                // 预注册使命皮肤的角色数据，保留原武将性别，
                // 防止 changeSkin 创建临时条目时 sex 为空导致背景从 female 变成 male
                var origData = lib.character[origCharName];
                var origSex = origData && origData[0] || 'female';
                // minskin + forbidai 双保险：
                //   createCharacterDialog 走 characterDisabled2 —— 看 isMinskin
                //   random_pick / 联机头像 等走 characterDisabled —— 只看 isAiForbidden / isUnseen
                // 只标 minskin 过不了后一条，皮肤条目会在随机选将等处以"新武将"身份露出
                var skinEntry = [origSex, "", 0, [], [tag, "minskin", "forbidai"]];
                lib.character[skinName] = skinEntry;
            }

            // Monkey-patch awakenSkill：使命觉醒时切换立绘
            var originalAwakenSkill = lib.element.Player.prototype.awakenSkill;
            lib.element.Player.prototype.awakenSkill = function (skill, nounmark) {
                var wasAwakened = this.awakenedSkills && this.awakenedSkills.includes(skill);
                var ret = originalAwakenSkill.call(this, skill, nounmark);
                if (!wasAwakened && lib.skill[skill] && lib.skill[skill].dutySkill) {
                    try {
                        handleMissionComplete(this, skill);
                    } catch (e) {
                        console.log("[使命变装] 切换立绘失败:", e);
                    }
                }
                return ret;
            };

            function handleMissionComplete(player, dutySkillName) {
                // 从玩家身上找到拥有该使命技的武将名
                var charName = null;
                var candidates = [player.name, player.name1, player.name2];
                for (var ci = 0; ci < candidates.length; ci++) {
                    var cn = candidates[ci];
                    if (!cn || !lib.character[cn] || !lib.character[cn][3]) continue;
                    if (lib.character[cn][3].includes(dutySkillName)) {
                        charName = cn;
                        break;
                    }
                }
                if (!charName) return;

                // 从事件栈判定当前位于 achieve（成功）还是 fail（失败）分支
                // 引擎使命技惯例：成功子技能后缀 _achieve，失败子技能后缀 _fail
                var evt = _status.event;
                var isSuccess = null;
                while (evt) {
                    if (evt.skill === dutySkillName + "_achieve") { isSuccess = true; break; }
                    if (evt.skill === dutySkillName + "_fail") { isSuccess = false; break; }
                    evt = evt.parent;
                }
                if (isSuccess === null) return;

                var targetSkin = isSuccess ? charName + "_victory" : charName + "_defeat";
                player.changeSkin({ characterName: charName }, targetSkin);
            }

            // ╔══════════════════════════════════════════════════════════════╗
            // ║ 8. 扩展内皮肤系统                                             ║
            // ╚══════════════════════════════════════════════════════════════╝
            // 向引擎注册皮肤数量（调试模式下的皮肤菜单会读 lib.skin）
            if (!lib.skin) lib.skin = {};
            for (var name in skinRegistry) {
                lib.skin[name] = skinRegistry[name];
            }

            // —— 扩展名缓存与异步探测 ——
            // 目录模式下启动时并发探测每张皮肤真实扩展名：先试 .png，404 再试 .jpg。
            // 结果存入 skinExtCache，后续调用全部同步查表。
            // 值约定：'.png' / '.jpg' = 已探测存在；null = 已探测但都不存在；undefined = 尚未探测
            var skinExtCache = {};

            function probeSkinExt(charName, num) {
                var key = charName + '/' + num;
                if (skinExtCache[key] !== undefined) return Promise.resolve(skinExtCache[key]);
                return new Promise(function (resolve) {
                    var base = lib.assetURL + 'extension/' + '舰R牌将' + '/image/skin/' + charName + '/' + num;
                    var pngImg = new Image();
                    pngImg.onload = function () {
                        skinExtCache[key] = '.png';
                        resolve('.png');
                    };
                    pngImg.onerror = function () {
                        var jpgImg = new Image();
                        jpgImg.onload = function () {
                            skinExtCache[key] = '.jpg';
                            resolve('.jpg');
                        };
                        jpgImg.onerror = function () {
                            skinExtCache[key] = null;
                            resolve(null);
                        };
                        jpgImg.src = base + '.jpg';
                    };
                    pngImg.src = base + '.png';
                });
            }

            // 同步取扩展名。导入模式从 extensionInfo.file 反查；目录模式读缓存
            function getSkinExt(charName, num) {
                if (isImportedMode) {
                    var extInfo = lib.config && lib.config.extensionInfo && lib.config.extensionInfo['舰R牌将'];
                    var fileList = extInfo && Array.isArray(extInfo.file) ? extInfo.file : [];
                    var prefix = 'image/skin/' + charName + '/' + num;
                    for (var fi = 0; fi < fileList.length; fi++) {
                        var fp = fileList[fi];
                        if (typeof fp === 'string' && fp.indexOf(prefix) === 0) {
                            return fp.slice(prefix.length);
                        }
                    }
                    return '.jpg';
                }
                // 目录模式：缓存命中返回真实扩展名，未命中临时返回 .jpg（调用方若需精确值应走 probeSkinExt）
                return skinExtCache[charName + '/' + num] || '.jpg';
            }
            function skinFullPath(charName, num) {
                return 'extension/' + '舰R牌将' + '/image/skin/' + charName + '/' + num + getSkinExt(charName, num);
            }
            function skinDbKey(charName, num) {
                return 'extension-' + '舰R牌将' + ':image/skin/' + charName + '/' + num + getSkinExt(charName, num);
            }

            // 启动预热：并发探测所有注册皮肤的扩展名，游戏加载期间完成
            if (!isImportedMode) {
                for (var regName in skinRegistry) {
                    for (var ri = 1; ri <= skinRegistry[regName]; ri++) {
                        probeSkinExt(regName, ri);
                    }
                }
            }

            // ① 补丁 setBackground：扩展武将选中皮肤时从扩展目录加载
            var _origSetBg = HTMLDivElement.prototype.setBackground;
            HTMLDivElement.prototype.setBackground = function (name, type, ext, subfolder) {
                if (type === 'character' && name && skinRegistry[name] &&
                    lib.config.skin[name] && arguments[2] !== 'noskin') {
                    var skinNum = lib.config.skin[name];
                    if (isImportedMode) {
                        this.setBackgroundDB(skinDbKey(name, skinNum));
                        return this;
                    }
                    var nameinfo = get.character(name);
                    var sex = (nameinfo && ['male', 'female', 'double'].indexOf(nameinfo[0]) >= 0)
                        ? nameinfo[0] : 'male';
                    // 默认剪影背景优先走 fs 探测，兼容用户把 default_bg_{sex} 换成 png。
                    // 探测不出（无 Node / 文件都缺）才回退到引擎传进来的 ext 或 .jpg。
                    var defaultBg = lib.characterDefaultPicturePath + sex + '.jpg';
                    var elem = this;
                    elem.style.backgroundPositionX = 'center';
                    elem.style.backgroundSize = 'cover';

                    var cacheKey = name + '/' + skinNum;
                    if (skinExtCache[cacheKey] !== undefined) {
                        // 已探测：命中则用真实扩展名，未命中（null）回落默认立绘
                        var cachedExt = skinExtCache[cacheKey];
                        if (cachedExt) {
                            elem.setBackgroundImage([skinFullPath(name, skinNum), defaultBg]);
                        } else {
                            elem.setBackgroundImage(defaultBg);
                        }
                    } else {
                        // 未探测：先显示默认立绘占位，异步探测完成后再替换
                        elem.setBackgroundImage(defaultBg);
                        probeSkinExt(name, skinNum).then(function (resolvedExt) {
                            if (!resolvedExt) return;
                            // 如果期间用户换了皮肤，配置变了就不要覆盖
                            if (lib.config.skin[name] !== skinNum) return;
                            elem.setBackgroundImage([skinFullPath(name, skinNum), defaultBg]);
                        });
                    }
                    return this;
                }
                return _origSetBg.apply(this, arguments);
            };

            // ② 补丁 ui.click.skin：点击头像切换扩展武将皮肤
            var _origClickSkin = ui.click.skin.bind(ui.click);
            ui.click.skin = function (avatar, name, callback) {
                var cleanName = name;
                if (cleanName.startsWith('gz_')) cleanName = cleanName.slice(3);
                if (!skinRegistry[cleanName]) {
                    return _origClickSkin(avatar, name, callback);
                }

                var maxSkin = skinRegistry[cleanName];
                var num = (lib.config.skin[cleanName] || 0) + 1;

                var fakeavatar = avatar.cloneNode(true);
                var finish = function (bool) {
                    var player = avatar.parentNode;
                    if (bool) {
                        fakeavatar.style.boxShadow = 'none';
                        player.insertBefore(fakeavatar, avatar.nextSibling);
                        setTimeout(function () { fakeavatar.delete(); }, 100);
                    }
                    if (bool && lib.config.animation && !lib.config.low_performance) {
                        player.$rare();
                    }
                    if (callback) callback(bool);
                };
                var resetSkin = function (hadSkin) {
                    if (hadSkin) finish(true); else finish(false);
                    delete lib.config.skin[cleanName];
                    game.saveConfig('skin', lib.config.skin);
                    avatar.setBackground(cleanName, 'character');
                };

                // 超过最大皮肤数 → 回到默认立绘
                if (num > maxSkin) {
                    delete lib.config.skin[cleanName];
                    game.saveConfig('skin', lib.config.skin);
                    avatar.setBackground(cleanName, 'character');
                    finish(true);
                    return;
                }

                if (!isImportedMode) {
                    // 目录模式：探测 png / jpg，顺便把扩展名写入缓存
                    probeSkinExt(cleanName, num).then(function (resolvedExt) {
                        if (!resolvedExt) {
                            resetSkin(!!lib.config.skin[cleanName]);
                            return;
                        }
                        lib.config.skin[cleanName] = num;
                        game.saveConfig('skin', lib.config.skin);
                        avatar.style.backgroundImage = 'url("' + lib.assetURL + skinFullPath(cleanName, num) + '")';
                        finish(true);
                    });
                } else {
                    // DB 模式：用 game.getDB 探测
                    game.getDB('image', skinDbKey(cleanName, num)).then(function (src) {
                        if (src) {
                            lib.config.skin[cleanName] = num;
                            game.saveConfig('skin', lib.config.skin);
                            avatar.style.backgroundImage = "url('" + src + "')";
                            finish(true);
                        } else {
                            resetSkin(!!lib.config.skin[cleanName]);
                        }
                    }).catch(function () {
                        resetSkin(!!lib.config.skin[cleanName]);
                    });
                }
            };

            // ③ 补丁 charactercard：为扩展武将注入皮肤选择面板
            // 原版在弹窗内探测 image/skin/{name}/1.jpg 来决定是否显示换肤面板，
            // 扩展武将的皮肤不在那个路径，所以原版探测必定失败。这里在原版弹窗生成后补挂面板。
            var _origCharCard = ui.click.charactercard.bind(ui.click);
            ui.click.charactercard = function (name, sourcenode, noedit, resume, avatar) {
                _origCharCard(name, sourcenode, noedit, resume, avatar);

                var skinName = name;
                if (skinName.startsWith('gz_shibing')) skinName = skinName.slice(3, 11);
                else if (skinName.startsWith('gz_')) skinName = skinName.slice(3);
                var skinCount = skinRegistry[skinName];
                if (!skinCount) return;

                // 找到刚创建的弹窗元素
                var layers = document.querySelectorAll('.popup-container');
                var layer = layers[layers.length - 1];
                if (!layer) return;
                var playerbg = layer.querySelector('.menubutton.large.ava');
                if (!playerbg) return;
                // 原版已创建面板（该武将在本体也有皮肤）则跳过
                if (playerbg.querySelector('.changeskin')) return;

                var bg = playerbg.querySelector('.avatar');
                if (!bg) return;

                var skinNode = ui.create.div('.changeskin', '可换肤', playerbg);
                var skinAvatars = ui.create.div('.avatars', playerbg);
                var panelCreated = false;

                var showSkinPanel = function () {
                    playerbg.classList.add('scroll');
                    if (panelCreated) return;
                    panelCreated = true;

                    if (skinCount >= 4) {
                        skinAvatars.classList.add('scroll');
                        if (lib.config.touchscreen) lib.setScroll(skinAvatars);
                    }

                    for (var i = 0; i <= skinCount; i++) {
                        (function (idx) {
                            var btn = ui.create.div(skinAvatars, function () {
                                playerbg.classList.remove('scroll');
                                if (idx > 0) {
                                    lib.config.skin[skinName] = idx;
                                    bg.style.backgroundImage = this.style.backgroundImage;
                                    if (sourcenode) sourcenode.style.backgroundImage = this.style.backgroundImage;
                                    if (avatar) avatar.style.backgroundImage = this.style.backgroundImage;
                                } else {
                                    delete lib.config.skin[skinName];
                                    bg.setBackground(skinName, 'character', 'noskin');
                                    if (sourcenode) sourcenode.setBackground(skinName, 'character', 'noskin');
                                    if (avatar) avatar.setBackground(skinName, 'character', 'noskin');
                                }
                                game.saveConfig('skin', lib.config.skin);
                            });
                            btn._link = idx;
                            if (idx > 0) {
                                if (!isImportedMode) {
                                    // 缓存未命中时异步探测，避免缩略图 URL 用错扩展名
                                    if (skinExtCache[skinName + '/' + idx] === undefined) {
                                        probeSkinExt(skinName, idx).then(function (resolvedExt) {
                                            if (resolvedExt) btn.setBackgroundImage(skinFullPath(skinName, idx));
                                        });
                                    } else {
                                        btn.setBackgroundImage(skinFullPath(skinName, idx));
                                    }
                                } else {
                                    btn.setBackgroundDB(skinDbKey(skinName, idx));
                                }
                            } else {
                                btn.setBackground(skinName, 'character', 'noskin');
                            }
                        })(i);
                    }
                };

                bg.addEventListener('click', showSkinPanel);
            };

            // ╔══════════════════════════════════════════════════════════════╗
            // ║ 9. 替换透明立绘的默认剪影背景                                  ║
            // ╚══════════════════════════════════════════════════════════════╝
            // 引擎在 setBackground 时拼 lib.characterDefaultPicturePath + sex + ext 作为 fallback，
            // 默认值是 "image/character/default_silhouette_"，这里替换为扩展目录内的自定义背景。
            // 需要在 extension/舰R牌将/image/ 下放置 default_bg_female.jpg 等文件（png 也可）。
            if (!isImportedMode) {
                lib.characterDefaultPicturePath = 'extension/' + '舰R牌将' + '/image/default_bg_';

                // 引擎硬编码 default_bg_{sex}.jpg，若用户把默认背景换成 png 需要做后置 URL 改写。
                // 思路：setBackground 原样调用引擎走完拼装，拿到 backgroundImage 后扫一遍 URL，
                // 把我们这扩展目录下的 default_bg_*.jpg 替换成实际存在的扩展名。
                var defaultBgSexList = ['female', 'male', 'double'];
                var defaultBgExtMap = {};
                var needsDefaultBgRewrite = false;
                Promise.all(defaultBgSexList.map(sexKey =>
                    probeJianRAssetExt('image/default_bg_' + sexKey).then(realExt => {
                        defaultBgExtMap[sexKey] = realExt;
                        if (realExt && realExt !== '.jpg') needsDefaultBgRewrite = true;
                    })
                )).then(() => {
                    if (needsDefaultBgRewrite) {
                        // 路径中的扩展目录名在 CSS URL 里会被 URL 编码，只用不会变的子串做快速过滤。
                        var defaultBgRewriteRegex = /(\/image\/default_bg_)(female|male|double)\.jpg/g;
                        var _prevSetBgForDefault = HTMLDivElement.prototype.setBackground;
                        HTMLDivElement.prototype.setBackground = function (name, type, ext, subfolder) {
                            var result = _prevSetBgForDefault.apply(this, arguments);
                            if (type !== 'character') return result;
                            var cur = this.style.backgroundImage;
                            if (!cur || cur.indexOf('/image/default_bg_') < 0) return result;
                            var rewritten = cur.replace(defaultBgRewriteRegex, function (match, head, sx) {
                                var actual = defaultBgExtMap[sx];
                                return (actual && actual !== '.jpg') ? (head + sx + actual) : match;
                            });
                            if (rewritten !== cur) this.style.backgroundImage = rewritten;
                            return result;
                        };
                    }
                });
            }

            //全局技能写在这上面
        },
        precontent: function () {
            // ╔══════════════════════════════════════════════════════════════╗
            // ║ A. 工具函数挂载（供技能代码访问）                              ║
            // ╚══════════════════════════════════════════════════════════════╝
            window.weightedRandom = weightedRandom;

            // ╔══════════════════════════════════════════════════════════════╗
            // ║ B. 角色图路径解析（同步优先，异步兜底）                         ║
            // ╚══════════════════════════════════════════════════════════════╝
            // 历史踩坑：之前用 `lib.device || lib.node` 判断 ext: vs db:，
            // 把"桌面浏览器 + 直接读 extension 目录"的情况误判成 db:，整包头像不显示。
            // 真正可靠的标志是 `_status.evaluatingExtension`：
            //   - false → 目录直读模式，走 `ext:舰R牌将/...`
            //   - true  → 数据库导入模式，走 `db:extension-舰R牌将:...`
            //
            // 三套接口分工：
            //   getJianRCharacterImageTagSync : 同步版，启动期把 ext: tag 直接 push 进 character[4]
            //   getJianRCharacterImageTag     : 异步版，纯浏览器无 fs 时兜底
            //   getJianRCharacterImageRelativePath : 异步版的内部步骤，先反查 fileList 再 fallback
            var jianrExtensionDirectoryName = '舰R牌将';

            var getJianRCharacterImageRelativePath = async function (characterName) {
                // 扩展若是从压缩包导入,`extensionInfo.file` 中会记录真实文件名。
                // 这里优先按“角色名 -> 实际文件路径”反查,可以保留正确的后缀。
                var extensionInfo = lib.config && lib.config.extensionInfo && lib.config.extensionInfo['舰R牌将'];
                var importedFileList = extensionInfo && Array.isArray(extensionInfo.file) ? extensionInfo.file : [];
                for (var index = 0; index < importedFileList.length; index++) {
                    var filePath = importedFileList[index];
                    if (typeof filePath !== 'string' || filePath.indexOf('image/character/') !== 0) continue;
                    var fileName = filePath.slice('image/character/'.length);
                    var dotIndex = fileName.lastIndexOf('.');
                    if (dotIndex <= 0) continue;
                    if (fileName.slice(0, dotIndex) === characterName) {
                        return filePath;
                    }
                }
                // 目录模式下同步 fs 探测 png/jpg，兼容用户手动换成 png 的立绘。
                var probedExt = await probeJianRAssetExt('image/character/' + characterName) || '.jpg';
                return 'image/character/' + characterName + probedExt;
            };
            var getJianRCharacterImageTag = function (characterName) {
                return getJianRCharacterImageRelativePath(characterName).then(function (relativePath) {
                    // 这里直接对齐引擎的资源选择方式,不再通过“是不是浏览器/设备”做环境猜测。
                    if (_status.evaluatingExtension) {
                        return 'db:extension-' + jianrExtensionDirectoryName + ':' + relativePath;
                    }
                    return 'ext:' + jianrExtensionDirectoryName + '/' + relativePath;
                });
            };
            // 同步版本：Electron 下通过 fs.existsSync 直接拿到后缀，用于 precontent 的同步 tag push
            // 阶段。这样 `return jianrjinji` 时 character[id][4] 已经带上 ext: tag，
            // 引擎首次注册/渲染时就能读到正确的扩展路径，不会去本体 image/character 下 404。
            // 无法同步解析（导入模式没命中 file 列表 + 没有 fs）时返回 null，由调用方回退异步路径。
            var getJianRCharacterImageTagSync = function (characterName) {
                // 先按导入模式反查 extensionInfo.file
                var extensionInfo = lib.config && lib.config.extensionInfo && lib.config.extensionInfo['舰R牌将'];
                var importedFileList = extensionInfo && Array.isArray(extensionInfo.file) ? extensionInfo.file : [];
                var matchedRelativePath = null;
                for (var index = 0; index < importedFileList.length; index++) {
                    var filePath = importedFileList[index];
                    if (typeof filePath !== 'string' || filePath.indexOf('image/character/') !== 0) continue;
                    var fileName = filePath.slice('image/character/'.length);
                    var dotIndex = fileName.lastIndexOf('.');
                    if (dotIndex <= 0) continue;
                    if (fileName.slice(0, dotIndex) === characterName) {
                        matchedRelativePath = filePath;
                        break;
                    }
                }
                if (matchedRelativePath === null) {
                    // 回退到同步 fs 探测（仅 Electron 有效）
                    var syncExt = probeJianRAssetExtSync('image/character/' + characterName);
                    // undefined（纯浏览器无 fs）/ null（fs 两个后缀都没找到，可能是 Windows 打包后
                    // cwd 不是游戏根目录导致 existsSync 全失败）都交给异步路径处理。
                    // 异步走 Image().src + lib.assetURL URL,不依赖 cwd,是更可靠的兜底。
                    if (!syncExt) return null;
                    matchedRelativePath = 'image/character/' + characterName + syncExt;
                }
                if (_status.evaluatingExtension) {
                    return 'db:extension-' + jianrExtensionDirectoryName + ':' + matchedRelativePath;
                }
                return 'ext:' + jianrExtensionDirectoryName + '/' + matchedRelativePath;
            };
            // ╔══════════════════════════════════════════════════════════════╗
            // ║ C. 武将包注册（jianrjinji）                                   ║
            // ╚══════════════════════════════════════════════════════════════╝
            // 为 jianrjinji.character 每个武将的 character[4] 数组 push 一个 ext:/db: tag，
            // 同步优先（启动期填好），失败再走异步 fallback 后续 push。
            game.import('character', function () {

                // 这里统一通过上面的解析函数补角色图标签：
                // 1. 浏览器直接读取扩展目录时返回 `ext:` 路径；
                // 2. 浏览器读取本地数据库中的导入扩展时返回 `db:` 路径；
                // 3. 少数特殊后缀的角色图也会在这里被自动修正。
                var __jianrSyncTagCount = 0;
                var __jianrAsyncTagCount = 0;
                for (var i in jianrjinji.character) {
                    if (!Array.isArray(jianrjinji.character[i][4])) jianrjinji.character[i][4] = [];
                    // 用 IIFE 捕获当前迭代的 characterId，避免 var i 闭包陷阱导致
                    // 所有异步回调里的 i 都是循环结束后的最后一个 key。
                    (function (characterId) {
                        // 先尝试同步解析：Electron 下 fs.existsSync 能立刻拿到真实扩展名，
                        // 保证 return jianrjinji 前 character[4] 已带上 ext: tag。
                        // 这样引擎注册/首次渲染时就能读到扩展内路径，不会 fallback 去
                        // 本体 image/character/{id}.jpg 导致 404。
                        var syncTag = getJianRCharacterImageTagSync(characterId);
                        if (syncTag) {
                            __jianrSyncTagCount++;
                            jianrjinji.character[characterId][4].push(syncTag);
                            if (__jianrSyncTagCount <= 3) {
                                console.log('[舰R牌将] sync push', characterId, '->', syncTag);
                            }
                            return;
                        }
                        // 同步拿不到（纯浏览器环境），退回异步探测
                        console.log('[舰R牌将] fallback async probe', characterId);
                        getJianRCharacterImageTag(characterId).then(function (tag) {
                            __jianrAsyncTagCount++;
                            console.log('[舰R牌将] async push', characterId, '->', tag, '(#' + __jianrAsyncTagCount + ')');
                            jianrjinji.character[characterId][4].push(tag);
                        }).catch(function (err) {
                            console.warn('[舰R牌将] probe failed', characterId, err);
                        });
                    })(i);
                }
                console.log('[舰R牌将] sync tag total:', __jianrSyncTagCount);
                return jianrjinji;
            });
            lib.translate['jianrjinji_character_config'] = '舰R武将';

            // ╔══════════════════════════════════════════════════════════════╗
            // ║ D. 卡牌包注册（jianrjinjibao）                                ║
            // ╚══════════════════════════════════════════════════════════════╝
            game.import('card', function () {
                var jianrjinjibao = {
                    name: 'jianrjinjibao',//卡包命名
                    connect: true,//卡包是否可以联机
                    card: {
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
                                game.delayx();
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
                        },
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
                    list: [],//牌堆添加
                }
                return jianrjinjibao
            });
            lib.translate['jianrjinjibao_card_config'] = '舰R卡牌';
            lib.config.all.cards.push('jianrjinjibao');

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
            enable_effects: { "name": "启用战斗特效动画", "intro": "触发舰R技能时显示对应战斗动画（GIF）。<br>GIF 素材请放在 extension/舰R牌将/image/animation/ 目录下。", "init": true },
            effect_opacity: { "name": "动画不透明度", "intro": "调节战斗特效动画的不透明度。", "init": "opacity100", "item": { "opacity100": "100%", "opacity80": "80%", "opacity60": "60%", "opacity40": "40%" } },
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
                    "u1405_R": ["female", "wu", 2, ["qiantingss", "baiyin_skill"], ["des:无需隐匿的偷袭大师,马上就让对手的后勤捉襟见肘。"]],
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
