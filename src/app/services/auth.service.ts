import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment'
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Llave para acceder al valor en le localStorage
 */
const TOKEN_KEY = 'access_token_aot';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * URL de acceso a la API
   */
  url = environment.url;

  /**
   * Usuario actualmente logggeado
   */
  user = null;

  /**
   * Estado de al autenticacion del usuario
   */
  authenticationState = new BehaviorSubject(false);

  /**
   * Token del usuario loggeado
   */
  token = null;

  /**
   * 
   * @param http Modulo http de Angular
   * @param helper Ayudante del JWT
   * @param router Enrutador de Angular
   */
  constructor(private http: HttpClient, private helper: JwtHelperService, private router: Router) {
    this.checkToken();
  }

  /**
   * Checkea una token en el servidor
   */
  checkToken() {
    this.token = localStorage.getItem(TOKEN_KEY);
    if (this.token) {
      let decoded = this.helper.decodeToken(this.token);
      let isExpired = this.helper.isTokenExpired(this.token);

      if (!isExpired) {
        this.user = decoded;
        this.authenticationState.next(true);
      }
      else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  /**
   * Verifica el tio usuario que intenta loggearse en la aplicación
   * @param credentials Las credenciales del usuario a loggear
   */
  verifyUser(credentials): Observable<any> {
    return this.http.post(`${this.url}/api/aux/verifyUser`, credentials).pipe(
      tap(res => {
      }),
      catchError(e => {
        if (e.error.msg == null) {
          throw new Error(e);
        }
        else {
          throw new Error(e.error.msg);
        }
      })
    );
  }

  /**
   * Registra un usuario en la aplicación (No se usa aún)
   * @param credentials Credenciales del usuario a registrar
   */
  register(credentials) {
    return this.http.post(`${this.url}/api/register-dealer`, credentials).pipe(
      tap(res => {
      }),
      catchError(e => {
        if (e.error.msg == null) {
          throw new Error(e);
        }
        else {
          throw new Error(e.error.msg);
        }
      })
    );
  }

  /**
   * Loggea un usuario Dealer en la aplicación
   * @param credentials Credenciales del dealer a loggear
   */
  loginDealer(credentials) {
    return this.http.post(`${this.url}/api/login-dealer`, credentials).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res['token']);
        localStorage.setItem("user_type", "dealer");
        this.user = this.helper.decodeToken(res['token']);
        this.authenticationState.next(true);
        this.router.navigateByUrl('/panel');
      }),
      catchError(e => {
        if (e.error.msg == null) {
          throw new Error(e);
        }
        else {
          throw new Error(e.error.msg);
        }

      })
    );
  }


  /**
 * Loggea un usuario Usuario en la aplicación
 * @param credentials Credenciales del usuario a loggear
 */
  loginUser(credentials) {
    return this.http.post(`${this.url}/api/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res['token']);
        localStorage.setItem("user_type", "usuario");
        this.user = this.helper.decodeToken(res['token']);
        this.authenticationState.next(true);
        this.router.navigateByUrl('/panel');
      }),
      catchError(e => {
        if (e.error.msg == null) {
          throw new Error(e);
        }
        else {
          throw new Error(e.error.msg);
        }
      })
    );
  }

  /**
   * Cierra sesión de un usuario loggeado
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user_type');
    this.authenticationState.next(false);
  }

  /**
   * Obtiene un usuario en la aplicación, el usuario loggeado
   */
  getUser() {
    return this.user;
  }

  /**
   * Metodo de prueba
   */
  getSpecialData() {
    return this.http.get(`${this.url}/api/special`).pipe(
      catchError(e => {
        let status = e.status;
        if (status === 401) {
          this.logout();
        }
        throw new Error(e);
      })
    )
  }

  /**
   * Function to give if a user is authenticated in the app. It means, the user has a valid token.
   */
  isAuthenticated() {
    return this.authenticationState.value;
  }
}