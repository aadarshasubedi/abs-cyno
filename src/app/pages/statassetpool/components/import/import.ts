import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, LoadingService } from '../../../../../sdk/services';
declare class Resumable { assignBrowse: any; on: any; upload: any; constructor(options: any)};
import { StatAssetPoolService } from '../../service/statassetpool.service';
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

    uploadErrorMsg: string;

    @ViewChild('uploadBtn') uploadBtn: any;

    private resumable: Resumable;

    constructor(
        private ngZone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        private loadingService: LoadingService,
        private messageService: MessageService,
        private statAssetPoolService: StatAssetPoolService
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
            this.loadingService.showFull('导入中....');
            this.resumable.upload();
        });

        this.resumable.on('fileSuccess', (file, message) => {
            this.loadingService.close();
            const resp = JSON.parse(message);
            if (resp.isException === true) {
                this.ngZone.run(() => {
                    this.disabled = false;
                    this.progress = 100;
                    this.uploadMsg = 'error';
                    this.uploadErrorMsg = resp.expInfo;
                });
                return;
            }
            this.ngZone.run(() => {
                this.disabled = false;
                this.progress = 100;
                this.uploadMsg = 'success';
                this.messageService.confirm('导入成功, 是否要进行样本分析').afterClosed().subscribe((isOk) => {
                    if (isOk === true){
                        this.statAssetPoolService.staticPoolAnalysis(this.poolId).subscribe(() => {
                            this.router.navigateByUrl('index/statassetpool/analyse/' + this.poolId);
                        }, (error) => {
                            this.uploadMsg = 'error';
                            this.uploadErrorMsg = error.expInfo;
                        });
                        return;
                    }
                    this.router.navigateByUrl('index/statassetpool/analyse/' + this.poolId);
                });
            });
        });

        this.resumable.on('fileError',  (file, error) => {
            this.loadingService.close();
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
