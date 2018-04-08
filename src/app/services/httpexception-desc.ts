import { Injectable } from '@angular/core';
import { HTTP_JYEXCEPTION_DESC, HttpExceptionFindDecision } from '../../sdk/services/http/interface';
import { AppConfig  } from '../app.config';

@Injectable()
export class HttpExceptionDescImpl implements HttpExceptionFindDecision {

    constructor(private appConfig: AppConfig){}

    decision(respObj): {[name: string]:  any}{
        return this.appConfig.exceptionDecision(respObj);
    }
}