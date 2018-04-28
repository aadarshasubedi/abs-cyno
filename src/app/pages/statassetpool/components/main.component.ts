import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatTabGroup} from '@angular/material';
import { StatAssetPoolService } from '../service/statassetpool.service';
import { merge} from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';
import { of} from 'rxjs/observable/of';
import {catchError} from 'rxjs/operators/catchError';
import { debounceTime} from 'rxjs/operators/debounceTime';
import { HttpParams} from '@angular/common/http';
import { MessageService } from '../../../../sdk/services';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { zip } from 'rxjs/observable/zip';
import { FormControl} from '@angular/forms';

@Component({
    selector: 'app-name',
    templateUrl: './main.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./main.scss']
})
export class MainComponent implements OnInit {

    //项目名称
    projectFormControl = new FormControl();

    projectLocalOptions = [];

    projectOptions = [];

    selectLocalProject;

    //静态池名称
    staticPoolControl = new FormControl();

    selectLocalStaticPool: any;

    staticpoolLocalOptions = [];

    staticpoolOptions = [];

    //资产类型
    assetTypeSource = [];

    assetTypeControl = new FormControl();

    //数据来源
    dataFromSource = [];

    dataFromControl = new FormControl();

    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    onAllSelectFormControl = new FormControl();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild('exportReport') exportReport: ElementRef;

    searchSub: Subject<any> = new Subject<any>();

    resultLength = 0;

    pageSize = 15;

    isShoLoading = false;

    constructor(
        private statAssetPoolService: StatAssetPoolService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {

        //项目名称 autoComplete 
        this.projectFormControl.valueChanges.pipe(debounceTime(50), map(v => v || '')).subscribe(v => this.filterProjectOptions(v));
        //静态池名称 autoComplete 
        this.staticPoolControl.valueChanges.pipe(debounceTime(50), map(v => v || '')).subscribe(v => this.filterStaticPoolOptions(v));

        //初始化模块数据
        this.isShoLoading = true;

        zip(
            this.statAssetPoolService.getAssetTypes(),
            this.statAssetPoolService.querySponsorOrg(),
        ).subscribe((vs) => {
            this.assetTypeSource = vs[0].assetTypes;
            this.dataFromSource = vs[1].sponsorOrgs;
            //初始化数据
            this.searchSub.next('');
        });

        //初始化表格数据
        merge(this.paginator.page, this.searchSub.asObservable())
        .pipe(
            debounceTime(1000),
            switchMap(() => {
                this.isShoLoading = true;
                return this.loadData();
            }),
            map(data => {
                this.resultLength = data.count;
                return data.list;
            }),
            catchError((error) => {
                this.messageService.alertError((error && error.expInfo) || '加载失败');
                return of([]);
            })
        ).subscribe((data) => {
            this.dataSource.data = (data || []).map((d) => {
                d.checkboxControl = new FormControl();
                return d;
            });
            this.isShoLoading = false;
        });
    }

    private filterProjectOptions(filterValue) {
        if (typeof filterValue !== 'string'){
            return;
        }
        const d = this.projectLocalOptions || [];
        filterValue = (filterValue || ' ').trim();
        const r = d.length > 0 ? of({list: d}) : this.statAssetPoolService.queryProjects();
        r.subscribe((data: any) => {
            this.projectLocalOptions = data.list || [];
            this.projectOptions = this.projectLocalOptions
                .filter(v => (!filterValue || v.projectShortName.indexOf(filterValue) > -1));
        });
    }

    private filterStaticPoolOptions(filterValue) {
        if (typeof filterValue !== 'string') {
            return;
        }
        const d = this.staticpoolLocalOptions || [];
        filterValue = (filterValue || ' ').trim();
        const r = d.length > 0 ? of({list: d}) : this.statAssetPoolService.queryStaticPool();
        r.subscribe((data: any) => {
            this.staticpoolLocalOptions = data.list || [];
            this.staticpoolOptions = this.staticpoolLocalOptions.filter(v => (!filterValue || v.poolName.indexOf(filterValue) > -1));
        });
    }

    private loadData(): Observable<any> {
        const params: any = {};
        const _fvalue = (control: FormControl, option: any, key: string) => {
            let v: any = control.value || '';
            if (control.invalid || (typeof v === 'string' && !v.trim()) || !option) {
                v = '';
            } else {
                v = option[key];
            }
            return v;
        }
        params.poolId = _fvalue(this.staticPoolControl, this.selectLocalStaticPool, 'poolId');
        params.projectId = _fvalue(this.projectFormControl, this.selectLocalProject, 'projectId');
        params.assetType = this.assetTypeControl.value || '';
        params.dataSource = this.dataFromControl.value || '';
        params.pageNo = this.paginator.pageIndex + 1 ;
        params.pageSize = this.paginator.pageSize || this.pageSize;
        return this.statAssetPoolService.list(params);
    }

    displayProjectWith() {
        return (option: any) => {
            this.selectLocalProject = option;
            return option ? option.projectShortName : undefined;
        }
    }

    displayStaticPoolautoWith() {
        return (option: any) => {
            this.selectLocalStaticPool = option;
            return option ? option.poolName : undefined;
        }
    }

    //验证项目名称表单
    formProjectValidator() {
        return (v) => {
            v = v || '';
            v = v.projectShortName ? v.projectShortName : v;
            if ((typeof v === 'string' && !v.trim()) ||
                (typeof v === 'string' && this.selectLocalProject && this.selectLocalProject.projectShortName === v)
            ) {
                return null;
            }
            return '请选择正确的项目';
        }
    }

     //验证项目名称表单
     formStaticPoolValidator() {
        return (v) => {
            v = v || '';
            v = v.poolName ? v.poolName : v;
            if ((typeof v === 'string' && !v.trim()) ||
                (typeof v === 'string' && this.selectLocalStaticPool && this.selectLocalStaticPool.poolName === v)
            ) {
                return null;
            }
            return '请选择正确的静态池';
        }
    }

    //重置
    resetSearch() {
        this.selectLocalProject = null;
        this.selectLocalStaticPool = null;
        this.projectFormControl.reset();
        this.staticPoolControl.reset();
        this.assetTypeControl.reset();
        this.dataFromControl.reset();
    }

    onAllSelect(value) {
        (this.dataSource.data || []).forEach((item) => {
            item.checkboxControl.setValue(value.checked);
            this.onAllSelectFormControl.setValue(value.checked);
        })
    }

    //批量删除
    deleteInBatch() {
        const _ids = (this.dataSource.data || []).filter(item => item.checkboxControl.value).map(item => item.poolId);
        if (_ids.length > 0) {
            this.messageService.confirm('确定删除吗?').afterClosed().subscribe((ok) => {
                if (ok ===  true){
                    this.statAssetPoolService.deleteByIds(_ids.join(',')).pipe(
                        catchError(() => {
                            return of({$error: true});
                        })
                    ).subscribe( (resp: any) => {
                        if (resp.$error === true){
                            this.messageService.alertError('操作失败:服务端发生异常');
                            return;
                        }
                        this.messageService.alertInfo('删除成功');
                        this.searchSub.next('');
                    } );
                }
            })
        }
    }
}
