import { formatTimeFromSecondsWithMilliseconds, formatTimeToSecond } from "./module/timeFormat.js"
import fetchData from "./module/fetchData.js"
import toast from "./module/toast.js"

let data = [] // 標記資料
let tempData = {
  video: '',
  classes: [],
  data: [],
} // 暫存資料
let x = 0.25
let z = 0.25

const dom = {
  video: document.getElementsByTagName('video')[0],

  videoSelect: document.getElementById('videoSelect'),

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

  exportExcelBtn: document.getElementById('exportExcelBtn'),
  initButton: document.getElementById('initButton'),
}

// 取得影片清單
async function getVideoList() {
  const response = await fetchData('/video/list')
  if (response.status !== 200) return
  const data = await response.json()
  data.forEach(item => {
    dom.videoSelect.innerHTML += `<option value="${item}">${item}</option>`
  })
  // 選擇影片
  $(dom.videoSelect).on('change', function () {
    dom.video.src = `/video/${this.value}`
    uploadTempData()
  })
}

// upload temp data
const uploadTempData = async () => {
  tempData.video = dom.videoSelect.value
  tempData.data = data
  const response = await fetchData('/data/', 'POST', { tempData })
  if (response.status !== 200) return toast('error', '資料上傳失敗')
}

// reload temp data
const reloadTempData = async () => {
  const response = await fetchData('/data/', 'GET', null)
  if (response.status !== 200) return
  const resData = await response.json()
  // console.log(resData)
  tempData = resData
  dom.video.src = `/video/${resData.video}`
  dom.videoSelect.value = resData.video
  for (let i = 0; i < resData.classes.length; i++) {
    dom.classSelect.innerHTML += `<option value="${resData.classes[i]}">${resData.classes[i]}</option>`
  }
  data = resData.data
  renderDataList()
}

// 新增標記類別
async function addNewClass() {
  const newClass = dom.newClassInput.value
  if (newClass === '') {
    toast('warning', '請輸入類別名稱')
    return
  }
  dom.classSelect.innerHTML += `<option value="${newClass}">${newClass}</option>`
  dom.newClassInput.value = ''
  tempData.classes.push(newClass)
  const response = await fetchData('/data/', 'POST', { tempData })
  if (response.status !== 200) return toast('error', '類別新增失敗')
  toast('success', '類別新增成功')
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

// 渲染標記資料
function renderDataList() {
  dom.dataList.innerHTML = ''
  data.forEach((item, index) => {
    dom.dataList.innerHTML += `
        <div class="bg-gray-800 p-3">
            <p>類別：${item['class']}</p>
            <p>起始：${item['startTime']}</p>
            <p>結束：${item['endTime']}</p>
            <p>備註：${item['remark']}</p>
            <div class="flex justify-end">
                <button id="${index}" class="deleteItemData py-1 px-3 bg-red-600 rounded-md hover:bg-red-800 duration-300">移除</button>
            </div>
        </div>
        `
  })
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
    toast('warning', '請選擇標註類別')
    return
  }
  if (startTime === '') {
    toast('warning', '請新增起始時間')
    return
  }
  if (endTime === '') {
    toast('warning', '請新增結束時間')
    return
  }

  // 時間資料確認
  for (let i = 0; i < data.length; i++) {
    if (endSec <= startSec) {
      toast('warning', '起始時間必須小於結束時間')
      return
    }
  }

  data.push({
    class: annotationClass,
    startTime: startTime,
    startSec: startSec,
    endTime: endTime,
    endSec: endSec,
    remark: remark
  })
  // console.log(data)

  uploadTempData()
  renderDataList()

  dom.startTimeLabelInput.value = endTime
  dom.endTimeLabelInput.value = ''
  dom.remarkInput.value = ''
}

// 匯出 Excel
function exportToExcel() {
  // 你的数据，以 JSON 格式表示
  let xlsxData = [
    ['ID', 'filename', 'start', 'end', 'duration', 'token', 'remark'], // header
  ];
  const filename = dom.videoSelect.value.split('.')[0]
  for (let i = 0; i < data.length; i++) {
    xlsxData.push([
      i,
      filename,
      data[i]['startSec'],
      data[i]['endSec'],
      parseFloat(data[i]['endSec']) - parseFloat(data[i]['startSec']),
      data[i]['class'],
      data[i]['remark']
    ])
  }

  // console.log(xlsxData)

  // 创建一个工作簿
  let wb = XLSX.utils.book_new();
  // 将数据添加到工作表中
  let ws = XLSX.utils.aoa_to_sheet(xlsxData);
  // 将工作表添加到工作簿中
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // 将工作簿转换为二进制数据
  let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // 将二进制数据转换为 Blob 对象
  let blob = new Blob([wbout], { type: 'application/octet-stream' });

  // 创建一个下载链接并设置相关属性
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = 'export.xlsx';

  // 模拟点击下载链接
  document.body.appendChild(a);
  a.click();

  // 释放资源
  window.URL.revokeObjectURL(url);
}

async function init() {
  tempData = {
    video: '',
    classes: [],
    data: [],
  }
  data = []
  dom.video.src = ''
  dom.videoSelect.value = ''
  dom.classSelect.innerHTML = '<option value="">請選擇標記類別</option>'
  dom.startTimeLabelInput.value = ''
  dom.endTimeLabelInput.value = ''
  dom.remarkInput.value = ''
  renderDataList()

  const response = await fetchData('/data/', 'POST', { tempData })
  if (response.status !== 200) return toast('error', '初始化失敗')
}

window.addEventListener('load', () => {
  // 移除標註資料
  $(document).on('click', '.deleteItemData', function () {
    const deleteIndex = parseInt(this.id)
    data = data.filter((_, index) => index !== deleteIndex)
    // console.log(data)
    uploadTempData()
    renderDataList()
    toast('success', '標註移除成功')
  })
})

window.addEventListener('DOMContentLoaded', () => {
  getVideoList()
  reloadTempData()

  dom.initButton.addEventListener('click', () => {
    if (confirm('確定要初始化嗎？')) {
      init();
    }
  });
  dom.startTimeLabelBtn.addEventListener('click', addStartTimeLabel)
  dom.endTimeLabelBtn.addEventListener('click', addEndTimeLabel)
  dom.resetTimeLabelBtn.addEventListener('click', resetTimeLabel)
  dom.addClassBtn.addEventListener('click', addNewClass)
  dom.addAnnotationBtn.addEventListener('click', addAnnotation)
  dom.exportExcelBtn.addEventListener('click', exportToExcel)

  dom.changeZBtn.addEventListener('click', () => {
    if (dom.changeZInput.value == '') {
      toast('warning', '請輸入z的數值')
      return
    }
    z = parseFloat(dom.changeZInput.value)
    toast('success', 'z數值變更成功')
  })
  dom.changeXBtn.addEventListener('click', () => {
    if (dom.changeXInput.value == '') {
      toast('warning', '請輸入x的數值')
      return
    }
    x = parseFloat(dom.changeXInput.value)
    toast('success', 'x數值變更成功')
  })

  dom.video.addEventListener('timeupdate', () => {
    let currentTime = getVideoCurrentTime()
    dom.currentTime.innerHTML = `${formatTimeFromSecondsWithMilliseconds(currentTime)}`
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