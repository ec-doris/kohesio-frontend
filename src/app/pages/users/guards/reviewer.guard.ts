import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {UserService} from "../../../services/user.service";
import {isPlatformServer} from "@angular/common";

@Injectable({ providedIn: 'root' })
export class ReviewerGuard implements CanActivate{

  constructor(private userService:UserService,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object){}

  async canActivate(route: ActivatedRouteSnapshot,
                    state: RouterStateSnapshot): Promise<boolean> {

    if (typeof this.userService.user === 'undefined'){
      //Sometimes the guard here is calling first then the APP_INITIALIZER
      await firstValueFrom(this.userService.getCurrentUser())
      if (this.userService.isAdmin() || this.userService.isReviewer()){
        return true;
      }
    }else{
      if (this.userService.isAdmin() || this.userService.isReviewer()){
        return true;
      }
    }
    this.router.navigate(["/403"]).then();
    if (isPlatformServer(this.platformId)){
      console.log("DEBUGGING-MODE, 403");
      console.log("DEBUGGING-MODE, 403 - USER",this.userService.user);
    }
    return false;
  }



}
