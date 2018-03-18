import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {HttpMockRequest} from './HttpMockRequest';

@Injectable()
export class HttpMockServer {

    private datas: Array<HttpMockRequest<any>> = [];

    private create(method: 'POST' | 'GET' | 'PUT' | 'DELETE', url: string,
        response: (req: HttpRequest<any>) => HttpResponse<any> | HttpErrorResponse): void {
        this.datas.push(new HttpMockRequest(url, method, response));
    }

    createGet(url: string, response: (req: HttpRequest<any>) => HttpResponse<any> | HttpErrorResponse ): void {
        this.create('GET', url, response);
    }

    createPost(url: string, response: (req: HttpRequest<any>) => HttpResponse<any> | HttpErrorResponse): void {
        this.create('POST', url, response);
    }

    createPut(url: string, response: (req: HttpRequest<any>) => HttpResponse<any> | HttpErrorResponse): void {
        this.create('PUT', url, response);
    }

    createDelete(url: string, response1: (req: HttpRequest<any>) => HttpResponse<any> | HttpErrorResponse): void{
        this.create('DELETE', url, response1);
    }

    doRequst(req: HttpRequest<any>): Observable<HttpResponse<any> | HttpErrorResponse> {
        const one = this.datas.filter(item => item.match(req));
        if (one.length > 0) {
            return one[0].doResponse(req);
        }
        return null;
    }
}