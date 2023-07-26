import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SurveyDialogComponent} from "./survey-dialog.component";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        SurveyDialogComponent
    ],
    exports: [
      SurveyDialogComponent
    ],
    providers: []
})
export class SurveyDialogModule {}
