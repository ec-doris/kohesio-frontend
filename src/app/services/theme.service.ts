import { Injectable } from '@angular/core';
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

    constructor(private http: HttpClient) {
    }

    getThemes(): Observable<Theme[]> {
        const url = environment.apiBaseUrl + '/thematic_objectives';
        return this.http.get<any>(url).pipe(
          map((data:any[]) => {
            return data.map((theme:any) => {
              return new Theme().deserialize(theme);
            });
          }));
    }

    getPolicyObjectives(): Observable<PolicyObjective[]> {
      const url = environment.apiBaseUrl + '/policy_objectives';
      return this.http.get<any>(url).pipe(
        map((data:any[]) => {
          return data.map((policyObjective:any) => {
            return new PolicyObjective().deserialize(policyObjective);
          });
        }));
    }

}
