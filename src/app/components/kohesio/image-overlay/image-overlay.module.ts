import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import { ImageOverlayComponent } from './image-overlay.component';



@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        MatDialogModule,
    ],
    declarations: [
        ImageOverlayComponent
    ],
    exports: [
        ImageOverlayComponent
    ],
    providers: []
})
export class ImageOverlayModule {}