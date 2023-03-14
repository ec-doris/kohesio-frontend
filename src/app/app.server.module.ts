import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TransferStateInterceptor} from "./interceptors/transfer-state.interceptor";

@NgModule({
  imports: [
    AppModule,
    ServerModule
  ],
  bootstrap: [AppComponent],
  providers:[
    {provide: HTTP_INTERCEPTORS, useClass: TransferStateInterceptor, multi: true}
  ]
})
export class AppServerModule {}
