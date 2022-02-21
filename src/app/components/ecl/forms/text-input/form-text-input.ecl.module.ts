import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KohesioEclFormTextInputComponent } from './form-text-input.ecl.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [KohesioEclFormTextInputComponent],
    declarations: [KohesioEclFormTextInputComponent]
})
export class KohesioEclFormTextInputModule {}
