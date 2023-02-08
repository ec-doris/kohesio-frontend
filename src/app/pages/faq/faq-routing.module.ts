import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FaqPageComponent} from "./faq.component";
import {FaqPageResolve} from "./faq.resolve";

const routes: Routes = [
  {
    path: '',
    component: FaqPageComponent,
    resolve: {
      listOfOperation: FaqPageResolve
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class FaqRoutingModule {}
