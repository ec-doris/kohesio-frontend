import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { KohesioEclFormModule } from 'src/app/components/ecl/forms/form.ecl.module';
import { KohesioEclSpinnerModule } from 'src/app/components/ecl/spinner/spinner.ecl.module';
import { DownloadButtonModule } from 'src/app/components/kohesio/download-button/download-button.module';
import { ImageOverlayModule } from 'src/app/components/kohesio/image-overlay/image-overlay.module';
import { MapComponentModule } from 'src/app/components/kohesio/map/map.module';
import { MatPaginatorKohesio } from 'src/app/components/kohesio/paginator/mat-paginator-intl.component';
import { SharedModule } from '../../../shared/shared.module';
import { ShareBlockModule } from '../../components/kohesio/share-block/share-block.module';
import { ProjectsModule } from '../projects/projects.module';
import { BeneficeFormComponent } from './benefici-form/benefice-form.component';
import { BeneficiariesRoutingModule } from './beneficiaries-routing.module';
import { BeneficiariesComponent } from './beneficiaries.component';
import { BeneficiaryDetailComponent } from './beneficiary-detail.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    BeneficiariesRoutingModule,
    MapComponentModule,
    KohesioEclFormModule,
    DownloadButtonModule,
    KohesioEclSpinnerModule,
    ImageOverlayModule,
    ShareBlockModule,
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
