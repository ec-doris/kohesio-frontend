import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {environment} from "../../environments/environment";
import {FiltersApi} from "../shared/models/filters-api.model";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

    public filters:FiltersApi;
    private countryGeoJson;

    constructor(private http: HttpClient) { }


    getProjectsFilters(): Observable<FiltersApi>{
        return this.getFilters(
            Observable.forkJoin(
                this.getFilter('thematic_objectives'),
                this.getFilter('policy_objective'),
                this.getFilter('funds'),
                this.getFilter('categoriesOfIntervention'),
                this.getFilter('countries')
            )
        );
    }

    getBeneficiariesFilters(): Observable<FiltersApi>{
        return this.getFilters(
            Observable.forkJoin(
                this.getFilter('funds'),
                this.getFilter('countries')
            )
        );
    }

    getFilters(filtersList): Observable<FiltersApi>{
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

    getFilter(type: string, params = {}):Observable<any>{
        const url = environment.api + '/' + type;
        return this.http.get<any>(url,{ params: <any>params }).pipe(
            map(results => {
                const data = {};
                data[type] = [];
                results.forEach(item=>{
                    data[type].push({
                        id: this.cleanId(item.instance),
                        value: item.instanceLabel
                    });
                })
               return data;
            }));
    }

    private cleanId(id:string){
        return id.replace("https://linkedopendata.eu/entity/", "")
            .replace("fund=", "")
            .replace("to=", "")
            .replace("program=", "")
            .replace("instance=", "");
    }

    getFilterLabel(type:string, key:string) {
        let result = null;
        if (key) {
            const record = this.filters[type].find(filter => {
                return filter.id == key;
            });
            if (record) {
                result = record.value.split(' ').join('-');
            }
        }
       return result;
    }

    getFilterKey(type:string, label:string){
        if (type && label) {
            let result = '';
            const record = this.filters[type].find(filter => {
                label = label.split('-').join('');
                let l = filter.value.split('-').join('');
                l = l.split(' ').join('');
                return l == label;
            });
            if (record) {
                result = record.id;
            }
            return result;
        }else{
            return null;
        }
    }

    getRegions(country: string): Observable<any[]>{
        const urlRegions = environment.api + '/regions';
        let params = {
            country: 'https://linkedopendata.eu/entity/' + country
        };
        return this.http.get<any>(urlRegions,{ params: <any>params }).pipe(
            map(data => {
                if (!data){
                    return [];
                }else {
                    const regions = data.map(data => {
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

}
