import {AfterViewInit, Component} from '@angular/core';
declare let ECL:any;

@Component({
    templateUrl: './privacy.component.html'
})
export class PrivacyPageComponent implements AfterViewInit {


    constructor(){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
        var elt = document.querySelector('[data-ecl-inpage-navigation]');
        var inpageNavigation = new ECL.InpageNavigation(elt);
        inpageNavigation.init();
    }

}
