import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { UxAllModule, UxBreadcrumbsService } from '@eui/core';
import {NotFoundComponent} from "./notfound.component";

@NgModule({
    imports: [
        UxAllModule,
        TranslateModule
    ],
    declarations: [
        NotFoundComponent
    ],
    exports: [
        UxAllModule,
        TranslateModule,
        NotFoundComponent
    ],
    providers: [
        UxBreadcrumbsService
    ]
})
export class SharedModule {}
