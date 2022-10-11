import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterEclComponent } from './footer.ecl.component';

@NgModule({
    imports: [
        RouterModule,
        CommonModule
    ],
    declarations: [
        FooterEclComponent
    ],
    exports: [
        FooterEclComponent
    ],
    providers: []
})
export class FooterEclModule {}