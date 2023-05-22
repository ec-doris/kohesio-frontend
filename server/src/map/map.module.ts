import { Module } from '@nestjs/common';
import {MapController} from "./map.controller";
import {MapService} from "./map.service";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";
import {EditService} from "../edits/edit.service";

@Module({
  providers: [MapService, EditService],
  exports: [MapService],
  controllers: [MapController],
  imports: [HttpModule,ConfigModule.forRoot()],
})
export class MapModule {}
