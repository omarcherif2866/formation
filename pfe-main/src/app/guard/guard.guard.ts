import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      map((loggedIn) => {
        console.log('Is user logged in?', loggedIn);
        console.log('Requested path:', route.routeConfig ? route.routeConfig.path : 'unknown');
        if (route.routeConfig && route.routeConfig.path ) {
          if (loggedIn ) {
            return true; 
          } else {
            return this.router.createUrlTree(['/Inscrivez-vous']);
          }
        } else {
          return true;
        }
      })
    );
  } 
}
