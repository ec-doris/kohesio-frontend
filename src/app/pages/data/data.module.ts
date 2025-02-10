import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {DataRoutingModule} from "./data-routing.module";
import {DataPageComponent} from "./data.component";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DataRoutingModule
  ],
  declarations: [
    DataPageComponent
  ],
  exports: [
  ],
  providers: [
  ]
})
export class DataModule {}
