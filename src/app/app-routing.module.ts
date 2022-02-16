import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/kohesio/notfound/notfound.component';
import { HomePageComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/static/about/about.component';
import { CookieComponent } from './pages/static/cookie/cookie.component';
import { ThemesComponent } from './pages/static/themes/themes.component';

const routes: Routes = [
      { 
        path: '', 
        component: HomePageComponent,
        pathMatch: 'full',
        data: {breadcrumb: 'Home'}
      },{
        path: 'about', 
        component: AboutComponent,
        pathMatch: 'full',
        data: {breadcrumb: 'About'}
      },{
        path: 'themes', 
        component: ThemesComponent,
        pathMatch: 'full',
        data: {breadcrumb: 'Themes'}
      },{
        path: 'cookie', 
        component: CookieComponent,
        pathMatch: 'full',
        data: {breadcrumb: 'Cookies'}
      },{ 
        path: 'projects', 
        loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule),
        data: {breadcrumb: 'Projects'} 
      },{ 
        path: 'beneficiaries', 
        loadChildren: () => import('./pages/beneficiaries/beneficiaries.module').then(m => m.BeneficiariesModule), 
        data: {breadcrumb: 'Beneficiaries'}
      },{
        path: '404',
        component: NotFoundComponent,
        data: {breadcrumb: '404'}
      },
      {
        path: '**',
        redirectTo: '/404'
      }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
