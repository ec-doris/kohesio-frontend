import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class UserGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest(); //Request Object
    //console.log(req.session);
    return req.session && req.user;
  }
}
