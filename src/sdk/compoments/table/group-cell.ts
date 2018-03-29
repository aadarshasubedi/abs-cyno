import {
    Directive,
    Component,
    OnInit,
    ViewChild,
    ContentChildren,
    QueryList,
    TemplateRef,
    AfterContentChecked,
    ViewContainerRef,
    ElementRef
} from '@angular/core';

import { JyCdkRow } from './row';

@Directive({
    selector: '[groupCellOutlet]',
    exportAs: 'GroupCellOutlet'
})
export class GroupCellOutlet {
    constructor(public _viewContainer: ViewContainerRef){}
}

@Component({
    selector: 'group-cell',
    template: `
        <ng-template #cellvalue><ng-content></ng-content></ng-template>
        <ng-container #titleGroupCellOutlet="GroupCellOutlet" groupCellOutlet></ng-container>
        <jycdk-row #groupCellRow style="display: none;"></jycdk-row>
    `,
    host: {
        'class': 'cdk-cell group-cell'
    }
})
export class GroupCell implements OnInit, AfterContentChecked {

    @ContentChildren(GroupCell) childGroupCells: QueryList<GroupCell>;

    @ViewChild('groupCellRow') groupCellRow: JyCdkRow;

    @ViewChild('cellvalue') cellvalue: TemplateRef<any>;

    @ViewChild('titleGroupCellOutlet') titleGroupCellOutlet: GroupCellOutlet;

    _changed = false;

    constructor(
        private elementRef: ElementRef,
        private viewContainerRef: ViewContainerRef
    ) { }

    ngOnInit() {
        this._changed = true;
    }

    ngAfterContentChecked(){
        if (!this._changed){
            return;
        }
        this.groupCellRow.outlet._viewContainer.clear();
        const r = this.childGroupCells || [];
        if (r.length > 1) {
            this.groupCellRow.outlet._viewContainer.createEmbeddedView(this.cellvalue);
            this.groupCellRow.el.nativeElement.style.display = '';
        } else {
            this.titleGroupCellOutlet._viewContainer.createEmbeddedView(this.cellvalue);
            this.groupCellRow.el.nativeElement.style.display = 'none';
        }

        //this.updateFlexBsic();
        this._changed = false;
    }

    // private updateFlexBsic(){
    //     const count = (this.childGroupCells || []).length;
    //     this.elementRef.nativeElement.style.flex = '' + (count > 1 ? (count - 1) : 1);
    // }
}