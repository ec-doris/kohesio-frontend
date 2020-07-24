import {AfterViewInit, Component, Inject, Renderer2, ViewChild} from '@angular/core';
import { UxService } from '@eui/core';
import {ProjectService} from "../../services/project.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import {Project} from "../../shared/models/project.model";
import {Filters} from "../../shared/models/filters.model";
import {MarkerService} from "../../services/marker.service";
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import {DatePipe, DOCUMENT} from "@angular/common";
import {MapComponent} from "../../shared/components/map/map.component";
import {FilterService} from "../../services/filter.service";
import {ProjectList} from "../../shared/models/project-list.model";
import {FiltersApi} from "../../shared/models/filters-api.model";
import {environment} from "../../../environments/environment";
declare let L;

@Component({
    templateUrl: './projects.component.html'
})
export class ProjectsComponent implements AfterViewInit {

    public projects: Project[] = [];
    public filters: FiltersApi;
    public count = 0;
    public myForm: FormGroup;
    public isLoading = false;
    public isMapTab = false;
    @ViewChild("paginatorTop") paginatorTop: MatPaginator;
    @ViewChild("paginatorDown") paginatorDown: MatPaginator;
    @ViewChild(MapComponent) map: MapComponent;
    public selectedTabIndex:number = 1;
    public modalImageUrl = "";
    public modalTitleLabel = "";
    public advancedFilterExpanded = false;
    public mapIsLoaded = false;
    public lastFiltersSearch;

    public mapRegions = [{
        label: "Europe",
        region: undefined,
        bounds: L.latLngBounds(L.latLng(67.57571741708057, 102.58059833176651), L.latLng(33.50475906922609, -78.91354229323352))
    }];
    public countriesBoundaries = {
        Q20 : L.latLngBounds(L.latLng(51.09662294502995, 26.323205470629702), L.latLng(41.244772343082076, -19.050329685620305)), //France
        Q15 : L.latLngBounds(L.latLng(47.41322033016904, 35.85758811231211), L.latLng(36.86204269508728, -9.5159470439379)),      //Italy
        Q13 : L.latLngBounds(L.latLng(56.54737205307899, 43.174862051221886), L.latLng(47.82790816919329, -2.1986731050281465)),  //Poland
        Q25 : L.latLngBounds(L.latLng(52.247982985281865, 27.036717089873143), L.latLng(47.657987988142274, 4.349949511748141)),  //Czech Republic
        Q2  : L.latLngBounds(L.latLng(55.54728069864083, 3.0096174804981417), L.latLng(51.29627609493991, -19.677150097626864)),  //Ireland
        Q12 : L.latLngBounds(L.latLng(58.12431960569377, 22.982762011748143), L.latLng(54.149567212540525, 0.29599443362314126)), //Denmark
    };

    constructor(private projectService: ProjectService,
                private filterService: FilterService,
                private formBuilder: FormBuilder,
                private uxService:UxService,
                private markerService:MarkerService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _renderer2: Renderer2,
                @Inject(DOCUMENT) private _document: Document,
                private datePipe: DatePipe){}

    ngOnInit(){
        this.filters = this._route.snapshot.data.filters;

        this.myForm = this.formBuilder.group({
            keywords: this._route.snapshot.queryParamMap.get('keywords'),
            country: [this.getFilterKey("countries","country")],
            region: [],
            policyObjective: [this.getFilterKey("policy_objective","policyObjective")],
            theme: [this.getFilterKey("thematic_objectives","theme")],
            //Advanced filters
            programPeriod: ['2021-2027'],
            fund:[this.getFilterKey("funds","fund")],
            program:[],
            categoryOfIntervention:[this.getFilterKey("categoriesOfIntervention","categoryOfIntervention")],
            totalProjectBudget:[this.getFilterKey("totalProjectBudget","totalProjectBudget")],
            amountEUSupport:[this.getFilterKey("amountEUSupport","amountEUSupport")],
            projectStart: [this.getDate(this._route.snapshot.queryParamMap.get('projectStart'))],
            projectEnd: [this.getDate(this._route.snapshot.queryParamMap.get('projectEnd'))]
        });

        this.advancedFilterExpanded = this.myForm.value.fund || this._route.snapshot.queryParamMap.get('program') ||
            this.myForm.value.categoryOfIntervention || this.myForm.value.totalProjectBudget ||
            this.myForm.value.amountEUSupport || this.myForm.value.projectStart || this.myForm.value.projectEnd;

        if (this._route.snapshot.queryParamMap.get('country')){
            Promise.all([this.getRegions(), this.getPrograms()]).then(results=>{
                if (this._route.snapshot.queryParamMap.get('region')) {
                    this.myForm.patchValue({
                        region: this.getFilterKey("regions","region")
                    });
                }
                if (this._route.snapshot.queryParamMap.get('program')) {
                    this.myForm.patchValue({
                        program: this.getFilterKey("programs","program")
                    });
                }
                if(this._route.snapshot.queryParamMap.get('region') ||
                    this._route.snapshot.queryParamMap.get('program')) {
                    this.getProjectList();
                }
            });
        }

        if (!this._route.snapshot.queryParamMap.get('region') &&
            !this._route.snapshot.queryParamMap.get('program')) {
            this.getProjectList();
        }

    }

