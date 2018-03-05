import { Component, OnInit, ViewEncapsulation, Optional } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SidebarMenuTriggerDirective } from './sidebar/sidebar-menu-trigger';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AppComponent } from '../../app/app.component';
import { HttpClient } from '@angular/common/http';
import { MessageService, LoadingService } from '../../sdk/services';
import { filter } from 'rxjs/operators/filter';
import { IndexComponent } from '../index.component';

@Component({
  selector: 'app-main-component',
  templateUrl: './main.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./main.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  public onlyOneSidebarTriggerNotice: Subject<any> = new Subject<any>();

  constructor(
    private _appComponent: AppComponent,
    @Optional() private httpClient: HttpClient,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private indexComponent: IndexComponent
  ) { }

  ngOnInit() {
    this._appComponent.action.pipe(filter(() => this.indexComponent.menu_collapse === true)).subscribe(() => {
      this.onlyOneSidebarTriggerNotice.next({closeAll: true});
    });
  }

  ngOnDestroy() {
    this.onlyOneSidebarTriggerNotice.complete();
    this.onlyOneSidebarTriggerNotice = null;
  }

  aaaaa111() {
    // this.httpClient.get('/proxy/test').subscribe((data) => {
    //   this.messageService.snackError(JSON.stringify(data));
    // });

  }

  aaaaa() {
    // console.log('------------------');
    // this.loadingService.showFull('加载中....');
    // this.loadingService.showFull('加载中11111....');
    // setTimeout(() => {
    //   this.loadingService.close();
    // },  5000);
    //this.messageService.alertInfo('ddddddddd');
    // this.httpClient.get('/proxy/test').subscribe((data) => {
    //   this.messageService.snackError(JSON.stringify(data));
    // });

    // this.httpClient.get('/proxy/test').subscribe((data) => {
    //   this.messageService.snackError(JSON.stringify(data));
    // });

    // this.httpClient.get('/proxy/test').subscribe((data) => {
    //   this.messageService.snackError(JSON.stringify(data));
    // });

    // this.httpClient.get('/api/menu/list').subscribe((data) => {
    //   console.log('------------------------dd------');
    // });

    // this.httpClient.get('/api/menu/get/11111111').subscribe((data) => {
    //   console.log('------------------------ddaaa------');
    // });

    // this.httpClient.get('/proxy/test').subscribe((data) => {
    //   console.log('------------------------ddq------');
    // });

  }

}
