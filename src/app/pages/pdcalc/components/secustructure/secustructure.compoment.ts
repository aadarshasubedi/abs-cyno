import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'secustructure-table',
    templateUrl: './secustructure.compoment.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecuStructureComponent implements OnInit {

    @Input() datas: Array<any>;

    inited: Boolean = false;

    constructor() { }

    ngOnInit() {}

    isEmptyData() {
        return !this.datas || this.datas.length === 0;
    }
}