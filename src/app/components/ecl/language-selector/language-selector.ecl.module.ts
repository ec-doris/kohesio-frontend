import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {KohesioEclLanguageSelectorComponent} from "./language-selector.ecl.component";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [KohesioEclLanguageSelectorComponent],
    declarations: [KohesioEclLanguageSelectorComponent]
})
export class KohesioEclLanguageSelectorModule {
}
