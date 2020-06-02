import {AfterViewInit, Component} from '@angular/core';
declare let L;

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

    public map;

    constructor(){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
        if (!this.map) {
            this.map = L.map('map-inside').setView([46, 4], 4);
            const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                    '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>'
            });
            tiles.addTo(this.map);

            //this.markerService.makeMarkers(this.map);
        }
    }

}
