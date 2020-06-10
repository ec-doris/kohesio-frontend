import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectsComponent } from './projects.component';
import {ProjectDetailComponent} from "./project-detail.component";

const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent,
        data: {
            breadcrumb: {
                label: 'Projects'
            },
            pageId:'projects'
        },
    },{
        path: ':id',
        component: ProjectDetailComponent,
        data: {
            breadcrumb: {
                label: 'Project Detail',
                previousAllowed: 'projects'
            },
            pageId:'project-detail'
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class ProjectsRoutingModule {}
