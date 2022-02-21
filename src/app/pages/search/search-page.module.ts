import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { KohesioEclButtonModule } from 'src/app/components/ecl/button/button.ecl.module';
import { KohesioEclFormModule } from 'src/app/components/ecl/forms/form.ecl.module';
import { KohesioEclSpinnerModule } from 'src/app/components/ecl/spinner/spinner.ecl.module';
import { MatPaginatorKohesio } from 'src/app/components/kohesio/paginator/mat-paginator-intl.component';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SearchPageRoutingModule,
        KohesioEclFormModule,
        KohesioEclButtonModule,
        KohesioEclSpinnerModule,
        MatPaginatorModule
    ],
    declarations: [
        SearchPageComponent
    ],
    exports: [
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorKohesio},
    ]
})
export class SearchPageModule {}
