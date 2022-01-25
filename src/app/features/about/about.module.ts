import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { AboutRoutingModule } from './about-routing.module';

import { AboutComponent } from './about.component';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

@NgModule({
    imports: [
        SharedModule,
        AboutRoutingModule,
        MatPaginatorModule,
        MatTableModule
    ],
    declarations: [
        AboutComponent
    ],
})
export class Module {}
