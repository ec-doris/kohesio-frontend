import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {Strategy, Client, TokenSet, Issuer, IdTokenClaims, ClientAuthMethod} from 'openid-client';
import { AuthService } from './auth.service';
import {ConfigService} from "@nestjs/config";
import {UserInDto} from "../users/dtos/user.in.dto";

export const buildOpenIdClient = async (configService: ConfigService) => {
  const TrustIssuer = await Issuer.discover(`${configService.get<string>('OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER')}/.well-known/openid-configuration`);
  const client = new TrustIssuer.Client({
    client_id: configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_ID'),
    client_secret: configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_SECRET'),
    token_endpoint_auth_method: configService.get<string>('OAUTH2_TOKEN_ENDPOINT_AUTH_METHOD') as ClientAuthMethod,
    id_token_signed_response_alg: configService.get<string>('OAUTH2_ID_TOKEN_SIGNED_RESPONSE_ALG')
  });
  return client;
};

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  client: Client;

  constructor(private readonly authService: AuthService,
              client: Client,
              private readonly configService: ConfigService) {
    super({
      client: client,
      params: {
        redirect_uri: configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_REDIRECT_URI'),
        scope: configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_SCOPE')
      },
      passReqToCallback: false,
      usePKCE: true
    });

    this.client = client;
  }

  async validate(tokenset: TokenSet): Promise<any> {

    const claims:IdTokenClaims = tokenset.claims();
    //console.log("VALIDATE FUNCTION CLAIMS", claims);
    /*const userinfo: UserinfoResponse = await this.client.userinfo(tokenset,{
      method: 'POST',
      via: 'body',
      params: {
        token: tokenset.access_token
      }
    });*/
    try {
      const id_token = tokenset.id_token
      const access_token = tokenset.access_token
      const refresh_token = tokenset.refresh_token
      const useruid = claims.sub;
      const user = {
        userinfo : {
          name: claims.given_name + ' ' + claims.family_name,
          uid: claims.sub,
          email: claims.email
        }
      }
      const userDB:UserInDto = await this.authService.validateUser(useruid);
      if (userDB){
        console.log("USER AUTHORIZED",userDB);
        return userDB;
      }else{
        console.log("USER UNAUTHORIZED",useruid);
        throw new UnauthorizedException();
      }
    } catch (err) {
      console.log("ERROR", err);
      throw new UnauthorizedException();
    }
  }
}
