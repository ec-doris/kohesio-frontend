import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
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

    getProjects(filters:Filters, offset: number = 0, limit: number = 15): Observable<ProjectList | null>{
        const url = environment.apiBaseUrl + '/search/project';
        const params = this.generateParameters(filters.getProjectsFilters(), offset, limit);
        return this.http.get<any>(url,{ params: <any>params }).pipe(
            map(data => {
                if (!data){
                    return null;
                }else {
                    return new ProjectList().deserialize(data);
                }
            })
        );
    }

    getAssets(filters: Filters,offset: number = 0, limit: number = 15): Observable<any>{
        const url = environment.apiBaseUrl + '/search/project/image';
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

    getProjectDetail(id: string | null): Observable<ProjectDetail> {
        const url = environment.apiBaseUrl + '/project';
        let params = {
            id: environment.entityURL + id,
            language: this.locale
        };
        return this.http.get<any>(url, { params: <any>params }).pipe(
            map((data:any) => {
                return new ProjectDetail().deserialize(data);
            }));
        /*return this.http.get<any>(url, { params: <any>params }).pipe(
            map(data => {
                if (!data){
                    throwError('Data is inconsistent');
                }else {
                    const result: ProjectDetail = new ProjectDetail().deserialize(data);
                    return result;
                }
            })
        );*/
    }

    getFile(filters: Filters, type: string):Observable<any>{
        const url = environment.apiBaseUrl + "/search/project/" + type;
        const params = filters.getProjectsFilters();
        return this.http.get(url,{
            responseType: 'arraybuffer',
            params:<any>params
        });
    }

}
