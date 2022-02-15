import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KohesioEclAccordionComponent } from './accordion.ecl.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [KohesioEclAccordionComponent],
    declarations: [KohesioEclAccordionComponent]
})
export class KohesioEclAccordionModule {
}
