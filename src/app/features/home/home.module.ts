import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { MapviewModalComponent } from './components/mapview-modal/mapview-modal.component';

@NgModule({
    imports: [
        SharedModule,
        HomeRoutingModule,
    ],
    declarations: [
        HomeComponent,
        MapviewModalComponent,
    ],
})
export class Module {}
