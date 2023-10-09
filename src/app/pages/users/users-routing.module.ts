import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserDashboardComponent} from "./dashboard/user-dashboard.component";
import {UserProfileComponent} from "./profile/user-profile.component";
import {LoggedinGuard} from "../../guards/loggedin.guard";
import {ReviewerGuard} from "./guards/reviewer.guard";

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    canActivate: [ReviewerGuard]
  },{
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [LoggedinGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class UsersRoutingModule {}
