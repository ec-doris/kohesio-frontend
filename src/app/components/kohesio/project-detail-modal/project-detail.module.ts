import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectDetailModalComponent } from './project-detail-modal.component';
import { ProjectDetailComponent } from 'src/app/pages/projects/project-detail.component';
import { ArraySortPipe } from 'src/app/pipes/array-sort.pipe';
import { MapComponentModule } from '../map/map.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MapComponentModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        ProjectDetailModalComponent,
        ProjectDetailComponent,
        ArraySortPipe
    ],
    exports: [
        ProjectDetailComponent
    ],
    entryComponents:[
       
    ],
    providers: [
       
    ]
})
export class ProjectDetailModalModule {}