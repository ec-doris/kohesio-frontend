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
  clusterView = false;
  showFilters = true;
  cci: [];
  fund = '';
  isEmbeddedMap: boolean = false;

  constructor(public actRoute: ActivatedRoute) {

    this.hideProjectsNearBy = (this.actRoute.snapshot.queryParamMap.get('hideProjectsNearBy') == 'true');
    this.heatScale = (this.actRoute.snapshot.queryParamMap.get('heatScale') == 'true');
    this.openProjectInner = (this.actRoute.snapshot.queryParamMap.get('openProjectInner') == 'true');
    this.showFilters = this.actRoute.snapshot.queryParamMap.get('showFilters') == 'true' || this.actRoute.snapshot.queryParamMap.get('showFilters') === null;
    this.country = this.actRoute.snapshot.queryParamMap.get('country');
    this.clusterView = this.actRoute.snapshot.queryParamMap.get('clusterView') == 'true';
    this.cci = this.actRoute.snapshot.queryParamMap.get('cci')?.split(',') as [];
    this.fund = this.actRoute.snapshot.queryParamMap.get('fund') as string;
  }

  ngAfterViewInit(): void {
    this.isEmbeddedMap = window.self !== window.top;
    if (this.isEmbeddedMap || (!this.isEmbeddedMap && !this.actRoute.snapshot.queryParamMap.keys.length)) {
      setTimeout(
        () => {
          const filters = new Filters().deserialize({
            country: this.country,
            cci: this.cci,
            fund: this.fund
          });
          this.map.loadMapRegion(filters);
        }, 500);
    }
  }

}
