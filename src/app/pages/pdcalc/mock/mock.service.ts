import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse, HttpHeaders, HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { HttpMockServer } from '../../../../sdk/services';
import { Options } from '../pdcals.options';

@Injectable()
export class MockService{
    constructor(private httpMockServer: HttpMockServer) {}

    buildMock(){
        this.createGetProjiectZqjgMock();
    }

    // 产品证券结构
    private createGetProjiectZqjgMock() {
        this.httpMockServer.createGet(Options.getSecsInfoById.url, (req: HttpRequest<any>) => {
            const status: number = 200;
            const statusText: string = 'OK';
            const headers: HttpHeaders = new HttpHeaders();
            const respBody = {datas: []};
            for (let i = 0; i < 8; i++) {
               respBody.datas.push({
                    field1: '60021',
                    field2: '中心证券',
                    field3: '77',
                    field4: '30',
                    field5: '等额本息',
                    field6: '2011-01-01',
                    field7: '2019-01-01',
                    field8: '本金*期数',
                    field9: '0.3'
                });
            }
            headers.append('content-type', ['application/json']);
            return new HttpResponse({
                   headers: headers,
                   status: status,
                   statusText: statusText,
                   url: req.url,
                   body: JSON.stringify(respBody)
            });
        });


    }
}