import {CommonModule, SlicePipe} from '@angular/common';
import { NgModule } from '@angular/core';
import {KohesioEclLoginBoxComponent} from "./login-box.ecl.component";

@NgModule({
    imports: [
        CommonModule,
        SlicePipe
    ],
    exports: [KohesioEclLoginBoxComponent],
    declarations: [KohesioEclLoginBoxComponent]
})
export class KohesioEclLoginBoxModule {
}
