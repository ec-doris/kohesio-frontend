import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: './features/home/home.module#Module', pathMatch: 'full' },
    { path: 'module1', loadChildren: './features/module1/module1.module#Module' },
    { path: 'module2', loadChildren: './features/module2/module2.module#Module' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
})
export class AppRoutingModule {}
