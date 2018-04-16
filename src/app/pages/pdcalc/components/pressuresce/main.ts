import { QueryList, Component, OnInit, ChangeDetectionStrategy, Input,
    ViewEncapsulation, ViewChildren, AfterViewChecked, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { CdkColumnDef } from '@angular/cdk/table';
import { PdcalsService } from '../../service/pdcalc.service';
import { of as observableOf} from 'rxjs/observable/of';
import { catchError} from 'rxjs/operators/catchError';
import { MessageService } from '../../../../../sdk/services';

@Component({
    selector: 'pressuresce-main',
    templateUrl: './main.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./style.scss'],
    host: {
        'class': 'pressuresce-main'
    }
})
export class PressureSceMain implements OnInit, AfterViewChecked {

    @Input() proData: any;

    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    params: any;

    dataSource1: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    dataSource2: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    dataSource3: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    columns1 = ['prSceneCode', 'accumDefRate', 'accumEarlyRate', 'lgIrr', 'jzIrr', 'bgIrr'];

    columns2 = ['rateSceneCode', 'accumDefRate', 'accumEarlyRate', 'multipleR', 'irr'];

    @Input() proposalId: string;

    @Input() initType: string;

    morePrCalcExtres: any = {};

    selectedIndex;

    _init = false;

    get isSecondary() {
        return this.proData && this.proData.list && (this.selectedIndex === (this.proData.list.length - 1));
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private pdcalsService: PdcalsService,
        private messageService: MessageService,
    ) { }

    ngAfterViewChecked(){}

    ngOnInit(): void {
        this.pdcalsService.iniPressurescePage(this.proposalId, this.initType).pipe( catchError(() => {
            return observableOf({$error: true});
        }) ).subscribe((data: any) => {
            this._init = true;
            if (data.$error === true) {
                this.messageService.alertError('初始化默认情景参数失败: 服务端发生异常!');
                return;
            }
            this.selectedIndex = 0;
            this.params = data;
            this.renderClacResult();
            this.changeDetectorRef.detectChanges();
        });

        this.tabGroup.selectedIndexChange.subscribe((index) => {
            this.selectedIndex = index;
            if (this._init === true) {
                this.renderClacResult();
            }
        });
    }

    /**
     * 渲染测算结果
     */
    private renderClacResult() {
        const securitiesId = this.proData.list[this.selectedIndex].securitiesId;
        this.dataSource1.data = this.params.resultMap[securitiesId].scenes || [];
        this.dataSource2.data = this.params.resultMap[securitiesId].targetsIntPay || [];
        this.dataSource3.data = this.params.resultMap[securitiesId].targetsPrin || [];
    }

    /**
     * 处理更多结果
     */
    private renderMoreClacResult(){
        if (!this.params || !this.params.resultMap) {
            return;
        }
        const resultId = this.params.resultMap[this.proData.list[this.proData.list.length - 1].securitiesId].resultId;
        this.pdcalsService.getPrCalcExtres(resultId).pipe(catchError((dd) => {
            return observableOf({$error: true});
        })).subscribe((data: any) => {
            if (data.$error === true) {
                this.messageService.alertError('获取数据失败: 服务端发生异常!');
                return;
            }
            const _d = data.extresMap;
            const BG = this.morePrCalcExtres.BG = [];
            const JZ = this.morePrCalcExtres.JZ = [];
            const LG = this.morePrCalcExtres.LG = [];
            let r, r1;
            for (let i = 0; i < 16; i++) {
                r1 = new Number(((0.2 * i  * 100) | 0) / 100).toFixed(1);
                r = [r1].concat(_d.BG.slice(i * 16, (i + 1) * 16));
                BG.push(r);
                r = [r1].concat(_d.JZ.slice(i * 16, (i + 1) * 16));
                JZ.push(r);
                r = [r1].concat(_d.LG.slice(i * 16, (i + 1) * 16));
                LG.push(r);
            }

            this.changeDetectorRef.markForCheck();
        });
    }
}
