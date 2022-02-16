import {AfterViewInit, Component} from '@angular/core';

@Component({
    templateUrl: './privacy.component.html'
})
export class PrivacyPageComponent implements AfterViewInit {


    constructor(){}

    ngOnInit(){
        window.scrollTo(0, 0)
    }

    ngAfterViewInit(): void {
    }

}
