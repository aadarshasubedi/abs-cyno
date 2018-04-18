import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    template:  '<a href="/login.html" #loginLink></a>',
    providers: []
})
export class LoginCmp implements AfterViewInit {

    @ViewChild('loginLink') loginLink: ElementRef;

    constructor() { }

    ngAfterViewInit() {this.loginLink.nativeElement.click();}
}