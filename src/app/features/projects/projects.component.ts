import { AfterViewInit, Component, Inject, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { ProjectService } from "../../services/project.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { Project } from "../../shared/models/project.model";
import { Filters } from "../../shared/models/filters.model";
import { MarkerService } from "../../services/marker.service";
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { DatePipe, DOCUMENT } from "@angular/common";
import { MapComponent } from "../../shared/components/map/map.component";
import { FilterService } from "../../services/filter.service";
import { ProjectList } from "../../shared/models/project-list.model";
import { FiltersApi } from "../../shared/models/filters-api.model";
import { environment } from "../../../environments/environment";
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
    public selectedTabIndex: number = 1;
    public selectedTab: string = 'results';
    public modalImageUrl = "";
    public modalImageTitle = "";
    public modalTitleLabel = "";
    public advancedFilterExpanded = false;
    public mapIsLoaded = false;
    public lastFiltersSearch;
    public entityURL = environment.entityURL;
    public page: number = 0;

    public policyToThemes = {
        Q2547985: ["Q236689", "Q236690", "Q236691"],    //Smart-Europe
        Q2547987: ["Q236692", "Q236693", "Q236694"],    //Green and Carbon free Europe
        Q2547988: ["Q236696", "Q236697", "Q236698"],    //Social Europe
        Q2577335: ["Q236695"],                          //Connected Europe
        Q2577336: ["Q236699"],                          //Europe closer to citizens
        Q2577337: ["Q2577338"],                         //Technical Assistance
    }

    public themeSelection = []

    public semanticTerms = [];

    constructor(private projectService: ProjectService,
        private filterService: FilterService,
        private formBuilder: FormBuilder,
        public uxService: UxAppShellService,
        private markerService: MarkerService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _renderer2: Renderer2,
        @Inject(DOCUMENT) private _document: Document,
        private datePipe: DatePipe,
        private changeDetectorRef: ChangeDetectorRef) {

        this._router.events.subscribe((event: NavigationStart) => {

            this.page = +this._route.snapshot.queryParamMap.get('page');
            this.selectedTab = this._route.snapshot.queryParamMap.get('tab');

            if (event.navigationTrigger === 'popstate') {

                this.setBackPaginationFromPopstate(event);
                this.setBackTabsFromPopstate(event);
                this.getProjectList();
            }
        });
    }


    ngOnInit() {
        this.filters = this._route.snapshot.data.filters;

        this.myForm = this.formBuilder.group({
            keywords: this._route.snapshot.queryParamMap.get('keywords'),
            country: [this.getFilterKey("countries", "country")],
            region: [],
            policyObjective: [this.getFilterKey("policy_objective", "policyObjective")],
            theme: [this.getFilterKey("thematic_objectives", "theme")],
            //Advanced filters
            programPeriod: [this.getFilterKey("programmingPeriods", "programPeriod")],
            fund: [this.getFilterKey("funds", "fund")],
            program: [],
            interventionField: [this.getFilterKey("categoriesOfIntervention", "interventionField")],
            totalProjectBudget: [this.getFilterKey("totalProjectBudget", "totalProjectBudget")],
            amountEUSupport: [this.getFilterKey("amountEUSupport", "amountEUSupport")],
            projectStart: [this.getDate(this._route.snapshot.queryParamMap.get('projectStart'))],
            projectEnd: [this.getDate(this._route.snapshot.queryParamMap.get('projectEnd'))],
            sort: [this.getFilterKey("sort", "sort")]
        });

        this.advancedFilterExpanded = this.myForm.value.programPeriod || this.myForm.value.fund ||
            this._route.snapshot.queryParamMap.get('program') ||
            this.myForm.value.interventionField || this.myForm.value.totalProjectBudget ||
            this.myForm.value.amountEUSupport || this.myForm.value.projectStart || this.myForm.value.projectEnd;

        if (this._route.snapshot.queryParamMap.get('country')) {
            Promise.all([this.getRegions(), this.getPrograms()]).then(results => {
                if (this._route.snapshot.queryParamMap.get('region')) {
                    this.myForm.patchValue({
                        region: this.getFilterKey("regions", "region")
                    });
                }
                if (this._route.snapshot.queryParamMap.get('program')) {
                    this.myForm.patchValue({
                        program: this.getFilterKey("programs", "program")
                    });
                }
                if (this._route.snapshot.queryParamMap.get('region') ||
                    this._route.snapshot.queryParamMap.get('program')) {
                    this.getProjectList();
                }
            });
        }

        if (!this._route.snapshot.queryParamMap.get('region') &&
            !this._route.snapshot.queryParamMap.get('program')) {
            this.getProjectList();
        }
        this.onThemeChange();
        this.getThemes();

        if (!this.selectedTab) {
            this.selectedTab = 'results';
        }
    }

    private getFilterKey(type: string, queryParam: string) {
        return this.filterService.getFilterKey(type, this._route.snapshot.queryParamMap.get(queryParam))
    }

    private getFilterLabel(type: string, label: string) {
        return this.filterService.getFilterLabel(type, label)
    }

    ngAfterViewInit(): void {
        this.paginatorTop.pageIndex = this.page;
        this.paginatorDown.pageIndex = this.page;
        this.isResultsTab = this.selectedTab === 'results';
        this.isAudioVisualTab = this.selectedTab === 'audiovisual';
        this.isMapTab = this.selectedTab === 'map';
        this.changeDetectorRef.detectChanges();
        this.getProjectList();
    }

    getThemes() {
        const policy = this.myForm.value.policyObjective
        if (policy == null) {
            this.themeSelection = this.filters.thematic_objectives
        } else {
            this.themeSelection = this.filters.thematic_objectives.filter((theme) => this.policyToThemes[policy].includes(theme["id"]))
        }
    }

    private getProjectList() {

        //Hack to program period for projects 2021-2027
        if (this.myForm.value.programPeriod == "2021-2027") {
            this.projects = [];
            this.map.loadMapRegion(new Filters());
            return;
        }

        this.isLoading = true;
        let offset = this.paginatorTop ? (this.paginatorTop.pageIndex * this.paginatorTop.pageSize) : 0;
        this.projectService.getProjects(this.getFilters(), offset).subscribe((result: ProjectList) => {
            this.projects = result.list;
            this.count = result.numberResults;
            this.semanticTerms = result.similarWords;
            this.isLoading = false;

            //go to the top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

            if (this.selectedTabIndex == 3) {
                this.map.loadMapRegion(this.lastFiltersSearch);
            } else {
                this.mapIsLoaded = false;
            }
        });
        let offsetAssets = this.paginatorAssets ? (this.paginatorAssets.pageIndex * this.paginatorAssets.pageSize) : 0;
        this.projectService.getAssets(this.getFilters(), offsetAssets).subscribe(result => {
            this.assets = result.list;
            this.assetsCount = result.numberResults;
        });
    }

    onSubmit() {
        if (!this.myForm.value.sort) {
            this.myForm.patchValue({
                sort: "orderTotalBudget-false"
            });
        }
        this.projects = [];
        if (this.paginatorTop.pageIndex == 0) {
            this.getProjectList();
        } else {
            this.goFirstPage();
        }

        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: this.generateQueryParams(),
            queryParamsHandling: 'merge'
        });
    }

    onPaginate(event) {

        this.paginatorTop.pageIndex = event.pageIndex;
        this.paginatorDown.pageIndex = event.pageIndex;
        this.page = event.pageIndex;

        this.getProjectList();

        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: {
                page: event.pageIndex === 0 ? 0 : this.page,
            },
            queryParamsHandling: 'merge',
        });
    }


    onPaginateAssets(event) {
        this.getProjectList();
    }

    setBackPaginationFromPopstate(event) {
        let pageString = (this.page === 0) ? '0' : event.url.match('page=[0-9]')[0];
        this.page = +pageString.charAt(pageString.length - 1);
        if (this.paginatorTop && this.paginatorDown && this.paginatorAssets) {
            this.paginatorTop.pageIndex = this.page;
            this.paginatorDown.pageIndex = this.page;
        }
    }

    goFirstPage() {
        this.paginatorDown.firstPage();
        this.paginatorTop.firstPage();
        this.paginatorAssets.firstPage();
    }

    generateQueryParams() {
        return {
            keywords: this.myForm.value.keywords ? this.myForm.value.keywords : null,
            country: this.getFilterLabel("countries", this.myForm.value.country),
            region: this.getFilterLabel("regions", this.myForm.value.region),
            theme: this.getFilterLabel("thematic_objectives", this.myForm.value.theme),
            policyObjective: this.getFilterLabel("policy_objective", this.myForm.value.policyObjective),
            programPeriod: this.getFilterLabel("programmingPeriods", this.myForm.value.programPeriod),
            fund: this.getFilterLabel("funds", this.myForm.value.fund),
            program: this.getFilterLabel("programs", this.myForm.value.program),
            interventionField: this.getFilterLabel("categoriesOfIntervention", this.myForm.value.interventionField),
            totalProjectBudget: this.getFilterLabel("totalProjectBudget", this.myForm.value.totalProjectBudget),
            amountEUSupport: this.getFilterLabel("amountEUSupport", this.myForm.value.amountEUSupport),
            projectStart: this.myForm.value.projectStart ? this.datePipe.transform(this.myForm.value.projectStart, 'dd-MM-yyyy') : null,
            projectEnd: this.myForm.value.projectEnd ? this.datePipe.transform(this.myForm.value.projectEnd, 'dd-MM-yyyy') : null,
            sort: this.getFilterLabel("sort", this.myForm.value.sort ? this.myForm.value.sort : "orderTotalBudget-false")
        }
    }

    onCountryChange() {
        this.getRegions().then();
        this.getPrograms().then();
        this.myForm.patchValue({
            region: null,
            program: null
        });
    }

    onPolicyObjectivesChange() {
        this.getThemes();
        this.myForm.patchValue({
            theme: null
        });
    }

    onThemeChange() {
        const theme = this.myForm.value.theme
        for (const policy in this.policyToThemes) {
            if (this.policyToThemes[policy].includes(theme)) {
                this.myForm.patchValue({
                    policyObjective: policy
                });
            }
        }
    }

    getRegions(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.filterService.getRegions(this.myForm.value.country).subscribe(regions => {
                resolve(true);
            });
        });
    }

    getPrograms(): Promise<any> {
        return new Promise((resolve, reject) => {
            const country = environment.entityURL + this.myForm.value.country;
            this.filterService.getFilter("programs", { country: country }).subscribe(result => {
                this.filterService.filters.programs = result.programs;
                this.filters.programs = result.programs;
                resolve(true);
            });
        });
    }

    onTabSelected(event) {
        this.isAudioVisualTab = false;
        this.isMapTab = false;
        this.isResultsTab = false;
        switch (event.index) {
            case 1: //Results
                this.isResultsTab = true;
                this.selectedTab = 'results';
                break;
            case 2: //Audio-visual
                this.isAudioVisualTab = true;
                this.selectedTab = 'audiovisual';
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
                this.selectedTab = 'map';
                break;
        }

        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: { 'tab': this.selectedTab },
            queryParamsHandling: 'merge'
        });

    }

    setBackTabsFromPopstate(event) {

        this.selectedTab = (this.selectedTab) ? 'results' : event.url.match('tab=[a-zA-Z]+')[0].split('=')[1];

        switch (this.selectedTab) {
            case 'results':
                this.isResultsTab = true;
                this.isAudioVisualTab = false;
                this.isMapTab = false;
                break;
            case 'audiovisual':
                this.isResultsTab = false;
                this.isAudioVisualTab = true;
                this.isMapTab = false;
                break;
            case 'map':
                this.isResultsTab = false;
                this.isAudioVisualTab = false;
                this.isMapTab = true;
                break;
        }
    }

    getFilters() {
        const formValues = Object.assign({}, this.myForm.value);
        formValues.projectStart = formValues.projectStart ? this.datePipe.transform(formValues.projectStart, 'yyyy-MM-dd') : undefined;
        formValues.projectEnd = formValues.projectEnd ? this.datePipe.transform(formValues.projectEnd, 'yyyy-MM-dd') : undefined;
        this.lastFiltersSearch = new Filters().deserialize(formValues);
        return this.lastFiltersSearch;
    }

    openImageOverlay(imgUrl, projectTitle, imageCopyright) {
        this.modalImageUrl = imgUrl;
        this.modalTitleLabel = projectTitle;
        if (imageCopyright && imageCopyright.length) {
            this.modalImageTitle = imageCopyright[0];
        }
        this.uxService.openModal("imageOverlay")
    }

    getDate(dateStringFormat) {
        if (dateStringFormat) {
            const dateSplit = dateStringFormat.split('-');
            const javascriptFormat = dateSplit[1] + "/" + dateSplit[0] + "/" + dateSplit[2];
            return dateStringFormat ? new Date(
                javascriptFormat
            ) : undefined;
        }
    }

    resetForm() {
        this.myForm.reset();
    }

    onSortChange() {
        if (!this.myForm.value.sort) {
            this.myForm.value.sort = "relevance"
        }
        this.onSubmit();
    }

    onRestrictSearch(event: any) {
        if (this.semanticTerms && this.semanticTerms.length) {
            const keywordsValue = "\"" + this.myForm.value.keywords + "\"";
            this.myForm.patchValue({ "keywords": keywordsValue });
            this.semanticTerms = [];
            this.onSubmit();
        }
    }

}