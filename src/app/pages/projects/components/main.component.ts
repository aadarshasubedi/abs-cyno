import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatTabGroup} from '@angular/material';
import { ProjectsService } from '../service/projects.service';
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
    templateUrl: './main.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./main.scss']
})
export class MainComponent implements OnInit {

    searchText: string;

    isLoadingResults = false;

    pageSize = 10;

    selectType = 0;

    resultsLength = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    searchSub: Subject<any> = new Subject<any>();

    dataSource: MatTableDataSource<any> = new MatTableDataSource();

    params: HttpParams;

    marketsLists: Array<any>;

    private _onProTypeFilter: Subject<any> = new Subject<any>();

    private __onForSponsorOrgFilter: Subject<any> = new Subject<any>();

    private _selectProTypes: any;

    _assertDatas: Array<any>;

    _sponsorOrgsDatas: Array<any>;

    private _selectSponsorOrgs: any;

    sortTag: any = false;

    constructor(
        private projectsService: ProjectsService,
        private router: Router,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef
    ) {  }

    ngOnInit() {

        this._loadMarkets();
        this._loadAssertTypes();
        this._loadSponsorOrgList();

        this.tabGroup.selectedIndexChange.subscribe((index) => {
            this.sortTag = false;
            this._resetParams();
            this.paginator.pageIndex = 0;
            this.selectType = index;
            this._selectProTypes = [];
            this._selectSponsorOrgs = [];
            //更新表格过滤选项的绑定数据: 从而解决重置选择的问题
            this._assertDatas = (this._assertDatas || []).map((r) => {
                return Object.assign({}, r);
            });
            this._sponsorOrgsDatas = (this._sponsorOrgsDatas || []).map((r) => {
                return Object.assign({}, r);
            });
        })

        this._onProTypeFilter.subscribe((dt) => {
            this._selectProTypes = dt;
        })

        this.__onForSponsorOrgFilter.subscribe((dt) => {
            this._selectSponsorOrgs = dt;
        })

        merge(
            this.searchSub.asObservable(),
            this.tabGroup.selectedIndexChange,
            this.paginator.page,
            this._onProTypeFilter,
            this.__onForSponsorOrgFilter)
        .pipe(
            throttleTime(1000),
            startWith({total: 0, pageSize: 10, datas: []}),
            switchMap(() => {
                this.isLoadingResults = true;
                this._mergeParam();
                return this.projectsService.getProjects(this.params);
            }),
            map(data => {
                this.isLoadingResults = false;
                this.resultsLength = data.count;
                return data.list;
            }),
            catchError((error) => {
                this.isLoadingResults = false;
                this.messageService.alertError((error && error.expInfo) || '加载产品数据失败');
                return observableOf([]);
            })
        ).subscribe(data => this.dataSource.data = data);
    }

    /**
     * 打开测算界面
     * @param type 0： 概率， 1：情景
     * @param project 项目
     */
    goToCs(type, project) {
        const queryParams: any = {};
        if (this.selectType === 0) {
            queryParams.queryParams = {
                _t: 'U'
            };
        }
        this.router.navigate(['index', 'pdcalc', 'pdcalc', project.proposalId, type], queryParams);
    }

    private _mergeParam() {
        this.params = new HttpParams({
            fromObject: {
                pageNo: (this.paginator.pageIndex + 1) + '',
                pageSize: (this.paginator.pageSize || this.pageSize) + '',
                issueMarket: this.selectType ? this.marketsLists[this.selectType - 1].paramCode : '',
                projectTypeList: (this._selectProTypes || []).join(','),
                sponsorOrgList: (this._selectSponsorOrgs || []).join(','),
                searchText: (this.searchText || '').trim(),
                valueDate: this.sortTag,
                sort: this.sortTag ? this.sortTag : ''
            }
        })
    }

    private _resetParams() {
        //this.params = new HttpParams();
    }

    private _loadMarkets() {
        this.projectsService.getMarkets().subscribe(
            (data: any) => {
                this.marketsLists = data.markets;
            }, (error: any) => {
                this.messageService.alertError((error && error.expInfo) || '初始化发布市场分类数据失败');
            } 
        )
    }

    private _loadAssertTypes() {
        this.projectsService.getAssetTypes().subscribe((data: any) => {
            this._assertDatas = data.assetTypes;
        }, (error: any) => {
            this.messageService.alertError((error && error.expInfo) || '初始化数据失败');
        } )
    }

    private _loadSponsorOrgList() {
        this.projectsService.getSponsorOrg().subscribe((data: any) => {
            this._sponsorOrgsDatas = data.sponsorOrgs;
        }, (error: any) => {
            this.messageService.alertError((error && error.expInfo) || '初始化数据失败');
        } )
    }

    addToFavorites(item) {
        this.isLoadingResults = true;
        this.projectsService.addToFavorites(item.proposalId).pipe(catchError((error) => {
            this.isLoadingResults = false;
            this.messageService.alertError((error && error.expInfo) || '添加关注失败');
            return observableOf([]);
        } )).subscribe((data) => {
            this.isLoadingResults = false;
            item.isFavorites = 'Y';
        });
    }

    onFilterForProTypeChange(list){
        this._onProTypeFilter.next(list);
    }

    onFilterForSponsorOrgChange(list){
        this.__onForSponsorOrgFilter.next(list);
    }

    doSearch(){
        this.searchSub.next(true);
    }

    handlerSort() {
        this.sortTag = this.sortTag ? ( this.sortTag === 'asc' ? 'desc' : 'asc') : 'asc';
        this.searchSub.next(true);
    }
}