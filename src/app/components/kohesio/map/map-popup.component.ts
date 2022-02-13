import {AfterViewInit, Component, ViewChild, Input} from '@angular/core';
import {environment} from "../../../../environments/environment";
import { Project } from 'src/app/models/project.model';

@Component({
    templateUrl: './map-popup.component.html',
    styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent {

    public selectedProject!: Project;

    @Input() projects!: any[];

    constructor(){}

    onSelectedProject(project: any){
        this.selectedProject = project;
        //TODO ECL side effect
        /*const config = new UxDynamicModalConfig({
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
        this.uxDynamicModalService.openModal(config);*/
    }

}
