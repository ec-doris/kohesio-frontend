import { Injectable } from '@angular/core';
import {BeneficiaryDetail} from "../../models/beneficiary-detail.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {EMPTY, Observable} from "rxjs";
import {catchError} from 'rxjs/operators';
import {BeneficiaryService} from "../../services/beneficiary.service";

@Injectable({ providedIn: 'root' })
export class BeneficiaryDetailResolver implements Resolve<BeneficiaryDetail> {

    constructor(private service: BeneficiaryService,
                private router: Router) {}

    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<BeneficiaryDetail> {
        return this.service.getBeneficiaryDetail(route.paramMap.get('id')).pipe(
            catchError(err => {
                console.error(err);
                this.router.navigate(["/404"]);
                return EMPTY;
            }));
    }
}
