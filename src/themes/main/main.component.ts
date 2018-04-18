import { Component, OnInit, ViewEncapsulation, Optional } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AppComponent } from '../../app/app.component';
import { HttpClient } from '@angular/common/http';
import { MessageService, LoadingService } from '../../sdk/services';
import { filter } from 'rxjs/operators/filter';

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
    private loadingService: LoadingService
  ) { }

  ngOnInit() {}

  ngOnDestroy() {
    this.onlyOneSidebarTriggerNotice.complete();
    this.onlyOneSidebarTriggerNotice = null;
  }

}
