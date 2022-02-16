import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/kohesio/notfound/notfound.component';
import { HomePageComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/static/about/about.component';
import { CookieComponent } from './pages/static/cookie/cookie.component';
import { PrivacyPageComponent } from './pages/static/privacy/privacy.component';
import { ServicesPageComponent } from './pages/static/services/services.component';
import { ThemesComponent } from './pages/static/themes/themes.component';

const routes: Routes = [
      { 
        path: '', 
        component: HomePageComponent,
        pathMatch: 'full',
      },{
        path: 'about', 
        component: AboutComponent,
        pathMatch: 'full',
      },{
        path: 'privacy', 
        component: PrivacyPageComponent,
        pathMatch: 'full'
      },{
        path: 'services', 
        component: ServicesPageComponent,
        pathMatch: 'full'
      },{
        path: 'themes', 
        component: ThemesComponent,
        pathMatch: 'full',
      },{
        path: 'cookie', 
        component: CookieComponent,
        pathMatch: 'full',
      },{ 
        path: 'projects', 
        loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule), 
      },{ 
        path: 'beneficiaries', 
        loadChildren: () => import('./pages/beneficiaries/beneficiaries.module').then(m => m.BeneficiariesModule)
      },{ 
        path: 'search', 
        loadChildren: () => import('./pages/search/search-page.module').then(m => m.SearchPageModule) 
      },{
        path: '404',
        component: NotFoundComponent,
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
