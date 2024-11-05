import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import {PassportModule} from "@nestjs/passport";
import {DataService} from "./data.service";
import {DataController} from "./data.controller";

@Module({
  imports:[ConfigModule.forRoot(),HttpModule,
    PassportModule.register({ session: true, defaultStrategy: 'oidc' })],
  providers: [DataService],
  exports: [DataService],
  controllers: [DataController]
})
export class DataModule {}
