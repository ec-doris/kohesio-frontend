import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { map } from 'rxjs/operators';
import { Theme } from 'src/app/models/theme.model';
import { ThemeService } from 'src/app/services/theme.service';
import { FilterService } from '../../../services/filter.service';
import { TranslateService } from '../../../services/translate.service';

@Component({
  templateUrl: './themes.component.html',
  styleUrls: [ './themes.component.scss' ]
})
export class ThemesComponent implements OnInit {
  themes: Theme[] = [];
  themeColors: any = {
    TO01: { color: 'blue', pId: 'PO01' },
    TO02: { color: 'blue', pId: 'PO01' },
    TO03: { color: 'blue', pId: 'PO01' },
    TO04: { color: 'green', pId: 'PO02' },
    TO05: { color: 'green', pId: 'PO02' },
    TO06: { color: 'green', pId: 'PO02' },
    TO07: { color: 'green', pId: 'PO03' },
    TO08: { color: 'yellow', pId: 'PO04' },
    TO09: { color: 'yellow', pId: 'PO04' },
    TO10: { color: 'yellow', pId: 'PO04' },
    TO11: { color: 'yellow', pId: 'PO04' },
    TO12: { color: 'grey', pid: '' },
    TO13: { color: 'grey', pid: '' }
  };
  private policyObjectives: any;
  private test: any;

  constructor(private themeService: ThemeService, public translateService: TranslateService, private filterService: FilterService) {
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
    this.filterService.getFilter('policy_objectives').subscribe(data=>this.test = data);
    this.themeService.getPolicyObjectives()
      .pipe(
        map(policyObjectives => policyObjectives.reduce((acc, obj:any) => ({ ...acc, [obj.id]: obj }), {})),
        filter(policyObjectives => !!Object.keys(policyObjectives).length))
      .subscribe(policy => this.policyObjectives = policy);
  }

  getQueryParams(theme: Theme): any {
    const sort = $localize`:@@translate.filter.sortBeneficiaries.totalBudgetDesc:Total Budget (descending)`.split(' ').join('-');
    return {
      [this.translateService.queryParams.theme]: theme.instanceLabel.split(' ').join('-'),
      [this.translateService.queryParams.sort]: sort,
      [this.translateService.queryParams.policyObjective]: this.policyObjectives[this.themeColors[theme.id].pId]?.instanceLabel.split(' ').join('-')

    };
  }

}
