import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import {PassportModule} from "@nestjs/passport";
import {NotificationService} from "./notification.service";
import {NotificationController} from "./notification.controller";

@Module({
  imports:[ConfigModule.forRoot(),HttpModule,
    PassportModule.register({ session: true, defaultStrategy: 'oidc' })],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule {}
