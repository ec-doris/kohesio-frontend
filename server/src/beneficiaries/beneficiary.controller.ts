import {Controller, Get, HttpException, HttpStatus, Param, Query, Req, Res} from "@nestjs/common";
import {BeneficiaryService} from "./beneficiary.service";
import {
  ApiBadRequestResponse,
  ApiOkResponse, ApiProduces, ApiServiceUnavailableResponse,
  ApiTags
} from "@nestjs/swagger";
import {
  BeneficiaryInDTO,
  BeneficiaryOutDTO,
  BeneficiaryOutWrapperDTO,
  BeneficiaryProjectInDTO, BeneficiaryProjectOutWrapperDTO
} from "./beneficiary.dto";
import {Response} from "express";
import {AxiosResponse} from "axios";

@Controller('/beneficiaries')
@ApiTags('Beneficiaries')
export class BeneficiaryController {

  constructor(private readonly beneficiaryService:BeneficiaryService){}

  @Get('')
  @ApiOkResponse({
    type:BeneficiaryOutWrapperDTO
  })
  @ApiBadRequestResponse({description: "Beneficiary not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async list(@Query() queryParam: BeneficiaryInDTO){
    return await this.beneficiaryService.list(queryParam).catch(this.errorHandler);
  }

  @Get(':id')
  @ApiOkResponse({
    type:BeneficiaryOutDTO
  })
  @ApiBadRequestResponse({description: "Beneficiary not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async read(@Param('id')id:string, @Query() queryParam: BeneficiaryInDTO){
    return await this.beneficiaryService.read(queryParam).catch(this.errorHandler);
  }

  @Get(':id/projects')
  @ApiOkResponse({
    type:BeneficiaryProjectOutWrapperDTO
  })
  @ApiBadRequestResponse({description: "Projects not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  async getProjects(@Param('id')id:string, @Query() queryParam: BeneficiaryProjectInDTO){
    return await this.beneficiaryService.getProjects(queryParam).catch(this.errorHandler);
  }

  @Get('/download/csv')
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiBadRequestResponse({description: "File not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  @ApiProduces('text/csv')
  async getCsvFile(@Query() queryParam: BeneficiaryInDTO, @Res({ passthrough: true }) response: Response){
    const result:AxiosResponse = await this.beneficiaryService.getFile("csv",queryParam).catch(this.errorHandler);
    response.contentType('text/csv');
    response.set("Content-Disposition", 'attachment; filename="beneficiaries.csv"');
    result.data.pipe(response)
  }

  @Get('/download/excel')
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiBadRequestResponse({description: "File not found"})
  @ApiServiceUnavailableResponse({description: "Service is unavailable"})
  @ApiProduces('application/vnd.ms-excel')
  async getExcelFile(@Query() queryParam: BeneficiaryInDTO, @Res({ passthrough: true }) response: Response){
    const result:AxiosResponse = await this.beneficiaryService.getFile("excel",queryParam).catch(this.errorHandler);
    response.contentType('application/vnd.ms-excel');
    response.set("Content-Disposition", 'attachment; filename="beneficiaries.xlsx"');
    result.data.pipe(response)
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
