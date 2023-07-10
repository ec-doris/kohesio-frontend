import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EditsDashboardComponent} from "./dashboard/edits-dashboard.component";
import {EditsGuard} from "./edits.guard";

const routes: Routes = [
  {
    path: '',
    component: EditsDashboardComponent,
    canActivate: [EditsGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class EditsRoutingModule {}
