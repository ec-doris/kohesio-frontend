import {Injectable} from "@nestjs/common";
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {plainToInstance} from "class-transformer";
import {ConfigService} from "@nestjs/config";
import {catchError} from "rxjs/operators";
import {StatisticsOutDTO} from "./dtos/statistics.dto";
import {ThematicObjectivesInDTO, ThematicObjectivesOutDTO} from "./dtos/thematic_objectives.dto";
import {RegionInDTO, RegionOutDTO} from "./dtos/region.dto";
import {ProgramInDTO, ProgramOutDTO} from "./dtos/program.dto";
import {PolicyInDTO, PolicyOutDTO} from "./dtos/policy.dto";
import {OutermostRegionsInDTO, OutermostRegionsOutDTO} from "./dtos/outermost-regions.dto";
import {Nuts3InDTO, Nuts3OutDTO} from "./dtos/nuts3.dto";
import {LooMetadataInDTO, LooMetadataOutDTO} from "./dtos/loo-metadata.dto";
import {KohesioCategoryInDTO, KohesioCategoryOutDTO} from "./dtos/kohesio-category.dto";
import {FundInDTO, FundOutDTO} from "./dtos/fund.dto";
import {CountryInDto, CountryOutDto} from "./dtos/country.dto";
import {CategoryInDTO, CategoryOutDTO} from "./dtos/category.dto";
import {GeneralSearchInDTO, GeneralSearchWrapperOutDTO} from "./dtos/general.search.dto";

@Injectable()
export class QueryService {

  private baseUrl:string;

  constructor(private readonly httpService: HttpService, private readonly configService:ConfigService<environmentVARS>) {
    this.baseUrl = configService.get<string>('BACKEND_QUERY_HOST');
  }

  async getStatistics():Promise<StatisticsOutDTO>{
    return await firstValueFrom(
      this.httpService.get<StatisticsOutDTO>(`${this.baseUrl}/statistics`).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(StatisticsOutDTO,data);
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getThematicObjectives(params: ThematicObjectivesInDTO):Promise<ThematicObjectivesOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<ThematicObjectivesOutDTO[]>(`${this.baseUrl}/thematic_objectives`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(ThematicObjectivesOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getRegions(params: RegionInDTO):Promise<RegionOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<RegionOutDTO[]>(`${this.baseUrl}/regions`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(RegionOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getPrograms(params: ProgramInDTO):Promise<ProgramOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<ProgramOutDTO[]>(`${this.baseUrl}/programs`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(ProgramOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getPolicyObjectives(params: PolicyInDTO):Promise<PolicyOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<PolicyOutDTO[]>(`${this.baseUrl}/policy_objectives`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(PolicyOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getOutermostRegions(params: OutermostRegionsInDTO):Promise<OutermostRegionsOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<OutermostRegionsOutDTO[]>(`${this.baseUrl}/outermost_regions`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(OutermostRegionsOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getNuts3(params: Nuts3InDTO):Promise<Nuts3OutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<Nuts3OutDTO[]>(`${this.baseUrl}/nuts3`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(Nuts3OutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getLooMetadata(params: LooMetadataInDTO):Promise<LooMetadataOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<LooMetadataOutDTO[]>(`${this.baseUrl}/loo_metadata`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(LooMetadataOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getKohesioCategories(params: KohesioCategoryInDTO):Promise<KohesioCategoryOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<KohesioCategoryOutDTO[]>(`${this.baseUrl}/kohesio_categories`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(KohesioCategoryOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getFunds(params: FundInDTO):Promise<FundOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<FundOutDTO[]>(`${this.baseUrl}/funds`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(FundOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getCountries(params: CountryInDto):Promise<CountryOutDto[]>{
    return await firstValueFrom(
      this.httpService.get<CountryOutDto[]>(`${this.baseUrl}/countries`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(CountryOutDto, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getCategoriesOfIntervention(params: CategoryInDTO):Promise<CategoryOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<CategoryOutDTO[]>(`${this.baseUrl}/categoriesOfIntervention`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(CategoryOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async generalSearch(params: GeneralSearchInDTO):Promise<GeneralSearchWrapperOutDTO>{
    return await firstValueFrom(
      this.httpService.get<GeneralSearchWrapperOutDTO>(`${this.baseUrl}/categoriesOfIntervention`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(GeneralSearchWrapperOutDTO, data)
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
