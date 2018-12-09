const init = () => {
    let tableBox = document.getElementById("table-wrapper");
    let formBox = document.getElementById("input-form");
    const REGIONS = ['华东', '华北', '华南'];
    const PRODUCTS = ['手机', '智能音箱', '笔记本'];
    const TRANSLATION = {
        "region": "区域",
        "product": "产品"
    };
    let dataObj = new Data(sourceData);
    let initData = dataObj.getCurrentData();
    let fromObj = new Form();
    let tableObj = new Table(tableBox, initData, 3, 3);
    let routerObj = new Router();

    //生成checkbox
    fromObj.generateCheckbox(document.getElementById("region-checkbox-wrapper"), REGIONS);
    fromObj.generateCheckbox(document.getElementById("product-checkbox-wrapper"), PRODUCTS);
    renderPage();
    // 渲染整个页面
    function renderPage() {
        let hashValue = routerObj.getHashValue();
        let selectedRegions = [];
        let selectedProducts = [];
        if (hashValue === "111111" || !hashValue) {
            selectedRegions = REGIONS;
            selectedProducts = PRODUCTS;
            //全选
            for (let ele of formBox.getElementsByTagName("input")) {
                ele.checked = true;
            }
        } else {
            checkSelections(hashValue);
            let regionsState = hashValue.slice(0, 3);
            let productState = hashValue.slice(3);
            for (let i in regionsState) {
                if (regionsState[i] === "1") {
                    selectedRegions.push(REGIONS[i]);
                }
            }
            for (let i in productState) {
                if (productState[i] === "1") {
                    selectedProducts.push(PRODUCTS[i]);
                }
            }
        }
        let data = dataObj.getDataBy(selectedRegions, selectedProducts);
        tableObj.updateTable(data, selectedRegions.length, selectedProducts.length);
    }
    function checkSelections(switchState) {
        let inputs = document.getElementsByTagName("input");
        inputs = Array.prototype.slice.call(inputs);
        // 筛选出除全选外的选项
        let inputs_arr = inputs.filter(e => e.id.indexOf("_all") === -1);
        for (let i in switchState) {
            if (switchState[i] === "1") {
                inputs_arr[i].checked = true ;
            } else {
                inputs_arr[i].checked = false ;
            }
        }
    }

    window.onpopstate = function (e) {
        renderPage();
    };

    formBox.onchange = function (e) {
        let target = e.target;
        // 点击全选
        fromObj.checkOptions(target);
        let selectedRegions = fromObj.getCheckedOptions("region");
        let selectedProducts = fromObj.getCheckedOptions("product");
        let regionsState = "";
        let productState = "";
        for (let region of REGIONS) {
            if (selectedRegions.includes(region)) {
                regionsState += "1";
            } else {
                regionsState += "0";
            }
        }
        for (let product of PRODUCTS) {
            if (selectedProducts.includes(product)) {
                productState += "1";
            } else {
                productState += "0";
            }
        }
        routerObj.setHashValue(regionsState + productState);
        renderPage();
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
    tableBox.onclick = function (e) {
        let target = e.target;
        // 点击销量
        if (target.className.indexOf("mouse-point") !== -1) {
            //去掉Edit
            target.className = target.className.split(" ")[0];
            // 备份点击的单元格
            target.setAttribute("sale", target.innerText);
            target.innerHTML = `<input type="text" value="${target.innerText}">`;
            // 激活并选中输入框内容
            target.firstElementChild.focus();
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
                dataObj.updeData(value, saleInfoArr);
                target.parentElement.setAttribute("sale", Number(value));
            } else {
                alert("请检查输入");
            }
        }
    };
    // onfocusout 支持冒泡 onblur不支持
    tableBox.addEventListener("focusout", (e) => {
        //延时执行，先响应点击
        setTimeout(function () {
            let target = e.target;
            if (target.tagName === "INPUT") {
                tableObj.restoreBackupNode(target.parentElement);
            }
        }, 200);
    }, false);


    // 数据模块
    function Data(data) {
        // 获取localstorage
        this.getLocalStorage = function () {
            if (localStorage.getItem("data_ife_eli")) {
                return JSON.parse(localStorage.getItem("data_ife_eli"));
            } else {
                return false;
            }
        };
        this.data = this.getLocalStorage() || data;

        this.getCurrentData = function () {
            return this.data;
        };

        this.saveLocalStorage = function () {
            localStorage.setItem("data_ife_eli", JSON.stringify(this.data));
        };

        this.updeData = function (value, saleInfoArr) {
            for (let saleObj of this.data) {
                // 数据过滤
                if (saleObj.region === saleInfoArr[0] && saleObj.product === saleInfoArr[1]) {
                    let i = saleInfoArr[2].split("_")[1];
                    saleObj.sale[i] = Number(value);
                }
            }
            this.saveLocalStorage();
        };
        // 根据regions, products数组筛选出对应数据
        this.getDataBy = function (regions, products) {
            let tmpData1 = [];
            let tmpData2 = [];
            // 先筛选地区
            for (let region of regions) {
                for (let dataItem of this.data) {
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
    }
    // 表单模块
    function Form() {
        // 在给定的wrapper里面生成optionsArr里包含的选项
        this.generateCheckbox = function (wrapper, optionsArr) {
            let idPrefix = wrapper.id.split("-")[0];
            let label;
            let id;
            let span = document.createElement("span");
            span.innerHTML = TRANSLATION[idPrefix] + "：";
            // 添加title
            wrapper.appendChild(span);
            for (let i = 0; i < optionsArr.length + 1; i++) {
                label = document.createElement("label");
                // 添加全选
                if (i === 0) {
                    id = idPrefix + "_all";
                    label.setAttribute("for", id);
                    label.innerHTML = `<input type="checkbox" id="${id}" name="${idPrefix}" value="全选" >全选`;
                } else {
                    // 添加选项
                    id = idPrefix + "_" + i;
                    label.setAttribute("for", id);
                    label.innerHTML = `<input type="checkbox" id="${id}" name="${idPrefix}" value="${optionsArr[i - 1]}">${optionsArr[i - 1]}`;
                }
                wrapper.appendChild(label);
            }
        };
        // 根据name获取被选中的选项数组
        this.getCheckedOptions = function (name) {
            let eles = document.getElementsByName(name);
            let checkedOptions = [];
            for (let e of eles) {
                // 只计算非全选的选项
                if (!e.id.endsWith("_all") && e.checked) {
                    checkedOptions.push(e.value);
                }
            }
            return checkedOptions;
        };

        // 检查checkbox的选择情况
        this.checkOptions = function (target) {
            if (target.id.endsWith("_all")) {
                if (!target.checked) {
                    target.checked = true;
                } else {
                    for (let ele of document.getElementsByName(target.name)) {
                        ele.checked = true;
                    }
                }
            } else {
                // 除全选外的取消
                let checkedCount = 0;
                if (!target.checked) {
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
        };
    }
    // table表格模块
    function Table(wrapper, data, regionNum, productNum) {
        this.wrapper = wrapper;
        this.data = data;
        this.regionNum = regionNum;
        this.productNum = productNum;

        this.restoreBackupNode = function (node) {
            if (node) {
                //恢复之前的节点
                node.innerHTML = node.getAttribute("sale");
                node.removeAttribute("sale");
            }
        };
        this.makeElement = function (tag, content, className, data_arr) {
            let tagNode = document.createElement(tag);
            tagNode.innerText = content;
            if (className) tagNode.className = className;
            if (data_arr) {
                tagNode.setAttribute("data-key", data_arr.join(" "));
            }
            return tagNode;
        };
        this.createTable = function () {
            //生成表格
            let firstKey = this.regionNum <= this.productNum ? "region" : "product";
            let secondKey = this.regionNum > this.productNum ? "region" : "product";
            // 选项较少的那个作为key来进行排序
            this.data.sort((a, b) => a[firstKey] > b[firstKey] || (a[firstKey] === b[firstKey] && a[secondKey] > b[secondKey]) ? 1 : -1);
            let table = document.createElement("table");
            // table.border = "1";
            let thead = document.createElement("thead");
            let tbody = document.createElement("tbody");
            table.appendChild(thead);
            table.appendChild(tbody);
            // 生成thead
            let tr = document.createElement("tr");
            thead.appendChild(tr);
            let headerCN1 = this.regionNum <= this.productNum ? TRANSLATION.region : TRANSLATION.product;
            let headerCN2 = this.regionNum > this.productNum ? TRANSLATION.region : TRANSLATION.product;
            tr.appendChild(this.makeElement("th", headerCN1));
            tr.appendChild(this.makeElement("th", headerCN2));
            for (let i = 1; i < 13; i++) {
                tr.appendChild(this.makeElement("th", i + "月"));
            }
            // 生成tbody
            let firstColNum = Math.min(this.regionNum, this.productNum);
            let secondColNum = Math.max(this.regionNum, this.productNum);
            for (let i = 0; i < firstColNum; i++) {

                for (let j = 0; j < secondColNum; j++) {
                    let tr = document.createElement("tr");
                    // 第一条
                    if (j === 0) {
                        let region_col = this.makeElement("td", this.data[i].region);
                        region_col.rowSpan = secondColNum;
                        tr.appendChild(region_col);
                    }
                }
            }
            for (let i = 0; i < this.data.length; i++) {
                let tr = document.createElement("tr");
                // 加rowspan
                if (i % secondColNum === 0) {
                    let region_col = this.makeElement("td", this.data[i][firstKey]);
                    region_col.rowSpan = secondColNum;
                    tr.appendChild(region_col);
                }
                tr.appendChild(this.makeElement("td", this.data[i][secondKey]));
                // 生成销量表格
                for (let salesIndex in this.data[i].sale) {
                    tr.appendChild(this.makeElement(
                        "td",
                        this.data[i].sale[salesIndex],
                        "sales",
                        [this.data[i].region, this.data[i].product, "sales_" + salesIndex]
                    ));
                }
                tbody.appendChild(tr);
            }
            return table;
        };
        this.renderTable = function () {
            let table = this.createTable();
            //没有数据不渲染table
            if (this.data.length === 0) {
                this.wrapper.innerHTML = "";
            } else {
                this.wrapper.innerHTML = table.outerHTML;
            }
        };
        this.updateTable = function (data, regionNum, productNum) {
            this.data = data;
            this.regionNum = regionNum;
            this.productNum = productNum;
            this.renderTable();
        };
    }
    //路由模块
    function Router() {
        this.getHashValue = function () {
            return window.location.hash.slice(1, 7);
        };
        this.setHashValue = function (value) {
            history.pushState({}, null, "#" + value);
        };
    }
};
init();



