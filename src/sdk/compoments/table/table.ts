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
    AfterContentChecked } from '@angular/core';
import {
    CDK_TABLE_TEMPLATE,
    RowPlaceholder,
    HeaderRowPlaceholder,
    CdkColumnDef,
    CdkHeaderRowDef,
    CdkCellOutlet,
    CdkHeaderCellDef } from '@angular/cdk/table';

const TABLE_ERROR = {
    tableDuplicateColumnNameError: '存在多列名称重复错误',
    tableMissingRowDefsError: '未定义数据行、头',
    tableUnknownColumnError: '列名不存在'
};

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
export class MatExtTable implements OnInit, AfterContentChecked {

    //table head dom
    @ViewChild(RowPlaceholder) _rowPlaceholder: RowPlaceholder;

    //table body dom
    @ViewChild(HeaderRowPlaceholder) _headerRowPlaceholder: HeaderRowPlaceholder;

    //列定义
    @ContentChildren(CdkColumnDef) _contentColumnDefs: QueryList<CdkColumnDef>;

    //头显示列定义
    @ContentChild(CdkHeaderRowDef) _headerRowDef: CdkHeaderRowDef;

    private _columnDefsByName = new Map<string,  CdkColumnDef>();

    private _headerRowDefChanged = false;

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
    }

    //渲染表格
    ngAfterContentChecked(){
        this._cacheColumnDefs();

        if (!this._headerRowDef){
            throw new Error(TABLE_ERROR.tableMissingRowDefsError);
        }

        if (this._headerRowDefChanged) {
            this._renderHeaderRow();
            this._headerRowDefChanged = false;
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

    //渲染头
    private _renderHeaderRow(){
        //清楚表头信息
        if (this._headerRowPlaceholder.viewContainer.length > 0) {
            this._headerRowPlaceholder.viewContainer.clear();
        }
        
        const cells = this._getHeaderCellTemplatesForRow(this._headerRowDef);
        console.log('xxxxxxxxxxxxxxxxx');
        
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
}