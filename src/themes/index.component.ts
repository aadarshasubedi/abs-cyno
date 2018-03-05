import { Component, OnInit } from '@angular/core';
import { transition_quickview } from './main/quickview/animation';
import { Action } from '../app/beans/Action';
import { ActionType } from '../app/beans/ActionType';
import { AppComponent } from '../app/app.component';

@Component({
    selector: 'app-index',
    template: `
        <app-header-component></app-header-component>
        <app-main-component></app-main-component>
        <app-quickview [@quickview]="quickviewStatus" (@quickview.done)="_onQuickviewAnimationDone()"></app-quickview>
    `,
    animations: [
      transition_quickview
    ]
})
export class IndexComponent implements OnInit {

    menu_collapse: Boolean = false;

    quickviewStatus: 'open' | 'close' = 'close';

    constructor(private appComponent: AppComponent) { }

    ngOnInit() {
        this.appComponent.action.subscribe((acction: Action) => {
            switch (acction.type) {
                case ActionType.MENU_COLLAPSE : this.chanageMenuCollapse(acction.data ? acction.data.status : null); break;
                case ActionType.MESSAGE_SHOW : this.chanagQuickViewCollapse(acction.data ? acction.data.status : null); break;
            }
        });
     }

    _onQuickviewAnimationDone() {}

    chanageMenuCollapse(status) {
        this.menu_collapse = typeof status === 'boolean' ? status : !this.menu_collapse;
        this.appComponent.elementRef.nativeElement.className = this.menu_collapse ? 'mini-sidebar-mode' : '';
    }

    chanagQuickViewCollapse(status?: 'open' | 'close' | 'trigger') {
        this.quickviewStatus =  (status === 'trigger') ? (this.quickviewStatus === 'open' ? 'close' : 'open') : (status || 'open');
    }
}