import {Injectable} from '@nestjs/common';
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {plainToInstance} from "class-transformer";
import {catchError} from "rxjs/operators";
import {DraftInDTO,DraftOutDTO} from "./draft.dto";

@Injectable()
export class DraftService {

  private baseUrl:string;

  constructor(private readonly httpService: HttpService,
              private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_EDITOR_HOST') + '/edits';
  }

  async getDraft(currentUser: string, draftId:number):Promise<DraftOutDTO>{
    return await firstValueFrom(
      this.httpService.get<DraftOutDTO>(`${this.baseUrl}/${draftId}`,
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(DraftOutDTO,data);
        })
      )
    );
  }

  async getDrafts(currentUser: string, qid: string):Promise<DraftOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<DraftOutDTO[]>(`${this.baseUrl}`,
        {
          headers:{"user-id":currentUser},
          params:{operation_qid:qid,status:'DRAFT'}
        } as any).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(DraftOutDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  async addDraft(currentUser:string, draftDetails: DraftInDTO):Promise<DraftOutDTO>{
    draftDetails.user_id=currentUser;
    draftDetails.status = 'DRAFT';
    return await firstValueFrom(
      this.httpService.post<DraftOutDTO>(`${this.baseUrl}`,draftDetails,
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(DraftOutDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  async editDraft(currentUser: string, draftId:number, draftDetails: DraftInDTO):Promise<DraftOutDTO>{
    delete draftDetails.operation_qid;
    delete draftDetails.edit_name;
    console.log("DRAFT_DETAILS",draftDetails);
    return await firstValueFrom(
      this.httpService.put<DraftOutDTO>(`${this.baseUrl}/${draftId}`,draftDetails,
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(DraftOutDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  async deleteDraft(currentUser: string, draftId: number):Promise<boolean>{
    return await firstValueFrom(
      this.httpService.delete<any>(`${this.baseUrl}/${draftId}`,
        {headers:{"user-id":currentUser}} as any).pipe(
        map(()=>{
          return true;
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  handlingCatchError(err){
    console.error("Error on Draft service:",err.response.data)
    return throwError(err.response);
  }

}
