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
            label.innerHTML = `<input type="checkbox" id="${id}" name="${idPrefix}" value="全选">全选`;
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
