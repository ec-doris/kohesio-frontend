import {Component, HostListener, PLATFORM_ID} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { LOCALE_ID, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import {MetaService} from "./services/meta.service";
import {UserService} from "./services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {SurveyDialogComponent} from "./components/kohesio/survey-dialog/survey-dialog.component";
declare let ECL:any;
declare let $wt:any;
import {CookieService} from 'ngx-cookie-service';
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kohesio-frontend';

  count:number = 0;
  lastPage:string = "";
  url: string;
  @HostListener('window:wtReady')
  doAnalytics(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe(value => {
        if (value instanceof NavigationEnd) {
          if ($wt && $wt.analytics.isTrackable()) {
            if (this.count > 0 && this.lastPage != value.url) {
              $wt.trackPageView();
            }
            this.count++;
            this.lastPage = value.url;

          }
        }
      });
    }

  }
  //country = $localize`:@@page.projects.label.country:COUNTRY`;

  constructor(public router:Router,
              @Inject(LOCALE_ID) public locale: string,
              public location: Location,
              @Inject(PLATFORM_ID) private platformId: Object,
              private metaService:MetaService,
              private userService:UserService,
              public dialog: MatDialog,
              private cookieService: CookieService){
    //console.log("LOCALE=",locale);
    //console.log("LOCALE COUNTRY=",this.country);
    this.url = location.path();
  }

  ngOnInit(){
    // if (isPlatformBrowser(this.platformId)) {
    //   this.router.events.subscribe(value => {
    //     if (value instanceof NavigationEnd) {
    //       if ($wt && $wt.analytics.isTrackable()) {
    //         if (this.count > 0 && this.lastPage != value.url) {
    //           $wt.trackPageView();
    //         }
    //         this.count++;
    //         this.lastPage = value.url;
    //
    //       }
    //     }
    //   });
    // }
    this.metaService.run();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      ECL.autoInit();
    }
    //Survey Component
    if (environment.survey.enabled && isPlatformBrowser(this.platformId)) {
      const cookieExists: boolean = this.cookieService.check('kohesio.survey');
      if (!cookieExists) {
        setTimeout(() => {
          this.dialog.open(SurveyDialogComponent, {
            disableClose: true,
            autoFocus: false
          });
        }, environment.survey.popupDelaySeconds * 1000);

      }
    }
  }

}
