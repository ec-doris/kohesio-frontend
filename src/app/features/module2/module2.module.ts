import { NgModule } from '@angular/core';
import { Module2RoutingModule } from './module2-routing.module';
import { Module2Component } from './module2.component';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        Module2RoutingModule,
    ],
    declarations: [
        Module2Component,
    ],
})
export class Module {
}
