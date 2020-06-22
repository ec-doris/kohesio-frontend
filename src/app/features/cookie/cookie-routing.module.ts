import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CookieComponent } from './cookie.component';

const routes: Routes = [
    { path: '', component: CookieComponent,
        data: {
            breadcrumb: {
                label: 'Cookie'
            },
            pageId:'cookie'
        }},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class CookieRoutingModule {}
