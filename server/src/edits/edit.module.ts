import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import {PassportModule} from "@nestjs/passport";
import {EditService} from "./edit.service";
import {EditController} from "./edit.controller";

@Module({
  imports:[ConfigModule.forRoot(),HttpModule,
    PassportModule.register({ session: true, defaultStrategy: 'oidc' })],
  providers: [EditService],
  exports: [EditService],
  controllers: [EditController]
})
export class EditModule {}
