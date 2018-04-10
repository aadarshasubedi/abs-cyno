import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { PdcalsService } from '../../service/pdcalc.service';
import { catchError} from 'rxjs/operators/catchError';
import {of} from 'rxjs/observable/of';
import { MessageService, LoadingService } from '../../../../../sdk/services';


@Component({
    selector: 'app-name',
    templateUrl: './cesuan-param.html'
})
export class CesuanParam implements OnInit {

    cdDistribType: string = 'ND';

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
                this.changeDetectorRef.markForCheck();
        });
    }

    get maxBranchP1() {
        const r = (1 * 1000000) - (this.calculateParams.branchP2 || 0) * 1000000
            - (this.calculateParams.branchP3 || 0) * 1000000
            - (this.calculateParams.branchP4 || 0) * 1000000;
        return r < 0 ? 0 : r / 1000000;

    }
    get maxBranchP2() {
        const r = (1 * 1000000) - (this.calculateParams.branchP1 || 0) * 1000000
            - (this.calculateParams.branchP3 || 0) * 1000000
            - (this.calculateParams.branchP4 || 0) * 1000000;
        return r < 0 ? 0 : r / 1000000;

    }
    get maxBranchP3() {
        const r = (1 * 1000000) - (this.calculateParams.branchP2 || 0) * 1000000
            - (this.calculateParams.branchP1 || 0) * 1000000
            - (this.calculateParams.branchP4 || 0) * 1000000;
        return r < 0 ? 0 : r / 1000000;

    }
    get maxBranchP4() {
        const r = (1 * 1000000) - (this.calculateParams.branchP2 || 0) * 1000000
            - (this.calculateParams.branchP3 || 0) * 1000000
            - (this.calculateParams.branchP1 || 0) * 1000000;
        return r < 0 ? 0 : r / 1000000;

    }
}
