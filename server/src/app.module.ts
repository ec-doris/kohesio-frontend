import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import {WikiModule} from "./wiki/wiki.module";
import {DraftModule} from "./drafts/draft.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    WikiModule,
    DraftModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
