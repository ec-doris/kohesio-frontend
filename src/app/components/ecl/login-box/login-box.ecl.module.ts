import {CommonModule, SlicePipe} from '@angular/common';
import { NgModule } from '@angular/core';
import {KohesioEclLoginBoxComponent} from "./login-box.ecl.component";
import {RouterModule} from "@angular/router";
import {CdkMenuModule} from "@angular/cdk/menu";
import {MatBadgeModule} from "@angular/material/badge";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SlicePipe,
        CdkMenuModule,
        MatBadgeModule
    ],
    exports: [KohesioEclLoginBoxComponent],
    declarations: [KohesioEclLoginBoxComponent]
})
export class KohesioEclLoginBoxModule {
}
