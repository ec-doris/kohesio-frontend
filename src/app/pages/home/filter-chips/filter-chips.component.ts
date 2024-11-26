import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs/operators';
import { SharedModule } from '../../../../shared/shared.module';
import { FilterService } from '../../../services/filter.service';
import { TranslateService } from '../../../services/translate.service';

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
  private lastFiltersSearch= {};

  constructor(private filterService: FilterService, public translateService: TranslateService,) {
  }

  ngOnInit(): void {
    this.filterService.showResult$$.pipe(
      tap(({ filters }) => this.lastFiltersSearch = filters),
      map(x => {
        return Object.entries(x.filters)
          .filter(([ key, value ]) => key !== 'language' && value !== undefined && !(Array.isArray(value) && value.length === 0))
          .reduce((result: Record<string, any>, [ key, value ]) => {
            result[key] = value;
            return result;
          }, {});
      }),
      takeUntilDestroyed(this.destroyRef))
      .subscribe(chips => this.chips = chips);
  }


  removeChip(filter: { key: string; value: any }) {
    const words = filter.key.toLowerCase().split(' ');
    let key = words[0];
    if (words.length === 2) {
      key = words[0] + words[1].charAt(0).toUpperCase() + words[1].slice(1);
    }
    const translatedKey = Object.fromEntries(Object.entries(this.translateService.queryParams)
      .map(([ key, value ]: [string, any]) => [ value.toLowerCase(), key ]))[key];

    this.filterService.removeFilter(translatedKey == 'programme' ? 'program' : translatedKey, this.lastFiltersSearch);
  }
}
