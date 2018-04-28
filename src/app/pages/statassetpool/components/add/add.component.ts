import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatTabGroup} from '@angular/material';
import { StatAssetPoolService } from '../../service/statassetpool.service';
import { merge} from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';
import { of} from 'rxjs/observable/of';
import {catchError} from 'rxjs/operators/catchError';
import { debounceTime} from 'rxjs/operators/debounceTime';
import { HttpParams} from '@angular/common/http';
import { DatePipe} from '@angular/common/src/pipes/date_pipe';
import { MessageService } from '../../../../../sdk/services';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { zip } from 'rxjs/observable/zip';
import { FormControl, Validators, AbstractControl} from '@angular/forms';
import { Moment as _Monent } from 'moment';


@Component({
    selector: 'app-name',
    templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {

    poolCodeFormControl;

    poolNameFormControl = new FormControl('', Validators.required);

    projectFormControl = new FormControl('', Validators.required);

    assetTypeFormControl = new FormControl('', Validators.required);

    dataFromFormControl = new FormControl('', Validators.required);

    bakFormControl = new FormControl('');

    startDateFormControl = new FormControl('', Validators.required);

    endDateFormControl = new FormControl('', Validators.required);

    assetTypeSource;

    dataFromSource;

    projectSource;

    histPoolSource;

    isShoLoading = false;

    updatePool;



    constructor(
        private statAssetPoolService: StatAssetPoolService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.isShoLoading = true;
        this.poolCodeFormControl = new FormControl('', [Validators.required], [, (control: AbstractControl): Observable<any> => {
            return this.poolCodeUniqueValidator(control.value);
        }]);
        // 批量初始化数据
        zip(
            this.statAssetPoolService.getAssetTypes(),
            this.statAssetPoolService.querySponsorOrg(),
            this.statAssetPoolService.queryProjects(),
            this.loadUpdateData()
        ).subscribe((vs) => {
            this.assetTypeSource = vs[0].assetTypes;
            this.dataFromSource = vs[1].sponsorOrgs;
            this.projectSource = vs[2].list;
            this.isShoLoading = false;

            //填充修改数据
            if (vs[3].list && vs[3].list.length > 0) {
                const r = vs[3].list[0];
                this.poolCodeFormControl.setValue(r.poolId);
                this.poolNameFormControl.setValue(r.poolName);
                this.projectFormControl.setValue(r.projectId);
                this.assetTypeFormControl.setValue(r.assetType);
                this.dataFromFormControl.setValue(r.dataSource);
                this.bakFormControl.setValue(r.remark);
                this.startDateFormControl.setValue(r.lendBeginDate);
                this.endDateFormControl.setValue(r.lendEndDate);
                this.updatePool = r;

                this.poolCodeFormControl = new FormControl();
            }
        });
     }

     isVaild(): boolean {
        return this.poolCodeFormControl.valid &&
            this.poolNameFormControl.valid &&
            this.assetTypeFormControl.valid &&
            this.dataFromFormControl.valid;
    }

    poolCodeUniqueValidator(v): Observable<any> {
        return new Observable<any>((subscriber: Subscriber<any>) => {
            const o = this.histPoolSource ? of({list: this.histPoolSource}) : this.statAssetPoolService.queryStaticPool();
            o.pipe(catchError(() => {
                return of({$error: true});
            })).subscribe((data: any) => {
                const isSuccess = (data.$error !== true) && (data.list || []).filter(r => r.poolId === v).length === 0;
                this.histPoolSource = data.$error !== true ? (data.list ||  []) : null;
                if (isSuccess) {
                    subscriber.next(null);
                } else {
                    subscriber.next({
                        unique: data.$error ? '验证错误:服务端发生错误' : '输入错误: (' + v + ') 已存在'
                    });
                }
                subscriber.complete();
            })
        })
    }

    converToString(arrays, key): string {
        return (arrays || []).map(item => item[key]).join(',');
    }

    //获取更新数据
    loadUpdateData(): Observable<any> {
        return this.route.params.pipe(switchMap( (data) => {
            if (data.id) {
                return this.statAssetPoolService.get(data.id);
            }
            return of({});
        } ));
    }

    save(){
        this.messageService.confirm('确定' + (this.updatePool ? '保存修改' : '新增') + '吗?').afterClosed().subscribe((ok) => {
            if (ok ===  true) {
                const r = this.updatePool || {};
                r.poolId = r.poolId || this.poolCodeFormControl.value;
                r.poolName = this.poolNameFormControl.value;
                r.projectId = this.projectFormControl.value;
                r.assetType = this.assetTypeFormControl.value;
                r.dataSource = this.dataFromFormControl.value;
                r.lendBeginDate = this.formatDateForFormControll(this.startDateFormControl);
                r.lendEndDate  = this.formatDateForFormControll(this.endDateFormControl);
                r.remark = this.bakFormControl.value;
                this.statAssetPoolService[this.updatePool ? 'update' : 'save'](r).pipe(
                    catchError(() => {
                        return of({$error: true});
                    })
                ).subscribe( (resp: any) => {
                    if (resp.$error === true) {
                        this.messageService.alertError('操作失败:服务端发生异常');
                        return;
                    }
                    this.router.navigateByUrl('/index/statassetpool/main');
                } );
            }
        })

    }

    private formatDateForFormControll(ctr) {
        return (ctr.value && ctr.value.format) ? ctr.value.format('YYYY-MM-DD HH:mm:ss') : undefined;
    }
}
