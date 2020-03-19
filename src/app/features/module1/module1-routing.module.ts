import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page1Component } from './components/page1/page1.component';
import { Page2Component } from './components/page2/page2.component';
import { Module1Component } from './module1.component';

const routes: Routes = [
    { path: '', component: Module1Component },
    { path: 'page1', component: Page1Component },
    { path: 'page2', component: Page2Component },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class Module1RoutingModule {}
