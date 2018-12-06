const init = () => {
    let tableBox = document.getElementById("table-wrapper");
    let formBox = document.getElementById("input-form");
    const REGIONS = ['华东', '华南', '华北'];
    const PRODUCTS = ['手机', '笔记本', '智能音箱'];
    const TRANSLATION = {
        "region": "区域",
        "product": "产品"
    };
    let initData = getInitData();
    renderDefaultPage();

    function getInitData() {
        let lsData = getLocalStorage();
        if (lsData) {
            sourceData = lsData;
        }
        return sourceData;
    }
    function getLocalStorage() {
        if (localStorage.getItem("data_ife_eli")) {
            return JSON.parse(localStorage.getItem("data_ife_eli"));
        } else {
            return false;
        }
    }
    function saveLocalStorage() {
        localStorage.setItem("data_ife_eli", JSON.stringify(initData));
    }
    // 渲染默认页面
    function renderDefaultPage () {
        //生成checkbox
        generateCheckbox("region-checkbox-wrapper", REGIONS);
        generateCheckbox("product-checkbox-wrapper", PRODUCTS);
        // 默认全选
        for (let ele of formBox.getElementsByTagName("input")) {
            ele.checked = true;
        }
        // 默认展示全部数据
        renderTable(tableBox, initData, 3, 3);
    }

    formBox.onchange = function (e) {
        let target = e.target;
        // 点击全选
        checkOptions(target);
        let selectedRegions = getSelectedOptions("region");
        let selectedProducts = getSelectedOptions("product");
        let data = getData(selectedRegions, selectedProducts);
        renderTable(tableBox, data, selectedRegions.length, selectedProducts.length);
    };
    tableBox.onmouseover = function (e) {
        let target = e.target;
        if (target.className === "sales" && target.children.length === 0) {
            target.className += " mouse-point";
        }
    };
    tableBox.onmouseout = function (e) {
        let target = e.target;
        if (target.className.indexOf("mouse-point") !== -1) {
            target.className = target.className.split(" ")[0];
        }
    };
    let backupNode;
    tableBox.onmousedown = function (e) {

        let target = e.target;
        console.log("mousedown:" + target.innerHTML);
        // 点击销量
        if (target.className.indexOf("mouse-point") !== -1) {
            //去掉Edit
            target.className = target.className.split(" ")[0];
            // if (target !== backupNode)restoreBackupNode(backupNode);
            // 备份点击的单元格
            target.setAttribute("sale", target.innerText);
            backupNode = target;
            target.innerHTML = `<input type="text" value="${target.innerText}">`;
            // 激活并选中输入框内容
            // target.firstElementChild.focus();
            target.firstElementChild.select();
            let saveBth = document.createElement("button");
            saveBth.className = "save-btn";
            saveBth.innerText = "保存";
            let cancelBth = document.createElement("button");
            cancelBth.className = "cancel-btn";
            cancelBth.innerText = "取消";
            // 添加保存和取消按钮
            target.appendChild(saveBth);
            target.appendChild(cancelBth);
        }else if (target.className === "save-btn") {
            // 点击保存按钮
            let value = target.parentElement.getElementsByTagName("input")[0].value;
            if (value.match(/^[0-9]+$/)) {
                //确认是整数，保存
                let saleInfoArr = target.parentElement.getAttribute("data-key").split(" ");
                saveData(value, saleInfoArr);
                target.parentElement.setAttribute("sale", value);
                restoreBackupNode(backupNode);
                backupNode = null;
            } else {
                alert("请检查输入");
            }
        } else {

        }
    };

    // onfocusout 支持冒泡 onblur不支持
    tableBox.addEventListener("focusout", (e) => {
        console.log("focusout:" + e.target);
        // restoreBackupNode(backupNode);
        // backupNode = null;
    }, false);

    function restoreBackupNode(node) {
        if (node) {
            //恢复之前的节点
            node.innerHTML = node.getAttribute("sale");
            node.removeAttribute("sale");
        }
    }
    function saveData(value, saleInfoArr) {
        for (let saleObj of initData) {
            // 数据过滤
            if (saleObj.region === saleInfoArr[0] && saleObj.product === saleInfoArr[1]) {
                let i = saleInfoArr[2].split("_")[1];
                saleObj.sale[i] = Number(value);
            }
        }
        saveLocalStorage();
    }

    // checkbox 处理
    function generateCheckbox (wrapperId, optionsArr) {
        let wrapper = document.getElementById(wrapperId);
        let idPrefix = wrapperId.split("-")[0];
        let label;
        let id;
        let span = document.createElement("span");
        span.innerHTML = TRANSLATION[idPrefix] + "：";
        // 添加title
        wrapper.appendChild(span);
        for (let i=0; i < optionsArr.length + 1; i++) {
            label = document.createElement("label");
            // 添加全选
            if (i === 0) {
                id = idPrefix + "_all" ;
                label.setAttribute("for", id);
                label.innerHTML = `<input type="checkbox" id="${id}" name="${idPrefix}" value="全选" >全选`;
            } else {
                // 添加选项
                id = idPrefix + "_" + i;
                label.setAttribute("for", id);
                label.innerHTML = `<input type="checkbox" id="${id}" name="${idPrefix}" value="${optionsArr[i-1]}">${optionsArr[i-1]}`;
            }
            wrapper.appendChild(label);
        }
    }
    // 根据name获取被选中的选项数组
    function getSelectedOptions(name) {
        let eles = document.getElementsByName(name);
        let checkedOptions = [];
        for (let e of eles) {
            // 只计算非全选的选项
            if (!e.id.endsWith("_all") && e.checked) {
                checkedOptions.push(e.value);
            }
        }
        return checkedOptions;
    }

    // 检查checkbox的选择情况
    function checkOptions(target) {
        if (target.id.endsWith("_all")) {
            if (!target.checked){
                target.checked = true;
            } else {
                for (let ele of document.getElementsByName(target.name)) {
                    ele.checked = true;
                }
            }
        } else {
            // 除全选外的取消
            let checkedCount = 0;
            if (!target.checked){
                for (let ele of document.getElementsByName(target.name)) {
                    if (ele.checked === true) {
                        checkedCount++
                    }
                }
                // 如果取消的是最后一个选择，则不能取消
                if (checkedCount === 0) {
                    target.checked = true;
                }
                //取消all的全选
                document.getElementById(target.name + "_all").checked = false;
            }
        }
    }

    //数据处理
    // 根据regions, products数组筛选出对应数据
    function getData(regions, products) {
        let tmpData1 = [];
        let tmpData2 = [];
        // 先筛选地区
        for (let region of regions) {
            for (let dataItem of initData) {
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

    // table处理
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
            // 生成销量表格
            for (let salesIndex in data[i].sale) {
                tr.appendChild(makeElement(
                    "td",
                    data[i].sale[salesIndex],
                    "sales",
                    [data[i].region, data[i].product, "sales_" + salesIndex]
                ));
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
    function makeElement(tag, content, className, data_arr) {
        let tagNode = document.createElement(tag);
        tagNode.innerText = content;
        if (className) tagNode.className = className;
        if (data_arr) {
            tagNode.setAttribute("data-key", data_arr.join(" "));
        }
        return tagNode;
    }
};
init();



