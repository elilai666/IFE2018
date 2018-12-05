const TRANSLATION = {
    "region": "区域",
    "product": "产品"
};
// 根据regions, products数组筛选出对应数据
function getData(regions, products) {
    let tmpData1 = [];
    let tmpData2 = [];
    // 先筛选地区
    for (let region of regions) {
        for (let dataItem of sourceData) {
            if (dataItem.region === region) {
                tmpData1.push(dataItem);
            }
        }
    }
    // 再筛选产品
    for (let product of products) {
        for (let dataItem of tmpData1) {
            if (dataItem.product === product) {
                tmpData2.push(dataItem);
            }
        }
    }
    return tmpData2;
}