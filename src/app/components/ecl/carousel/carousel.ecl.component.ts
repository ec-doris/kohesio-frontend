import { AfterViewInit, Component } from '@angular/core';
declare let ECL: any;

@Component({
    selector: 'app-ecl-carousel',
    templateUrl: './carousel.ecl.component.html',
    styleUrls: ['./carousel.ecl.component.scss']
})

export class CarouselEclComponent implements AfterViewInit {

    public carousel: any;

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        let elt = document.querySelector('[data-ecl-carousel]');
        this.carousel = new ECL.Carousel(elt);
        this.carousel.init();
    }

}
