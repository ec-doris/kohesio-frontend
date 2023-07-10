import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/kohesio/notfound/notfound.component';
import { HomePageComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/static/about/about.component';
import { PrivacyPageComponent } from './pages/static/privacy/privacy.component';
import { ServicesPageComponent } from './pages/static/services/services.component';
import { ThemesComponent } from './pages/static/themes/themes.component';
import {MapPageComponent} from "./pages/map/map-page.component";
import {MapPageResolve} from "./pages/map/map-page.resolve";
import {ForbiddenComponent} from "./components/kohesio/forbidden/forbidden.component";

const routes: Routes = [
      {
        path: '',
        component: HomePageComponent,
        pathMatch: 'full',
        data: {
          title: 'Kohesio',
          description: $localize `:@@page.metadata.home.description:Data about projects funded by the European Union`
        }
      },{
        path: $localize`:@@translate.routes.about:about`,
        component: AboutComponent,
        pathMatch: 'full',
        data: {
          title: $localize`:@@page.about.title:About Kohesio`
        }
      },{
        path: $localize`:@@translate.routes.privacy:privacy`,
        component: PrivacyPageComponent,
        pathMatch: 'full',
        data: {
          title: $localize`:@@page.privacy.title:Protection of your personal data`
        }
      },{
        path: $localize`:@@translate.routes.services:services`,
        component: ServicesPageComponent,
        pathMatch: 'full',
        data: {
          title: $localize`:@@page.services.title:Services`
        }
      },{
        path: $localize`:@@translate.routes.themes:themes`,
        component: ThemesComponent,
        pathMatch: 'full',
        data: {
          title: $localize`:@@page.themes.breadcrumb.themes:Themes`
        }
      },{
        path: $localize`:@@translate.routes.faq:faq`,
        data: {
          title: $localize`:@@page.faq.title:Frequently asked questions`
        },
        loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqModule)
      },{
        path: 'map',
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
        loadChildren: () => import('./pages/beneficiaries/beneficiaries.module').then(m => m.BeneficiariesModule),
        data: {
          title: $localize`:@@page.beneficiaries.breadcrumb.beneficiaries:Beneficiaries`,
          description: $localize `:@@page.metadata.beneficiaries.description:Beneficiaries of EU co-funded projects`
        }
      },{
        path: $localize`:@@translate.routes.search:search`,
        loadChildren: () => import('./pages/search/search-page.module').then(m => m.SearchPageModule)
      },{
        path: 'users',
        loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)
      },{
        path: 'edits',
        loadChildren: () => import('./pages/edits/edits.module').then(m => m.EditsModule)
      },{
        path: '403',
        component: ForbiddenComponent,
      }, {
        path: '404',
        component: NotFoundComponent
      },{
        path: '**',
        redirectTo: '/404'
      }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload',
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
