import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../material/material.module';
import { ProjectsModule } from '../projects2/projects.module';
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
import { KohesioEclButtonModule } from 'src/app/components/ecl/button/button.ecl.module';
import { KohesioEclFormModule } from 'src/app/components/ecl/forms/form.ecl.module';
import { KohesioEclAccordionModule } from 'src/app/components/ecl/accordion/accordion.ecl.module';
import { DownloadButtonModule } from 'src/app/components/kohesio/download-button/download-button.module';
import { KohesioEclSpinnerModule } from 'src/app/components/ecl/spinner/spinner.ecl.module';
import { ImageOverlayModule } from 'src/app/components/kohesio/image-overlay/image-overlay.module';
import {ShareBlockModule} from "../../components/kohesio/share-block/share-block.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {OverlayModule} from "@angular/cdk/overlay";
import { BeneficeFormComponent } from './benefici-form/benefice-form.component';

@NgModule({
  imports: [
    MaterialModule,
    RouterModule,
    BeneficiariesRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    CommonModule,
    MapComponentModule,
    MatSidenavModule,
    ReactiveFormsModule,
    KohesioEclFormModule,
    KohesioEclButtonModule,
    KohesioEclAccordionModule,
    DownloadButtonModule,
    KohesioEclSpinnerModule,
    ImageOverlayModule,
    ShareBlockModule,
    MatTooltipModule,
    OverlayModule,
    MatIconModule,
    ProjectsModule
  ],
    declarations: [
        BeneficiariesComponent,
        BeneficiaryDetailComponent,
        BeneficeFormComponent
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorKohesio}
    ]
})
export class BeneficiariesModule {}
