import { Injectable } from '@nestjs/common';
import {firstValueFrom, map} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {UserInDto} from "./dtos/user.in.dto";
import {plainToInstance} from "class-transformer";

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

}
