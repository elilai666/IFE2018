
let tableBox = document.getElementById("table-wrapper");
let formBox = document.getElementById("input-form");
const REGIONS = ['华东', '华南', '华北'];
const PRODUCTS = ['手机', '笔记本', '智能音箱'];
//生成checkbox
generateCheckbox("region-checkbox-wrapper", REGIONS);
generateCheckbox("product-checkbox-wrapper", PRODUCTS);


formBox.onchange= function(e) {
    let target = e.target;
    console.log(target.id);
    // 点击全选
    checkOptions(target);
    let selectedRegions = getSelectedOptions("region");
    let selectedProducts = getSelectedOptions("product");
    let data = getData(selectedRegions, selectedProducts);
    renderTable(tableBox, data, selectedRegions.length, selectedProducts.length);
};



