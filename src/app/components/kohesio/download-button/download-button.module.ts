import { NgModule } from '@angular/core';
import { DownloadButtonComponent } from './download-button.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        MatButtonModule,
        MatMenuModule,
        MatIconModule
    ],
    exports: [DownloadButtonComponent],
    declarations: [DownloadButtonComponent]
})
export class DownloadButtonModule {}
