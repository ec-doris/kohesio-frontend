import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { ProjectsRoutingModule } from './projects-routing.module';

import { ProjectsComponent } from './projects.component';
import {BudgetPipe} from "../../shared/budget.pipe";

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

@NgModule({
    imports: [
        SharedModule,
        ProjectsRoutingModule,
        MatPaginatorModule,
        MatTableModule
    ],
    declarations: [
        ProjectsComponent,
        BudgetPipe
    ],
})
export class Module {}
