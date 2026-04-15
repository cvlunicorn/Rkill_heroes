// —————— 舰R限定技动画效果 ——————
//用于替换和调整限定技、使命技、觉醒技原有动画效果
// 两个功能：
// 1. 限定技触发时在横幅立绘位置播放 GIF（替换 fullscreenavatar 的 backgroundImage）
// 2. 通过注入 CSS 扩展 data-nature 色表，支持自定义发光颜色
//
// 为什么要 monkey-patch 两个函数：
// - trySkillAnimate(name) 知道技能 ID，但不直接操作 DOM；
// - $fullscreenpop(str, nature, avatar) 操作 DOM，但只接收翻译后的文字；
// 因此先在 trySkillAnimate 把技能 ID 缓存到 player 实例上，
// 再在 $fullscreenpop 里按 ID 查 GIF 映射、替换立绘背景。

import { lib, game, ui, get, ai, _status } from '../../noname.js';

// 技能 GIF 映射：{ 技能 ID → image/ 下的相对路径 }
// 在 image/animation/ 放 GIF，往这张表里加一行即可。
export var skillGifs = {
    // 示例：
    // yamato_R_nizhuanfanji: "image/animation/nizhuanfanji.gif",
};

// 自定义发光颜色：{ 自定义 nature 名 → RGBA 颜色字符串 }
// 技能里写 animationColor: "对应键名" 即可生效。
export var customColors = {
    sakura: "rgba(255, 183, 197, 1)",
    navy: "rgba(40, 80, 160, 1)",
    crimson: "rgba(220, 20, 60, 1)",
};

// 初始化限定横幅系统，由 extension.js 的 content 函数调用
// resolveImageUrl: 共用图片解析函数，由 extension.js 传入
export function initLimitedBanner(resolveImageUrl) {

    // 注入 CSS：为每个自定义颜色创建一条 box-shadow 规则
    if (!document.getElementById("jianr-limited-banner-colors")) {
        var bannerCss = "";
        for (var natureKey in customColors) {
            var colorRgba = customColors[natureKey];
            bannerCss +=
                '#window > .damage.fullscreenavatar[data-nature="' + natureKey + '"] > div:first-child > div {' +
                "box-shadow:" +
                "rgba(0,0,0,0.2) 0 0 0 1px," +
                "rgba(0,0,0,0.5) 0 0 20px," +
                "rgba(0,0,0,0.3) 0 0 40px," +
                colorRgba + " 0 0 80px;" +
                "}";
        }
        if (bannerCss) {
            var bannerStyleEl = document.createElement("style");
            bannerStyleEl.id = "jianr-limited-banner-colors";
            bannerStyleEl.textContent = bannerCss;
            document.head.appendChild(bannerStyleEl);
        }
    }

    // Monkey-patch trySkillAnimate：记录待播放的技能 ID
    var origTrySkillAnimate = lib.element.Player.prototype.trySkillAnimate;
    lib.element.Player.prototype.trySkillAnimate = function (name, popname, checkShow) {
        if (name && skillGifs[name]) {
            this._jianrLimitedAnimationSkill = name;
        }
        return origTrySkillAnimate.apply(this, arguments);
    };

    // Monkey-patch $fullscreenpop：替换立绘背景为 GIF
    var origFullscreenpop = lib.element.Player.prototype.$fullscreenpop;
    lib.element.Player.prototype.$fullscreenpop = function (str, nature, avatar, broadcast) {
        var skillId = this._jianrLimitedAnimationSkill;
        this._jianrLimitedAnimationSkill = null;
        var result = origFullscreenpop.apply(this, arguments);
        if (skillId && skillGifs[skillId] && avatar) {
            try {
                var nodes = ui.window.querySelectorAll(".damage.fullscreenavatar");
                var node = nodes[nodes.length - 1];
                if (node && node.firstChild && node.firstChild.firstChild) {
                    var slot = node.firstChild.firstChild;
                    resolveImageUrl(skillGifs[skillId], function (url) {
                        if (!slot.parentNode) return;
                        slot.style.backgroundImage = 'url("' + url + '")';
                    });
                }
            } catch (e) {
                console.log("[舰R限定技动画] 替换失败:", e);
            }
        }
        return result;
    };
}
