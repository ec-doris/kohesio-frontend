import {AfterViewInit, Component, Inject, Input, LOCALE_ID} from '@angular/core';
import {MapService} from "../../../services/map.service";

declare let L: any;

@Component({
  selector: 'app-map-cluster',
  templateUrl: './map-cluster.component.html',
  styleUrls: [ './map-cluster.component.scss' ]
})
export class MapClusterComponent implements AfterViewInit {

  private map: any;
  private markers:any;
  public zoomLevel:number = 4;
  @Input()
  public mapId = 'mapClusterId';

  constructor(@Inject(LOCALE_ID) public locale: string,private mapService: MapService) {
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapId,
      {
        preferCanvas: true,
        //dragging: !L.Browser.mobile,
        //tap: !L.Browser.mobile
        gestureHandling: true
      }).setView([ 56, 20 ], 4);
    const tiles = L.tileLayer('https://gisco-services.ec.europa.eu/maps/tiles/OSMCartoV4Composite' + this.locale.toUpperCase() + '/EPSG3857/{z}/{x}/{y}.png');

    tiles.addTo(this.map);

    this.markers = L.geoJson(null, {
      pointToLayer: this.createClusterIcon
    }).addTo(this.map);

    this.map.on('moveend', () => {
      this.update();
    });

    this.map.whenReady(() => {
      this.update();
    });

    this.map.on('zoomend', () => {
      this.zoomLevel = this.map.getZoom();
    });

  }

  update() {
    //const before:Date = new Date();
    this.mapService.getMapCluster(this.map.getBounds(),this.map.getZoom()).subscribe(geojson=>{
      this.markers.clearLayers();
      this.markers.addData(geojson);

      //const now:Date = new Date();
      //const diff = now - before;
      //console.log("Took", diff);
    });
  }

  createClusterIcon(feature:any, latlng:any) {

    const count = feature.properties.point_count;
    const size =
      count < 100 ? 'small' :
        count < 10000 ? 'medium' : 'large';
    const icon = L.divIcon({
      html: `<div><span>${feature.properties.point_count_abbreviated}</span></div>`,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: L.point(40, 40)
    });

    return L.marker(latlng, { icon });
  }

}
