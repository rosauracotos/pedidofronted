import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {LocalStorageService} from "./services/LocalStorageService/local.storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pedidofronted';

  constructor(private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    const existingData = this.localStorageService.getItem('isAuthenticated');
    const existingDataPersona = this.localStorageService.getItem('persona');
    if (!existingData) {
      this.localStorageService.setItem('isAuthenticated', 'false');
    }
    if (!existingDataPersona) {
      this.localStorageService.removeItem('persona');
    }
  }

}
