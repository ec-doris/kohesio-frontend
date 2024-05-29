import { Pipe, PipeTransform } from '@angular/core';
import { FilterService } from '../../services/filter.service';

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
  };

  constructor(public service: FilterService) {
  }

  getFilterValue(item: { key: string, value: string }, key: string, value: any) {
    const filterItem = this.service.filters[this.filterMap[key]]?.find((c: any) => c.id === value);
    return { key: item.key, value: filterItem?.value ?? filterItem?.label };
  }

  transform(value: any): { key: string, value: any }[] {
    if (!value || typeof value !== 'object') {
      return [];
    }
    return Object.keys(value)
      .map(key => ({ key, value: typeof value[key] === 'object' ? value[key].id : value[key] }))
      .filter(item => item.value && item.key != 'language')
      .map(item => this.getFilterValue(item, item.key, item.value));

  }
}
