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
    selector: 'analyse-detail',
    templateUrl: './detail.html'
})
export class AnalyseDetail implements OnInit {

    poolId;

    staticPool: any = {};

    isShoLoading = true;

    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    datas = [];

    pageSize = 20;

    resultLength = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;

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
            this.statAssetPoolService.get(this.poolId),
            this.statAssetPoolService.getCynoStaticPoolDetail(this.poolId)
        ).pipe(
            catchError(() => {
                return of({$error: true});
            })
        ).subscribe((data: any) => {
            this.isShoLoading = false;
            if (data.$error === true) {
                return;
            }
            this.staticPool = data[0].list[0];
            this.datas = data[1].list || [];
            this._bind();
        });
    }

    private _bind() {
        merge(this.paginator.page).pipe(
            startWith(''),
            switchMap(() => {
                const pageSize = (this.paginator.pageSize || this.pageSize);
                const start = Math.min(this.paginator.pageIndex * pageSize, this.datas.length - 1);
                const _data = this.datas.slice(start, Math.min(start + pageSize, this.datas.length));
                this.resultLength = this.datas.length;
                return of({list: _data});
            })
        ).subscribe(data => this.dataSource.data = data.list);

    }
}
