import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
@Component({
    template: ''
})
export class RedirtUrl implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((data) => {
            setTimeout(() => {
                if (data.redirtUrl) {
                    this.router.navigateByUrl(data.redirtUrl);
                }
            }, 10)
        })
    }
}
