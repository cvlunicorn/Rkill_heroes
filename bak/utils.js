import { lib, game, ui, get, ai, _status } from '../../noname.js'
//functions
//加权随机函数,输入包含选项和选项的权重的数组,输出随机到的选项
/*调用示例
    var options = [
    { name: "选项一", weight: 2 },
    { name: "选项二", weight: 3 },
    { name: "选项三", weight: 1 },
  ];

  var selectedOption = weightedRandom(options);
  console.log("随机选择的选项是:", selectedOption);*/
export function weightedRandom(options) {
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
// —— 扩展名缓存与异步探测 ——
// 目录模式下启动时并发探测每张立绘真实扩展名：先试 .png，404 再试 .jpg。
// 结果存入 skinAssetCache，后续调用全部同步查表。
// 值约定：'.png' / '.jpg' = 已探测存在；null = 已探测但都不存在；undefined = 尚未探测
var skinAssetCache = {};
export function probeJianRAssetExt(relativeBase) {
    var key = relativeBase;
    if (skinAssetCache[key] !== undefined) return Promise.resolve(skinAssetCache[key]);
    return new Promise(function (resolve) {
        var base = lib.assetURL + 'extension/' + '舰R牌将' + '/' + relativeBase;
        var pngImg = new Image();
        pngImg.onload = function () {
            skinAssetCache[key] = '.png';
            resolve('.png');
        };
        pngImg.onerror = function () {
            var jpgImg = new Image();
            jpgImg.onload = function () {
                skinAssetCache[key] = '.jpg';
                resolve('.jpg');
            };
            jpgImg.onerror = function () {
                skinAssetCache[key] = null;
                resolve(null);
            };
            jpgImg.src = base + '.jpg';
        };
        pngImg.src = base + '.png';
    });
}