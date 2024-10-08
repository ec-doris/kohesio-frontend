import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { filter, Observable, of, throwError } from 'rxjs';
import {Filters} from "../models/filters.model";
import {environment} from "../../environments/environment";
import {ProjectDetail} from "../models/project-detail.model";
import {ProjectList} from "../models/project-list.model";


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    constructor(private http: HttpClient, @Inject(LOCALE_ID) public locale: string) {
    }

    getProjects(filters:Filters, offset: number = 0, limit: number = 15): Observable<ProjectList>{
        const url = environment.api + '/projects';
        const params = this.generateParameters(filters.getProjectsFilters(), offset, limit);
        return this.http.get<any>(url, { params })
          .pipe(filter(x => !!x), map(data => new ProjectList().deserialize(data)));
    }

    getAssets(filters: Filters,offset: number = 0, limit: number = 15): Observable<any>{
        const url = environment.api + '/projects/image';
        const params = this.generateParameters(filters.getAssetsFilters(), offset, limit);
        return this.http.get<any>(url,{ params: <any>params });
    }

    generateParameters(filters:any, offset: number = 0, limit: number = 15){
        let params = {};
        if (limit !== -1){
            params = {
                offset: offset,
                limit: limit
            };
        }
        params = Object.assign(
            params,
            filters,
          {language: this.locale});
        return params;
    }

    getProjectDetail(id: string | null, locale = this.locale): Observable<ProjectDetail> {
        const url = environment.api + '/projects/'+id;
        let params = {
            id: environment.entityURL + id,
            language: locale
        };
        return this.http.get<any>(url, { params: <any>params }).pipe(
            map((data:any) => {
                return new ProjectDetail().deserialize(data);
            }));
    }

    getFile(filters: Filters, type: string):Observable<any>{
        const url = environment.api + "/projects/download/" + type;
        const params:any = filters.getProjectsFilters();
        if (Array.isArray(params.categoryOfIntervention)) {
          params.categoryOfIntervention = params.categoryOfIntervention.join(',');
        }
        params.language = this.locale;
        return this.http.get(url,{
            responseType: 'arraybuffer',
            params:<any>params
        });
    }

}
