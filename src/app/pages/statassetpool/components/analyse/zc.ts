import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatTabGroup} from '@angular/material';
import { StatAssetPoolService } from '../../service/statassetpool.service';
import { merge} from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';
import { of} from 'rxjs/observable/of';
import {catchError} from 'rxjs/operators/catchError';
import { debounceTime} from 'rxjs/operators/debounceTime';
import { HttpParams} from '@angular/common/http';
import { MessageService } from '../../../../../sdk/services';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { zip } from 'rxjs/observable/zip';
import { FormControl} from '@angular/forms';

@Component({
    selector: 'analyse-zc',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zc.html'
})
export class analyseZc implements OnInit {

    poolId: string;

    staticPoolInfo: any = {};

    chartOption1: any;

    chartOption2: any;

    dataSource2: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    chartOption3: any;

    dataSource3: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    isShoLoading = true;

    constructor(
        private statAssetPoolService: StatAssetPoolService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((data) => {
            this.poolId = data.id;
        });
        zip(
            this.statAssetPoolService.getPrepaymentRate(this.poolId),
            this.statAssetPoolService.getTotalWeightedPrepaymentRate(this.poolId),
            this.statAssetPoolService.getNewlyPrepaymentRate(this.poolId),
            this.statAssetPoolService.getStaticPoolInfo(this.poolId)
        ).pipe(
            catchError(() => {
                return of({$error: true});
            })
        ).subscribe((vs: any) => {
            if (vs.$error === true) {
                this.isShoLoading = false;
                this.messageService.alertError('数据初始化失败: 服务端发生异常');
                return;
            }
            this.buildPrepaymentRate(vs[0].list  || {});
            this.buildTotalWeightedPrepaymentRate(vs[1].list || {});
            this.buildNewlyPrepaymentRate(vs[2].list || {});
            this.staticPoolInfo = vs[3].detailInfo || {};
            this.changeDetectorRef.markForCheck();

            this.isShoLoading = false;
        });
    }

    buildPrepaymentRate(data: any) {
        const r = {
            title: {
                text: '历史累计早偿率',
                top: 10,
                left: 200
            },
            grid: {
                left: 50,
                top: 50,
                right: 30,
                borderWidth: 1
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            legend: {
                data: [],
                bottom: 10,
                left: 50,
                right: 30,
                padding: 1,
                type: 'scroll'
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisPointer: {
                    show: false
                },
                axisLabel: {
                    formatter: (value) => {
                        return (((value * 10000) | 0) / 100) + '%';
                    }
                }
            },
            series: []
        };
        const _xKeys = {};
        r.legend.data = [];
        r.series = [];
        r.xAxis.data = [];
        Object.keys(data).forEach((key) => {
            r.legend.data.push(key);
            let xLabel;
            const serie = {name: key + '', type: 'line', data: [], symbol: 'none'};
            for (let i = 0; i < data[key].length; i++) {
                xLabel = data[key][i].term + '';
                if (!_xKeys[ xLabel + '_key']) {
                    r.xAxis.data.push(xLabel);
                    _xKeys[ xLabel + '_key'] = true;
                }
                serie.data.push(data[key][i].totalrate);
            }
            r.series.push(serie);
        })
        this.chartOption1 = r;
    }

    private buildTotalWeightedPrepaymentRate(data: any) {
        const _data: any = [];
        this.chartOption2 = {
            title: {
                text: '加权累计早偿率',
                top: 10,
                left:  200
            },
            grid: {
                left: 50,
                top: 50,
                right: 50,
                bottom: 30,
                borderWidth: 1
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (value) => {
                        return (((value * 10000) | 0) / 100) + '%';
                    }
                }
            },
            series: [{type: 'line', data: [], symbol: 'none'}]
        }
        const xAxisData = this.chartOption2.xAxis.data;
        const seriesData = this.chartOption2.series[0].data;
        Object.keys(data).forEach((key) => {
            xAxisData.push(key);
            seriesData.push(data[key]);
            _data.push({term: key, rate: data[key]});
        });

        this.dataSource2.data = _data;
    }

    private buildNewlyPrepaymentRate(data: any) {
        const _data: any = [];
        this.chartOption3 = {
            title: {
                text: '加权新增早偿率',
                top: 10,
                left:  200
            },
            grid: {
                left: 50,
                top: 50,
                right: 50,
                bottom: 30,
                borderWidth: 1
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisPointer: {
                    show: false
                },
                axisLabel: {
                    formatter: (value) => {
                        return (((value * 10000) | 0) / 100) + '%';
                    }
                }
            },
            series: [{type: 'line', data: [], symbol: 'none'}]
        }
        const xAxisData = this.chartOption3.xAxis.data;
        const seriesData = this.chartOption3.series[0].data;
        Object.keys(data).forEach((key) => {
            xAxisData.push(key);
            seriesData.push(data[key]);
            _data.push({term: key, rate: data[key]});
        });
        this.dataSource3.data = _data;
    }

}
