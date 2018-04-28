import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
    selector: 'analyse-main',
    templateUrl: './main.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./main.scss']
})
export class AnalyseMainComponent implements OnInit {

    staticPool: any = {};

    poolId;

    isShoLoading = true;

    constructor(
        private statAssetPoolService: StatAssetPoolService,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) {
        this.route.params.subscribe(param => this.poolId = param.id);
    }

    ngOnInit(): void {
        if (!this.poolId) {
            return;
        }
        zip(
            this.statAssetPoolService.getAssetTypes(),
            this.statAssetPoolService.querySponsorOrg(),
            this.statAssetPoolService.get(this.poolId)
        ).pipe(
            catchError(() => {
                return of({$error: true});
            })
        ).subscribe((datas: any) => {
            this.isShoLoading = false;
            if (datas.$error === true) {
                this.messageService.alertError('数据初始化失败!');
                return;
            }
            let r: any;
            const assetTypes = datas[0].assetTypes || [];
            const datasources = datas[1].sponsorOrgs || [];
            this.staticPool = datas[2].list[0];
            r = assetTypes.filter(item => item.paramCode === this.staticPool.assetType);
            this.staticPool.assetTypesName = r.length > 0 ? r[0].paramName : '';

            r = datasources.filter(item => item.institutionCode === this.staticPool.dataSource);
            this.staticPool.dataSourceName = r.length > 0 ? r[0].institutionName : '';
        })
    }
}
