import {AfterViewInit, Component} from '@angular/core';
declare let L;
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

    public map;

    constructor(private _renderer2: Renderer2,
                @Inject(DOCUMENT) private _document: Document){}

    ngAfterViewInit(): void {
        /*if (!this.map) {
            this.map = L.map('map').setView([46, 4], 4);
            const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                    '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>'
            });
            tiles.addTo(this.map);

            //this.markerService.makeMarkers(this.map);
        }*/
    }

    public ngOnInit() {

        let script = this._renderer2.createElement('script');
        script.type = `application/json`;
        script.text = `
            {
                "service": "map",
                "renderTo" : "map",
                "map": {
                    "center": [
                        46,
                        4
                    ],
                    "zoom": 4,
                    "background": [
                        "osmec"
                    ],
                    "maxZoom": 18
                },
                "version": "2.0",
                "layers": [
                {
                "countries": [
                "PT",
                "FR",
                "ES"
                ],
                "options": {
                "insets": {
                "collapse": true
                },
                "label": {
                "mode": "hover"
                },
                "style": {
                "color": "#ff5454"
                }
                }
                },{
                "countries": [
                "TR"
                ],
                "options": {
                "label": {
                "mode": "hover"
                },
                "style": {
                "color": "#4bff5d"
                }
                }
                }
                ]
            }
        `;

        this._renderer2.appendChild(this._document.body, script);
        window.scrollTo(0,1);
    }

}
