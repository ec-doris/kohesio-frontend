import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { BeneficiariesRoutingModule } from './beneficiaries-routing.module';

import { BeneficiariesComponent } from './beneficiaries.component';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {BeneficiaryDetailComponent} from "./beneficiary-detail.component";

@NgModule({
    imports: [
        SharedModule,
        BeneficiariesRoutingModule,
        MatPaginatorModule,
        MatTableModule
    ],
    declarations: [
        BeneficiariesComponent,
        BeneficiaryDetailComponent
    ],
})
export class Module {}
