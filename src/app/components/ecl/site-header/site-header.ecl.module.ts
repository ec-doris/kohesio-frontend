import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteHeaderEclComponent } from './site-header.ecl.component';
import {KohesioEclLanguageSelectorModule} from "../language-selector/language-selector.ecl.module";

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        KohesioEclLanguageSelectorModule
    ],
    declarations: [
        SiteHeaderEclComponent
    ],
    exports: [
        SiteHeaderEclComponent
    ],
    providers: []
})
export class SiteHeaderEclModule {}
