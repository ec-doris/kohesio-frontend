import {AfterViewInit, Component, ViewChild, Input} from '@angular/core';
import {Project} from "../../models/project.model";
import { UxDynamicModalService, UxDynamicModalConfig } from '@eui/components';
import {ProjectDetailModalComponent} from "../project-detail-modal/project-detail-modal.component";
import {environment} from "../../../../environments/environment";

@Component({
    templateUrl: './map-popup.component.html',
    styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent {

    public selectedProject: Project;

    @Input() projects: any[];

    constructor(private uxDynamicModalService: UxDynamicModalService){}

    onSelectedProject(project: any){
        this.selectedProject = project;
        const config = new UxDynamicModalConfig({
            id: 'project-detail-modal',
            titleLabel: project.label,
            isSizeLarge: true,
            bodyInjectedComponent: {
                component: ProjectDetailModalComponent,
                config: {
                    id: project.item.replace(environment.entityURL, ""),
                    closeModal: (data)=>{
                    }
                },
            },
            isFooterVisible: false
        });
        this.uxDynamicModalService.openModal(config);
    }

}
