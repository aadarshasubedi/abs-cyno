import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PdcalsService } from '../service/pdcalc.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../../sdk/services';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { merge} from 'rxjs/observable/merge';
import {of as observableOf} from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';
import { catchError} from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
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

    constructor(
        private pdcalsService: PdcalsService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) { }

    //初始胡
    ngOnInit() {
        merge(this.route.params)
        .pipe(
            switchMap(data => {
            this.proposalId = data.proposalId;
            this.activeTabIndex = data.type || 0;
            return this.pdcalsService.getSecscommList(this.proposalId);
            }),
            switchMap((data: any) => {
                this.projectInfo = data;
                return this.pdcalsService.initPdCalsResult(data.list[2].securitiesId, this.proposalId);
            }),
            map(data => data),
            catchError(() => {
                this.messageService.alertError('加载数据错误');
                return observableOf({});
            })
        ).subscribe(data => this.projectYieldRateData = data);

    }
}