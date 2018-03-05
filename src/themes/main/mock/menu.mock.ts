import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HttpMockServer } from '../../../sdk/services';
import { AppConfig } from '../../../app/app.config';
@Injectable()
export class MenuMock {
    constructor(
        private httpMockServer: HttpMockServer,
        private appConfig: AppConfig
    ){}

    buildMock() {
        this.createMock_MenuList();
    }


    createMock_MenuList() {
        let m: string = 'createGet';
        if (this.appConfig.menuDataS.method.toUpperCase() === 'POST') {
            m = 'createPost';
        }
        this.httpMockServer[m](this.appConfig.menuDataS.url, (req: HttpRequest<any>) => {
            const body: string = JSON.stringify({
                data: []
            });
            const status: number = 200;
            const statusText: string = 'OK';
            const headers: HttpHeaders = new HttpHeaders();
            headers.append('content-type', ['application/json']);

            return new HttpResponse({
                headers: headers,
                status: status,
                statusText: statusText,
                url: req.url,
                body: body
            });

        });
    }


    // createMock_MenuList1() {
    //     this.httpMockServer.createGet('/api/menu/get/:meniud', (req: HttpRequest<any>) => {
    //         const body: string = JSON.stringify({
    //             data: [{
    //                 name: 'xiufu.wang111111111'
    //             }]
    //         });
    //         const status: number = 200;
    //         const statusText: string = 'OK';
    //         const headers: HttpHeaders = new HttpHeaders()
    //         headers.append('content-type', ['application/json']);

    //         //模拟成功响应
    //         return new HttpResponse({
    //             headers: headers,
    //             status: status,
    //             statusText: statusText,
    //             url: req.url,
    //             body: body
    //         });

    //         //模拟失败响应
    //         // return new HttpErrorResponse({
    //         //     headers: headers,
    //         //     status: status,
    //         //     statusText: statusText,
    //         //     url: req.url,
    //         //     error: body
    //         // });
    //     });
    //}
}