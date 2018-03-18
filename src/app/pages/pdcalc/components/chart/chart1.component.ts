import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild,
        AfterViewInit, ElementRef, ChangeDetectionStrategy, ViewEncapsulation, 
        NgZone, ChangeDetectorRef } from '@angular/core';

declare let zrender: any;

const covertXs5 = (v) => {
    return (v | 0) + 0.5;
};

const formatLeftAxisLabel = (v) => {
    return Number(v * 100).toFixed(0) + '%';
};

@Component({
    selector: 'chart-1',
    templateUrl: './chart1.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./chart1.scss']
})
export class Chart1Component implements OnInit, OnChanges, AfterViewInit {

    @Input() datas: any;

    @ViewChild('sylRateChart') sylRateChart: ElementRef;

    @ViewChild('showRateTipDom') showRateTipElRef: ElementRef;

    showRateTip: boolean = false;

    @ViewChild('showPerTipDom') showPerTipElRef: ElementRef;

    showPerTip: boolean = false;

    private zr: any;

    chart: {[name: string]: any, datas: {[name: string]: any}, offset: number} = {
        offset: 50,
        datas: {}
    };

    constructor(private ngZone: NgZone, private checkRef: ChangeDetectorRef) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if ('datas' in changes && this.datas) {
            this.renderChart();
        }
    }

    ngAfterViewInit() {}

    private renderChart() {
        this.buildChartDatas();
        this.buildZr();
        this.renderBaseCoordinateLines();
        this.renderAxis();
        this.renderAxisLabel();
        this.renderPeriodChart();
        this.renderProbabilityChart();
    }

    private buildZr() {
        const zr = this.zr ? this.zr : (this.zr = zrender.init(this.sylRateChart.nativeElement));
        this.chart.width = zr.getWidth() - 2 * this.chart.offset;
        this.chart.height = zr.getHeight() - 2 * this.chart.offset;
        return zr;
    }

    // 构建图表数据
    private buildChartDatas() {
        //构建期数收益率数据(所有类型的统计数据类型、顺序必须一致)
        let periodKeys: any = this.chart.datas.periodKeys = [];
        const yieldCurveList: any = this.chart.datas.yieldCurveList = [];
        let rateList: any = this.chart.datas.rateList = [];
        this.chart.datas.periods = this.datas.yieldCurve.map((item) => {
            yieldCurveList.push({type: item.curveCode, name: item.curveName});
            return {
                type: item.curveCode,
                name: item.curveName,
                showRateDiff: true,
                data: (item.yieldCurveDatas || []).map((_item) => {
                    if (periodKeys.indexOf(_item.mtrty) < 0){
                        periodKeys.push(_item.mtrty);
                    }
                    rateList.push(_item.yld);
                    return {
                        period: _item.mtrty,
                        value: _item.yld
                    }
                })
            }
        });

        //累计收益率概率分布数据
        this.chart.datas.probability = this.datas.pdcalcResult.map((item) => {
            rateList.push(item.yldRate);
            return {
                rate: item.yldRate, //绘制横线
                per:  ((item.accumPr * 100) | 0) * 0.01, //概率分布值
                value: ((item.pr * 1000) | 0) * 0.001 //绘制概率分布曲线
            }
        })

        rateList = this.chart.datas.rateList = rateList.sort((a, b) => {
            return a - b > 0 ? 1 : (a - b < 0 ? -1 : 0);
        });

        periodKeys = this.chart.datas.periodKeys = periodKeys.sort((a, b) => {
            return a - b > 0 ? 1 : (a - b < 0 ? -1 : 0);
        });

        //概率分布收益率最小值
        this.chart.datas.probability.min = rateList[0] < 0 ? ((rateList[0] - 1) | 0) : 0;
        //概率分布收益率最大值
        this.chart.datas.probability.max = ((rateList[rateList.length - 1]  + 1) | 0);

        //收益率取值(必须取整)
        let step, r;
        this.chart.datas.axisDatas = [];
        r = (this.chart.datas.probability.max - this.chart.datas.probability.min) / 10;
        step = r <= 1 ? 1 : 1.5;
        if (step > 1) {
            r = (this.chart.datas.probability.min * 10) % (15);
            r = 15 - r;
            this.chart.datas.probability.min = this.chart.datas.probability.min < 0 ? this.chart.datas.probability.min - (r * 0.1)
                 : this.chart.datas.probability.min +  (r * 0.1);
        }

        for (let i = 0; i < 10; i++) {
            this.chart.datas.axisDatas.push((this.chart.datas.probability.min + i * step));
        }

        this.chart.datas.axisValueRange = this.chart.datas.axisDatas[this.chart.datas.axisDatas.length - 1] - this.chart.datas.axisDatas[0];
    }

    //计算0坐标的位置
    private calculateZeroY() {
        const index = this.chart.datas.axisDatas.indexOf(0);
        const uinit = this.chart.height / (this.chart.datas.axisDatas.length - 1);
        this.chart.datas.zeroY = this.chart.offset + this.chart.height - (uinit * index);
        return this.chart.datas.zeroY;
    }

    //渲染坐标线
    private renderBaseCoordinateLines() {
        const lineStyle = {
            stroke: 'rgba(0,0,0,0.2)',
            lineWidth: 1
        };
        const zeroY = this.calculateZeroY();

        const leftLine = new zrender.Line({
            silent: true,
            shape: {
                x1: covertXs5(this.chart.offset),
                y1: covertXs5(this.chart.offset),
                x2: covertXs5(this.chart.offset),
                y2: covertXs5(this.chart.offset + this.chart.height)
            },
            style: lineStyle
        });
        const rightLine = new zrender.Line({
            silent: true,
            shape: {
                x1: covertXs5(this.chart.offset + this.chart.width),
                y1: covertXs5(this.chart.offset),
                x2: covertXs5(this.chart.offset + this.chart.width),
                y2: covertXs5(this.chart.offset + this.chart.height)
            },
            style: lineStyle
        });

        const bootomLine = new zrender.Line({
            silent: true,
            shape: {
                x1: covertXs5(this.chart.offset),
                y1: covertXs5(zeroY),
                x2: covertXs5(this.chart.offset + this.chart.width),
                y2: covertXs5(zeroY)
            },
            style: lineStyle
        });

        const middleLine = new zrender.Line({
            silent: true,
            shape: {
                x1: covertXs5(this.chart.offset + this.chart.width / 2),
                y1: covertXs5(this.chart.offset),
                x2: covertXs5(this.chart.offset + this.chart.width / 2),
                y2: covertXs5(this.chart.offset + this.chart.height)
            },
            style: lineStyle
        });

        //绘制标题
        const rateTitle = new zrender.Group();
        rateTitle.add(new zrender.Text({
            transform: [1, 1.5, 10, 1, 10, 150],
            style: {
                text: '收益率(Y)',
                fontSize: 12,
                textFill: 'rgba(0, 0, 0, 0.8)'
            },
            position: [ 10, 8],
            silent: true
        }));

        const periodTitle = new zrender.Group();
        periodTitle.add(new zrender.Text({
            style: {
                text: '期限 (T)',
                fontSize: 12,
                textFill: 'rgba(0, 0, 0, 0.8)'
            },
            position: [this.chart.offset + this.chart.width * 0.5 + 50, this.chart.offset + this.chart.height + 20],
            silent: true
        }));

        const perTitle = new zrender.Group();
        perTitle.add(new zrender.Text({
            style: {
                text: '概率分布',
                fontSize: 12,
                textFill: 'rgba(0, 0, 0, 0.8)'
            },
            position: [this.chart.offset + this.chart.width, 8],
            silent: true
        }));

        this.zr.add(leftLine);
        this.zr.add(rightLine);
        this.zr.add(bootomLine);
        this.zr.add(middleLine);
        this.zr.add(rateTitle);
        this.zr.add(periodTitle);
        this.zr.add(perTitle);
    }

    private renderAxis() {
        const lineStyle = {
            stroke: 'rgba(0,0,0,0.2)',
            lineWidth: 1
        };
        const leftYaxis = new zrender.Path.extend({
            type: 'leftYaxis',
            silent: true,
            style: lineStyle,
            buildPath: (path, shape) => {
                let x, y, r;
                const unit = this.chart.height / this.chart.datas.axisDatas.length;
                this.chart.datas.axisDatas.forEach( (element, index) => {
                    x = this.chart.offset;
                    r = (Math.abs(element - this.chart.datas.axisDatas[0]) * this.chart.height) / this.chart.datas.axisValueRange;
                    y = this.chart.height + this.chart.offset - r;
                    path.moveTo(x, y);
                    path.lineTo(x - 5, y);
                    path.stroke();
                });
            }
        });
        this.zr.add(new leftYaxis());
    }

    //渲染刻度label
    private renderAxisLabel(){
        let x, y, r;
        const unit = this.chart.height / this.chart.datas.axisDatas.length;
        this.chart.datas.axisDatas.forEach( (element, index) => {
            x = this.chart.offset;
            r = (Math.abs(element - this.chart.datas.axisDatas[0]) * this.chart.height) / this.chart.datas.axisValueRange;
            y = this.chart.height + this.chart.offset - r;
            this.zr.add(new zrender.Text({
                    style: {
                        text: formatLeftAxisLabel(element * 0.01),
                        textAlign: 'center',
                        textVerticalAlign: 'middle',
                        fontSize: 12,
                        fontWeight: 'normal',
                        textFill: 'rgba(133, 80, 239, 0.5)'
                    },
                    position: [ x - 20, y],
                    silent: true
                })
            );
        });

    }


    //绘制期数收益率曲线
    private renderPeriodChart(){
        const lineStyle = {
            stroke: 'rgba(0,0,0,0.2)',
            lineWidth: 1
        };
        const zeroY = this.calculateZeroY();
        //绘制label
        const maxPeriod = this.chart.datas.periods[0].data[this.chart.datas.periods[0].data.length - 1].period;
        this.zr.add(new zrender.Text({
            style: {
                text: maxPeriod + 'M',
                textAlign: 'center',
                textVerticalAlign: 'middle',
                fontSize: 12,
                fontWeight: 'normal',
                textFill: 'rgba(133, 80, 239, 0.5)'
            },
            position: [ covertXs5(this.chart.offset + 15 + this.chart.width / 2) , covertXs5(zeroY + 10)],
            silent: true
        }));

        //绘制线
        this.chart.datas.periods.forEach((element, index) => {
            const d = element.data;
            element.points = [];
            const uinit = this.chart.width / (2 * (this.chart.datas.periodKeys.length - 1));
            let x, y, r;
            for (let i = 0; i < d.length; i++) {
                x = covertXs5(this.chart.offset + this.chart.datas.periodKeys.indexOf(d[i].period) * uinit);
                //求出 值对应的 刻度比例
                r = (Math.abs(d[i].value * 100 - this.chart.datas.axisDatas[0]) * this.chart.height) / this.chart.datas.axisValueRange;
                y = covertXs5(this.chart.height + this.chart.offset - r);
                element.points.push({x: x, y: y});
            }

            lineStyle.stroke = element.showRateDiff === true ? 'rgba(0,0,0, 0.7)' : 'rgba(0,0,0,0.2)';
            this.zr.add(new (new zrender.Path.extend({
                silent: true,
                style: lineStyle,
                buildPath: (path, shape) => {
                    path.moveTo(element.points[0].x, element.points[0].y);
                    for (let j = 1; j < element.points.length; j++) {
                        path.lineTo(element.points[j].x, element.points[j].y);
                        path.stroke();
                        if (j < element.points.length - 1) {
                            path.moveTo(element.points[j].x, element.points[j].y);
                        }
                    }
                }
            }))());
            //添加圆点
            this.zr.add(new zrender.Circle({
                silent: true,
                shape: {
                    cx: element.points[element.points.length - 1].x,
                    cy:  element.points[element.points.length - 1].y,
                    r: 3
                },
                style: {
                    stroke: 'rgba(0,0,0,0.2)',
                    lineWidth: 1
                }
            }));
        });
     }

     private renderProbabilityChart() {
        let x, y, r;
        const _d = this.chart.datas.probability;
        const lineStyle = {
            stroke: 'rgba(0,0,0, 1)',
            lineWidth: 0.2,
            fill: 'rgba(0,0,0,1)'
        };
        const zeroY = this.calculateZeroY();
        const datas: any = this.chart.datas.probability;
        const axisValueRange = this.chart.datas.probability.max - this.chart.datas.probability.min;
        datas.forEach(element => {
            // 计算横线标线坐标
            x = covertXs5(this.chart.offset);
            r = (Math.abs(element.rate * 100) * (zeroY - this.chart.offset)) / this.chart.datas.axisValueRange;
            y = covertXs5(this.chart.offset +  r);
            element.hxPoint = {x: x, y: y};
            // 计算 概率曲线值坐标
            r = (Math.abs(element.value * 100 - this.chart.datas.probability.min) * (this.chart.width / 2)) / axisValueRange;
            x = covertXs5(this.chart.width + this.chart.offset - r);
            element.glPoint = {x: x, y: y};
        });

        // 绘制概率分布曲线
        const RightArea = new zrender.Path.extend({
            type: 'rightArea',
            silent: true,
            style: lineStyle,
            buildPath: (path, shape) => {
                path.moveTo(_d[0].glPoint.x, _d[0].glPoint.y);
                for (let i = 1; i < _d.length; i++) {
                    path.lineTo(_d[i].glPoint.x, _d[i].glPoint.y);
                    path.stroke();
                    if (i < _d.length - 1) {
                        path.moveTo(_d[i].glPoint.x, _d[i].glPoint.y);
                    }
                }
                path.fill();
            }
        });
        this.zr.add(new RightArea());
        //绘制水平标线
        const style = { lineWidth: 1, stroke: ''};
        let hoverL;
        for (let i = 1; i < _d.length; i++) {
            style.stroke = (_d[i].per * 100) % 10 === 0 ? 'rgba(0,0,0, 0.2)' : 'rgba(0,0,0,0.5)';
            hoverL = new zrender.Line({
                silent: false,
                shape: {
                    x1: this.chart.offset,
                    y1: _d[i].glPoint.y,
                    x2: this.chart.offset + this.chart.width,
                    y2: _d[i].glPoint.y
                },
                style: style
            });
            hoverL.on('mouseover', (e, b) => {
                this.ngZone.runOutsideAngular(() => {
                    $([this.showRateTipElRef.nativeElement, this.showPerTipElRef.nativeElement])
                        .removeClass('show')
                        .addClass('show').css('top', (_d[i].glPoint.y - 45) + 'px');
                        $(this.showRateTipElRef.nativeElement).find('.tooltip-inner')
                            .html('收益率' + '<span style="color:red;padding-left: 10px;"><h5 style="display: inline;">'
                             + ( (_d[i].rate * 100) | 0 ) + '%</h5></span>');
                        $(this.showPerTipElRef.nativeElement).find('.tooltip-inner')
                            .html('概率分布' + '<span style="color:red;padding-left: 10px;"><h5 style="display: inline;">' 
                                + (_d[i].per * 100) + '%</h5></span>');
                        hoverL.setStyle('stroke', 'rgba(0,0,0,1)');
                        hoverL.setStyle('lineWidth', 2);
                });
            }).on('mouseout', () => {
                this.ngZone.runOutsideAngular(() => {
                   $([this.showRateTipElRef.nativeElement, this.showPerTipElRef.nativeElement]).removeClass('show');
                   hoverL.setStyle('stroke', style.stroke);
                   hoverL.setStyle('lineWidth', 1);
                });
            })
            this.zr.add(hoverL);
        }

        //绘制刻度及label
        const RightAxis = new zrender.Path.extend({
            type: 'rightAxis',
            silent: true,
            style: lineStyle,
            buildPath: (path, shape) => {
                for (let i = 0; i < _d.length; i++) {
                    if ((_d[i].per * 100) % 10 === 0) {
                        path.moveTo(this.chart.offset + this.chart.width, _d[i].glPoint.y);
                        path.lineTo(this.chart.offset + this.chart.width + 5 , _d[i].glPoint.y);
                    }
                }
             }
        });
        this.zr.add(new RightAxis());

        for (let i = 0; i < _d.length; i++) {
            if ((_d[i].per * 100) % 10 === 0) {
                this.zr.add(
                    new zrender.Text({
                        style: {
                            text: formatLeftAxisLabel(_d[i].per),
                            textAlign: 'center',
                            textVerticalAlign: 'middle',
                            fontSize: 12,
                            fontWeight: 'normal',
                            textFill: 'rgba(133, 80, 239, 0.5)'
                        },
                        position: [ this.chart.offset + this.chart.width + 25, _d[i].glPoint.y],
                        silent: true
                    })
                )
            }
        }

    }
}