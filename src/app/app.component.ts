import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
declare let ECL:any;
declare let $wt:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kohesio-frontend';

  count:number = 0;
  lastPage:string = "";

  constructor(public router:Router){

  }

  ngOnInit(){
    ECL.autoInit();

    this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd){
        if ($wt && $wt.analytics.isTrackable()){
          if (this.count>0 && this.lastPage != value.url){
            console.log("tracked");
            $wt.trackPageView();
          }
          this.count++;
          this.lastPage = value.url;
          
        }
      }
    });
  }

}
