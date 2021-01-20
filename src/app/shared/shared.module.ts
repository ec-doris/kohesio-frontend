import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { UxAllModule, UxBreadcrumbsService } from '@eui/components';
import { EclAllModule } from '@eui/ecl-core';
import { EuiAllModule } from '@eui/components-next';
import {NotFoundComponent} from "./notfound.component";
import {MapComponent} from "./components/map/map.component";
import {BudgetPipe} from "./budget.pipe";
import {MatPaginatorKohesio} from "./components/paginator/mat-paginator-intl.component";
import {CommonModule, DecimalPipe} from '@angular/common';
import {MapPopupComponent} from "./components/map/map-popup.component";
import {DownloadButtonComponent} from "./components/download-button/download-button.component";
import {ProjectDetailComponent} from "../features/projects/project-detail.component";
import {ProjectDetailModalComponent} from "./components/project-detail-modal/project-detail-modal.component";

@NgModule({
    imports: [
        UxAllModule,
        EclAllModule,
        EuiAllModule,
        TranslateModule,
        CommonModule,
    ],
    declarations: [
        NotFoundComponent,
        MapComponent,
        BudgetPipe,
        MapPopupComponent,
        DownloadButtonComponent,
        ProjectDetailComponent,
        ProjectDetailModalComponent
    ],
    exports: [
        UxAllModule,
        EclAllModule,
        EuiAllModule,
        TranslateModule,
        NotFoundComponent,
        MapComponent,
        BudgetPipe,
        DownloadButtonComponent,
        ProjectDetailComponent
    ],
    entryComponents:[
        MapPopupComponent
    ],
    providers: [
        UxBreadcrumbsService,
        { provide: MatPaginatorIntl, useClass: MatPaginatorKohesio},
        DecimalPipe
    ]
})
export class SharedModule {}
