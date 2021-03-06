import { Component, OnInit, ViewEncapsulation, ViewChild, Pipe, ElementRef } from '@angular/core';
import { PdcalsService } from '../service/pdcalc.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, LoadingService } from '../../../../sdk/services';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { merge} from 'rxjs/observable/merge';
import { MatTabGroup } from '@angular/material/tabs';
import {of as observableOf} from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';
import { catchError} from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { ChartIncomeRateComponent } from './chart/incomerate';
import { PressureSceMain } from './pressuresce/main';

@Component({
    templateUrl: './main.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./main.scss']
})
export class MainComponent implements OnInit {

    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    @ViewChild('exportReport') exportReport: ElementRef;

    @ViewChild(PressureSceMain) pressureSceMain: PressureSceMain;

    isLoading = false;

    proposalId: string;

    activeTabIndex = 0;

    selectTabIndex = 0;

    //产品信息
    projectInfo: any = {};

    projectYieldRateData: any;

    @ViewChild(ChartIncomeRateComponent) chartIncomeRateComponent: ChartIncomeRateComponent;

    _selectProposaIndex = 0;

    //测算类型
    initType: string = 'S';

    hasCustomerCesuan = false;

    defaultSecCode;

    constructor(
        private pdcalsService: PdcalsService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private loadingService: LoadingService
    ) {}

    //初始胡
    ngOnInit() {
        this.loadingService.showFull('加载中......');
        this.route.queryParams.subscribe( urlParam => {
            if (urlParam && urlParam._t === 'U') {
                this.initType = 'U';
            }
        })
        this.route.params.subscribe((data) => {
            this.proposalId = data.proposalId;
            this.activeTabIndex = data.type;
            this.selectTabIndex = this.activeTabIndex;
            this.defaultSecCode = data.secCode;
            if (data.initType) {
                this.initType = data.initType;
            }
        })
        this.chartIncomeRateComponent.selectProposaChange.subscribe((r) => {
            this._selectProposaIndex = r.index;
            if (!this.projectInfo) {
                return;
            }
            this.hasCustomerCesuan = r.hasCustomerCesuan;
            this.pdcalsService.initPdCalsResult(
                this.projectInfo.list[this._selectProposaIndex].securitiesId, this.proposalId,
                    r.hasCustomerCesuan, this.initType).subscribe((data) => {
                this.projectYieldRateData = data;
            });
        })

        this.tabGroup.selectedIndexChange.subscribe((index) => {
            this.selectTabIndex = index;
            if (this.selectTabIndex === 0){
                this.projectYieldRateData = Object.assign({}, this.projectYieldRateData || {});
            }
        })

        merge(this.route.params)
        .pipe(
            throttleTime(1000),
            switchMap(() => {
            return this.pdcalsService.getSecscommList(this.proposalId);
            }),
            switchMap((data: any) => {
                const r = !this.projectInfo.list;
                this.projectInfo = data;
                if (r){
                    this._selectProposaIndex = this.findCesuanLevelIndex(this.defaultSecCode);
                }
                return this.pdcalsService.initPdCalsResult(data.list[this._selectProposaIndex].securitiesId,
                    this.proposalId, this.hasCustomerCesuan, this.initType);
            }),
            map(data => data),
            catchError(() => {
                this.messageService.alertError('加载数据错误');
                return observableOf({});
            })
        ).subscribe(data => {
            this.projectYieldRateData = data;
            this.loadingService.close();
        });

    }

    previewReport(){
        const link = this.selectTabIndex > 0 ? '/cyno/cynoweb/prcalc/createPrReport.do' : '/cyno/cynoweb/pdcalc/createPdReport.do';
        this.exportReport.nativeElement.src = link + '?proposalId=' + this.proposalId + '&initType=' + this.initType;
    }

    get projInfoAttrs() {
        return this.projectInfo && this.projectInfo.projInfo && this.projectInfo.projInfo.arr;
    }

    private findCesuanLevelIndex(secId?: string) {
        const r: Array<any> = this.projectInfo.list || [];
        let k = r.filter(d => d.securitiesType === 'SRL_S');
        if (secId){
            k = r.filter(d => d.securitiesId === secId);
            if (k.length === 0){
                k = r.filter(d => d.securitiesType === 'SRL_S');
            }
        }
        return k.length > 0 ? r.indexOf(k[0]) : 0;
    }

    /**
     * 保存测算结果
     */
    savePdCalc() {
        this.loadingService.showFull('执行中.....');
        let r: any;
        //报错情景测算
        if (this.selectTabIndex > 0) {
            r = this.pdcalsService.savePrCalc(this.proposalId);
        } else {
            r = this.pdcalsService.savePdCalc(this.proposalId);
        }
        r.pipe(catchError(() => {
            this.messageService.alertError('操作失败: 服务端执行异常');
            return observableOf({$error: true});
        })).subscribe((data: any) => {
            this.loadingService.close();
            if (data.$error !== true){
                this.messageService.alertInfo('操作成功').afterClosed().subscribe(() => {
                    this.router.navigate(['/index/redirec-url'], {
                        queryParams: {
                            redirtUrl: '/index/pdcalc/pdcalc/' + this.proposalId
                            + '/' + (this.selectTabIndex || '0') + '/' + (this.defaultSecCode || '0') + '/' + (this.initType || 'U')
                        }
                    })
                });
            }
        })
    }

    //测算
    doPrCalcByPara(){
        try {
            this.loadingService.showFull('执行中.....');
            const r = this.pressureSceMain.getLastParams();
            this.pdcalsService.doPrCalcByPara(this.proposalId, r).pipe(catchError(() => {
            this.messageService.alertError('操作失败: 服务端执行异常');
            return observableOf({$error: true});
        })).subscribe((data: any) => {
            this.loadingService.close();
            if (data.$error === true){
                this.messageService.alertError('测算失败!');
                return;
            }
            this.pressureSceMain.setLastData(data);
            this.pressureSceMain._hasCustomerCesuan = true;
        });
        } catch(e) {
            this.messageService.alertError('测算失败!');
        }
    }
}