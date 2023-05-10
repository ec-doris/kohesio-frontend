import {APP_INITIALIZER, Inject, NgModule, PLATFORM_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home/home.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DatePipe, DecimalPipe, isPlatformBrowser, ViewportScroller} from '@angular/common';

import { registerLocaleData } from '@angular/common';
import LocaleFr from '@angular/common/locales/fr';
import LocaleEnglish from '@angular/common/locales/en';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MapComponentModule } from './components/kohesio/map/map.module';
import { AboutComponent } from './pages/static/about/about.component';
import { ThemesComponent } from './pages/static/themes/themes.component';
import { NotFoundComponent } from './components/kohesio/notfound/notfound.component';
import { CarouselEclModule } from './components/ecl/carousel/carousel.ecl.module';
import { SiteHeaderEclModule } from './components/ecl/site-header/site-header.ecl.module';
import { FooterEclModule } from './components/ecl/footer/footer.ecl.module';
import { ProjectDetailModalModule } from './components/kohesio/project-detail-modal/project-detail.module';
import { PrivacyPageComponent } from './pages/static/privacy/privacy.component';
import { ServicesPageComponent } from './pages/static/services/services.component';
import {TransferStateInterceptor} from "./interceptors/transfer-state.interceptor";
import {UserService} from "./services/user.service";
import {EMPTY, Observable, Subscriber} from "rxjs";
import {ForbiddenComponent} from "./components/kohesio/forbidden/forbidden.component";
import {User} from "./models/user.model";

registerLocaleData(LocaleFr);
registerLocaleData(LocaleEnglish);

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AboutComponent,
    PrivacyPageComponent,
    ThemesComponent,
    NotFoundComponent,
    ForbiddenComponent,
    ServicesPageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MapComponentModule,
    CarouselEclModule,
    SiteHeaderEclModule,
    FooterEclModule,
    ProjectDetailModalModule
  ],
  providers: [
    DecimalPipe,
    DatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppCustomLogic,
      deps:[UserService, PLATFORM_ID],
      multi: true,
    },
    {provide: HTTP_INTERCEPTORS, useClass: TransferStateInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function initializeAppCustomLogic(userService: UserService, platformId: Object): () => Observable<any> {
  return () => {
    if (isPlatformBrowser(platformId)) {
      userService.refreshUser();
    }
    return new Observable<any>((subscriber:Subscriber<any>)=>{
      userService.getUserDetails().subscribe((user:User)=>{
        subscriber.complete();
      });
    })
  }
}
