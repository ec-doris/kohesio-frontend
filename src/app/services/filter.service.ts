import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AutoCompleteItem } from '../components/kohesio/auto-complete/item.model';
import { FiltersApi } from '../models/filters-api.model';
import { Filters } from '../models/filters.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  showResult: Subject<any> = new Subject();
  public filters: any;
  private countryGeoJson: any;

    constructor(private http: HttpClient,@Inject(LOCALE_ID) public locale: string, private datePipe: DatePipe) { }


    getProjectsFilters(): Observable<FiltersApi>{
        return this.getFilters(
            forkJoin([
                this.getFilter('thematic_objectives'),
                this.getFilter('policy_objectives'),
                this.getFilter('funds'),
                this.getFilter('categoriesOfIntervention'),
                this.getFilter('countries'),
                this.getFilter('nuts3'),
                this.getFilter('project_types')
            ])
        );
    }

    getBeneficiariesFilters(): Observable<FiltersApi>{
        return this.getFilters(
            forkJoin([
                this.getFilter('funds'),
                this.getFilter('countries')
            ])
        );
    }

    getMapFilters(): Observable<FiltersApi>{
      return this.getFilters(
        forkJoin([
          this.getFilter('countries')
        ])
      );
    }

    getFilters(filtersList: any): Observable<FiltersApi>{
        return filtersList.pipe(
            map((data:any[]) => {
                let obj = {};
                data.forEach(d=>{
                   obj = {
                       ...obj,
                       ...d
                   }
                });
                this.filters = new FiltersApi().deserialize(obj);
                return this.filters;
            })
        );
    }

    getFilter(type: any, params:any = {}):Observable<any>{
        const url = environment.api + '/queries/' + type;
        if (!params || !params.language) {
          params.language = this.locale;
        }
        return this.http.get<any>(url,{ params: <any>params }).pipe(
            map(results => {
                const data:any = {};
                data[type] = [];
                results.forEach((item:any)=>{
                    if (item.instance){
                        data[type].push({
                            id: this.cleanId(item.instance),
                            value: item.instanceLabel ? item.instanceLabel : item.name
                        });
                    }else{
                        data[type].push(item);
                    }
                })
               return data;
            }));
    }

    private cleanId(id:string){
        if (id){
        return id.replace("https://linkedopendata.eu/entity/", "")
            .replace("fund=", "")
            .replace("to=", "")
            .replace("program=", "")
            .replace("instance=", "");
        }else{
            return null
        }
    }

    getFilterLabel(type:string, key:string, rawLabel:boolean = false) {
        let result = null;
        if (key) {
            let record = this.filters[type].find((filter:any) => {
                if (filter.id){
                    return filter.id == key;
                }else if (filter.subItems){
                    return filter.subItems.find((filterLevel:any)=>{
                        return filterLevel.id == key;
                    });
                }
            });
            if (record && record.subItems){
                record = record.subItems.find((filter:any)=>{
                    return filter.id == key;
                });
            }
            if (record) {
                const value = record.shortValue ? record.shortValue : record.value;
                if (rawLabel){
                  result = value;
                }else {
                  result = value.split(' ').join('-');
                }
            }
        }
       return result;
    }

    getFilterKey(type:string, label:string | null){
        if (type && label && this.filters[type]) {
            label = label.split('-').join('');
            let result:any;
            this.filters[type].forEach((filter:any) => {
                if (filter.subItems){
                    filter.subItems.forEach((sub:any) => {
                        let l = sub.shortValue ? this.harmonizeShortLabel(sub.shortValue) : this.harmonizeLabel(sub.fullValue ? sub.fullValue : sub.value);
                        if(l == label){
                            result = sub;
                            return;
                        }
                    });
                    if (result){
                        return;
                    }
                }else{
                    let l = filter.value ? this.harmonizeLabel(filter.value) : this.harmonizeLabel(filter.label);
                    if(l == label){
                        if (type == 'nuts3'){
                          result = filter
                        }else{
                          result = filter.id;
                        }
                        return;
                    }
                }
            });
            return result;
        }else{
            return null;
        }
    }

    harmonizeLabel(label: string){
        let l = label.split('-').join('');
        l = l.split(' ').join('');
        return l;
    }

    harmonizeShortLabel(label: string){
        let l = label.split('-')[0].trim();
        return l;
    }

    getRegions(country: string): Observable<any[]>{
        const urlRegions = environment.api + '/queries/regions';
        let params = {
            language: this.locale,
            country: 'https://linkedopendata.eu/entity/' + country
        };

        return this.http.get<any>(urlRegions,{ params: <any>params }).pipe(
            map(data => {
                if (!data){
                    return [];
                }else {
                    const regions = data.map((data:any) => {
                        return {
                            id: this.cleanId(data.region),
                            value: data.name
                        };
                    });
                    this.filters.regions = regions;
                    return regions;
                }
            })
        );
    }

    getThemeLabel(key:string) {
        let result = null;
        if (key) {
            const record:any = this.filters.thematic_objectives.find((filter:any) => {
                return filter.pk == key;
            });
            if (record) {
                result = record.value;
            }
        }
        return result;
    }

    getCountryGeoJson(): Promise<any>{
        return new Promise((resolve, reject) => {
            if (this.countryGeoJson) {
                resolve(this.countryGeoJson);
            }else {
                fetch('assets/data/countriesGeoJson.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("HTTP error " + response.status);
                        }
                        return response.json();
                    })
                    .then(json => {
                        this.countryGeoJson = json;
                        resolve(json);
                    })
                    .catch(function () {
                        reject("error getting filters");
                    });
            }
        });
    }

    getFilterLabelByLabel(type:string, label:string):Promise<string>{
      return new Promise((resolve, reject) => {
        const filterType:any = {
          "theme":"thematic_objectives",
          "policyObjective":"policy_objectives",
          "fund":"funds",
          "interventionField":"categoriesOfIntervention",
          "country":"countries",
          "region":"regions"
        }
        if (type == "interventionField"){
          let labels:string[] = label.split(",");
          let observables:any[] = [];
          labels.forEach((lbl:string)=>{
            let keyId = this.getFilterKey(filterType[type], lbl).id;
            observables.push(this.getKohesioCategory(keyId));
          })
          forkJoin(observables).subscribe((results:any[])=>{
            let data:string[] = [];
            results.forEach(result=>{
              data.push(result.instanceLabel);
            })
            resolve(data.toString());
          })
        }else{
          let key = this.getFilterKey(filterType[type], label);
          resolve(this.getFilterLabel(filterType[type],key, true));
        }
      });
    }

  getKohesioCategory(interventionFieldId: string): Observable<any[]>{
    const url = environment.api + '/queries/kohesio_categories';
    let params = {
      language: this.locale,
      interventionField: 'https://linkedopendata.eu/entity/' + interventionFieldId
    };

    return this.http.get<any>(url,{ params: <any>params }).pipe(
      map(data => {
        if (data && data.length) {
          return data[0];
        }else{
          return undefined;
        }
      })
    );
  }
  getFormFilters(form: any){
    const formValues = { ...form.value }; // Use spread operator for shallow copy

    if (formValues.interventionField?.length) {
      formValues.interventionField = formValues.interventionField.map((item: AutoCompleteItem) => item.id);
    }

    formValues.nuts3 = formValues.nuts3?.id || undefined;
    formValues.projectStart = formValues.projectStart ? this.datePipe.transform(formValues.projectStart, 'yyyy-MM-dd') : undefined;
    formValues.projectEnd = formValues.projectEnd ? this.datePipe.transform(formValues.projectEnd, 'yyyy-MM-dd') : undefined;


    return new Filters().deserialize(formValues);
  }

  removeFilter(filterKey: string, lastFiltersSearch: any): any {
    const actions:any = {
      country: () => {
        lastFiltersSearch.region = undefined;
        lastFiltersSearch.nuts3 = undefined;
        lastFiltersSearch.program = undefined;
        lastFiltersSearch.priority_axis = undefined;
      },
      region: () => {
        lastFiltersSearch.nuts3 = undefined;
        lastFiltersSearch.program = undefined;
      },
      theme: () => lastFiltersSearch.policyObjective = undefined,
      'policy objective': () => {
        lastFiltersSearch.theme = undefined;
        lastFiltersSearch.policyObjective = undefined;
      },
      fund: () => lastFiltersSearch.program= undefined,
      interreg: () => lastFiltersSearch.program = undefined,
      program: () => lastFiltersSearch.priority_axis = undefined,
      sdg: () => lastFiltersSearch.interventionField = undefined,
      interventionField: () => lastFiltersSearch.interventionField = [],
      totalProjectBudget: () => {
        lastFiltersSearch.budgetBiggerThan = undefined;
        lastFiltersSearch.budgetSmallerThan = undefined;
      },
      amountEUSupport: () => {
        lastFiltersSearch.budgetEUBiggerThan = undefined;
        lastFiltersSearch.budgetEUSmallerThan = undefined;
      },
      projectStart: () => lastFiltersSearch.startDateAfter = undefined,
      projectEnd: () => lastFiltersSearch.endDateBefore = undefined
    };

    if (actions[filterKey.toLowerCase()]) {
      actions[filterKey.toLowerCase()]();
    }

    lastFiltersSearch[filterKey.toLowerCase()] = undefined;
    this.showResult.next(new Filters().deserialize(lastFiltersSearch));
  }

}
