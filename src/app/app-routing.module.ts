import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'screen/home', redirectTo: '', pathMatch: 'full' },
    { path: '', loadChildren: './features/home/home.module#Module', pathMatch: 'full' },
    { path: 'map-view', loadChildren: './features/module1/module1.module#Module' },
    { path: 'full-search', loadChildren: './features/module2/module2.module#Module' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
})
export class AppRoutingModule {}
