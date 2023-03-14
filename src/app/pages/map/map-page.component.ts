import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MapComponent } from 'src/app/components/kohesio/map/map.component';
import { Filters } from 'src/app/models/filters.model';
import {ActivatedRoute} from "@angular/router";

@Component({
    templateUrl: './map-page.component.html',
    styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements AfterViewInit {

    @ViewChild(MapComponent) map!: MapComponent;
    public hideProjectsNearBy:boolean = false;
    public country:string | null;
    public heatScale:boolean = false;
    public openProjectInner:boolean = false;
    public cci:string | null;

    constructor(public actRoute: ActivatedRoute){
      this.hideProjectsNearBy = (this.actRoute.snapshot.queryParamMap.get('hideProjectsNearBy') == "true");
      this.heatScale = (this.actRoute.snapshot.queryParamMap.get('heatScale') == "true");
      this.openProjectInner = (this.actRoute.snapshot.queryParamMap.get('openProjectInner') == "true");
      this.country = this.actRoute.snapshot.queryParamMap.get('country');
      this.cci = this.actRoute.snapshot.queryParamMap.get('cci');
    }

    ngAfterViewInit(): void {
        setTimeout(
            () => {
                const filters = new Filters().deserialize({
                  country: this.country,
                  cci: this.cci
                })
                this.map.loadMapRegion(filters);
            }, 500);
    }

}
