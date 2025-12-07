// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    route: ActivatedRouteSnapshot;
    state: RouterStateSnapshot;
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    } else {
      alert('Acceso denegado. Debes ser administrador.');
      this.router.navigate(['/']); // o al login
      return false;
    }
  }
}
