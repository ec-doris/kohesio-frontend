import {Injectable} from "@nestjs/common";
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {plainToInstance} from "class-transformer";
import {ConfigService} from "@nestjs/config";
import {catchError} from "rxjs/operators";
import {StatisticsOutDto} from "./dtos/out/statistics.out.dto";
import {BasicFilterOutDto} from "./dtos/out/basic-filter.out.dto";
import {ProjectSearchInDto} from "./dtos/in/project-search.in.dto";
import {ProjectSearchWrapperOutDto} from "./dtos/out/project-search.out.dto";
import {ProjectInDto} from "./dtos/in/project.in.dto";
import {ProjectOutDto} from "./dtos/out/project.out.dto";

@Injectable()
export class QueryService {

  private baseUrl:string;

  constructor(private readonly httpService: HttpService, private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_QUERY_HOST');
  }

  async getStatistics():Promise<StatisticsOutDto>{
    return await firstValueFrom(
      this.httpService.get<StatisticsOutDto>(`${this.baseUrl}/statistics`).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(StatisticsOutDto,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getBasicFilter(type:string, params: any):Promise<BasicFilterOutDto[]>{
    return await firstValueFrom(
      this.httpService.get<BasicFilterOutDto[]>(`${this.baseUrl}/${type}`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(BasicFilterOutDto, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
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
