import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse, HttpHeaders, HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { HttpMockServer } from '../../sdk/services';
import { Options } from './login.options';

@Injectable()
export class Mock{
    constructor(private httpMockServer: HttpMockServer) {}

    buildMock(){
        this.createLoginMock();
    }

    //登录
    private createLoginMock() {
        this.httpMockServer.createPost(Options.service.login.url, (req: HttpRequest<any>) => {
            let status: number = 200;
            let statusText: string = 'OK';
            const headers: HttpHeaders = new HttpHeaders();
            const user = req.body;
            const respBody = {message: '登陆成功'};

            if (user.userName !== 'admin') {
                status = 505;
                statusText = 'error';
                respBody.message = '账户不能为空或者账户不存在';
            }

            if (status !== 200) {
               return new HttpErrorResponse({
                    headers: headers,
                    status: status,
                    statusText: statusText,
                    url: req.url,
                    error: respBody.message
                 })
            } else {
                headers.append('content-type', ['application/json']);
               return new HttpResponse({
                   headers: headers,
                   status: status,
                   statusText: statusText,
                   url: req.url,
                   body: JSON.stringify(respBody)
               });

            }

        });


    }
}