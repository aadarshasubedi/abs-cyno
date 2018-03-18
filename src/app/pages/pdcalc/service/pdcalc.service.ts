import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsonMap } from '../../../../sdk/services';
import { Observable } from 'rxjs/Observable';
import { Options } from '../pdcals.options';

@Injectable()
export class PdcalsService {

    constructor(private http: HttpClient) {}

    /**
     * 获取产品证券结构
     * @param projectId 产品Id
     */
    getProjiectZqjg(projectId: any): Observable<any>{
        return this.http.get(Options.getProjiectZqjg.url, {params: {projectId: projectId}}).pipe(jsonMap());
    }

    /**
     * 获取收益率分布统计数据
     * @param projectId 项目Id
     */
    getProjecctYieldRate(projectId: any) {
        return this.http.get(Options.getProjecctYieldRate.url, {params: {}}).pipe(jsonMap());
    }

}