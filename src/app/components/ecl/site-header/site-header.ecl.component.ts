import { AfterViewInit, Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import {TranslateService} from "../../../services/translate.service";

@Component({
    selector: 'app-ecl-site-header',
    templateUrl: './site-header.ecl.component.html',
    styleUrls: ['./site-header.ecl.component.scss']
})

export class SiteHeaderEclComponent implements AfterViewInit {

    public searchkeywords:string | null | undefined = "";

    constructor(private router:Router, public translateService: TranslateService) {

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
    }


    onClick(event: Event) {
        let element = document.getElementById('closeMenu');
        if(element) element.click();
    }

}
