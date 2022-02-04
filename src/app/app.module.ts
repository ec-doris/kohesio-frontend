import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import LocaleEnglish from '@angular/common/locales/en';
import LocaleFrench from '@angular/common/locales/fr';
import { ConfigModule, ConfigService } from './services/config.service';

registerLocaleData(LocaleEnglish);
registerLocaleData(LocaleFrench);

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        DatePipe,
        ConfigService,
        ConfigModule.init(),
    ]
})
export class AppModule {}
