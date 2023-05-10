import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {DraftInDto} from "./dtos/draft.in.dto";
import {plainToInstance} from "class-transformer";
import {catchError} from "rxjs/operators";
import {AxiosRequestConfig} from "axios";

@Injectable()
export class DraftService {

  private baseUrl:string;

  constructor(private readonly httpService: HttpService,
              private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_EDITOR_HOST') + '/drafts';
  }

  async getDraft(userId: string, draftId:number):Promise<DraftInDto>{
    return await firstValueFrom(
      this.httpService.get<DraftInDto>(`${this.baseUrl}/${draftId}`,
        {headers:{"user-id":userId}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(DraftInDto,data);
        })
      )
    );
  }

  async getDrafts(userId: string, qid: string):Promise<DraftInDto[]>{
    return await firstValueFrom(
      this.httpService.get<DraftInDto[]>(`${this.baseUrl}`,
        {headers:{"user-id":userId}} as any).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(DraftInDto,data);
        })
      )
    );
  }

  async addDraft(userId:string, qid: string, label:string, summary:string, language:string):Promise<DraftInDto>{
    return await firstValueFrom(
      this.httpService.post<DraftInDto>(`${this.baseUrl}`,{
        operation_qid: qid,
        label: label,
        summary: summary,
        language: language
     },{headers:{"user-id":userId}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(DraftInDto,data);
        }),
        catchError(err => {
          return throwError(err.response);
        })
      )
    );
  }

  async editDraft(userId: string, draftId:number, qid: string, label:string, summary:string, language:string):Promise<DraftInDto>{
    return await firstValueFrom(
      this.httpService.put<DraftInDto>(`${this.baseUrl}/${draftId}`,{
        operation_qid: qid,
        label: label,
        summary: summary,
        language: language
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(DraftInDto,data);
        })
      )
    );
  }

  async deleteDraft(userId: string, draftId: number):Promise<boolean>{
    return await firstValueFrom(
      this.httpService.delete<any>(`${this.baseUrl}/${draftId}`,
        {headers:{"user-id":userId}} as any).pipe(
        map((result:any)=>{
          return true;
        })
      )
    );
  }

}
