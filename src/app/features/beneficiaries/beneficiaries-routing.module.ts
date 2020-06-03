import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BeneficiariesComponent } from './beneficiaries.component';

const routes: Routes = [
    { path: '', component: BeneficiariesComponent,
        data: {
            breadcrumb: {
                label: 'Beneficiaries'
            },
            pageId:'beneficiaries'
        }},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class BeneficiariesRoutingModule {}
