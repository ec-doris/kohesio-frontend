import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { TranslateService } from '../../../services/translate.service';

declare let ECL: any;

@Component({
  selector: 'app-ecl-carousel',
  templateUrl: './carousel.ecl.component.html',
  styleUrls: [ './carousel.ecl.component.scss' ]
})

export class CarouselEclComponent implements AfterViewInit {
  @ViewChild('carouselSlider') carouselSlider!: ElementRef;
  public carousel: any;

  constructor(public translateService: TranslateService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private _doc: Document) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.isPlatformBrowser()) {
      let elt = this._doc.querySelector('[data-ecl-carousel]');
      this.carousel = new ECL.Carousel(elt);

      this.carousel.init();

      // TODO: This is a one-time executable. Please remove it(the if block), if it's no longer compatible with the new ECL version.
      if (this._doc.documentElement.clientWidth <= 768) {
        const currentWidth = this._doc.defaultView?.getComputedStyle(this.carouselSlider.nativeElement).width;
        const currentWidthValue = parseInt(currentWidth as string, 10);
        const newWidthValue = currentWidthValue - 75;
        this.renderer.setStyle(this.carouselSlider.nativeElement, 'width', `${newWidthValue}px`);
      }
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
