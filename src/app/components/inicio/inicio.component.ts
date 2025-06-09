import { Component } from '@angular/core';
import {AuthService} from "../../services/AuthService/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  constructor(private authService: AuthService,
              private router: Router) {

  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

}
