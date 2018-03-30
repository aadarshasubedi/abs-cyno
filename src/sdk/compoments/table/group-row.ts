import { 
    Directive,
    TemplateRef,
    Component, 
    OnInit,
    ContentChild,
    AfterContentChecked,
    ViewChild,
    OnChanges,
    SimpleChanges,
    ViewContainerRef,
    OnDestroy,
    ViewChildren,
    ElementRef
} from '@angular/core';

import { JyCdkHeaderCellOutlet } from './row';


@Directive({
    selector: '[groupCellRowDef]',
    inputs: ['rows: groupCellRowDefRows']
})
export class GroupCellRowDef implements OnChanges {
  constructor(public template: TemplateRef<any>) {}

  rows: string[];

  ngOnChanges(changes: SimpleChanges){
    this.rows = changes['rows'].currentValue || [];
  }
}

@Directive({
    selector: '[groupCellRowCellOutlet]',
    exportAs: 'GroupCellRowCellOutlet'
})
export class GroupCellRowCellOutlet {
    constructor(public _viewContainer: ViewContainerRef){}
}

@Component({
    selector: 'group-row-cell',
    template: `
        <ng-container #groupCellRowCellOutlet="GroupCellRowCellOutlet" groupCellRowCellOutlet></ng-container>
    `,
    host: {
        'class': 'cdk-cell group-row-cell'
    }
})
export class GroupRowCell implements OnInit, AfterContentChecked, OnDestroy {

    @ContentChild(GroupCellRowDef) _contentGroupCellRowDef: GroupCellRowDef;

    @ViewChild('groupCellRowCellOutlet') groupCellRowCellOutlet: GroupCellRowCellOutlet;

    _changed = false;

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
        this._changed = true;
    }

    ngAfterContentChecked() {
        if (!this._changed) {
            return;
        }
        this._render();
        this.updateFlexBsic();
        this._changed = false;
    }

    private _render() {
        const datas = this._contentGroupCellRowDef.rows || [];
        datas.forEach((d) => {
            const context: any = {$implicit: d};
            this.groupCellRowCellOutlet._viewContainer.createEmbeddedView(this._contentGroupCellRowDef.template, context);
        });
    }

    ngOnDestroy() {
        this.groupCellRowCellOutlet._viewContainer.clear();
    }

    private updateFlexBsic() {
        //const el = this.elementRef.nativeElement;
        //el.style.flex = $(el).find('.group-cell').length;
    }
}