import { 
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewChecked,
    ChangeDetectionStrategy,
    OnDestroy,
    NgZone,
    Input,
    Inject,
    ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { MatTableDataSource } from '@angular/material/table';

declare const echarts: any;

@Component({
    selector: 'bench-curveset',
    templateUrl: './bench.curveset.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BenchCurveset implements OnInit {

    datas;

    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    columns = ['periods', 'rateRefer', 'adjustCoef', 'rateBase'];

    private baseChartOption = {
        legend: {
            data: ['参考曲线', '基准曲线']
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {type: 'value'},
        series: [
            {
                name: '参考曲线',
                data: [],
                type: 'line',
                symbol: 'rect',
                showAllSymbol: true,
                symbolSize: 6
            },
            {
                name: '基准曲线',
                data: [],
                type: 'line',
                symbol: 'rect',
                showAllSymbol: true,
                symbolSize: 6
            }
        ]
    };

    chartOption;

    private updateSubject: Subject<any> = new Subject<any>();

    type: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) datas: any,
        private ngZone: NgZone,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.datas = datas.datas;
        this.type = datas.type;
     }

    ngOnInit(): void {
        const _d = this.datas.paraMap.BASE_PARA['CURVE_' + this.type];
        this.buildChartOption();
        this.buildSource();

        this.updateSubject.asObservable().pipe(debounceTime(500)).subscribe(() => {
            this.buildChartOption();
        })
    }

    private buildChartOption() {
        const _d: Array<any> = this.datas.paraMap.BASE_PARA['CURVE_' + this.type] || [];
        const xAxisData = this.baseChartOption.xAxis.data = [];
        const seriesData1 = this.baseChartOption.series[0].data = [];
        const seriesData2 = this.baseChartOption.series[1].data = [];
        _d.forEach(element => {
            xAxisData.push(element.periods);
            seriesData1.push((element.rateRefer * 100));
            element.rateBase = (element.rateRefer * (element.adjustCoef || 0 ));
            seriesData2.push(element.rateBase * 100);
        });

        this.chartOption = Object.assign({}, this.baseChartOption);
    }

    private buildSource() {
        this.dataSource.data = this.datas.paraMap.BASE_PARA['CURVE_' + this.type];
    }

    doUpdate() {
        this.updateSubject.next(true);
    }

}
