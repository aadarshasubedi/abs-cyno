import { Component, OnInit,ViewEncapsulation } from '@angular/core';

@Component({
    templateUrl: './index.html',
    styleUrls: ['./index.scss'],
    encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}