import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {UserController} from "./user.controller";
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports:[ConfigModule.forRoot(),HttpModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
