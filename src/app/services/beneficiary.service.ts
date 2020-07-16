import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Filters} from "../shared/models/filters.model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Beneficiary} from "../shared/models/beneficiary.model";

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

    constructor(private http: HttpClient) { }

    getBeneficiaries(filters:Filters): Observable<Beneficiary[]>  {
        const url = environment.api + "/search/beneficiaries";
        let params = this.buildParameters(filters);
        return this.http.get<any>(url,{ params: <any>params }).pipe(
            map(data => {
                if (!data){
                    return [];
                }else {
                    return data.map(data => {
                        return new Beneficiary().deserialize(data);
                    });
                }
            })
        );
    }

    getFile(filters: Filters, type: string):Observable<any>{
        const url = environment.api + "/search/beneficiaries/" + type;
        let params = this.buildParameters(filters);
        return this.http.get(url,{
            responseType: 'arraybuffer',params:params}
        );
    }

    buildParameters(filters: Filters){
        let params = {};
        for (const filter in filters){
            if (filters[filter] && filter != 'deserialize') {
                if (Array.isArray(filters[filter])) {
                    if (filters[filter].length) {
                        params[filter] = environment.entityURL + filters[filter].toString();
                    }
                }else {
                    if (filter != 'name' && filter != 'region') {
                        params[filter] = environment.entityURL + filters[filter];
                    }else{
                        params[filter] = filters[filter];
                    }
                }
            }
        }
        return params;
    }

}
