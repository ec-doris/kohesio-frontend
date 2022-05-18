import { AfterViewInit, Component, ViewChild, ChangeDetectorRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { BeneficiaryService } from "../../services/beneficiary.service";
import { FormBuilder, FormGroup } from "@angular/forms";
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

@Component({
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss']
})
export class BeneficiariesComponent implements AfterViewInit, OnDestroy {

    public myForm!: FormGroup;
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

    constructor(private beneficaryService: BeneficiaryService,
        private filterService: FilterService,
        private formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        breakpointObserver: BreakpointObserver) {

            this.mobileQuery = breakpointObserver.isMatched('(max-width: 768px)');
            this.sidenavOpened = !this.mobileQuery;

            breakpointObserver
            .observe([
                "(max-width: 768px)"
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
            name: [this._route.snapshot.queryParamMap.get('name')],
            country: [this.getFilterKey("countries", "country")],
            region: [],
            fund: [this.getFilterKey("funds", "fund")],
            program: [],
            beneficiaryType: [this.getFilterKey("beneficiaryType", "beneficiaryType")],
            sort: [this.getFilterKey("sortBeneficiaries", "sort")]
        });

        if (this.myForm.value.fund || 
                this._route.snapshot.queryParamMap.get('program') ||
                this.myForm.value.beneficiaryType){
            this.advancedFilterIsExpanded = true;
        }
    }

    ngOnInit() {

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
                    this.performSearch();
                }
            });
        }

        if (!this._route.snapshot.queryParamMap.get('region') &&
            !this._route.snapshot.queryParamMap.get('program')) {
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
            const pageParam:string | null= this._route.snapshot.queryParamMap.get('page');
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
        if (this._route.snapshot.queryParamMap.has('page') 
                && this.paginators && !this.paginators.toArray()[0]){
            const pageParam:string | null= this._route.snapshot.queryParamMap.get('page');
            if (pageParam){
                const pageIndex = parseInt(pageParam) - 1;
                initialPageIndex = pageIndex;
            }
        }
        this.isLoading = true;
        let offset = initialPageIndex * this.pageSize;

        this.beneficaryService.getBeneficiaries(filters, offset).subscribe((result: BeneficiaryList | null) => {
            if (result){
                if (result.numberResults <= offset && this._route.snapshot.queryParamMap.has('page')){
                    this._router.navigate([], {
                        queryParams: {
                          'page': null,
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

    getFormValues() {
        return {
            name: this.myForm.value.name ? this.myForm.value.name : null,
            country: this.getFilterLabel("countries", this.myForm.value.country),
            region: this.getFilterLabel("regions", this.myForm.value.region),
            fund: this.getFilterLabel("funds", this.myForm.value.fund),
            program: this.getFilterLabel("programs", this.myForm.value.program),
            sort: this.getFilterLabel("sortBeneficiaries", this.myForm.value.sort),
            beneficiaryType: this.getFilterLabel("beneficiaryType", this.myForm.value.beneficiaryType),
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
                page: event.pageIndex != 0 ? event.pageIndex + 1 : null,
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

}
