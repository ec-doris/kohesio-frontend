import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { SharedModule } from '../../../../shared/shared.module';
import { FilterService } from '../../../services/filter.service';
import { TranslateService } from '../../../services/translate.service';
import { FiltersPipe } from '../../projects2/filters.pipe';

@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [ SharedModule ],
  templateUrl: './filter-chips.component.html',
  styleUrl: './filter-chips.component.scss',
})
export class FilterChipsComponent implements OnInit {
  chips: Record<string, any> = {};
  private destroyRef = inject(DestroyRef);
  private lastFiltersSearch = {};

  constructor(
    private filterService: FilterService,
    public translateService: TranslateService,
    private route: ActivatedRoute,
    private filtersPipe: FiltersPipe
  ) {
  }

  ngOnInit(): void {
    this.filterService.showResult$$.pipe(
      tap(({ filters }) => this.lastFiltersSearch = filters),
      map(({ filters }) => this.filterFilters(filters)),
      map(x => {
        return x.reduce((result: Record<string, any>, [ key, value ]: [ string, any ]) => {
          const filterValue = this.filtersPipe.getFilterValue({ key, value }, key, value);
          result[filterValue.key] = filterValue.value;
          return result;
        }, {});
      }),
      takeUntilDestroyed(this.destroyRef))
      .subscribe(chips => this.chips = chips);

    this.route.queryParams.pipe(
      map((params) => this.filterFilters(params)),
      map(params => {
        return params
          .reduce((result: Record<string, any>, [ key, value ]) => {
            result[this.translateService.queryParams[key]] = value;
            return result;
          }, {});
      }),
      take(1)
    ).subscribe(chips => this.chips = chips);
  }


  removeChip(filter: { key: string; value: any }) {
    const words = filter.key.toLowerCase().split(' ');
    let key = words[0];
    if (words.length === 2) {
      key = words[0] + words[1].charAt(0).toUpperCase() + words[1].slice(1);
    }
    const translatedKey = Object.fromEntries(Object.entries(this.translateService.queryParams)
      .map(([ key, value ]: [ string, any ]) => [ value.toLowerCase(), key ]))[key.toLowerCase()];

    this.filterService.removeFilter(translatedKey == 'programme' ? 'program' : translatedKey, this.lastFiltersSearch);
  }

  private filterFilters(params: any): [ string, any ][] {
    return Object.entries(params)
      .filter(([ key, value ]) =>
        key !== 'language' &&
        key !== 'sort' &&
        key !== 'orderStartDate' &&
        key !== 'orderEndDate' &&
        key !== 'orderTotalBudget' &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0)
      );
  }
}
