import {
    Input,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from '../../../../../../sdk/services';

@Component({
    selector: 'scene-param',
    templateUrl: './scene.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SceneParam implements OnInit, OnChanges {

    @Input() inputParams;

    columns = ['prSceneCode', 'multipleD', 'multipleE'];

    private _dataSource1 = new MatTableDataSource([]);
    get dataSource1() {
        return this._dataSource1;
    }

    private _dataSource2 = new MatTableDataSource([]);
    get dataSource2() {
        return this._dataSource2;
    }
    private _dataSource3 = new MatTableDataSource([]);
    get dataSource3() {
        return this._dataSource3;
    }
    
    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    _init = false;

    ngOnInit(): void {
        this.render();
        this._init = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this._init !== true) {
            return;
        }
        if ('inputParams' in changes){
            this.render();
        }
    }

    private render() {
        if (!this.inputParams) {
            return;
        }
        const _d = {ds0: [], ds1: [], ds2: []};
        const _s = this.inputParams.paraMap.SCENE_PARA || [];

        for (let i = 0; i < _s.length; i++) {
            _d['ds' + ((i / 3) | 0)].push(_s[i]);
        }

        this._dataSource1.data = _d.ds0;
        this._dataSource2.data = _d.ds1;
        this._dataSource3.data = _d.ds2;
    }
}
