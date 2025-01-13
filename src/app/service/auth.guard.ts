import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(): Observable<boolean> {
    return this.authService.isAdmin().pipe(map(
      (isAdmin) => {
        if (!isAdmin) {
          // this.router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      }
    ))
  }

}
