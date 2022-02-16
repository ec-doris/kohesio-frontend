import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KohesioEclButtonComponent } from './button.ecl.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [KohesioEclButtonComponent],
    declarations: [KohesioEclButtonComponent]
})
export class KohesioEclButtonModule {
}
