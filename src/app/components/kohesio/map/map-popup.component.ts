import {AfterViewInit, Component, ViewChild, Input} from '@angular/core';
import {environment} from "../../../../environments/environment";
import { Project } from 'src/app/models/project.model';
import {MatDialog} from '@angular/material/dialog';
import { ProjectDetailModalComponent } from '../project-detail-modal/project-detail-modal.component';

@Component({
    templateUrl: './map-popup.component.html',
    styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent {

    public selectedProject!: Project;

    @Input() projects!: any[];

    constructor(private dialog: MatDialog){}

    onSelectedProject(project: any){
        this.selectedProject = project;
        this.dialog.open(ProjectDetailModalComponent,{
            width: "90%",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            data: {
                id: project.item.replace(environment.entityURL, "")
            }
        });
    }

}
