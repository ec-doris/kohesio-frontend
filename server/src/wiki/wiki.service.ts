import {Injectable} from "@nestjs/common";
import {Statistics} from "./dtos/statistics.in.dto";
import {firstValueFrom, map} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {plainToInstance} from "class-transformer";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class WikiService{

  private baseUrl:string;

  constructor(private readonly httpService: HttpService, private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_QUERY_HOST');
  }

  async getStatistics():Promise<any>{
    return await firstValueFrom(
      this.httpService.get<Statistics>(`${this.baseUrl}/statistics`).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return data;
          //return plainToInstance(Statistics,data);
        })
      )
    );
  }


}
