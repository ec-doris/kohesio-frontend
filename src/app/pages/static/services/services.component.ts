import {AfterViewInit, Component} from '@angular/core';
import {TranslateService} from "../../../services/translate.service";

@Component({
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss']
})
export class ServicesPageComponent implements AfterViewInit {


    constructor(public translateService:TranslateService){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
    }

}
