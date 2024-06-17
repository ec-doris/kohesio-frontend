import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { concatMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BeneficiaryList } from '../../models/beneficiary-list.model';
import { Beneficiary } from '../../models/beneficiary.model';
import { FiltersApi } from '../../models/filters-api.model';
import { Filters } from '../../models/filters.model';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { FilterService } from '../../services/filter.service';
import { TranslateService } from '../../services/translate.service';
import { BeneficeFormComponent } from './benefici-form/benefice-form.component';

@Component({
  templateUrl: './beneficiaries.component.html',
  styleUrls: [ './beneficiaries.component.scss' ]
})
export class BeneficiariesComponent implements AfterViewInit, OnDestroy {
  filterResult$$ = this.filterService.showResult.pipe(takeUntilDestroyed());
  // filterTooltip = 'No filters applied';
  lastFiltersSearch: any = new Filters();
  filtersCount = 0;
  public filters!: FiltersApi;
  public dataSource!: MatTableDataSource<Beneficiary>;
  public isLoading = false;
  public count = 0;
  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  @ViewChild('sidenav') sidenav!: MatDrawer;
  displayedColumns: string[] = [ 'name', 'budget', 'euBudget', 'numberProjects' ];
  public advancedFilterIsExpanded: boolean = false;
  public mobileQuery: boolean;
  public sidenavOpened: boolean;
  public pageSize = 15;
  sort = new FormControl([ this.getFilterKey('sortBeneficiaries', this.translateService.queryParams.sort) ]);
  private destroyed = new Subject<void>();

  constructor(private beneficaryService: BeneficiaryService,
              public dialog: MatDialog,
              private filterService: FilterService,
              private formBuilder: UntypedFormBuilder,
              private route: ActivatedRoute,
              private _router: Router,
              breakpointObserver: BreakpointObserver,
              public translateService: TranslateService,
              @Inject(PLATFORM_ID) private platformId: Object) {

    this.mobileQuery = breakpointObserver.isMatched('(max-width: 820px)');
    this.sidenavOpened = !this.mobileQuery;

    breakpointObserver
      .observe([
        '(max-width: 820px)'
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          this.mobileQuery = result.breakpoints[query];
          this.sidenavOpened = !this.mobileQuery;
        }
      });

