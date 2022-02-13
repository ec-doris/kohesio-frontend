import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {Observable} from "rxjs";
import {catchError} from 'rxjs/operators';
import {BeneficiaryService} from "../../services/beneficiary.service";
import { BeneficiaryProjectList } from '../../models/beneficiary-project-list.model';


@Injectable({ providedIn: 'root' })
export class BeneficiaryProjectListResolver implements Resolve<BeneficiaryProjectList> {

    constructor(private service: BeneficiaryService,
                private router: Router) {}

    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<BeneficiaryProjectList> {
        return this.service.getBeneficiaryProjects(route.paramMap.get('id')).pipe();
            //TODO ECL side effect
            // catchError(err => {
            //     console.error(err);
            //     this.router.navigate(["/404"]);
            //     return Observable.of(null);
            // }));
    }
}