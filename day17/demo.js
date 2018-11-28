// 3的小游戏，练习使用循环和条件语句，实现如下需求:
// 从1到100，以此在console输出各数字，但是，当数字为3的倍数或者含有3的时候，输出“PA”
// 比如：1,2,PA,4,5,PA,……,11,PA,PA,14,PA……

function game3() {
    for (let index = 1; index < 101; index++) {
        if (index % 3 === 0) {
            console.log("PA")
        } else {
            console.log(index)
        }
    }
}

// 小练习，练习使用循环实现一个九九乘法表

// 第一步，最低要求：在Console中按行输出 n * m = t
// 然后，尝试在网页中，使用table来实现一个九九乘法表
function table_99() {
    let row = 9;
    let line = 9;
    for (let n = 1; n < row + 1; n++) {
        for (let m = 1; m < line + 1; m++) {
            result = n * m;
            console.log(n + "x" + m + "=" + result);
        }
    }
}