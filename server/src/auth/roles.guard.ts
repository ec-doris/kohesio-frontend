import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {Role} from "./role.enum";
import {ROLES_KEY} from "./roles.decorator";
import {LoginGuard} from "./login.guard";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class RolesGuard extends LoginGuard implements CanActivate {

  constructor(protected configService:ConfigService<environmentVARS>,private reflector: Reflector) {
    super(configService);
  }

  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    if (result){
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      console.log('REQUIRED_ROLES',requiredRoles);
      if (!requiredRoles) {
        return true;
      }
      const { user } = context.switchToHttp().getRequest();
      console.log('USER',user);
      return requiredRoles.some((role) => user.role == role.toUpperCase());
    }else{
      return false;
    }
  }
}
