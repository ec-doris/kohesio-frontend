import {HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {Strategy, Client, TokenSet, Issuer, IdTokenClaims, ClientAuthMethod} from 'openid-client';
import { AuthService } from './auth.service';
import {ConfigService} from "@nestjs/config";
import {UserInDto} from "../users/dtos/user.in.dto";
import {UserService} from "../users/user.service";
import {UserDTO} from "../users/dtos/user.dto";

export const buildOpenIdClient = async (configService: ConfigService) => {
  const TrustIssuer = await Issuer.discover(`${configService.get<string>('OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER')}/.well-known/openid-configuration`);
  return new TrustIssuer.Client({
    client_id: configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_ID'),
    client_secret: configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_SECRET'),
    token_endpoint_auth_method: configService.get<string>('OAUTH2_TOKEN_ENDPOINT_AUTH_METHOD') as ClientAuthMethod,
    id_token_signed_response_alg: configService.get<string>('OAUTH2_ID_TOKEN_SIGNED_RESPONSE_ALG')
  });
};

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  client: Client;

  constructor(client: Client,
              private readonly authService: AuthService,
              private readonly userService: UserService,
              private readonly configService: ConfigService) {
    super({
      client: client,
      params: {
        redirect_uri: configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_REDIRECT_URI'),
        scope: configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_SCOPE')
      },
      passReqToCallback: true,
      usePKCE: true
    });

    this.client = client;
  }

  async validate(req, tokenset: TokenSet): Promise<any> {
    //console.log(arguments);
    //console.log("STATE",req.query.state);
    const claims:IdTokenClaims = tokenset.claims();
    //console.log("CLAIMS",claims);
    const useruid = claims.sub;
    /*const id_token = tokenset.id_token
    const access_token = tokenset.access_token
    const refresh_token = tokenset.refresh_token*/
    try {
      if (req.query.state.startsWith("/invitation")) {
        console.log("CHECKING THE INVITATION");
        const token = req.query.state.replace("/invitation/", "");
        const email: string = claims.email as string;
        await this.userService.acceptInvitation(useruid, email, token).catch(error => {
          if (error.status == HttpStatus.NOT_FOUND) {
            console.log("USER UNAUTHORIZED, NO INVITATION FOUNDED", useruid);
            throw new UnauthorizedException();
          }
        });
        req.query.state = '/';
      }
      const userDB: UserDTO = await this.authService.validateUser(useruid);
      if (userDB) {
        const department: string = claims['https://ecas.ec.europa.eu/claims/department_number'] as string;
        const displayName: string = `${claims.given_name} ${claims.family_name}`;
        const email: string = claims.email as string;
        //console.log("DEPARTMENT",department);
        //console.log("DISPLAY_NAME",displayName);

        if ((!userDB.name && displayName) ||
          !userDB.organization && department ||
          !userDB.email && department) {
          const userInput: UserInDto = new UserInDto();
          userInput.userid = userDB.user_id;
          userInput.name = userDB.name ? userDB.name : displayName;
          userInput.organization = userDB.organization ? userDB.organization : department;
          userInput.email = userDB.email ? userDB.email : email;
          //console.log("USER_INPUT",userInput);
          await this.authService.updateUser(userInput);
        }
        //console.log("USER AUTHORIZED",userDB);
        await this.authService.loginUser(useruid);
        return userDB;
      }else{
        console.log("USER UNAUTHORIZED",useruid);
        throw new UnauthorizedException();
      }
    } catch (err) {
      console.log("ERROR, USER UNAUTHORIZED",useruid);
      throw new UnauthorizedException();
    }
  }
}
