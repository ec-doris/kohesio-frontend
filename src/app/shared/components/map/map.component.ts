import { AfterViewInit, Component, Input, ElementRef, ComponentFactoryResolver, Injector } from '@angular/core';
import {FilterService} from "../../../services/filter.service";
import {MapService} from "../../../services/map.service";
import {environment} from "../../../../environments/environment";
import {Filters} from "../../models/filters.model";
import { DecimalPipe } from '@angular/common';
import {MapPopupComponent} from "./map-popup.component";
import { UxAppShellService } from '@eui/core';
declare let L;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

    private map;
    private markersGroup;
    private layers: any[] = [];
    private filters: Filters = new Filters();
    public europe = {
        label: "Europe",
        region: undefined,
        bounds: L.latLngBounds(L.latLng(67.37369797436554, 39.46330029192563), L.latLng(33.063924198120645, -17.13826220807438))
    };
    public mapRegions = [];
    public isLoading = false;
    public dataRetrieved = false;

    @Input()
    public hideNavigation = false;

    @Input()
    public hideProjectsNearBy = false;


    constructor(private mapService: MapService,
                private filterService:FilterService,
                private _decimalPipe: DecimalPipe,
                private resolver: ComponentFactoryResolver,
                public uxAppShellService: UxAppShellService,
                private injector: Injector) { }

    ngAfterViewInit(): void {
        this.map = L.map('map',{preferCanvas: true}).setView([48, 4], 4);
        /*const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>' +
                '| &copy; <a href="https://www.maxmind.com/en/home">MaxMind</a>'
        });*/
        // Normal Open Street Map Tile Layer
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        tiles.addTo(this.map);
        L.Icon.Default.prototype.options = {
            iconUrl: 'assets/images/map/marker-icon-2x.png',
            shadowUrl: 'assets/images/map/marker-shadow.png'
        }
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
                marker.bindPopup(popupContent,{
                    maxWidth: '600px',
                    width: 'auto'
                });
            }

            this.markersGroup.addLayer(marker);

            if (centralize) {
                this.map.setView(coords, zoomWhenCentralize);
            }
        }
    }

    public goToProject(item){
        console.log("goToProject="+item);
    }

    public addCircleMarker(latitude, longitude, centralize=true, zoomWhenCentralize = 15, popupContent:any = undefined){
        const coords = [latitude,longitude];
        if (this.map) {
            if (!this.markersGroup){
                this.markersGroup = new L.FeatureGroup();
                this.map.addLayer(this.markersGroup);
            }

            const marker = L.circleMarker(coords, {
                color: '#3388ff'
            });

            if (popupContent && popupContent.type != 'async') {
                marker.bindPopup(popupContent);
            }else if(popupContent && popupContent.type == 'async'){
                marker.on('click', ()=>{
                    this.mapService.getProjectsPerCoordinate(popupContent.coordinates, popupContent.filters).subscribe(projects=>{
                        const component = this.resolver.resolveComponentFactory(MapPopupComponent).create(this.injector);
                        component.instance.projects = projects;
                        marker.bindPopup(component.location.nativeElement).openPopup();
                        component.changeDetectorRef.detectChanges();
                    });
                });
            }


            this.markersGroup.addLayer(marker);

            if (centralize) {
                this.map.setView(coords, zoomWhenCentralize);
            }
        }
    }

    public addCircleMarkerPopup(latitude: any, longitude: any, popupContent: any){
        this.addCircleMarker(latitude, longitude, false, 15, popupContent)
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
            L.geoJson(countriesData).addTo(this.map);
        });
    }

    public drawPolygons(polygons){
        return L.geoJson(polygons,{
            style: this.defaultStyle
        }).addTo(this.map);
    }

    public addLayer(layerGeoJson, clickCallback, style){
        const l = L.geoJson(layerGeoJson,{
            onEachFeature: clickCallback,
            style: style
        }).addTo(this.map);
        if (layerGeoJson.features[0].properties && layerGeoJson.features[0].properties.count) {
            const html = "<div class='regionWrapper'>" +
                "<div class='regionName'>" + layerGeoJson.features[0].properties.regionLabel + "</div>" +
                "<div class='regionCount'>" + this._decimalPipe.transform(layerGeoJson.features[0].properties.count, "1.0-3", "fr") + " " +
                (layerGeoJson.features[0].properties.count > 0 ? "projects" : "project") + "</div>" +
                "</div>";
            l.bindTooltip(html, {permanent: false, direction: "center"})
        }
        this.layers.push(l);
    }

    public cleanMap(){
        this.cleanAllLayers();
        this.removeAllMarkers();
    }

    public cleanAllLayers(){
        this.layers.forEach(layer=>{
            this.map.removeLayer(layer);
        });
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
        if (this.map) {
            this.map.fitBounds(bounds);
        }
    }

    public onProjectsNearByClick(){
        this.cleanMap();
        this.mapService.getPointsNearBy().subscribe(data=>{
            data.list.forEach(point=>{
                const coordinates = point.split(",");
                const popupContent = {
                    type: 'async',
                    filters: undefined,
                    coordinates: point
                }
                this.addCircleMarkerPopup(coordinates[1], coordinates[0], popupContent);
            })
            if(data.coordinates) {
                const c = data.coordinates.split(",");
                const coords = new L.LatLng(c[0],c[1],5);
                L.circle(coords, {
                    radius: 2000,
                    fillColor: "#FF7800",
                    color: "#FF7800"
                }).addTo(this.map);
                this.map.setView(coords, 8);
            }
        })
    }

    loadMapRegion(filters: Filters, granularityRegion?: string){
        //this.isLoading = true;
        this.filters = filters;
        if (!granularityRegion){
            this.mapRegions = [];
            if ((filters.country || filters.region)){
                granularityRegion = environment.entityURL +
                    (filters.region ? filters.region : filters.country);
                const label = filters.region ? this.filterService.getFilterLabel("regions", filters.region) :
                    this.filterService.getFilterLabel("countries", filters.country);
                this.mapRegions.push({
                    label: label,
                    region: granularityRegion
                })
            }else{
                this.mapRegions.push(this.europe);
            }
        }
        const index = this.mapRegions.findIndex(x => x.region ===granularityRegion);
        if (this.mapRegions[index].bounds) {
            this.fitBounds(this.mapRegions[index].bounds);
        }
        this.mapRegions = this.mapRegions.slice(0,index+1);
        this.loadMapVisualization(filters, granularityRegion);
    }

    activeLoadingAfter1Second(){
        setTimeout(
            () => {
                if (!this.dataRetrieved){
                    this.isLoading = true;
                }
            }, 1000);
    }

    loadMapVisualization(filters: Filters, granularityRegion: string,){
        this.cleanMap();
        this.dataRetrieved = false;
        this.activeLoadingAfter1Second()
        this.mapService.getMapInfo(filters, granularityRegion).subscribe(data=>{
            this.dataRetrieved = true;
            if (data.list && data.list.length){
                //Draw markers to each coordinate
                if (data.geoJson) {
                    this.drawPolygonsForRegion(data.geoJson, null);
                    this.fitToGeoJson(data.geoJson);
                }
                data.list.forEach(point=>{
                    const coordinates = point.split(",");
                    const popupContent = {
                        type: 'async',
                        filters: filters,
                        coordinates: point
                    }
                    this.addCircleMarkerPopup(coordinates[1], coordinates[0], popupContent);
                })
            }else if (data.subregions && data.subregions.length) {
                //Draw polygons of the regions
                if (data.region && data.geoJson){
                    this.fitToGeoJson(data.geoJson);
                }
                data.subregions.forEach(region => {
                    const countryProps = Object.assign({}, region);
                    delete countryProps.geoJson;
                    this.drawPolygonsForRegion(region.geoJson, countryProps);
                });
            }

            this.isLoading = false;
        });
    }

    fitToGeoJson(rawGeoJson){
        const validJSON = rawGeoJson.replace(/'/g, '"');
        const featureCollection = {
            "type": "FeatureCollection",
            features: [{
                "type": "Feature",
                "properties": null,
                "geometry": JSON.parse(validJSON)
            }]
        }
        const geojsonLayer = L.geoJson(featureCollection);
        this.fitBounds(geojsonLayer.getBounds());
    }

    drawPolygonsForRegion(rawGeoJson, properties){
        if(rawGeoJson) {
            const featureCollection = {
                "type": "FeatureCollection",
                features: []
            }
            const validJSON = rawGeoJson.replace(/'/g, '"');
            featureCollection.features.push({
                "type": "Feature",
                "properties": properties,
                "geometry": JSON.parse(validJSON)
            });
            this.addFeatureCollectionLayer(featureCollection);
        }
    }

    addFeatureCollectionLayer(featureCollection){
        this.addLayer(featureCollection, (feature, layer) => {
            layer.on({
                click: (e) => {
                    if (e.target.feature.properties) {
                        //this.isLoading = true;
                        const region = e.target.feature.properties.region;
                        const count = e.target.feature.properties.count;
                        const label = e.target.feature.properties.regionLabel;
                        if (count) {
                            this.loadMapVisualization(this.filters, region);
                            this.mapRegions.push({
                                label: label,
                                region: region
                            })
                        }
                    }
                },
                mouseover: (e) => {
                    const layer = e.target;
                    if (layer.feature.properties) {
                        layer.setStyle({
                            fillOpacity: 1
                        });
                    }
                },
                mouseout: (e) => {
                    const layer = e.target;
                    if (layer.feature.properties) {
                        layer.setStyle({
                            fillOpacity: 0.5
                        });
                    }
                },
            });
        }, this.polygonsStyle);
    }

    private polygonsStyle(feature){
        let style = {
            color: "#ff7800",
            opacity: 1,
            weight: 2,
            fillOpacity: 0.5,
            fillColor: "#ff7800",
        };
        if (feature.properties && !feature.properties.count) {
            style.fillColor = "#AAAAAA";
        }
        return style;
    }

    private defaultStyle(){
        return {
            color: "#ff7800",
            opacity: 1,
            weight: 2,
            fillOpacity: 0.5,
            fillColor: "#ff7800",
        }
    }

    ngOnDestroy(){
        document.getElementById("map").outerHTML = "";
    }

}
