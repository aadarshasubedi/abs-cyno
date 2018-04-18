import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthGuard } from '../services/auth-guard';
import { Router } from '@angular/router';
@Component({
    template:  '<a href="/login.html" #loginLink></a>',
    providers: []
})
export class LoginCmp implements AfterViewInit {

    @ViewChild('loginLink') loginLink: ElementRef;

    constructor(
        private authGuard: AuthGuard,
        private router: Router
    ) { }

    ngAfterViewInit() {
        this.authGuard.canLoad().then(() => {
            this.router.navigate(['index', 'projects', 'projects']);
        }, () => {
            this.loginLink.nativeElement.click();
        }).catch(() => {});
    }
}