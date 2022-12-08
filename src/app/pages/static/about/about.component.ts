import {AfterViewInit, Component} from '@angular/core';
import {TranslateService} from "../../../services/translate.service";

@Component({
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {


    constructor(public translateService: TranslateService){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
    }

}
