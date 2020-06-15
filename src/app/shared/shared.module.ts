import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { UxAllModule, UxBreadcrumbsService } from '@eui/core';
import {NotFoundComponent} from "./notfound.component";
import {MapComponent} from "./components/map/map.component";
import {BudgetPipe} from "./budget.pipe";

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
        UxBreadcrumbsService
    ]
})
export class SharedModule {}
