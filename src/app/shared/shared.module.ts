import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {MatPaginatorIntl} from '@angular/material';

import { UxAllModule, UxBreadcrumbsService } from '@eui/core';
import {NotFoundComponent} from "./notfound.component";
import {MapComponent} from "./components/map/map.component";
import {BudgetPipe} from "./budget.pipe";
import {MatPaginatorKohesio} from "./components/paginator/mat-paginator-intl.component";
import { DecimalPipe } from '@angular/common';

@NgModule({
    imports: [
        UxAllModule,
        TranslateModule
    ],
    declarations: [
        NotFoundComponent,
        MapComponent,
        BudgetPipe
    ],
    exports: [
        UxAllModule,
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
