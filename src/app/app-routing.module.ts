import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'screen/home', redirectTo: '', pathMatch: 'full' },
    { path: '', loadChildren: './features/home/home.module#Module', pathMatch: 'full' },
    { path: 'projects', loadChildren: './features/projects/projects.module#Module', pathMatch: 'full' },
    { path: 'beneficiaries', loadChildren: './features/beneficiaries/beneficiaries.module#Module', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
})
export class AppRoutingModule {}
