import {Inject, Injectable, Scope} from '@nestjs/common';
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {UserInDto, UserInternalInDto} from "./dtos/user.in.dto";
import {plainToInstance} from "class-transformer";
import {catchError} from "rxjs/operators";
import {REQUEST} from "@nestjs/core";
import {UserDTO} from "./dtos/user.dto";
import {InvitationInDTO, InvitationOutDTO} from "./dtos/invitation.dto";

@Injectable()
export class UserService {

  private baseUrl:string;

  constructor(private readonly httpService: HttpService,
              private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_EDITOR_HOST');
  }

  async getUser(userid: string):Promise<UserDTO>{
    return await firstValueFrom(
      this.httpService.get<UserDTO>(`${this.baseUrl}/users/${userid}`,
        {headers:{"user-id":userid}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(UserDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getUsersList(currentUser:string):Promise<UserDTO[]>{
    return await firstValueFrom(
      this.httpService.get<UserDTO[]>(`${this.baseUrl}/users`,
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(UserDTO,data,{
            excludeExtraneousValues:true
          });
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async addUser(currentUser:string, userDetails: UserInDto):Promise<UserDTO>{
    console.log("CURRENT_USER",currentUser);
    console.log("USER_DETAILS",userDetails);
    return await firstValueFrom(
      this.httpService.post<UserDTO>(`${this.baseUrl}/users`,
        plainToInstance(UserInternalInDto,userDetails),
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(UserDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async editUser(currentUser:string, userDetails: UserInDto):Promise<UserDTO>{
    return await firstValueFrom(
      this.httpService.put<UserDTO>(`${this.baseUrl}/users/${userDetails.userid}`,
        plainToInstance(UserInternalInDto,userDetails),
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(UserDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async deleteUser(currentUser:string, userid: string):Promise<boolean>{
    return await firstValueFrom(
      this.httpService.delete<any>(`${this.baseUrl}/users/${userid}`,
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          return true;
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async inviteUser(currentUser:string, invitation: InvitationInDTO):Promise<InvitationOutDTO>{
    return await firstValueFrom(
      this.httpService.post<InvitationOutDTO>(`${this.baseUrl}/invitations/send`,
        {
          email:invitation.email,
          role: invitation.role,
          cci_scope: invitation.allowed_cci_qids,
          base_url: `${this.configService.get("BASE_URL")}/api/invitation/`
        },
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(InvitationOutDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async acceptInvitation(email:string, token: string):Promise<boolean>{
    return await firstValueFrom(
      this.httpService.post<boolean>(`${this.baseUrl}/invitations/accept`,
        {
          email:email ? email.toLowerCase() : '',
          token:token
        }).pipe(
        map((result:any)=>{
          return true;
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async loginUser(userid: string):Promise<boolean>{
    return await firstValueFrom(
      this.httpService.get<boolean>(`${this.baseUrl}/login`,
        {headers:{"user-id":userid}} as any).pipe(
        map((result:any)=>{
          return true;
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async validateUser(userEmail: string):Promise<UserDTO>{
    return await firstValueFrom(
      this.httpService.get<UserDTO>(`${this.baseUrl}/login/validate`,
        {params:{"email":userEmail}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(UserDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  private handlingCatchError(err){
    console.error("Error on User service:",err.response.data)
    return throwError(err.response);
  }

}
