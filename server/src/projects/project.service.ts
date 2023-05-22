import {Injectable} from "@nestjs/common";
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



@Injectable()
export class ProjectService {

  private readonly baseUrl:string;

  constructor(private readonly httpService: HttpService, private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_QUERY_HOST');
  }

  async projectSearch(params: ProjectSearchInDto):Promise<ProjectSearchWrapperOutDto>{
    return await firstValueFrom(
      this.httpService.get<ProjectSearchWrapperOutDto>(`${this.baseUrl}/search/project`,{
        params: params
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
        params: params
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

  handlingCatchError(err){
    console.error("Error on Query service:",err.response.data)
    return throwError(err.response);
  }


}
