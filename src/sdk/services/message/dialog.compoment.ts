import { Component, OnInit, Injector } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    templateUrl: './dialog.compoment.html',
    styleUrls: ['./dialog.compoment.scss']
})
export class MessageDialogComponent implements OnInit {

    data: any = {};

    constructor(private _injector: Injector) {
        this.data = this._injector.get(MAT_DIALOG_DATA) || {};
     }

    ngOnInit() {}

    get icon(){
        const type = (this.data || {}).msgType;
        return type === 'error' ? 'error' : (type === 'warn' ? 'warning' : 'info');
    }
}