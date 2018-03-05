import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <mat-spinner [diameter]="50"></mat-spinner>
        <div>{{data.message}}...</div>
        `
})
export class JyLoadingComponent implements OnInit {

    data: any = {};

    constructor() { }

    ngOnInit() { }
}