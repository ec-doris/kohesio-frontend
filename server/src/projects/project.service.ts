import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {plainToInstance} from "class-transformer";
import {catchError} from "rxjs/operators";
import {
  ProjectImageSearchWrapperOutDto, ProjectInDto,
  ProjectOutDto,
  ProjectSearchInDto,
  ProjectSearchWrapperOutDto
} from "./project.dto";
import {UserDTO} from "../users/dtos/user.dto";
import axios, { AxiosResponse } from 'axios';



@Injectable()
export class ProjectService {

  private readonly baseUrl:string;

  constructor(private readonly httpService: HttpService, private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_QUERY_HOST');
  }

  async projectSearch(params: ProjectSearchInDto):Promise<ProjectSearchWrapperOutDto>{
    return await firstValueFrom(
      this.httpService.get<ProjectSearchWrapperOutDto>(`${this.baseUrl}/search/project`,{
        params: params,
        paramsSerializer: {
          indexes: null
        }
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(ProjectSearchWrapperOutDto, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async projectSearchImage(params: ProjectSearchInDto):Promise<ProjectImageSearchWrapperOutDto>{
    return await firstValueFrom(
      this.httpService.get<ProjectImageSearchWrapperOutDto>(`${this.baseUrl}/search/project/image`,{
        params: params,
        paramsSerializer: {
          indexes: null
        }
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(ProjectImageSearchWrapperOutDto, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getFileCsv(type: string, params: ProjectSearchInDto): Promise<AxiosResponse> {
    const url = `${this.baseUrl}/search/project/${type}`;
    try {
      return await axios({ url, method: 'GET', params, responseType: 'stream' });
    } catch (error) {
      throw new HttpException('Error downloading the file', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
  async getFile(type: string, params: ProjectSearchInDto):Promise<any>{
    return this.httpService.axiosRef.get(`${this.baseUrl}/search/project/${type}`, {
      params: params,
      responseType: 'stream'
    });
  }
  async project(params: ProjectInDto):Promise<ProjectOutDto>{
    return await firstValueFrom(
      this.httpService.get<ProjectOutDto>(`${this.baseUrl}/project`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(ProjectOutDto, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  canEdit(user:UserDTO, project:ProjectOutDto):boolean{
    if (user.role == 'ADMIN'){
      return true;
    }
    if (user.role == 'USER'){
      return false;
    }
    let project_cci = project.program && project.program.length ? project.program[0].link : undefined;
    if (!project_cci){
      return false;
    }
    project_cci = project_cci.replace("https://linkedopendata.eu/entity/","");
    const found = user.allowed_cci_qids.find((cci:string)=>{
      return project_cci == cci;
    })
    return found ? true : false;
  }

  canApprove(user:UserDTO, project:ProjectOutDto):boolean{
    if (user.role == 'ADMIN'){
      return true;
    }
    const canEdit = this.canEdit(user,project);
    if (!canEdit){
      return false;
    }
    if (user.role == 'REVIEWER'){
      return true;
    }
    return false;
  }

  handlingCatchError(err){
    console.error("Error on Query service:",err.response.data)
    return throwError(err.response);
  }


}
