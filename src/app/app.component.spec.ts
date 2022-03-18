import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CarouselEclModule } from './components/ecl/carousel/carousel.ecl.module';
import { FooterEclModule } from './components/ecl/footer/footer.ecl.module';
import { SiteHeaderEclModule } from './components/ecl/site-header/site-header.ecl.module';
import { MapComponentModule } from './components/kohesio/map/map.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FooterEclModule,
        MapComponentModule,
        CarouselEclModule,
        SiteHeaderEclModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'kohesio-frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('kohesio-frontend');
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain('kohesio-frontend app is running!');
  // });
});
