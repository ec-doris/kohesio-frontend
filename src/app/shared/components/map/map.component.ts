import { AfterViewInit, Component, Input } from '@angular/core';
import {FilterService} from "../../../services/filter.service";
import {MapService} from "../../../services/map.service";
import {environment} from "../../../../environments/environment";
import {Filters} from "../../models/filters.model";
declare let L;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html'
})
export class MapComponent implements AfterViewInit {

    private map;
    private markersGroup;
    private layers: any[] = [];
    private filters: Filters = new Filters();
    public mapRegions = [{
        label: "Europe",
        region: undefined,
        bounds: L.latLngBounds(L.latLng(67.37369797436554, 39.46330029192563), L.latLng(33.063924198120645, -17.13826220807438))
    }];
    public countriesBoundaries = {
        Q20 : L.latLngBounds(L.latLng(51.138001488062564, 10.153629941986903), L.latLng(41.29431726315258, -5.051448183013119)), //France
        Q15 : L.latLngBounds(L.latLng(47.11499982620772, 19.840596320855976), L.latLng(36.50963615733049, 4.152119758355975)),      //Italy
        Q13 : L.latLngBounds(L.latLng(56.75272287205736, 25.68595317276812), L.latLng(48.07807894349862, 12.89786723526812)),  //Poland
        Q25 : L.latLngBounds(L.latLng(51.70660846336452, 19.33647915386496), L.latLng(47.06263847995432, 11.73394009136496)),  //Czech Republic
        Q2  : L.latLngBounds(L.latLng(55.51619215717891, -4.843840018594397), L.latLng(51.26191485308451, -11.237882987344397)),  //Ireland
        Q12 : L.latLngBounds(L.latLng(58.048818457936505, 15.492176077966223), L.latLng(54.06583577161281, 7.647937796716221)), //Denmark
    };

    @Input()
    public hideNavigation = false;

    @Input()
    public hideProjectsNearBy = false;


    constructor(private mapService: MapService,
                private filterService:FilterService) { }

    ngAfterViewInit(): void {
        this.map = L.map('map',{preferCanvas: true}).setView([48, 4], 4);
        const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>'
        });
        /*const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        });*/
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

    public addCircleMarker(latitude, longitude, centralize=true, zoomWhenCentralize = 15, popupContent:string = undefined){
        const coords = [latitude,longitude];
        if (this.map) {
            if (!this.markersGroup){
                this.markersGroup = new L.FeatureGroup();
                this.map.addLayer(this.markersGroup);
            }

            const marker = L.circleMarker(coords, {
                color: '#3388ff'
            });

            if (popupContent) {
                marker.bindPopup(popupContent);
            }

            this.markersGroup.addLayer(marker);

            if (centralize) {
                this.map.setView(coords, zoomWhenCentralize);
            }
        }
    }

    public addCircleMarkerPopup(latitude: any, longitude: any, popupContent: string){
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
                "<div class='regionCount'>" + layerGeoJson.features[0].properties.count + " projects</div>" +
                "</div>";
            l.bindTooltip(html, {permanent: true, direction: "center"})
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
            for(let project of data.list){
                if (project.coordinates && project.coordinates.length) {
                    project.coordinates.forEach(coords=>{
                        const coordinates = coords.split(",");
                        const popupContent = "<a href='/projects/" + project.item +"'>"+project.labels[0]+"</a>";
                        this.addCircleMarkerPopup(coordinates[1], coordinates[0], popupContent);
                    });
                }
            }
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
        this.filters = filters;
        if (filters.country && !granularityRegion){
            this.mapRegions = this.mapRegions.slice(0,1);
            granularityRegion = environment.entityURL + filters.country;
            this.mapRegions.push({
                label: this.filterService.getFilterLabel("countries", filters.country),
                region: granularityRegion,
                bounds: this.countriesBoundaries[filters.country]
            })
        }
        const index = this.mapRegions.findIndex(x => x.region ===granularityRegion);
        if (this.mapRegions[index].bounds) {
            this.fitBounds(this.mapRegions[index].bounds);
        }
        this.mapRegions = this.mapRegions.slice(0,index+1);
        this.loadMapVisualization(filters, granularityRegion);
    }

    loadMapVisualization(filters: Filters, granularityRegion: string,){
        this.cleanMap();
        this.mapService.getMapInfo(filters, granularityRegion).subscribe(data=>{
            if (data.list && data.list.length){
                if (data.geoJson) {
                    const featureCollection = {
                        "type": "FeatureCollection",
                        features: []
                    }
                    const validJSON = data.geoJson.replace(/'/g, '"');
                    featureCollection.features.push({
                        "type": "Feature",
                        "properties": null,
                        "geometry": JSON.parse(validJSON)
                    });
                    this.addFeatureCollectionLayer(featureCollection);
                }
                const points = [];
                data.list.forEach(project=>{
                    if (project.coordinates && project.coordinates.length) {
                        project.coordinates.forEach(coordinate=>{
                            let point = points.find(point=>{
                                return point.coordinate == coordinate;
                            });
                            if (point){
                                point.projects.push(project);
                            }else{
                                points.push({
                                    coordinate: coordinate,
                                    projects: [project]
                                });
                            }
                        });
                    }
                });
                points.forEach(point=>{
                    const coordinates = point.coordinate.split(",");
                    let popupContent = "<div class='kohesio-map-popup-wrapper'>";
                    if(point.projects.length == 1){
                        popupContent = "<a href='/projects/" + point.projects[0].item +"'>"+point.projects[0].labels[0]+"</a>";
                    }else{
                        point.projects.forEach(project=>{
                            popupContent += "<a href='/projects/" + project.item +"'>"+project.labels[0]+"</a>";
                        });
                    }
                    popupContent += '</div>';
                    this.addCircleMarkerPopup(coordinates[1], coordinates[0], popupContent);
                })
            }else {
                data.forEach(region => {
                    const featureCollection = {
                        "type": "FeatureCollection",
                        features: []
                    }
                    const validJSON = region.geoJson.replace(/'/g, '"');
                    const countryProps = Object.assign({}, region);
                    delete countryProps.geoJson;
                    featureCollection.features.push({
                        "type": "Feature",
                        "properties": countryProps,
                        "geometry": JSON.parse(validJSON)
                    });
                    this.addFeatureCollectionLayer(featureCollection);
                })
            }
        });
    }

    addFeatureCollectionLayer(featureCollection){
        this.addLayer(featureCollection, (feature, layer) => {
            layer.on({
                click: (e) => {
                    const region = e.target.feature.properties.region;
                    const count = e.target.feature.properties.count;
                    const label = e.target.feature.properties.regionLabel;
                    if (count) {
                        let bounds = layer.getBounds();
                        const regionKey = region.replace(environment.entityURL, "");
                        if (this.countriesBoundaries[regionKey]){
                            bounds = this.countriesBoundaries[regionKey];
                        }
                        this.fitBounds(bounds);
                        this.loadMapVisualization(this.filters,region);
                        this.mapRegions.push({
                            label: label,
                            region: region,
                            bounds: bounds
                        })
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

}
