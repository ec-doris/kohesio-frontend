import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance} from 'class-transformer';
import { environment } from 'src/environments/environment';
import {ListOfOperation} from "../models/loo.model";

@Injectable({
  providedIn: 'root'
})
export class ListOfOperationService {

  private readonly url:string = '/loo_metadata';

  constructor(private http: HttpClient) {
    this.url = environment.apiBaseUrl + this.url;
  }

  getListOfOperation(): Observable<ListOfOperation[]>  {
    return this.http.get<any>(this.url).pipe(
      map((data:[]) => {
        const results:ListOfOperation[] = plainToInstance(ListOfOperation, data);
        return results;
      })
    );
  }

}
