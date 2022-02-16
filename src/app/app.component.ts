import { Component } from '@angular/core';
declare let ECL:any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kohesio-frontend';
  public breadcrumbs: any; 

  ngOnInit(){
    ECL.autoInit();
  }

}
