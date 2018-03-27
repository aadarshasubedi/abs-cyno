import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PdcalsService } from '../service/pdcalc.service';
import { Router } from '@angular/router';
import { MessageService } from '../../../../sdk/services';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
    templateUrl: './main.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./main.scss']
})
export class MainComponent implements OnInit {
    //产品信息
    projectInfo: any = {};

    projectYieldRateData: any;

    constructor(
        private pdcalsService: PdcalsService,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        forkJoin(
            this.pdcalsService.getSecscommList('20180319329516'),
            this.pdcalsService.initPdCalsResult(null)
        ).subscribe((resps) => {
            this.projectInfo = resps[0];
            this.projectYieldRateData = resps[1];
        }, (error) => {
            this.messageService.alertError('加载数据错误');
        })
    }
}