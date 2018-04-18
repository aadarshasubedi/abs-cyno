import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Options } from './login.options';
import { jsonMap } from '../../sdk/services';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {

    constructor(private http: HttpClient) {}

    /**
     * 登录
     * @param account 
     * @param password 
     */
    doLogin(account: string, password: string): Observable<any>{
        return this.http.post(Options.service.login.url, {
            userName: account,
            password: password
        }).pipe(jsonMap());
    }
}