import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private apiUrl = 'http://localhost:8080/api/vehiculo';

  constructor(private http: HttpClient) {}

  listarVehiculos(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  filtrarVehiculos(
    placa?: string,
    marca?: string,
    tipoVehiculo?: string,
    anio?: number
  ): Observable<any> {
    let params: any = {};
    if (placa) params.placa = placa;
    if (marca) params.marca = marca;
    if (tipoVehiculo) params.tipoVehiculo = tipoVehiculo;
    if (anio) params.anio = anio;

    return this.http.get(`${this.apiUrl}/filtrar`, { params });
  }

  crearVehiculo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  actualizarVehiculo(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  obtenerVehiculoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  eliminarVehiculo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
