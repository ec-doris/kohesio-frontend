import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe, DOCUMENT, isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, takeUntil } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ImageOverlayComponent } from 'src/app/components/kohesio/image-overlay/image-overlay.component';
import { MapComponent } from 'src/app/components/kohesio/map/map.component';
import { environment } from '../../../environments/environment';
import { AutoCompleteItem } from '../../components/kohesio/auto-complete/item.model';
import { FiltersApi } from '../../models/filters-api.model';
import { Filters } from '../../models/filters.model';
import { ProjectList } from '../../models/project-list.model';
import { Project } from '../../models/project.model';
import { FilterService } from '../../services/filter.service';
import { ProjectService } from '../../services/project.service';
import { TranslateService } from '../../services/translate.service';
import { FiltersComponent } from './dialogs/filters/filters/filters.component';

@Component({
  selector: 'kohesio-projects',
  templateUrl: './projects.component.html',
  styleUrls: [ './projects.component.scss' ]
})
export class ProjectsComponent implements OnDestroy {
  @ViewChild('paginatorTop') paginatorTop!: MatPaginator;
  @ViewChild('paginatorDown') paginatorDown!: MatPaginator;
  @ViewChild('paginatorAssets') paginatorAssets!: MatPaginator;
  @ViewChild(MapComponent) map!: MapComponent;
  projects!: Project[];
  assets: any[] = [];
  assetsCount = 0;
  filters: FiltersApi;
  count = 0;
  myForm!: UntypedFormGroup;
  isLoading = false;
  isResultsTab = true;
  isMapTab = false;
  isAudioVisualTab = false;

  selectedTabIndex: number = 0;
  selectedTab: string = this.translateService.projectPage.tabs.results;
  advancedFilterIsExpanded: boolean = false;
  mapIsLoaded = false;
  lastFiltersSearch: any = new Filters();
  entityURL = environment.entityURL;
  pageSize = 15;
  initialPageIndex: number = 0;
  semanticTerms: String[] = [];
  mobileQuery: boolean;
  filtersCount = 0;
  filterResult$$ = this.filterService.showResult.pipe(takeUntilDestroyed());
  private destroyed = new Subject<void>();

  constructor(private projectService: ProjectService,
              public filterService: FilterService,
              public dialog: MatDialog,
              private formBuilder: UntypedFormBuilder,
              private route: ActivatedRoute,
              private _router: Router,
              @Inject(DOCUMENT) private _document: Document,
              private datePipe: DatePipe,
              breakpointObserver: BreakpointObserver,
              public translateService: TranslateService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.filters = this.route.snapshot.data['filters'];
    this.mobileQuery = breakpointObserver.isMatched('(max-width: 820px)');

    breakpointObserver.observe([ '(max-width: 820px)' ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          this.mobileQuery = result.breakpoints[query];
        }
      });

    this.myForm = this.formBuilder.group({
      sort: [ this.getFilterKey('sort', this.translateService.queryParams.sort) ]
    });

