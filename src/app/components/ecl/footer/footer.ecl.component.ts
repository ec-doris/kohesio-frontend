import {AfterViewInit, Component, Inject, LOCALE_ID} from '@angular/core';
import {TranslateService} from "../../../services/translate.service";

@Component({
    selector: 'app-ecl-footer',
    templateUrl: './footer.ecl.component.html',
    styleUrls: ['./footer.ecl.component.scss']
})

export class FooterEclComponent implements AfterViewInit {


    constructor(public translateService: TranslateService,
                @Inject(LOCALE_ID) public locale: string){}

    ngOnInit(){
    }

    ngAfterViewInit(): void {
    }

}
