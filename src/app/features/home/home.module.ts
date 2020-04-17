import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import {BudgetPipe} from "../../shared/budget.pipe";

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

@NgModule({
    imports: [
        SharedModule,
        HomeRoutingModule,
        MatPaginatorModule,
        MatTableModule
    ],
    declarations: [
        HomeComponent,
        BudgetPipe
    ],
})
export class Module {}
