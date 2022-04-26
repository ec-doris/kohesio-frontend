import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Statistics } from '../models/statistics.model';
import { plainToClass } from 'class-transformer';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

    private url:string = '/statistics';

    constructor(private http: HttpClient,
                private configService: ConfigService) { 
        
        if (configService && configService.apiBaseUrl){
            this.url = configService.apiBaseUrl + this.url;
        }

    }

    getKeyFigures(): Observable<Statistics>  {
        return this.http.get<Statistics>(this.url).pipe(
            map((data:any) => {
                return plainToClass(Statistics, data);
            })
        );
    }

}
