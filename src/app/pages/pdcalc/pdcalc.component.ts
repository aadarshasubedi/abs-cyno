import { Component, OnInit } from '@angular/core';
import { NavBarService } from '../navbar/navbar.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    template: '<router-outlet></router-outlet>'
})
export class PdcalcComponent{
    constructor(private activatedRoute: ActivatedRoute) { 
        this.activatedRoute.data.subscribe((data) => {
            NavBarService.breadcrumb.next(data.title || '');
        })
    }
}