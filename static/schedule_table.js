
let historyTable = []
let currTable = []
let scheduleHead = ['','星期一','星期二','星期三','星期四','星期五','星期六','星期日']

function initHistoryTable(){
    for(let i = 1;i <= 7;i++){
        historyTable[i] = []
        for(let j = 1;j <= 11;j++){
            historyTable[i][j] = 0
        }
    }
}

function initCurrTable(){
    for(let i = 1;i <= 7;i++){
        currTable[i] = []
        for(let j = 1;j <= 11;j++){
            currTable[i][j] = 0
        }
    }
}

function getCellState(i,j){
    if(currTable[i][j] == 0){
        return historyTable[i][j] == 0 ? 'blank' : (historyTable[i][j] == 1 ? 'inuse' : 'multi')
    }else{
        return historyTable[i][j] == 0 ? 'available' : 'unavailable'
    }
}

function refreshView(){
    $('.schedule-table').empty()
    $('.schedule-table').append(
        $(`
        <div class="schetab-col">
            <div class="schetab-row schetab-row-head"></div>
            <div class="schetab-row schetab-row-head">第一节</div>
            <div class="schetab-row schetab-row-head">第二节</div>
            <div class="schetab-row schetab-row-head">第三节</div>
            <div class="schetab-row schetab-row-head">第四节</div>
            <div class="schetab-row schetab-row-head">第五节</div>
            <div class="schetab-row schetab-row-head">第六节</div>
            <div class="schetab-row schetab-row-head">第七节</div>
            <div class="schetab-row schetab-row-head">第八节</div>
            <div class="schetab-row schetab-row-head">第九节</div>
            <div class="schetab-row schetab-row-head">第十节</div>
            <div class="schetab-row schetab-row-head">第十一节</div>
        </div>
        `)
    )
    for(let i = 1;i <= 7;i++){
        let col = $(`<div class="schetab-col"></div>`)
        col.append($(`
            <div class="schetab-row schetab-row-head">${scheduleHead[i]}</div>
        `))
        for(let j = 1;j <= 11;j++){
            col.append($(`
                <div class="schetab-row schetab-cell schetab-row-${getCellState(i,j)}" id="cell-${i}-${j}"></div>
            `))
        }
        $('.schedule-table').append(col)
    }
}

function parseSchedule(schedule){
    console.log(schedule)
    let res = []
    let keys = ['','monday','tuesday','wednesday','thursday','friday','saturday','sunday']
    for(let i = 1;i <= 7;i++){
        key = keys[i]
        val = schedule[key]
        res[i] = []
        for(let j = 1;j <= 11;j++){
            v = val[j]
            res[i][j] = Number.parseInt(v)
        }
    }
    console.log(res)
    return res
}

function setCurrTable(table){
    initCurrTable()
    for(let i = 1;i <= 7;i++){
        for(let j = 1;j <= 11;j++){
            currTable[i][j] += table[i][j]
        }
    }
}

function getCurrSchedule(){
    let keys = ['','monday','tuesday','wednesday','thursday','friday','saturday','sunday']
    let res = {}
    for(let i = 1;i <= 7;i++){
        let str = '0'
        for(let j = 1;j <= 11;j++){
            str += currTable[i][j]
        }
        let key = keys[i]
        res[key] = str
    }
    return res
}