import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {KohesioEclFormTextAreaComponent} from "./form-text-area.ecl.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [KohesioEclFormTextAreaComponent],
    declarations: [KohesioEclFormTextAreaComponent]
})
export class KohesioEclFormTextAreaModule {}
