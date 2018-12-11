import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ServerConnectService } from './server-connect.service';

@Injectable({
  providedIn: 'root'
})
export class MngrAuthGuardService {

  constructor(private serverConnect: ServerConnectService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if (this.serverConnect.mngr == true){
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
