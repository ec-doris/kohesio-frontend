import {AfterViewInit, Component, Inject, Renderer2, ViewChild} from '@angular/core';
import {ProjectService} from "../../project.service";
import { Router, ActivatedRoute } from '@angular/router';
import {ProjectDetail} from "../../shared/models/project-detail.model";
declare let L;

@Component({
    templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements AfterViewInit {

    public map;
    public project: ProjectDetail;

    constructor(private projectService: ProjectService,
                private route: ActivatedRoute){}

    ngOnInit(){
        this.projectService.getProjectDetail(this.route.snapshot.paramMap.get('id')).subscribe((project:ProjectDetail)=>{
            this.project = project;
            if (this.project.coordinates && this.project.coordinates.length) {
                let coords: any;
                // @ts-ignore
                coords = project["coordinates"][0];
                coords = coords.replace("Point(", "").replace(")", "").split(" ");
                L.marker([coords[1], coords[0]],
                    {
                        icon: L.icon({
                            iconUrl: 'assets/images/map/marker-icon-2x.png',
                            shadowUrl: 'assets/images/map/marker-shadow.png',
                        })
                    }
                ).addTo(this.map);
                this.map.setView([coords[1], coords[0]], 10);
            }
        });
    }

    ngAfterViewInit(): void {
        this.buildMap();
    }

    buildMap(){
        if (!this.map) {
            this.map = L.map('map-inside').setView([48, 4], 5);
            const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                    '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>'
            });
            tiles.addTo(this.map);
        }
    }

}
