import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatTabGroup} from '@angular/material';
import { ProjectsService } from '../service/projects.service';
import { merge} from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import {of as observableOf} from 'rxjs/observable/of';
import {catchError} from 'rxjs/operators/catchError';

const ELEMENT_DATA: any[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
    {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
    {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
    {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
    {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
    {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
    {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
    {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
    {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
    {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
    {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'}
  ];

@Component({
    templateUrl: './main.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./main.scss']
})
export class MainComponent implements OnInit {

    isLoadingResults = false;

    pageSize = 10;

    selectType = 0;

    resultsLength = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    dataSource: MatTableDataSource<any> = new MatTableDataSource();

    params: Map<string, any>;

    constructor(private projectsService: ProjectsService, private router: Router) { }

    ngOnInit() {

        this.tabGroup.selectedIndexChange.subscribe((index) => {
            this.params.clear();
            this.paginator.pageIndex = 0;
            this.selectType = index;
        })

        merge(this.tabGroup.selectedIndexChange, this.paginator.page)
        .pipe(
            startWith({total: 0, pageSize: 10, datas: []}),
            switchMap(() => {
                this.isLoadingResults = true;
                this._mergeParam();
                return this.projectsService.getProjects(this.params);
            }),
            map(data => {
                this.isLoadingResults = false;
                this.resultsLength = data.total;
                return data.list;
            }),
            catchError(() => {
                this.isLoadingResults = false;
                return observableOf([]);
            })
        ).subscribe(data => this.dataSource.data = data);
    }

    /**
     * 打开测算界面
     * @param type 0： 概率， 1：情景
     * @param project 项目
     */
    goToCs(type, project){
        this.router.navigate(['index', 'pdcalc', 'pdcalc', project.proposalId, type]);
    }

    private _mergeParam(){
        const params = this.params || (this.params = new Map<string, any>());
        params.set('pageIndex', this.paginator.pageIndex);
        params.set('pageSize', this.paginator.pageSize);
        params.set('selectType', this.selectType);
    }

    private _resetParams() {
        this.params = new Map<string, string>();
    }
}