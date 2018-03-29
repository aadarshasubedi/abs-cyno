import {
    IterableDiffers,
    ChangeDetectorRef,
    ElementRef,
    Attribute,
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ViewChild,
    ContentChildren,
    QueryList,
    ContentChild,
    IterableDiffer,
    TrackByFunction,
    Input,
    IterableChangeRecord,
    EmbeddedViewRef,
    OnDestroy,
    AfterContentChecked } from '@angular/core';
import {
    CDK_TABLE_TEMPLATE,
    RowPlaceholder,
    HeaderRowPlaceholder,
    CdkColumnDef,
    CdkHeaderRowDef,
    CdkCellOutlet,
    CdkHeaderCellDef,
    CdkRowDef,
    CdkCellOutletRowContext,
    CdkCellDef
} from '@angular/cdk/table';

import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { of as observableOf} from 'rxjs/observable/of';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {Subject} from 'rxjs/Subject';

const TABLE_ERROR = {
    tableDuplicateColumnNameError: '存在多列名称重复错误',
    tableMissingRowDefsError: '未定义数据行、头',
    tableUnknownColumnError: '列名不存在',
    tableUnknownDataRowError: '为获取可用数据行模板'
};

abstract class RowViewRef<T> extends EmbeddedViewRef<CdkCellOutletRowContext<T>> { }

/** 
 * 扩展material/table新特性: 行分组、列分组
 * 
*/
@Component({
    moduleId: module.id,
    selector: 'mat-ext-table',
    template: CDK_TABLE_TEMPLATE,
    exportAs: 'MatExtTable',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./table.scss'],
    host: {
        'class': 'mat-table mat-ext-table'
    }
})
export class MatExtTable implements CollectionViewer, OnInit, AfterContentChecked, OnDestroy{

    @Input() _data: any[];

    private _dataSource: DataSource<any> | Observable<any[]> | any[] | any[];

    @Input()
    get dataSource(): DataSource<any> | Observable<any[]> | any[] { return this._dataSource; }
    set dataSource(dataSource: DataSource<any> | Observable<any[]> | any[]) {
        if (this._dataSource !== dataSource) {
            this._switchDataSource(dataSource);
        }
    }

    private _trackByFn: TrackByFunction<any>;

    @Input()
    get trackBy(): TrackByFunction<any> { return this._trackByFn; }
    set trackBy(fn: TrackByFunction<any>) {
        this._trackByFn = fn;
    }

    //table head dom
    @ViewChild(RowPlaceholder) _rowPlaceholder: RowPlaceholder;

    //table body dom
    @ViewChild(HeaderRowPlaceholder) _headerRowPlaceholder: HeaderRowPlaceholder;

    //列定义
    @ContentChildren(CdkColumnDef) _contentColumnDefs: QueryList<CdkColumnDef>;

    //头显示列定义
    @ContentChild(CdkHeaderRowDef) _headerRowDef: CdkHeaderRowDef;

    //收集所有的CdkRow
    @ContentChildren(CdkRowDef) _contentRowDefs: QueryList<CdkRowDef<any>>;

    _defaultRowDef: CdkRowDef<any>;

    private _columnDefsByName = new Map<string,  CdkColumnDef>();

    private _headerRowDefChanged = false;

    private _dataDiffer: IterableDiffer<any>;

    private _renderChangeSubscription: Subscription | null;

    private _onDestroy = new Subject<void>();

    viewChange: BehaviorSubject<{start: number, end: number}> =
      new BehaviorSubject<{start: number, end: number}>({start: 0, end: Number.MAX_VALUE});

    constructor(
        private readonly _differs: IterableDiffers,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        elementRef: ElementRef,
        @Attribute('role') role: string) {
        if (!role) {
            elementRef.nativeElement.setAttribute('role', 'ext-grid');
        }
    }

    ngOnInit() { 
        if (this._headerRowDef){
            this._headerRowDefChanged = true;
        }
        this._dataDiffer = this._differs.find([]).create(this._trackByFn);
    }

    //渲染表格
    ngAfterContentChecked() {
        this._cacheColumnDefs();
        this._cacheRowDefs();
        if (!this._headerRowDef){
            throw new Error(TABLE_ERROR.tableMissingRowDefsError);
        }

        this.updateDataColumns();

        if (this._headerRowDefChanged) {
            this._renderHeaderRow();
            this._headerRowDefChanged = false;
        }

        this._observeRenderChanges();
    }

    //更新表格列结构
    private updateDataColumns(){
        if (this._defaultRowDef.getColumnsDiff()){
            this._dataDiffer.diff([]);
            this._rowPlaceholder.viewContainer.clear();
            this._renderRows();
        }

        if (this._headerRowDef && this._headerRowDef.getColumnsDiff()) {
            this._renderHeaderRow();
        }
    }
    //格式化并缓存列配置信息
    private _cacheColumnDefs() {
        this._columnDefsByName.clear();
        const columnDefs = this._contentColumnDefs ? this._contentColumnDefs.toArray() : [];
        columnDefs.forEach(columnDef => {
            if (this._columnDefsByName.has(columnDef.name)) {
            throw new Error(TABLE_ERROR.tableDuplicateColumnNameError + '('+ columnDef.name +')');
            }
            this._columnDefsByName.set(columnDef.name, columnDef);
        });
    }

    //过滤cdk data row
    private _cacheRowDefs() {
        let r = this._contentRowDefs ? this._contentRowDefs.toArray() : [];
        r = r.filter(def => !def.when);
        if (r.length === 0){
            throw new Error(TABLE_ERROR.tableUnknownDataRowError);
        }
        this._defaultRowDef = r[0];
    }

