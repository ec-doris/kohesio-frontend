import { AfterViewInit, Component } from '@angular/core';
import {MarkerService} from "../../../services/marker.service";
import {FilterService} from "../../../services/filter.service";
declare let L;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html'
})
export class MapComponent implements AfterViewInit {

    private map;
    private markersGroup;


    constructor(private markerService:MarkerService,
                private filterService:FilterService) { }

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
                        shadowUrl: 'assets/images/map/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        tooltipAnchor: [16, -28],
                        shadowSize: [41, 41]
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

    public addCountryLayer(countryLabel: string){
        let countryGeoJson = undefined;
        this.filterService.getCountryGeoJson().then(data=>{
           data.forEach(country=>{
               if (country.properties.name === countryLabel){
                   countryGeoJson = country
               }
            });
            const countriesData = {
                "type": "FeatureCollection",
                "features": [countryGeoJson]
            };
            L.geoJson(countriesData).addTo(this.map);;
        });
    }

    public drawPolygons(polygons){
        return L.geoJson(polygons).addTo(this.map);
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

    public fitBounds(bounds){
        this.map.fitBounds(bounds);
    }

}
