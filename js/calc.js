//parseInt(button.dataset.value, 10); ←int()と同等
const state = {
    currentNum: "", //入力中の数字：文字列型
    keepNum: null,    //四則演算時に処理を保留している数字：数字型
    keepAct: null,    //直前に実行した演算子
}

const buttons = document.querySelectorAll('.num');
const panel = document.querySelector('#calc_panel');

const math = (num1, num2, act) => { //四則演算の関数化。num1 = cN, num2 = kN
    console.log(`math()実行。cN=${num1}, kN=${num2}, kA=${act}`)
    if (act === "add") {
        return String(Number(num2) + parseInt(num1, 10))
    } else if (act === "subtract") {
        return String(Number(num2) - parseInt(num1, 10))
    } else if (act === "multi") {
        return String(Number(num2) * parseInt(num1, 10))
    } else { // 計算を足す場合はこの後に増やす
        return String(Number(num2) / parseInt(num1, 10))
    }
}

const isInputPending = (act) => { //actがブランクでも=でもnullでもないならTrue。
    console.log(`iIP()実行。state.keepAct=${act}`)
    return act !=="" && act !=="equal" && act !== null
};

const report = (obj) => {
    return `cN:${obj.currentNum}, kN:${obj.keepNum}, kA:${obj.keepAct}`
}

console.log(`起動。${report(state)}`)

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        const action = button.dataset.action;
        console.log(`ボタンが押されました：${report(state)}`)
        if (value) { //クリックされたボタンが数字であった場合
            console.log(`数字が押されました：${value}`)
            if (isInputPending(state.keepAct)) { //四則演算実行中の場合。cNの末尾に数字が続かないように表示を0にする
                console.log(`iIP=True：${report(state)}`)
                state.currentNum = ''
                console.log(`四則演算実行中：${report(state)}`)
            } else if (state.keepAct === "equal") { //equalの場合は仕切り直し
                state.currentNum = ''
                state.keepAct = null
                console.log(`四則演算実行中：${report(state)}`)
            }
            if (panel.textContent === '0') { //パネルの数字が0の場合の処理
                if (value !== '0' && value !== '00') { //入力された数字が0 or 00でないなら押された数字をそのまま代入
                    state.currentNum = value
                } else {
                    state.currentNum = '0'
                }
            } else { //パネルの数字が0以外
                state.currentNum += value
            }
        // !以下四則演算エリア
        } else { //クリックされたボタンが演算子であった場合
            console.log(`数字以外が押されました：${action}`)
            if (action === 'clear') { //*clearがクリックされた
                console.log('clearが押されました')
                state.currentNum = '0'
                state.keepNum = null
                state.keepAct = null
            } else if (action === 'equal') { //*[=]がクリックされた
                console.log('equalが押されました')
                if (isInputPending(state.keepAct)) { //前に演算子がクリックされている
                    console.log(`演算子ありのequal処理＝math実行：${report(state)}`)
                    state.currentNum = math(state.currentNum, state.keepNum, state.keepAct)
                } else { //演算子を押す前に=が押される・・・ここでいったん四則演算を打ち切る
                    console.log(`演算子なしのequal処理実行：${report(state)}`)
                    state.keepAct = 0
                }
                state.keepAct = 'equal'
                console.log(`equal処理終了：${report(state)}`)
            } else { // *四則演算ボタンが押された
                console.log('四則演算ボタンが押されました')
                if (isInputPending(state.keepAct)) { //!ちょっとここの処理自信ない
                    //*前に演算子がクリックされている…連続して計算する必要があるので、いったん計算math()実行
                    state.currentNum = math(state.currentNum, state.keepNum, state.keepAct)
                    state.keepNum = state.currentNum
                    state.keepAct = action
                } else { //*kAがブランクまたはequal…一度目の四則演算なのでmath()は実行しない
                    state.keepNum = state.currentNum
                    state.keepAct = action
                }
            }
        }
        //最終処理
        panel.textContent = state.currentNum
        console.log(`終了：${report(state)}`)
        });
    });