import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { UxAllModule, UxBreadcrumbsService } from '@eui/core';
import {NotFoundComponent} from "./notfound.component";
import {MapComponent} from "./components/map/map.component";

@NgModule({
    imports: [
        UxAllModule,
        TranslateModule
    ],
    declarations: [
        NotFoundComponent,
        MapComponent
    ],
    exports: [
        UxAllModule,
        TranslateModule,
        NotFoundComponent,
        MapComponent
    ],
    providers: [
        UxBreadcrumbsService
    ]
})
export class SharedModule {}
