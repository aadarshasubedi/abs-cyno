import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { PdcalsService } from '../../service/pdcalc.service';
import { catchError} from 'rxjs/operators/catchError';
import {of} from 'rxjs/observable/of';
import { MessageService, LoadingService } from '../../../../../sdk/services';


@Component({
    selector: 'app-name',
    templateUrl: './cesuan-param.html'
})
export class CesuanParam implements OnInit {

    cdDistribType: string = '';

    cdDistribType1 = "ND";

    //测算参数modal
    calculateParams: any = {};

    //测算结果
    result: any;

    constructor(
        private pdcalsService: PdcalsService,
        public dialogRef: MatDialogRef<CesuanParam>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private changeDetectorRef: ChangeDetectorRef,
        private messageService: MessageService,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.loadingService.showFull('初始化默认测算参数...');
        this.pdcalsService.initPdCalcPara(this.data.proposalId, this.data.initType)
            .pipe(catchError((data) => {
                this.messageService.alertError('初始化参数失败');
                return of({$error: true});
            }))
            .subscribe((data: any) => {
                setTimeout(() => {this.loadingService.close();}, 0);
                if (data.$error === true) {
                    return;
                }
                this.calculateParams = data.paraDto;

                //格式化参数
                this.calculateParams.per_exValue = this.formatePer(this.calculateParams.exValue);
                this.calculateParams.per_dxValue = this.formatePer(this.calculateParams.dxValue);
                this.calculateParams.per_branchP1 = this.formatePer(this.calculateParams.branchP1);
                this.calculateParams.per_branchP2 = this.formatePer(this.calculateParams.branchP2);
                this.calculateParams.per_branchP3 = this.formatePer(this.calculateParams.branchP3);
                this.calculateParams.per_branchP4 = this.formatePer(this.calculateParams.branchP4);
                this.calculateParams.per_earlyRate = this.formatePer(this.calculateParams.earlyRate);
                this.calculateParams.per_recRate = this.formatePer(this.calculateParams.recRate);
                this.changeDetectorRef.markForCheck();
        });
    }

    get maxBranchP1() {
        const r = 100 - this.calculateParams.per_branchP2 - this.calculateParams.per_branchP3 - this.calculateParams.per_branchP4;
        return ((  r * 10000 ) | 0 ) / 10000;

    }
    get maxBranchP2() {
        const r = 100 - this.calculateParams.per_branchP1 - this.calculateParams.per_branchP3 - this.calculateParams.per_branchP4;
        return ((  r * 10000 ) | 0 ) / 10000;

    }
    get maxBranchP3() {
        const r = 100 - this.calculateParams.per_branchP1 - this.calculateParams.per_branchP2 - this.calculateParams.per_branchP4;
        return ((  r * 10000 ) | 0 ) / 10000;

    }
    get maxBranchP4() {
        const r = 100 - this.calculateParams.per_branchP1 - this.calculateParams.per_branchP2 - this.calculateParams.per_branchP3;
        return ((  r * 10000 ) | 0 ) / 10000;
    }

    formatePer(v) {
        return isNaN(v) ? '' : (((v * 10000) | 0 ) / 100) + '';
    }

    formatePer2Float(v) {
        return isNaN(v) ? '' : v / 100;
    }

    get realCalculateParams() {
        this.calculateParams.exValue = this.formatePer2Float(this.calculateParams.per_exValue);
        this.calculateParams.dxValue = this.formatePer2Float(this.calculateParams.per_dxValue);
        this.calculateParams.branchP1 = this.formatePer2Float(this.calculateParams.per_branchP1);
        this.calculateParams.branchP2 = this.formatePer2Float(this.calculateParams.per_branchP2);
        this.calculateParams.branchP3 = this.formatePer2Float(this.calculateParams.per_branchP3);
        this.calculateParams.branchP4 = this.formatePer2Float(this.calculateParams.per_branchP4);
        this.calculateParams.earlyRate = this.formatePer2Float(this.calculateParams.per_earlyRate);
        this.calculateParams.recRate = this.formatePer2Float(this.calculateParams.per_recRate);
        const d = Object.assign({}, this.calculateParams);
        delete d.per_exValue;
        delete d.per_dxValue;
        delete d.per_branchP1;
        delete d.per_branchP2;
        delete d.per_branchP3;
        delete d.per_branchP4;
        delete d.per_earlyRate;
        delete d.per_recRate;
        return d;
    }
}
