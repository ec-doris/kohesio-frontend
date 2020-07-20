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
        const params = this.generateParameters(filters, offset, limit);
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

    getMapPoints(filters): Observable<any>{
        const url = environment.api + '/search/project/map';
        const params = this.generateParameters(filters, 0, -1);
        return this.http.get<any>(url,{ params: <any>params }).pipe(
            map(data => {
                if (!data && !data.list){
                    return null;
                }else {
                    return data.list;
                }
            })
        );
    }

    generateParameters(filters:Filters, offset: number = 0, limit: number = 15){
        let params = {};
        if (limit !== -1){
            params = {
                offset: offset,
                limit: limit
            };
        }
        for (const filter in filters){
            if (filters[filter] && filter != 'deserialize') {
                if (Array.isArray(filters[filter])) {
                    if (filters[filter].length) {
                        params[filter] = environment.entityURL + filters[filter].toString();
                    }
                }else {
                    if (filter != 'keywords') {
                        params[filter] = environment.entityURL + filters[filter];
                    }else{
                        params[filter] = filters[filter];
                    }
                }
            }
        }
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
