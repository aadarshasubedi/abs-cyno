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
    selector: 'analyse-hg',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './hg.html'
})
export class analyseHg implements OnInit {

    poolId: string;

    dataSource1: MatTableDataSource<any> = new MatTableDataSource<any>([]);

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
        zip(this.statAssetPoolService.getRecoveryRate(this.poolId)).pipe(
            catchError(() => {
                return of({$error: true});
            })
        ).subscribe((vs: any) => {
            this.isShoLoading = false;
            if (vs.$error === true) {
                this.messageService.alertError('数据初始化失败: 服务端发生异常');
                return;
            }
            this.buildRecoveryRate(vs[0].list || []);
            this.isShoLoading = false;
            this.changeDetectorRef.markForCheck();
        });
    }

    private buildRecoveryRate(data: any) {
        if (data.length > 0) {
            const _data: any = [{}];
            data.forEach((item) => {
                _data[0][ 't' + item.term] = item.recoveryrate;
            });
            this.dataSource1.data = _data;
            return;
        }
        this.dataSource1.data = [];
    }
}
