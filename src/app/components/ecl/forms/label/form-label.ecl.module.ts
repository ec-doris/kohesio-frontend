import { NgModule } from '@angular/core';
import { KohesioEclFormLabelComponent } from './form-label.ecl.component';
import {NgIf} from "@angular/common";

@NgModule({
    imports: [
        NgIf
    ],
    exports: [KohesioEclFormLabelComponent],
    declarations: [KohesioEclFormLabelComponent]
})
export class KohesioEclFormLabelModule {
}
