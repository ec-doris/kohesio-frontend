import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import {PassportModule} from "@nestjs/passport";
import {DraftService} from "./draft.service";
import {DraftController} from "./draft.controller";

@Module({
  imports:[ConfigModule.forRoot(),HttpModule,
    PassportModule.register({ session: true, defaultStrategy: 'oidc' })],
  providers: [DraftService],
  exports: [DraftService],
  controllers: [DraftController]
})
export class DraftModule {}
