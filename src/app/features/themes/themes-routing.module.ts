import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ThemesComponent } from './themes.component';

const routes: Routes = [
    { path: '', component: ThemesComponent,
        data: {
            breadcrumb: {
                label: 'Themes'
            },
            pageId:'themes'
        }},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class ThemesRoutingModule {}
