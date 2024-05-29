import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProjectDetail } from '../../models/project-detail.model';
import { ProjectService } from '../../services/project.service';

@Injectable({ providedIn: 'root' })
export class ProjectResolver implements Resolve<ProjectDetail> {

  constructor(private service: ProjectService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProjectDetail> {
    return this.service.getProjectDetail(route.paramMap.get('id')).pipe(
      catchError(err => {
        console.error(err);
        this.router.navigate([ '/404' ]);
        return EMPTY;
      }));
  }
}
