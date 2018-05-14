import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../../../sdk/services';
declare class Resumable { assignBrowse: any; on: any; upload: any; constructor(options: any)};

@Component({
    templateUrl: './import.html'
})
export class ImportComponent implements OnInit, AfterViewInit, OnDestroy {

    uploading = false;

    disabled = false;

    color = 'primary';

    progress = 0;

    uploadMsg;

    poolId;

    @ViewChild('uploadBtn') uploadBtn: any;

    private resumable: Resumable;

    constructor(
        private ngZone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {
        this.route.params.subscribe(param => this.poolId = param.id);
     }

    ngOnInit(): void {
        this.resumable = new Resumable({
            target: '/cyno/cynoweb/staticpool/uploadStaticPool.do',
            query: {poolId: this.poolId},
            maxFiles: 1,
            chunkSize: 5 * 1024 * 1024,
            testChunks: false,
            maxChunkRetries: 0
        });

        this.resumable.on('fileAdded',  (file) => {
            this.ngZone.run(() => {
                this.color = 'primary';
                this.disabled = true;
                this.uploading = true;
                this.progress = 0;
            });
            this.resumable.upload();
        });

        this.resumable.on('fileSuccess', (file) => {
            this.ngZone.run(() => {
                this.disabled = false;
                this.progress = 100;
                this.uploadMsg = 'success';
                this.messageService.alertInfo('导入成功').afterClosed().subscribe(() => {
                    this.router.navigateByUrl('index/statassetpool/analyse/' + this.poolId);
                });
            });
        });

        this.resumable.on('fileError',  (file) => {
            this.ngZone.run(() => {
                this.disabled = false;
                this.color = 'warn';
                this.progress = 30;
                this.uploadMsg = 'error';
            });
        });
     }

    ngAfterViewInit() {
        this.resumable.assignBrowse([this.uploadBtn._elementRef.nativeElement]);
    }

    ngOnDestroy() {}
}
