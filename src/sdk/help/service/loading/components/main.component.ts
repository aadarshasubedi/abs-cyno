import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingService } from '../../../../../sdk/services';
const html = require("../../../../../../README.md");

@Component({
    templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

    @ViewChild('readerDom') readerDom: ElementRef;

    constructor(private loading: LoadingService) { }

    ngOnInit() {

        this.readerDom.nativeElement.innerHTML = html;

     }

    showFull(){
        //全屏遮罩
        this.loading.showFull('加载中....');
        setTimeout(() => {
            this.loading.close();
        }, 2000);
    }
}