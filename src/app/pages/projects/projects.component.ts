import {
  AfterViewInit,
  Component,
  Inject,
  Renderer2,
  ViewChild,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';
import { MapComponent } from '../../components/kohesio/map/map.component';
import { ProjectService } from "../../services/project.service";
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Project } from "../../models/project.model";
import { Filters } from "../../models/filters.model";
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, DOCUMENT, isPlatformBrowser, isPlatformServer } from "@angular/common";
import { FilterService } from "../../services/filter.service";
import { ProjectList } from "../../models/project-list.model";
import { FiltersApi } from "../../models/filters-api.model";
import { environment } from "../../../environments/environment";
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject, takeUntil} from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import {ImageOverlayComponent} from "src/app/components/kohesio/image-overlay/image-overlay.component"
import {TranslateService} from "../../services/translate.service";
import {MetaService} from "../../services/meta.service";
import {AutoCompleteItem} from "../../components/kohesio/auto-complete/item.model";

@Component({
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {

  public projects!: Project[];
  public assets: any[] = [];
  public assetsCount = 0;
  public filters: FiltersApi;
  public count = 0;
  public myForm!: UntypedFormGroup;
  public isLoading = false;
  public isResultsTab = true;
  public isMapTab = false;
  public isAudioVisualTab = false;
  @ViewChild("paginatorTop") paginatorTop!: MatPaginator;
  @ViewChild("paginatorDown") paginatorDown!: MatPaginator;
  @ViewChild("paginatorAssets") paginatorAssets!: MatPaginator;
  @ViewChild("sidenav") sidenav!: MatDrawer;
  @ViewChild(MapComponent) map!: MapComponent;

  public selectedTabIndex: number = 0;
  public selectedTab: string = this.translateService.projectPage.tabs.results;
  public modalImageUrl = "";
  public modalImageTitle:string = "";
  public modalTitleLabel = "";
  public advancedFilterIsExpanded:boolean = false;
  public mapIsLoaded = false;
  public lastFiltersSearch: any;
  public entityURL = environment.entityURL;
  public pageSize = 15;
  public initialPageIndex:number = 0;
  public themeSelection = []
  public semanticTerms: String[] = [];
  public mobileQuery: boolean;
  public sidenavOpened: boolean;
  private destroyed = new Subject<void>();
  public infoPopup:boolean = false;
  private notOutside = false;

  constructor(
    private projectService: ProjectService,
    public filterService: FilterService,
    public dialog: MatDialog,
    private formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private datePipe: DatePipe,
    breakpointObserver: BreakpointObserver,
    public translateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private metaService: MetaService) {

      this.filters = this._route.snapshot.data['filters'];
      this.mobileQuery = breakpointObserver.isMatched('(max-width: 820px)');
      this.sidenavOpened = !this.mobileQuery;

      breakpointObserver
      .observe([
          "(max-width: 820px)"
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
          for (const query of Object.keys(result.breakpoints)) {
              this.mobileQuery = result.breakpoints[query];
              this.sidenavOpened = !this.mobileQuery;
          }
      });


      //Get interventionfield values
      let interventionField:any = undefined;
      if (this._route.snapshot.queryParamMap.has(this.translateService.queryParams.interventionField)){
        interventionField = [];
        const interventionFieldKeys:string[] = this._route.snapshot.queryParamMap.get(this.translateService.queryParams.interventionField)!.split(",");
        interventionFieldKeys.forEach(key=>{
          const ifValue = this.filterService.getFilterKey("categoriesOfIntervention", key);
          interventionField.push(ifValue);
        })
      }


      this.myForm = this.formBuilder.group({
        keywords: this._route.snapshot.queryParamMap.get(this.translateService.queryParams.keywords),
        town: this._route.snapshot.queryParamMap.get(this.translateService.queryParams.town),
        country: [this.getFilterKey("countries", this.translateService.queryParams.country)],
        region: [],
        policyObjective: [this.getFilterKey("policy_objectives", this.translateService.queryParams.policyObjective)],
        theme: [this.getFilterKey("thematic_objectives", this.translateService.queryParams.theme)],
        //Advanced filters
        programPeriod: [this.getFilterKey("programmingPeriods", "programPeriod")],
        fund: [this.getFilterKey("funds", this.translateService.queryParams.fund)],
        program: [],
        interventionField: [interventionField],
        totalProjectBudget: [this.getFilterKey("totalProjectBudget", this.translateService.queryParams.totalProjectBudget)],
        amountEUSupport: [this.getFilterKey("amountEUSupport", this.translateService.queryParams.amountEUSupport)],
        projectStart: [this.getDate(this._route.snapshot.queryParamMap.get(this.translateService.queryParams.projectStart))],
        projectEnd: [this.getDate(this._route.snapshot.queryParamMap.get(this.translateService.queryParams.projectEnd))],
        sort: [this.getFilterKey("sort", this.translateService.queryParams.sort)],
        interreg: [this.getFilterKey("interreg", this.translateService.queryParams.interreg)],
        nuts3: [this.getFilterKey("nuts3", this.translateService.queryParams.nuts3)],
        priority_axis: [],
        projectCollection: [this.getFilterKey("project_types", this.translateService.queryParams.projectCollection)],
        sdg: []
      });

      if (this.myForm.value.programPeriod || this.myForm.value.fund ||
          this._route.snapshot.queryParamMap.get(this.translateService.queryParams.programme) ||
          this.myForm.value.interventionField || this.myForm.value.totalProjectBudget ||
          this.myForm.value.amountEUSupport || this.myForm.value.projectStart ||
          this.myForm.value.projectEnd || this.myForm.value.interreg ||
          this.myForm.value.nuts3 || this.myForm.value.priority_axis || this.myForm.value.projectCollection || this.myForm.value.town){
            this.advancedFilterIsExpanded = true;
      };

      if (this._route.snapshot.queryParamMap.has(this.translateService.queryParams.tab)) {
        const tabParam = this._route.snapshot.queryParamMap.get(this.translateService.queryParams.tab);
        if (tabParam==this.translateService.projectPage.tabs.audiovisual){
          this.selectedTabIndex = 1;
        }else if (tabParam==this.translateService.projectPage.tabs.map){
          this.selectedTabIndex = 2;
          this.isMapTab=true;
          this.selectedTab=this.translateService.projectPage.tabs.map;
        }
      }

  }

    ngOnInit() {
      if (this._route.snapshot.queryParamMap.get(this.translateService.queryParams.country)) {
        this.getRegions().then(()=>{
          if (this._route.snapshot.queryParamMap.get(this.translateService.queryParams.region)) {
            this.myForm.patchValue({
              region: this.getFilterKey("regions", this.translateService.queryParams.region)
            });
          }
          Promise.all([this.getPrograms(), this.getNuts3(), this.getPriorityAxis()]).then(results => {
            if (this._route.snapshot.queryParamMap.get(this.translateService.queryParams.programme)) {
              this.myForm.patchValue({
                program: this.getFilterKey("programs", this.translateService.queryParams.programme)
              });
            }
            if (this._route.snapshot.queryParamMap.get(this.translateService.queryParams.priorityAxis)) {
              this.myForm.patchValue({
                priority_axis: this.getFilterKey("priority_axis", this.translateService.queryParams.priorityAxis)
              });
            }

            if (this._route.snapshot.queryParamMap.get(this.translateService.queryParams.region) ||
              this._route.snapshot.queryParamMap.get(this.translateService.queryParams.programme) ||
              this._route.snapshot.queryParamMap.get(this.translateService.queryParams.nuts3) ||
              this._route.snapshot.queryParamMap.get(this.translateService.queryParams.priorityAxis)) {
              this.metaService.changeProjectListMetadata();
              this.getProjectList();
            }
          });
        });

      }

      if (!this._route.snapshot.queryParamMap.get(this.translateService.queryParams.region) &&
      !this._route.snapshot.queryParamMap.get(this.translateService.queryParams.programme) &&
        !this._route.snapshot.queryParamMap.get(this.translateService.queryParams.nuts3)) {
        this.getProjectList();
      }
      this.onThemeChange();
      this.getThemes();
      this.filterService.showResult$$.subscribe(result => {
        this.myForm.patchValue(result.filters);
        this.lastFiltersSearch = result.filters;
        this.getProjectList();
      })
    }

    private getFilterKey(type: string, queryParam: string) {
      return this.filterService.getFilterKey(type, this._route.snapshot.queryParamMap.get(queryParam))
    }

    private getFilterLabel(type: string, label: string) {
      return this.filterService.getFilterLabel(type, label)
    }

    ngAfterViewInit(): void {

    }

    getThemes() {
      const policy = this.myForm.value.policyObjective;
      if (policy) {
        const params ={
          policy: environment.entityURL + policy
        }
        this.filterService.getFilter("thematic_objectives",params).subscribe(themes=>{
          this.themeSelection = themes.thematic_objectives;
        });
      }else{
        this.themeSelection = this.filters.thematic_objectives;
      }
    }

    private getProjectList() {

      //Hack to program period for projects 2021-2027
      if (this.myForm.value.programPeriod == "2021-2027") {
        this.projects = [];
        this.map.loadMapRegion(new Filters());
        return;
      }
      this.semanticTerms = [];
      this.initialPageIndex = this.paginatorTop ? this.paginatorTop.pageIndex : 0;
      if (this._route.snapshot.queryParamMap.has(this.translateService.queryParams.page) && !this.paginatorTop){
        const pageParam:string | null= this._route.snapshot.queryParamMap.get(this.translateService.queryParams.page);
        if (pageParam){
          const pageIndex = parseInt(pageParam) - 1;
          this.initialPageIndex = pageIndex;
        }
      }
      this.isLoading = true;
      let offset = this.initialPageIndex * this.pageSize;

      if (this.mobileQuery && this.sidenav){
        this.sidenavOpened = false;
        this.sidenav.close();
      }

      this.projectService.getProjects(this.getFilters(), offset).subscribe((result: ProjectList | null) => {
        if (result != null){
          if (result.numberResults <= offset && this._route.snapshot.queryParamMap.has(this.translateService.queryParams.page)){
              this._router.navigate([], {
                queryParams: {
                  [this.translateService.queryParams.page]: null,
                },
                queryParamsHandling: 'merge'
              });
              if (this.paginatorTop){
                this.paginatorTop.pageIndex = 0;
              }
              if (this.paginatorDown){
                this.paginatorDown.pageIndex = 0;
              }
              this.getProjectList();
          }else{
            this.projects = result.list;
            this.count = result.numberResults;
            this.semanticTerms = result.similarWords;
            this.isLoading = false;
            //go to the top
            this._document.body.scrollTop = 0;
            this._document.documentElement.scrollTop = 0;
            if (this.selectedTabIndex == 2) {
              setTimeout(
                () => {
                  this.mapIsLoaded = true;
                }, 0);
              setTimeout(
                () => {
                    this.map.loadMapRegion(this.lastFiltersSearch);
                }, 500);
            } else {
              this.mapIsLoaded = false;
            }
          }
        }

      });
      let offsetAssets = this.paginatorAssets ? (this.paginatorAssets.pageIndex * this.paginatorAssets.pageSize) : 0;
      this.projectService.getAssets(this.getFilters(), offsetAssets).subscribe(result => {
        this.assets = result.list;
        this.assetsCount = result.numberResults;
      });
    }

    onSubmit() {
      this.projects = [];
      if (this.paginatorTop.pageIndex != 0) {
        this.goFirstPage();
      }

      this._router.navigate([], {
        relativeTo: this._route,
        queryParams: this.generateQueryParams(),
        queryParamsHandling: 'merge'
      });
      if (this.isMapTab){
        this.map.refreshView();
        this.map.isLoading = true;
      }
      this.filterService.showResult$$.next({ filters: this.filterService.getFormFilters(this.myForm) });
    }

    onPaginate(event: any) {

      this.paginatorTop.pageIndex = event.pageIndex;
      this.paginatorDown.pageIndex = event.pageIndex;

      this._router.navigate([], {
        relativeTo: this._route,
        queryParams: {
          [this.translateService.queryParams.page]: event.pageIndex != 0 ? event.pageIndex + 1 : null,
        },
        queryParamsHandling: 'merge',
      });

      this.getProjectList();
    }


    onPaginateAssets(event: any) {
      this.getProjectList();
    }

    goFirstPage() {
      this.paginatorDown.firstPage();
      this.paginatorTop.firstPage();
      this.paginatorAssets.firstPage();
    }

    generateQueryParams() {
      let interventionFieldQueryParam:string[] = [];
      if (this.myForm.value.interventionField && this.myForm.value.interventionField.length){
        this.myForm.value.interventionField.forEach((interventionFieldValue:AutoCompleteItem)=>{
          interventionFieldQueryParam.push(this.getFilterLabel("categoriesOfIntervention",interventionFieldValue.id!));
        })
      }
      return {
        [this.translateService.queryParams.keywords]: this.myForm.value.keywords ? this.myForm.value.keywords.trim() : null,
        [this.translateService.queryParams.country]: this.getFilterLabel("countries", this.myForm.value.country),
        [this.translateService.queryParams.region]: this.getFilterLabel("regions", this.myForm.value.region),
        [this.translateService.queryParams.theme]: this.getFilterLabel("thematic_objectives", this.myForm.value.theme),
        [this.translateService.queryParams.policyObjective]: this.getFilterLabel("policy_objectives", this.myForm.value.policyObjective),
        programPeriod: this.getFilterLabel("programmingPeriods", this.myForm.value.programPeriod),
        [this.translateService.queryParams.fund]: this.getFilterLabel("funds", this.myForm.value.fund),
        [this.translateService.queryParams.programme]: this.getFilterLabel("programs", this.myForm.value.program),
        [this.translateService.queryParams.interventionField]: interventionFieldQueryParam.length ? interventionFieldQueryParam.toString() : null,
        [this.translateService.queryParams.totalProjectBudget]: this.getFilterLabel("totalProjectBudget", this.myForm.value.totalProjectBudget),
        [this.translateService.queryParams.amountEUSupport]: this.getFilterLabel("amountEUSupport", this.myForm.value.amountEUSupport),
        [this.translateService.queryParams.projectStart]: this.myForm.value.projectStart ? this.datePipe.transform(this.myForm.value.projectStart, 'dd-MM-yyyy') : null,
        [this.translateService.queryParams.projectEnd]: this.myForm.value.projectEnd ? this.datePipe.transform(this.myForm.value.projectEnd, 'dd-MM-yyyy') : null,
        [this.translateService.queryParams.interreg]: this.getFilterLabel("interreg", this.myForm.value.interreg),
        [this.translateService.queryParams.nuts3]: this.getFilterLabel(
          "nuts3",
          this.myForm.value.nuts3 ? this.myForm.value.nuts3.id : null
        ),
        [this.translateService.queryParams.sort]: this.getFilterLabel("sort", this.myForm.value.sort),
        [this.translateService.queryParams.priorityAxis]: this.getFilterLabel("priority_axis", this.myForm.value.priority_axis),
        [this.translateService.queryParams.projectCollection]: this.getFilterLabel("project_types", this.myForm.value.projectCollection),
        [this.translateService.queryParams.town]: this.myForm.value.town ? this.myForm.value.town.trim() : null
      }
    }

    onCountryChange() {
      this.myForm.patchValue({
        region: null,
        program: null,
        nuts3: null,
        priority_axis: null
      });
      if (this.myForm.value.country != null) {
        this.getRegions().then();
        this.getPrograms().then();
        this.getNuts3().then();
        this.getPriorityAxis().then();
      }
    }

    onRegionChange(){
      this.getNuts3().then();
      this.getPrograms().then();
      this.myForm.patchValue({
        nuts3: null,
        program: null
      });
    }

    onPolicyObjectivesChange() {
      this.getThemes();
      this.myForm.patchValue({
        theme: null
      });
    }

    onFundChange() {
        this.getPrograms();
        this.myForm.patchValue({
          program: null
        });
    }

  onProgramChange(){
    this.getPriorityAxis().then();
    this.myForm.patchValue({
      priority_axis: null
    });
  }

    onProgrammeTypeChange(){
      this.getPrograms();
      this.myForm.patchValue({
        program: null
      });
    }

    onThemeChange() {
      const theme = this.myForm.value.theme;
      if (theme){
        const params ={
          theme: environment.entityURL + theme
        }
        this.filterService.getFilter("policy_objectives",params).subscribe(policies=>{
          if (policies && policies.policy_objectives && policies.policy_objectives.length){
            this.myForm.patchValue({
              policyObjective: policies.policy_objectives[0].id
            });
          }else{
            this.myForm.patchValue({
              policyObjective: null
            });
          }
        });
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
        let params: any = {
          country: country
        }
        if (this.myForm.value.fund) {
          params["fund"] = environment.entityURL + this.myForm.value.fund
        }
        if(this.myForm.value.region) {
          params["region"] = environment.entityURL + this.myForm.value.region
        }
        if(this.myForm.value.interreg) {
          params["interreg"] = this.myForm.value.interreg
        }
        this.filterService.getFilter("programs", params).subscribe(result => {
          this.filterService.filters.programs = result.programs;
          this.filters.programs = result.programs;
          resolve(true);
        });
      });
    }

    getNuts3(): Promise<any> {
      return new Promise((resolve, reject) => {
        let params: any = {}
        if(this.myForm.value.country){
          params["country"] = environment.entityURL + this.myForm.value.country;
        }
        if (this.myForm.value.region) {
          params["region"] = environment.entityURL + this.myForm.value.region
        }else if (this._route.snapshot.queryParamMap.get(this.translateService.queryParams.region) && this.filters.regions) {
          params["region"] = environment.entityURL + this.getFilterKey("regions", this.translateService.queryParams.region)
        }
        this.filterService.getFilter("nuts3", params).subscribe(result => {
          const filtersResults = new FiltersApi().deserialize({
            nuts3: result.nuts3
          });
          this.filters.nuts3 = filtersResults.nuts3;
          resolve(true);
        });
      });
    }

    getPriorityAxis(): Promise<any> {
      return new Promise((resolve, reject) => {
        const country = environment.entityURL + this.myForm.value.country;
        let params: any = {
          country: country
        }
        if (this.myForm.value.program) {
          params["program"] = environment.entityURL + this.myForm.value.program
        }
        if (params.country && params.program) {
          this.filterService.getFilter("priority_axis", params).subscribe(result => {
            this.filterService.filters.priority_axis = result.priority_axis;
            this.filters.priority_axis = result.priority_axis;
            resolve(true);
          });
        }else{
          resolve(true);
        }
      });
    }

    onTabSelected(index:any) {
      this.isAudioVisualTab = false;
      this.isMapTab = false;
      this.isResultsTab = false;
      this.selectedTabIndex = index;
      switch (index) {
        case 0: //Results
          this.isResultsTab = true;
          this.selectedTab = this.translateService.projectPage.tabs.results;
          break;
        case 1: //Audio-visual
          this.isAudioVisualTab = true;
          this.selectedTab = this.translateService.projectPage.tabs.audiovisual;
          break;
        case 2: //Map
          if (!this.mapIsLoaded) {
            this.mapIsLoaded = true;
            setTimeout(
              () => {
                this.map.refreshView();
                this.map.loadMapRegion(this.lastFiltersSearch);
              }, 500);
          }
          this.isMapTab = true;
          this.selectedTab = this.translateService.projectPage.tabs.map;
          break;
        }

        this._router.navigate([], {
          relativeTo: this._route,
          queryParams: { [this.translateService.queryParams.tab]: this.isResultsTab ? null : this.selectedTab },
          queryParamsHandling: 'merge'
        });

      }

      getFilters() {
        const formValues = Object.assign({}, this.myForm.value);
        if (formValues.interventionField && formValues.interventionField.length){
          let interventionFieldIds:any[] = []
          formValues.interventionField.forEach((item:AutoCompleteItem)=>{
            interventionFieldIds.push(item.id);
          })
          formValues.interventionField = interventionFieldIds;
        }
        formValues.nuts3 = formValues.nuts3 ? formValues.nuts3.id : undefined;
        formValues.projectStart = formValues.projectStart ? this.datePipe.transform(formValues.projectStart, 'yyyy-MM-dd') : undefined;
        formValues.projectEnd = formValues.projectEnd ? this.datePipe.transform(formValues.projectEnd, 'yyyy-MM-dd') : undefined;
        this.lastFiltersSearch = new Filters().deserialize(formValues);
        return this.lastFiltersSearch;
      }

      openImageOverlay(imgUrl:string, projectTitle:string, imageCopyright: string[] | undefined) {
        this.dialog.open(ImageOverlayComponent, {data: {imgUrl, title: projectTitle, imageCopyright}})
      }

      getDate(dateStringFormat: any) {
        if (dateStringFormat) {
          const dateSplit = dateStringFormat.split('-');
          const javascriptFormat = dateSplit[1] + "/" + dateSplit[0] + "/" + dateSplit[2];
          return dateStringFormat ? new Date(javascriptFormat) : undefined;
        }
        return undefined;
      }

        resetForm() {
          this.myForm.reset();
          this.themeSelection = this.filters.thematic_objectives;
          this.semanticTerms = [];
          this.filterService.showResult$$.next({ filters: this.filterService.getFormFilters(this.myForm) });
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

        onClickRelatedTerm(term: any) {
          this.myForm.patchValue({ "keywords": term });
          this.onSubmit();
        }

        ngOnDestroy(): void {
          this.destroyed.next();
          this.destroyed.complete();
        }

        onToggleAdvancedFilters(collapse:boolean){
          this.advancedFilterIsExpanded = !collapse;
        }

        getClassMatDrawerContent():string{
          let ngClass:string = "kohesio-mat-drawer-container";
          if (this.advancedFilterIsExpanded){
            ngClass+= " expanded";
          }
          if (this.semanticTerms && this.semanticTerms.length){
            ngClass+= " with-semantic-terms";
          }
          return ngClass;
        }

  onNuts3Change(){
    /*if (this.myForm.value.nuts3) {
      this.myForm.patchValue({
        country: undefined,
        region: undefined
      });
    }*/
  }

  isPlatformBrowser(){
    return isPlatformBrowser(this.platformId);
  }

  isPlatformServer(){
    return isPlatformServer(this.platformId);
  }

  onSDGChange(){
    const sdgValue:any = this.filters.sdg?.find((value)=>{
      return value.id == this.myForm.value.sdg;
    })
    this.myForm.patchValue({
      'interventionField':undefined
    })
    if (sdgValue && sdgValue.interventionField){
      let qids:any[] = [];
      sdgValue.interventionField.forEach((intFieldCode:string)=>{
        const ifValue:any = this.filterService.getFilterKey("categoriesOfIntervention", intFieldCode);
        qids.push(ifValue);
      })
      if (qids.length){
        this.myForm.patchValue({
          'interventionField':qids
        })
      }
    }
    //console.log("SDG",sdgValue);
  }

  onOutsideClick() {
    if (this.notOutside) {
      this.notOutside = false;
      return;
    }
    this.infoPopup = false;

  }

  toggleInfoBtn() {
    this.notOutside = true;
    this.infoPopup = !this.infoPopup;
  }
}
