import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <mat-spinner [diameter]="diameter"></mat-spinner>
        <div>{{data.message}}...</div>
        `
})
export class JyLoadingComponent{

    diameter: number = 100;

    data: any = {};

    constructor() { }
}