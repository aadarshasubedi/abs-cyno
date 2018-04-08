import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavBarService } from '../navbar/navbar.service';

@Component({
    template: '<router-outlet></router-outlet>',
    encapsulation: ViewEncapsulation.None
})
export class ProjectsComponent{
    constructor(private activatedRoute: ActivatedRoute) {
        this.activatedRoute.data.subscribe((data) => {
            NavBarService.breadcrumb.next(data.title || '');
        })
    }
}