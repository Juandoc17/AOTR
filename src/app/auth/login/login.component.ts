import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * Form Group con la información relaionada al formulario de login a la aplicación
   */
  loginForm: FormGroup;

  /**
   * Caracteres que almacenan el mensaje de respuesta al login en caso de error
   */
  error: string;

  /**
   * Elemento de carga de la vista
   */
  loading: boolean;

  /**
   * El usuaro actualmente loggeado en la aplicación
   */
  user: any;

  /**
   * Metodo constructor de la clase
   * @param authService Variable para el manejo de servicios relacionados a autenticación
   * @param formBuilder Variable para la validación de elementos del formulario
   */
  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.error = '';
    this.loginForm = this.formBuilder.group({
      'user_id': new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)]))
    });
    this.loading = false;
  }

  /**
   * Metodo del ciclo de vida de componentes que se ejecuta cuando se inicia un componente
   */
  ngOnInit() {
  }

  /**
   * Metodo de ejecución cuando se hace click en el boton de Ingresar.
   * Realiza la tarea de inicio de sesión o muestra errores asociados.
   */
  loginDealer() {
    if (!this.loading) {
      this.error = '';
      this.loading = true;
      let valores = {
        'cred_id': this.loginForm.controls['user_id'].value,
        'user_id': this.loginForm.controls['user_id'].value,
        'dealer_id': this.loginForm.controls['user_id'].value,
        'password': this.loginForm.controls['password'].value,
      };


      this.authService.verifyUser(valores).subscribe(data => {
        let tipo = data.user_type;
        this.loading = false;

        if (tipo === "dealer") {
          this.authService.loginDealer(valores).subscribe(data => {
            this.loading = false;
          },
            err => {
              this.error = err;
              this.loading = false;
            });
        }
        else if (tipo === "usuario") {
          this.authService.loginUser(valores).subscribe(data => {
            this.loading = false;
          },
            err => {
              this.error = err;
              this.loading = false;
            });
        }
      },
        err => {
          this.error = err;
          this.loading = false;
        });
    }
  }
}
