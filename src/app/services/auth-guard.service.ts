import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuardService implements CanActivate {


  constructor(private cookieService:CookieService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  console.log(this.cookieService.get('loginData'))
    if (this.cookieService.get('loginData')!="") {
        return true;
    }
    return false;
  }

}