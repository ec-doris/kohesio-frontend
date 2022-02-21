import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { SearchItem, SearchList } from 'src/app/models/search-item.model';
import { SearchService } from 'src/app/services/search.service';

@Component({
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {

    public items:SearchItem[] | undefined; 
    public isLoading:boolean = true;
    public pageSize:number = 15;
    public initialPageIndex:number = 0;
    public count:number = 0;
    public keywords:string | null | undefined;
    @ViewChild("paginator") paginator!: MatPaginator;

    constructor(private _route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private searchService: SearchService){
        
    }

    ngOnInit() {
        this.keywords = this._route.snapshot.queryParamMap.get('keywords');
        this.getGlobalResults();
    }

    getGlobalResults(){
        this.isLoading = true;
        if (this.keywords){
            this.initialPageIndex = this.paginator ? this.paginator.pageIndex : 0;
            let offset = this.initialPageIndex * this.pageSize;
            this.searchService.getItems(this.keywords, offset).subscribe((searchlist:SearchList | null)=>{
                if (searchlist){
                    this.items = searchlist?.items;
                    this.count = searchlist.numberResults;
                }
                this.isLoading = false;
            });
        }
    }

    onPaginate(event: any) {
        this.items = [];
        this.getGlobalResults();
    }

}