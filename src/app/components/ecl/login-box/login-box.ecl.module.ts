import {CommonModule, SlicePipe} from '@angular/common';
import { NgModule } from '@angular/core';
import {KohesioEclLoginBoxComponent} from "./login-box.ecl.component";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SlicePipe
    ],
    exports: [KohesioEclLoginBoxComponent],
    declarations: [KohesioEclLoginBoxComponent]
})
export class KohesioEclLoginBoxModule {
}
