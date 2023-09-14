import { NgModule } from '@angular/core';
import { KohesioEclSpinnerComponent } from './spinner.ecl.component';
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
      CommonModule
    ],
    exports: [KohesioEclSpinnerComponent],
    declarations: [KohesioEclSpinnerComponent]
})
export class KohesioEclSpinnerModule {
}
