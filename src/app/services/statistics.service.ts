import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {environment} from "../../environments/environment";
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getKeyFigures(): Observable<any>  {
        const url = this.configService.apiBaseUrl + '/statistics';
        return this.http.get<any>(url).pipe(
            map(data => {
                return data;
            })
        );
    }

}
