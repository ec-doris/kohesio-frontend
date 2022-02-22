import {AfterViewInit, Component} from '@angular/core';
declare let ECL:any;

@Component({
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqPageComponent implements AfterViewInit {


    constructor(){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
        var elt2 = document.querySelector('[data-ecl-inpage-navigation]');
        var inpageNavigation2 = new ECL.InpageNavigation(elt2);
        inpageNavigation2.init();
    }

}