    this.filters = this.route.snapshot.data['filters'];

  }

  ngOnInit() {
    this.sort.setValue(null);
    this.sort.valueChanges.subscribe(value => {
      this.lastFiltersSearch = new Filters().deserialize({ ...this.lastFiltersSearch, sort: value });
      this._router.navigate([], {
        relativeTo: this.route,
        queryParams: this.getFormValues(),
        queryParamsHandling: 'merge'
      });
      this.performSearch();
    });

    this.filterResult$$.subscribe((formVal) => {
      // this.filterTooltip = Object.values(formVal).filter((x: any) => x !== undefined && x != 'en' && x.length).length ? '' : 'No filters applied';
      this.lastFiltersSearch = formVal;
      this.filtersCount = Object.entries(this.lastFiltersSearch).filter(([ key, value ]) => value !== undefined && key != 'language' && (value as [])?.length).length;

      this.dataSource = new MatTableDataSource<Beneficiary>([]);
      if (this.paginators.toArray()[0].pageIndex == 0) {
        this.performSearch();
      } else {
        this.paginators.toArray()[0].firstPage();
      }

      this._router.navigate([], {
        relativeTo: this.route,
        queryParams: this.getFormValues(),
        queryParamsHandling: 'merge'
      });

    });
    if (this.route.snapshot.queryParamMap.get(this.translateService.queryParams.country)) {
      const queryParams: any = this.route.snapshot.queryParamMap;
      const cntr = this.filters.countries?.find(x => x.value == queryParams.params[this.translateService.queryParams.country]).id;
      of(queryParams).pipe(takeUntil(this.destroyed)).subscribe(() => {
        of(queryParams).pipe(
          concatMap(() => this.filterService.getRegions(cntr)),
          concatMap(() => this.filterService.getFilter('programs', { country: environment.entityURL + cntr }))
        ).subscribe(() => {
          const params: any = {};
          Object.keys(queryParams.params).forEach((key: any) => {
            params[key] = this.getFilterKey(this.translateService.paramMapping[key], key);
          });
          const translatedParams = this.translateKeys(params, this.translateService.queryParams);
          this.lastFiltersSearch = new Filters().deserialize(translatedParams);
          this.filtersCount = Object.entries(this.lastFiltersSearch).filter(([ key, value ]) => value !== undefined && key != 'language').length;

          if (this.route.snapshot.queryParamMap.get(this.translateService.queryParams.region) ||
            this.route.snapshot.queryParamMap.get(this.translateService.queryParams.programme)) {
            this.performSearch();
          }
        });
      });
    } else {
      this.performSearch();
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

  ngAfterViewInit(): void {
    if (this.route.snapshot.queryParamMap.has('page')) {
      const pageParam: string | null = this.route.snapshot.queryParamMap.get(this.translateService.queryParams.page);
      if (pageParam) {
        this.paginators.forEach(paginator => {
          paginator.pageIndex = parseInt(pageParam) - 1;
        });
      }
    }
  }

  removeFilter(filter: { key: string; value: any }) {
    const words = filter.key.toLowerCase().split(' ');
    let key = words[0];
    if (words.length === 2) {
      key = words[0] + words[1].charAt(0).toUpperCase() + words[1].slice(1);
    }
    const translatedKey = Object.fromEntries(Object.entries(this.translateService.queryParams).map(([ key, value ]) => [ value, key ]))[key];

    this.filterService.removeFilter(translatedKey == 'programme' ? 'program' : translatedKey, this.lastFiltersSearch);
  }

  onSubmit() {
    this.dataSource = new MatTableDataSource<Beneficiary>([]);

    if (this.paginators.toArray()[0].pageIndex == 0) {
      this.performSearch();
    } else {
      this.paginators.toArray()[0].firstPage();
    }

    this._router.navigate([], {
      relativeTo: this.route,
      queryParams: this.getFormValues(),
      queryParamsHandling: 'merge'
    });
  }

  performSearch() {
    let initialPageIndex = this.paginators && this.paginators.toArray().length ? this.paginators.toArray()[0].pageIndex : 0;
    if (this.route.snapshot.queryParamMap.has(this.translateService.queryParams.page) && !this.paginators) {
      const pageParam: string | null = this.route.snapshot.queryParamMap.get(this.translateService.queryParams.page);
      if (pageParam) {
        const pageIndex = parseInt(pageParam) - 1;
        initialPageIndex = pageIndex;
      }
    }
    this.isLoading = true;
    let offset = initialPageIndex * this.pageSize;

    this.beneficaryService.getBeneficiaries(this.lastFiltersSearch, offset).subscribe((result: BeneficiaryList) => {
      if (result.numberResults <= offset && this.route.snapshot.queryParamMap.has(this.translateService.queryParams.page)) {
        this._router.navigate([], {
          queryParams: {
            [this.translateService.queryParams.page]: null,
          },
          queryParamsHandling: 'merge'
        });
        if (this.paginators.toArray()[0]) {
          this.paginators.forEach(paginator => {
            paginator.pageIndex = 0;
          });
        }
        this.performSearch();
      } else {
        this.dataSource = new MatTableDataSource<Beneficiary>(result.list);
        this.count = result.numberResults;
        this.isLoading = false;
      }
    });
  }

  getFormValues() {
    return {
      [this.translateService.queryParams.name]: this.lastFiltersSearch.name,
      [this.translateService.queryParams.country]: this.getFilterLabel('countries', this.lastFiltersSearch.country),
      [this.translateService.queryParams.region]: this.getFilterLabel('regions', this.lastFiltersSearch.region),
      [this.translateService.queryParams.fund]: this.getFilterLabel('funds', this.lastFiltersSearch.fund),
      [this.translateService.queryParams.programme]: this.getFilterLabel('programs', this.lastFiltersSearch.program),
      [this.translateService.queryParams.sort]: this.getFilterLabel('sortBeneficiaries', this.lastFiltersSearch.sort),
      [this.translateService.queryParams.beneficiaryType]: this.getFilterLabel('beneficiaryType', this.lastFiltersSearch.beneficiaryType),
    };
  }

  onPaginate(event: any) {

    this.paginators.forEach(paginator => {
      paginator.pageIndex = event.pageIndex;
    });

    this.performSearch();

    this._router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [this.translateService.queryParams.page]: event.pageIndex != 0 ? event.pageIndex + 1 : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  isPlatformServer() {
    return isPlatformServer(this.platformId);
  }

  openFilterDialog() {
    this.dialog.open(BeneficeFormComponent, {
      width: '46rem',
      height: '50rem',
      panelClass: 'filter-dialog'
    });
  }

  private getFilterKey(type: string, queryParam: string) {
    return this.filterService.getFilterKey(type, this.route.snapshot.queryParamMap.get(queryParam));
  }

  private getFilterLabel(type: string, label: string) {
    return this.filterService.getFilterLabel(type, label);
  }
}
