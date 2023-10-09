import {inject, NgModule} from '@angular/core';
import {CanActivateFn, Router, RouterModule, Routes} from '@angular/router';
import {UserDashboardComponent} from "./dashboard/user-dashboard.component";
import {UserProfileComponent} from "./profile/user-profile.component";
import {LoggedinGuard} from "../../guards/loggedin.guard";
import {UserService} from "../../services/user.service";

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    canActivate: [adminOrReviewer()]
  },{
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [LoggedinGuard]
  }
];

export function adminOrReviewer(): CanActivateFn {
  return () => {
    const userService: UserService = inject(UserService);
    const router = inject(Router);
    if (typeof userService.user !== 'undefined'){
      if (userService.isAdmin() || userService.isReviewer()){
        return true;
      }
    }
    router.navigate(["/403"]).then();
    console.log("403");
    return false;
  };
}

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class UsersRoutingModule {}
