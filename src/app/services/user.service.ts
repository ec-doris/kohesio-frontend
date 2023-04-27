import {Inject, Injectable, Injector, LOCALE_ID, Optional, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {EMPTY, firstValueFrom, Observable} from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {isPlatformServer} from "@angular/common";
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private readonly url:string = '/user';

    public user?:User;

    constructor(private http: HttpClient,
                @Inject(PLATFORM_ID) private platformId: Object) {
      this.url = environment.api + this.url;
    }

    getUserDetails(): Observable<User | undefined> {
        /*console.log("GET USER DETAILS");
        const options:any = {};
        if (isPlatformServer(this.platformId)) {
          const cookies = new HttpHeaders();

          let cookieString = Object.keys(this.req.cookies).reduce((accumulator, cookieName) => {
            accumulator += cookieName + '=' + this.req.cookies[cookieName] + ';';
            return accumulator;
          }, '');
          console.log("COOKIES STRING",cookieString);
          cookies.set('Cookie', cookieString)
          options.headers = {
            Cookies: cookieString
          };
          console.log("OPTIONS ON USER REQUEST=",options)
        }*/

        return this.http.get<any>(this.url).pipe(
           map((data:Object) => {
              //console.log("GET USER DETAILS, DATA",data);
              if (Object.keys(data).length) {
                this.user = plainToInstance(User, data);
              }else{
                this.user = undefined;
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

    refreshUser(){
      setTimeout(()=>{
        this.getUserDetails().subscribe((user)=>{
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

}
