import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { devMenus } from './dev.menus';
import { AppConfig } from '../../../app/app.config';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { jsonMap } from '../../../sdk/services';

@Injectable()
export class SidebarService {
    constructor(
        private httpClient: HttpClient,
        private appConfig: AppConfig
    ){ }

    getMenus(): Observable<Object> {
        const url = this.appConfig.menuDataS.url;
        if (this.appConfig.menuDataS.method.toUpperCase() === 'POST') {
           return this.httpClient.post(url, {});
        }
        return this.httpClient.get(url).pipe(jsonMap(),
            map((data: any): Object => {
               const r: Array<any> = this.appConfig.menuDataS.findData(data);
                if (this.appConfig.showDevMenusWhenDev === true){
                    devMenus.forEach((v: any) => {
                        r.push(v);
                    });
                }
                return r;
            }));
    }
}
