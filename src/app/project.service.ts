import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {Project} from "./shared/models/project.model";
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Filters} from "./shared/models/filters.model";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    constructor(private http: HttpClient) { }

    getProjects(filters:Filters): Observable<Project[]>  {
        const fullSearchText = filters && filters.term ?
            '<http://www.openrdf.org/contrib/lucenesail#matches> _:b0 . _:b0 <http://www.openrdf.org/contrib/lucenesail#query>"'+filters.term+'" ; <http://www.openrdf.org/contrib/lucenesail#snippet> ?snippet . ' :
            '<https://linkedopendata.eu/prop/direct/P35> <https://linkedopendata.eu/entity/Q9934>.';

        const queryProjects = 'SELECT DISTINCT ?s0 ?label ?description ?startTime ?euBudget ?image ?coordinates ?objectiveId ?countrycode WHERE { ' +
            '?s0 ' + fullSearchText +
            '{' +
            ' ?s0 rdfs:label ?label.' +
            ' FILTER((LANG(?label)) = "en")' +
            ' }' +
            ' {' +
            ' ?s0 <https://linkedopendata.eu/prop/direct/P836> ?description.' +
            ' FILTER((LANG(?description)) = "en")' +
            ' }' +
            ' { ?s0 <https://linkedopendata.eu/prop/direct/P20> ?startTime. }' +
            ' { ?s0 <https://linkedopendata.eu/prop/direct/P835> ?euBudget. }' +
            ' OPTIONAL { ?s0 <https://linkedopendata.eu/prop/direct/P147> ?image. }' +
            ' OPTIONAL { ?s0 <https://linkedopendata.eu/prop/direct/P851> ?image. }' +
            ' { ?s0 <https://linkedopendata.eu/prop/direct/P127> ?coordinates. }' +
            ' { ?s0 <https://linkedopendata.eu/prop/direct/P888> ?category. }' +
            ' { ?category <https://linkedopendata.eu/prop/direct/P302> ?objective. }' +
            ' { ?objective <https://linkedopendata.eu/prop/direct/P1105> ?objectiveId. }' +
            ' { ?s0 <https://linkedopendata.eu/prop/direct/P32> ?country .}' +
            ' { ?country <https://linkedopendata.eu/prop/direct/P173> ?countrycode .} ' +
            this.generateFilters(filters) +
            '}LIMIT 12';

        const urlProjects =environment.fullTextSearchUrl + '&query=' + encodeURIComponent(queryProjects);

        const httpOptions = {
            headers: new HttpHeaders({
                'Accept':  'application/sparql-results+json'
            })
        };

        return this.http.get<any>(urlProjects,httpOptions).pipe(
            map(data => {
                if (!data || !data.results || !data.results.bindings){
                    return [];
                }else {
                    return data.results.bindings.map(data => {
                        return new Project().deserialize(data);
                    });
                }
            })
        );
    }

    private generateFilters(filters: Filters){
        let filtersQuery = "";
        if (filters){
            if (filters.countries && filters.countries.length > 0){
                filtersQuery += '{';
                for (let i=0; i<filters.countries.length; ++i) {
                    let country = filters.countries[i];
                    let countryCode = country.split(",")[0];
                    filtersQuery += '{?s0 <https://linkedopendata.eu/prop/direct/P32> <https://linkedopendata.eu/entity/Q' + countryCode + '>}';
                    filtersQuery += (filters.countries.length > 1 && i !== filters.countries.length -1) ? ' UNION' : '';
                }
                filtersQuery += '}';
            }
            if (filters.topics && filters.topics.length > 0){
                filtersQuery += '{';
                for (let i=0; i<filters.topics.length; ++i) {
                    let topic = filters.topics[i];
                    filtersQuery += '{?objective <https://linkedopendata.eu/prop/direct/P1105> "' + topic + '"}';
                    filtersQuery += (filters.topics.length > 1 && i !== filters.topics.length -1) ? ' UNION' : '';
                }
                filtersQuery += '}';
            }
        }
        return filtersQuery;
    }

    getFilters(): Promise<any>{
        return new Promise((resolve,reject)=>{
            fetch('assets/data/filters.json')
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
