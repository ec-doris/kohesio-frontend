import {Controller, Get, HttpException, HttpStatus, Query, Req, Res} from "@nestjs/common";
import {QueryService} from "./query.service";
import {
  ApiBadRequestResponse, ApiOkResponse, ApiProduces,
  ApiServiceUnavailableResponse,
  ApiTags
} from "@nestjs/swagger";
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
import {PriorityAxisInDTO, PriorityAxisOutDTO} from "./dtos/priorityAxis.dto";


@Controller('/queries')
@ApiTags('Queries')
export class QueryController {

  constructor(private readonly queryService:QueryService){}

  @Get('statistics')
  @ApiOkResponse({
    type:StatisticsOutDTO
  })
  @ApiBadRequestResponse({description: "Statistics not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async statistics():Promise<StatisticsOutDTO | void>{
    return await this.queryService.getStatistics().catch(this.errorHandler);
  }

  @Get('thematic_objectives')
  @ApiOkResponse({
    type:[ThematicObjectivesOutDTO]
  })
  @ApiBadRequestResponse({description: "Thematic objective not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async thematic_objectives(@Query() queryParam: ThematicObjectivesInDTO): Promise<ThematicObjectivesOutDTO[] | void>{
    return await this.queryService.getThematicObjectives(queryParam).catch(this.errorHandler);
  }

  @Get('regions')
  @ApiOkResponse({
    type:[RegionOutDTO]
  })
  @ApiBadRequestResponse({description: "Region not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async regions(@Query() queryParam: RegionInDTO): Promise<RegionOutDTO[] | void>{
    return await this.queryService.getRegions(queryParam).catch(this.errorHandler);
  }

  @Get('programs')
  @ApiOkResponse({
    type:[ProgramOutDTO]
  })
  @ApiBadRequestResponse({description: "Program not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async programs(@Query() queryParam: ProgramInDTO): Promise<ProgramOutDTO[] | void>{
    return await this.queryService.getPrograms(queryParam).catch(this.errorHandler);
  }

  @Get('policy_objectives')
  @ApiOkResponse({
    type:[PolicyOutDTO]
  })
  @ApiBadRequestResponse({description: "Policy objective not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async policy_objectives(@Query() queryParam: PolicyInDTO): Promise<PolicyOutDTO[] | void>{
    return await this.queryService.getPolicyObjectives(queryParam).catch(this.errorHandler);
  }

  @Get('outermost_regions')
  @ApiOkResponse({
    type:[OutermostRegionsOutDTO]
  })
  @ApiBadRequestResponse({description: "Outermost region not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async outermost_regions(@Query() queryParam: OutermostRegionsInDTO): Promise<OutermostRegionsOutDTO[] | void>{
    return await this.queryService.getOutermostRegions(queryParam).catch(this.errorHandler);
  }

  @Get('nuts3')
  @ApiOkResponse({
    type:[Nuts3OutDTO]
  })
  @ApiBadRequestResponse({description: "Nuts3 not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async nuts3(@Query() queryParam: Nuts3InDTO): Promise<Nuts3OutDTO[] | void>{
    return await this.queryService.getNuts3(queryParam).catch(this.errorHandler);
  }

  @Get('loo_metadata')
  @ApiOkResponse({
    type:[LooMetadataOutDTO]
  })
  @ApiBadRequestResponse({description: "Loo metadata not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async loo_metadata(@Query() queryParam: LooMetadataInDTO): Promise<LooMetadataOutDTO[] | void>{
    return await this.queryService.getLooMetadata(queryParam).catch(this.errorHandler);
  }

  @Get('kohesio_categories')
  @ApiOkResponse({
    type:[KohesioCategoryOutDTO]
  })
  @ApiBadRequestResponse({description: "Kohesio category not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async kohesio_categories(@Query() queryParam: KohesioCategoryInDTO): Promise<KohesioCategoryOutDTO[] | void>{
    return await this.queryService.getKohesioCategories(queryParam).catch(this.errorHandler);
  }

  @Get('funds')
  @ApiOkResponse({
    type:[FundOutDTO]
  })
  @ApiBadRequestResponse({description: "Fund not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async funds(@Query() queryParam: FundInDTO): Promise<FundOutDTO[] | void>{
    return await this.queryService.getFunds(queryParam).catch(this.errorHandler);
  }

  @Get('countries')
  @ApiOkResponse({
    type:[CountryOutDto]
  })
  @ApiBadRequestResponse({description: "Country not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async countries(@Query() queryParam: CountryInDto): Promise<CountryOutDto[] | void>{
    return await this.queryService.getCountries(queryParam).catch(this.errorHandler);
  }

  @Get('categoriesOfIntervention')
  @ApiOkResponse({
    type:[CategoryOutDTO]
  })
  @ApiBadRequestResponse({description: "Country not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async categoriesOfIntervention(@Query() queryParam: CategoryInDTO): Promise<CategoryOutDTO[] | void>{
    return await this.queryService.getCategoriesOfIntervention(queryParam).catch(this.errorHandler);
  }

  @Get('search/general')
  @ApiOkResponse({
    type:GeneralSearchWrapperOutDTO
  })
  @ApiBadRequestResponse({description: "Country not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async generalSearch(@Query() queryParam: GeneralSearchInDTO): Promise<GeneralSearchWrapperOutDTO | void>{
    return await this.queryService.generalSearch(queryParam).catch(this.errorHandler);
  }

  @Get('priority_axis')
  @ApiOkResponse({
    type:[PriorityAxisOutDTO]
  })
  @ApiBadRequestResponse({description: "Priority Axis not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async priorityAxis(@Query() queryParam: PriorityAxisInDTO): Promise<PriorityAxisOutDTO[] | void>{
    return await this.queryService.getPriorityAxis(queryParam).catch(this.errorHandler);
  }

  private errorHandler(err){
    if (err.status == 404){
      throw new HttpException({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: "Service is unavailable",
      }, HttpStatus.SERVICE_UNAVAILABLE);
    }else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: "Thematic objective not found",
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
