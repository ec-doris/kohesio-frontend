import {AfterViewInit, Component} from '@angular/core';
import {TranslateService} from "../../../services/translate.service";

@Component({
    selector: 'app-ecl-footer',
    templateUrl: './footer.ecl.component.html',
    styleUrls: ['./footer.ecl.component.scss']
})

export class FooterEclComponent implements AfterViewInit {


    constructor(public translateService: TranslateService){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
    }

}
