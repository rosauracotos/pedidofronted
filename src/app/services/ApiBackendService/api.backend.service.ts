import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {LocalStorageService} from "../LocalStorageService/local.storage.service";
import {Observable} from "rxjs";
import {environment} from "../../../environments/enviroment";
import {Utilidades} from "../../../utils/utilidades";
import {ProductoDTO} from "../../models/ProductoDTO";

@Injectable({
  providedIn: 'root'
})
export class ApiBackendService {
  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) { }

  obtenerTiposDocumentos(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(environment.apiUrl +`api/tipoDocumento/all`, { headers: headers });
  }

  obtenerDepartamentos(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(environment.apiUrl +`api/ubigeoDepartamento/all`, { headers: headers });
  }

  obtenerProvinciasPorDepartamento(departamentoId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(environment.apiUrl +`api/ubigeoProvincia/departamento/`+ departamentoId, { headers: headers });
  }

  obtenerDistrirosPorProvincia(provinciaId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(environment.apiUrl +`api/ubigeoDistrito/provincia/`+ provinciaId, { headers: headers });
  }

  busquedaPaginadaPersonal(apellidoPaterno: string, apellidoMaterno:string ,
                           nombre: string, selectedTipoDocumento: any, numeroDocumento: string,
                           estadoOperario: string, max: number): Observable<any> {
    const body = {
      numeroDocumento: Utilidades.esNullOUndefinedoVacio(numeroDocumento) ? null : numeroDocumento,
      nombre: Utilidades.esNullOUndefinedoVacio(nombre) ? null : nombre,
      apellidoPaterno: Utilidades.esNullOUndefinedoVacio(apellidoPaterno) ? null : apellidoPaterno,
      apellidoMaterno: Utilidades.esNullOUndefinedoVacio(apellidoMaterno) ? null : apellidoMaterno,
      tipoDocumentoId: Utilidades.esNullOUndefinedoVacio(selectedTipoDocumento) ? null : selectedTipoDocumento,
      estadoOperario: estadoOperario == "T" ? null : estadoOperario,
      max: max,
      limite: 0,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(environment.apiUrl +`api/operario/busquedaPagina`, body, { headers: headers });
  }

  obtenerOperarioPorId(operarioId: number):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(environment.apiUrl +`api/operario/`+ operarioId, { headers: headers });
  }

  guardarOperario(apellidoPaterno: string, apellidoMaterno: string, nombre: string, celular: string, tipoDocumentoId: number,
                  numeroIdentificacion: string, correo: string, distritoId: number, direccion: string, nroBrevete: string,
                  categoria: string, fechaVencimiento: string): Observable<any> {

    const body = {
      apePaterno: apellidoPaterno,
      apeMaterno: apellidoMaterno,
      nombres: nombre,
      numeroDocumento: numeroIdentificacion,
      fechaVencimientoBrevete: fechaVencimiento,
      numeroCelular: celular,
      direccion: direccion,
      correoElectronico: correo,
      numeroBrevete: nroBrevete,
      categoriaBrevete: categoria,
      tipoDocumento: {
        id :tipoDocumentoId
      },
      ubigeoDistrito: {
        id :distritoId
      }
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(environment.apiUrl +`api/operario/guardar`, body, { headers: headers });
  }

  editarOperario(apellidoPaterno: string, apellidoMaterno: string, nombre: string, celular: string, tipoDocumentoId: number,
                 numeroIdentificacion: string, correo: string, distritoId: number, direccion: string, nroBrevete: string,
                 categoria: string, fechaVencimiento: string, operarioId: number): Observable<any> {

    const body = {
      apePaterno: apellidoPaterno,
      apeMaterno: apellidoMaterno,
      nombres: nombre,
      numeroDocumento: numeroIdentificacion,
      fechaVencimientoBrevete: fechaVencimiento,
      numeroCelular: celular,
      direccion: direccion,
      correoElectronico: correo,
      numeroBrevete: nroBrevete,
      categoriaBrevete: categoria,
      tipoDocumento: {
        id :tipoDocumentoId
      },
      ubigeoDistrito: {
        id :distritoId
      }
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(environment.apiUrl +`api/operario/editar/` + operarioId, body, { headers: headers });
  }

  darDeBajaOperario(operarioId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(environment.apiUrl +`api/operario/eliminar/` + operarioId, null, { headers: headers });
  }

  obtenerEstadosPedidos(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(environment.apiUrl +`api/estadoPedido/all`, { headers: headers });
  }

  obtenerOperarios(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(environment.apiUrl +`api/operario/all`, { headers: headers });
  }

  busquedaPaginadaPedido(cliente: string, selectedEstadoPedido: any, selectedOperario: any, max: number): Observable<any> {
    const body = {
      cliente: Utilidades.esNullOUndefinedoVacio(cliente) ? null : cliente,
      estadoPedidoId: Utilidades.esNullOUndefinedoVacio(selectedEstadoPedido) ? null : selectedEstadoPedido,
      operarioId: Utilidades.esNullOUndefinedoVacio(selectedOperario) ? null : selectedOperario,
      max: max,
      limite: 0,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(environment.apiUrl +`api/pedido/busquedaPagina`, body, { headers: headers });
  }

  obtenerVehiculos(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(environment.apiUrl +`api/vehiculo/all`, { headers: headers });
  }

  obtenerClientePorTipoNumeroDocumento(tipoDocumentoId:any, numeroDocumento:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = new HttpParams()
      .set('tipoDocumentoId', tipoDocumentoId)
      .set('numeroDocumento', numeroDocumento);

    return this.http.get<any>(environment.apiUrl +`api/cliente/obtenerPorTipoNumeroDocumento`, { headers: headers, params: params });
  }

  obtenerProductoSKU(codigoSKU:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = new HttpParams()
      .set('codigoSKU', codigoSKU);

    return this.http.get<any>(environment.apiUrl +`api/producto/obtenerPorCodigoSKU`, { headers: headers, params: params });
  }

  guardarPedido(clienteId: number, tipoDocumentoId: number, numeroDocumento:string, celular:string, apePaterno:string, apeMaterno:string,
                nombre:string, direccion:string, email:string, operarioId:number, vehiculoId: number, fechaPedido: string,
                productos: ProductoDTO[]): Observable<any> {

    const body = {
      clienteId: clienteId,
      tipoDocumentoId: tipoDocumentoId,
      numeroDocumento: numeroDocumento,
      celular: celular,
      apePaterno: apePaterno,
      apeMaterno: apeMaterno,
      nombre: nombre,
      direccion: direccion,
      email: email,
      operarioId: operarioId,
      vehiculoId: vehiculoId,
      fechaPedido: fechaPedido,
      productos: productos
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(environment.apiUrl +`api/pedido/guardar`, body, { headers: headers });
  }

  anularPedido(pedidoId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(environment.apiUrl +`api/pedido/eliminar/` + pedidoId, null, { headers: headers });
  }

  obtenerPedidoPorId(pedidoId: number):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(environment.apiUrl +`api/pedido/`+ pedidoId, { headers: headers });
  }


}
