import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { OutermostRegionsPipe } from 'src/app/pipes/outermost-regions.pipe';
import { SharedModule } from '../../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';
import { MapPageComponent } from '../../../pages/map/map-page.component';
import { KohesioEclSpinnerModule } from '../../ecl/spinner/spinner.ecl.module';
import { MapRegionComponent } from '../map-region/map-region.component';
import { MapMessageBoxComponent } from './map-message-box';
import { MapPopupComponent } from './map-popup.component';
import { MapComponent } from './map.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    CommonModule,
    MatDialogModule,
    MaterialModule,
    KohesioEclSpinnerModule
  ],
  declarations: [
    MapRegionComponent,
    MapComponent,
    MapPopupComponent,
    OutermostRegionsPipe,
    MapPageComponent,
    MapMessageBoxComponent
  ],
  exports: [
    MapComponent,
    MapRegionComponent,
    OutermostRegionsPipe
  ],
  providers: []
})
export class MapComponentModule {
}
