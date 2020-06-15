import { AfterViewInit, Component } from '@angular/core';
import {MarkerService} from "../../../services/marker.service";
declare let L;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html'
})
export class MapComponent implements AfterViewInit {

    private map;

    constructor(private markerService:MarkerService) { }

    ngAfterViewInit(): void {
        this.map = L.map('map').setView([48, 4], 5);
        const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>'
        });
        tiles.addTo(this.map);

        //this.markerService.makeMarkers(this.map);

    }

    public addMarker(latitude, longitude, centralize=true, zoomWhenCentralize = 10){
        const coords = [latitude,longitude];
        if (this.map) {
            L.marker(coords,
                {
                    icon: L.icon({
                        iconUrl: 'assets/images/map/marker-icon-2x.png',
                        shadowUrl: 'assets/images/map/marker-shadow.png',
                    })
                }
            ).addTo(this.map);

            if (centralize) {
                this.map.setView(coords, zoomWhenCentralize);
            }
        }
    }

    public refreshView(){
        setTimeout(() => {
            this.map.invalidateSize(true);
            },100);
    }

}
