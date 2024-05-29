import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FiltersApi } from '../../models/filters-api.model';
import { FilterService } from '../../services/filter.service';

@Injectable({ providedIn: 'root' })
export class ProjectListResolver implements Resolve<FiltersApi> {

  constructor(private service: FilterService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FiltersApi> {

    return this.service.getProjectsFilters().pipe(
      catchError(err => {
        console.error(err);
        this.router.navigate([ '/404' ]);
        return EMPTY;
      }));
  }
}
