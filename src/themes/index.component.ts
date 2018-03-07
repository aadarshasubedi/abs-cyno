import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { Action } from '../app/beans/Action';
import { ActionType } from '../app/beans/ActionType';
import { AppComponent } from '../app/app.component';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

declare let $: any;

@Component({
    selector: 'app-index',
    templateUrl: `./index.component.html`
})
export class IndexComponent implements OnInit {

    private unsubscribeScroll: any;

    _scrolled: Boolean = false;

    constructor(
        private appComponent: AppComponent,
        private scrollDispatcher: ScrollDispatcher,
        private checkRef: ChangeDetectorRef,
        private _ngZone: NgZone
    ) { }

    ngOnInit() {
        this.unsubscribeScroll = this.unsubscribeScroll = this.scrollDispatcher.scrolled(200).subscribe(() => {
            this.updateScrollStatus();
         });
     }

     private updateScrollStatus(){
        this._ngZone.run(() => {
            if (this._scrolled === ($(window).scrollTop() > 100)) {
                return;
            }
            this._scrolled = ($(window).scrollTop() > 100);
            this.checkRef.markForCheck();
        });
     }

}