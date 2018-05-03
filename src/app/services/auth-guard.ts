import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jsonMap } from '../../sdk/services';
import {catchError} from 'rxjs/operators/catchError';
import {of as observableOf} from 'rxjs/observable/of';

@Injectable()
export class AuthGuard implements CanLoad {

    userInfo: any;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private _platformLocation: PlatformLocation
    ){}

    canLoad() {
        return new Promise<boolean>((resolve, reject) => {
            this.httpClient.get('/cyno/cynoweb/sysUser/getUserInfo.do').pipe(jsonMap(), catchError(() => {
                return observableOf({$error: true});
            })).subscribe((data: any) => {
                if (data.$error === true || data.isLogin === false) {
                    this.router.navigate(['login']);
                    reject(false);
                    return;
                }
                this.userInfo = data;
                const _pl: any = this._platformLocation;
                const targetUrl: any = _pl.location.pathname;
                if (targetUrl.split('\/').length < 3){
                    this.router.navigateByUrl('/index/projects/projects');
                }
                resolve(true);
            })
        })
    }
}