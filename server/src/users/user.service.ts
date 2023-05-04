import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {UserInDto} from "./dtos/user.in.dto";
import {plainToInstance} from "class-transformer";
import {catchError} from "rxjs/operators";

@Injectable()
export class UserService {

  private baseUrl:string;

  constructor(private readonly httpService: HttpService,
              private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_EDITOR_HOST');
  }

  async getUser(userid: string):Promise<UserInDto>{
    return await firstValueFrom(
      this.httpService.get<UserInDto>(`${this.baseUrl}/users/${userid}`).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(UserInDto,data);
        })
      )
    );
  }

  async getUsersList():Promise<UserInDto[]>{
    return await firstValueFrom(
      this.httpService.get<UserInDto[]>(`${this.baseUrl}/users`).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(UserInDto,data);
        })
      )
    );
  }

  async addUser(userid: string, role: string, active:boolean):Promise<UserInDto>{
    return await firstValueFrom(
      this.httpService.post<UserInDto>(`${this.baseUrl}/users`,{
        user_id: userid,
        role: role,
        active: active
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(UserInDto,data);
        }),
        catchError(err => {
          return throwError(err.response);
        })
      )
    );
  }

  async editUser(userid: string, role: string, active: boolean):Promise<UserInDto>{
    return await firstValueFrom(
      this.httpService.put<UserInDto>(`${this.baseUrl}/users/${userid}`,{
        user_id: userid,
        role: role,
        active: active
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(UserInDto,data);
        })
      )
    );
  }

  async deleteUser(userid: string):Promise<boolean>{
    return await firstValueFrom(
      this.httpService.delete<any>(`${this.baseUrl}/users/${userid}`).pipe(
        map((result:any)=>{
          return true;
        })
      )
    );
  }

}
