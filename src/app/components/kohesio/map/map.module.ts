import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OutermostRegionsPipe } from 'src/app/pipes/outermost-regions.pipe';
import { MapPopupComponent } from './map-popup.component';
import {MatDialogModule} from '@angular/material/dialog';
import { KohesioEclSpinnerModule } from '../../ecl/spinner/spinner.ecl.module';
import {MapPageComponent} from "../../../pages/map/map-page.component";
import {MapMessageBoxComponent} from "./map-message-box";


@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        MatDialogModule,
        KohesioEclSpinnerModule
    ],
    declarations: [
        MapComponent,
        MapPopupComponent,
        OutermostRegionsPipe,
        MapPageComponent,
        MapMessageBoxComponent
    ],
    exports: [
        MapComponent,
        OutermostRegionsPipe
    ],
    providers: []
})
export class MapComponentModule {}
