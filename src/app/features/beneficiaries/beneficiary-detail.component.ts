import {AfterViewInit, Component, Inject, Input, Renderer2, ViewChild} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import { Router, ActivatedRoute } from '@angular/router';
import {MapComponent} from "../../shared/components/map/map.component";
import { UxAppShellService } from '@eui/core';
import {BeneficiaryDetail} from "../../shared/models/beneficiary-detail.model";
declare let L;

@Component({
    selector: 'app-beneficiary-detail',
    templateUrl: './beneficiary-detail.component.html',
    styleUrls: ['../projects/projects.component.scss', './beneficiaries.component.scss']
})
export class BeneficiaryDetailComponent implements AfterViewInit {

    @Input()
    public beneficiary: BeneficiaryDetail;

    @Input()
    public isModal: boolean = false;

    public wikidataLink: string;
    public currentUrl: string = location.href;

    public displayedColumns: string[] = ['label', 'budget', 'euBudget'];

    @ViewChild(MapComponent)
    public map: MapComponent;
 
    constructor(private projectService: ProjectService,
                private route: ActivatedRoute,
                public uxService:UxAppShellService,
                private router: Router){}

    ngOnInit(){
        if (!this.beneficiary) {
            this.beneficiary = this.route.snapshot.data.beneficiary;
        }
    }

    ngAfterViewInit(): void {
        if (this.beneficiary.coordinates) {
            let coords: any;
            // @ts-ignore
            coords = this.beneficiary.coordinates;
            coords = coords.replace("Point(", "").replace(")", "").split(" ");
            this.map.addMarker(coords[1],coords[0], true, 5);
            this.map.refreshView();
        }
    }

    openWiki(event){
        window.open("https://linkedopendata.eu/wiki/Item:" + this.beneficiary.item, "_blank");
    }

    openGraph(event){
        const entity = "https://linkedopendata.eu/entity/" + this.beneficiary.item;
        window.open(
            "https://query.linkedopendata.eu/embed.html#%23defaultView%3AGraph%0ASELECT%20%3Fitem%20%3FitemLabel%20WHERE%20%7B%0A%20%20VALUES%20%3Fitem%20%7B%20%3C"
            + entity
            + "%3E%7D%20%3Fitem%20%3FpDirect%20%3FlinkTo%20.%0A%20%20%3Fitem%20rdfs%3Alabel%20%3FitemLabel%20.%0A%20%20FILTER(lang(%3FitemLabel)%3D%22en%22)%0A%7D",
        "_blank");
    }

}
