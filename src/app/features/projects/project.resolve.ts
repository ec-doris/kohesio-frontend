import { Injectable } from '@angular/core';
import {ProjectDetail} from "../../shared/models/project-detail.model";
import {ProjectService} from "../../services/project.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {Observable} from "rxjs";
import {catchError} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProjectResolver implements Resolve<ProjectDetail> {

    constructor(private service: ProjectService,
                private router: Router) {}

    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<ProjectDetail> {
        return this.service.getProjectDetail(route.paramMap.get('id')).pipe(
            catchError(err => {
                this.router.navigate(["/404"]);
                return Observable.of(null);
            }));
    }
}
