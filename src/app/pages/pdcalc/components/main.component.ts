import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PdcalsService } from '../service/pdcalc.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './main.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./main.scss']
})
export class MainComponent implements OnInit {

    projectZjDatas: Array<any>;

    projecctYieldRateData: any;

    constructor(
        private pdcalsService: PdcalsService,
        private router: Router
    ) { }

    ngOnInit() {
        //初始化产品证券结构数据
        this.pdcalsService.getProjiectZqjg(null).subscribe((resp: any) => {
            this.projectZjDatas = resp.datas;
        });

        //初始化产品证券结构数据
        this.pdcalsService.getProjecctYieldRate(null).subscribe((resp: any) => {
            this.projecctYieldRateData = resp;
        }, (error) => {
            
        });

    }
}