import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserDashboardComponent} from "./dashboard/user-dashboard.component";
import {UsersResolve} from "./users.resolve";
import {AuthGuard} from "./auth.guard";

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    resolve: {
      data: UsersResolve
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class UsersRoutingModule {}
