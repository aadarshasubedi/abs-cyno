import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-email',
    templateUrl: './email.compoment.html'
})
export class EmailComponent implements OnInit {

    name = new Date().getTime();

    constructor() { }

    ngOnInit() { }
}