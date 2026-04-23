// —————— 扩展内皮肤系统 ——————
// 原版皮肤路径指向本体 image/skin/，扩展武将的 ext: 标签会短路掉皮肤判定，
// 所以这里将扩展武将的皮肤路径重定向到扩展内 image/skin/。
//
// 添加新皮肤步骤：
//   1. 把皮肤图放到 extension/舰R牌将/image/skin/{武将ID}/1.jpg（或 .png）, 2.jpg, ...
//   2. 在下方 skinRegistry 注册皮肤数量
// 编号从 1 开始，0 代表默认立绘（无需放图）。
// .png 与 .jpg 自动识别：启动时并发探测每张皮肤，优先 png，未命中回退 jpg。

// 皮肤注册表：{ 武将ID: 皮肤数量 }
export var skinRegistry = {
    shengwang_R: 2,
    baixue_R: 12,
    z16_R: 3,
    z17_R: 4,
    alasijia_R: 2,
    qixichicheng_R: 3,
    xiang_R: 5,
    xiao_R: 1,
    buzhihuo_R: 2,
    yangyan_R: 2,
    dadianrendian_R: 1,
    // yamato_R: 3,  // 表示有 1.jpg, 2.jpg, 3.jpg 三张皮肤
};

