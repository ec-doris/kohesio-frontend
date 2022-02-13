import { Component, Input, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProjectDetail } from 'src/app/models/project-detail.model';
import {ProjectService} from "../../../services/project.service";

@Component({
    selector: 'project-detail-modal',
    templateUrl: './project-detail-modal.component.html',
    styleUrls: ['./project-detail-modal.component.scss']
})
export class ProjectDetailModalComponent {


    public projectId:any;
    public projectDetail!: ProjectDetail;

    constructor(private projectService: ProjectService){
        // TODO ECL side effect
        // this.projectId = config.id;
        // this.projectService.getProjectDetail(this.projectId).subscribe(projectDetail=>{
        //     this.projectDetail = projectDetail;
        // })
    }

    closeModal(){
    }


}
