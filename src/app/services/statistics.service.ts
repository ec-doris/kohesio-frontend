import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

    constructor(private http: HttpClient) { }

    getKeyFigures(): Observable<any>  {
        const url = environment.api + '/statistics';
        return this.http.get<any>(url).pipe(
            map(data => {
                return data;
            })
        );
    }

}
