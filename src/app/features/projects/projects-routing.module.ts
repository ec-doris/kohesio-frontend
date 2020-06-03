import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectsComponent } from './projects.component';

const routes: Routes = [
    { path: '', component: ProjectsComponent,
        data: {
            breadcrumb: {
                label: 'Projects'
            },
            pageId:'projects'
        }}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class ProjectsRoutingModule {}
