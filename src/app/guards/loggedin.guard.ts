import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {UserService} from "../services/user.service";

@Injectable({ providedIn: 'root' })
export class LoggedinGuard implements CanActivate{

  constructor(private userService:UserService, private router: Router){}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    if (typeof this.userService.user === 'undefined'){
      //Sometimes the guard here is calling first then the APP_INITIALIZER
      await firstValueFrom(this.userService.getCurrentUser())
      if (this.userService.isLoggedIn()){
        return true;
      }
    }else{
      if (this.userService.isLoggedIn()){
        return true;
      }
    }
    this.router.navigate(["/403"]).then();
    return false;
  }



}
