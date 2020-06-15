import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Project} from "../shared/models/project.model";
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Filters} from "../shared/models/filters.model";
import {environment} from "../../environments/environment";
import {ProjectDetail} from "../shared/models/project-detail.model";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

    private filters:any;

    constructor(private http: HttpClient) { }

    getFilters(): Promise<any>{
        return new Promise((resolve, reject) => {
            if (this.filters) {
                resolve(this.filters);
            }else {
                fetch('assets/data/filters.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("HTTP error " + response.status);
                        }
                        return response.json();
                    })
                    .then(json => {
                        this.filters = json;
                        resolve(json);
                    })
                    .catch(function () {
                        reject("error getting filters");
                    });
            }
        });
    }

    getFilterLabel(type:string, key:string) {
        let result = null;
        if (key) {
            const record = this.filters[type].find(filter => {
                const k = filter[0].split(',')[0];
                return k == key;
            });
            if (record) {
                result = record[1].split(' ').join('-');
            }
        }
       return result;
    }

    getFilterKey(type:string, label:string){
        let result = '';
        const record = this.filters[type].find(filter=>{
            label = label.split('-').join('');
            let l = filter[1].split('-').join('');
            l = l.split(' ').join('');
            return l == label;
        });
        if (record){
            result = record[0].split(",")[0];
        }
        return result;
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
                        const key = data.region.replace("region=https://linkedopendata.eu/entity/", "") + "," + country
                        return [
                            data.region.replace("region=https://linkedopendata.eu/entity/", ""),
                            data.name
                        ];
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
            const record = this.filters.themes.find(filter => {
                const k = filter[0].split(',')[1];
                return k == key;
            });
            if (record) {
                result = record[1];
            }
        }
        return result;
    }

    getCountryGeoJson(): Promise<any>{
        return new Promise((resolve, reject) => {
            fetch('assets/data/countriesGeoJson.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error("HTTP error " + response.status);
                    }
                    return response.json();
                })
                .then(json => {
                    resolve(json);
                })
                .catch(function () {
                    reject("error getting filters");
                });
        });
    }

}
