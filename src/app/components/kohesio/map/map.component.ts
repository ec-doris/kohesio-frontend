import { AfterViewInit, Component, Input, ChangeDetectorRef, ComponentFactoryResolver, Injector } from '@angular/core';
import {FilterService} from "../../../services/filter.service";
import {MapService} from "../../../services/map.service";
import {environment} from "../../../../environments/environment";
import {Filters} from "../../../models/filters.model";
import { DecimalPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MapPopupComponent } from './map-popup.component';
import { MediaMatcher} from '@angular/cdk/layout';
declare let L:any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {


    private map:any;
    private markersGroup:any;
    //private labelsRegionsGroup;
    private layers: any[] = [];
    public filters: Filters = new Filters();
    public europeBounds = L.latLngBounds(L.latLng(69.77369797436554, 48.46330029192563), L.latLng(34.863924198120645, -8.13826220807438));
    public europeBoundsMobile = L.latLngBounds(L.latLng(59.77369797436554, 34.46330029192563), L.latLng(24.863924198120645, -12.13826220807438));
    public europe = {
        label: "Europe",
        region: undefined,
        bounds: this.europeBounds
    };
    public mapRegions:any = [];
    public isLoading = false;
    public dataRetrieved = false;
    public outermostRegions = [{
        label: "Madeira",
        country: "Q18",
        countryLabel: "Portugal",
        id: "Q203"
    },{
        label: "Azores",
        country: "Q18",
        countryLabel: "Portugal",
        id: "Q204"
    },{
        label: "Canary Islands",
        country: "Q7",
        countryLabel: "Spain",
        id: "Q205"
    },{
        label: "Réunion",
        country: "Q20",
        countryLabel: "France",
        id: "Q206"
    },{
        label: "French Guiana",
        country: "Q20",
        countryLabel: "France",
        id: "Q201"
    },{
        label: "Guadeloupe Saint Martin",
        country: "Q20",
        countryLabel: "France",
        id: "Q2576740"
    },{
        label: "Martinique",
        country: "Q20",
        countryLabel: "France",
        id: "Q198"
    },{
        label: "Mayotte",
        country: "Q20",
        countryLabel: "France",
        id: "Q209"
    }];
    // Format L.latLngBounds = southWest, northEast
    public overrideBounds = [{
        id: 'Q20',
        bounds: L.latLngBounds(L.latLng(41.3403079293, -4.8450636176), L.latLng(51.2587688404, 9.7020364496))
    },{
        id: 'Q7',
        bounds: L.latLngBounds(L.latLng(36.037266989,-9.2600844574), L.latLng(43.8462272853,3.3209832112))
    },{
        id: 'Q18',
        bounds: L.latLngBounds(L.latLng(36.8702042109,-9.5360565336), L.latLng(42.2278301749,-6.137649751))
    }];

    @Input()
    public mapId = "map";

    @Input()
    public hideNavigation = false;

    @Input()
    public hideProjectsNearBy = false;
    public nearByView = false;

    @Input()
    public hideOuterMostRegions = false;

    public collapsedBreadCrumb = false;

    public mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    constructor(private mapService: MapService,
                private filterService:FilterService,
                private _decimalPipe: DecimalPipe,
                private resolver: ComponentFactoryResolver,
                private injector: Injector,
                private sanitizer: DomSanitizer,
                private changeDetectorRef: ChangeDetectorRef,
                private media: MediaMatcher) {

        this.mobileQuery = media.matchMedia('(max-width: 480px)');
        this._mobileQueryListener = () => {
            changeDetectorRef.detectChanges();
            if(this.mobileQuery.matches){
                this.europe.bounds = this.europeBoundsMobile;
            }else{
                this.europe.bounds = this.europeBounds;
            }    
        }
        this.mobileQuery.addListener(this._mobileQueryListener);

        if(this.mobileQuery.matches){
            this.europe.bounds = this.europeBoundsMobile;
        }
    }

    ngAfterViewInit(): void {
        this.map = L.map(this.mapId,
            {
                preferCanvas: true,
                dragging: !L.Browser.mobile,
                tap: !L.Browser.mobile
            }).setView([48, 4], 4);
        const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>' +
                '| &copy; <a href="https://www.maxmind.com/en/home">MaxMind</a>'
        });
        

        // Normal Open Street Map Tile Layer
        /*const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });*/
        tiles.addTo(this.map);

        // Layer with countries name
        /*const tilesName = L.tileLayer('https://europa.eu/webtools/maps/tiles/countrynames_europe/{z}/{x}/{y}');
        tilesName.addTo(this.map);*/


        L.Icon.Default.prototype.options = {
            iconUrl: 'assets/images/map/marker-icon-2x.png',
            shadowUrl: 'assets/images/map/marker-shadow.png'
        }
    }

    public addMarker(latitude:any, longitude:any, centralize=true, zoomWhenCentralize = 15, popupContent:string = ""){
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

            return marker;
        }
    }

    public goToProject(item:any){
        console.log("goToProject="+item);
    }

    public addCircleMarker(latitude:any, longitude:any, centralize=true, zoomWhenCentralize = 15, popupContent:any = undefined){
        const coords = [latitude,longitude];
        if (this.map) {
            if (!this.markersGroup){
                this.markersGroup = new L.FeatureGroup();
                this.map.addLayer(this.markersGroup);
            }

            const marker = L.circleMarker(coords, {
                color: popupContent.isHighlighted ? '#FF0000' : '#3388ff'
            });

            if (popupContent && popupContent.type != 'async') {
                marker.bindPopup(popupContent);
            }else if(popupContent && popupContent.type == 'async'){
                marker.on('click', ()=>{
                    this.mapService.getProjectsPerCoordinate(popupContent.coordinates, popupContent.filters).subscribe(projects=>{
                        const component = this.resolver.resolveComponentFactory(MapPopupComponent).create(this.injector);
                        component.instance.projects = projects;
                        marker.bindPopup(component.location.nativeElement,{
                            maxWidth: 600
                        }).openPopup();
                        const latLngs = [ marker.getLatLng() ];
                        const markerBounds = L.latLngBounds(latLngs);
                        this.map.fitBounds(markerBounds,{
                            paddingTopLeft: [0,350],
                            maxZoom: this.map.getZoom()
                        });
                        this.collapsedBreadCrumb = true;
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
        let countryGeoJson:any = undefined;
        this.filterService.getCountryGeoJson().then(data=>{
           data.forEach((country:any)=>{
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

    public drawPolygons(polygons:any){
        return L.geoJson(polygons,{
            style: this.defaultStyle
        }).addTo(this.map);
    }

    public addLayer(layerGeoJson:any, clickCallback:any, style:any){
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
        /*if (this.map && this.labelsRegionsGroup) {
            this.map.removeLayer(this.labelsRegionsGroup);
            this.labelsRegionsGroup = null;
        }*/
    }

    public fitBounds(bounds:any){
        if (this.map) {
            this.map.fitBounds(bounds);
        }
    }

    public onProjectsNearByClick(){
        this.cleanMap();
        this.nearByView = true;
        this.mapService.getPointsNearBy().subscribe(data=>{
            data.list.slice().reverse().forEach((point:any)=>{
                const coordinates = point.coordinates.split(",");
                const popupContent = {
                    type: 'async',
                    filters: undefined,
                    coordinates: point.coordinates,
                    isHighlighted: point.isHighlighted
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
        this.nearByView = false;
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
        const index = this.mapRegions.findIndex((x:any) => x.region ===granularityRegion);
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

    loadOutermostRegion(filters: Filters, outermostRegion: any){
        const granularityRegion = environment.entityURL + outermostRegion.id;
        this.loadMapVisualization(filters, granularityRegion);
        this.mapRegions = this.mapRegions.slice(0,1);
        this.mapRegions.push({
            label: outermostRegion.countryLabel,
            region: environment.entityURL + outermostRegion.country
        });
        this.mapRegions.push({
            label: outermostRegion.label,
            region: granularityRegion
        });
    }

    loadMapVisualization(filters: Filters, granularityRegion?: string){
        
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
                data.list.slice().reverse().forEach((point:any)=>{
                    const coordinates = point.coordinates.split(",");
                    const popupContent = {
                        type: 'async',
                        filters: filters,
                        coordinates: point.coordinates,
                        isHighlighted: point.isHighlighted,
                    }
                    this.addCircleMarkerPopup(coordinates[1], coordinates[0], popupContent);
                })
            }else if (data.subregions && data.subregions.length) {
                //Draw polygons of the regions
                if (data.region && data.geoJson && granularityRegion){
                    const regionId = granularityRegion.replace(environment.entityURL, '');
                    const overrideBound:any = this.overrideBounds.find(region=>{
                        return region.id == regionId;
                    })
                    if (overrideBound){
                        this.fitBounds(overrideBound.bounds);
                    }else{
                        this.fitToGeoJson(data.geoJson);
                    }
                }
                data.subregions.forEach((region:any) => {
                    const countryProps = Object.assign({}, region);
                    delete countryProps.geoJson;
                    this.drawPolygonsForRegion(region.geoJson, countryProps);
                });
            }

            this.isLoading = false;
        });
    }

    fitToGeoJson(rawGeoJson:any){
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

    drawPolygonsForRegion(rawGeoJson:any, properties:any){
        if(rawGeoJson) {
            const features: any = [];
            const featureCollection = {
                "type": "FeatureCollection",
                features: features
            }
            const validJSON = rawGeoJson.replace(/'/g, '"');
            featureCollection.features.push({
                type: "Feature",
                properties: properties,
                geometry: JSON.parse(validJSON)
            });
            this.addFeatureCollectionLayer(featureCollection);
        }
    }

    showOutermostRegions(){
        if (this.hideOuterMostRegions || this.nearByView){
            return false;
        }
        if (this.mapRegions.length > 1){
            const countryId = this.mapRegions[1].region.replace(environment.entityURL, "");
            const region = this.outermostRegions.filter((region:any)=>{
                return region.country == countryId;
            });
            if (!region.length){
                return false;
            }
            if (this.mapRegions.length > 2){
                const regionId = this.mapRegions[2].region.replace(environment.entityURL, "");
                const regionT = this.outermostRegions.find((region:any)=>{
                        return region.id == regionId;
                });
                if (!regionT){
                    return false;
                }
            }
        }
        return true;
    }

    addFeatureCollectionLayer(featureCollection:any){
        this.addLayer(featureCollection, (feature:any, layer:any) => {
            /*if (this.mapRegions.length>1){
                if (!this.labelsRegionsGroup){
                    this.labelsRegionsGroup = new L.FeatureGroup();
                    this.map.addLayer(this.labelsRegionsGroup);
                }
                if (feature.properties && feature.properties.regionLabel){
                    const labelMarker = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                            className: 'label-regions',
                            
                            html: feature.properties.regionLabel
                        })
                    });
                    this.labelsRegionsGroup.addLayer(labelMarker);
                }
            }*/
            layer.on({
                click: (e:any) => {
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
                            //Slice to force trigger the pipe of outermost regions
                            this.mapRegions = this.mapRegions.slice(0,this.mapRegions.length);
                        }
                    }
                },
                mouseover: (e:any) => {
                    const layer = e.target;
                    if (layer.feature.properties) {
                        layer.setStyle({
                            fillOpacity: 1
                        });
                    }
                },
                mouseout: (e:any) => {
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

    private polygonsStyle(feature:any){
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
        const obj:any = document.getElementById(this.mapId);
        if (obj){
            obj.outerHTML = "";
        }
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    sanitizeUrl(url:string){
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}
