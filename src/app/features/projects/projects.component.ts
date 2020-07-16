import {AfterViewInit, Component, Inject, Renderer2, ViewChild} from '@angular/core';
import { UxService } from '@eui/core';
import {ProjectService} from "../../services/project.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import {Project} from "../../shared/models/project.model";
import {Filters} from "../../shared/models/filters.model";
import {MarkerService} from "../../services/marker.service";
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import {DOCUMENT} from "@angular/common";
import {MapComponent} from "../../shared/components/map/map.component";
import {FilterService} from "../../services/filter.service";
import {ProjectList} from "../../shared/models/project-list.model";
declare let L;

@Component({
    templateUrl: './projects.component.html'
})
export class ProjectsComponent implements AfterViewInit {

    public countries: any[] = [];
    public regions: any[] = [];
    public themes: any[] = [];
    public policyObjectives:any[] = [];
    public projects: Project[] = [];
    public count = 0;
    public myForm: FormGroup;
    public isLoading = false;
    public isMapTab = false;
    public loadedDataPoints = false;
    @ViewChild("paginatorTop") paginatorTop: MatPaginator;
    @ViewChild("paginatorDown") paginatorDown: MatPaginator;
    @ViewChild(MapComponent) map: MapComponent;
    public selectedTabIndex:number = 1;
    public modalImageUrl = "";
    public modalTitleLabel = "";

    constructor(private projectService: ProjectService,
                private filterService: FilterService,
                private formBuilder: FormBuilder,
                private uxService:UxService,
                private markerService:MarkerService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _renderer2: Renderer2,
                @Inject(DOCUMENT) private _document: Document){}

    ngOnInit(){
        this.myForm = this.formBuilder.group({
            country: [this._route.snapshot.queryParamMap.get('country')],
            region: [this._route.snapshot.queryParamMap.get('region')],
            policyObjective: [this._route.snapshot.queryParamMap.get('policyObjective')],
            theme: [this._route.snapshot.queryParamMap.get('theme')],
            keywords: this._route.snapshot.queryParamMap.get('keywords')
        });
        this.filterService.getFilters().then(result=>{

            //Countries
            for (let country of result.countries){
                let countryCode = country[0].split(",")[1].toLowerCase();
                let countryId= country[0].split(",")[0];
                this.countries.push({
                    id: countryId,
                    value: country[1],
                    iconClass: 'flag-icon flag-icon-' + countryCode
                })
            }
            if (this._route.snapshot.queryParamMap.get('country')){
                this.myForm.patchValue({
                    country: this.filterService.getFilterKey("countries",this._route.snapshot.queryParamMap.get('country'))
                });
                this.getRegions();
            }
            //Policy objectives
            for (let topic of result.policyObjectives){
                let topicId= topic[0];
                this.policyObjectives.push({
                    id: topicId,
                    value: topic[1],
                    iconClass: 'topic-icon ' + topicId
                })
            }
            if (this._route.snapshot.queryParamMap.get('policyObjective')){
                this.myForm.patchValue({
                    policyObjective: this.filterService.getFilterKey("policyObjectives", this._route.snapshot.queryParamMap.get('policyObjective'))
                });
            }
            //Themes
            for (let topic of result.themes){
                let topicCode = topic[0].split(",")[1];
                let topicId= topic[0].split(",")[0];
                this.themes.push({
                    id: topicId,
                    value: topic[1],
                    iconClass: 'topic-icon ' + topicCode
                })
            }
            if (this._route.snapshot.queryParamMap.get('theme')){
                this.myForm.patchValue({
                    theme: this.filterService.getFilterKey("themes", this._route.snapshot.queryParamMap.get('theme'))
                });
            }
            if (this._route.snapshot.queryParamMap.get('region')){
                this.getRegions().then(regions=>{
                    this.myForm.patchValue({
                        region: this.filterService.getFilterKey("regions", this._route.snapshot.queryParamMap.get('region'))
                    });
                    this.getProjectList();
                });
            }else{
                this.getProjectList();
            }

        });
        this.markerService.getServerPoints().then(result=>{
            this.loadedDataPoints = result;
        });
    }

    ngAfterViewInit(): void {

    }

    private getProjectList(){
        const filters = new Filters().deserialize(this.myForm.value);
        this.isLoading = true;
        let offset = this.paginatorTop.pageIndex * this.paginatorTop.pageSize;
        this.projectService.getProjects(filters, offset, this.paginatorTop.pageSize).subscribe((result:ProjectList) => {
            this.projects = result.list;
            this.count = result.numberResults;
            this.isLoading = false;

            //go to the top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

            //this.goFirstPage();
            if (this.selectedTabIndex == 3){
                this.createMarkers();
            }
        });
    }

    onSubmit() {
        this.projects = [];
        const filters = new Filters().deserialize(this.myForm.value);
        if (this.paginatorTop.pageIndex==0) {
            this.getProjectList();
        }else{
            this.goFirstPage();
        }

        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: this.getFormValues(),
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

    getFormValues(){
        return {
            keywords: this.myForm.value.keywords ? this.myForm.value.keywords : null,
            country: this.filterService.getFilterLabel("countries", this.myForm.value.country),
            region: this.filterService.getFilterLabel("regions", this.myForm.value.region),
            theme: this.filterService.getFilterLabel("themes", this.myForm.value.theme),
            policyObjective: this.filterService.getFilterLabel("policyObjectives", this.myForm.value.policyObjective),
        }
    }

    onCountryChange(){
        this.getRegions();
        this.myForm.patchValue({
            region: null
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
                this.regions = [];
                for (let region of regions) {
                    let regionId = region[0];
                    this.regions.push({
                        id: regionId,
                        value: region[1]
                    })
                }
                resolve(true);
            });
        });
    }

    onTabSelected(event){
        if(event.label == "Map"){
            this.map.refreshView();
            this.createMarkers();
            this.selectedTabIndex = event.index;
            this.isMapTab = true;
        }else{
            this.isMapTab = false;
        }
    }

    createMarkers(){
        this.map.removeAllMarkers();
        const filters = new Filters().deserialize(this.myForm.value);
        this.projectService.getMapPoints(filters).subscribe(mapPoints=>{
            for(let project of mapPoints){
                if (project.coordinates && project.coordinates.length) {
                    project.coordinates.forEach(coords=>{
                        const coordinates = coords.split(",");
                        const popupContent = "<a href='/projects/" + project.item +"'>"+project.labels[0]+"</a>";
                        this.map.addMarkerPopup(coordinates[1], coordinates[0], popupContent);
                    })
                }
            }
        });
    }

    openImageOverlay(imgUrl, projectTitle){
        this.modalImageUrl = imgUrl;
        this.modalTitleLabel = projectTitle;
        this.uxService.openModal("imageOverlay")
    }


}
