import { AfterViewInit, Component } from '@angular/core';
declare let L;
import {MarkerService} from "./marker.service";

@Component({
    templateUrl: './module1.component.html'
})
export class Module1Component implements AfterViewInit {

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

}
