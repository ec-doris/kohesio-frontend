import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import { ConfigService } from './config.service';
import { SearchList } from '../models/search-item.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getItems(keywords:string | null, offset: number = 0, limit: number = 15): Observable<SearchList | null>  {
        const url = this.configService.apiBaseUrl + "/search/general";
        const params = {
            keywords: keywords,
            offset: offset,
            limit: limit
        };
        return this.http.get<any>(url,{ params: <any>params }).pipe(
            map(data => {
                if (!data){
                    return null;
                }else {
                    return new SearchList().deserialize(data);
                }
            })
        );
    }

}
