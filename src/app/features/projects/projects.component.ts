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
    public loadedDataPoints = false;
    @ViewChild("paginatorTop") paginatorTop: MatPaginator;
    @ViewChild("paginatorDown") paginatorDown: MatPaginator;
    @ViewChild(MapComponent) map: MapComponent;
    public selectedTabIndex:number = 1;
    public modalImageUrl = "";
    public modalTitleLabel = "";
    public advancedFilterExpanded = false;

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
            program:[this.getFilterKey("programs","program")],
            categoryOfIntervention:[this.getFilterKey("categoriesOfIntervention","categoryOfIntervention")],
            totalProjectBudget:[this.getFilterKey("totalProjectBudget","totalProjectBudget")],
            amountEUSupport:[this.getFilterKey("amountEUSupport","amountEUSupport")],
            projectStart: [this.getDate(this._route.snapshot.queryParamMap.get('projectStart'))],
            projectEnd: [this.getDate(this._route.snapshot.queryParamMap.get('projectEnd'))]
        });

        this.advancedFilterExpanded = this.myForm.value.fund || this.myForm.value.program ||
            this.myForm.value.categoryOfIntervention || this.myForm.value.totalProjectBudget ||
            this.myForm.value.amountEUSupport || this.myForm.value.projectStart || this.myForm.value.projectEnd;

        if (this._route.snapshot.queryParamMap.get('country')){
            this.getRegions().then(regions => {
                if (this._route.snapshot.queryParamMap.get('region')) {
                    this.myForm.patchValue({
                        region: this.getFilterKey("regions","region")
                    });
                    this.getProjectList();
                }
            });
        }

        if (!this._route.snapshot.queryParamMap.get('region')) {
            this.getProjectList();
        }

        this.markerService.getServerPoints().then(result=>{
            this.loadedDataPoints = result;
        });
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

            //this.goFirstPage();
            if (this.selectedTabIndex == 3){
                this.createMarkers();
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

    getFilters(){
        const formValues = Object.assign({},this.myForm.value);
        formValues.projectStart = formValues.projectStart ? this.datePipe.transform(formValues.projectStart, 'dd-MM-yyyy') : undefined;
        formValues.projectEnd = formValues.projectEnd ? this.datePipe.transform(formValues.projectEnd, 'dd-MM-yyyy') : undefined;
        return new Filters().deserialize(formValues);
    }

    createMarkers(){
        this.map.removeAllMarkers();
        this.projectService.getMapPoints(this.getFilters()).subscribe(mapPoints=>{
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
