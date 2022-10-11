import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/kohesio/notfound/notfound.component';
import { HomePageComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/static/about/about.component';
import { CookieComponent } from './pages/static/cookie/cookie.component';
import { FaqPageComponent } from './pages/static/faq/faq.component';
import { PrivacyPageComponent } from './pages/static/privacy/privacy.component';
import { ServicesPageComponent } from './pages/static/services/services.component';
import { ThemesComponent } from './pages/static/themes/themes.component';
import {MapPageComponent} from "./pages/map/map-page.component";
import {MapPageResolve} from "./pages/map/map-page.resolve";

const routes: Routes = [
      {
        path: '',
        component: HomePageComponent,
        pathMatch: 'full',
      },{
        path: $localize`:@@translate.routes.about:about`,
        component: AboutComponent,
        pathMatch: 'full',
      },{
        path: $localize`:@@translate.routes.privacy:privacy`,
        component: PrivacyPageComponent,
        pathMatch: 'full'
      },{
        path: $localize`:@@translate.routes.services:services`,
        component: ServicesPageComponent,
        pathMatch: 'full'
      },{
        path: $localize`:@@translate.routes.themes:themes`,
        component: ThemesComponent,
        pathMatch: 'full',
      },{
        path: 'cookie',
        component: CookieComponent,
        pathMatch: 'full',
      },{
        path: $localize`:@@translate.routes.faq:faq`,
        component: FaqPageComponent,
        pathMatch: 'full',
      },{
        path: $localize`:@@translate.routes.map:map`,
        component: MapPageComponent,
        pathMatch: 'full',
        resolve: {
          filters: MapPageResolve
        }
      },{
        path: $localize`:@@translate.routes.projects:projects`,
        loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule)
      },{
        path: $localize`:@@translate.routes.beneficiaries:beneficiaries`,
        loadChildren: () => import('./pages/beneficiaries/beneficiaries.module').then(m => m.BeneficiariesModule)
      },{
        path: $localize`:@@translate.routes.search:search`,
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
  imports: [RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
