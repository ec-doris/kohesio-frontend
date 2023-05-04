import { NgModule } from '@angular/core';
import {ConfirmationDialogComponent} from "./confirmation-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {KohesioEclButtonModule} from "../../ecl/button/button.ecl.module";

@NgModule({
    imports: [
      KohesioEclButtonModule,
      MatDialogModule
    ],
    exports: [ConfirmationDialogComponent],
    declarations: [ConfirmationDialogComponent]
})
export class ConfirmationDialogModule {}
