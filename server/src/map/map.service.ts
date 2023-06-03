import {Injectable} from "@nestjs/common";
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {plainToInstance} from "class-transformer";
import {catchError} from "rxjs/operators";
import {
  MapSearchInDTO,
  MapSearchNearbyOutDTO,
  MapSearchOutDTO,
  MapSearchPointInDTO,
  MapSearchPointOutDTO
} from "./map.dto";
@Injectable()
export class MapService {

  private readonly baseUrl:string;

  constructor(private readonly httpService: HttpService, private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_QUERY_HOST');
  }

  async getMapRegions(params: MapSearchInDTO):Promise<MapSearchOutDTO>{
    return await firstValueFrom(
      this.httpService.get<MapSearchOutDTO>(`${this.baseUrl}/search/project/map`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(MapSearchOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getMapPoints(params: MapSearchPointInDTO):Promise<MapSearchPointOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<MapSearchPointOutDTO[]>(`${this.baseUrl}/search/project/map/point`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(MapSearchPointOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getPointsNearby():Promise<MapSearchNearbyOutDTO>{
    return await firstValueFrom(
      this.httpService.get<MapSearchNearbyOutDTO>(`${this.baseUrl}/map/nearby`).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(MapSearchNearbyOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  handlingCatchError(err){
    console.error("Error on Map service:",err.response.data)
    return throwError(err.response);
  }


}
