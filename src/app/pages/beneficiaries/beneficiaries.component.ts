import {
  AfterViewInit,
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  QueryList,
  ViewChildren,
  Inject, PLATFORM_ID
} from '@angular/core';
import { BeneficiaryService } from "../../services/beneficiary.service";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Filters } from "../../models/filters.model";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Beneficiary } from "../../models/beneficiary.model";
import { FilterService } from "../../services/filter.service";
import { FiltersApi } from "../../models/filters-api.model";
import { environment } from "../../../environments/environment";
import { BeneficiaryList } from "../../models/beneficiary-list.model";
import { startWith, map, delay, takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints, MediaMatcher} from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import {TranslateService} from "../../services/translate.service";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";

@Component({
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss']
})
export class BeneficiariesComponent implements AfterViewInit, OnDestroy {

    public myForm!: UntypedFormGroup;
    public filters!: FiltersApi;
    public dataSource!: MatTableDataSource<Beneficiary>;
    public isLoading = false;
    public count = 0;
    @ViewChildren(MatPaginator) paginators!:QueryList<MatPaginator>;
    @ViewChild("sidenav") sidenav!: MatDrawer;
    displayedColumns: string[] = ['name', 'budget', 'euBudget', 'numberProjects'];
    public advancedFilterIsExpanded: boolean = false;
    public mobileQuery: boolean;
    public sidenavOpened: boolean;
    private destroyed = new Subject<void>();
    public pageSize = 15;
    public infoPopupLabelType:boolean = false;
    private notOutside = false;

    constructor(private beneficaryService: BeneficiaryService,
        private filterService: FilterService,
        private formBuilder: UntypedFormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        breakpointObserver: BreakpointObserver,
        public translateService: TranslateService,
        @Inject(PLATFORM_ID) private platformId: Object) {

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

            this.filters = this._route.snapshot.data['filters'];

        this.myForm = this.formBuilder.group({
            name: [this._route.snapshot.queryParamMap.get(this.translateService.queryParams.name)],
            country: [this.getFilterKey("countries", this.translateService.queryParams.country)],
            region: [],
            fund: [this.getFilterKey("funds", this.translateService.queryParams.fund)],
            program: [],
            beneficiaryType: [this.getFilterKey("beneficiaryType", this.translateService.queryParams.beneficiaryType)],
            sort: [this.getFilterKey("sortBeneficiaries", this.translateService.queryParams.sort)]
        });

        if (this.myForm.value.fund ||
                this._route.snapshot.queryParamMap.get(this.translateService.queryParams.programme) ||
                this.myForm.value.beneficiaryType){
            this.advancedFilterIsExpanded = true;
        }
    }

    ngOnInit() {

        if (this._route.snapshot.queryParamMap.get(this.translateService.queryParams.country)) {
            Promise.all([this.getRegions(), this.getPrograms()]).then(results => {
                if (this._route.snapshot.queryParamMap.get(this.translateService.queryParams.region)) {
                    this.myForm.patchValue({
                        region: this.getFilterKey("regions", this.translateService.queryParams.region)
                    });
                }
                if (this._route.snapshot.queryParamMap.get(this.translateService.queryParams.programme)) {
                    this.myForm.patchValue({
                        program: this.getFilterKey("programs", this.translateService.queryParams.programme)
                    });
                }
                if (this._route.snapshot.queryParamMap.get(this.translateService.queryParams.region) ||
                    this._route.snapshot.queryParamMap.get(this.translateService.queryParams.programme)) {
                    this.performSearch();
                }
            });
        }

        if (!this._route.snapshot.queryParamMap.get(this.translateService.queryParams.region) &&
            !this._route.snapshot.queryParamMap.get(this.translateService.queryParams.programme)) {
            this.performSearch();
        }
    }

    private getFilterKey(type: string, queryParam: string) {
        return this.filterService.getFilterKey(type, this._route.snapshot.queryParamMap.get(queryParam))
    }

    private getFilterLabel(type: string, label: string) {
        return this.filterService.getFilterLabel(type, label)
    }

    ngAfterViewInit(): void {
        if (this._route.snapshot.queryParamMap.has('page')){
            const pageParam:string | null= this._route.snapshot.queryParamMap.get(this.translateService.queryParams.page);
            if (pageParam){
                this.paginators.forEach(paginator=>{
                    paginator.pageIndex = parseInt(pageParam) - 1;
                });
            }
        }
    }

