import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Statistics } from '../models/statistics.model';
import { plainToInstance } from 'class-transformer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

    private url:string = environment.api + '/queries/stats';

    constructor(private http: HttpClient) {}

    getKeyFigures(): Observable<Statistics>  {
        return this.http.get<any>(this.url).pipe(
            map((data:Object) => {
                return plainToInstance(Statistics, data);
            })
        );
    }

}
