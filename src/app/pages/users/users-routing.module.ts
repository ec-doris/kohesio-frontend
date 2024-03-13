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
    canActivate: [ReviewerGuard],
    data: {
      title: $localize`:@@page.users.dashboard.title:Users`
    }
  },{
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [LoggedinGuard],
    data: {
      title: $localize`:@@page.users.profile.title:My Profile`
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class UsersRoutingModule {}
