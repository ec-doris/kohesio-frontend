import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {FaqPageComponent} from "./faq.component";
import {KohesioEclAccordionModule} from "../../components/ecl/accordion/accordion.ecl.module";
import {RouterModule} from "@angular/router";
import {FaqRoutingModule} from "./faq-routing.module";
import {KohesioEclFormModule} from "../../components/ecl/forms/form.ecl.module";
import {FormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";
import {KohesioEclSpinnerModule} from "../../components/ecl/spinner/spinner.ecl.module";
import {OverlayModule} from "@angular/cdk/overlay";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    KohesioEclAccordionModule,
    FaqRoutingModule,
    KohesioEclFormModule,
    FormsModule,
    MatTooltipModule,
    KohesioEclSpinnerModule,
    OverlayModule
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
