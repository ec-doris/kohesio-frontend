import {AfterViewInit, Component, Inject, Input} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Component({
    selector: 'app-share-block',
    templateUrl: './share-block.component.html',
    styleUrls: ['./share-block.component.scss']
})

export class ShareBlockComponent implements AfterViewInit {

  @Input()
  public id:string | undefined;

  public currentUrl: string = (this._document.location.protocol + '//' + this._document.location.hostname) +
    (this._document.location.port != "" ? ':' + this._document.location.port : '');

    constructor(@Inject(DOCUMENT) private _document: Document){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
    }

    reportDataBug(){
      const to:string = "REGIO-KOHESIO@ec.europa.eu";
      const subject:string = "Reporting error or duplicate";
      let location:string = window.location.toString();
      //If in the end there is no the QID, it means that comes from the homepage
      if (this.id && !location.endsWith(this.id)){
        location += "projects/"+this.id;
      }
      const body:string = "Please describe the error or the duplicate with the URLs: " + location;
      //window.location.href=`mailto:${to}?subject=${subject}&body=${body}`
      window.open(`mailto:${to}?subject=${subject}&body=${body}`, 'mail');
    }

}
