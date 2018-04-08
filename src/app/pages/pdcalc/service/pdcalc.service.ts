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
     */
    initPdCalsResult(securitiesId: any, proposalId: any) {
        return this.http.get(Options.initPdCalsResult.url, {params: {securitiesId: securitiesId, proposalId: proposalId}}).pipe(jsonMap());
    }

    /**
     * 获取系统测算参数
     * @param proposalId 产品ID
     */
    initPdCalcPara(proposalId: string){
        return this.http.get(Options.initPdCalcPara.url, {params: {proposalId: proposalId, initType: 'S'}}).pipe(jsonMap());
    }
}