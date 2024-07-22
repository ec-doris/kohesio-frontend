import { Controller, Get, HttpException, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiProduces, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';
import { Response } from 'express';
import { EditService } from '../edits/edit.service';
import {
  ProjectImageSearchWrapperOutDto,
  ProjectInDto,
  ProjectOutDto,
  ProjectSearchInDto,
  ProjectSearchWrapperOutDto
} from './project.dto';
import { ProjectService } from './project.service';

@Controller('/projects')
@ApiTags('Projects')
export class ProjectController {

  constructor(private readonly projectService:ProjectService,
              private readonly editService:EditService){}

  @Get('')
  @ApiOkResponse({
    type:ProjectSearchWrapperOutDto
  })
  @ApiBadRequestResponse({ description: 'Project not found' })
  @ApiServiceUnavailableResponse({ description: 'Service is unavailable' })
  async projectSearch(@Query() queryParam: ProjectSearchInDto) {
    return await this.projectService.projectSearch(queryParam).catch(this.errorHandler);
  }

  @Get('/image')
  @ApiOkResponse({
    type: ProjectImageSearchWrapperOutDto
  })
  @ApiBadRequestResponse({ description: 'Project not found' })
  @ApiServiceUnavailableResponse({ description: 'Service is unavailable' })
  async projectSearchImage(@Query() queryParam: ProjectSearchInDto) {
    return await this.projectService.projectSearchImage(queryParam).catch(this.errorHandler);
  }

  @Get('/download/csv')
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiBadRequestResponse({ description: 'File not found' })
  @ApiServiceUnavailableResponse({ description: 'Service is unavailable' })
  @ApiProduces('text/csv')
  async getCsvFile(@Query() queryParam: ProjectSearchInDto, @Res() response: Response) {
    try {
      const result: AxiosResponse = await this.projectService.getFileCsv('csv', queryParam);

      const chunks = [];
      result.data.on('data', chunk => chunks.push(chunk));
      result.data.on('end', () => {
        const buffer = Buffer.concat(chunks);
        response.setHeader('Content-Type', 'text/csv');
        response.setHeader('Content-Disposition', 'attachment; filename="projects.csv"');
        response.send(buffer);
      });
      result.data.on('error', (err) => {
        console.error('Stream error:', err);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error downloading file');
      });
    } catch (error) {
      console.error('Error:', error);
      response.status(HttpStatus.SERVICE_UNAVAILABLE).send('Service is unavailable');
    }
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
  async getExcelFile(@Query() queryParam: ProjectSearchInDto, @Res({ passthrough: true }) response: Response){
    const result:AxiosResponse = await this.projectService.getFile("excel",queryParam).catch(this.errorHandler);
    response.contentType('application/vnd.ms-excel');
    response.set("Content-Disposition", 'attachment; filename="projects.xlsx"');
    result.data.pipe(response)
  }

  @Get(':id')
  @ApiOkResponse({
    type: ProjectOutDto
  })
  @ApiBadRequestResponse({ description: 'Project not found' })
  @ApiServiceUnavailableResponse({ description: 'Service is unavailable' })
  async project(@Req() req, @Query() queryParam: ProjectInDto) {
    const project: ProjectOutDto | void = await this.projectService.project(queryParam).catch(this.errorHandler);
    /*if (project) {
      const latest_edit: EditVersionDTO | void = await this.editService.getLatestApprovedVersion(project.item, queryParam.language).catch(err=>{
        if (err.status != 404){
          this.errorHandler(err);
        }
      });
      if (latest_edit) {
        project.label = latest_edit.label;
        project.description = latest_edit.summary;
      }
    }*/
    if (req.user && project) {
      project.canEdit = this.projectService.canEdit(req.user, project);
      project.canApprove = this.projectService.canApprove(req.user, project);
    }
    return project;
  }


  private errorHandler(err) {
    if (err.status == 404) {
      throw new HttpException({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Service is unavailable',
      }, HttpStatus.SERVICE_UNAVAILABLE);
    } else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad request',
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
