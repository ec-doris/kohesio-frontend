import {AfterViewInit, Component} from '@angular/core';
import { Theme } from 'src/app/models/theme.model';
import { ThemeService } from 'src/app/services/theme.service';
import {TranslateService} from "../../../services/translate.service";

@Component({
    templateUrl: './themes.component.html',
    styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements AfterViewInit {

    public themes: Theme[] = [];

    public themeColors:any =  {
        TO01 : "blue",
        TO02 : "blue",
        TO03 : "blue",
        TO04 : "green",
        TO05 : "green",
        TO06 : "green",
        TO07 : "green",
        TO08 : "yellow",
        TO09 : "yellow",
        TO10 : "yellow",
        TO11 : "yellow",
        TO12 : "grey"
    }

    constructor(private themeService: ThemeService,
                public translateService: TranslateService){}

    ngOnInit(){
        this.themeService.getThemes().subscribe((response) => {
            if (response) {
                const themes: Theme[] = response.map((theme:any) => {
                    return new Theme().deserialize(theme);
                });
                this.themes = themes;
            }
        })
    }

    ngAfterViewInit(): void {
    }

}
