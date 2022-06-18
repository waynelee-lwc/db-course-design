
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
