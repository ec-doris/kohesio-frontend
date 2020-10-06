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
import { DecimalPipe } from '@angular/common';

@NgModule({
    imports: [
        UxAllModule,
        EclAllModule,
        EuiAllModule,
        TranslateModule,
    ],
    declarations: [
        NotFoundComponent,
        MapComponent,
        BudgetPipe
    ],
    exports: [
        UxAllModule,
        EclAllModule,
        EuiAllModule,
        TranslateModule,
        NotFoundComponent,
        MapComponent,
        BudgetPipe
    ],
    providers: [
        UxBreadcrumbsService,
        { provide: MatPaginatorIntl, useClass: MatPaginatorKohesio},
        DecimalPipe
    ]
})
export class SharedModule {}
