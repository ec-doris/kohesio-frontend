import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {Observable} from "rxjs";
import {catchError} from 'rxjs/operators';
import {FilterService} from "../../services/filter.service";
import {FiltersApi} from "../../shared/models/filters-api.model";

@Injectable({ providedIn: 'root' })
export class ProjectListResolver implements Resolve<FiltersApi> {

    constructor(private service: FilterService,
                private router: Router) {}

    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<FiltersApi> {
        return this.service.getProjectsFilters().pipe(
            catchError(err => {
                console.error(err);
                this.router.navigate(["/404"]);
                return Observable.of(null);
            }));
    }
}
