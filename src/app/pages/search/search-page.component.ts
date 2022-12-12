import { Component, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { SearchItem, SearchList } from 'src/app/models/search-item.model';
import { SearchService } from 'src/app/services/search.service';
import {TranslateService} from "../../services/translate.service";

@Component({
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {

    public items:SearchItem[] = [];
    public isLoading:boolean = true;
    public pageSize:number = 15;
    public initialPageIndex:number = 0;
    public count:number = 0;
    public keywords:string | null | undefined;
    @ViewChild("paginatorTop") paginatorTop!: MatPaginator;
    @ViewChild("paginatorBottom") paginatorBottom!: MatPaginator;

    constructor(private _route: ActivatedRoute,
                private formBuilder: UntypedFormBuilder,
                private searchService: SearchService,
                public translateService: TranslateService){

    }

    ngOnInit() {
        this.keywords = this._route.snapshot.queryParamMap.get(this.translateService.queryParams.keywords);
        this.getGlobalResults();
    }

    getGlobalResults(){
        this.isLoading = true;
        if (this.keywords){
            this.initialPageIndex = this.paginatorTop ? this.paginatorTop.pageIndex : 0;
            let offset = this.initialPageIndex * this.pageSize;
            this.searchService.getItems(this.keywords, offset).subscribe((searchlist:SearchList | null)=>{
                if (searchlist && searchlist.items){
                    this.items = searchlist.items;
                    this.count = searchlist.numberResults;
                }
                this.isLoading = false;
            });
        }
    }

    onPaginate(event: any) {
        this.items = [];
        this.paginatorTop.pageIndex = event.pageIndex;
        this.paginatorBottom.pageIndex = event.pageIndex;
        this.getGlobalResults();
    }

}
