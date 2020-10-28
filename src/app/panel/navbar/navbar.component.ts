import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import { VinDetailComponent } from '../vin-detail/vin-detail.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})


export class NavbarComponent implements OnInit {
  /**
   * JSON Web Token del usuario loggeado
   */
  jwt: any;

  /**
   * User loggeado en la aplicación
   */
  user: any;

  /**
   * Tipo de usuario loggeado en la aplicación
   */
  type: any;

  url_subscription: any;
  menu_seleccionado: any;
  menuActive: boolean;
  routerOutletComponent: any;
  routerOutletComponentClassName: string;
  menuContent: any;

  @ViewChild('popup')
  popup: VinDetailComponent;

  /**
   * Metodo constructor
   * @param router Enrutador de Angular
   * @param auth Servicio de Autenticación
   */
  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService) {
    console.log("entra a navbar");
    this.jwt = localStorage.getItem('access_token_aot');
    if (this.jwt) {
      this.user = this.auth.getUser();
      this.type = localStorage.getItem('user_type');
      this.menuActive = false;
    } else {
      this.router.navigate(['/auth']);
    }
  }

  doStuff(){
    this.menuActive = false;
    this.routerOutletComponent.displayModalDelete = true;
  }

  /**
   * Metodo ngOnInit de Angular
   */
  ngOnInit() {
    console.log("Entra al init");
    this.url_subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {

        console.log("Entra al instance");
        console.log(e);
        if (e.urlAfterRedirects.includes('confirm')) {
        } else {
        }
      }
    });
    this.route.firstChild.data.subscribe(res => {
      console.log("Entra al subscribe");


      console.log(res);
      if (!res.type) {
        //this.menu_number = -1;
      } else {

        this.menu_seleccionado = res.type;
      }
    });
  }

  onActivate(event: any): void {
    console.log("entra a event");
    this.routerOutletComponent = event;
    this.routerOutletComponentClassName= event.constructor.name;
    console.log(this.routerOutletComponent);
    console.log(this.routerOutletComponentClassName);
    this.menuContent = this.routerOutletComponent.options;
    console.log(this.menuContent);
  }

  toggleMenu(){
    if( this.menuActive == false) {
      this.menuActive = true;
    }

    else {
      this.menuActive = false;
    }
  }

  goTo(content) {
    
    this.router.navigate([content]);
    this.menuActive=false;
  }

  /**
   * Metodo ngOnDestroy de Angular
   */
  ngOnDestroy(): void {
  }

  /**
   * Metodo para cerrar sesión de un usuario loggeado
   */
  logout() {
    localStorage.removeItem('access_token_aot');
    localStorage.removeItem('user_type');
    this.router.navigate(['/auth']);
  }
}
