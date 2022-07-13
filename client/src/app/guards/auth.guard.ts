import { AuthService } from '../model/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard
{
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  constructor(private router: Router,
              private auth: AuthService){ }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
  {
    if (this.auth.authenticated)
    {
      // console.log('authenticated');
      return true;
    }
    else
    {
      // console.log('cannnot authenticate');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
