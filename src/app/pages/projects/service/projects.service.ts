import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsonMap } from '../../../../sdk/services';
import { Observable } from 'rxjs/Observable';
import { Options } from '../projects.options';
import { scan } from 'rxjs/operators/scan';
import { map } from 'rxjs/operators/map';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class ProjectsService {

    constructor(private http: HttpClient){}

    getProjects(params: HttpParams): Observable<any>{
        return this.http.get(Options.getProjects.url, {params: params})
            .pipe(
                jsonMap(),
                map((p: any) => {
                    return {pageSize: p.pageSize, pageIndex: p.pageNo, count: p.count, data: p.list};
                }),
                scan((seed: any, data, index) => { //分组转换
                    const r: Array<any> = [];
                    const datalist = data.data;
                    const keys: Map<any, any> = new Map<any, any>();
                    datalist.forEach(item => {
                        let g = item[Options.getProjects.groupField];
                        if (!keys.has(g)) {
                            keys.set(g, {
                                proposalId: item.proposalId,
                                projectShortName: item.projectShortName,
                                projectType: item.projectType,
                                sponsorOrg: item.sponsorOrg,
                                valueDate: item.valueDate,
                                isFavorites: item.isFavorites,
                                list: [item]
                            });
                            r.push(keys.get(g));
                            return;
                        }
                        keys.get(g).list.push(item);
                    });
                    data.list = r;
                    return data;
                },
            true ));
    }

    getMarkets() {
        return this.http.get(Options.getMarkets.url).pipe(jsonMap());
    }

    addToFavorites(proposalId) {
        return this.http.get(Options.addToFavorites.url, {params: new HttpParams({
            fromObject: {
                proposalId: proposalId
            }
        })}).pipe(jsonMap());
    }

    getAssetTypes() {
        return this.http.get(Options.getAssetTypes.url, {}).pipe(jsonMap());
    }

    getSponsorOrg() {
        return this.http.get(Options.getSponsorOrg.url, {}).pipe(jsonMap());
    }
}