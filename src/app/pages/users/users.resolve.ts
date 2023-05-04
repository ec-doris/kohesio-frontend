import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import {EMPTY, Observable} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";

@Injectable({ providedIn: 'root' })
export class UsersResolve implements Resolve<User> {

  constructor(private userService: UserService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.userService.getUserDetails().pipe(
      catchError(err => {
        console.error(err);
        this.router.navigate(["/404"]);
        return EMPTY;
      }));
  }

}
