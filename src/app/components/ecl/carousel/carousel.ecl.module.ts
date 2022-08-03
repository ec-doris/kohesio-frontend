import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselEclComponent } from './carousel.ecl.component';

@NgModule({
    imports: [
        RouterModule,
        CommonModule
    ],
    declarations: [
        CarouselEclComponent
    ],
    exports: [
        CarouselEclComponent
    ],
    providers: []
})
export class CarouselEclModule {}