    if (this.route.snapshot.queryParamMap.has(this.translateService.queryParams.tab)) {
      const tabParam = this.route.snapshot.queryParamMap.get(this.translateService.queryParams.tab);
      if (tabParam == this.translateService.projectPage.tabs.audiovisual) {
        this.selectedTabIndex = 1;
      } else if (tabParam == this.translateService.projectPage.tabs.map) {
        this.selectedTabIndex = 2;
        this.isMapTab = true;
        this.selectedTab = this.translateService.projectPage.tabs.map;
      }
    }

  }

  ngOnInit() {
    this.filterResult$$.subscribe((formVal) => {
      this.lastFiltersSearch = formVal;
      this.filtersCount = Object.entries(this.lastFiltersSearch).filter(([ key, value ]) => value !== undefined && key != 'language' && (value as [])?.length).length;

      this.projects = [];
      this.paginatorTop.pageIndex == 0 ? this.getProjectList() : this.goFirstPage();

      this._router.navigate([], { relativeTo: this.route, queryParams: this.generateQueryParams(), queryParamsHandling: 'merge' });
      if (this.isMapTab) {
        this.map.refreshView();
        this.map.isLoading = true;
      }
    });
    if (this.route.snapshot.queryParamMap.get(this.translateService.queryParams.country)) {
      const queryParams: any = this.route.snapshot.queryParamMap;
      const cntr = this.filters.countries?.find(x => x.value == queryParams.params[this.translateService.queryParams.country]).id;

      of(queryParams).pipe(
        concatMap(() => this.filterService.getRegions(cntr)),
        concatMap(() => this.filterService.getFilter('programs', { country: environment.entityURL + cntr })),
        concatMap(() => this.filterService.getFilter('nuts3', { country: environment.entityURL + cntr })),
        concatMap(() => this.filterService.getFilter('priority_axis', { country: environment.entityURL + cntr })),
        takeUntil(this.destroyed))
        .subscribe(_ => {
          const params: any = {};
          Object.keys(queryParams.params).forEach((key: any) => {
            if (this.translateService.paramMapping[key]) {
              if (key === this.translateService.queryParams.keywords || key === this.translateService.queryParams.town) {
                params[key] = this.route.snapshot.queryParamMap.get(this.translateService.queryParams[key]);
              } else if (key === this.translateService.queryParams.nuts3) {
                params[key] = this.getFilterKey(this.translateService.paramMapping[key], this.translateService.queryParams[key]).id;
              } else if (key === this.translateService.queryParams.projectStart || key === this.translateService.queryParams.projectEnd) {
                params[key] = [ this.getDate(this.route.snapshot.queryParamMap.get(this.translateService.queryParams[this.translateService.paramMapping[key]])) ];
              } else {
                params[key] = this.getFilterKey(this.translateService.paramMapping[key], key);
              }
            }
          });
          const translatedParams = this.translateKeys(params, this.translateService.queryParams);
          this.lastFiltersSearch = new Filters().deserialize(translatedParams);
          this.filtersCount = Object.entries(this.lastFiltersSearch).filter(([ key, value ]) => value !== undefined && key != 'language').length;

          this.getProjectList();
        });
    } else {
      const queryParams: any = this.route.snapshot.queryParamMap;
      of(queryParams).subscribe(() => {
          const params: any = {};
          Object.keys(queryParams.params).forEach((key: any) => {
            if (this.translateService.paramMapping[key]) {
              if (key === this.translateService.queryParams.keywords || key === this.translateService.queryParams.town) {
                params[key] = this.route.snapshot.queryParamMap.get(this.translateService.queryParams[key]);
              } else if (key === this.translateService.queryParams.projectStart || key === this.translateService.queryParams.projectEnd) {
                params[key] = [ this.getDate(this.route.snapshot.queryParamMap.get(this.translateService.queryParams[this.translateService.paramMapping[key]])) ];
              } else {
                params[key] = this.getFilterKey(this.translateService.paramMapping[key], key);
              }
            }
          });
          const translatedParams = this.translateKeys(params, this.translateService.queryParams);
          this.lastFiltersSearch = new Filters().deserialize(translatedParams);
          this.filtersCount = Object.entries(this.lastFiltersSearch).filter(([ key, value ]) => value !== undefined && key != 'language').length;

          this.getProjectList();
        }
      );
    }

  }

  translateKeys = (obj: { [key: string]: any }, translationMap: { [key: string]: string }) => {
    const reverseMap = Object.fromEntries(Object.entries(translationMap).map(([ key, value ]) => [ value, key ]));

    return Object.entries(obj).reduce((acc, [ key, value ]) => {
      const translatedKey = reverseMap[key];
      if (translatedKey) {
        acc[translatedKey] = value;
      }
      return acc;
    }, {} as { [key: string]: any });
  };


  onSubmit() {
    this.projects = [];
    if (this.paginatorTop.pageIndex == 0) {
      this.getProjectList();
    } else {
      this.goFirstPage();
    }

    this._router.navigate([], {
      relativeTo: this.route,
      queryParams: this.generateQueryParams(),
      queryParamsHandling: 'merge'
    });
    if (this.isMapTab) {
      this.map.refreshView();
      this.map.isLoading = true;
    }
  }

  onPaginate(event: any) {

    this.paginatorTop.pageIndex = event.pageIndex;
    this.paginatorDown.pageIndex = event.pageIndex;

    this._router.navigate([], {
      relativeTo: this.route,
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
    let interventionFieldQueryParam: string[] = [];
    if (this.lastFiltersSearch.interventionField && this.lastFiltersSearch.interventionField.length) {
      this.lastFiltersSearch.interventionField.forEach((interventionFieldValue: AutoCompleteItem) => {
        interventionFieldQueryParam.push(this.getFilterLabel('categoriesOfIntervention', interventionFieldValue as any));
      });
    }
    return {
      [this.translateService.queryParams.keywords]: this.lastFiltersSearch.keywords ? this.lastFiltersSearch.keywords.trim() : null,
      [this.translateService.queryParams.country]: this.getFilterLabel('countries', this.lastFiltersSearch.country),
      [this.translateService.queryParams.region]: this.getFilterLabel('regions', this.lastFiltersSearch.region),
      [this.translateService.queryParams.theme]: this.getFilterLabel('thematic_objectives', this.lastFiltersSearch.theme),
      [this.translateService.queryParams.policyObjective]: this.getFilterLabel('policy_objectives', this.lastFiltersSearch.policyObjective),
      programPeriod: this.getFilterLabel('programmingPeriods', this.lastFiltersSearch.programPeriod),
      [this.translateService.queryParams.fund]: this.getFilterLabel('funds', this.lastFiltersSearch.fund),
      [this.translateService.queryParams.programme]: this.getFilterLabel('programs', this.lastFiltersSearch.program),
      [this.translateService.queryParams.interventionField]: interventionFieldQueryParam.length ? interventionFieldQueryParam.toString() : null,
      [this.translateService.queryParams.totalProjectBudget]: this.getFilterLabel('totalProjectBudget', this.lastFiltersSearch.budgetBiggerThan + '-' + this.lastFiltersSearch.budgetSmallerThan),
      [this.translateService.queryParams.amountEUSupport]: this.getFilterLabel('amountEUSupport', this.lastFiltersSearch.budgetEUBiggerThan + '-' + this.lastFiltersSearch.budgetEUSmallerThan),
      [this.translateService.queryParams.projectStart]: this.lastFiltersSearch.startDateAfter ? this.datePipe.transform(this.lastFiltersSearch.startDateAfter, 'dd-MM-yyyy') : null,
      [this.translateService.queryParams.projectEnd]: this.lastFiltersSearch.endDateBefore ? this.datePipe.transform(this.lastFiltersSearch.endDateBefore, 'dd-MM-yyyy') : null,
      [this.translateService.queryParams.sdg]: this.getFilterLabel('sdg', this.lastFiltersSearch.sdg),
      [this.translateService.queryParams.interreg]: this.getFilterLabel('interreg', this.lastFiltersSearch.interreg),
      [this.translateService.queryParams.nuts3]: this.getFilterLabel('nuts3', this.lastFiltersSearch.nuts3 || ''),
      [this.translateService.queryParams.sort]: this.getFilterLabel('sort', this.lastFiltersSearch.sort),
      [this.translateService.queryParams.priorityAxis]: this.getFilterLabel('priority_axis', this.lastFiltersSearch.priority_axis),
      [this.translateService.queryParams.projectCollection]: this.getFilterLabel('project_types', this.lastFiltersSearch.projectTypes),
      [this.translateService.queryParams.town]: this.lastFiltersSearch.town ? this.lastFiltersSearch.town.trim() : null
    };
  }

  onTabSelected(index: any) {
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
              this.map.loadMapRegion(this.lastFiltersSearch as any);
            }, 500);
        }
        this.isMapTab = true;
        this.selectedTab = this.translateService.projectPage.tabs.map;
        break;
    }

    this._router.navigate([], {
      relativeTo: this.route,
      queryParams: { [this.translateService.queryParams.tab]: this.isResultsTab ? null : this.selectedTab },
      queryParamsHandling: 'merge'
    });

  }

  openImageOverlay(imgUrl: string, projectTitle: string, imageCopyright: string[] | undefined) {
    this.dialog.open(ImageOverlayComponent, { data: { imgUrl, title: projectTitle, imageCopyright } });
  }

  getDate(dateStringFormat: any) {
    if (dateStringFormat) {
      const dateSplit = dateStringFormat.split('-');
      const javascriptFormat = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];
      return dateStringFormat ? new Date(javascriptFormat) : undefined;
    }
    return undefined;
  }

  onSortChange() {
    if (!this.myForm.value.sort) {
      this.myForm.value.sort = 'relevance';
    }
    this.onSubmit();
  }


  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  getClassMatDrawerContent(): string {
    let ngClass: string = 'kohesio-mat-drawer-container';
    if (this.advancedFilterIsExpanded) {
      ngClass += ' expanded';
    }
    if (this.semanticTerms && this.semanticTerms.length) {
      ngClass += ' with-semantic-terms';
    }
    return ngClass;
  }


  isPlatformServer() {
    return isPlatformServer(this.platformId);
  }

  openFilterDialog() {
    this.dialog.open(FiltersComponent, {
      width: '46rem',
      height: '50rem',
      panelClass: 'filter-dialog'
    });
  }

  removeFilter(filter: { key: string; value: any }) {
    const words = filter.key.toLowerCase().split(' ');
    let key = words[0];
    if (words.length === 2) {
      key = words[0] + words[1].charAt(0).toUpperCase() + words[1].slice(1);
    }
    let translatedKey = Object.fromEntries(Object.entries(this.translateService.queryParams).map(([ key, value ]) => [ value, key ]))[key == 'projectTypes' ? 'projectCollection' : key];
    translatedKey = translatedKey == 'projectTypes' ? 'projectCollection' : translatedKey
    this.filterService.removeFilter(translatedKey == 'program' ? 'programme' : translatedKey, this.lastFiltersSearch);
  }

  private getFilterKey(type: string, queryParam: string) {
    return this.filterService.getFilterKey(type, this.route.snapshot.queryParamMap.get(queryParam));
  }

  private getFilterLabel(type: string, label: string) {
    return this.filterService.getFilterLabel(type, label);
  }

  private getProjectList() {
    this.semanticTerms = [];
    this.initialPageIndex = this.paginatorTop ? this.paginatorTop.pageIndex : 0;
    if (this.route.snapshot.queryParamMap.has(this.translateService.queryParams.page) && !this.paginatorTop) {
      const pageParam: string | null = this.route.snapshot.queryParamMap.get(this.translateService.queryParams.page);
      if (pageParam) {
        const pageIndex = parseInt(pageParam) - 1;
        this.initialPageIndex = pageIndex;
      }
    }
    this.isLoading = true;
    let offset = this.initialPageIndex * this.pageSize;
    // const { sdg, ...filteredSearch } = this.lastFiltersSearch;
    this.projectService.getProjects(this.lastFiltersSearch, offset).subscribe((result: ProjectList) => {
      if (result.numberResults <= offset && this.route.snapshot.queryParamMap.has(this.translateService.queryParams.page)) {
        this._router.navigate([], { queryParams: { [this.translateService.queryParams.page]: null }, queryParamsHandling: 'merge' });
        if (this.paginatorTop) {
          this.paginatorTop.pageIndex = 0;
        }
        if (this.paginatorDown) {
          this.paginatorDown.pageIndex = 0;
        }
      } else {
        this.projects = result.list;
        this.count = result.numberResults;
        this.semanticTerms = result.similarWords;
        this.isLoading = false;
        this._document.body.scrollTop = 0;
        this._document.documentElement.scrollTop = 0;
        if (this.selectedTabIndex == 2) {
          setTimeout(() => this.mapIsLoaded = true, 0);
          setTimeout(() => this.map?.loadMapRegion(this.lastFiltersSearch), 0);
        } else {
          this.mapIsLoaded = false;
        }
      }
    });
    let offsetAssets = this.paginatorAssets ? (this.paginatorAssets.pageIndex * this.paginatorAssets.pageSize) : 0;
    this.projectService.getAssets(this.lastFiltersSearch, offsetAssets).subscribe(result => {
      this.assets = result.list;
      this.assetsCount = result.numberResults;
    });
  }
}
