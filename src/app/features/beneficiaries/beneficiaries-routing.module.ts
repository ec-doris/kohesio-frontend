import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficiariesComponent } from './beneficiaries.component';
import {BeneficiariesListResolver} from "./beneficiaries.resolve";
import {BeneficiaryDetailComponent} from "./beneficiary-detail.component";
import { BeneficiaryProjectListResolver } from './beneficiary-project-list.resolve';
import {BeneficiaryDetailResolver} from "./beneficiary.resolve";

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
    },{
        path: ':id',
        component: BeneficiaryDetailComponent,
        data: {
            breadcrumb: {
                label: 'Beneficiary Detail',
                previousAllowed: 'beneficiaries'
            },
            pageId:'beneficiary-detail'
        },
        resolve: {
            beneficiary: BeneficiaryDetailResolver,
            beneficiaryProjects: BeneficiaryProjectListResolver,
        }
    }

];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class BeneficiariesRoutingModule {}
