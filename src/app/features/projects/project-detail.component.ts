import {AfterViewInit, Component, Inject, Renderer2, ViewChild} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import { Router, ActivatedRoute } from '@angular/router';
import {ProjectDetail} from "../../shared/models/project-detail.model";
import {MapComponent} from "../../shared/components/map/map.component";
declare let L;

@Component({
    templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements AfterViewInit {

    public project: ProjectDetail;

    @ViewChild(MapComponent)
    public map: MapComponent;

    constructor(private projectService: ProjectService,
                private route: ActivatedRoute){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
        this.projectService.getProjectDetail(this.route.snapshot.paramMap.get('id')).subscribe((project:ProjectDetail)=>{
            this.project = project;
            if (this.project.coordinates && this.project.coordinates.length) {
                let coords: any;
                // @ts-ignore
                coords = project["coordinates"][0];
                coords = coords.replace("Point(", "").replace(")", "").split(" ");
                if (this.map){
                    this.map.addMarker(coords[1],coords[0]);
                }
            }
        });
    }

    openWiki(event){
        window.open("https://linkedopendata.eu/wiki/Item:" + this.project.item);
    }

}
