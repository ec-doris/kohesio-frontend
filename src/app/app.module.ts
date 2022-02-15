import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, DecimalPipe} from '@angular/common';
import { ConfigModule, ConfigService } from './services/config.service';

import { registerLocaleData } from '@angular/common';
import LocaleFr from '@angular/common/locales/fr';
import LocaleEnglish from '@angular/common/locales/en';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MapComponentModule } from './components/kohesio/map/map.module';
import { AboutComponent } from './pages/static/about/about.component';
import { ThemesComponent } from './pages/static/themes/themes.component';
import { NotFoundComponent } from './components/kohesio/notfound/notfound.component';
import { CookieComponent } from './pages/static/cookie/cookie.component';
import { CarouselEclModule } from './components/ecl/carousel/carousel.ecl.module';
import { SiteHeaderEclModule } from './components/ecl/site-header/site-header.ecl.module';
import { FooterEclModule } from './components/ecl/footer/footer.ecl.module';
import { ProjectDetailModalModule } from './components/kohesio/project-detail-modal/project-detail.module';

registerLocaleData(LocaleFr);
registerLocaleData(LocaleEnglish);

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AboutComponent,
    ThemesComponent,
    NotFoundComponent,
    CookieComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
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
    ConfigService,
    ConfigModule.init()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
