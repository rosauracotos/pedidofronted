import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "../LocalStorageService/local.storage.service";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router,
              private localStorageService: LocalStorageService,
              private http: HttpClient) { }

  ngOnInit(): void {
    const existingData = this.localStorageService.getItem('isAuthenticated');

    if (!existingData) {
      this.localStorageService.setItem('isAuthenticated', { data: 'false' });
    }
  }

  login(username: string, password: string): Observable<any> {
    const body = {usuario: username, password: password};
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(environment.apiUrl +`api/usuario/login`, body, { headers: headers });
  }

  logout() {
    this.localStorageService.setItem('isAuthenticated', 'false');
    this.localStorageService.removeItem('menuData');
    this.localStorageService.removeItem('numeroIdentificacion');
    this.localStorageService.removeItem('nombreUsuarioLogueado');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    let isAuthenticated = false;
    let data = this.localStorageService.getItem('isAuthenticated');
    if (typeof data === 'string') {
      isAuthenticated = JSON.parse(data);
    } else {
      isAuthenticated = data || false;
    }
    console.log(isAuthenticated);
    return isAuthenticated;
  }
}
