import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Filters} from "../shared/models/filters.model";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Beneficiary} from "../shared/models/beneficiary.model";
import {BeneficiaryList} from "../shared/models/beneficiary-list.model";
import {ProjectDetail} from "../shared/models/project-detail.model";
import {BeneficiaryDetail} from "../shared/models/beneficiary-detail.model";
import { ConfigService } from './config.service';
import { BeneficiaryProjectList } from '../shared/models/beneficiary-project-list.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getBeneficiaries(filters:Filters, offset: number = 0, limit: number = 15): Observable<BeneficiaryList>  {
        const url = this.configService.apiBaseUrl + "/search/beneficiaries";
        const params = this.generateParameters(filters.getBeneficiariesFilters(), offset, limit);
        return this.http.get<any>(url,{ params: <any>params }).pipe(
            map(data => {
                if (!data){
                    return null;
                }else {
                    return new BeneficiaryList().deserialize(data);
                }
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
            filters);
        return params;
    }

    getFile(filters: Filters, type: string):Observable<any>{
        const url = this.configService.apiBaseUrl + "/search/beneficiaries/" + type;
        const params = filters.getBeneficiariesFilters();
        return this.http.get(url,{
            responseType: 'arraybuffer',
            params:<any>params
        });
    }

    getBeneficiaryDetail(id: string): Observable<BeneficiaryDetail> {
        const url = this.configService.apiBaseUrl + '/beneficiary';
        let params = {
            id: environment.entityURL + id
        };
        return this.http.get<any>(url, { params: <any>params }).pipe(
            map(data => {
                if (!data){
                    throwError('Data is inconsistent');
                }else {
                    return new BeneficiaryDetail().deserialize(data);
                }
            })
        );
    }
    getBeneficiaryProjects(id: string, pageIndex:number = 0): Observable<BeneficiaryProjectList> {
        const url = this.configService.apiBaseUrl + '/beneficiary/project';
        let params = {
            id: environment.entityURL + id,
            page: pageIndex,
            pageSize: 15
        };
        return this.http.get<any>(url, { params: <any>params }).pipe(
            map(data => {
                if (!data){
                    throwError('Data is inconsistent');
                }else {
                    return new BeneficiaryProjectList().deserialize(data);
                }
            })
        );
    }

}
