import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Filters} from "../models/filters.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MapService {

    constructor(private http: HttpClient) { }

    public getMapInfo(filters?: Filters, granularityRegion?: string): Observable<any>{
        const url = environment.apiBaseUrl + '/search/project/map';
        let params:any = {}
        if (filters){
            params = Object.assign(filters.getMapProjectsFilters());
        }
        if (granularityRegion){
            params.granularityRegion = granularityRegion;
        }
        return this.http.get<any>(url,{ params: <any>params }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public getPointsNearBy(): Observable<any>{
        const url = environment.apiBaseUrl + '/map/nearby';
        return this.http.get<any>(url).pipe(
            map(data => {
                return data;
            })
        );
    }

    public getProjectsPerCoordinate(coordinates: string, filters?: Filters): Observable<any>{
        const url = environment.apiBaseUrl + '/search/project/map/point';
        let params:any = {}
        if (filters){
            params = Object.assign(filters.getProjectsFilters());
        }
        params.coordinate = coordinates;
        return this.http.get<any>(url,{ params: <any>params }).pipe(
            map(data => {
                return data;
            })
        );
    }

}
