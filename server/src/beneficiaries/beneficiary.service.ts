import {Injectable} from "@nestjs/common";
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {plainToInstance} from "class-transformer";
import {catchError} from "rxjs/operators";
import {
  BeneficiaryInDTO,
  BeneficiaryOutDTO,
  BeneficiaryOutWrapperDTO,
  BeneficiaryProjectInDTO, BeneficiaryProjectOutWrapperDTO
} from "./beneficiary.dto";

@Injectable()
export class BeneficiaryService {

  private readonly baseUrl:string;

  constructor(private readonly httpService: HttpService, private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_QUERY_HOST');
  }

  async list(params: BeneficiaryInDTO):Promise<BeneficiaryOutWrapperDTO>{
    return await firstValueFrom(
      this.httpService.get<BeneficiaryOutWrapperDTO>(`${this.baseUrl}/search/beneficiaries`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(BeneficiaryOutWrapperDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async read(params: BeneficiaryInDTO):Promise<BeneficiaryOutDTO>{
    return await firstValueFrom(
      this.httpService.get<BeneficiaryOutDTO>(`${this.baseUrl}/beneficiary`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(BeneficiaryOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getProjects(params: BeneficiaryProjectInDTO):Promise<BeneficiaryProjectOutWrapperDTO>{
    return await firstValueFrom(
      this.httpService.get<BeneficiaryProjectOutWrapperDTO>(`${this.baseUrl}/beneficiary/project`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(BeneficiaryProjectOutWrapperDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getFile(type: string, params: BeneficiaryInDTO):Promise<any>{
    return this.httpService.axiosRef.get(`${this.baseUrl}/search/beneficiaries/${type}`, {
      params: params,
      responseType: 'stream'
    });
  }

  handlingCatchError(err){
    console.error("Error on Query service:",err.response.data)
    return throwError(err.response);
  }


}
