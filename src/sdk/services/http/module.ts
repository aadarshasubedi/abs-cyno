import { NgModule, Injectable, Injector, InjectionToken } from '@angular/core';
import {
    HttpClient,
    HttpClientXsrfModule,
    HttpHandler,
    HttpBackend,
    HttpRequest,
    HttpEvent,
    HTTP_INTERCEPTORS,
    HttpInterceptor,
    XhrFactory
    } from '@angular/common/http';

import {HttpMockServer} from './HttpMockServer';
import {HttpMockXhrbackend} from './HttpMockXhrBackend';
import {Observable} from 'rxjs/Observable';

export { HTTP_JYEXCEPTION_ANALYSIS, HTTP_JYEXCEPTION_DESC, HttpExceptionAnalysis, HttpExceptionFindDecision } from './interface';

@Injectable()
export class HttpInterceptingHandler implements HttpHandler {
  private chain: HttpHandler|null = null;

  constructor(private backend: HttpBackend, private injector: Injector) {}

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (this.chain === null) {
      const interceptors = this.injector.get(HTTP_INTERCEPTORS, []);
      this.chain = interceptors.reduceRight(
          (next, interceptor) => new HttpInterceptorHandler(next, interceptor), this.backend);
    }
    return this.chain.handle(req);
  }
}

export class HttpInterceptorHandler implements HttpHandler {
    constructor(private next: HttpHandler, private interceptor: HttpInterceptor) {}
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
      return this.interceptor.intercept(req, this.next);
    }
  }

@Injectable()
export class BrowserXhr1 implements XhrFactory {
  constructor() {}
  build(): any { return <any>(new XMLHttpRequest()); }
}

@NgModule({
    imports: [
        HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN',
            headerName: 'X-XSRF-TOKEN',
        })
    ],
    providers: [
        HttpClient,
        HttpMockServer,
        HttpMockXhrbackend,
        {provide: HttpHandler, useClass: HttpInterceptingHandler},
        {provide: HttpBackend, useExisting: HttpMockXhrbackend},
        BrowserXhr1,
        {provide: XhrFactory, useExisting: BrowserXhr1}
    ]
})
export class SdkHttpModule { }