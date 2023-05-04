import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {KohesioEclFormCheckboxComponent} from "./form-checkbox.ecl.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [KohesioEclFormCheckboxComponent],
    declarations: [KohesioEclFormCheckboxComponent]
})
export class KohesioEclFormCheckboxModule {}
