import {ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

export const defaultOptions = {
  session: false,
  property: 'user'
};

@Injectable()
export class LoginGuard extends AuthGuard('oidc') {

  async canActivate(context: ExecutionContext) {
    //console.log("LOGIN_GUARD");
    const result = (await super.canActivate(context)) as boolean;
    //console.log("LOGIN_GUARD_RESULT=",result);
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }

  handleRequest(err, user, info, context, status): any {
    if (err || !user) {
      console.log("ERROR",arguments);
      throw err || new UnauthorizedException();
    }
    return user;
  }

  async getAuthenticateOptions(context: any) {
    const request = context.switchToHttp().getRequest();
    const query = request.query;
    if (query && query.callback) {
      return {
        state: query.callback
      };
    }
  }
}
