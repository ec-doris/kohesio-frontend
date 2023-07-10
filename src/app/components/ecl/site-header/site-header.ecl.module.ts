import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteHeaderEclComponent } from './site-header.ecl.component';
import {KohesioEclLanguageSelectorModule} from "../language-selector/language-selector.ecl.module";
import {KohesioEclLoginBoxModule} from "../login-box/login-box.ecl.module";

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        KohesioEclLanguageSelectorModule,
        KohesioEclLoginBoxModule
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
