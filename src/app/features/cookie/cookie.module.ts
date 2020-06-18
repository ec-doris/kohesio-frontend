import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { CookieRoutingModule } from './cookie-routing.module';

import { CookieComponent } from './cookie.component';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

@NgModule({
    imports: [
        SharedModule,
        CookieRoutingModule,
        MatPaginatorModule,
        MatTableModule
    ],
    declarations: [
        CookieComponent
    ],
})
export class Module {}
