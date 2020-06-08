import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { ThemesRoutingModule } from './themes-routing.module';

import { ThemesComponent } from './themes.component';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

@NgModule({
    imports: [
        SharedModule,
        ThemesRoutingModule,
        MatPaginatorModule,
        MatTableModule
    ],
    declarations: [
        ThemesComponent
    ],
})
export class Module {}
