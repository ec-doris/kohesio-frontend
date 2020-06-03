import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { UxAllModule, UxBreadcrumbsService } from '@eui/core';

@NgModule({
    imports: [
        UxAllModule,
        TranslateModule
    ],
    declarations: [
    ],
    exports: [
        UxAllModule,
        TranslateModule,
    ],
    providers: [
        UxBreadcrumbsService
    ]
})
export class SharedModule {}
