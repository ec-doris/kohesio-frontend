import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import {QueryModule} from "./queries/query.module";
import {DraftModule} from "./drafts/draft.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    QueryModule,
    DraftModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
