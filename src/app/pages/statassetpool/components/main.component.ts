import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatTabGroup} from '@angular/material';
import { StatAssetPoolService } from '../service/statassetpool.service';
import { merge} from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';
import {of as observableOf} from 'rxjs/observable/of';
import {catchError} from 'rxjs/operators/catchError';
import {throttleTime} from 'rxjs/operators/throttleTime';
import { HttpParams} from '@angular/common/http';
import { MessageService } from '../../../../sdk/services';

@Component({
    selector: 'app-name',
    templateUrl: './main.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./main.scss']
})
export class MainComponent implements OnInit {

    toppingList;

    align;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    private searchSub: Subject<any> = new Subject<any>();

    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    resultLength = 0;

    constructor(
        private statAssetPoolService: StatAssetPoolService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {

        merge(this.paginator.page, this.searchSub.asObservable())
        .pipe(
            throttleTime(1000),
            startWith({total: 0, pageSize: 10, datas: []}),
            switchMap(() => {
                const t = [];
                for (let i = 0; i < 20; i++) {
                    t.push({code: '2872001', id: 'id' + (i + 1), name: '资产名称'});
                }
                return observableOf({
                    total: 100,
                    data: t
                });
            }),
            map(data => {
                this.resultLength = data.total;
                return data.data;
            }),

            catchError((error) => {
                this.messageService.alertError((error && error.expInfo) || '加载失败');
                return observableOf([]);
            })
        ).subscribe(data => this.dataSource.data = data);

    }
}
