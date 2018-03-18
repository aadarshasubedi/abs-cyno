import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { makeMockData } from './mock.data';

declare let zrender: any;

const covertXs5 = (v) => {
    return (v | 0) + 0.5;
};

@Component({
    templateUrl: './index2.html',
    styleUrls: ['./index2.scss']
})
export class Index2Component implements OnInit, AfterViewInit {


    // 基于ZRender收益率图标

    @ViewChild('sylRateChart') sylRateChart: ElementRef;

    data: any = makeMockData();

    zr: any;

    axisPonits: {left?: Array<any>, top?: Array<any>, right?: Array<any>, bottom?: Array<any>};

    offset: number = 50;

    //期数收益率数据
    periodsRateDatas: Array<any>;
    //概念收益曲线数据
    percentRateDatas: Array<any>;

    //参考类型
    referenceType: any;
    //left axis 0 坐标 Y位置
    zeroY: number;

    constructor() { }

    ngOnInit() { }

    ngAfterViewInit() {
        this.initZr();
        this.createAxisDatas();
        this.createPeriodsRateDatas();
        this.createPercentRateDatas();

        this.renderAxis();
        this.renderPeriodRadeLine();
        this.renderPercentRateLine();
    }

    private initZr() {
        return this.zr ? this.zr : (this.zr = zrender.init(this.sylRateChart.nativeElement));
    }

    private renderPercentRateLine() {
        const height = this.zr.getHeight();
        const width = this.zr.getWidth();
        const min = 0;
        const max = 15;
        const step = 1;
        const unitx = (width - (2 * this.offset) / 2) / 12; //刻度比比例
        const unuty = (height - (2 * this.offset)) / this.percentRateDatas.length;

        const areaT = new zrender.Path.extend({
            silent: true,
            type: 'areaT',
            style: {
                stroke: 'rgba(0,0,0,0.2)',
                lineWidth: 1
            },
            buildPath: (path, shape) => {
                let x, y;
                path.moveTo(width - this.offset, this.offset);
                for  (let i = 0; i < this.percentRateDatas.length; i++) {
                    x = width - this.offset - (this.percentRateDatas[i].rate * unitx * 100);
                    y = (this.offset + (i * unuty));
                    path.lineTo(covertXs5(x), covertXs5(y));
                }
                path.stroke();
            }
        })

        this.zr.add(new areaT());

    }

    private renderPeriodRadeLine(){
        const min = this.axisPonits.left[0];
        const max = this.axisPonits.left[this.axisPonits.left.length - 1];
        const height = this.zr.getHeight();
        const width = this.zr.getWidth();
        const unitx = (max - min)  / (height - (2  * this.offset));

        // 计算数据的坐标
        this.periodsRateDatas.forEach((ev, i) => {
            ev.point = {
                x: this.offset + (( (i + 1) * ( ((width -  (2 * this.offset) ) / 2))) / this.periodsRateDatas.length),
                y: Number( height - this.offset - ((Math.abs(ev.value - min)) * (height - (2  * this.offset))) / (max - min)).toFixed(0)
            }
        });

        // 绘制线
        this.periodsRateDatas.forEach((ev, i) => {
            this.zr.add(new zrender.Line({
                shape: {
                    x1: covertXs5( i === 0 ? this.offset : this.periodsRateDatas[i - 1].point.x ),
                    y1: covertXs5( i === 0 ? this.zeroY : this.periodsRateDatas[i - 1].point.y ),
                    x2: covertXs5( this.periodsRateDatas[i].point.x ),
                    y2: covertXs5( this.periodsRateDatas[i].point.y )
                },
                style: {
                    stroke: 'rgba(0,0,0,0.2)',
                    lineWidth: 1
                },
                silent: true
            }));
            //添加一个是实心点
            if (i === this.periodsRateDatas.length - 1){
                this.zr.add(new zrender.Circle({
                    shape: {
                        cx: covertXs5( this.periodsRateDatas[i].point.x),
                        cy: covertXs5( this.periodsRateDatas[i].point.y),
                        r: 3
                    },
                    style: {
                        stroke: 'rgba(0,0,0,0.2)',
                        lineWidth: 1
                    },
                }));
                this.zr.add(new zrender.Circle({
                    shape: {
                        cx: covertXs5( this.periodsRateDatas[i].point.x),
                        cy: covertXs5( this.periodsRateDatas[i].point.y),
                        r: 3
                    },
                    style: {
                        stroke: 'rgba(0,0,0,0.2)',
                        lineWidth: 1
                    },
                }))
            }
        });
    }

