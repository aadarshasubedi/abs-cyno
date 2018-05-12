import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsonMap } from '../../../../sdk/services';
import { Observable } from 'rxjs/Observable';
import { Options } from '../pdcals.options';

@Injectable()
export class PdcalsService {

    constructor(private http: HttpClient) {}

    /**
     * 获取产品证信息
     * @param securitiesId 产品Id
     */
    getSecsInfoById(securitiesId: any, proposalId: any): Observable<any> {
        return this.http.get(Options.getSecsInfoById.url, {params: {securitiesId: securitiesId, proposalId: proposalId}}).pipe(jsonMap());
    }

    /**
     * 获取产品证券结构信息
     * @param proposalId
     */
    getSecscommList(proposalId: string){
        return this.http.get(Options.secscommList.url, {params: {proposalId: proposalId}}).pipe(jsonMap());
    }

    /**
     * 获取收益率分布统计数据
     * @param projectId 项目Id
     *  @param proposalId 证券Id
     * @param hasCustomerCesuan 是否自定义测算
     */
    initPdCalsResult(securitiesId: any, proposalId: any, hasCustomerCesuan?: boolean, initType?: string) {
        const _url = hasCustomerCesuan === true ?  Options.initPdCalsResult.url1 : Options.initPdCalsResult.url;
        return this.http.get(_url, 
            {params: {securitiesId: securitiesId, proposalId: proposalId, initType: initType ? initType : 'S'}}).pipe(jsonMap());
    }

    /**
     * 获取系统测算参数
     * @param proposalId 产品ID
     */
    initPdCalcPara(proposalId: string, initType?: string){
        return this.http.get(Options.initPdCalcPara.url,
            {params:{proposalId: proposalId, initType: (initType ? initType : 'S')}}).pipe(jsonMap());
    }

    /**
     * 收益率测算
     * @param param
     */
    doPdCalc(param) {
        const proposalId = param.proposalId;
        const securitiesId = param.securitiesId;
        delete param.proposalId;
        delete param.securitiesId;
        return this.http.post(Options.doPdCalc.url + '?proposalId=' + proposalId +
            '&securitiesId=' + securitiesId, param).pipe(jsonMap());
    }

    /**
     * 保存测算结果
     */
    savePdCalc(proposalId: string) {
        return this.http.get(Options.savePdCalc.url, {params: {proposalId: proposalId}}).pipe(jsonMap());
    }

    savePrCalc(proposalId: string){
        return this.http.get(Options.savePrCalc.url, {params: {proposalId: proposalId}}).pipe(jsonMap());
    }

    /**
     * 获取压力情景默认参数
     * @param proposalId 产品ID
     * @param initType 
     */
    iniPressurescePage(proposalId: string, initType?: string) {
        return this.http.get(Options.iniPressurescePage.url, 
            {params: { proposalId: proposalId, initType: initType ? initType : 'S' }}).pipe(jsonMap());
    }

    /**
     * 获取更多测算结果
     * @param resultId 
     */
    getPrCalcExtres(resultId: string) {
        return this.http.get(Options.getPrCalcExtres.url, {params: { resultId: resultId}}).pipe(jsonMap());
    }

    doPrCalcByPara(proposalId: string, params: any) {
        return this.http.post(Options.doPrCalcByPara.url + '?proposalId=' + proposalId, params).pipe(jsonMap());
    }
}