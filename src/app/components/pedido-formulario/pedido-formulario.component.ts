import { Component } from '@angular/core';
import {ApiBackendService} from "../../services/ApiBackendService/api.backend.service";
import {SweetAlertService} from "../../services/SweetAlertService/sweet.alert.service";
import {LocalStorageService} from "../../services/LocalStorageService/local.storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Utilidades} from "../../../utils/utilidades";
import {MatTableDataSource} from "@angular/material/table";
import {PedidoDTO} from "../../models/PedidoDTO";
import {ProductoDTO} from "../../models/ProductoDTO";

@Component({
  selector: 'app-pedido-formulario',
  templateUrl: './pedido-formulario.component.html',
  styleUrl: './pedido-formulario.component.css'
})
export class PedidoFormularioComponent {

  ocultarBotonGuardar: boolean = false;

  clienteId: number = 0;
  selectedTipoDocumento: any ;
  numeroDocumento: string = '';
  numeroCelular: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  nombre: string = '';
  direccion: string = '';
  email: string = '';
  selectedOperario: any ;
  selectedVehiculo: any ;
  selectedFechaPedido: string = '';

  tiposDocumentos : any[] = [];
  vehiculos : any[] = [];
  operarios : any[] = [];
  productos : any[] = [];

  productoId: number = 0;
  skuproducto: string = '';
  nombreproducto: string = '';
  cantidad: number = 1;

  displayedColumns: string[] = ['producto','codigo','cantidad','acciones'];
  dataSource = new MatTableDataSource<ProductoDTO>();

  pedidoId: any;
  debounceTimer: any;
  minFecha: Date = new Date();

  isReadOnly: boolean = false;

  constructor(private apiBackendService: ApiBackendService,
              private sweetAlertService: SweetAlertService,
              private localStorageService: LocalStorageService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.apiBackendService.obtenerTiposDocumentos().subscribe(
      (response) => {
        this.tiposDocumentos = response;
        if (this.tiposDocumentos.length > 0) {
          this.selectedTipoDocumento = this.tiposDocumentos[0].id;
        }
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
    this.apiBackendService.obtenerOperarios().subscribe(
      (response) => {
        this.operarios = response;
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
    this.apiBackendService.obtenerVehiculos().subscribe(
      (response) => {
        this.vehiculos = response;
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );

    this.pedidoId = this.localStorageService.getItem("pedidoId");
    console.log(this.pedidoId);
    this.ocultarBotonGuardar = this.localStorageService.getItem("ocultarBotonGuardar");
    if (!Utilidades.esNullOUndefinedoVacio(this.pedidoId)) {
      this.obtenerDatosPedido(this.pedidoId);
    };
    this.route.queryParams.subscribe(params => {
      this.isReadOnly = params['readOnly'] === 'true';
    });
  }

  obtenerDatosPedido(operarioId: number) {
    this.apiBackendService.obtenerPedidoPorId(operarioId).subscribe(
      (response) => {
        this.clienteId = response.clienteId;
        this.selectedTipoDocumento = response.tipoDocumentoId;
        this.numeroDocumento = response.numeroDocumento;
        this.numeroCelular = response.celular;
        this.apellidoPaterno = response.apePaterno;
        this.apellidoMaterno = response.apeMaterno;
        this.nombre = response.nombre;
        this.direccion = response.direccion;
        this.email = response.email;
        this.selectedOperario = response.operarioId;
        this.selectedVehiculo = response.vehiculoId;
        this.selectedFechaPedido = response.fechaPedido;
        this.dataSource.data = response.productos;
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

  onSubmit() {
    console.log(this.dataSource.data);
    const fecha = new Date(this.selectedFechaPedido);
    const año = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    const fechaFormateada = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

    this.apiBackendService.guardarPedido(this.clienteId, this.selectedTipoDocumento, this.numeroDocumento, this.numeroCelular,
      this.apellidoPaterno, this.apellidoMaterno, this.nombre, this.direccion, this.email, this.selectedOperario, this.selectedVehiculo,
      fechaFormateada, this.dataSource.data).subscribe(
      (response) =>{
        this.sweetAlertService.showAlertSuccess(response.mensaje);
        this.router.navigate(['/pedido'])
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

  buscarCliente() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.realizarAccionCliente();
    }, 2000);
  }

  buscarProducto() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.realizarAccionProducto();
    }, 2000);
  }

  realizarAccionCliente() {
    this.apiBackendService.obtenerClientePorTipoNumeroDocumento(this.selectedTipoDocumento, this.numeroDocumento).subscribe(
      (response) => {
        if (response != null) {
          this.clienteId = response.id;
          this.apellidoPaterno = response.apePaterno;
          this.apellidoMaterno = response.apeMaterno;
          this.nombre = response.nombres;
          this.numeroCelular = response.numeroCelular;
          this.direccion = response.direccion;
          this.email = response.correoElectronico;
        } else {
          this.clienteId = 0;
          this.apellidoPaterno = '';
          this.apellidoMaterno = '';
          this.nombre = '';
          this.numeroCelular = '';
          this.direccion = '';
          this.email = '';
        }
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

  realizarAccionProducto() {
    this.apiBackendService.obtenerProductoSKU(this.skuproducto).subscribe(
      (response) => {
        if (response != null) {
          this.productoId = response.id;
          this.nombreproducto = response.nombre;
          this.cantidad = 1;
        } else {
          this.productoId = 0;
          this.nombreproducto = '';
          this.cantidad = 1;
        }
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

  agregarProducto() {
    console.log(this.skuproducto);
    if (Utilidades.esNullOUndefinedoVacio(this.skuproducto)) {
      this.sweetAlertService.showAlertError("Debe ingresar un codigo SKU");
      return;
    }
    if (Utilidades.esNullOUndefinedoVacio(this.nombreproducto)) {
      this.sweetAlertService.showAlertError("Debe ingresar el nombre del producto");
      return;
    }
    if (Utilidades.esNullOUndefinedoVacio(this.cantidad)) {
      this.sweetAlertService.showAlertError("Debe ingresar una cantidad");
      return;
    }
    if (this.cantidad <= 0) {
      this.sweetAlertService.showAlertError("La cantidad debe ser mayor a 0");
      return;
    }
    if (this.puedeAgregarProducto()) {
      const nuevoProducto = new ProductoDTO({
        productoId: this.productoId,
        producto: this.nombreproducto,
        codigo: this.skuproducto,
        cantidad: this.cantidad
      });

      const datosActuales = this.dataSource.data;
      this.dataSource.data = [...datosActuales, nuevoProducto];

      this.productoId = 0;
      this.nombreproducto = '';
      this.skuproducto = '';
      this.cantidad = 1;
    } else {
      this.sweetAlertService.showAlertError("El producto ya fue agregado.");
    }
  }

  private puedeAgregarProducto(): boolean {
    const productosActuales = this.dataSource.data;
    if (this.productoId > 0) {
      const existePorId = productosActuales.some(p => p['productoId'] === this.productoId);
      if (existePorId) {
        return false;
      }
    } else {
      const existePorSKU = productosActuales.some(p => p.codigo === this.skuproducto);
      if (existePorSKU) {
        return false;
      }
    }
    return true;
  }

  cancelar() {
    this.router.navigate(['/pedido'])
  }

}
