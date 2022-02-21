import { NgModule } from '@angular/core';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectDetailComponent } from './project-detail.component';
import { MapComponentModule } from 'src/app/components/kohesio/map/map.module';
import { MatPaginatorKohesio } from 'src/app/components/kohesio/paginator/mat-paginator-intl.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { KohesioEclFormModule } from 'src/app/components/ecl/forms/form.ecl.module';
import { KohesioEclButtonModule } from 'src/app/components/ecl/button/button.ecl.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { KohesioEclAccordionModule } from 'src/app/components/ecl/accordion/accordion.ecl.module';
import { DownloadButtonModule } from 'src/app/components/kohesio/download-button/download-button.module';
import { KohesioEclSpinnerModule } from 'src/app/components/ecl/spinner/spinner.ecl.module';
import { ProjectDetailModalModule } from 'src/app/components/kohesio/project-detail-modal/project-detail.module';
import {NgxPopperjsModule} from 'ngx-popperjs';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ProjectsRoutingModule,
        MatPaginatorModule,
        MatTableModule,
        MapComponentModule,
        MatSidenavModule,
        MatTabsModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatMomentDateModule,
        KohesioEclFormModule,
        KohesioEclButtonModule,
        KohesioEclAccordionModule,
        KohesioEclSpinnerModule,
        ProjectDetailModalModule,
        DownloadButtonModule,
        NgxPopperjsModule
    ],
    declarations: [
        ProjectsComponent
    ],
    exports: [
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorKohesio},
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
    ]
})
export class ProjectsModule {}
