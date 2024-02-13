import {AfterViewInit, Component} from '@angular/core';
import {TranslateService} from "../../../services/translate.service";

@Component({
    templateUrl: './accessibility.component.html',
    styleUrls: ['./accessibility.component.scss']
})
export class AccessibilityPageComponent implements AfterViewInit {


    constructor(public translateService: TranslateService){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
    }

}
