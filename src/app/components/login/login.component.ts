import { Component } from '@angular/core';
import {AuthService} from "../../services/AuthService/auth.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../services/LocalStorageService/local.storage.service";
import {SweetAlertService} from "../../services/SweetAlertService/sweet.alert.service";
import {Utilidades} from "../../../utils/utilidades";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private authService:AuthService,
              private router: Router,
              private localStorageService: LocalStorageService,
              private sweetAlertService: SweetAlertService) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/inicio']);
    }
  }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      (response) =>{
        if (Utilidades.dataDeServerEsCorrecta(response)) {
          this.sweetAlertService.showAlertSuccess("Login exitoso");
          this.localStorageService.setItem('isAuthenticated', 'true');
          this.localStorageService.setItem('menuData', response.extraInfo.detalle);
          this.localStorageService.setItem('numeroIdentificacion', response.extraInfo.numeroIdentificacionUsuarioLogueado);
          this.localStorageService.setItem('nombreUsuarioLogueado', response.extraInfo.nombreUsuarioLogueado);
          this.router.navigate(['/inicio']);
        } else {
          this.sweetAlertService.showAlertError(response.mensaje);
        }
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

}
