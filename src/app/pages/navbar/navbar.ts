import { Component, OnInit,ChangeDetectionStrategy , NgZone, ChangeDetectorRef } from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { NavBarService } from './navbar.service';

@Component({
    selector: 'cyno-navbar',
    templateUrl: './navbar.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./navbar.scss']
})
export class NavBarComponent implements OnInit {

    private unsubscribeScroll: any;

    _scrolled: boolean = false;

    breadcrumbTitle: string;

    constructor(
        private scrollDispatcher: ScrollDispatcher,
        private checkRef: ChangeDetectorRef,
        private _ngZone: NgZone
    ) { 
        NavBarService.breadcrumb.asObservable().subscribe((title) => {
            this.breadcrumbTitle = title;
            this.checkRef.markForCheck();
        })
    }

    ngOnInit() {
        this.unsubscribeScroll = this.scrollDispatcher.scrolled().subscribe(() => {
            this.updateScrollStatus();
        });
    }

    private updateScrollStatus() {
        this._ngZone.run(() => {
            if (this._scrolled === ($(window).scrollTop() > 10)) {
                return;
            }
            this._scrolled = ($(window).scrollTop() > 10);
            this.checkRef.markForCheck();
        });

    }
}