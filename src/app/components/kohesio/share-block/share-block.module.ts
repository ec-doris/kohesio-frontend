import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShareBlockComponent} from "./share-block.component";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
    imports: [
        CommonModule,
        MatTooltipModule
    ],
    declarations: [
        ShareBlockComponent
    ],
    exports: [
      ShareBlockComponent
    ],
    providers: []
})
export class ShareBlockModule {}
