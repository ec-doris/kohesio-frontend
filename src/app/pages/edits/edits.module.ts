import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {EditsDashboardComponent} from "./dashboard/edits-dashboard.component";
import {EditsRoutingModule} from "./edits-routing.module";
import {KohesioEclButtonModule} from "../../components/ecl/button/button.ecl.module";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {KohesioEclFormModule} from "../../components/ecl/forms/form.ecl.module";
import {KohesioEclFormGroupModule} from "../../components/ecl/forms/form-group/form-group.ecl.module";
import {KohesioEclFormLabelModule} from "../../components/ecl/forms/label/form-label.ecl.module";
import {KohesioEclFormTextInputModule} from "../../components/ecl/forms/text-input/form-text-input.ecl.module";
import {KohesioEclFormSelectModule} from "../../components/ecl/forms/select/form-select.ecl.module";
import {KohesioEclMessageModule} from "../../components/ecl/message/message.ecl.module";
import {KohesioEclFormCheckboxModule} from "../../components/ecl/forms/checkbox/form-checkbox.ecl.module";
import {MatBadgeModule} from "@angular/material/badge";
import {EditFilterDialogComponent} from "./filter-dialog/edit-filter-dialog.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        KohesioEclButtonModule,
        KohesioEclFormModule,
        KohesioEclFormGroupModule,
        KohesioEclFormLabelModule,
        KohesioEclFormTextInputModule,
        KohesioEclFormSelectModule,
        KohesioEclFormCheckboxModule,
        KohesioEclMessageModule,
        EditsRoutingModule,
        MatDialogModule,
        MatBadgeModule
    ],
  declarations: [
    EditsDashboardComponent,
    EditFilterDialogComponent
  ],
  exports: [
  ],
  providers: [
  ]
})
export class EditsModule {}
