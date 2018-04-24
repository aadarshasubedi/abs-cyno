import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavBarService } from '../navbar/navbar.service';

@Component({
    selector: 'app-name',
    template: '<router-outlet></router-outlet>'
})
export class DyncAssetPoolComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {
        this.activatedRoute.data.subscribe((data) => {
            NavBarService.breadcrumb.next(data.title || '');
        })
    }

    ngOnInit(): void { }
}
