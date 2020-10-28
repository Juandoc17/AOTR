import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { VinService } from 'src/app/services/vin.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-vin-detail',
  templateUrl: './vin-detail.component.html',
  styleUrls: ['./vin-detail.component.css']
})
export class VinDetailComponent implements OnInit {

  /**
   * JSON Web Token con la informacion de usuario obtenida
   */
  jwt: any;

  /**
   * El usuario actualmente loggeado en la apliación
   */
  user: any;

  /**
   * Elemento de carga de la vista
   */
  loader: boolean;

  /**
   * Boolean que define si el menu tiene sus elementos expandidos
   */
  options_expanded: boolean;

  /**
   * Boolean para desplegar el modal de Eliminar Contenido del VIN
   */
  displayModalDelete: boolean;

  /**
   * Boolean para desplegar el modal del Formulario de Contacto con Dealer
   */
  displayModalContact: boolean;

  /**
   * Boolean para desplegar el modal del Detalle de la Imagen del VIN
   */
  displayModalDetail: boolean;

  displayModalDetailVideo: boolean;

  video: any;

  displaySuccess: boolean;

  displayFailure: boolean;

  displayDeleting: boolean;

  displayResponse: boolean;

  /**
   * Form Group con la información relacionada al formulario de contacto con Dealership
   */
  loginForm: FormGroup;

  /**
   * Linea de caracteres para filtrar información de las listas
   */
  filterName: string;

  /**
   * Lista filtrada
   */
  dealersFiltered = [];

  /**
  * Boolean que activa el modo de filtración de las listas
  */
  filterActive: boolean = false;

  /**
   * Lista con los archivos a utilizar
   */
  dealerResults = [];

  /**
   * Lista de opciones del menu de Dealer
   */
  options: any = [
    {
      name: "Return to Case List",
      link: "/panel/cases",
      icon: 'iconos'
    },
    {
      name: "Delete Case",
      icon: 'iconos'
    }
    /**{
      name: "Regresar a Casos",
      link: "/panel/vins",
      icon: 'iconos'
    },
    {
      name: "Borrar Caso",
      icon: 'iconos'
    }**/
    /**
    {
      name: "Contactar Concesión",
      icon: 'iconos'
    }, */
  ];

  @Output() menuEmit =  new EventEmitter();

  /**
   * Lista de opciones del menu de Usuario
   */
  options2: any = [
    {
      name: "Return to Case List",
      link: "/panel/cases",
      icon: 'iconos'
    }
    /**{
      name: "Regresar a Casos",
      link: "/panel/vins",
      icon: 'iconos'
    }*/
    /**
    {
      name: "Contactar Concensión",
      icon: 'iconos'
    } */
  ];

  /**
   * Id del VIN Case dentro de la Basde de datos MongoDB
   */
  _id: any;

  case_id: any;


  /**
   * Lista con los archivos multimedia que conforman el VIN case
   */
  vinList: any = [];

  /**
   * Elemento multimedia seleccionado al que se va ver su detalle.
   */
  vinSelected: any = null;

  /**
   * Id empleado
   */
  employee: any;

  /**
   * Fecha generada
   */
  fecha: any;

  /**
   * Tipo de usuario loggeado
   */
  type: any;


