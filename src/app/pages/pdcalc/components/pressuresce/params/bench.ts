import { QueryList, Component, OnInit, ChangeDetectionStrategy,
    ViewEncapsulation, ViewChildren, AfterViewChecked, ChangeDetectorRef,
    SimpleChanges, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';
import { PdcalsService } from '../../../service/pdcalc.service';
import { MessageService } from '../../../../../../sdk/services';
import {catchError} from 'rxjs/operators/catchError';
import {of as observableOf} from 'rxjs/observable/of';
import { MatDialog } from '@angular/material/dialog';
import { BenchCurveset } from './bench.curveset';
import { Overlay } from '@angular/cdk/overlay';

@Component({
    selector: 'bench-param',
    templateUrl: './bench.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BenchParam implements OnInit, OnChanges {

    @Input() inputParams;

    @Input() proposalId;

    @Input() initType;

    @Output() paramsUpdate: EventEmitter<any> = new EventEmitter<any>(); 

    columns = [];

    payTypeList = [];

    dataSource = new MatTableDataSource([]);

    param: any = {};

    cacheParams: any;

    titles = {BG: '悲观', JZ: '基准', LG: '乐观'};

    cacheColumnMap: Map<string, any> = new Map<string, any>();

    cacheColumnTitle = {};

    private _init = false;

    constructor(
        private pdcalsService: PdcalsService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private overlay: Overlay
    ) { }

    ngOnInit(): void {
        this.render();
        this._init = true;

        this.pdcalsService.initParaCombox(this.proposalId, this.initType).subscribe((resp: any) => {
            this.payTypeList = resp.paraSources || [];
          },  (error) => {});

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this._init !== true) {
            return;
        }
        if ('inputParams' in changes){
            this.render();
        }
    }

    private render() {
        if (!this.inputParams){
            return;
        }
        this.cacheParams = this.inputParams;
        this.dataSource.data = this.converToTableData();
        this.changeDetectorRef.detectChanges();
    }

    onPayTypeChange(event) {
        const t = this.payTypeList.filter( r => r.PARA_SOURCE === event)[0];
        this.pdcalsService.getPrCalcParaById(this.proposalId, this.initType, event, t.POOL_ID).subscribe((resp: any) => {
            this.paramsUpdate.emit(resp.paraMap);
        }, (error) => {
            this.messageService.alertError(error.expInfo || '获取参数失败!');
        });

    }

    private converToTableData() {
        const data = this.cacheParams;
        const _data = data.paraMap.RATE_PARA.DATA;
        const _dataTitles = data.paraMap.RATE_PARA.TITLE;
        const titles = this.titles;
        this.cacheColumn();
        const _res = [];
        let r;
        Object.keys(_data).forEach((key) => {
            r = {scene: titles[key], sceneKey: key};
            for (let i = 0; i < _data[key].length; i++) {
                r['column' + i] = ((_data[key][i].rateValue * 10000) | 0 ) / 100;
            }
            _res.push(r);
        })
        
        this.param = {
            VALUE_D:  ((data.paraMap.BASE_PARA.VALUE_D * 10000) | 0) / 10000,
            VALUE_E:  ((data.paraMap.BASE_PARA.VALUE_E * 10000) | 0) / 10000,
            VALUE_R:  ((data.paraMap.BASE_PARA.VALUE_R * 10000) | 0) / 10000,
            PARA_TYPE: data.paraMap.BASE_PARA.PARA_TYPE,
            PER_VALUE_D:  ((data.paraMap.BASE_PARA.VALUE_D * 10000) | 0) / 100 + '%',
            PER_VALUE_E:  ((data.paraMap.BASE_PARA.VALUE_E * 10000) | 0) / 100 + '%',
            PER_VALUE_R:  ((data.paraMap.BASE_PARA.VALUE_R * 10000) | 0) / 100 + '%'
        };
        return _res;
    }

    private cacheColumn() {
        const data = this.cacheParams.paraMap.RATE_PARA.DATA;
        const title = this.cacheParams.paraMap.RATE_PARA.TITLE;
        this.columns = ['scene'];
        this.cacheColumnMap.clear();
        this.cacheColumnTitle = {scene: title[0]};
        data[Object.keys(data)[0]].forEach((item, index) => {
            this.cacheColumnMap.set('column' + index, index);
            this.columns.push('column' + index);
            this.cacheColumnTitle['column' + index] = title[index + 1];
        });
    }

    openSetting(type) {
        const dialogRef = this.dialog.open(BenchCurveset, {
            width: '900px',
            height: 'auto',
            data: {
                datas: this.cacheParams,
                type: type
            },
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        });

        dialogRef.afterClosed().subscribe((res) => {
            if (res !== true && this.cacheParams.paraMap.BASE_PARA['BAK_CURVE_' + type]) {
                this.cacheParams.paraMap.BASE_PARA['CURVE_' + type] = this.cacheParams.paraMap.BASE_PARA['BAK_CURVE_' + type];
            }
            console.log('xxxxxxxxxxxxxx');
            const bak = this.cacheParams.paraMap.BASE_PARA;
            bak['BAK_CURVE_' + type] = undefined;
            delete bak['BAK_CURVE_' + type];
            //更新累计违约率
            let r = 0;
            const d = this.cacheParams.paraMap.BASE_PARA['CURVE_' + type] || [];
            d.forEach(element => {
                r = r + element.rateBase;
            });
            this.cacheParams.paraMap['VALUE_' + type] = r;
            this.param['VALUE_' + type] = ((r * 10000) | 0 ) / 10000;
            this.param['PER_VALUE_' + type] = ((r * 10000) | 0 ) / 100 + '%';
            this.changeDetectorRef.markForCheck();
        })
    }
}
