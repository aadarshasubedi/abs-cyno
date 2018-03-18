import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpParams, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import { Observer} from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
import { throttleTime } from 'rxjs/operators/throttleTime';

export class HttpMockRequest<T> {

    pathParams = {};

    constructor(
        private url: string,
        private method: 'POST' | 'GET' | 'PUT' | 'DELETE',
        private response: (req: HttpRequest<T>) => HttpResponse<T> | HttpErrorResponse ) {}

    match(req: HttpRequest<T>) {
        return this.eqUrl(req) && this.eqMethod(req);
    }

    doResponse(req: HttpRequest<T>): Observable<HttpResponse<T> | HttpErrorResponse> {
        const debounceFn: any = throttleTime(20000);
       return new Observable((observer: Observer<HttpResponse<T> | HttpErrorResponse>) => {
            const res = this.response(req.clone({params: new HttpParams({ fromObject: this.pathParams})}));
            setTimeout(() => {
                if (res instanceof HttpErrorResponse) {
                    observer.error(res);
                } else {
                    observer.next(res);
                }
            }, 1000);
        });
     }

    /**
     * HttpMockRequest.url格式:
     *      /path/:param/user === /path/123/user
     * @param req
     */
    private eqUrl(req: HttpRequest<T>) {

        this.pathParams = {};

        if (!req.url && !this.url) {
            return false;
        }
        if (req.url === this.url) {
            return true;
        }

        const r: Array<string> = this.urlSpit(req.url);
        const r1: Array<string> = this.urlSpit(this.url);

        if (r.length !== r1.length) {
            return false;
        }

        for (let i = 0; i < r1.length; i++) {
            let _v: any;
            let _k: any = r1[i];
            if (_k.indexOf('\:') === 0) {
                _v = r[i];
                _k = _k.substring(_k.indexOf('\:') + 1);
                if (!_k.trim()) {
                    return false;
                }
                this.pathParams[_k] = _v;
                continue;
            }
            if (_k !== r[i]) {
                return false;
            }
        }
        return true;
    }

    private eqMethod(req: HttpRequest<T>) {
        return this.method.toLowerCase() === req.method.toLowerCase();
    }

    private urlSpit(url: string): Array<string> {
        url = url.trim();
        const index: any = url.indexOf('\/');
        if (index === 0) {
            url = url.substring(index + 1);
        }
        if ( url.indexOf('?') > 0){
            url = url.substring(0, url.indexOf('?'));
        }
        return url.split('\/');
    }
}