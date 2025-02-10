import {AfterViewInit, Component, Inject, PLATFORM_ID} from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import {TranslateService} from "../../../services/translate.service";
import {DOCUMENT,isPlatformBrowser} from "@angular/common";
declare const ECL: any;
@Component({
    selector: 'app-ecl-site-header',
    templateUrl: './site-header.ecl.component.html',
    styleUrls: ['./site-header.ecl.component.scss']
})

export class SiteHeaderEclComponent implements AfterViewInit {
    public searchkeywords:string | null | undefined = "";

    constructor(private router:Router,
                public translateService: TranslateService,
                @Inject(PLATFORM_ID) private platformId: Object,
                @Inject(DOCUMENT) private _doc: Document) {

        this.router.events.subscribe(event => {
            if(event instanceof ActivationEnd) {
                if (event.snapshot.queryParams[translateService.queryParams.keywords] && event.snapshot.data['pageId'] == "search"){
                    this.searchkeywords =  event.snapshot.queryParams[translateService.queryParams.keywords];
                }
            }
        });

    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
       this.initializeECLMenu();
    }

    initializeECLMenu() {
      if (this.isPlatformBrowser()) {
        if (ECL?.autoInit) {
          ECL.autoInit();
        }
      }
    }
  isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }
    onClick(event: Event) {
        let element = this._doc.getElementById('closeMenu');
        if(element) element.click();
    }

}
