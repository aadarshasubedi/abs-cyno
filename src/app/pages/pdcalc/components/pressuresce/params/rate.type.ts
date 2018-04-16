import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'ratetype-param',
    templateUrl: './ratetype.html',
    host: {
        'class': 'ratetype-param'
    }
})
export class RateTypeParam implements OnInit {

    dataSource;

    columns = [];

    @Input() inputParams;

    constructor() { }

    ngOnInit(): void { }
}
