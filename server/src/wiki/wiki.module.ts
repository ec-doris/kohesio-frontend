import { Module } from '@nestjs/common';
import {WikiController} from "./wiki.controller";
import {WikiService} from "./wiki.service";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";

@Module({
  providers: [WikiService],
  exports: [WikiService],
  controllers: [WikiController],
  imports: [HttpModule,ConfigModule.forRoot()],
})
export class WikiModule {}
