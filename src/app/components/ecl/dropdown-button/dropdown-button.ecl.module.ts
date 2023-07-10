import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {KohesioEclDropDownButtonComponent} from "./dropdown-button.ecl.component";
import {CdkMenuModule, CdkMenuTrigger} from "@angular/cdk/menu";

@NgModule({
    imports: [
        CommonModule,
        CdkMenuModule
    ],
    exports: [KohesioEclDropDownButtonComponent],
    declarations: [KohesioEclDropDownButtonComponent]
})
export class KohesioEclDropDownButtonModule {
}
