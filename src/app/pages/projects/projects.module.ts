import { NgModule } from '@angular/core';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectDetailComponent } from './project-detail.component';
import { MapComponentModule } from 'src/app/components/kohesio/map/map.module';
import { MatPaginatorKohesio } from 'src/app/components/kohesio/paginator/mat-paginator-intl.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { ArraySortPipe } from 'src/app/pipes/array-sort.pipe';


@NgModule({
    imports: [
        RouterModule,
        ProjectsRoutingModule,
        MatPaginatorModule,
        MatTableModule,
        CommonModule,
        MapComponentModule,
        MatSidenavModule,
        MatTabsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ProjectsComponent,
        ProjectDetailComponent,
        ArraySortPipe
    ],
    exports: [
        ProjectDetailComponent
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorKohesio}
    ]
})
export class ProjectsModule {}
