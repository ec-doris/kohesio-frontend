import { AfterViewInit, Component } from '@angular/core';
import {MarkerService} from "../../../services/marker.service";
declare let L;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html'
})
export class MapComponent implements AfterViewInit {

    private map;
    private markersGroup;


    constructor(private markerService:MarkerService) { }

    ngAfterViewInit(): void {
        this.map = L.map('map').setView([48, 4], 5);
        const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>'
        });
        tiles.addTo(this.map);
        L.Icon.Default.prototype.options = {
            iconUrl: 'assets/images/map/marker-icon-2x.png',
            shadowUrl: 'assets/images/map/marker-shadow.png'
        }

        //this.markerService.makeMarkers(this.map);

    }

    public addMarker(latitude, longitude, centralize=true, zoomWhenCentralize = 15, popupContent:string = undefined){
        const coords = [latitude,longitude];
        if (this.map) {
            if (!this.markersGroup){
                this.markersGroup = new L.FeatureGroup();
                this.map.addLayer(this.markersGroup);
            }
            const marker = L.marker(coords,
                {
                    icon: L.icon({
                        iconUrl: 'assets/images/map/marker-icon-2x.png',
                        iconAnchor: [22, 94],
                        popupAnchor: [-3, -76],
                        shadowUrl: 'assets/images/map/marker-shadow.png',
                        shadowSize: [68, 95],
                        shadowAnchor: [22, 105]
                    })
                }
            );


            if (popupContent) {
                marker.bindPopup(popupContent);
            }

            this.markersGroup.addLayer(marker);

            if (centralize) {
                this.map.setView(coords, zoomWhenCentralize);
            }
        }
    }

    public addMarkerPopup(latitude: any, longitude: any, popupContent: string){
        this.addMarker(latitude, longitude, false, 15, popupContent)
    }

    public addCountryLayer(country){

    }

    public refreshView(){
        setTimeout(() => {
            this.map.invalidateSize(true);
            },100);
    }

    public removeAllMarkers(){
        if (this.map && this.markersGroup) {
            this.map.removeLayer(this.markersGroup);
            this.markersGroup = null;
        }
    }

}
