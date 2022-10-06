import { AfterViewInit, Component } from '@angular/core';
import {TranslateService} from "../../../services/translate.service";
declare let ECL: any;

@Component({
    selector: 'app-ecl-carousel',
    templateUrl: './carousel.ecl.component.html',
    styleUrls: ['./carousel.ecl.component.scss']
})

export class CarouselEclComponent implements AfterViewInit {

    public carousel: any;

    constructor(public translateService: TranslateService) { }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        let elt = document.querySelector('[data-ecl-carousel]');
        this.carousel = new ECL.Carousel(elt);
        this.carousel.init();
    }

}
