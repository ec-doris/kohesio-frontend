import { Module } from '@nestjs/common';
import {QueryController} from "./query.controller";
import {QueryService} from "./query.service";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";

@Module({
  providers: [QueryService],
  exports: [QueryService],
  controllers: [QueryController],
  imports: [HttpModule,ConfigModule.forRoot()],
})
export class QueryModule {}
