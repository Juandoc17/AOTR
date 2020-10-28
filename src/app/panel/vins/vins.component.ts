import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { VinService } from 'src/app/services/vin.service';


@Component({
  selector: 'app-vins',
  templateUrl: './vins.component.html',
  styleUrls: ['./vins.component.css']
})
export class VinsComponent implements OnInit {

  /**
   * Elemento de carga de la vista
   */
  loader: boolean

  /**
   * Boolean que define si el menu tiene sus elementos expandidos
   */
  options_expanded: boolean;

  /**
   * JSON Web Token con la informacion de usuario obtenida
   */
  jwt: any;

  /**
   * El usuario actualmente loggeado en la apliación
   */
  user: any;

  /**
   * Tipo de usuario loggeado
   */

  type: any;

  /**
   * Linea de caracteres para filtrar información de las listas de VIN
   */
  filterName: string;

  /**
   * Lista filtrada de VINS
   */
  dealersFiltered = [];

  /**
  * Boolean que activa el modo de filtración de las listas de VINS
  */
  filterActive: boolean = false;

  /**
   * Lista con todos los VINS obtenidos desde el servicio
   */
  dealerResults = [];

  /**
   * Lista con todos los VINS obtenidos desde el servicio
   */
  userResults = [];

  /**
   * Lista de opciones del menu
   
  options: any =[
    {
      name: "Contactar Concesión",
      icon: 'iconos'
    }
  ]; */

  options: any =[
    /*{
      name: "Registrar Empleado",
      icon: 'iconos'
    }*/
  ];

  /**
   * Metodo constructor de la clase
   * @param router Variable para el enrutamiento hacia otras vistas
   * @param auth Variable para el manejo de servicios relacionados a autenticación
   * @param vin Variable para el manejo de servicios relacionados a información de VINS
   */
  constructor(private router: Router, private auth: AuthService, private vin: VinService) {
    this.loader =  true;
    this.options_expanded = true;
    this.jwt = localStorage.getItem('access_token_aot');
    if (this.jwt) {
      this.user = this.auth.getUser();
      this.type = localStorage.getItem('user_type');
      if(this.type=='dealer'){
        this.getVinCasesDealer(this.user);
      }

      else {
        this.getVinCasesUser(this.user);
      }
    } else {
      this.router.navigate(['/auth']);
    }
  }

  /**
   * Metodo para filtrar lista de VINS basado en la información que se tipee en el input
   * @param event El evento disparado al tiper en el input
   */
  filterDealer(event: any) { // without type info

    let value = event.target.value;
    this.dealersFiltered = [];
    if (value != '') {
      this.filterActive = true;
      for (let i = 0; i < this.dealerResults.length; i++) {
        const task = this.dealerResults[i];
        console.log(task);
        console.log(value);
        /*
        if (task.case_id.indexOf(value.toUpperCase()) == 0) {
          this.dealersFiltered.push(task);
        }*/
        if (task.case_id.includes(value.toUpperCase())) {
          this.dealersFiltered.push(task);
        }
      }
    }
    else {
      this.filterActive = false;
    }
  }

  /**
   * Metodo para limpiar el input encargado de filtrar listas de VINS
   */
  cleanField() {
    this.filterName = '';
    this.dealersFiltered = [];
    this.filterActive = false;
  }

  /**
   * Metodo de enrutamiento dentro de la aplicación.
   * @param destination Ruta del componente a donde se desea enrutar la aplicación.
   */
  navigateTo(destination: string) {
    this.router.navigate(['/cases/case-detail/' + destination]);
  }

  /**
   * Metodo para obtener todos los VIN Cases relacionados al usuario actualmente loggeado si es dealer
   * @param actualUser El usuario actualmente loggeado - un dealer -
   */
  getVinCasesDealer(actualUser) {
    this.vin.getVinCasesDealer(actualUser).subscribe(datos => {
      this.dealerResults = datos;
      this.loader = false;
    },
      err => {
        this.loader =  false;
      });

  }

  /**
   * Metodo para obtener todos los VIN Cases relacionados al usuario actualmente loggeado si es usuario
   * @param actualUser El usuario actualmente loggeado - un usuario -
   */
  getVinCasesUser(actualUser) {
    this.vin.getVinCasesUser(actualUser).subscribe(datos => {
      this.userResults = datos;
      this.loader = false;
    },
      err => {
        this.loader =  false;
      });

  }

  /**
   * Metodo del ciclo de vida de componentes que se ejecuta cuando se inicia un componente
   */
  ngOnInit() {
  }
}
