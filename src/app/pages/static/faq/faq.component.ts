import {AfterViewInit, Component, Inject, PLATFORM_ID} from '@angular/core';
import {TranslateService} from "../../../services/translate.service";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
declare let ECL:any;

@Component({
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqPageComponent implements AfterViewInit {


    constructor(public translateService: TranslateService,
                @Inject(DOCUMENT) private _document: Document,
                @Inject(PLATFORM_ID) private platformId: Object){}

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
