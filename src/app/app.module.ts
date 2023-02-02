import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, DecimalPipe, ViewportScroller} from '@angular/common';

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
import { FaqPageComponent } from './pages/static/faq/faq.component';

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
    ServicesPageComponent,
    FaqPageComponent
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
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
