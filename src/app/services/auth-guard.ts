import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jsonMap } from '../../sdk/services';
import {catchError} from 'rxjs/operators/catchError';
import {of as observableOf} from 'rxjs/observable/of';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private httpClient: HttpClient
    ){}

    canActivate() {
        return new Promise<boolean>((resolve, reject) => {
            this.httpClient.get('/cyno/cynoweb/sysUser/getUserInfo.do').pipe(jsonMap(), catchError(() => {
                return observableOf({$error: true});
            })).subscribe((data: any) => {
                if (data.$error === true || data.isLogin === false){
                    this.router.navigate(['login']);
                    reject(false);
                    return;
                }
                resolve(true);
            })
        })
    }
}