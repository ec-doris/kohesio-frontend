import { NgModule } from '@angular/core';
import { BeneficiariesRoutingModule } from './beneficiaries-routing.module';
import { BeneficiariesComponent } from './beneficiaries.component';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MapComponentModule } from 'src/app/components/kohesio/map/map.module';
import {BeneficiaryDetailComponent} from "./beneficiary-detail.component";
import { MatPaginatorKohesio } from 'src/app/components/kohesio/paginator/mat-paginator-intl.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        RouterModule,
        BeneficiariesRoutingModule,
        MatPaginatorModule,
        MatTableModule,
        CommonModule,
        MapComponentModule,
        MatSidenavModule,
        ReactiveFormsModule
    ],
    declarations: [
        BeneficiariesComponent,
        BeneficiaryDetailComponent
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorKohesio}
    ]
})
export class BeneficiariesModule {}
