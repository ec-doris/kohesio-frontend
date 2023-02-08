import {AfterViewInit, Component, Inject, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ListOfOperation} from "../../models/loo.model";
import {TranslateService} from "../../services/translate.service";
import {BreakpointObserver} from "@angular/cdk/layout";
declare let ECL:any;

@Component({
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqPageComponent implements AfterViewInit {

    public listOfOperation!: ListOfOperation[];
    public displayedColumns: string[] = ['id', 'instanceLabel', 'url', 'last_update', 'ccis'];
    public mobileQuery: boolean;

    constructor(public translateService: TranslateService,
                @Inject(DOCUMENT) private _document: Document,
                @Inject(PLATFORM_ID) private platformId: Object,
                breakpointObserver: BreakpointObserver,
                private _route: ActivatedRoute){

      this.mobileQuery = breakpointObserver.isMatched('(max-width: 768px)');
      this.listOfOperation = this._route.snapshot.data['listOfOperation'];

    }

    ngOnInit(){
    }

    ngAfterViewInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        var elt = this._document.querySelector('[data-ecl-inpage-navigation]');
        var inpageNavigation = new ECL.InpageNavigation(elt);
        inpageNavigation.init();
      }
    }

}
