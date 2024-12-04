import {AfterViewInit, Component} from '@angular/core';
import {TranslateService} from "../../services/translate.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss']
})
export class DataPageComponent implements AfterViewInit {

    public url:string;
    public data:string;

    constructor(private _route: ActivatedRoute,
                public translateService:TranslateService){
      this.url = this._route.snapshot.url.toString();
      this.data = this._route.snapshot.data['data'];

    }

    ngOnInit(){
    }

    ngAfterViewInit(): void {
    }

}
