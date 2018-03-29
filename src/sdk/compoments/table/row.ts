import {
    Directive,
    Component, 
    OnInit, 
    ChangeDetectionStrategy, 
    ViewEncapsulation,
    ViewContainerRef,
    ElementRef,
    ViewChild } from '@angular/core';
import {
    CDK_ROW_TEMPLATE ,
    RowPlaceholder,
    HeaderRowPlaceholder,
    CdkColumnDef,
    CdkHeaderRowDef,
    CdkCellOutlet,
    CdkHeaderCellDef,
    CdkHeaderRow,
    CdkCellDef,
    CdkHeaderCell} from '@angular/cdk/table';

@Directive({selector: '[jyCdkHeaderCellOutlet]'})
export class JyCdkHeaderCellOutlet {
    static currentCellOutlet: JyCdkHeaderCellOutlet;
    constructor(public _viewContainer: ViewContainerRef) {
        JyCdkHeaderCellOutlet.currentCellOutlet = this;
    }
}

//重写cdk-header-row
@Component({
    moduleId: module.id,
    selector: 'jycdk-header-row',
    template: '<ng-container jyCdkHeaderCellOutlet></ng-container>',
    host: {
      'class': 'cdk-header-row',
      'role': 'row'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
  })
export class JyCdkHeaderRow { 

    constructor(public el: ElementRef){}

    @ViewChild(JyCdkHeaderCellOutlet) outlet: JyCdkHeaderCellOutlet;

}

//重写cdk-row
@Component({
    moduleId: module.id,
    selector: 'jycdk-row',
    template: '<ng-container jyCdkHeaderCellOutlet></ng-container>',
    host: {
      'class': 'cdk-row',
      'role': 'row'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
  })
export class JyCdkRow { 
    constructor(public el: ElementRef){}
    @ViewChild(JyCdkHeaderCellOutlet) outlet: JyCdkHeaderCellOutlet;

}


@Component({
    moduleId: module.id,
    selector: 'jycdk-group-row',
    template: '<ng-content></ng-content>',
    host: {
      'class': 'cdk-row jycdk-group-row',
      'role': 'row'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
  })
export class JyCdkGroupRow { 
    constructor(public el: ElementRef){}

}