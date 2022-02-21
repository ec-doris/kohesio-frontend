import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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

    constructor(private _route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private searchService: SearchService){
        
    }

    ngOnInit() {

        const keywords = this._route.snapshot.queryParamMap.get('keywords');

        this.searchService.getItems(keywords).subscribe((searchlist:SearchList | null)=>{
            if (searchlist){
                this.items = searchlist?.items;
            }
            this.isLoading = false;
        });
    }

}