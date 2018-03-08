import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

declare let $: any;

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./nav.scss']
})
export class NavComponent implements OnInit, OnDestroy {

    private unsubscribeScroll: any;

    _scrolled: Boolean = false;

    constructor(
        private scrollDispatcher: ScrollDispatcher,
        private checkRef: ChangeDetectorRef,
        private _ngZone: NgZone
    ) { }

    ngOnInit() {
        this.unsubscribeScroll = this.scrollDispatcher.scrolled().subscribe(() => {
           this.updateScrollStatus();
        });
        this.updateScrollStatus();
    }

    ngOnDestroy() {
        if (this.unsubscribeScroll){
            //this.unsubscribeScroll();
        }
    }

    private updateScrollStatus() {
        this._ngZone.run(() => {
            if (this._scrolled === ($(window).scrollTop() > 5)) {
                return;
            }
            this._scrolled = ($(window).scrollTop() > 5);
            this.checkRef.markForCheck();
        });

    }
}