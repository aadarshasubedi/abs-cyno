import { Injectable, Injector } from '@angular/core';
import { HttpXhrBackend, XhrFactory, HttpRequest, HttpEvent, HttpBackend, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import {Observer} from 'rxjs/Observer';
import {HttpMockServer} from './HttpMockServer';
import { switchMap } from 'rxjs/operators/switchMap';
import {of} from 'rxjs/observable/of';
import { HTTP_JYEXCEPTION_ANALYSIS, HTTP_JYEXCEPTION_DESC, HttpExceptionAnalysis, HttpExceptionFindDecision } from './interface';



@Injectable()
export class HttpMockXhrbackend implements HttpBackend {

    private xhrBackend: HttpXhrBackend;

    constructor(
        private xhrFactory: XhrFactory,
        private mockServer: HttpMockServer,
        private injector: Injector
    ) {
        this.xhrBackend = new HttpXhrBackend(xhrFactory);
    }

    handle(req: HttpRequest<any>): Observable<HttpEvent<any> | any> {
        //异常处理
        const resp: Observable<any> = (this.mockServer.doRequst(req) || this.xhrBackend.handle(req));
        return resp.pipe(switchMap((resp: any) => {
            const exceptionDesc = this.injector.get(HTTP_JYEXCEPTION_DESC, null);
            if  (!exceptionDesc) {
                return of(resp);
            }
            const r = exceptionDesc.decision(resp);
            if (r) {
               return _throw(r);
            }
            return of(resp);
        }));
    }

}