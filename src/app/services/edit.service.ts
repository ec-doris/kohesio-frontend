import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {EMPTY, Observable, throwError} from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {Draft} from "../models/draft.model";

@Injectable({
  providedIn: 'root'
})
export class EditService {

    private readonly url:string = '/edits';

    constructor(private http: HttpClient,
                @Inject(PLATFORM_ID) private platformId: Object) {
      this.url = environment.api + this.url;
    }

    list(params:any): Observable<Draft[]> {
      return this.http.get<any>(this.url,{
        params:params
      }).pipe(
        map((data:Object[]) => {
          return plainToInstance(Draft, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    submit(qid:string, id:number, label: string, summary: string, language: string): Observable<Draft> {
      return this.http.put(this.url,{
        qid:qid,
        id:id,
        label:label,
        summary:summary,
        language:language}
      ).pipe(
        map((data:Object) => {
          return plainToInstance(Draft, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    action(id:number,action:string){
      return this.http.get(`${this.url}/${id}/${action}`).pipe(
        map((data:Object) => {
          return plainToInstance(Draft, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

}
