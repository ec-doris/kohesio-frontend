import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {EMPTY, Observable, throwError} from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {User} from "../models/user.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private readonly url:string = '/users';

    public user?:User;

    constructor(private http: HttpClient,
                @Inject(PLATFORM_ID) private platformId: Object) {
      this.url = environment.api + this.url;
    }

    getCurrentUser(): Observable<User> {
        return this.http.get<any>(`${this.url}/currentUser`).pipe(
           map((data:Object) => {
              //console.log("GET USER DETAILS, DATA",data);
              if (Object.keys(data).length) {
                this.user = plainToInstance(User, data);
              }else{
                this.user = new User();
              }
             return this.user;
           }),
          catchError(err => {
            console.error("ERR",err);
            this.user = undefined;
            return EMPTY;
          })
      )
    }

    getUsers(): Observable<User[]> {
      return this.http.get<any>(this.url).pipe(
        map((data:Object[]) => {
          return plainToInstance(User, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    addUser(userid:string, role:string, active: boolean): Observable<User> {
      return this.http.post(this.url,{userid:userid, role:role, active: active}).pipe(
        map((data:Object) => {
          return plainToInstance(User, data);
        }),
        catchError(err => {
          //console.error("ERR",err);
          return throwError(err.error);
        })
      )
    }

    editUser(userid:string, role:string, active:boolean): Observable<User> {
      return this.http.put(`${this.url}/${userid}`,{userid:userid, role:role, active:active}).pipe(
        map((data:Object) => {
          return plainToInstance(User, data);
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    deleteUser(userid:string): Observable<any> {
      return this.http.delete(`${this.url}/${userid}`).pipe(
        map((data:Object) => {
          return data;
        }),
        catchError(err => {
          console.error("ERR",err);
          return EMPTY;
        })
      )
    }

    refreshUser(){
      setTimeout(()=>{
        this.getCurrentUser().subscribe((user)=>{
          this.user = user;
        });
        this.refreshUser();
      },5000)
    }

  keepAlive(): Observable<any> {
    return this.http.get<any>('/api/keepAlive').pipe(
      map((data:Object) => {
        return data;
      })
    )
  }

  isAdmin():boolean{
      return this.user && this.user.role == 'ADMIN' ? true : false;
  }

  isLoggedIn():boolean{
      return (typeof this.user !== 'undefined'
        && Object.keys(this.user).length > 0
        && (this.user && this.user.user_id != undefined));
  }

  canEdit():boolean{
    return this.user && (this.user.role == 'EDITOR' ||
      this.user.role == 'REVIEWER' ||
    this.user.role == 'ADMIN') ? true : false;
  }

}
