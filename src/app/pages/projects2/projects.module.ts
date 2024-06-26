import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { KohesioEclAccordionModule } from 'src/app/components/ecl/accordion/accordion.ecl.module';
import { KohesioEclButtonModule } from 'src/app/components/ecl/button/button.ecl.module';
import { KohesioEclFormModule } from 'src/app/components/ecl/forms/form.ecl.module';
import { KohesioEclSpinnerModule } from 'src/app/components/ecl/spinner/spinner.ecl.module';
import { DownloadButtonModule } from 'src/app/components/kohesio/download-button/download-button.module';
import { ImageOverlayModule } from 'src/app/components/kohesio/image-overlay/image-overlay.module';
import { MapComponentModule } from 'src/app/components/kohesio/map/map.module';
import { MatPaginatorKohesio } from 'src/app/components/kohesio/paginator/mat-paginator-intl.component';
import { ProjectDetailModalModule } from 'src/app/components/kohesio/project-detail-modal/project-detail.module';
import { SharedModule } from 'src/shared/shared.module';
import { DialogEclModule } from '../../components/ecl/dialog/dialog.ecl.module';
import { KohesioEclDropDownButtonModule } from '../../components/ecl/dropdown-button/dropdown-button.ecl.module';
import { KohesioEclFormTextAreaModule } from '../../components/ecl/forms/text-area/form-text-area.ecl.module';
import { KohesioEclMessageModule } from '../../components/ecl/message/message.ecl.module';
import { KohesioAutoCompleteModule } from '../../components/kohesio/auto-complete/auto-complete.module';
import { KohesioMultiAutoCompleteModule } from '../../components/kohesio/multi-auto-complete/multi-auto-complete.module';
import { TruncateHtmlPipe } from '../../pipes/truncate-html.pipe';
import { SaveDraftComponent } from './dialogs/save-draft.component';
import { FiltersPipe } from './filters.pipe';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';


@NgModule({
  imports: [
    SharedModule,
    ProjectsRoutingModule,
    MapComponentModule,
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
    KohesioEclMessageModule
  ],
  declarations: [
    ProjectsComponent,
    SaveDraftComponent,
    TruncateHtmlPipe
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorKohesio },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class ProjectsModule {
}
