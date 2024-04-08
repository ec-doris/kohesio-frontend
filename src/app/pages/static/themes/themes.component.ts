import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { map } from 'rxjs/operators';
import { Theme } from 'src/app/models/theme.model';
import { ThemeService } from 'src/app/services/theme.service';
import { TranslateService } from '../../../services/translate.service';

@Component({
  templateUrl: './themes.component.html',
  styleUrls: [ './themes.component.scss' ]
})
export class ThemesComponent implements OnInit {
  themes: Theme[] = [];
  themeColors: any = {
    TO01: 'blue',
    TO02: 'blue',
    TO03: 'blue',
    TO04: 'green',
    TO05: 'green',
    TO06: 'green',
    TO07: 'green',
    TO08: 'yellow',
    TO09: 'yellow',
    TO10: 'yellow',
    TO11: 'yellow',
    TO12: 'grey',
    TO13: 'grey'
  };
  private policyObjectives: any;

  constructor(private themeService: ThemeService, public translateService: TranslateService) {
  }

  ngOnInit() {
    this.themeService.getThemes().subscribe((response) => {
      if (response) {
        const themes: Theme[] = response.map((theme: any) => {
          return new Theme().deserialize(theme);
        });
        this.themes = themes;
      }
    });
    this.themeService.getPolicyObjectives()
      .pipe(
        map(policyObjectives => policyObjectives.reduce((acc, obj) => ({ ...acc, ['T' + obj.id.slice(1)]: obj }), {})),
        filter(policyObjectives => !!Object.keys(policyObjectives).length))
      .subscribe(policy => this.policyObjectives = policy);
  }

  getQueryParams(theme: Theme): any {
    const sort = $localize`:@@translate.filter.sortBeneficiaries.totalBudgetDesc:Total Budget (descending)`.split(' ').join('-');
    return {
      [this.translateService.queryParams.theme]: theme.instanceLabel.split(' ').join('-'),
      [this.translateService.queryParams.sort]: sort,
      [this.translateService.queryParams.policyObjective]: this.policyObjectives[theme.id].instanceLabel.split(' ').join('-')

    };
  }

}
