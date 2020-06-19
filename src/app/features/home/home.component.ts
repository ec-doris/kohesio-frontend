import {AfterViewInit, Component} from '@angular/core';
declare let L;
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import {FilterService} from "../../services/filter.service";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

    public map;
    public mapInfo;
    public geojson;
    public layerPopup;
    public countriesFigures={
        "France": "35 785",
        "Czech Republic": "46 276",
        "Denmark": "282",
        "Poland": "56 739",
        "Italy": "565 220",
        "Ireland": "769"
    }

    constructor(private _renderer2: Renderer2,
                @Inject(DOCUMENT) private _document: Document,
                private _router: Router,
                private filterService: FilterService){}

    ngAfterViewInit(): void {
    }

    public ngOnInit() {
        this.filterService.getCountryGeoJson().then((data:any[])=>{
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
    }

    buildCountriesLayers(data){
        const countriesData = {
            "type": "FeatureCollection",
            "features": data
        };
        this.geojson = L.geoJson(countriesData, {
            onEachFeature: (feature, layer)=>{
                const popup = L.popup();
                popup.setContent(
                    "<div>Country: <b>" + feature.properties.name +"</b></div>" +
                    "<div>Projects: <b>" + feature.properties.projects +"</b></div>"
                );
                layer.bindPopup(popup);
                layer.on({
                    mouseover: (e)=>{
                        const layer = e.target;

                        layer.setStyle({
                            weight: 3,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.7
                        });

                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                            layer.bringToFront();
                        }

                        if (this.map) {
                            const popup = layer.getPopup();
                            popup.setLatLng(e.latlng).openOn(this.map);
                        }
                    },
                    mouseout: (e)=>{
                        this.geojson.resetStyle(e.target);
                        e.target.closePopup();
                    },
                    mousemove: (e)=>{
                        const popup = e.target.getPopup();
                        popup.setLatLng(e.latlng).openOn(this.map);
                    },
                    click: (e)=>{
                        const countryName = e.target.feature.properties.name.replace(" ", "-");
                        this._router.navigate(['/projects'], { queryParams: { country: countryName } });
                    }
                });
            }
        }).addTo(this.map);
    }

}
