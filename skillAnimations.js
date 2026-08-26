//原本无动画的技能添加动画
// 技能 → 动画映射（主动/被动触发的技能）
// 由 trySkillAnimate 在 logSkill 时自动调用。
//技能发动时不显示且不logSkill。popup: false。
//log:false不在历史记录中显示技能，但会触发logSkill然后触发动画
// 添加新映射：在 image/animation/ 放同名素材，支持 .gif / .mp4(webm/mov/m4v/ogv) / 普通图片(.png .jpg .webp)。
// duration: 普通图片按这里写的毫秒数播放；
//           GIF 优先用各帧延时之和、视频用 metadata 时长，解析失败时才回退到这里。
export var skillAnimations = {
    kaimuhangkong: { image: "kaimuhangkong.gif", duration: 1500, fullscreen: true, size: 0.85 },
    zhuangjiafh: { image: "zhuangjiafh.png", duration: 1500, fullscreen: false },
    dajiaoduguibi: { image: "dajiaoduguibi.gif", duration: 1500, fullscreen: false },
    huokongld: { image: "huokongld.gif", duration: 2000, fullscreen: true, size: 0.85 },
    fangkongdaodan_wuxie: { image: "fangkongdaodan.gif", duration: 2000, fullscreen: true, size: 0.85 },
    kaimuleiji: { image: "kaimuleiji.gif", duration: 2000, fullscreen: true, size: 0.85 },
    fanjiandaodan: { image: "yuanchengdaji.gif", duration: 1200, fullscreen: true, size: 0.85 },
    yuanchengdaji: { image: "yuanchengdaji.gif", duration: 1200, fullscreen: true, size: 0.85 },
    // 程序渲染：拦阻射击与防空2共用防空炮火动画，不需要图片素材。
    lanzusheji9: { procedural: "antiAirFire", duration: 1800, fullscreen: false },
    // 程序渲染：从武将牌右下向左上扇形发射的防空炮火，不需要图片素材。
    fangkong2: { procedural: "antiAirFire", duration: 2000, fullscreen: false },
};
