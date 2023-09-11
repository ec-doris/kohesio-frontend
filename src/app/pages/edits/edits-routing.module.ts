import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EditsDashboardComponent} from "./dashboard/edits-dashboard.component";
import {LoggedinGuard} from "../../guards/loggedin.guard";

const routes: Routes = [
  {
    path: '',
    component: EditsDashboardComponent,
    canActivate: [LoggedinGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class EditsRoutingModule {}
