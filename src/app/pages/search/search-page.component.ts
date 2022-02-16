import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {

    public myForm!: FormGroup;

    constructor(private _route: ActivatedRoute,
                private formBuilder: FormBuilder){
        
    }

    ngOnInit() {
        this.myForm = this.formBuilder.group({
            keywords: this._route.snapshot.queryParamMap.get('keywords')
        });
    }

}