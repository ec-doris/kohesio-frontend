import {CommonModule, SlicePipe} from '@angular/common';
import { NgModule } from '@angular/core';
import {KohesioEclLoginBoxComponent} from "./login-box.ecl.component";
import {RouterModule} from "@angular/router";
import {CdkMenuModule} from "@angular/cdk/menu";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SlicePipe,
        CdkMenuModule
    ],
    exports: [KohesioEclLoginBoxComponent],
    declarations: [KohesioEclLoginBoxComponent]
})
export class KohesioEclLoginBoxModule {
}
