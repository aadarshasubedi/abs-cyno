import { Component, OnInit } from '@angular/core';
import { Action } from '../app/beans/Action';
import { ActionType } from '../app/beans/ActionType';
import { AppComponent } from '../app/app.component';

@Component({
    selector: 'app-index',
    templateUrl: `./index.component.html`
})
export class IndexComponent implements OnInit {

    constructor(private appComponent: AppComponent) { }

    ngOnInit() {

     }

}