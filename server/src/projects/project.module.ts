import { Module } from '@nestjs/common';
import {ProjectController} from "./project.controller";
import {ProjectService} from "./project.service";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";
import {EditService} from "../edits/edit.service";

@Module({
  providers: [ProjectService, EditService],
  exports: [ProjectService],
  controllers: [ProjectController],
  imports: [HttpModule,ConfigModule.forRoot()],
})
export class ProjectModule {}
