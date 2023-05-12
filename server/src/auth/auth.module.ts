import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserModule} from "../users/user.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {buildOpenIdClient, OidcStrategy} from "./oidc.strategy";
import {PassportModule} from "@nestjs/passport";
import {SessionSerializer} from "./session.serializer";
import {AuthController} from "./auth.controller";

const OidcStrategyFactory = {
  provide: 'OidcStrategy',
  useFactory: async (authService: AuthService, configService: ConfigService) => {
    const client = await buildOpenIdClient(configService); // secret sauce! build the dynamic client before injecting it into the strategy for use in the constructor super call.
    const strategy = new OidcStrategy(authService, client, configService);
    return strategy;
  },
  inject: [AuthService, ConfigService]
};
@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    PassportModule.register({ session: true, defaultStrategy: 'oidc' })
  ],
  controllers: [AuthController],
  providers: [OidcStrategyFactory, SessionSerializer, AuthService, ConfigService]
})
export class AuthModule {}
