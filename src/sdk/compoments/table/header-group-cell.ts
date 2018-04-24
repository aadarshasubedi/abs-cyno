import {
    Component,
    OnInit,
    ElementRef,
    AfterContentChecked,
    ContentChildren,
    ContentChild,
    QueryList,
    Input,
    ViewChild,
    ViewChildren,
    Optional,
    SkipSelf,
    ChangeDetectorRef,
    ViewContainerRef,
    Directive,
    TemplateRef
} from '@angular/core';
import {
    CDK_TABLE_TEMPLATE,
    RowPlaceholder,
    HeaderRowPlaceholder,
    CdkColumnDef,
    CdkHeaderRowDef,
    CdkCellOutlet,
    CdkHeaderCellDef,
    CdkHeaderRow,
    CdkCellDef,
    CdkHeaderCell} from '@angular/cdk/table';
import { JyCdkHeaderRow } from './row';

@Directive({
    selector: '[headerGroupCellOutlet]',
    exportAs: 'HeaderGroupCellOutlet'
})
export class HeaderGroupCellOutlet {
    constructor(public _viewContainer: ViewContainerRef){}
}

@Component({
    selector: 'header-group-cell',
    template: `
        
        <ng-template #hasGroupTitle><cdk-header-cell style="text-align: center;color:inherit;font-weight:inherit;">
        {{title}}</cdk-header-cell></ng-template>
        <ng-template #noGroupTitle>{{title}}<ng-content select="div.header-group-cell-content"></ng-content></ng-template>
        <ng-template #chiledGroup><ng-content></ng-content></ng-template>
        <ng-container #titleGroupCellOutlet="HeaderGroupCellOutlet" headerGroupCellOutlet></ng-container>
        <jycdk-header-row #titleRow style="display: none;"></jycdk-header-row>
        <jycdk-header-row #groupRow style="display: none;"></jycdk-header-row>
    `,
    host: {
        'class': 'cdk-header-cell header-group-cell'
    }
})
export class HeaderGroupCell extends CdkHeaderCell  implements OnInit, AfterContentChecked {

    @ViewChild('hasGroupTitle') groupTitleTpl: TemplateRef<any>;

    @ViewChild('noGroupTitle') noGroupTitleTpl: TemplateRef<any>;

    @ViewChild('chiledGroup') chiledGroupTpl: TemplateRef<any>;

    @ViewChild('titleRow') titleRow: JyCdkHeaderRow;

    @ViewChild('groupRow') groupRow: JyCdkHeaderRow;

    @ViewChild('titleGroupCellOutlet') noGroupTitleOutlet: HeaderGroupCellOutlet;

    @ContentChildren(HeaderGroupCell) childGroups: QueryList<HeaderGroupCell>;

    @Input() title: string;
    _changed = false;

    constructor(
        //@Optional() @SkipSelf() pHeaderGroupCell: HeaderGroupCell,
        columnDef: CdkColumnDef,
        public elementRef: ElementRef,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private viewRef: ViewContainerRef
    ) {
        super(columnDef, elementRef);
    }

    hasChildGroup() {
       return this.childGroups && this.childGroups.length > 1;
    }

    ngOnInit() {
        this._changed = true;
    }

    ngAfterContentChecked() {
        if (!this._changed){
            return;
        }
        this.titleRow.outlet._viewContainer.clear();
        this.noGroupTitleOutlet._viewContainer.clear();
        this.groupRow.outlet._viewContainer.clear();

        this.renderTitle();
        //this.updateFlexBsic();
        this._changed = false;
    }

    private renderTitle() {
        if (this.childGroups.length > 1) {
            this.titleRow.el.nativeElement.style.display = '';
            this.groupRow.el.nativeElement.style.display = '';
            this.titleRow.outlet._viewContainer.createEmbeddedView(this.groupTitleTpl);
            //渲染子标题
            this.groupRow.outlet._viewContainer.createEmbeddedView(this.chiledGroupTpl);

        } else {
            this.noGroupTitleOutlet._viewContainer.createEmbeddedView(this.noGroupTitleTpl);
            this.titleRow.el.nativeElement.style.display = 'none';
            this.groupRow.el.nativeElement.style.display = 'none';
        }
    }

    // private updateFlexBsic(){
    //     const count = (this.childGroups || []).length;
    //     this.elementRef.nativeElement.style.flex = '' + (count > 1 ? (count - 1) : 1);
    // }

}