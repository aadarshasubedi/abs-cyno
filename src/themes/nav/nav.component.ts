import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.scss']
})
export class NavComponent implements OnInit, OnDestroy{

    private unsubscribeScroll: any;

    scrolled: Boolean = false;

    constructor(
        private scrollDispatcher: ScrollDispatcher
    ) { }

    ngOnInit() {
        this.unsubscribeScroll = this.scrollDispatcher.scrolled().subscribe(() => {
            this.scrolled = true;
            console.log('---------------------' + this.scrolled);
        });

    }

    ngOnDestroy(){
        this.unsubscribeScroll();
    }
}