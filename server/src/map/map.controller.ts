import {Controller, Get, HttpException, HttpStatus, Param, Query, Req, Res} from "@nestjs/common";
import {MapService} from "./map.service";
import {
  ApiBadRequestResponse,
  ApiOkResponse, ApiServiceUnavailableResponse,
  ApiTags
} from "@nestjs/swagger";
import {
  MapSearchInDTO,
  MapSearchNearbyOutDTO,
  MapSearchOutDTO,
  MapSearchPointInDTO,
  MapSearchPointOutDTO
} from "./map.dto";


@Controller('/map')
@ApiTags('Map')
export class MapController {

  constructor(private readonly mapService:MapService){}


  @Get('search')
  @ApiOkResponse({
    type:MapSearchOutDTO
  })
  @ApiBadRequestResponse({description: "Project not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async search(@Query() queryParam: MapSearchInDTO): Promise<MapSearchOutDTO | void>{
    return await this.mapService.getMapRegions(queryParam).catch(this.errorHandler);
  }

  @Get('point')
  @ApiOkResponse({
    type:[MapSearchPointOutDTO]
  })
  @ApiBadRequestResponse({description: "Project not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async point(@Query() queryParam: MapSearchPointInDTO): Promise<MapSearchPointOutDTO[] | void>{
    return await this.mapService.getMapPoints(queryParam).catch(this.errorHandler);
  }

  @Get('nearby')
  @ApiOkResponse({
    type:[MapSearchNearbyOutDTO]
  })
  @ApiBadRequestResponse({description: "Project not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async nearby(@Req() req): Promise<MapSearchNearbyOutDTO | void>{
    return await this.mapService.getPointsNearby(req).catch(this.errorHandler);
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
        error: "Bad request",
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
