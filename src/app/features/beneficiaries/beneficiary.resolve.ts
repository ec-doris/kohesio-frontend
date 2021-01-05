import { Injectable } from '@angular/core';
import {ProjectDetail} from "../../shared/models/project-detail.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {Observable} from "rxjs";
import {catchError} from 'rxjs/operators';
import {BeneficiaryService} from "../../services/beneficiary.service";

@Injectable({ providedIn: 'root' })
export class BeneficiaryDetailResolver implements Resolve<ProjectDetail> {

    constructor(private service: BeneficiaryService,
                private router: Router) {}

    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<ProjectDetail> {
        return this.service.getBeneficiaryDetail(route.paramMap.get('id')).pipe(
            catchError(err => {
                console.error(err);
                this.router.navigate(["/404"]);
                return Observable.of(null);
            }));
    }
}
