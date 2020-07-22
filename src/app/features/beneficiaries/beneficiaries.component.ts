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

@Component({
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss']
})
export class BeneficiariesComponent implements AfterViewInit {

    public myForm: FormGroup;
    public filters: FiltersApi;
    public dataSource:MatTableDataSource<Beneficiary>;
    public isLoading = false;
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
                private _router: Router,){}

    ngOnInit(){
        this.filters = this._route.snapshot.data.filters;

        this.myForm = this.formBuilder.group({
            name: [this._route.snapshot.queryParamMap.get('name')],
            country: [this.getFilterKey("countries","country")],
            region: [],
            fund:[this.getFilterKey("funds","fund")],
            program:[this.getFilterKey("programs","program")]
        });

        this.advancedFilterExpanded = this.myForm.value.fund || this.myForm.value.program;

        if (this._route.snapshot.queryParamMap.get('country')) {
            this.getRegions().then(regions=>{
                if (this._route.snapshot.queryParamMap.get('region')) {
                    this.myForm.patchValue({
                        region: this.filterService.getFilterKey("regions", this._route.snapshot.queryParamMap.get('region'))
                    });
                    this.performSearch();
                }
            });
        }

        if (!this._route.snapshot.queryParamMap.get('region')) {
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
        this.beneficaryService.getBeneficiaries(filters).subscribe((result:Beneficiary[]) => {
            this.dataSource = new MatTableDataSource<Beneficiary>(result);
            this.dataSource.paginator = this.paginator;
            this.isLoading = false;
            this.paginator.firstPage();
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

    onCountryChange(){
        this.getRegions();
        this.myForm.patchValue({
            region: null
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

}
