import {AfterViewInit, Component, Inject, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ListOfOperation} from "../../models/loo.model";
import {TranslateService} from "../../services/translate.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {ListOfOperationService} from "../../services/list-of-operation.service";
import {environment} from "../../../environments/environment";
declare let ECL:any;

@Component({
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqPageComponent implements AfterViewInit {

    public listOfOperation!: ListOfOperation[];
    public mobileQuery: boolean;
    public countries!: [];
    public countrySelected:string = "";
    public isLoading:boolean = false;

    constructor(public translateService: TranslateService,
                @Inject(DOCUMENT) private _document: Document,
                @Inject(PLATFORM_ID) private platformId: Object,
                breakpointObserver: BreakpointObserver,
                private _route: ActivatedRoute,
                public listOfOperationService: ListOfOperationService){

      this.mobileQuery = breakpointObserver.isMatched('(max-width: 768px)');
      const data = this._route.snapshot.data['data'];
      this.listOfOperation = data.listOfOperation;
      this.countries = data.countries;
    }

    ngOnInit(){
    }

    ngAfterViewInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        const elt = this._document.querySelector('[data-ecl-inpage-navigation]');
        const inpageNavigation = new ECL.InpageNavigation(elt);
        inpageNavigation.init();
      }
    }

    onCountryChange(ev:any){
      this.listOfOperation = [];
      this.isLoading = true;
      let params:any = {};
      if (this.countrySelected){
        params.country = environment.entityURL + this.countrySelected;
      }
      this.listOfOperationService.getListOfOperation(params).subscribe((data:ListOfOperation[])=>{
        this.listOfOperation = data;
        this.isLoading = false;
      })
    }

}
