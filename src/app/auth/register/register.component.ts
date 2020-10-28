import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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
      'userid': new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
      'country': new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)]))
    });
    this.loading = false;
  }

  /**
   * Metodo del ciclo de vida de componentes que se ejecuta cuando se inicia un componente
   */
  ngOnInit() {
  }

  /**
   * Metodo de ejecución cuando se hace click en el boton de Registrar.
   * Realiza la tarea de registrar o muestra errores asociados.
   */
  registerDealer() {
    if (!this.loading) {
      this.error = '';
      this.loading = true;
      let valores = {
        'userid': this.loginForm.controls['user_id'].value.toLowerCase(),
        'password': this.loginForm.controls['password'].value.toLowerCase(),
        'country': this.loginForm.controls['country'].value.toLowerCase()
      };
      this.authService.register(valores).subscribe(data => {
        this.loading = false;
      },
        err => {
          this.error = err;
          this.loading = false;
        });
    }
  }
}
