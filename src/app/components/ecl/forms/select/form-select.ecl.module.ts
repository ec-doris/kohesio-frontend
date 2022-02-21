import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KohesioEclFormSelectComponent } from './form-select.ecl.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [KohesioEclFormSelectComponent],
    declarations: [KohesioEclFormSelectComponent]
})
export class KohesioEclFormSelectModule {}
