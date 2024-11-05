import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService {

    constructor(private http: HttpClient, @Inject(LOCALE_ID) public locale: string) {}

    getProjectsData(): Observable<string[]> {
        const url = environment.api + '/data/projects';
        return this.http.get<any>(url).pipe(
          map((data:string[]) => {
            return data;
          }));
    }

  getBeneficiariesData(): Observable<string[]> {
    const url = environment.api + '/data/beneficiaries';
    return this.http.get<any>(url).pipe(
      map((data:string[]) => {
        return data;
      }));
  }

  getNutsData(): Observable<string[]> {
    const url = environment.api + '/data/nuts';
    return this.http.get<any>(url).pipe(
      map((data:string[]) => {
        return data;
      }));
  }

}
