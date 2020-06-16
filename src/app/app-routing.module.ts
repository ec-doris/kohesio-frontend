import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotFoundComponent} from "./shared/notfound.component";

const routes: Routes = [
    { path: 'screen/home', redirectTo: '', pathMatch: 'full' },
    { path: '', loadChildren: './features/home/home.module#Module', pathMatch: 'full' },
    { path: 'projects', loadChildren: './features/projects/projects.module#Module' },
    { path: 'beneficiaries', loadChildren: './features/beneficiaries/beneficiaries.module#Module', pathMatch: 'full' },
    { path: 'themes', loadChildren: './features/themes/themes.module#Module', pathMatch: 'full' },
    { path: 'about', loadChildren: './features/about/about.module#Module', pathMatch: 'full' },
    {path: '404', component: NotFoundComponent},
    {path: '**', redirectTo: '/404'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
})
export class AppRoutingModule {}
