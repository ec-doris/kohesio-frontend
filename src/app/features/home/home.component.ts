import {AfterViewInit, Component} from '@angular/core';
declare let L;
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import {ProjectService} from "../../project.service";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

    public map;
    public mapInfo;
    public geojson;
    public countriesFigures={
        "France":35785,
        "Czech Republic":46276,
        "Denmark":282,
        "Poland":56739,
        "Italy":565220,
        "Ireland":769
    }

    constructor(private _renderer2: Renderer2,
                @Inject(DOCUMENT) private _document: Document,
                private _router: Router,
                private projectService: ProjectService){}

    ngAfterViewInit(): void {
    }

    public ngOnInit() {
        this.projectService.getCountryGeoJson().then((data:any[])=>{
            data.forEach(country=>{
                country.properties['projects'] = this.countriesFigures[country.properties['name']]
            });
            this.renderMap(data);
        })
    }

    renderMap(data){
        if (!this.map) {
            this.map = L.map('map').setView([46, 4], 4);
            const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                    '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>'
            });
            tiles.addTo(this.map);
        }
        this.buildCountriesLayers(data);
        this.addInfoControl();
    }

    buildCountriesLayers(data){
        const countriesData = {
            "type": "FeatureCollection",
            "features": data
        };
        this.geojson = L.geoJson(countriesData, {
            style: this.style,
            onEachFeature: (feature, layer)=>{
                layer.on({
                    mouseover: (e)=>{
                        const layer = e.target;

                        layer.setStyle({
                            weight: 5,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.7
                        });

                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                            layer.bringToFront();
                        }

                        this.mapInfo.update(layer.feature.properties);
                    },
                    mouseout: (e)=>{
                        this.geojson.resetStyle(e.target);
                        this.mapInfo.update();
                    },
                    click: (e)=>{
                        this._router.navigate(['/projects'], { queryParams: { country: e.target.feature.properties.name } });
                    }
                });
            }
        }).addTo(this.map);
    }

    style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: 'blue',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    addInfoControl(){
        this.mapInfo = L.control();

        this.mapInfo.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        this.mapInfo.update = function (props) {
            this._div.innerHTML = '<h4>Number of Projects</h4>' +  (props ?
                '<b>' + props.name + '</b><br />' + props.projects
                : 'Hover over a country');
        };

        this.mapInfo.addTo(this.map);
    }


}
