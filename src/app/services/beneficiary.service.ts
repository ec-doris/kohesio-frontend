import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Filters} from "../models/filters.model";
import { filter, Observable, throwError } from 'rxjs';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {BeneficiaryList} from "../models/beneficiary-list.model";
import {BeneficiaryDetail} from "../models/beneficiary-detail.model";
import { BeneficiaryProjectList } from '../models/beneficiary-project-list.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

    constructor(private http: HttpClient,@Inject(LOCALE_ID) public locale: string) { }

  getBeneficiaries(filters: Filters, offset: number = 0, limit: number = 15): Observable<BeneficiaryList> {
    const url = environment.api + '/beneficiaries';
    const params = this.generateParameters(filters.getBeneficiariesFilters(), offset, limit);
    return this.http.get<any>(url, { params: <any>params }).pipe(filter(x => !!x),
      map(data => {
        return new BeneficiaryList().deserialize(data);
      })
    );
  }

    generateParameters(filters:any, offset: number = 0, limit: number = 15){
        let params = {};
        if (limit !== -1){
            params = {
                offset: offset,
                limit: limit
            };
        }
        params = Object.assign(
            params,
            filters,
          {language: this.locale});
        return params;
    }

    getFile(filters: Filters, type: string):Observable<any>{
        const url = environment.api + "/beneficiaries/download/" + type;
        let params:any = filters.getBeneficiariesFilters();
        params.language = this.locale;
        return this.http.get(url,{
            responseType: 'arraybuffer',
            params:<any>params
        });
    }

    getBeneficiaryDetail(id: string | null): Observable<BeneficiaryDetail> {
        const url = environment.api + '/beneficiaries/' + id;
        let params = {
          language:this.locale,
          id: environment.entityURL + id
        };
        return this.http.get<any>(url, { params: <any>params }).pipe(
            map((data:any) => {
                return new BeneficiaryDetail().deserialize(data);
            }));
    }

    getBeneficiaryProjects(id: string | null, pageIndex:number = 0): Observable<BeneficiaryProjectList> {
        const url = environment.api + '/beneficiaries/'+id+'/projects';
        let params = {
            id: environment.entityURL + id,
            page: pageIndex,
            pageSize: 15,
            language: this.locale
        };
        return this.http.get<any>(url, { params: <any>params }).pipe(
            map((data:any) => {
                return new BeneficiaryProjectList().deserialize(data);
            }));
    }

}
