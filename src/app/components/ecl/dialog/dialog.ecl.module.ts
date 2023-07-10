import { NgModule } from '@angular/core';
import {DialogEclComponent} from "./dialog.ecl.component";
import {MatDialogModule} from "@angular/material/dialog";
import {KohesioEclButtonModule} from "../../ecl/button/button.ecl.module";
import {AsyncPipe, CommonModule, NgComponentOutlet} from "@angular/common";
import {AdDirective} from "./ad.directive";

@NgModule({
  imports: [
    CommonModule,
    KohesioEclButtonModule,
    MatDialogModule,
    NgComponentOutlet,
    AsyncPipe
  ],
    exports: [DialogEclComponent],
    declarations: [DialogEclComponent, AdDirective]
})
export class DialogEclModule {}