  public config: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: true,
    loop: false,
    pagination: false
  };

  public config2: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: true,
    loop: false,
    pagination: true
  };

  private scrollbar: SwiperScrollbarInterface = {
    el: '.swiper-scrollbar',
    hide: false,
    draggable: true
  };

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true,
    hideOnClick: false
  };

  @ViewChild(SwiperComponent) componentRef: SwiperComponent;
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;

  public tipo: string = 'component';

  public show: boolean = true;

  /**
   * Metodo constructor de la clase
   * @param formBuilder Variable para la validacion de elementos del formulario
   * @param route Variable para la btencion de parametros enviados desde el elemento padre a traves del Routing
   * @param router Variable para el enrutamiento hacia otras vistas
   * @param auth Variable para el manejo de servicios relacionados a autenticación
   * @param vin Variable para el manejo de servicios relacionados a informacion del VIN
   */
  constructor(private sanitizer: DomSanitizer, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private auth: AuthService, private vin: VinService) {
    this.displayModalDelete = false;
    this.displayModalContact = false;
    this.displayModalDetail = false;
    this.displayModalDetailVideo = false;
    this.loader = true;
    this.options_expanded = true;

    this.displayDeleting = false;
    this.displayResponse = false;
    this.displaySuccess = false;
    this.displayFailure = false;
    this.loginForm = this.formBuilder.group({
      'dealerid': new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
      'content': new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)]))
    });
    this.jwt = localStorage.getItem('access_token_aot');
    if (this.jwt) {
      this.user = this.auth.getUser();
      this.type = localStorage.getItem('user_type');
      this.route.paramMap.subscribe(params => {
        console.log(params);
        this._id = params.get("_id");
        this.getVinCaseDetail(this._id);
      });
    } else {
      this.router.navigate(['/auth']);
    }
    this.emitMenu();
  }

  cerrarModal(){
    this.displayModalDelete = false;
    this.displayDeleting = false;
    this.displayResponse = false;
    this.displaySuccess = false;
    this.displayFailure = false;
  }

  deleteVincase() {
    this.displayDeleting = true;

    let valor = {
      'case_id': this._id
    };
    this.vin.deleteVincase(valor).subscribe(datos => {
      this.displayResponse = true;
      this.displaySuccess = true;
      this.displayDeleting = false;
    },
      err => {
        console.log(err);
        this.displayResponse = true;
        this.displayDeleting = false;
        this.displayFailure = true;
        this.displaySuccess = false;
      });
  }

  retornar(){
    this.displayModalDelete = false;
    this.displayDeleting = false;
    this.displayResponse = false;
    this.displaySuccess = false;
    this.displayFailure = false;
    this.router.navigate(['/panel/cases']);
  }


  /**
   * Metodo que ejecuta acciones dependiendo de la funcion presionada en el menu lateral
   * @param name El nombre del link sobre el que el usuario ejecutó la acción
   */
  actionMenu(name: string) {
    if (name === "Regresar a Casos" || name === "Return to Case List") {
      this.router.navigate(['/panel/cases']);
    }
    else if (name === "Borrar Caso" || name === "Delete Case") {
      this.displayModalDelete = true;
    }
    else if (name === "Contactar Concesión") {
      this.displayModalContact = true;
    }
  }

  /**
   * Metodo para cerrar el modal de Eliminar VIN
   */
  closeModalDelete() {
    this.displayModalDelete = false;
  }

  /**
   * Metodo para cerrar el modal de Contactar Dealership
   */
  closeModalContact() {
    this.displayModalContact = false;
  }

  /**
   * Metodo para cerrar el modal de Detalle de contenido Multimedia del VIN
   */
  closeModalDetail() {
    this.displayModalDetail = false;
  }

  closeModalDetailVideo() {
    this.displayModalDetailVideo = false;
  }

  /**
   * Metodo para abrir el modal de Detalle de contenido Multimedia del VIN
   * @param vin El elemento multimedia que se quiere ver en detalle
   */
  showDetail(vin: any) {
    this.vinSelected = vin;
    console.log(this.vinSelected);
    this.displayModalDetail = true;
  }

  /**
   * Metodo para abrir el modal de Detalle de contenido Multimedia del VIN
   * @param vin El elemento multimedia que se quiere ver en detalle
   */
  showDetailVideo(vin: any) {
    this.vinSelected = vin;

    this.video = this.sanitizer.bypassSecurityTrustUrl(this.vinSelected.source);
    console.log(this.vinSelected);
    this.displayModalDetailVideo = true;
  }

  emitMenu() {
    console.log("entra al emit menu");
    console.log(this.options);
    this.menuEmit.emit(this.options);
  }

  /**
   * Metodo para filtrar lista basado en la información que se tipee en el input (Sin usar)
   * @param event El evento disparado al tiper en el input
   */
  filterDealer(event: any) { // without type info
    let value = event.target.value;
    this.dealersFiltered = [];
    if (value != '') {
      this.filterActive = true;
      for (let i = 0; i < this.dealerResults.length; i++) {
        const task = this.dealerResults[i];
        if (task.vinid.indexOf(value.toLowerCase()) == 0) {
          this.dealersFiltered.push(task);
        }
      }
    }
    else {
      this.filterActive = false;
    }
  }

  /**
   * Metodo para limpiar el input encargado de filtrar listas (sin usar)
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
    this.router.navigate(['/vins/vin-detail/' + destination]);
  }

  /**
   * Metodo que obtiene toda la información y contenido relacionado al VIN
   * @param actualId El id del VIN del que se obtiene información y contenido
   */
  getVinCaseDetail(actualId) {
    this.loader = true;
    this.vin.getVinCaseDetail(actualId).subscribe(datos => {
      console.log(datos);
      this.employee = datos.employee_id;
      this.fecha = datos.date;
      this.vinList = datos.filedata;
      this.loader = false;
      this.case_id = datos.case_id
    },
      err => {
        this.loader = false;
      });
  }

  /**
   * Metodo del ciclo de vida de componentes que se ejecuta cuando se inicia un componente
   */
  ngOnInit() {
  }

  public toggleType() {
    this.type = (this.type === 'component') ? 'directive' : 'component';
  }


  public toggleDirection() {
    this.config.direction = (this.config.direction === 'horizontal') ? 'vertical' : 'horizontal';
  }

  public toggleSlidesPerView() {
    if (this.config.slidesPerView !== 1) {
      this.config.slidesPerView = 1;
    } else {
      this.config.slidesPerView = 2;
    }
  }

  public toggleOverlayControls() {
    if (this.config.navigation) {
      this.config.scrollbar = false;
      this.config.navigation = false;

      this.config.pagination = this.pagination;
    } else if (this.config.pagination) {
      this.config.navigation = false;
      this.config.pagination = false;

      this.config.scrollbar = this.scrollbar;
    } else {
      this.config.scrollbar = false;
      this.config.pagination = false;

      this.config.navigation = true;
    }

    if (this.type === 'directive') {
      this.directiveRef.setIndex(0);
    } else {
      this.componentRef.directiveRef.setIndex(0);
    }
  }

  public toggleKeyboardControl() {
    this.config.keyboard = !this.config.keyboard;
  }

  public toggleMouseWheelControl() {
    this.config.mousewheel = !this.config.mousewheel;
  }
}
