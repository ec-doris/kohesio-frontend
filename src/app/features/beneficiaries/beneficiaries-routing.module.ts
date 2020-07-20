import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BeneficiariesComponent } from './beneficiaries.component';
import {ProjectListResolver} from "../projects/projects.resolve";
import {BeneficiariesListResolver} from "./beneficiaries.resolve";

const routes: Routes = [
    {
        path: '',
        component: BeneficiariesComponent,
        data: {
            breadcrumb: {
                label: 'Beneficiaries'
            },
            pageId: 'beneficiaries'
        },
        resolve: {
            filters: BeneficiariesListResolver
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class BeneficiariesRoutingModule {}
