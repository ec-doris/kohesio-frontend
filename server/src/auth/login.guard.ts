import {ExecutionContext, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ConfigService} from "@nestjs/config";

export const defaultOptions = {
  session: false,
  property: 'user'
};

@Injectable()
export class LoginGuard extends AuthGuard('oidc') {

  private readonly logger = new Logger(LoginGuard.name);

  constructor(protected configService:ConfigService<environmentVARS>) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    if (context.switchToHttp().getRequest().user){
      return true;
    }
    const result = (await super.canActivate(context)) as boolean;
    //console.log("LOGIN_GUARD_RESULT=",result);
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    this.logger.debug("LOGIN GUARD", info);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  async getAuthenticateOptions(context: any) {
    const request = context.switchToHttp().getRequest();
    const query = request.query;
    if (query && query.callback) {
      return {
        state: query.callback,
        acr_values: this.configService.get<string>('OAUTH2_ACR_VALUES')
      };
    }
  }
}
