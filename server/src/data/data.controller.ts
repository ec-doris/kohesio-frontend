import {
  Controller,
  Get,
  Query,
  Req, Res
} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {BaseController} from "../base.controller";
import {DataService} from "./data.service";
import type { Response } from 'express'


@Controller('/data')
@ApiTags('Data')
export class DataController extends BaseController{

  constructor(private dataService: DataService){
    super();
  }

  @Get('/projects')
  async listProjects(@Req() req, @Query() filters: any):Promise<any | {} | void>{
    console.log("LIST DATA PROJECTS");
    return await this.dataService.list(req.user.user_id, "projects").catch(this.errorHandler);
  }

  @Get('/beneficiaries')
  async listBeneficiaries(@Req() req, @Query() filters: any):Promise<any | {} | void>{
    console.log("LIST DATA BENEFICIARIES");
    return await this.dataService.list(req.user.user_id, "beneficiaries").catch(this.errorHandler);
  }

  @Get('/nuts')
  async listNuts(@Req() req, @Query() filters: any):Promise<any | {} | void>{
    console.log("LIST DATA NUTS");
    return await this.dataService.list(req.user.user_id, "nuts").catch(this.errorHandler);
  }

  @Get('/object')
  async getObject(@Req() req, @Res({ passthrough: true }) response: Response, @Query() filters: any):Promise<any | {} | void>{
    const res = await this.dataService.get(filters.id).catch(this.errorHandler);
    response.set({
      'Content-Type': res.ContentType,
      'Content-Disposition': res.ContentDisposition,
    })
    return res.file;
  }



}
