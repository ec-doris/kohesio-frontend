import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    constructor(private http: HttpClient) { }

    getProjects() {
        const queryProjects = 'SELECT DISTINCT ?s0 ?label ?description ?startTime ?euBudget ?image ?coordinates ?objectiveId ?countrycode WHERE { ' +
            '  ?s0 <https://linkedopendata.eu/prop/direct/P35> <https://linkedopendata.eu/entity/Q9934>. ' +
            '  { ' +
            '    ?s0 rdfs:label ?label. ' +
            '    FILTER((LANG(?label)) = "en") ' +
            '  }' +
            '  {' +
            '    ?s0 <https://linkedopendata.eu/prop/direct/P836> ?description. ' +
            '    FILTER((LANG(?description)) = "en")' +
            '  }' +
            '  { ?s0 <https://linkedopendata.eu/prop/direct/P20> ?startTime. } ' +
            '  { ?s0 <https://linkedopendata.eu/prop/direct/P835> ?euBudget. }' +
            '  OPTIONAL { ?s0 <https://linkedopendata.eu/prop/direct/P147> ?image. }' +
            '  OPTIONAL { ?s0 <https://linkedopendata.eu/prop/direct/P851> ?image. }' +
            '  { ?s0 <https://linkedopendata.eu/prop/direct/P127> ?coordinates. }' +
            '  { ?s0 <https://linkedopendata.eu/prop/direct/P888> ?category. }' +
            '  { ?category <https://linkedopendata.eu/prop/direct/P302> ?objective. }' +
            '  { ?objective <https://linkedopendata.eu/prop/direct/P1105> ?objectiveId. }' +
            '  { ?s0 <https://linkedopendata.eu/prop/direct/P32> ?country .}' +
            '  { ?country <https://linkedopendata.eu/prop/direct/P173> ?countrycode .}' +
            //generateFilters() +
            '}' +
            'LIMIT 12';
        const urlProjects = encodeURI('api/bigdata/namespace/wdq/sparql?query=' + queryProjects);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/sparql-results+json'
            })
        };

        return this.http.get(urlProjects, httpOptions);
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
