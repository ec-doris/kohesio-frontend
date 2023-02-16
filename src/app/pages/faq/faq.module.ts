import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {FaqPageComponent} from "./faq.component";
import {KohesioEclAccordionModule} from "../../components/ecl/accordion/accordion.ecl.module";
import {RouterModule} from "@angular/router";
import {FaqRoutingModule} from "./faq-routing.module";
import {NgxPopperjsModule} from "ngx-popperjs";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatTableModule,
        KohesioEclAccordionModule,
        FaqRoutingModule,
        NgxPopperjsModule
    ],
  declarations: [
    FaqPageComponent
  ],
  exports: [
  ],
  providers: [
  ]
})
export class FaqModule {}
