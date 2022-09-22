import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {EMPTY, Observable} from "rxjs";
import {catchError} from 'rxjs/operators';
import {FilterService} from "../../services/filter.service";
import {FiltersApi} from "../../models/filters-api.model";

@Injectable({ providedIn: 'root' })
export class MapPageResolve implements Resolve<FiltersApi> {

    constructor(private service: FilterService,
                private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FiltersApi> {
      return this.service.getMapFilters().pipe(
        catchError(err => {
          console.error(err);
          this.router.navigate(["/404"]);
          return EMPTY;
        }));
    }
}