    onSubmit() {
        this.dataSource = new MatTableDataSource<Beneficiary>([]);;

        if (this.paginators.toArray()[0].pageIndex == 0) {
            this.performSearch();
        } else {
            this.paginators.toArray()[0].firstPage();
        }

        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: this.getFormValues(),
            queryParamsHandling: 'merge'
        });
    }

    performSearch() {
        const filters = new Filters().deserialize(this.myForm.value);

        if (this.mobileQuery && this.sidenav){
            this.sidenavOpened = false;
            this.sidenav.close();
        }

        let initialPageIndex = this.paginators && this.paginators.toArray().length ? this.paginators.toArray()[0].pageIndex : 0;
        if (this._route.snapshot.queryParamMap.has(this.translateService.queryParams.page) && !this.paginators){
            const pageParam:string | null= this._route.snapshot.queryParamMap.get(this.translateService.queryParams.page);
            if (pageParam){
                const pageIndex = parseInt(pageParam) - 1;
                initialPageIndex = pageIndex;
            }
        }
        this.isLoading = true;
        let offset = initialPageIndex * this.pageSize;

        this.beneficaryService.getBeneficiaries(filters, offset).subscribe((result: BeneficiaryList | null) => {
            if (result){
                if (result.numberResults <= offset && this._route.snapshot.queryParamMap.has(this.translateService.queryParams.page)){
                    this._router.navigate([], {
                        queryParams: {
                          [this.translateService.queryParams.page]: null,
                        },
                        queryParamsHandling: 'merge'
                      });
                      if (this.paginators.toArray()[0]){
                        this.paginators.forEach(paginator=>{
                            paginator.pageIndex = 0;
                        });
                      }
                      this.performSearch();
                }else{
                    this.dataSource = new MatTableDataSource<Beneficiary>(result.list);
                    this.count = result.numberResults;
                    this.isLoading = false;
                }
            }
        });
    }

    getFilters(): Filters{
      const filters:Filters = new Filters().deserialize(this.myForm.value)
      return filters;
    }

    getFormValues() {
        return {
            [this.translateService.queryParams.name]: this.myForm.value.name ? this.myForm.value.name : null,
            [this.translateService.queryParams.country]: this.getFilterLabel("countries", this.myForm.value.country),
            [this.translateService.queryParams.region]: this.getFilterLabel("regions", this.myForm.value.region),
            [this.translateService.queryParams.fund]: this.getFilterLabel("funds", this.myForm.value.fund),
            [this.translateService.queryParams.programme]: this.getFilterLabel("programs", this.myForm.value.program),
            [this.translateService.queryParams.sort]: this.getFilterLabel("sortBeneficiaries", this.myForm.value.sort),
            [this.translateService.queryParams.beneficiaryType]: this.getFilterLabel("beneficiaryType", this.myForm.value.beneficiaryType),
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

    onCountryChange() {
        if (this.myForm.value.country != null) {
            this.getRegions().then();
            this.getPrograms().then();
        }
        this.myForm.patchValue({
            region: null,
            program: null
        });
    }

    resetForm() {
        this.myForm.reset();
    }

    onPaginate(event:any) {

        this.paginators.forEach(paginator=>{
            paginator.pageIndex = event.pageIndex;
        })

        this.performSearch();

        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: {
                [this.translateService.queryParams.page]: event.pageIndex != 0 ? event.pageIndex + 1 : null,
            },
            queryParamsHandling: 'merge',
        });
    }

    onSortChange() {
        this.onSubmit();
    }

    onToggleAdvancedFilters(collapse:boolean){
        this.advancedFilterIsExpanded = !collapse;
    }

    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }

  isPlatformBrowser(){
    return isPlatformBrowser(this.platformId);
  }

  isPlatformServer(){
    return isPlatformServer(this.platformId);
  }

  onOutsideClick() {
    if (this.notOutside) {
      this.notOutside = false;
      return;
    }
    this.infoPopupLabelType = false;

  }
  toggleInfoBtn() {
    this.notOutside = true;
    this.infoPopupLabelType = !this.infoPopupLabelType;
  }
}
