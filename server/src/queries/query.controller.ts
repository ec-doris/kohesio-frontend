import {Controller, Get, HttpException, HttpStatus, Query} from "@nestjs/common";
import {QueryService} from "./query.service";
import {FilterThemeInDto} from "./dtos/in/filter-theme.in.dto";
import {
  ApiBadRequestResponse, ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags
} from "@nestjs/swagger";
import {StatisticsOutDto} from "./dtos/out/statistics.out.dto";
import {BasicFilterOutDto} from "./dtos/out/basic-filter.out.dto";
import {ProjectSearchWrapperOutDto} from "./dtos/out/project-search.out.dto";
import {ProjectSearchInDto} from "./dtos/in/project-search.in.dto";
import {ProjectInDto} from "./dtos/in/project.in.dto";
import {ProjectOutDto} from "./dtos/out/project.out.dto";

@Controller('/queries')
@ApiTags('Queries')
export class QueryController {

  constructor(private readonly wikiService:QueryService){}

  @Get('stats')
  @ApiOkResponse({
    type:StatisticsOutDto
  })
  @ApiBadRequestResponse({description: "Statistics not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async stats():Promise<StatisticsOutDto | void>{
    return await this.wikiService.getStatistics().catch(this.errorHandler);
  }

  @Get('filter/theme')
  @ApiOkResponse({
    type:[BasicFilterOutDto]
  })
  @ApiBadRequestResponse({description: "Thematic objective not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async filterTheme(@Query() queryParam: FilterThemeInDto){
    return await this.wikiService.getBasicFilter("thematic_objectives", queryParam).catch(this.errorHandler);
  }

  @Get('search/project')
  @ApiOkResponse({
    type:ProjectSearchWrapperOutDto
  })
  @ApiBadRequestResponse({description: "Project not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async projectSearch(@Query() queryParam: ProjectSearchInDto){
    return await this.wikiService.projectSearch(queryParam).catch(this.errorHandler);
  }

  @Get('project')
  @ApiOkResponse({
    type:ProjectOutDto
  })
  @ApiBadRequestResponse({description: "Project not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async project(@Query() queryParam: ProjectInDto){
    return await this.wikiService.project(queryParam).catch(this.errorHandler);
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
