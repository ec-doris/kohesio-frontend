import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
    CachePreventionInterceptor,
    CorsSecurityInterceptor,
    CsrfPreventionInterceptor,
    EuLoginSessionTimeoutHandlingInterceptor,
    CoreModule as EuiCoreModule,
    translateConfig,
    EUI_CONFIG_TOKEN
} from '@eui/core';

import './operators';

import { appConfig } from '../../config/index';
import { environment } from '../../environments/environment';

import { REDUCER_TOKEN, getReducers, metaReducers } from './reducers/index';

import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        EuiCoreModule.forRoot(),
        TranslateModule.forRoot(translateConfig),
        StoreModule.forRoot(REDUCER_TOKEN, { metaReducers }),
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    ],
    declarations: [
    ],
    exports: [
        SharedModule,
    ],
    providers: [
        {
            provide: REDUCER_TOKEN,
            deps: [],
            useFactory: getReducers
        },
        {
            provide: EUI_CONFIG_TOKEN,
            useValue: { appConfig: appConfig, environment: environment }
        }
    ]
})
export class CoreModule {

}