    private getFilterKey(type: string, queryParam: string){
        return this.filterService.getFilterKey(type,this._route.snapshot.queryParamMap.get(queryParam))
    }

    private getFilterLabel(type: string, label: string){
        return this.filterService.getFilterLabel(type,label)
    }

    ngAfterViewInit(): void {

    }

    private getProjectList(){
        this.isLoading = true;
        let offset = this.paginatorTop.pageIndex * this.paginatorTop.pageSize | 0;
        this.projectService.getProjects(this.getFilters(), offset, this.paginatorTop.pageSize).subscribe((result:ProjectList) => {
            this.projects = result.list;
            this.count = result.numberResults;
            this.isLoading = false;

            //go to the top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

            this.mapRegions = this.mapRegions.slice(0,1);

            //this.goFirstPage();
            if (this.selectedTabIndex == 3){
                let granularityRegion = undefined;
                if (this.myForm.value.country){
                    granularityRegion = environment.entityURL + this.myForm.value.country;
                    this.mapRegions.push({
                        label: this.getFilterLabel("countries", this.myForm.value.country),
                        region: granularityRegion,
                        bounds: this.countriesBoundaries[this.myForm.value.country]
                    })
                }
                this.loadMapRegion(granularityRegion);
            }else{
                this.mapIsLoaded = false;
            }
        });
    }

