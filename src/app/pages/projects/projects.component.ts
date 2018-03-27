import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    template: '<router-outlet></router-outlet>',
    encapsulation: ViewEncapsulation.None
})
export class ProjectsComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}