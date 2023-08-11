import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserDashboardComponent} from "./dashboard/user-dashboard.component";
import {AuthGuard} from "./auth.guard";
import {UserProfileComponent} from "./profile/user-profile.component";
import {LoggedinGuard} from "../../guards/loggedin.guard";

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    canActivate: [AuthGuard]
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
