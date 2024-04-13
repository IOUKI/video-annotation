import { formatTimeFromSecondsWithMilliseconds, formatTimeToSecond } from "./timeFormat.js"

let data = []
let x = 0.25
let z = 0.25

const dom = {
    video: document.getElementsByTagName('video')[0],

    changeZBtn: document.getElementById('changeZBtn'),
    changeXBtn: document.getElementById('changeXBtn'),
    changeZInput: document.getElementById('changeZInput'),
    changeXInput: document.getElementById('changeXInput'),

    currentTime: document.getElementById('currentTime'),

    newClassInput: document.getElementById('newClassInput'),
    addClassBtn: document.getElementById('addClassBtn'),

    startTimeLabelBtn: document.getElementById('startTimeLabelBtn'),
    endTimeLabelBtn: document.getElementById('endTimeLabelBtn'),
    resetTimeLabelBtn: document.getElementById('resetTimeLabelBtn'),
    classSelect: document.getElementById('classSelect'),
    startTimeLabelInput: document.getElementById('startTimeLabelInput'),
    endTimeLabelInput: document.getElementById('endTimeLabelInput'),
    remarkInput: document.getElementById('remarkInput'),
    addAnnotationBtn: document.getElementById('addAnnotationBtn'),

    dataList: document.getElementById('dataList'),
}

// 新增標記類別
function addNewClass() {
    const newClass = dom.newClassInput.value
    if (newClass === '') {
        alert('請輸入類別名稱！')
        return 
    }
    dom.classSelect.innerHTML += `<option value="${newClass}">${newClass}</option>`
}

// 取得影片時間(秒，含毫秒)
function getVideoCurrentTime() {
    return dom.video.currentTime
}

// 新增起始標記時間
function addStartTimeLabel() {
    let currentTime = getVideoCurrentTime()
    dom.startTimeLabelInput.value = formatTimeFromSecondsWithMilliseconds(currentTime)
}

// 新增結束標記時間
function addEndTimeLabel() {
    let currentTime = getVideoCurrentTime()
    dom.endTimeLabelInput.value = formatTimeFromSecondsWithMilliseconds(currentTime)
}

// 清除表單資料(起始標記、結束標記、類別)
function resetTimeLabel() {
    dom.startTimeLabelInput.value = ''
    dom.endTimeLabelInput.value = ''
    dom.classSelect.value = ''
}

// 新增標記
function addAnnotation() {
    const annotationClass = dom.classSelect.value
    const startTime = dom.startTimeLabelInput.value
    const endTime = dom.endTimeLabelInput.value
    const remark = dom.remarkInput.value
    const startSec = formatTimeToSecond(startTime)
    const endSec = formatTimeToSecond(endTime)

    if (annotationClass === '') {
        alert('請選擇標註類別')
        return
    }
    if (startTime === '') {
        alert('請新增起始時間')
        return 
    }
    if (endTime === '') {
        alert('請新增結束時間')
        return 
    }

    // 時間資料確認
    // let checkStatus = true
    for (let i = 0; i < data.length; i++) {
        // if (startSec < data[i]['startSec']) {
        //     checkStatus = false
        // } else if (startSec < data[i]['endSec']) {
        //     checkStatus = false
        // } else if (endSec < data[i]['endSec']) {
        //     checkStatus = false
        // } else 
        if (endSec <= startSec) {
            alert('起始時間必須小於結束時間')
            return
        }
    }
    // if (!checkStatus) {
    //     alert('時間區間與歷史資料重疊！')
    //     return 
    // }

    data.push({
        class: annotationClass,
        startTime: startTime,
        startSec: startSec,
        endTime: endTime,
        endSec: endSec,
        remark: remark
    })
    // console.log(data)

    dom.dataList.innerHTML = ''
    data.forEach((item, index) => {
        dom.dataList.innerHTML += `
        <div class="bg-gray-800 p-3">
            <p>類別：${item['class']}</p>
            <p>起始：${item['startTime']}</p>
            <p>結束：${item['endTime']}</p>
            <p>備註：${item['remark']}</p>
            <div class="flex justify-end">
                <button class="deleteItemData py-1 px-3 bg-red-600 rounded-md hover:bg-red-800 duration-300">移除</button>
            </div>
        </div>
        `
    })

    dom.startTimeLabelInput.value = endTime
    dom.endTimeLabelInput.value = ''
}

window.addEventListener('DOMContentLoaded', () => {
    dom.startTimeLabelBtn.addEventListener('click', addStartTimeLabel)
    dom.endTimeLabelBtn.addEventListener('click', addEndTimeLabel)
    dom.resetTimeLabelBtn.addEventListener('click', resetTimeLabel)
    dom.addClassBtn.addEventListener('click', addNewClass)
    dom.addAnnotationBtn.addEventListener('click', addAnnotation)

    dom.changeZBtn.addEventListener('click', () => {
        if (dom.changeZInput.value == '') {
            alert('請輸入z的數值')
            return 
        }
        z = parseFloat(dom.changeZInput.value)
    })
    dom.changeXBtn.addEventListener('click', () => {
        if (dom.changeXInput.value) {
            alert('請輸入x的數值')
            return 
        }
        x = parseFloat(dom.changeXInput.value)
    })
})

dom.video.addEventListener('keydown', (e) => {
    if (e.keyCode == 88) {
        dom.video.currentTime += x
    }
    if (e.keyCode == 90) {
        dom.video.currentTime -= z
    }
})

setInterval(() => {
    let currentTime = getVideoCurrentTime()
    dom.currentTime.innerHTML = `當前影片時間: ${formatTimeFromSecondsWithMilliseconds(currentTime)}`
}, 1);