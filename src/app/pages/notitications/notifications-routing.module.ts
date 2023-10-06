import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotificationsDashboardComponent} from "./dashboard/notifications-dashboard.component";
import {LoggedinGuard} from "../../guards/loggedin.guard";

const routes: Routes = [
  {
    path: '',
    component: NotificationsDashboardComponent,
    canActivate: [LoggedinGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class NotificationsRoutingModule {}
