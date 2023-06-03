import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectDetailModalComponent } from './project-detail-modal.component';
import { ProjectDetailComponent } from 'src/app/pages/projects/project-detail.component';
import { ArraySortPipe } from 'src/app/pipes/array-sort.pipe';
import { MapComponentModule } from '../map/map.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { KohesioEclButtonModule } from '../../ecl/button/button.ecl.module';
import {YouTubePlayerModule} from "@angular/youtube-player";
import {MatTooltipModule} from '@angular/material/tooltip';
import {ShareBlockModule} from "../share-block/share-block.module";
import {ReactiveFormsModule} from "@angular/forms";
import {KohesioEclFormModule} from "../../ecl/forms/form.ecl.module";
import {KohesioEclFormTextAreaModule} from "../../ecl/forms/text-area/form-text-area.ecl.module";
import {KohesioEclFormLabelModule} from "../../ecl/forms/label/form-label.ecl.module";
import {KohesioEclDropDownButtonModule} from "../../ecl/dropdown-button/dropdown-button.ecl.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MapComponentModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        KohesioEclButtonModule,
        KohesioEclFormModule,
        KohesioEclFormLabelModule,
        KohesioEclFormTextAreaModule,
        YouTubePlayerModule,
        MatTooltipModule,
        ShareBlockModule,
        KohesioEclDropDownButtonModule
    ],
    declarations: [
        ProjectDetailModalComponent,
        ProjectDetailComponent,
        ArraySortPipe
    ],
    exports: [
        ProjectDetailComponent,
        ArraySortPipe
    ],
    providers: []
})
export class ProjectDetailModalModule {}
