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
export class DraftService {

    private readonly url:string = '/drafts';

    constructor(private http: HttpClient,
                @Inject(PLATFORM_ID) private platformId: Object) {
      this.url = environment.api + this.url;
    }

    getDrafts(qid: string): Observable<Draft[]> {
      return this.http.get<any>(this.url,{
        params:{
          qid:qid
        }
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

    getDraft(id: number, qid: string): Observable<Draft> {
      return this.http.get<any>(this.url+'/'+id).pipe(
        map((data:Object) => {
          return plainToInstance(Draft, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    addDraft(qid:string, label: string, summary: string, language: string, name:string): Observable<Draft> {
      return this.http.post(this.url,{
        qid:qid,
        label:label,
        summary:summary,
        language:language,
        name:name}
      ).pipe(
        map((data:Object) => {
          return plainToInstance(Draft, data);
        }),
        catchError(err => {
          return throwError(err.error);
        })
      )
    }

    editDraft(id:number, label: string, summary: string, language: string): Observable<Draft> {
      return this.http.put(this.url+'/'+id,{
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

    deleteDraft(id:number): Observable<any> {
      return this.http.delete(this.url+'/'+id).pipe(
        map((data:Object) => {
          return data;
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }


}
