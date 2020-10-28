import { Injectable, ɵConsole } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

//Guard to limit access, this will verify if an user can access to the logged-in pages
export class AuthGuardService implements CanActivate{

  constructor(private auth: AuthService, private router: Router) { }

  /**
   * Function to verify the authetication state of an user
   */
  canActivate (): boolean {
    const loggedIn: boolean = this.auth.isAuthenticated();
    // if not, redirect to /auth/login page
    if (!loggedIn) {
      this.router.navigate(['/auth']);
    }
    return loggedIn;
  }
}
