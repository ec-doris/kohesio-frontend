import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {BeneficiaryService} from "../../services/beneficiary.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import {Filters} from "../../shared/models/filters.model";
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Beneficiary} from "../../shared/models/beneficiary.model";
import {FilterService} from "../../services/filter.service";
import {FiltersApi} from "../../shared/models/filters-api.model";
import {environment} from "../../../environments/environment";
import {BeneficiaryList} from "../../shared/models/beneficiary-list.model";
import { UxAppShellService } from '@eui/core';

@Component({
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss']
})
export class BeneficiariesComponent implements AfterViewInit {

    public myForm: FormGroup;
    public filters: FiltersApi;
    public dataSource:MatTableDataSource<Beneficiary>;
    public isLoading = false;
    public count = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = ['name', 'budget', 'euBudget', 'numberProjects'];
    public fileTypes = {
        csv:{
            extension: 'csv',
            type: 'text/csv'
        },
        excel:{
            extension: 'xls',
            type: 'application/vnd.ms-excel'
        }
    }
    public advancedFilterExpanded = false;

    constructor(private beneficaryService: BeneficiaryService,
                private filterService: FilterService,
                private formBuilder: FormBuilder,
                private _route: ActivatedRoute,
                private _router: Router,
                public uxAppShellService: UxAppShellService,){}

    ngOnInit(){
        this.filters = this._route.snapshot.data.filters;

        this.myForm = this.formBuilder.group({
            name: [this._route.snapshot.queryParamMap.get('name')],
            country: [this.getFilterKey("countries","country")],
            region: [],
            fund:[this.getFilterKey("funds","fund")],
            program:[]
        });

        this.advancedFilterExpanded = this.myForm.value.fund || this._route.snapshot.queryParamMap.get('program');

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
                    this.performSearch();
                }
            });
        }

        if (!this._route.snapshot.queryParamMap.get('region') &&
            !this._route.snapshot.queryParamMap.get('program')) {
            this.performSearch();
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

    onSubmit() {
        this.dataSource = null;
        const filters = new Filters().deserialize(this.myForm.value);
        this.performSearch();

        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: this.getFormValues(),
            queryParamsHandling: 'merge'
        });
    }

    performSearch(){
        const filters = new Filters().deserialize(this.myForm.value);
        this.isLoading = true;
        let offset = this.paginator ? (this.paginator.pageIndex * this.paginator.pageSize) : 0;
        this.beneficaryService.getBeneficiaries(filters, offset).subscribe((result:BeneficiaryList) => {
            this.dataSource = new MatTableDataSource<Beneficiary>(result.list);
            this.count = result.numberResults;
            //this.dataSource.paginator = this.paginator;
            this.isLoading = false;
        });
    }

    getFormValues(){
        return {
            name: this.myForm.value.name ? this.myForm.value.name : null,
            country: this.getFilterLabel("countries", this.myForm.value.country),
            region: this.getFilterLabel("regions", this.myForm.value.region),
            fund: this.getFilterLabel("funds", this.myForm.value.fund),
            program: this.getFilterLabel("programs", this.myForm.value.program)
        }
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

    onCountryChange(){
        this.getRegions().then();
        this.getPrograms().then();
        this.myForm.patchValue({
            region: null,
            program: null
        });
    }

    getFile(type:string){
        const filters = new Filters().deserialize(this.myForm.value);
        this.beneficaryService.getFile(filters, type).subscribe(response=>{

            const newBlob = new Blob([response], { type: this.fileTypes[type].type });
            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }

            const data = window.URL.createObjectURL(newBlob);

            let link = document.createElement('a');
            link.href = data;
            link.download = "beneficiaries." + this.fileTypes[type].extension;
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

            setTimeout(function () {
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
        })
    }

    resetForm(){
        this.myForm.reset();
    }

    onPaginate(event){
        this.paginator.pageIndex = event.pageIndex;
        this.performSearch();
    }

}
