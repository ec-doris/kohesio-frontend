import {AfterViewInit, Component} from '@angular/core';

@Component({
    templateUrl: './faq.component.html'
})
export class FaqPageComponent implements AfterViewInit {


    constructor(){}

    ngOnInit(){
        window.scrollTo(0, 0)
    }

    ngAfterViewInit(): void {
    }

}
