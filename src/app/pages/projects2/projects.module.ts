import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MapComponentModule } from 'src/app/components/kohesio/map/map.module';
import { MatPaginatorKohesio } from 'src/app/components/kohesio/paginator/mat-paginator-intl.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KohesioEclFormModule } from 'src/app/components/ecl/forms/form.ecl.module';
import { KohesioEclButtonModule } from 'src/app/components/ecl/button/button.ecl.module';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core'
import { KohesioEclAccordionModule } from 'src/app/components/ecl/accordion/accordion.ecl.module';
import { DownloadButtonModule } from 'src/app/components/kohesio/download-button/download-button.module';
import { KohesioEclSpinnerModule } from 'src/app/components/ecl/spinner/spinner.ecl.module';
import { ProjectDetailModalModule } from 'src/app/components/kohesio/project-detail-modal/project-detail.module';
import { ImageOverlayModule } from 'src/app/components/kohesio/image-overlay/image-overlay.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {KohesioAutoCompleteModule} from "../../components/kohesio/auto-complete/auto-complete.module";
import {KohesioEclFormTextAreaModule} from "../../components/ecl/forms/text-area/form-text-area.ecl.module";
import {SaveDraftComponent} from "./dialogs/save-draft.component";
import {DialogEclModule} from "../../components/ecl/dialog/dialog.ecl.module";
import {KohesioEclDropDownButtonModule} from "../../components/ecl/dropdown-button/dropdown-button.ecl.module";
import {KohesioEclMessageModule} from "../../components/ecl/message/message.ecl.module";
import {OverlayModule} from "@angular/cdk/overlay";
import {KohesioMultiAutoCompleteModule} from "../../components/kohesio/multi-auto-complete/multi-auto-complete.module";
import {TruncateHtmlPipe} from "../../pipes/truncate-html.pipe";
import { FiltersComponent } from './dialogs/filters/filters/filters.component';
import { FiltersPipe } from './filters.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    KohesioEclFormModule,
    KohesioEclButtonModule,
    KohesioEclAccordionModule,
    KohesioEclSpinnerModule,
    KohesioEclFormTextAreaModule,
    KohesioMultiAutoCompleteModule,
    ProjectDetailModalModule,
    DownloadButtonModule,
    ImageOverlayModule,
    KohesioAutoCompleteModule,
    DialogEclModule,
    KohesioEclDropDownButtonModule,
    KohesioEclMessageModule,
    OverlayModule,
    MatChipsModule,
    MatDialogModule
  ],
    declarations: [
        ProjectsComponent,
        SaveDraftComponent,
        TruncateHtmlPipe,
        FiltersComponent,
        FiltersPipe
    ],
    exports: [
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorKohesio},
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
    ]
})
export class ProjectsModule {}
