import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailComponent } from './project-detail.component';
import { ProjectResolver } from './project.resolve';
import { ProjectsComponent } from './projects.component';
import {ProjectListResolver} from "./projects.resolve";

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
        resolve: {
            filters: ProjectListResolver
        }
    },{
        path: ':id',
        component: ProjectDetailComponent,
        data: {
            breadcrumb: {
                label: 'Project Detail',
                previousAllowed: 'projects'
            },
            pageId:'project-detail'
        },
        resolve: {
            project: ProjectResolver
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class ProjectsRoutingModule {}
