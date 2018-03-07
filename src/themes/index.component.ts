import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ChangeDetectionStrategy, ElementRef, AfterViewInit } from '@angular/core';
import { Action } from '../app/beans/Action';
import { ActionType } from '../app/beans/ActionType';
import { AppComponent } from '../app/app.component';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

declare let $: any;

@Component({
    selector: 'app-index',
    templateUrl: `./index.component.html`
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy{

    private unsubscribeScroll: any;

    _scrolled: Boolean = false;

    private _wow: any;

    constructor(
        private el: ElementRef,
        private appComponent: AppComponent,
        private scrollDispatcher: ScrollDispatcher,
        private checkRef: ChangeDetectorRef,
        private _ngZone: NgZone
    ) { }

    ngOnInit() {
        this.unsubscribeScroll = this.unsubscribeScroll = this.scrollDispatcher.scrolled().subscribe(() => {
            this.updateScrollStatus();
         });
     }

    ngAfterViewInit(){
        this._wow = new WOW({
            boxClass: 'index-wow',
            offset: 10
        });
        this._wow.init();
    }

    ngOnDestroy() {
        if (this._wow) {
            this._wow.stop();
        }
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