    //渲染头
    private _renderHeaderRow(){
        //清楚表头信息
        if (this._headerRowPlaceholder.viewContainer.length > 0) {
            this._headerRowPlaceholder.viewContainer.clear();
        }
        
        const cells = this._getHeaderCellTemplatesForRow(this._headerRowDef);

        if (!cells.length) { return; }
        //添加header row
        this._headerRowPlaceholder.viewContainer.createEmbeddedView(this._headerRowDef.template, {cells});
        //添加header row cell
        cells.forEach((cell, index) => {
            if (CdkCellOutlet.mostRecentCellOutlet) {
                CdkCellOutlet.mostRecentCellOutlet._viewContainer.createEmbeddedView(cell.template, {});
            }
        })

        this._changeDetectorRef.markForCheck();
    }

    private _renderRows(){
        const changes = this._dataDiffer.diff(this._data);
        if (!changes){
            return;
        }
        //渲染
        const viewContainer = this._rowPlaceholder.viewContainer;
        changes.forEachOperation( (record: IterableChangeRecord<any>, adjustedPreviousIndex: number, currentIndex: number) => {
            if (record.previousIndex == null) {//新增
                this._insertRow(record.item, currentIndex);
            } else if (currentIndex == null) { //删除
                viewContainer.remove(adjustedPreviousIndex);
            } else {//修改
                const view = <RowViewRef<any>>viewContainer.get(adjustedPreviousIndex);
                viewContainer.move(view!, currentIndex);
            }
        })
        this._updateRowIndexContext();

        changes.forEachIdentityChange((record: IterableChangeRecord<any>) => {
            const rowView = <RowViewRef<any>>viewContainer.get(record.currentIndex!);
            rowView.context.$implicit = record.item;
        });
    }

    private _insertRow(rowData, index){
        const row  = this._defaultRowDef;
        const context: any = {$implicit: rowData};
        this._rowPlaceholder.viewContainer.createEmbeddedView(row.template, context, index);
        this._getCellTemplatesForRow(row).forEach(cell => {
            if (CdkCellOutlet.mostRecentCellOutlet) {
                context.$row = {
                    index: index,
                    num: (index + 1),
                    even: index % 2 === 0,
                    first: index === 0
                };
              CdkCellOutlet.mostRecentCellOutlet._viewContainer.createEmbeddedView(cell.template, context);
            }
          });

    }

    private _getHeaderCellTemplatesForRow(headerDef: CdkHeaderRowDef): CdkHeaderCellDef[] {
        if (!headerDef || !headerDef.columns) { return []; }
        return headerDef.columns.map(columnId => {
          const column = this._columnDefsByName.get(columnId);
    
          if (!column) {
            throw new Error(TABLE_ERROR.tableUnknownColumnError + '(' + columnId + ')');
          }
            return column.headerCell;
        });
      }

    //格式化datasource
    private _switchDataSource(dataSource: DataSource<any> | Observable<any[]> | any[]) {
        this._data = [];
        if (this.dataSource instanceof DataSource) {
            this.dataSource.disconnect(this);
        }
        if (this._renderChangeSubscription) {
            this._renderChangeSubscription.unsubscribe();
            this._renderChangeSubscription = null;
        }
        if (!dataSource) {
            if (this._dataDiffer) {
                this._dataDiffer.diff([]);
            }
            this._rowPlaceholder.viewContainer.clear();
        }
        this._dataSource = dataSource;
      }

      private _getCellTemplatesForRow(rowDef: CdkRowDef<any>): CdkCellDef[] {
        if (!rowDef.columns) { return []; }
        return rowDef.columns.map(columnId => {
          const column = this._columnDefsByName.get(columnId);

          if (!column) {
            throw new Error( TABLE_ERROR.tableUnknownColumnError + '(' + columnId + ')' );
          }
          return column.cell;
        });
      }


      private _observeRenderChanges() {
        if (!this.dataSource) { return; }
        let dataStream: Observable<any[]> | undefined;

        if ((this.dataSource as DataSource<any>).connect  instanceof Function) {
          dataStream = (this.dataSource as DataSource<any>).connect(this);
        } else if (this.dataSource instanceof Observable) {
          dataStream = this.dataSource;
        } else if (Array.isArray(this.dataSource)) {
          dataStream = observableOf(this.dataSource);
        }
        this._renderChangeSubscription = dataStream
            .pipe(takeUntil(this._onDestroy))
            .subscribe(data => {
              this._data = data;
              this._renderRows();
            });
      }

      ngOnDestroy() {
        this._rowPlaceholder.viewContainer.clear();
        this._headerRowPlaceholder.viewContainer.clear();
        this._onDestroy.next();
        this._onDestroy.complete();
        if (this.dataSource instanceof DataSource) {
          this.dataSource.disconnect(this);
        }
      }

    private _updateRowIndexContext() {
        const viewContainer = this._rowPlaceholder.viewContainer;
        for (let index = 0, count = viewContainer.length; index < count; index++) {
          const viewRef = viewContainer.get(index) as RowViewRef<any>;
          viewRef.context.index = index;
          viewRef.context.count = count;
          viewRef.context.first = index === 0;
          viewRef.context.last = index === count - 1;
          viewRef.context.even = index % 2 === 0;
          viewRef.context.odd = !viewRef.context.even;
        }
      }
}