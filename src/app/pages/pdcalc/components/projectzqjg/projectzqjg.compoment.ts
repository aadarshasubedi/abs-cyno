import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'projecct-zqjg',
    templateUrl: './projectzqjg.compoment.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectZqjgComponent implements OnInit {

    @Input() datas: Array<any>;

    inited: Boolean = false;

    constructor() { }

    ngOnInit() {}

    isEmptyData() {
        return !this.datas || this.datas.length === 0;
    }
}