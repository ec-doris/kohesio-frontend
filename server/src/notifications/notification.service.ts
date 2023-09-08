import {Injectable} from '@nestjs/common';
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {plainToInstance} from "class-transformer";
import {catchError} from "rxjs/operators";
import {NotificationOutDTO} from "./notification.dto";
import {EditVersionDTO} from "../edits/edit.dto";

@Injectable()
export class NotificationService {

  private baseUrl:string;

  constructor(private readonly httpService: HttpService,
              private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_EDITOR_HOST') + '/notifications';
  }

  async getNotifications(currentUser: string, seen?: boolean):Promise<NotificationOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<NotificationOutDTO[]>(`${this.baseUrl}`,
        {
          headers:{"user-id":currentUser},
          paramsSerializer: {
            indexes: null
          },
          params:{
            seen:seen
          }
        } as any).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(NotificationOutDTO,data,{enableImplicitConversion: true});
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  async getNotificationsCount(currentUser: string):Promise<number>{
    return await firstValueFrom(
      this.httpService.get<number>(`${this.baseUrl}/count-unseen`,
        {
          headers:{"user-id":currentUser}
        } as any).pipe(
        map((result:any)=>{
          return result.data.count;
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  async markAsRead(currentUser: string, notificationId: string):Promise<string>{
    return await firstValueFrom(
      this.httpService.put<any>(`${this.baseUrl}/${notificationId}`,{},
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          return result.data;
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  handlingCatchError(err){
    //console.error("Error on Edit service:",err.response.data)
    return throwError(err.response);
  }

}
