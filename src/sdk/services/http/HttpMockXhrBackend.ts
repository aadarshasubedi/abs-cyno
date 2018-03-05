import { Injectable } from '@angular/core';
import { HttpXhrBackend, XhrFactory, HttpRequest, HttpEvent, HttpBackend} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {HttpMockServer} from './HttpMockServer';

@Injectable()
export class HttpMockXhrbackend implements HttpBackend {

    private xhrBackend: HttpXhrBackend;

    constructor(private xhrFactory: XhrFactory, private mockServer: HttpMockServer) {
        this.xhrBackend = new HttpXhrBackend(xhrFactory);
    }

    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return  this.mockServer.doRequst(req) || this.xhrBackend.handle(req);
    }

}