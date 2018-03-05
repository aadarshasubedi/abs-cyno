import { Component, ElementRef, OnDestroy, AfterContentInit, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Action } from './beans/Action';
import { ActionType } from './beans/ActionType';
import { MessageService, LoadingService } from '../sdk/services';
import { AppConfig } from './app.config';

// https://github.com/HubSpot/pace/blob/master/pace.js
declare const Pace: any;

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnDestroy, AfterContentInit, OnInit {

  action = new Subject<Action>();

  constructor(
    public elementRef: ElementRef,
    private loadingService: LoadingService,
    private appConfig: AppConfig,
    @Inject(DOCUMENT) private _document: any) {}

  ngOnInit() {
    this.updateIcon();
    this.updateTitle();
  }

  updateIcon() {
    this._document.getElementById('app-icon').href = (this.appConfig.icon || 'favicon.ico') + '?_doc=' + new Date().getTime();
  }

  updateTitle() {
    this._document.getElementById('app-title').innerText = this.appConfig.titlePrefix || 'Ng-JoyinWeb';
  }

  ngAfterContentInit() {
    Pace.start();
    Pace.on('done', () => {
      setTimeout(() => {
        const r = this._document.querySelector('#jy-preload');
        r.addEventListener('transitionend', () => {
          r.style.display = 'none';
        });
        r.style.opacity = 0;
      }, 10);
    }, this, true);
  }

  ngOnDestroy() {
    this.action.complete();
    this.action = undefined;
    Pace.stop();
  }
}
