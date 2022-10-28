import {AfterViewInit, Component} from '@angular/core';
import {TranslateService} from "../../../services/translate.service";
declare let ECL:any;

@Component({
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.scss']
})
export class PrivacyPageComponent implements AfterViewInit {


    constructor(public translateService:TranslateService){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
        var elt = document.querySelector('[data-ecl-inpage-navigation]');
        var inpageNavigation = new ECL.InpageNavigation(elt);
        inpageNavigation.init();
    }

}
