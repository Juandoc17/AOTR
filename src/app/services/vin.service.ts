import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment'
import { tap, catchError, throwIfEmpty } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const TOKEN_KEY = '';

@Injectable({
  providedIn: 'root'
})
export class VinService {

  /**
   * URL  de acceso a la API
   */
  url = environment.url;

  /**
   * Usuario actualmente loggeado
   */
  user = null;
  
  /**
   * Estado de autenticación
   */
  authenticationState = new BehaviorSubject(false);

  /**
   * Token de inicio de sesión
   */
  token = null;

  /**
   * Metodo constructor
   * @param authService Servicio de autenticación
   * @param http Modulo http de Angular
   * @param helper Servicio de ayuda con la JWT
   * @param router Enrutador de Angular
   */
  constructor(private authService: AuthService, private http: HttpClient, private helper: JwtHelperService, private router: Router) {
    this.user = this.authService.getUser();
  }

  /**
   * Checkea la token actualmente almacenada en el Storage
   */
  checkToken(){
    this.token = localStorage.getItem(TOKEN_KEY);
  		if (this.token) {

        let decoded = this.helper.decodeToken(this.token);
        let isExpired = this.helper.isTokenExpired(this.token);

  			if(!isExpired) {
  				this.user = decoded;
          this.authenticationState.next(true);
  			}
  			else{
  				localStorage.removeItem(TOKEN_KEY);
  			}
  		}
  }

  /**
   * Obtiene los casos de un usuario Dealer dado como parametro
   * @param actualUser El dealer actualmente loggeado
   */
  getVinCasesDealer(actualUser): Observable<any>{
    if(this.user){
      return this.http.get(`${this.url}/api/cases/dealer/${actualUser.dealer_id}`).pipe(
        tap(res => {
        }),
        catchError(e => {
          throw new Error (e);
        })
      );
    }
  }

  /**
   * Obtiene los casos de un usuario Usuario dado como parametro
   * @param actualUser EL usuario actualmente loggeado
   */
  getVinCasesUser(actualUser): Observable<any>{
    if(this.user){
      return this.http.get(`${this.url}/api/cases/user/${actualUser.user_id}`).pipe(
        tap(res => {
        }),
        catchError(e => {
          throw new Error (e);
        })
      );
    }
  }

  /**
   * Obtiene el detalle de un vincase cuyo id es dado como parametro
   * @param _id El id del caso para ser visto con detalle
   */
  getVinCaseDetail(_id): Observable<any>{
    if(this.user){
      return this.http.get(`${this.url}/api/cases/${_id}`).pipe(
        tap(res => {
        }),
        catchError(e => {
          throw new Error (e);
        })
      );
    }
  }


  /**
   * Registra un usuario en la aplicación (No se usa aún)
   * @param credentials Credenciales del usuario a registrar
   */
  deleteVincase(vincase_id) {
    return this.http.post(`${this.url}/api/delete-case`, vincase_id).pipe(
      tap(res => {
        console.log("la respuesta es");
        console.log(res);
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
   * Function to give if a user is authenticated in the app. It means, the user has a valid token.
   */
  isAuthenticated(){
    return this.authenticationState.value;
    
  }
}