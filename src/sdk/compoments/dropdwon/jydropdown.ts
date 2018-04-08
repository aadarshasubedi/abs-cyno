import { 
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    Input,
    ContentChildren,
    QueryList,
    NgZone,
    AfterContentInit,
    OnDestroy,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Output,
    EventEmitter
} from '@angular/core';

import { MAT_OPTION_PARENT_COMPONENT, MatOptionParentComponent, MatOption } from '@angular/material';
import { take } from 'rxjs/operators/take';
import { switchMap } from 'rxjs/operators/switchMap';
import { startWith } from 'rxjs/operators/startWith';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { merge } from 'rxjs/observable/merge';
import { Observable } from 'rxjs/Observable';
import {defer} from 'rxjs/observable/defer';
import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'mat-jydropdown',
    templateUrl: './jydropdown.html',
    exportAs: 'MatJyDropDown',
    providers: [{provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatJyDropDown}],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./style.scss']
})
export class MatJyDropDown implements OnInit, AfterContentInit, OnDestroy {

    //mat options
    @Input() multiple: boolean = false;
    
    @ContentChildren(MatOption, { descendants: true }) options: QueryList<MatOption>;

    @Output() onSelectChange: EventEmitter<any> = new EventEmitter<any>();

    readonly optionSelectionChanges: Observable<any> = defer(() => {
        if (this.options) {
          return merge(...this.options.map(option => option.onSelectionChange));
        }
        return this._ngZone.onStable
          .asObservable()
          .pipe(take(1), switchMap(() => this.optionSelectionChanges));
    });

    private readonly _destroy = new Subject<void>();


    @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

    _classList: {[key: string]: boolean} = {};

    constructor(private _ngZone: NgZone, private _changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit(): void { }

    ngAfterContentInit() {
        //检测this.options变化
        this.options.changes.pipe(startWith(null), takeUntil(this._destroy)).subscribe(() => {
            this._resetOptions();
        });
    }

    _resetOptions(){
        const changedOrDestroyed = merge(this.options.changes, this._destroy);
        this.optionSelectionChanges
      .pipe(takeUntil(changedOrDestroyed))
      .subscribe(event => {
        this._onSelect(event);
    });
    }

    //options数据发生变化的时候重新选择
    _onSelect(event){
        if (!this.options){
            this.onSelectChange.emit([]);
        } else {
            this.onSelectChange.emit(this.options.filter(opt => opt.selected).map(d => d.value));
        }
    }

    ngOnDestroy(){
        this._destroy.next();
        this._destroy.complete();
    }
}
