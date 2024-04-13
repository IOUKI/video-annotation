export default function (chartDom, series) {
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

}
