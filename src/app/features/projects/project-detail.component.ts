import {AfterViewInit, Component, Inject, Renderer2, ViewChild} from '@angular/core';
import {ProjectService} from "../../project.service";
import { Router, ActivatedRoute } from '@angular/router';
import {ProjectDetail} from "../../shared/models/project-detail.model";

@Component({
    templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements AfterViewInit {

    public project: ProjectDetail;

    constructor(private projectService: ProjectService,
                private route: ActivatedRoute){}

    ngOnInit(){
        this.projectService.getProjectDetail(this.route.snapshot.paramMap.get('id')).subscribe((project:ProjectDetail)=>{
            this.project = project;
        });
    }

    ngAfterViewInit(): void {

    }

}
