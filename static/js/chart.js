import toast from "./module/toast.js"

let series = [] // 圖表資料
let allEvent = [] // 所有事件類別
let xLabelTemp = [] // 出現過的x label

const dom = {
  colorTest: document.getElementById('colorTest'),
  fileInput: document.getElementById('fileInput'),
  uploadButton: document.getElementById('uploadButton'),
  eventsDiv: document.getElementById('eventsDiv'),
  maxMin: document.getElementById('maxMin'),
  renderChartButton: document.getElementById('renderChartButton'),
  timeLineRangeSlider: document.getElementById('chart-time-line-min-and-max-range-slider'),
  xLabelStep: document.getElementById('x-label-step'),
}

// 上傳檔案
const uploadFileHandler = async () => {
  const file = dom.fileInput.files[0]
  // console.log(file)
  if (typeof file === 'undefined') return alert('請選擇檔案')
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch('/api/chart', {
    method: 'POST',
    body: formData
  })
  const data = await response.json()
  // console.log(data)
  // renderChart(data)
  filterData(data)
}

// 過濾圖表資料
const filterData = (data) => {
  // console.log(data)

  // 將時間字串轉換為秒數
  function convertToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  // 將秒數轉換為時間字串
  function convertToTimeString(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  // 確認時間有無依照順序排序
  function isTimelineSorted(str) {
    const arr = str.split(',')
    for (let i = 0; i < arr.length - 1; i++) {
      const currentTime = convertToSeconds(arr[i]);
      const nextTime = convertToSeconds(arr[i + 1]);

      if (currentTime > nextTime) {
        console.error(`時間線未按照順序排列: ${arr[i]} 在 ${arr[i + 1]} 之前`);
        return false;
      }
    }

    console.log(`時間線非常完整！`);
    return true;
  }

  // 檢查時間是否有按照順序排列
  isTimelineSorted(data.time)

  allEvent = []
  series = []

  // 整理list內的資料
  data['timeArr'] = data.time.split(',')
  data['processArr'] = data.process.split(',')
  data['list'] = []
  data.timeArr.forEach((_, timeArrIndex) => {
    data['list'].push({ event: data.processArr[timeArrIndex], time: convertToTimeString(data.timeArr[timeArrIndex]) })
    // console.log({ event: data.processArr[timeArrIndex], time: convertToTimeString(data.timeArr[timeArrIndex]) })
    if (!allEvent.includes(data.processArr[timeArrIndex])) {
      allEvent.push(data.processArr[timeArrIndex])
    }
  })
  console.log('整理list內的資料')

  // 分類出全部的事件
  allEvent.forEach(element => {
    series.push({ name: element, data: [] })
  })

  // 依照事件分類list資料
  series.forEach((seriesItem, seriesIndex) => {
    let seriesEventName = seriesItem.name

    data.list.forEach((listItem, listIndex) => {
      let listEventName = listItem.event
      if (seriesEventName == listEventName) {
        let time1 = listItem.time.split(':')
        let min1 = time1[0]
        let sec1 = time1[1]
        let min2, sec2
        if (data.list.length - 1 == listIndex) {
          min2 = min1
          sec2 = sec1
        } else {
          let time2 = data.list[listIndex + 1].time.split(':')
          min2 = time2[0]
          sec2 = time2[1]
        }
        // console.log(min1, sec2, min2, sec2)
        if (typeof (min1) == 'undefined' || typeof (sec1) == 'undefined') {
          console.log(`這裡的資料似乎不符合格式 => Y Label: ${data.yLabel}, time: ${listItem.time}`)
        }
        if (typeof (min2) == 'undefined' || typeof (sec2) == 'undefined') {
          console.log(`這裡的資料似乎不符合格式 => Y Label: ${data.yLabel}, time: ${data.list[listIndex + 1].time}`)
        }
        series[seriesIndex].data.push({ x: data.yLabel, y: [new Date(2023, 1, 1, 0, min1, sec1).getTime(), new Date(2023, 1, 1, 0, min2, sec2).getTime()] })
      }
    })
  })
  console.log('依照事件分類list資料')

  // 最大時間
  const dataMaxMinute = parseInt(data.list[data.list.length - 1].time.split(':')[0]) + 1
  dom.maxMin.value = Math.ceil(dataMaxMinute / 10) * 5 // 取得最多分鐘最接近的5倍數
  dom.maxMin.value = dataMaxMinute
  dom.timeLineRangeSlider.value = dom.maxMin.value

  // 預設顏色
  let defaultColors = [
    "#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
    "#3F51B5", "#546E7A", "#D4526E", "#8D5B4C", "#F86624",
    "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"
  ]

  // 渲染事件顏色選擇
  dom.eventsDiv.innerHTML = ''
  allEvent.forEach((category, index) => {
    dom.eventsDiv.innerHTML += `
      <form class="text-center">
        <label for="${category}-color" class="block text-lg font-medium mb-2">${category}</label>
        <input type="color" id="${category}-color" class="category-color" value="${defaultColors[index]}" title="Choose your color" />
      </form>
    `
  })
}

// 渲染圖表
const renderChart = async () => {
  if (series.length === 0) return toast('error', '請先上傳檔案')

  document.getElementById('chart').innerHTML = ''
  // console.log(data)

  const categoryColors = document.querySelectorAll('.category-color')
  const colors = Array.from(categoryColors).map(color => color.value)
  // console.log('colors:', colors)

  // chart option
  xLabelTemp = []
  let options = {
    series: series,
    chart: {
      height: 350,
      type: 'rangeBar'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
        rangeBarGroupRows: true
      }
    },
    colors: colors,
    fill: {
      type: 'solid'
    },
    xaxis: {
      type: 'datetime',
      // 設定 x 軸的最小值與最大值
      min: new Date(2023, 1, 1, 0, 0, 0).getTime(),
      max: new Date(2023, 1, 1, 0, dom.maxMin.value, 0).getTime(),
      labels: {
        formatter: function (val) {
          // 顯示整數分鐘的時間，格式為 0, 10, 20, 30...
          let date = new Date(val);
          let minutes = date.getMinutes();
          if (minutes.toString() === dom.maxMin.value) {
            return minutes
          } else if (dom.xLabelStep.value !== '') {
            const timeStep = dom.xLabelStep.value
            return minutes % timeStep === 0 ? `${minutes}` : ''
          } else {
            return minutes
          }
        }
      },
      tickAmount: Math.ceil(dom.maxMin.value / 1) // 刻度數量，間隔 10 分鐘
    },
    legend: {
      position: 'right'
    },
    tooltip: {
      custom: function (opts) {
        let min1 = new Date(opts.y1).getMinutes();
        let sec1 = new Date(opts.y1).getSeconds();
        let min2 = new Date(opts.y2).getMinutes();
        let sec2 = new Date(opts.y2).getSeconds();
        return `時間: ${min1}:${sec1} - ${min2}:${sec2}`;
      }
    }
  };

  // apexchart init
  let chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();

  // 秒數轉分鐘字串
  function convertDictionaryValuesToMinutes(dictionary) {
    const convertedDictionary = {};

    for (const key in dictionary) {
      if (dictionary.hasOwnProperty(key)) {
        const seconds = dictionary[key];
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

        convertedDictionary[key] = formattedTime;
      }
    }

    return convertedDictionary;
  }

  // 計算各類別總時間
  series.map(group => {
    let timeDict = {}
    group.data.map(item => {
      if (timeDict.hasOwnProperty(item.x)) timeDict[item.x] += (item.y[1] - item.y[0]) / 1000
      else timeDict[item.x] = (item.y[1] - item.y[0]) / 1000
    })
    timeDict = convertDictionaryValuesToMinutes(timeDict)
    console.log(`${group.name} 總時間: `, timeDict)
  })
}

const timeLineRangeSliderChangeHandle = () => {
  const value = dom.timeLineRangeSlider.value
  dom.maxMin.value = value
}

window.addEventListener('DOMContentLoaded', () => {
  dom.uploadButton.addEventListener('click', uploadFileHandler)
  dom.renderChartButton.addEventListener('click', renderChart)
  dom.timeLineRangeSlider.addEventListener('input', timeLineRangeSliderChangeHandle)
})