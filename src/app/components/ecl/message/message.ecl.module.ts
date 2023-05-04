import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {KohesioMessageEclComponent} from "./message.ecl.component";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [KohesioMessageEclComponent],
    declarations: [KohesioMessageEclComponent]
})
export class KohesioEclMessageModule {
}
