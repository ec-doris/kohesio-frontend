import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {EMPTY, Observable, throwError} from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {environment} from "../../environments/environment";
import {Edit, EditVersion} from "../models/edit.model";

@Injectable({
  providedIn: 'root'
})
export class EditService {

    private readonly url:string = '/edits';
    private readonly url_version:string = '/edits/version';

    constructor(private http: HttpClient,
                @Inject(PLATFORM_ID) private platformId: Object) {
      this.url = environment.api + this.url;
      this.url_version = environment.api + this.url_version;
    }

    getLatestVersion(params: any): Observable<Edit>{
      return this.http.get<any>(this.url_version,{
        params:params
      }).pipe(
        map((data:Object) => {
          return plainToInstance(Edit, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    getEdit(editId: number): Observable<Edit>{
      return this.http.get<any>(`${this.url}/get/${editId}`).pipe(
        map((data:Object) => {
          return plainToInstance(Edit, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    list(params:any): Observable<Edit[]> {
      return this.http.get<any>(this.url,{
        params:params
      }).pipe(
        map((data:Object[]) => {
          return plainToInstance(Edit, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    createVersion(params: EditVersion): Observable<EditVersion>{
      return this.http.post(this.url_version,params
      ).pipe(
        map((data:Object) => {
          return plainToInstance(EditVersion, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    getVersion(version_id:number): Observable<EditVersion>{
      return this.http.get<any>(`${this.url_version}/${version_id}`).pipe(
        map((data:Object) => {
          return plainToInstance(EditVersion, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    deleteVersion(version_id:number): Observable<EditVersion>{
      return this.http.delete<any>(`${this.url_version}/${version_id}`).pipe(
        map((data:Object) => {
          return plainToInstance(EditVersion, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    submit(qid:string, id:number, label: string, summary: string, language: string): Observable<Edit> {
      return this.http.put(this.url,{
        qid:qid,
        id:id,
        label:label,
        summary:summary,
        language:language}
      ).pipe(
        map((data:Object) => {
          return plainToInstance(Edit, data);
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
          return plainToInstance(Edit, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

}
