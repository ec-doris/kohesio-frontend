import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapComponent } from 'src/app/components/kohesio/map/map.component';
import { Filters } from 'src/app/models/filters.model';

@Component({
  templateUrl: './map-page.component.html',
  styleUrls: [ './map-page.component.scss' ]
})
export class MapPageComponent implements AfterViewInit {

  @ViewChild(MapComponent) map!: MapComponent;
  public hideProjectsNearBy: boolean = false;
  public country: string | null;
  public heatScale: boolean = false;
  public openProjectInner: boolean = false;
  public ccis: [];
  public fund = '';

  constructor(public actRoute: ActivatedRoute) {
    this.hideProjectsNearBy = (this.actRoute.snapshot.queryParamMap.get('hideProjectsNearBy') == 'true');
    this.heatScale = (this.actRoute.snapshot.queryParamMap.get('heatScale') == 'true');
    this.openProjectInner = (this.actRoute.snapshot.queryParamMap.get('openProjectInner') == 'true');
    this.country = this.actRoute.snapshot.queryParamMap.get('country');
    this.ccis = this.actRoute.snapshot.queryParamMap.get('ccis')?.split(',') as [];
    this.fund = this.actRoute.snapshot.queryParamMap.get('fund') as string;
  }

  ngAfterViewInit(): void {
    setTimeout(
      () => {
        const filters = new Filters().deserialize({
          country: this.country,
          ccis: this.ccis,
          fund: this.fund
        });
        this.map.loadMapRegion(filters);
      }, 500);
  }

}
