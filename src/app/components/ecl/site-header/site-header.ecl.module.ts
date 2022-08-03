import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteHeaderEclComponent } from './site-header.ecl.component';

@NgModule({
    imports: [
        RouterModule,
        CommonModule
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