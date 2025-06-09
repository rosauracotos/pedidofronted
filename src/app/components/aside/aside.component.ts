import { Component } from '@angular/core';
import {AuthService} from "../../services/AuthService/auth.service";
import {LocalStorageService} from "../../services/LocalStorageService/local.storage.service";

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {
  menuItems: any[] = [];
  constructor(private authService: AuthService,
              private localStorageService: LocalStorageService) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      let menuData = this.localStorageService.getItem('menuData');
      this.menuItems = menuData || [];
    }
  }
  logout() {
    this.authService.logout();
  }

}
