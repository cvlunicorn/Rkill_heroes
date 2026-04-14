// 技能 → 动画映射（主动/被动触发的技能）
// 由 trySkillAnimate 在 logSkill 时自动调用。
// 添加新映射：在 image/fx/ 放同名 GIF，往这张表里加一行即可。
export var skillAnimations = {
    hangmucv:      { image: "hangmucv.gif",      duration: 2500, fullscreen: true  },
    zhuangjiafh:   { image: "zhuangjiafh.gif",   duration: 1500, fullscreen: false },
    dajiaoduguibi: { image: "dajiaoduguibi.gif", duration: 1500, fullscreen: false },
    huokongld:     { image: "huokongld.gif",     duration: 2000, fullscreen: true  },
    fangqu_wuxie:  { image: "fangqu.gif",        duration: 2000, fullscreen: true  },
    qianting:      { image: "qianting.gif",      duration: 2000, fullscreen: false },
};
