import {HttpStatus, Injectable} from '@nestjs/common';
import {EMPTY, firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {plainToInstance} from "class-transformer";
import {catchError} from "rxjs/operators";
import {EditInDTO, EditOutDTO, EditVersionDTO, EditVersionInDTO} from "./edit.dto";
import {Status} from "./edit.dto";

@Injectable()
export class EditService {

  private baseUrl:string;
  private baseUrlVersions:string;

  constructor(private readonly httpService: HttpService,
              private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_EDITOR_HOST') + '/edits';
    this.baseUrlVersions = configService.get<string>('BACKEND_EDITOR_HOST') + '/edit-versions';
  }

  async getEdits(currentUser: string, params: EditInDTO):Promise<EditOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<EditOutDTO[]>(`${this.baseUrl}`,
        {
          headers:{"user-id":currentUser},
          params:params
        } as any).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(EditOutDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  async getEdit(currentUser: string, editId:number):Promise<EditOutDTO>{
    return await firstValueFrom(
      this.httpService.get<EditOutDTO>(`${this.baseUrl}/${editId}`,
        {
          headers:{"user-id":currentUser}
        } as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(EditOutDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  async getLatestApprovedVersion(qid:string, language:string):Promise<EditVersionDTO | void>{
    return await firstValueFrom(
      this.httpService.get<EditVersionDTO>(`${this.baseUrl}/latest-approved`,
        {
          params: {
            operation_qid: qid,
            language:language
          }
        } as any).pipe(
        map((result:any)=>{
          //console.log(result);
          const data:Object = result.data;
          return plainToInstance(EditVersionDTO,data);
        }),
        catchError(err => {
          //console.log(err);
          /*if (err.response.status == HttpStatus.NOT_FOUND){
            return EMPTY;
          }else {*/
            return this.handlingCatchError(err);
          //}
        })
      )
    );
  }

  async saveEdit(currentUser:string, editDetails: EditVersionInDTO):Promise<EditVersionDTO>{
    if (editDetails.edit_id){
      return this.updateEdit(currentUser,editDetails);
    }else {
      return this.addEdit(currentUser,editDetails);
    }
  }

  async addEdit(currentUser: string, editDetails: EditVersionInDTO):Promise<EditVersionDTO>{
    editDetails.user_id=currentUser;
    return await firstValueFrom(
      this.httpService.post<EditVersionDTO>(`${this.baseUrl}`,editDetails,
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(EditVersionDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  async updateEdit(currentUser: string, editDetails: EditVersionInDTO):Promise<EditVersionDTO>{
    editDetails.user_id=currentUser;
    return await firstValueFrom(
      this.httpService.put<EditVersionDTO>(`${this.baseUrl}/${editDetails.edit_id}`,editDetails,
        {headers:{"user-id":currentUser}} as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(EditVersionDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  async getEditVersion(currentUser: string, editVersionId:number):Promise<EditVersionDTO>{
    return await firstValueFrom(
      this.httpService.get<EditVersionDTO>(`${this.baseUrlVersions}/${editVersionId}`,
        {
          headers:{"user-id":currentUser}
        } as any).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(EditVersionDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  async deleteEditVersion(currentUser: string, editVersionId:number):Promise<boolean>{
    return await firstValueFrom(
      this.httpService.delete<boolean>(`${this.baseUrlVersions}/${editVersionId}`,
        {
          headers:{"user-id":currentUser}
        } as any).pipe(
        map((result:any)=>{
          return true;
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }

  /*async approve(currentUser: string, id: number):Promise<EditOutDTO>{
    return this.changeStatus(currentUser, id, Status.APPROVE);
  }

  async reject(currentUser: string, id: number):Promise<EditOutDTO>{
    return this.changeStatus(currentUser, id, Status.REJECTED);
  }

  async changeStatus(currentUser: string, id: number, status: Status):Promise<EditOutDTO>{
    const editDetails:EditInDTO = new EditInDTO();
    editDetails.edit_id=id;
    editDetails.status=status;
    return this.updateEdit(currentUser, editDetails);
  }

  async hasEditSubmitted(currentUser: string, qid: string):Promise<boolean>{
    return await firstValueFrom(
      this.httpService.get<boolean>(`${this.baseUrl}`,
        {
          headers:{"user-id":currentUser},
          params:{
            operation_qid: qid,
            status: Status.SUBMITTED
          }
        } as any).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          const edits:EditOutDTO[] = plainToInstance(EditOutDTO,data);
          return edits.length > 0;
        }),
        catchError(err => {
          return this.handlingCatchError(err);
        })
      )
    );
  }*/

  handlingCatchError(err){
    //console.error("Error on Edit service:",err.response.data)
    return throwError(err.response);
  }

}
