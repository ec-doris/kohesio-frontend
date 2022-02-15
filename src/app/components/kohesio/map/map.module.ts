import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OutermostRegionsPipe } from 'src/app/pipes/outermost-regions.pipe';
import { MapPopupComponent } from './map-popup.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        MatDialogModule
    ],
    declarations: [
        MapComponent,
        MapPopupComponent,
        OutermostRegionsPipe
    ],
    exports: [
        MapComponent,
        OutermostRegionsPipe
    ],
    entryComponents:[
       
    ],
    providers: [
       
    ]
})
export class MapComponentModule {}