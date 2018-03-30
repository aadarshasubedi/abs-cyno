import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsonMap } from '../../../../sdk/services';
import { Observable } from 'rxjs/Observable';
import { Options } from '../projects.options';
import { scan } from 'rxjs/operators/scan';
import { map } from 'rxjs/operators/map';

@Injectable()
export class ProjectsService {

    tag = 0;

    constructor(private http: HttpClient){}

    getProjects(params: Map<string, any>): Observable<any>{
        return this.http.get(Options.getProjects.url, {})
            .pipe(
                jsonMap(),
                map((p: any) => {
                    return {pageSize: params.get('pageSize'), pageIndex: params.get('pageIndex'), total: 1000, data: p.list};
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
                                projectShortName: item.projectShortName + (this.tag++),
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
}