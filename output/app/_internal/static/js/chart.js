import fetchData from './module/fetchData.js'

const dom = {
  fileInput: document.getElementById('fileInput'),
  uploadButton: document.getElementById('uploadButton'),
}

// 上傳檔案
const uploadFileHandler = async () => {
  const file = dom.fileInput.files[0]
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch('/api/chart', {
    method: 'POST',
    body: formData
  })
  const data = await response.json()
  console.log(data)
  renderChart(data)
}

// 渲染圖表
const renderChart = async (data) => {
  console.log(data)

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

  const allEvent = []
  const series = []
  console.log(allEvent, series)

  // 整理list內的資料
  data['timeArr'] = data.time.split(',')
  data['processArr'] = data.process.split(',')
  data['list'] = []
  data.timeArr.forEach((_, timeArrIndex) => {
    data['list'].push({ event: data.processArr[timeArrIndex], time: convertToTimeString(data.timeArr[timeArrIndex]) })
    console.log({ event: data.processArr[timeArrIndex], time: convertToTimeString(data.timeArr[timeArrIndex]) })
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

  // chart option
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
    colors: [
      "#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
      "#3F51B5", "#546E7A", "#D4526E", "#8D5B4C", "#F86624",
      "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"
    ],
    fill: {
      type: 'solid'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function (val) {
          var minutes = new Date(val).getMinutes();
          var seconds = new Date(val).getSeconds();
          return minutes + ":" + seconds;
        }
      }
    },
    legend: {
      position: 'right'
    },
    tooltip: {
      custom: function (opts) {
        let min1 = new Date(opts.y1).getMinutes()
        let sec1 = new Date(opts.y1).getSeconds()
        let min2 = new Date(opts.y2).getMinutes()
        let sec2 = new Date(opts.y2).getSeconds()
        return `時間: ${min1}:${sec1} - ${min2}:${sec2}`
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

  // 將秒數轉換為分鐘和秒數
  function secondsToMinutesAndSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return minutes + " 分 " + remainingSeconds + " 秒";
  }
}

window.addEventListener('DOMContentLoaded', () => {
  dom.uploadButton.addEventListener('click', uploadFileHandler)
})