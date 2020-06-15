import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Project} from "../shared/models/project.model";
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Filters} from "../shared/models/filters.model";
import {environment} from "../../environments/environment";
import {ProjectDetail} from "../shared/models/project-detail.model";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    constructor(private http: HttpClient) { }

    getProjects(filters:Filters): Observable<Project[]>  {
        const urlProjects = environment.api;
        let params = {};
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
        return this.http.get<any>(urlProjects,{ params: <any>params }).pipe(
            map(data => {
                if (!data){
                    return [];
                }else {
                    return data.map(data => {
                        return new Project().deserialize(data);
                    });
                }
            })
        );
    }

    getProjectDetail(id: string): Observable<ProjectDetail> {
        const url = environment.api + '/project';
        let params = {
            id: environment.entityURL + id
        };
        return this.http.get<any>(url, { params: <any>params }).pipe(
            map(data => {
                if (!data){
                    return undefined;
                }else {
                    return new ProjectDetail().deserialize(data);
                }
            })
        );
    }

}
