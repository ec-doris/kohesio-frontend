import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {UserController} from "./user.controller";
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import {PassportModule} from "@nestjs/passport";
import {NotificationService} from "../notifications/notification.service";

@Module({
  imports:[ConfigModule.forRoot(),HttpModule,
    PassportModule.register({ session: true, defaultStrategy: 'oidc' })],
  providers: [UserService, NotificationService],
  exports: [UserService],
  controllers: [UserController]
})

export class UserModule {


}
