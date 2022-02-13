import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectDetailModalComponent } from './project-detail-modal.component';
import { ProjectsModule } from 'src/app/pages/projects/projects.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        ProjectsModule
    ],
    declarations: [
        ProjectDetailModalComponent
    ],
    exports: [
        ProjectDetailModalComponent
    ],
    entryComponents:[
       
    ],
    providers: [
       
    ]
})
export class ProjectDetailModalModule {}