import {AfterViewInit, Component, Inject, Renderer2, ViewChild} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import { Router, ActivatedRoute } from '@angular/router';
import {ProjectDetail} from "../../shared/models/project-detail.model";
import {MapComponent} from "../../shared/components/map/map.component";
import { UxAppShellService } from '@eui/core';
declare let L;

@Component({
    templateUrl: './project-detail.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectDetailComponent implements AfterViewInit {

    public project: ProjectDetail;
    public wikidataLink: string;
    public currentUrl: string = location.href;

    @ViewChild(MapComponent)
    public map: MapComponent;

    constructor(private projectService: ProjectService,
                private route: ActivatedRoute,
                public uxService:UxAppShellService,){}

    ngOnInit(){
        this.project = this.route.snapshot.data.project;
    }

    ngAfterViewInit(): void {
        if (this.project.coordinates && this.project.coordinates.length) {
            let coords: any;
            // @ts-ignore
            coords = this.project["coordinates"][0];
            coords = coords.replace("Point(", "").replace(")", "").split(" ");
            this.map.addMarker(coords[1],coords[0], false);
            this.map.refreshView();
        }
        if(this.project.geoJson){
            const poly = this.map.drawPolygons(this.project.geoJson);
            this.map.fitBounds(poly.getBounds());
        }else{
            this.map.addCountryLayer(this.project.countryLabel);
        }
    }

    openWiki(event){
        window.open("https://linkedopendata.eu/wiki/Item:" + this.project.item, "_blank");
    }

    openWikidataLink(event){
        if (event){
            window.open(this.wikidataLink,'blank');
        }
    }

    openGDPRInfoBox(link: string){
        this.wikidataLink = link;
        this.uxService.openMessageBox()
    }

}
