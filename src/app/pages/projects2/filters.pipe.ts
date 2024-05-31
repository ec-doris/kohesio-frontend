import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { TranslateService } from '../../services/translate.service';

@Pipe({
  name: 'filters'
})
export class FiltersPipe implements PipeTransform {
  filterMap: any = {
    country: 'countries',
    thematic: 'thematic_objectives',
    fund: 'funds',
    programme: 'programmes',
    status: 'statuses',
    language: 'languages',
    type: 'types',
    year: 'years',
    priority: 'priorities',
    region: 'regions',
    policyObjective: 'policy_objectives',
    theme: 'thematic_objectives',
    town: 'town',
    projectTypes: 'project_types',
    interreg: 'interreg',
    nuts3: 'nuts3',
    startDateAfter: 'start_date_after',
    endDateBefore: 'end_date_before',
    sdg: 'sdg',
  };

  constructor(public service: FilterService, private datePipe: DatePipe, private translateService: TranslateService) {
  }

  getFilterValue(item: { key: string, value: string }, key: string, value: any) {
    const filterItem = [ 'startDateAfter', 'endDateBefore' ].includes(key)
      ? { key, value: this.datePipe.transform(value, 'yyyy-MM-dd') }
      : this.service.filters[this.filterMap[key]]?.find((c: any) => c.id === value);

    return { key: (this.translateService.queryParams[item.key] ?? item.key).toUpperCase(), value: filterItem?.value ?? filterItem?.label };
  }

  transform(value: any): { key: string, value: any }[] {
    if (!value || typeof value !== 'object') {
      return [];
    }
    return Object.keys(value)
      .map(key => ({ key, value: typeof value[key] === 'object' ? value[key]?.id || value[key][0] : value[key] }))
      .filter(item => item.value && item.key != 'language' && item.key != 'interventionField')
      .map(item => this.getFilterValue(item, item.key, item.value));

  }
}
