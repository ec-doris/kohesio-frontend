import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './search-page.component';

const routes: Routes = [
    {
        path: '',
        component: SearchPageComponent,
        data: {
            breadcrumb: {
                label: 'Search'
            },
            pageId:'search'
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class SearchPageRoutingModule {}
