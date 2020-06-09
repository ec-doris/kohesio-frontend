import {AfterViewInit, Component, Inject, Renderer2, ViewChild} from '@angular/core';
import {ProjectService} from "../../project.service";

@Component({
    templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements AfterViewInit {

    constructor(private projectService: ProjectService){}

    ngOnInit(){

    }

    ngAfterViewInit(): void {

    }

}
