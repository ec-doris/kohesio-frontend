import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '../../../services/translate.service';

declare let ECL: any;

@Component({
  selector: 'app-ecl-carousel',
  templateUrl: './carousel.ecl.component.html',
  styleUrls: [ './carousel.ecl.component.scss' ]
})

export class CarouselEclComponent implements AfterViewInit {

  public carousel: any;

  constructor(public translateService: TranslateService,
              @Inject(PLATFORM_ID) private platformId: Object,
              @Inject(DOCUMENT) private _doc: Document) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.isPlatformBrowser()) {
      let elt = this._doc.querySelector('[data-ecl-carousel]');
      this.carousel = new ECL.Carousel(elt);

      this.carousel.init();
    }
  }

  isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  next() {
    this.carousel.shiftSlide('next', true);
  }

  previous() {
    this.carousel.shiftSlide('prev', true);
  }
}
