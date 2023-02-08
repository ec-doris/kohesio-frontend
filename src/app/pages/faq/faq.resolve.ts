import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {EMPTY, Observable} from "rxjs";
import {catchError} from 'rxjs/operators';
import {ListOfOperation} from "../../models/loo.model";
import {ListOfOperationService} from "../../services/list-of-operation.service";


@Injectable({ providedIn: 'root' })
export class FaqPageResolve implements Resolve<ListOfOperation[]> {

  constructor(private service: ListOfOperationService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ListOfOperation[]> {
    return this.service.getListOfOperation().pipe(
      catchError(err => {
        console.error(err);
        this.router.navigate(["/404"]);
        return EMPTY;
      }));
  }
}
