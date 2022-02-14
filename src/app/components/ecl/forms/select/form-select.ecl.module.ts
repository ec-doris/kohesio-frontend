import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { KohesioEclFormSelectComponent } from './form-select.ecl.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [KohesioEclFormSelectComponent],
    declarations: [KohesioEclFormSelectComponent]
})
export class KohesioEclFormSelectModule {}
