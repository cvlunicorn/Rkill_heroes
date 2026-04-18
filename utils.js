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
