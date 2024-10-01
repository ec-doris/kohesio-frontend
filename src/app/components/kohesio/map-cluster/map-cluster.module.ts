import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { OutermostRegionsPipe } from 'src/app/pipes/outermost-regions.pipe';
import { SharedModule } from '../../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';
import { KohesioEclSpinnerModule } from '../../ecl/spinner/spinner.ecl.module';
import {MapClusterComponent} from "./map-cluster.component";

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
    MapClusterComponent
  ],
  exports: [
    MapClusterComponent
  ],
  providers: []
})
export class MapClusterComponentModule {
}
