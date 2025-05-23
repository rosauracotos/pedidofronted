import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ApiBackendService} from "../../services/ApiBackendService/api.backend.service";
import {SweetAlertService} from "../../services/SweetAlertService/sweet.alert.service";
import {LocalStorageService} from "../../services/LocalStorageService/local.storage.service";
import {Router} from "@angular/router";
import {OperarioDTO} from "../../models/OperarioDTO";
import {TipoDocumento} from "../../models/TipoDocumento";
import {Utilidades} from "../../../utils/utilidades";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-operario',
  templateUrl: './operario.component.html',
  styleUrl: './operario.component.css'
})
export class OperarioComponent{

  displayedColumns: string[] = ['numdocumento','persona','brevete', 'categoria', 'estadooperario', 'acciones'];
  dataSource = new MatTableDataSource<OperarioDTO>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  tiposDocumentos:TipoDocumento[] = [];
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  nombre: string = '';
  selectedTipoDocumento: any ;
  numeroDocumento: string = '';
  estadoOperario: string = 'A';

  constructor(private apiBackendService: ApiBackendService,
              private sweetAlertService: SweetAlertService,
              private localStorageService: LocalStorageService,
              private router: Router) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.apiBackendService.obtenerTiposDocumentos().subscribe(
      (response) => {
        this.tiposDocumentos = response;
        this.onSubmit();
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

  onSubmit() {
    this.apiBackendService.busquedaPaginadaPersonal(this.apellidoPaterno, this.apellidoMaterno, this.nombre,
      this.selectedTipoDocumento, this.numeroDocumento, this.estadoOperario, 100).subscribe(
      (response) =>{
        const operarios: OperarioDTO[] = response.data.map((data: any) => new OperarioDTO(data));
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

  visualizarOperario(operario:OperarioDTO) {
    this.localStorageService.setItem('operarioId', operario.operarioId);
    this.localStorageService.setItem('ocultarBotonGuardar', true);
    this.router.navigate(['/operario-formulario'], { queryParams: { readOnly: 'true' } })
  }

  darDeBajaOperario(operario:OperarioDTO) {
    this.sweetAlertService.showAlertPregunta("¿Desea dar de baja al operario?", "Aceptar")
      .then((result) => {
        if (result.isConfirmed) {
          this.apiBackendService.darDeBajaOperario(operario.operarioId).subscribe(
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

  redirectNuevoOperario() {
    this.localStorageService.removeItem('operarioId');
    this.localStorageService.setItem('ocultarBotonGuardar', false);
    this.router.navigate(['/operario-formulario']);
  }

}
