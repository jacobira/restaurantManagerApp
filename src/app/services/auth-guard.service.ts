import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ServerConnectService } from './server-connect.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private serverConnect: ServerConnectService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.serverConnect.validated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
