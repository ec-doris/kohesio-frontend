import {AfterViewInit, Component, Inject, Renderer2, ViewChild} from '@angular/core';
import { UxAppShellService } from '@eui/core';
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
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements AfterViewInit {

    public projects: Project[] = [];
    public assets: [] = [];
    public assetsCount = 0;
    public filters: FiltersApi;
    public count = 0;
    public myForm: FormGroup;
    public isLoading = false;
    public isResultsTab = true;
    public isMapTab = false;
    public isAudioVisualTab = false;
    @ViewChild("paginatorTop") paginatorTop: MatPaginator;
    @ViewChild("paginatorDown") paginatorDown: MatPaginator;
    @ViewChild("paginatorAssets") paginatorAssets: MatPaginator;
    @ViewChild(MapComponent) map: MapComponent;
    public selectedTabIndex:number = 1;
    public modalImageUrl = "";
    public modalImageTitle = "";
    public modalTitleLabel = "";
    public advancedFilterExpanded = false;
    public mapIsLoaded = false;
    public lastFiltersSearch;
    public entityURL = environment.entityURL;

    public semanticTerms = [];

    constructor(private projectService: ProjectService,
                private filterService: FilterService,
                private formBuilder: FormBuilder,
                public uxService:UxAppShellService,
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
            programPeriod: [this.getFilterKey("programmingPeriods","programPeriod")],
            fund:[this.getFilterKey("funds","fund")],
            program:[],
            interventionField:[this.getFilterKey("categoriesOfIntervention","interventionField")],
            totalProjectBudget:[this.getFilterKey("totalProjectBudget","totalProjectBudget")],
            amountEUSupport:[this.getFilterKey("amountEUSupport","amountEUSupport")],
            projectStart: [this.getDate(this._route.snapshot.queryParamMap.get('projectStart'))],
            projectEnd: [this.getDate(this._route.snapshot.queryParamMap.get('projectEnd'))],
            sort: [this.getFilterKey("sort","sort")]
        });

        this.advancedFilterExpanded = this.myForm.value.programPeriod || this.myForm.value.fund ||
            this._route.snapshot.queryParamMap.get('program') ||
            this.myForm.value.interventionField || this.myForm.value.totalProjectBudget ||
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

        //Hack to program period for projects 2021-2027
        if (this.myForm.value.programPeriod == "2021-2027") {
            this.projects = [];
            this.map.loadMapRegion(new Filters());
            return;
        }

        this.isLoading = true;
        let offset = this.paginatorTop ? (this.paginatorTop.pageIndex * this.paginatorTop.pageSize) : 0;
        this.projectService.getProjects(this.getFilters(), offset).subscribe((result:ProjectList) => {
            this.projects = result.list;
            this.count = result.numberResults;
            this.semanticTerms = result.similarWords;
            this.isLoading = false;

            //go to the top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

            if (this.selectedTabIndex == 3){
                this.map.loadMapRegion(this.lastFiltersSearch);
            }else{
                this.mapIsLoaded = false;
            }
        });
        let offsetAssets = this.paginatorAssets ? (this.paginatorAssets.pageIndex * this.paginatorAssets.pageSize) : 0;
        this.projectService.getAssets(this.getFilters(),offsetAssets).subscribe(result=>{
            this.assets = result.list;
            this.assetsCount = result.numberResults;
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

    onPaginateAssets(event){
        this.getProjectList();
    }

    goFirstPage(){
        this.paginatorDown.firstPage();
        this.paginatorTop.firstPage();
        this.paginatorAssets.firstPage();
    }

    generateQueryParams(){
        return {
            keywords: this.myForm.value.keywords ? this.myForm.value.keywords : null,
            country: this.getFilterLabel("countries", this.myForm.value.country),
            region: this.getFilterLabel("regions", this.myForm.value.region),
            theme: this.getFilterLabel("thematic_objectives", this.myForm.value.theme),
            policyObjective: this.getFilterLabel("policy_objective", this.myForm.value.policyObjective),
            programPeriod: this.getFilterLabel("programmingPeriods", this.myForm.value.programPeriod),
            fund: this.getFilterLabel("funds", this.myForm.value.fund),
            program: this.getFilterLabel("programs", this.myForm.value.program),
            interventionField:this.getFilterLabel("categoriesOfIntervention", this.myForm.value.interventionField),
            totalProjectBudget:this.getFilterLabel("totalProjectBudget", this.myForm.value.totalProjectBudget),
            amountEUSupport:this.getFilterLabel("amountEUSupport", this.myForm.value.amountEUSupport),
            projectStart: this.myForm.value.projectStart ? this.datePipe.transform(this.myForm.value.projectStart, 'dd-MM-yyyy') : null,
            projectEnd: this.myForm.value.projectEnd ? this.datePipe.transform(this.myForm.value.projectEnd, 'dd-MM-yyyy') : null,
            sort: this.getFilterLabel("sort", this.myForm.value.sort)
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
        this.isAudioVisualTab = false;
        this.isMapTab = false;
        this.isResultsTab = false;
        switch(event.index){
            case 1: //Results
                this.isResultsTab = true;
                break;
            case 2: //Audio-visual
                this.isAudioVisualTab = true;
                break;
            case 3: //Map
                if (!this.mapIsLoaded) {
                    this.mapIsLoaded = true;
                    this.map.refreshView();
                    setTimeout(
                        () => {
                            this.map.loadMapRegion(this.lastFiltersSearch);
                        }, 500);
                }
                this.selectedTabIndex = event.index;
                this.isMapTab = true;
                break;
        }
    }

    getFilters(){
        const formValues = Object.assign({},this.myForm.value);
        formValues.projectStart = formValues.projectStart ? this.datePipe.transform(formValues.projectStart, 'yyyy-MM-dd') : undefined;
        formValues.projectEnd = formValues.projectEnd ? this.datePipe.transform(formValues.projectEnd, 'yyyy-MM-dd') : undefined;
        this.lastFiltersSearch = new Filters().deserialize(formValues);
        return this.lastFiltersSearch;
    }

    openImageOverlay(imgUrl, projectTitle, imageCopyright){
        this.modalImageUrl = imgUrl;
        this.modalTitleLabel = projectTitle;
        if (imageCopyright && imageCopyright.length){
            this.modalImageTitle = imageCopyright[0];
        }
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
    }

    onSortChange(){
        this.onSubmit();
    }

    onRestrictSearch(event:any){
        if (this.semanticTerms && this.semanticTerms.length){
            const keywordsValue = "\"" + this.myForm.value.keywords + "\"";
            this.myForm.patchValue({"keywords": keywordsValue});
            this.semanticTerms = [];
            this.onSubmit();
        }
    }

}
