import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Filters} from "../shared/models/filters.model";
import {environment} from "../../environments/environment";
import {ProjectDetail} from "../shared/models/project-detail.model";
import {ProjectList} from "../shared/models/project-list.model";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    constructor(private http: HttpClient) { }

    getProjects(filters:Filters, offset: number = 0, limit: number = 15): Observable<ProjectList>  {
        const url = environment.api + '/search/project';
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
        const url = environment.api + '/search/project/image';
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
            filters);
        return params;
    }

    getProjectDetail(id: string): Observable<ProjectDetail> {
        const url = environment.api + '/project';
        let params = {
            id: environment.entityURL + id
        };
        return this.http.get<any>(url, { params: <any>params }).pipe(
            map(data => {
                if (!data){
                    throwError('Data is inconsistent');
                }else {
                    return new ProjectDetail().deserialize(data);
                }
            })
        );
    }

}
