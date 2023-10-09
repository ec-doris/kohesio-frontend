import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {UserService} from "../../../services/user.service";
import {isPlatformServer} from "@angular/common";
import {User} from "../../../models/user.model";

@Injectable({ providedIn: 'root' })
export class ReviewerGuard implements CanActivate{

  constructor(private userService:UserService,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object){}

  async canActivate(route: ActivatedRouteSnapshot,
                    state: RouterStateSnapshot): Promise<boolean> {

    //Sometimes the guard here is calling first then the APP_INITIALIZER
    const user:User = await firstValueFrom(this.userService.getCurrentUser())
    if (isPlatformServer(this.platformId)) {
      console.log("DEBUGGING-MODE, 403 - USERDB",user);
    }
    if (user && (user.role == 'ADMIN' || user.role == 'REVIEWER')){
      return true;
    }

    this.router.navigate(["/403"]).then();
    if (isPlatformServer(this.platformId)){
      console.log("DEBUGGING-MODE, 403");
      console.log("DEBUGGING-MODE, 403 - USER",this.userService.user);
    }
    return false;
  }



}
