import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {EMPTY, forkJoin, Observable} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import {ListOfOperation} from "../../models/loo.model";
import {ListOfOperationService} from "../../services/list-of-operation.service";
import {FilterService} from "../../services/filter.service";


@Injectable({ providedIn: 'root' })
export class FaqPageResolve implements Resolve<ListOfOperation[]> {

  constructor(private looService: ListOfOperationService,
              private filterService: FilterService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ListOfOperation[]> {
    return this.getData().pipe(
      catchError(err => {
        console.error(err);
        this.router.navigate(["/404"]);
        return EMPTY;
      }));
  }

  getData(): Observable<any>{
      return forkJoin([
        this.filterService.getFilter('countries'),
      ]).pipe(
        map((data:any)=>{
          return {
            countries: data[0].countries
          };
        })
      );
  }

}
