import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { PdcalsService } from '../../service/pdcalc.service';

@Component({
    selector: 'app-name',
    templateUrl: './cesuan-param.html'
})
export class CesuanParam implements OnInit {

    cdDistribType: string = 'ND';

    //测算参数modal
    calculateParams: any = {};

    constructor(
        private pdcalsService: PdcalsService,
        public dialogRef: MatDialogRef<CesuanParam>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.pdcalsService.initPdCalcPara(this.data.proposalId).subscribe(data => this.calculateParams = data);
    }
}
