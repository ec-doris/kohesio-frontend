import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { KohesioEclButtonModule } from 'src/app/components/ecl/button/button.ecl.module';
import { KohesioEclFormModule } from 'src/app/components/ecl/forms/form.ecl.module';
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
    ],
    declarations: [
        SearchPageComponent
    ],
    exports: [
    ],
    providers: [
    ]
})
export class SearchPageModule {}