    //渲染刻度
    private renderAxis() {
        //创建刻度数据
        let x, y, step, offset = this.offset;
        const group: any = new zrender.Group();
        const leftlen = this.axisPonits.left.length;
        const rightlen = this.axisPonits.right.length;
        const height = this.zr.getHeight();
        const width = this.zr.getWidth();
        const formatLeftAxisLabel = (v) => {
            return Number(v * 100).toFixed(0) + '%';
        };

        const formatBottomAxisLabel = (v) => {
            return v + 'M';
        };

        const getZeroY = () => {
            let r;
            const s = (height - (2 * offset)) / leftlen;
            for (let i = 0; i < leftlen; i++) {
                r = height - offset - (i * s);
                if (this.axisPonits.left[i] === 0){
                    return r;
                }
            }
        };

        const zeroY = this.zeroY = getZeroY();

        //创建刻度坐标View 
        const CynoAxisPath = zrender.Path.extend({
            silent: true,
            type: 'cynoaxispath',
            style: {
                stroke: 'rgba(0,0,0,0.2)',
                lineWidth: 1
            },
            buildPath: (path, shape) => {
                step = (height - (2 * offset)) / leftlen;
                // left
                path.moveTo(covertXs5(offset), covertXs5(offset));
                path.lineTo(covertXs5(offset), covertXs5(height - offset));
                path.stroke();

                for (let i = 0; i < leftlen; i++) {
                    x = covertXs5(offset - 7);
                    y = covertXs5(height - offset - (i * step));
                    path.moveTo(x, y);
                    path.lineTo(x + 7, y);
                    path.stroke();
                }

                // bottom (只渲染最大期限)
                path.moveTo(covertXs5(offset), covertXs5(zeroY));
                path.lineTo(covertXs5(width - offset), covertXs5(zeroY));
                path.stroke();
                path.moveTo(covertXs5(width / 2), covertXs5(offset));
                path.lineTo(covertXs5((width / 2)), covertXs5((height - offset > zeroY ? (height - offset) : (height - offset + 5))));
                path.stroke();


                // right
                path.moveTo(covertXs5(width - offset), covertXs5(offset));
                path.lineTo(covertXs5((width - offset)), covertXs5((height - offset > zeroY ? (height - offset) : (height - offset + 5))));
                path.stroke();

                //right axis
                step = (zeroY - offset) / rightlen;
                for (let i = 0; i < rightlen; i++) {
                    x = covertXs5(width - offset + 5);
                    y = covertXs5(zeroY  - (i * step));
                    path.moveTo(x, y);
                    path.lineTo(x + 7, y);
                    path.stroke();
                }
            }
        });

        group.add(new CynoAxisPath());

        // //绘制left axis label
        step = (this.zr.getHeight() - (2 * this.offset)) / leftlen;
        for (let i = 0; i < leftlen; i++) {
            x = this.offset - 20;
            y = height - offset - (i * step) - 2;
            group.add(
                new zrender.Text({
                    style: {
                        text: formatLeftAxisLabel(this.axisPonits.left[i]),
                        textAlign: 'center',
                        textVerticalAlign: 'middle',
                        fontSize: 12,
                        fontWeight: 'normal',
                        textFill: 'rgba(133, 80, 239, 0.5)'
                    },
                    position: [ x, y],
                    silent: true
                }))
        }

        //绘制bottom axis label
        group.add(
            new zrender.Text({
                style: {
                    text: formatBottomAxisLabel(this.axisPonits.bottom[0]),
                    textAlign: 'center',
                    textVerticalAlign: 'middle',
                    fontSize: 12,
                    fontWeight: 'normal',
                    textFill: 'rgba(133, 80, 239, 0.5)'
                },
                position: [ width / 2 + 15, zeroY + 12],
                silent: true
            }));

        //绘制right axis label
        step = (zeroY - offset) / rightlen;
        for (let i = 0; i < rightlen; i++) {
            x = covertXs5(width - offset + 32);
            y = covertXs5(zeroY  - (i * step));
            group.add(
                new zrender.Text({
                    style: {
                        text: formatLeftAxisLabel(this.axisPonits.right[i]),
                        textAlign: 'center',
                        textVerticalAlign: 'middle',
                        fontSize: 12,
                        fontWeight: 'normal',
                        textFill: 'rgba(133, 80, 239, 0.5)'
                    },
                    position: [ x, y],
                    silent: true
                }))
        }

        this.zr.add(group);
    }

    private createAxisDatas() {

        let min, max, axisDatas;

        //最小刻度值
        const minAxis = (datas?: any, defa?: number) => {
            return defa;
        };

        //最大刻度值
        const maxAxis = (datas?: any, defa?: number) => {
            return defa;
        };
        //生成刻度数组
        const generateAxisData = (min: number, max: number, step: number) => {
            let v = min;
            const d = [v];
            while (v < max) {
                v = v + step;
                v = Math.min(max, v);
                d.push(v);
           }
            return d;
        };

        this.axisPonits = {};

        //处理left axis
        min = minAxis(null, (-1) * 0.02);
        max = maxAxis(null, 0.10);
        this.axisPonits.left = generateAxisData(min * 100, max * 100, 1).map((d) => {
            return d * 0.01;
        });

        //处理bottom  axis
        this.axisPonits.bottom = [24];

        //处理right axis;
        this.axisPonits.right = [];
        for (let i = 20; i >= 0; i--) {
            this.axisPonits.right.push(0.05 * i);
        }
    }

    private createPeriodsRateDatas() {
        //this.referenceType 
        this.periodsRateDatas = [
            {period: 3, value: 0.01},
            {period: 6, value: 0.05},
            {period: 9, value: 0.035},
            {period: 12, value: 0.045},
            {period: 15, value: 0.055},
            {period: 18, value: 0.065},
            {period: 21, value: 0.065},
            {period: 24, value: 0.075}
        ]
       
    }

    //收益率曲线
    private createPercentRateDatas() {
        //this.referenceType 
        this.percentRateDatas = this.data.chances;
    }

}

