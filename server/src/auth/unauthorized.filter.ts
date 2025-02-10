import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException, Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

@Catch(UnauthorizedException)
export class ViewAuthFilter implements ExceptionFilter {

  private readonly logger = new Logger(ViewAuthFilter.name);

  constructor(private configService:ConfigService<environmentVARS>){}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logger.error(exception.stack);
    const environment:string = this.configService.get("ENV");
    if (environment != 'local' && environment != 'production') {
      response.sendStatus(status)
    }else{
      response.status(status).redirect('/403');
    }

  }
}
