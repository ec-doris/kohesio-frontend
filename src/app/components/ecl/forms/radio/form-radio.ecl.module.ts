import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {KohesioEclFormRadioComponent} from "./form-radio.ecl.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [KohesioEclFormRadioComponent],
    declarations: [KohesioEclFormRadioComponent]
})
export class KohesioEclFormRadioModule {}
