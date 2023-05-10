import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {UserDashboardComponent} from "./dashboard/user-dashboard.component";
import {UsersRoutingModule} from "./users-routing.module";
import {KohesioEclButtonModule} from "../../components/ecl/button/button.ecl.module";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {KohesioEclFormModule} from "../../components/ecl/forms/form.ecl.module";
import {KohesioEclFormGroupModule} from "../../components/ecl/forms/form-group/form-group.ecl.module";
import {KohesioEclFormLabelModule} from "../../components/ecl/forms/label/form-label.ecl.module";
import {KohesioEclFormTextInputModule} from "../../components/ecl/forms/text-input/form-text-input.ecl.module";
import {KohesioEclFormSelectModule} from "../../components/ecl/forms/select/form-select.ecl.module";
import {KohesioEclMessageModule} from "../../components/ecl/message/message.ecl.module";
import {UserSaveDialogComponent} from "./save-dialog/user-save-dialog.component";
import {KohesioEclFormCheckboxModule} from "../../components/ecl/forms/checkbox/form-checkbox.ecl.module";

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
    UsersRoutingModule,
    MatDialogModule
  ],
  declarations: [
    UserDashboardComponent,
    UserSaveDialogComponent
  ],
  exports: [
  ],
  providers: [
  ]
})
export class UsersModule {}
