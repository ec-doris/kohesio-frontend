import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserDashboardComponent} from "./dashboard/user-dashboard.component";
import {UsersResolve} from "./users.resolve";

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
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
