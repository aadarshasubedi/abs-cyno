import { Injectable } from '@angular/core';
import { Observable  } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { jsonMap } from '../../../../sdk/services';
import { scan } from 'rxjs/operators/scan';
import { map } from 'rxjs/operators/map';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators/delay';

@Injectable()
export class StatAssetPoolService {

    constructor(private http: HttpClient){}

    /**
     * 获取资产池列表
     * @param params: poolId:资产池代码 projectId项目assetType资产类型dataSource数据来源
     */
    list(params): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/listByPage.do', {
            params: new HttpParams({fromObject: params || {}})
        }).pipe(jsonMap());
    }

    getAssetTypes(): Observable<any> {
        return this.http.get('/cyno/cynoweb/overview/initAssetType.do', {}).pipe(jsonMap());
    }

    queryProjects(): Observable<any> {
        return this.http.get('/cyno/abswebapp/projectmanage/absProjView/findProjNameList.do', {}).pipe(jsonMap());
    }

    querySponsorOrg(): Observable<any>{
        return this.http.get('/cyno/cynoweb/overview/initSponsorOrg.do', {}).pipe(jsonMap());
    }

    queryStaticPool(): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/listByCondition.do', {}).pipe(jsonMap());
    }

    deleteByIds(ids: string): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/delete.do',
        {params: new HttpParams({fromObject: {poolIds: ids}})}).pipe(jsonMap());
    }

    save(data): Observable<any> {
        return this.http.post('/cyno/cynoweb/staticpool/save.do', data).pipe(jsonMap());
    }

    update(data): Observable<any> {
        return this.http.post('/cyno/cynoweb/staticpool/update.do', data).pipe(jsonMap());
    }

    get(poolId): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/getPoolById.do',
        {params: new HttpParams({fromObject: {poolId: poolId}})}).pipe(jsonMap());
    }

    // 累计违约率
    getDefaultRate(poolId): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/getDefaultRate.do',
        {params: new HttpParams({fromObject: {poolId: poolId}})}).pipe(jsonMap());
    }
    // 加权累计违约率
    getTotalWeightedDefaultRate(poolId): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/getTotalWeightedDefaultRate.do',
        {params: new HttpParams({fromObject: {poolId: poolId}})}).pipe(jsonMap());
    }
    // 加权新增违约率
    getNewlyDefaultRate(poolId): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/getNewlyDefaultRate.do',
        {params: new HttpParams({fromObject: {poolId: poolId}})}).pipe(jsonMap());
    }
    // 违约时间分布
    getDefaultYearDistribution(poolId): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/getDefaultYearDistribution.do',
        {params: new HttpParams({fromObject: {poolId: poolId}})}).pipe(jsonMap());
    }
    //累计早偿率
    getPrepaymentRate(poolId): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/getPrepaymentRate.do',
        {params: new HttpParams({fromObject: {poolId: poolId}})}).pipe(jsonMap());
    }
    //加权累计早偿率
    getTotalWeightedPrepaymentRate(poolId): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/getTotalWeightedPrepaymentRate.do',
        {params: new HttpParams({fromObject: {poolId: poolId}})}).pipe(jsonMap());
    }
    //加权新增早偿率
    getNewlyPrepaymentRate(poolId): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/getNewlyPrepaymentRate.do',
        {params: new HttpParams({fromObject: {poolId: poolId}})}).pipe(jsonMap());
    }

    //回归率
    getRecoveryRate(poolId): Observable<any> {
        return this.http.get('/cyno/cynoweb/staticpool/getRecoveryRate.do',
        {params: new HttpParams({fromObject: {poolId: poolId}})}).pipe(jsonMap());
    }

    getCynoStaticPoolDetail(poolId) {
        return this.http.get('/cyno/cynoweb/staticpool/getCynoStaticPoolDetail.do',
        {params: new HttpParams({fromObject: {poolId: poolId}})}).pipe(jsonMap());
    }
}