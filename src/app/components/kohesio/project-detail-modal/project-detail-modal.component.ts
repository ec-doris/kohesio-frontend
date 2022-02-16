import { Component, Inject } from '@angular/core';
import { ProjectDetail } from 'src/app/models/project-detail.model';
import {ProjectService} from "../../../services/project.service";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'project-detail-modal',
    templateUrl: './project-detail-modal.component.html',
    styleUrls: ['./project-detail-modal.component.scss']
})
export class ProjectDetailModalComponent {

    public projectId:any;
    public projectDetail!: ProjectDetail;

    constructor(private projectService: ProjectService,
        @Inject(MAT_DIALOG_DATA) public data: any){
        this.projectId = data.id;
        this.projectService.getProjectDetail(this.projectId).subscribe(projectDetail=>{
            this.projectDetail = projectDetail;
        });
    }

    closeModal(){
    }


}
