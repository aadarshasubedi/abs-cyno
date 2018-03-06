import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-name',
    template: `<router-outlet></router-outlet>`,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./help.component.css']
})
export class HelpComponent {
    constructor() { }
}