import { Component, Input, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UxAppShellService, DYNAMIC_COMPONENT_CONFIG } from '@eui/core';
import { UxDynamicModalService } from '@eui/components';
import {ProjectService} from "../../../services/project.service";
import {ProjectDetail} from "../../models/project-detail.model";

@Component({
    selector: 'project-detail-modal',
    templateUrl: './project-detail-modal.component.html',
    styleUrls: ['./project-detail-modal.component.scss']
})
export class ProjectDetailModalComponent {


    public projectId;
    public projectDetail: ProjectDetail;

    constructor(private uxAppShellService: UxAppShellService,
                @Inject(DYNAMIC_COMPONENT_CONFIG) private config: any,
                private uxDynamicModalService: UxDynamicModalService,
                private projectService: ProjectService){
        this.projectId = config.id;
        this.projectService.getProjectDetail(this.projectId).subscribe(projectDetail=>{
            this.projectDetail = projectDetail;
        })
    }

    closeModal(){
    }


}
