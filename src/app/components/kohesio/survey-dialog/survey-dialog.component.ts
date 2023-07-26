import {Component} from "@angular/core";
import {DialogChildInterface} from "../../ecl/dialog/dialog.child.interface";
import {MatDialogRef} from "@angular/material/dialog";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'survey-dialog',
  templateUrl: 'survey-dialog.component.html',
  styleUrls: ['./survey-dialog.component.scss']
})
export class SurveyDialogComponent{


  hasAcceptedTerms:boolean = false;

  dontAskmeAnymore:boolean = false;

  constructor(public dialogRef: MatDialogRef<SurveyDialogComponent>,
              private cookieService:CookieService) {}
  onActionClick(action:string){
    switch(action) {
      case "close":
        if (this.dontAskmeAnymore){
          this.cookieService.set("kohesio.survey","donotshowagain", {expires: 30})
        }
        this.dialogRef.close();
        break;
      case "ok":
        this.cookieService.set("kohesio.survey","donotshowagain", {expires: 30})
        this.dialogRef.close();
        break;
    }
  }

}
