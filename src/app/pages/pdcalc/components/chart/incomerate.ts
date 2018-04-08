import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild,
        AfterViewInit, ElementRef, ChangeDetectionStrategy, ViewEncapsulation, 
        NgZone, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

import {
    MatTableDataSource,
    MatPaginator,
    MatSort,
    MatTabGroup,
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material';
import {
    Overlay
} from '@angular/cdk/overlay';
import { CesuanParam } from './cesuan-param';
declare let zrender: any;

const covertXs5 = (v) => {
    return (v | 0) + 0.5;
};

const formatLeftAxisLabel = (v) => {
    return Number(v * 100).toFixed(2) + '%';
};

const findRangAndStep = (min, max, minStep, maxcount, maxFixed) => {
    let r, r1, r2;
    min = (min * 10000) | 0;
    max = (max * 10000) | 0;
    minStep = (minStep * 10000) | 0;

    if (maxFixed !== true) {
        min = min < 0 ? min : 0;
        if (min < 0) {
            r1 = Math.abs(min);
            r1 = Math.max(r1, minStep);
            r2 = (r1) % (minStep);
            r1 = r2 === 0 ? r1 : r1 - r2 + minStep;
            min = -1 * r1;
        }
        r = Math.abs(max - min);
        r2 = (r) % (minStep);
        r1 = r2 === 0 ? r : r - (r2) + minStep;
        max = r1 + min;
    } else {
        r1 = max - min;
    }
	
	if ((r1 / minStep) < maxcount) {
		return [min  / 10000, max  / 10000, (minStep / 10000)];
	}
	return findRangAndStep(min / 10000, max / 10000, (minStep + 50)  / 10000, maxcount, true);
}

@Component({
    selector: 'chart-incomerate',
    templateUrl: './incomerate.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./incomerate.scss']
})
export class ChartIncomeRateComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() datas: any;

    @Input() proposalId: string;

    @Input() proData: any = {};

    @ViewChild('sylRateChart') sylRateChart: ElementRef;

    @ViewChild('showRateTipDom') showRateTipElRef: ElementRef;

    @Input() graphicDescElRef: any;

    showRateTip: boolean = false;

    @ViewChild('showPerTipDom') showPerTipElRef: ElementRef;

    @Output() selectProposaChange: EventEmitter<any> = new EventEmitter<any>();

    showPerTip: boolean = false;

    @Input() selectedIndex: number = 0;

    //测算参数modal
    calculateParams: any = {
        //模拟次数
        frequency: null,
        //累计违约率
        cumulativeDefaultRate: {type: '1', average: null, variance: null},
        //违约时间分布
        defaultTimeDistribution: {type: '2', type1: '1', type2: '1'},
        //提前还款率
        conPrepaymentRate: {type: '1', value: null}
    };

    private colorList: Array<any> = [
        'rgba(189,163,38,1)', 'rgba(189,163,38,1)',
        'rgba(127,127,127,1)', 'rgba(163,73,164,1)',
        'rgba(185,122,87,1)', 'rgba(63,72,204,1)'];

    private zr: any;

    chart: {[name: string]: any, datas: {[name: string]: any}, voffset: number, hoffset: number, middlePos: number} = {
        voffset: 22,
        hoffset: 100,
        middlePos: 0.3,
        datas: {}
    };

    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    constructor(
        private ngZone: NgZone,
        private checkRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private overlay: Overlay
    ) { }

    ngOnInit() {
        this.tabGroup.selectedIndexChange.subscribe((index) => {
            this.selectProposaChange.emit(index);
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('datas' in changes && this.datas) {
            this.renderChart();
        }
    }

    ngAfterViewInit() {}

    updateChartFromYieldCurve(selectItem){
        if (selectItem) {
            this.chart.datas.periods.forEach((item) => {
                item.showlicha = item === selectItem;
            });
        }
        this.renderChart(true);
    }

    private renderChart(notRefreshData?: boolean) {
        if (notRefreshData !== true) {
            this.buildChartDatas();
        }
        this.buildZr();
        this.renderAxis();
        this.renderAxisLabel();
        this.renderProbabilityChart();
        this.renderBaseCoordinateLines();
        this.renderPeriodChart();
    }

    private buildZr() {
        if (this.zr){
            this.zr.clear();
        }
        const zr = this.zr ? this.zr : (this.zr = zrender.init(this.sylRateChart.nativeElement));
        this.chart.width = zr.getWidth() - 2 * this.chart.hoffset;
        this.chart.height = zr.getHeight() - 2 * this.chart.voffset;
        return zr;
    }

    // 构建图表数据
    private buildChartDatas() {
        //构建期数收益率数据(所有类型的统计数据类型、顺序必须一致)
        let periodKeys: any = this.chart.datas.periodKeys = [];
        const yieldCurveList: any = this.chart.datas.yieldCurveList = [];
        let rateList: any = this.chart.datas.rateList = [];
        let rightRateList: any =  this.chart.datas.rightRateList = [];
        this.chart.datas.periods = (this.datas.yieldCurve || []).map((item) => {
            yieldCurveList.push({type: item.curveCode, name: item.curveName});
            return {
                type: item.curveCode,
                name: item.curveName,
                showLine: true,
                showlicha: false,
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
        let pmin: any = false, pmax: any = false;
        this.chart.datas.probability = (this.datas.pdcalcResult || []).map((item) => {
            rateList.push(item.yldRate);
            rightRateList.push(item.yldRate);
            const res = {
                rate: item.yldRate, //绘制横线
                per:  ((item.accumPr * 10000) | 0) / 10000, //概率分布值
                value: ((item.pr * 10000) | 0) / 10000 //绘制概率分布曲线
            }
            pmin = pmin === false ? res.value : Math.min(pmin, res.value);
            pmax = pmax === false ? res.value : Math.max(pmax, res.value);
            return res;
        })

        this.chart.datas.probability.pmin = pmin;
        this.chart.datas.probability.pmax = pmax;
        this.chart.datas.probability.paxisValueRange = ( ((pmax * 10000) | 0)- ((pmin * 10000) | 0) ) / 10000;

        rateList = this.chart.datas.rateList = rateList.sort((a, b) => {
            return a - b > 0 ? 1 : (a - b < 0 ? -1 : 0);
        });

        periodKeys = this.chart.datas.periodKeys = periodKeys.sort((a, b) => {
            return a - b > 0 ? 1 : (a - b < 0 ? -1 : 0);
        });

        rightRateList = this.chart.datas.rightRateList = rightRateList.sort((a, b) => {
            return a - b > 0 ? 1 : (a - b < 0 ? -1 : 0);
        });

        //概率分布收益率最小值
        const m = findRangAndStep(rateList[0], rateList[rateList.length - 1], 0.005, 10, false);
        this.chart.datas.probability.min = m[0];
        this.chart.datas.probability.max = m[1];
        const step = m[2];
        this.chart.datas.axisDatas = [];
        let r = m[0];
        while(r <= (m[1] + step)){
            this.chart.datas.axisDatas.push(r);
            r = (((r + m[2]) * 10000) | 0) / 10000;
        }
        this.chart.datas.axisValueRange = this.chart.datas.axisDatas[this.chart.datas.axisDatas.length - 1] - this.chart.datas.axisDatas[0];
    }

    //计算0坐标的位置
    private calculateZeroY() {
        const r = 0 - this.chart.datas.axisDatas[0];
        const axisDatas = this.chart.datas.axisDatas;
        if (r === 0){
            this.chart.datas.zeroY = this.chart.voffset + this.chart.height;
        } else {
            this.chart.datas.zeroY = ((r * (this.chart.height / (axisDatas[axisDatas.length - 1] - axisDatas[0]))) | 0 );
        }
        return this.chart.datas.zeroY;
    }

    //渲染坐标线
    private renderBaseCoordinateLines() {
        const rightRateList = this.chart.datas.rightRateList;
        const lineStyle = {
            stroke: 'rgba(215, 215, 215, 1)',
            lineWidth: 1
        };
        const zeroY = this.calculateZeroY();

        const leftLine = new zrender.Line({
            silent: true,
            shape: {
                x1: covertXs5(this.chart.hoffset),
                y1: covertXs5(this.chart.voffset),
                x2: covertXs5(this.chart.hoffset),
                y2: covertXs5(this.chart.voffset + this.chart.height)
            },
            style: lineStyle
        });
        const rightLine = new zrender.Line({
            silent: true,
            shape: {
                x1: covertXs5(this.chart.hoffset + this.chart.width),
                y1: covertXs5(this.chart.voffset),
                x2: covertXs5(this.chart.hoffset + this.chart.width),
                y2: covertXs5(this.chart.voffset + this.chart.height)
            },
            style: lineStyle
        });

        const bootomLine = new zrender.Line({
            silent: true,
            shape: {
                x1: covertXs5(this.chart.hoffset),
                y1: covertXs5(zeroY),
                x2: covertXs5(this.chart.hoffset + this.chart.width),
                y2: covertXs5(zeroY)
            },
            style: lineStyle
        });
        //计算中线坐标
        let r = rightRateList[0] -  this.chart.datas.probability.min;
        r = r * (this.chart.height / this.chart.datas.axisValueRange);
        r = r | 0;
        const middleLine = new zrender.Line({
            silent: true,
            shape: {
                x1: covertXs5(this.chart.hoffset + ((this.chart.width * this.chart.middlePos) | 0)),
                y1: covertXs5(this.chart.voffset),
                x2: covertXs5(this.chart.hoffset + ((this.chart.width * this.chart.middlePos) | 0)),
                y2: covertXs5(this.chart.voffset + this.chart.height - r)
            },
            style: {
                stroke: 'rgba(153, 153, 153, 1)',
                lineWidth: 4
            }
        });
        if (r > 0) {
            this.zr.add(new zrender.Line({
                silent: true,
                shape: {
                    x1: covertXs5(this.chart.hoffset + ((this.chart.width * this.chart.middlePos) | 0)),
                    y1: covertXs5(this.chart.voffset + this.chart.height - r),
                    x2: covertXs5(this.chart.hoffset + ((this.chart.width * this.chart.middlePos) | 0)),
                    y2: covertXs5(this.chart.voffset + this.chart.height)
                },
                style: {
                    stroke: 'rgba(153, 153, 153, 1)',
                    lineWidth: 4,
                    lineDash: [4, 4]
                }
            }));
        }

        //绘制标题
        const rateTitle = new zrender.Group();
        rateTitle.add(new zrender.Text({
            transform: [1, 1.5, 10, 1, 10, 150],
            style: {
                text: '收益率(Y)',
                fontSize: 12,
                textFill: 'rgba(0, 0, 0, 0.8)'
            },
            position: [ 10, 2],
            silent: true
        }));

        const periodTitle = new zrender.Group();
        periodTitle.add(new zrender.Text({
            style: {
                text: '期限 (T)',
                fontSize: 12,
                textFill: 'rgba(0, 0, 0, 0.8)'
            },
            position: [this.chart.hoffset + ((this.chart.width * this.chart.middlePos) | 0) + 30,
                this.chart.voffset + this.chart.height + 8],
            silent: true
        }));

        const perTitle = new zrender.Group();
        perTitle.add(new zrender.Text({
            style: {
                text: '概率分布',
                fontSize: 12,
                textFill: 'rgba(0, 0, 0, 0.8)'
            },
            position: [this.chart.hoffset + this.chart.width + 20, 2],
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
            stroke: 'rgba(215,215,215, 1)',
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
                    x = this.chart.hoffset;
                    r = (Math.abs(element - this.chart.datas.axisDatas[0]) * this.chart.height) / this.chart.datas.axisValueRange;
                    y = this.chart.height + this.chart.voffset - r;
                    path.moveTo(x, y);
                    path.lineTo(x - 5, y);
                    path.stroke();
                });
            }
        });
        this.zr.add(new leftYaxis());
    }

    //渲染刻度label
    private renderAxisLabel() {
        let x, y, r;
        const unit = this.chart.height / this.chart.datas.axisDatas.length;
        this.chart.datas.axisDatas.forEach( (element, index) => {
            x = this.chart.hoffset;
            r = (Math.abs(element - this.chart.datas.axisDatas[0]) * this.chart.height) / this.chart.datas.axisValueRange;
            y = this.chart.height + this.chart.voffset - r;
            this.zr.add(new zrender.Text({
                    style: {
                        text: formatLeftAxisLabel(element),
                        textAlign: 'center',
                        textVerticalAlign: 'middle',
                        fontSize: 12,
                        fontWeight: 'normal',
                        textFill: 'rgba(169, 169, 169, 1)'
                    },
                    position: [ x - 30, y],
                    silent: true
                })
            );
        });

    }

    //绘制期数收益率曲线
    private renderPeriodChart(){
        const lineStyle = {
            stroke: 'rgba(0,0,0,0.2)',
            lineWidth: 0.5
        };
        const zeroY = this.calculateZeroY();
        //绘制label
        const maxPeriod = this.chart.datas.periodKeys[this.chart.datas.periodKeys.length - 1];
        this.zr.add(new zrender.Text({
            style: {
                text: maxPeriod + 'Y',
                textAlign: 'center',
                textVerticalAlign: 'middle',
                fontSize: 12,
                fontWeight: 'normal',
                textFill: 'rgba(133, 80, 239, 0.5)'
            },
            position: [ covertXs5(this.chart.hoffset + ((this.chart.width * this.chart.middlePos) | 0)) , covertXs5(zeroY + 13)],
            silent: true
        }));

        //绘制线
        this.chart.datas.periods.forEach((element, index) => {
            if (element.showLine !== true){
                return;
            }
            const d = element.data;
            element.points = [];
            const uinit = ((this.chart.width * this.chart.middlePos) | 0) / (this.chart.datas.periodKeys.length - 1);
            let x, y, r;
            for (let i = 0; i < d.length; i++) {
                x = covertXs5(this.chart.hoffset + this.chart.datas.periodKeys.indexOf(d[i].period) * uinit);
                //求出 值对应的 刻度比例
                r = (Math.abs(d[i].value - this.chart.datas.axisDatas[0]) * this.chart.height) / this.chart.datas.axisValueRange;
                y = covertXs5(this.chart.height + this.chart.voffset - r);
                element.points.push([x, y]);
            }

            this.zr.add(new zrender.Polyline({
                style: {
                    stroke: this.colorList[index % 6],
                    lineWidth: element.showlicha ? 2 : 0.5
                },
                shape: {
                    points: element.points,
                    smooth: 'spline'
                }
            }))

            //添加圆点
            this.zr.add(new zrender.Circle({
                silent: true,
                shape: {
                    cx: element.points[element.points.length - 1][0],
                    cy:  element.points[element.points.length - 1][1],
                    r: 3
                },
                style: {
                    fill: element.showlicha ? 'rgba(0,0,0, 1)' : 'transparent',
                    stroke: 'rgba(0,0,0,1)',
                    lineWidth: 0.5
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
        datas.forEach(element => {
            // 计算横线标线坐标
            x = covertXs5(this.chart.hoffset);
            r = (Math.abs(element.rate - this.chart.datas.probability.min) * this.chart.height) / this.chart.datas.axisValueRange;
            y = covertXs5(this.chart.height + this.chart.voffset - r);
            element.hxPoint = {x: x, y: y};
            // 计算 概率曲线值坐标
             r = (Math.abs(element.value - this.chart.datas.probability.pmin) * ((this.chart.width * (0.7 - this.chart.middlePos))))
                / this.chart.datas.probability.paxisValueRange;
            x = covertXs5(this.chart.width + this.chart.hoffset - r);
            element.glPoint = {x: x, y: y};
        });


        //绘制水平标线
        const style = { lineWidth: 1, stroke: ''};
        const r3 = _d.length / 4;
        for (let i = 0; i < _d.length; i++) {
            style.stroke = 'rgba(256,256,256, 0)';
            let index = i;
            if ( (i % r3) === 0 || i === (_d.length - 1)) {
                style.stroke = 'rgba(236,236,236, 1)';
            }
            let hoverL = new zrender.Line({
                silent: false,
                shape: {
                    x1: this.chart.hoffset,
                    y1: _d[i].glPoint.y,
                    x2: this.chart.hoffset + this.chart.width,
                    y2: _d[i].glPoint.y
                },
                style: style
            });

            //定义利差线
            const lcLine = new zrender.Group();
            this.ngZone.runOutsideAngular(() => {
                hoverL.on('mouseover', (e, b) => {
                    const rateDesc = (((_d[i].rate * 10000) | 0) / 100) + '%';
                    const perDesc = (((_d[i].per * 10000) | 0) / 100) + '%';

                    $([this.showRateTipElRef.nativeElement, this.showPerTipElRef.nativeElement])
                        .removeClass('show')
                        .addClass('show').css('top', (_d[i].glPoint.y - 45) + 'px');
                        $(this.showRateTipElRef.nativeElement).find('.tooltip-inner')
                            .html('收益率' + '<span style="color:red;padding-left: 10px;"><h5 style="display: inline;">'
                                + rateDesc + '</h5></span>');
                        $(this.showPerTipElRef.nativeElement).find('.tooltip-inner')
                            .html('概率分布' + '<span style="color:red;padding-left: 10px;"><h5 style="display: inline;">' 
                                + perDesc + '</h5></span>');
                        hoverL.setStyle('stroke', 'rgba(236, 105, 65, 1)');
                        hoverL.setStyle('lineWidth', 2);

                        //更新备注说明
                        this.graphicDescElRef.innerText = '图形说明: 有'+ rateDesc +'概率次级收益率大于' + perDesc;

                        //添加利差提示信息
                        this.chart.datas.periods.forEach((element) => {
                            if (element.showlicha === true && element.showLine === true) {
                                const lvp = _d[i].rate - element.data[element.data.length - 1].value;
                                const endPoint = element.points[element.points.length - 1];
                                lcLine.add(new (new zrender.Path.extend({
                                    silent: false,
                                    style:{
                                        stroke: lvp >= 0 ? 'rgba(0, 0, 0, 1)' : 'rgba(236, 105, 65, 1)',
                                        lineWidth: 1,
                                        lineDash: [2, 2]
                                    },
                                    buildPath: (path, shape) => {
                                        const _x = this.chart.hoffset + ((this.chart.width * this.chart.middlePos) | 0);
                                        path.moveTo(_x + 25, endPoint[1]);
                                        path.lineTo(_x + 45, endPoint[1]);
                                        path.stroke();
                                        path.moveTo(_x + 40, endPoint[1]);
                                        path.lineTo(_x + 40, _d[i].glPoint.y);
                                        path.stroke();
                                    }
                                })));

                                lcLine.add(new zrender.Text({
                                    style:{
                                        text: '利差 ' + formatLeftAxisLabel(lvp),
                                        textAlign: 'left',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        textFill: lvp >= 0 ? 'rgba(0, 0, 0, 1)' : 'rgba(236, 105, 65, 1)'
                                    },
                                    position: [this.chart.hoffset + ((this.chart.width * this.chart.middlePos) | 0) + 50,
                                        endPoint[1] - (endPoint[1] - _d[i].glPoint.y) / 2]
                                }))
                            }
                        });

                }).on('mouseout', () => {
                    $([this.showRateTipElRef.nativeElement, this.showPerTipElRef.nativeElement]).removeClass('show');
                    hoverL.setStyle('stroke', ((index % r3) === 0 || (index === _d.length - 1)) ?
                     'rgba(236,236,236,1)' : 'rgba(256,256,256,0)');
                    hoverL.setStyle('lineWidth', 1);
                    this.graphicDescElRef.innerText = ' ';
                    lcLine.removeAll();
                });

            });
            this.zr.add(hoverL);
            this.zr.add(lcLine);
        }

        // 绘制概率分布曲线 _d.length
        const _points = _d.map((e) => {
            return [e.glPoint.x, e.glPoint.y];
        });
        _points.push([this.chart.hoffset + this.chart.width, _points[_points.length - 1][1]]);
        this.zr.add(new zrender.Polyline({
            shape:{
                smooth: 'spline',
                points: _points
            },
            style:{
                stroke: 'rgba(193,217,236,1)',
                lineWidth: 1.2,
                fill: 'rgba(232, 253, 255, 0.5)'
            }
        }));

        //绘制刻度及label
        const RightAxis = new zrender.Path.extend({
            type: 'rightAxis',
            silent: true,
            style: {
                stroke: 'rgba(215,215,215, 1)',
                lineWidth: 1
            },
            buildPath: (path, shape) => {
                for (let i = 0; i < _d.length; i++) {
                    if ( (i % r3) === 0 || i === (_d.length - 1)) {
                        path.moveTo(this.chart.hoffset + this.chart.width, _d[i].glPoint.y);
                        path.lineTo(this.chart.hoffset + this.chart.width + 5 , _d[i].glPoint.y);
                    }
                }
             }
        });
        this.zr.add(new RightAxis());

        for (let i = 0; i < _d.length; i++) {
            if ((i % r3) === 0 || i === (_d.length - 1)) {
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
                        position: [ this.chart.hoffset + this.chart.width + 35, _d[i].glPoint.y],
                        silent: true
                    })
                )
            }
        }

    }

    openDialog(){
        const dialogRef = this.dialog.open(CesuanParam, {
            width: '800px',
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            disableClose: true,
            data: {proposalId: this.proposalId}
          });

          dialogRef.afterClosed().subscribe( (data: any) => {
                console.log(JSON.stringify(data));
            })
    }
}