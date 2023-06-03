import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TransferStateInterceptor} from "./interceptors/transfer-state.interceptor";
import {XhrFactory} from "@angular/common";
const xhr2 = require('xhr2');

export class ServerXhr implements XhrFactory {
  build(): XMLHttpRequest {
    xhr2.XMLHttpRequest.prototype._restrictedHeaders = false;
    return new xhr2.XMLHttpRequest();
  }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule
  ],
  bootstrap: [AppComponent],
  providers:[
    {provide: HTTP_INTERCEPTORS, useClass: TransferStateInterceptor, multi: true},
    { provide: XhrFactory, useClass: ServerXhr }
  ]
})
export class AppServerModule {}