    onSubmit() {
        this.projects = [];
        if (this.paginatorTop.pageIndex==0) {
            this.getProjectList();
        }else{
            this.goFirstPage();
        }

        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: this.generateQueryParams(),
            queryParamsHandling: 'merge'
        });
    }

    onPaginate(event){
        this.paginatorTop.pageIndex = event.pageIndex;
        this.paginatorDown.pageIndex = event.pageIndex;
        this.getProjectList();
    }

    getPageIndexStart(){
        return this.paginatorTop ? this.paginatorTop.pageSize * this.paginatorTop.pageIndex : 0;
    }

    getPageIndexEnd(){
        return this.paginatorTop ? this.getPageIndexStart() + this.paginatorTop.pageSize : 15;
    }
    goFirstPage(){
        this.paginatorDown.firstPage();
        this.paginatorTop.firstPage();
    }

    generateQueryParams(){
        return {
            keywords: this.myForm.value.keywords ? this.myForm.value.keywords : null,
            country: this.getFilterLabel("countries", this.myForm.value.country),
            region: this.getFilterLabel("regions", this.myForm.value.region),
            theme: this.getFilterLabel("thematic_objectives", this.myForm.value.theme),
            policyObjective: this.getFilterLabel("policy_objective", this.myForm.value.policyObjective),
            fund: this.getFilterLabel("funds", this.myForm.value.fund),
            program: this.getFilterLabel("programs", this.myForm.value.program),
            categoryOfIntervention:this.getFilterLabel("categoriesOfIntervention", this.myForm.value.categoryOfIntervention),
            totalProjectBudget:this.getFilterLabel("totalProjectBudget", this.myForm.value.totalProjectBudget),
            amountEUSupport:this.getFilterLabel("amountEUSupport", this.myForm.value.amountEUSupport),
            projectStart: this.myForm.value.projectStart ? this.datePipe.transform(this.myForm.value.projectStart, 'dd-MM-yyyy') : null,
            projectEnd: this.myForm.value.projectEnd ? this.datePipe.transform(this.myForm.value.projectEnd, 'dd-MM-yyyy') : null
        }
    }

    onCountryChange(){
        this.getRegions().then();
        this.getPrograms().then();
        this.myForm.patchValue({
            region: null,
            program: null
        });
    }

    onPolicyObjectivesChange(){
        this.myForm.patchValue({
            theme: null
        });
    }

    onThemeChange(){
        this.myForm.patchValue({
            policyObjective: null
        });
    }

    getRegions(): Promise<any>{
        return new Promise((resolve, reject) => {
            this.filterService.getRegions(this.myForm.value.country).subscribe(regions => {
                resolve(true);
            });
        });
    }

    getPrograms(): Promise<any>{
        return new Promise((resolve, reject) => {
            const country = environment.entityURL + this.myForm.value.country;
            this.filterService.getFilter("programs",{country:country}).subscribe(result => {
                this.filterService.filters.programs = result.programs;
                this.filters.programs = result.programs;
                resolve(true);
            });
        });
    }

    onTabSelected(event){
        if(event.label == "Map"){
            if (!this.mapIsLoaded) {
                this.mapIsLoaded = true;
                this.map.refreshView();
                setTimeout(
                    () => {
                        this.loadMapRegion();
                    }, 1000);
            }
            this.selectedTabIndex = event.index;
            this.isMapTab = true;
        }else{
            this.isMapTab = false;
        }
    }

    getFilters(){
        const formValues = Object.assign({},this.myForm.value);
        formValues.projectStart = formValues.projectStart ? this.datePipe.transform(formValues.projectStart, 'yyyy-MM-dd') : undefined;
        formValues.projectEnd = formValues.projectEnd ? this.datePipe.transform(formValues.projectEnd, 'yyyy-MM-dd') : undefined;
        this.lastFiltersSearch = new Filters().deserialize(formValues);
        return this.lastFiltersSearch;
    }

    loadMapRegion(granularityRegion?: string){
        const index = this.mapRegions.findIndex(x => x.region ===granularityRegion);
        if (this.mapRegions[index].bounds) {
            this.map.fitBounds(this.mapRegions[index].bounds);
        }
        this.mapRegions = this.mapRegions.slice(0,index+1);
        this.loadMapVisualization(granularityRegion);
    }

    loadMapVisualization(granularityRegion?: string){
        this.map.removeAllMarkers();
        this.map.cleanAllLayers();
        this.projectService.getMapInfo(this.lastFiltersSearch, granularityRegion).subscribe(data=>{
            if (data.list && data.list.length){
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
                for(let project of data.list){
                    if (project.coordinates && project.coordinates.length) {
                        project.coordinates.forEach(coords=>{
                            const coordinates = coords.split(",");
                            const popupContent = "<a href='/projects/" + project.item +"'>"+project.labels[0]+"</a>";
                            this.map.addMarkerPopup(coordinates[1], coordinates[0], popupContent);
                        })
                    }
                }
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
        this.map.addLayer(featureCollection, (feature, layer) => {
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
                        this.map.fitBounds(bounds);
                        this.loadMapVisualization(region);
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
        }, (feature) => {
            let style = {
                color: "#ff7800",
                opacity: 1,
                weight: 2,
                fillOpacity: 0.5,
                fillColor: "#ff7800",
            }
            if (feature.properties && !feature.properties.count) {
                style.fillColor = "#AAAAAA";
            }
            return style;
        });
    }

    openImageOverlay(imgUrl, projectTitle){
        this.modalImageUrl = imgUrl;
        this.modalTitleLabel = projectTitle;
        this.uxService.openModal("imageOverlay")
    }

    getDate(dateStringFormat){
        if (dateStringFormat) {
            const dateSplit = dateStringFormat.split('-');
            const javascriptFormat = dateSplit[1] + "/" + dateSplit[0] + "/" + dateSplit[2];
            return dateStringFormat ? new Date(
                javascriptFormat
            ) : undefined;
        }
    }

    resetForm(){
        this.myForm.reset();
        this.myForm.patchValue({
            programPeriod: ["2021-2027"]
        });
    }


}
