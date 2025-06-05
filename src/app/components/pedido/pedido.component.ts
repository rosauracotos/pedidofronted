import {Component, ViewChild} from '@angular/core';
import {ApiBackendService} from "../../services/ApiBackendService/api.backend.service";
import {SweetAlertService} from "../../services/SweetAlertService/sweet.alert.service";
import {LocalStorageService} from "../../services/LocalStorageService/local.storage.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {OperarioDTO} from "../../models/OperarioDTO";
import {MatPaginator} from "@angular/material/paginator";
import {Utilidades} from "../../../utils/utilidades";
import {PedidoDTO} from "../../models/PedidoDTO";

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent {

  displayedColumns: string[] = ['cliente','direccion','nropedido', 'operario', 'estadopedido', 'acciones'];
  dataSource = new MatTableDataSource<PedidoDTO>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  estadosPedidos:any[] = [];
  operarios:any[] = [];
  cliente: string = '';
  selectedEstadoPedido: any ;
  selectedOperario: any ;

  constructor(private apiBackendService: ApiBackendService,
              private sweetAlertService: SweetAlertService,
              private localStorageService: LocalStorageService,
              private router: Router) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.apiBackendService.obtenerEstadosPedidos().subscribe(
      (response) => {
        this.estadosPedidos = response;
        this.onSubmit();
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );

    this.apiBackendService.obtenerOperarios().subscribe(
      (response) => {
        this.operarios = response;
        this.onSubmit();
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

  onSubmit() {
    this.apiBackendService.busquedaPaginadaPedido(this.cliente, this.selectedEstadoPedido, this.selectedOperario, 100).subscribe(
      (response) =>{
        const operarios: PedidoDTO[] = response.data.map((data: any) => new PedidoDTO(data));
        this.dataSource.data = operarios;
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

  editarOperario(operario:OperarioDTO) {
    this.localStorageService.setItem('operarioId', operario.operarioId);
    this.localStorageService.setItem('ocultarBotonGuardar', false);
    this.router.navigate(['/operario-formulario'])
  }

  visualizarPedido(pedido:PedidoDTO) {
    this.localStorageService.setItem('pedidoId', pedido.pedidoid);
    this.localStorageService.setItem('ocultarBotonGuardar', true);
    this.router.navigate(['/pedido-formulario'], { queryParams: { readOnly: 'true' } })
  }

  anularPedido(pedido:PedidoDTO) {
    if (pedido.estadopedido != 'ASIGNADO') {
      this.sweetAlertService.showAlertError("Solo puede eliminar pedido con estado ASIGNADO");
      return
    }

    this.sweetAlertService.showAlertPregunta("¿Desea anular el pedido?", "Aceptar")
      .then((result) => {
        if (result.isConfirmed) {
          this.apiBackendService.anularPedido(pedido.pedidoid).subscribe(
            (response) =>{
              if (Utilidades.dataDeServerEsCorrecta(response)) {
                this.sweetAlertService.showAlertSuccess(response.mensaje);
              } else {
                this.sweetAlertService.showAlertError(response.mensaje);
              }
              this.onSubmit();
            },
            (error) => {
              this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
            }
          );
        }
      });
  }

  redirectNuevoPedido() {
    this.localStorageService.removeItem('pedidoId');
    this.localStorageService.setItem('ocultarBotonGuardarPedido', false);
    this.router.navigate(['/pedido-formulario']);
  }

}
