import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {EMPTY, Observable, throwError} from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {environment} from "../../environments/environment";
import {Notification} from "../models/notification.model"

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    private readonly url:string = '/notifications';

    constructor(private http: HttpClient,
                @Inject(PLATFORM_ID) private platformId: Object) {
      this.url = environment.api + this.url;
    }

    getNotifications(seen?:boolean): Observable<Notification[]>{
      return this.http.post<any>(this.url,{
        seen:seen
      }).pipe(
        map((data:Object[]) => {
          return plainToInstance(Notification, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

  markAsRead(id:number): Observable<boolean>{
    return this.http.get<any>(`${this.url}/mark-as-read/${id}`).pipe(
      map((data:Object) => {
        return true;
      }),
      catchError(err => {
        console.error("ERR",err);
        return EMPTY;
      })
    )
  }

}
