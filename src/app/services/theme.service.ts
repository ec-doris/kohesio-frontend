import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Theme} from "../models/theme.model";
import { PolicyObjective } from '../models/policy-objective.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

    constructor(private http: HttpClient, @Inject(LOCALE_ID) public locale: string) {}

    getThemes(): Observable<Theme[]> {
        const url = environment.apiBaseUrl + '/thematic_objectives';
        let params = {
          language: this.locale
        };
        return this.http.get<any>(url,{ params: <any>params }).pipe(
          map((data:any[]) => {
            return data.map((theme:any) => {
              return new Theme().deserialize(theme);
            });
          }));
    }

    getPolicyObjectives(): Observable<PolicyObjective[]> {
      const url = environment.apiBaseUrl + '/policy_objectives';
      let params = {
        language: this.locale
      };
      return this.http.get<any>(url,{ params: <any>params }).pipe(
        map((data:any[]) => {
          return data.map((policyObjective:any) => {
            return new PolicyObjective().deserialize(policyObjective);
          });
        }));
    }

}
