function createTable(data, regionNum, productNum) {
    //生成表格
    let firstKey = regionNum <= productNum ? "region" : "product";
    let secondKey = regionNum > productNum ? "region" : "product";
    // 选项较少的那个作为key来进行排序
    data.sort((a, b) => a[firstKey] > b[firstKey] ? 1 : -1);
    let table = document.createElement("table");
    // table.border = "1";
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    table.appendChild(thead);
    table.appendChild(tbody);
    // 生成thead
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let headerCN1 = regionNum <= productNum ? TRANSLATION.region : TRANSLATION.product;
    let headerCN2 = regionNum > productNum ? TRANSLATION.region : TRANSLATION.product;
    tr.appendChild(makeElement("th", headerCN1));
    tr.appendChild(makeElement("th", headerCN2));
    for (let i = 1; i < 13; i++) {
        tr.appendChild(makeElement("th", i + "月"));
    }
    // 生成tbody
    let firstColNum = Math.min(regionNum, productNum);
    let secondColNum = Math.max(regionNum, productNum);
    for (let i = 0; i < firstColNum; i++) {

        for (let j = 0; j < secondColNum; j++) {
            let tr = document.createElement("tr");
            // 第一条
            if (j === 0) {
                let region_col = makeElement("td", data[i].region);
                region_col.rowSpan = secondColNum;
                tr.appendChild(region_col);
            }
        }
    }
    for (let i = 0; i < data.length; i++){
        let tr = document.createElement("tr");
        // 加rowspan
        if (i % secondColNum === 0) {
            let region_col = makeElement("td", data[i][firstKey]);
            region_col.rowSpan = secondColNum;
            tr.appendChild(region_col);
        }
        tr.appendChild(makeElement("td", data[i][secondKey]));
        for (let salesNum of data[i].sale) {
            tr.appendChild(makeElement("td", salesNum));
        }
        tbody.appendChild(tr);
    }
    return table;
}

function renderTable(wrapper ,data, regionNum, productNum) {
    //没有数据不渲染table
    if (data.length === 0) {
        wrapper.innerHTML = "";
    } else {
        let table = createTable(data, regionNum, productNum);
        wrapper.innerHTML = table.outerHTML;
    }
}
function makeElement(tag, content) {
    let tagNode = document.createElement(tag);
    tagNode.innerText = content;
    return tagNode;
}