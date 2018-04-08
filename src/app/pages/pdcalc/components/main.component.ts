import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { PdcalsService } from '../service/pdcalc.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../../sdk/services';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { merge} from 'rxjs/observable/merge';
import {of as observableOf} from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';
import { catchError} from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { ChartIncomeRateComponent } from './chart/incomerate';

@Component({
    templateUrl: './main.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./main.scss']
})
export class MainComponent implements OnInit {

    proposalId: string;

    activeTabIndex = 0;

    //产品信息
    projectInfo: any = {};

    projectYieldRateData: any;

    @ViewChild(ChartIncomeRateComponent) chartIncomeRateComponent: ChartIncomeRateComponent;

    _selectProposaIndex = 0;

    constructor(
        private pdcalsService: PdcalsService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) { }

    //初始胡
    ngOnInit() {

        this.chartIncomeRateComponent.selectProposaChange.subscribe((i) => {
            this._selectProposaIndex = i;
            if (!this.projectInfo){
                return;
            }
            this.pdcalsService.initPdCalsResult(
                this.projectInfo.list[this._selectProposaIndex].securitiesId, this.proposalId).subscribe((data) => {
                this.projectYieldRateData = data;
            });
        })

        this.route.params.subscribe((data) => {
            this.proposalId = data.proposalId;
            this.activeTabIndex = data.type;
        })

        merge(this.route.params)
        .pipe(
            throttleTime(1000),
            switchMap(() => {
            return this.pdcalsService.getSecscommList(this.proposalId);
            }),
            switchMap((data: any) => {
                this.projectInfo = data;
                this._selectProposaIndex = this.findCesuanLevelIndex();
                return this.pdcalsService.initPdCalsResult(data.list[this._selectProposaIndex].securitiesId, this.proposalId);
            }),
            map(data => data),
            catchError(() => {
                this.messageService.alertError('加载数据错误');
                return observableOf({});
            })
        ).subscribe(data => this.projectYieldRateData = data);

    }

    get projInfoAttrs() {
        return this.projectInfo && this.projectInfo.projInfo && this.projectInfo.projInfo.arr;
    }

    private findCesuanLevelIndex(){
        const r: Array<any> = this.projectInfo.list || [];
        const k = r.filter(d => d.securitiesType === 'SRL_S');
        return k.length > 0 ? r.indexOf(k[0]) : 0;
    }
    
}