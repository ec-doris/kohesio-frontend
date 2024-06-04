import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatChipsModule} from "@angular/material/chips";
import { MatIconModule } from '@angular/material/icon';
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
import {UserProfileComponent} from "./profile/user-profile.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {UserInviteDialogComponent} from "./invite-dialog/user-invite-dialog.component";
import {KohesioEclFormRadioModule} from "../../components/ecl/forms/radio/form-radio.ecl.module";
import {KohesioEclSpinnerModule} from "../../components/ecl/spinner/spinner.ecl.module";

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
    KohesioEclFormRadioModule,
    KohesioEclMessageModule,
    UsersRoutingModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    KohesioEclFormRadioModule,
    KohesioEclSpinnerModule,
    MatChipsModule,
    MatIconModule
  ],
  declarations: [
    UserDashboardComponent,
    UserSaveDialogComponent,
    UserInviteDialogComponent,
    UserProfileComponent
  ],
  exports: [
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class UsersModule {}
