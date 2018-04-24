import { Component, OnInit, ViewEncapsulation } from '@angular/core';

const xAxisData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
'11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
'21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
'31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
'41', '42', '43', '44', '45', '46', '47', '48', '49'
];

const legendData = [
    '2013-01', '2013-02', '2013-03', '2013-04', '2013-05', '2013-06', '2013-07', '2013-08', '2013-09', '2013-10',
    '2013-11', '2013-12', '2014-01', '2014-02', '2014-03', '2014-04', '2014-05', '2014-06', '2014-07', '2014-08',
    '2014-09', '2014-10', '2014-11', '2014-12', '2014-13'
];

function getMockSeries(){
    const r = [];
        for (let i = 0; i < legendData.length; i++) {
            const d = [];
            //模拟数据
            for (let j = 0; j < xAxisData.length; j++) {
                let sign = 0;
                while (sign < 0.01 || sign > 0.08) {
                    sign = ((Math.random() * 10000) | 0) / 10000;
                }
                d.push(sign);
            }
            r.push({
                name: legendData[i],
                type: 'line',
                data: d,
            });

        }
        return r;

}

const Mock = {
    chartOption1: {
        grid: {
            left: 50,
            top: 30,
            right: 30,
            bottom: 140,
            borderWidth: 1
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
        },
        legend: {
            data: legendData,
            bottom: 10,
            left: 50,
            right: 30,
            padding: 1
        },
        yAxis: {
            type: 'value'
        },
        series: getMockSeries()
    }
}


@Component({
    selector: 'analyse-main',
    templateUrl: './main.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./main.scss']
})
export class AnalyseMainComponent implements OnInit {

    chartOption1;

    chartOption2;

    constructor() { }

    ngOnInit(): void {
        this.chartOption1 = Mock.chartOption1;
        this.chartOption2 = Object.assign({}, this.chartOption1);
        this.chartOption2.series = [this.chartOption2.series[0]];
        this.chartOption2.grid = {
            left: 30,
            top: 30,
            right: 30,
            bottom: 30,
            borderWidth: 1
        };
        this.chartOption2.legend = null;
    }
}
