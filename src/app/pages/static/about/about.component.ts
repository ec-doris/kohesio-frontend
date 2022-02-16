import {AfterViewInit, Component} from '@angular/core';

@Component({
    templateUrl: './about.component.html'
})
export class AboutComponent implements AfterViewInit {


    constructor(){}

    ngOnInit(){
        window.scrollTo(0, 0)
    }

    ngAfterViewInit(): void {
    }

}
