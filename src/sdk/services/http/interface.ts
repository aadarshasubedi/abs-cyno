import { NgModule, Injectable, Injector, InjectionToken } from '@angular/core';

//200状态下  Http异常判断
export interface HttpExceptionFindDecision{

    decision(respObj): {[name: string]:  any};
}

//异常解析
export interface HttpExceptionAnalysis{
    analysis(respObj): {[name: string]:  any};
}

export const HTTP_JYEXCEPTION_DESC = new InjectionToken<HttpExceptionFindDecision>('HTTP_JYEXCEPTION_DESC');

export const HTTP_JYEXCEPTION_ANALYSIS = new InjectionToken<HttpExceptionFindDecision>('HTTP_JYEXCEPTION_ANALYSIS');
