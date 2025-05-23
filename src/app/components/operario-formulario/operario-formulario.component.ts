import { Component } from '@angular/core';
import {ApiBackendService} from "../../services/ApiBackendService/api.backend.service";
import {SweetAlertService} from "../../services/SweetAlertService/sweet.alert.service";
import {LocalStorageService} from "../../services/LocalStorageService/local.storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Utilidades} from "../../../utils/utilidades";

@Component({
  selector: 'app-operario-formulario',
  templateUrl: './operario-formulario.component.html',
  styleUrl: './operario-formulario.component.css'
})
export class OperarioFormularioComponent {

  ocultarBotonGuardar: boolean = false;

  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  nombre: string = '';
  numeroCelular: string = '';
  selectedTipoDocumento: any ;
  numeroDocumento: string = '';
  email: string = '';
  selectedDepartamento: any ;
  selectedProvincia: any ;
  selectedDistrito: any ;
  direccion: string = '';
  nroBrevete: string = '';
  categoria: string = '';
  selectedDateVencimiento: string = '';

  tiposDocumentos : any[] = [];
  departamentos : any[] = [];
  provincias : any[] = [];
  distritos : any[] = [];

  operarioId: any;

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
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
    this.apiBackendService.obtenerDepartamentos().subscribe(
      (response) => {
        this.departamentos = response;
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
    this.operarioId = this.localStorageService.getItem("operarioId");
    this.ocultarBotonGuardar = this.localStorageService.getItem("ocultarBotonGuardar");
    console.log(this.operarioId);
    if (!Utilidades.esNullOUndefinedoVacio(this.operarioId)) {
      this.obtenerDatosOperario(this.operarioId);
    };
    this.route.queryParams.subscribe(params => {
      this.isReadOnly = params['readOnly'] === 'true';
    });
  }

  obtenerDatosOperario(operarioId: number) {
    this.apiBackendService.obtenerOperarioPorId(operarioId).subscribe(
      (response) => {
        this.apellidoPaterno = response.apePaterno;
        this.apellidoMaterno = response.apeMaterno;
        this.nombre = response.nombres;
        this.numeroCelular = response.numeroCelular;
        this.selectedTipoDocumento = response.tipoDocumento.id;
        this.numeroDocumento = response.numeroDocumento;
        this.email = response.correoElectronico;
        this.selectedDepartamento = response.ubigeoDistrito.ubigeoProvincia.ubigeoDepartamento.id;
        this.selectedProvincia = response.ubigeoDistrito.ubigeoProvincia.id;
        this.selectedDistrito = response.ubigeoDistrito.id;
        this.direccion = response.direccion;
        this.nroBrevete = response.numeroBrevete;
        this.categoria = response.categoriaBrevete;
        this.selectedDateVencimiento = response.fechaVencimientoBrevete;

        this.apiBackendService.obtenerProvinciasPorDepartamento(this.selectedDepartamento).subscribe(
          (response) => {
            this.provincias = response;
          },
          (error) => {
            this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
          }
        );

        this.apiBackendService.obtenerDistrirosPorProvincia(this.selectedProvincia).subscribe(
          (response) => {
            this.distritos = response;
          },
          (error) => {
            this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
          }
        );

      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

  onSubmit() {
    const fecha = new Date(this.selectedDateVencimiento);
    const año = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    const fechaFormateada = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

    if (!Utilidades.esNullOUndefinedoVacio(this.operarioId)) {
      this.apiBackendService.editarOperario(this.apellidoPaterno, this.apellidoMaterno, this.nombre,
        this.numeroCelular, this.selectedTipoDocumento, this.numeroDocumento, this.email, this.selectedDistrito,
        this.direccion, this.nroBrevete, this.categoria, fechaFormateada, this.operarioId).subscribe(
        (response) =>{
          this.sweetAlertService.showAlertSuccess(response.mensaje);
          this.router.navigate(['/operario'])
        },
        (error) => {
          this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
        }
      );
    } else {
      this.apiBackendService.guardarOperario(this.apellidoPaterno, this.apellidoMaterno, this.nombre,
        this.numeroCelular, this.selectedTipoDocumento, this.numeroDocumento, this.email, this.selectedDistrito,
        this.direccion, this.nroBrevete, this.categoria, fechaFormateada).subscribe(
        (response) =>{
          this.sweetAlertService.showAlertSuccess(response.mensaje);
          this.router.navigate(['/operario'])
        },
        (error) => {
          this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
        }
      );
    }
  }

  onDepartamentoSelectionChange(event: any) {
    this.selectedProvincia = null;
    this.selectedDistrito = null;
    this.apiBackendService.obtenerProvinciasPorDepartamento(this.selectedDepartamento).subscribe(
      (response) => {
        this.provincias = response;
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

  onProvinciaSelectionChange(event:any) {
    this.selectedDistrito = null;
    this.apiBackendService.obtenerDistrirosPorProvincia(this.selectedProvincia).subscribe(
      (response) => {
        this.distritos = response;
      },
      (error) => {
        this.sweetAlertService.showAlertError("Ocurrió un error al conectar al servidor");
      }
    );
  }

  cancelar() {
    this.router.navigate(['/operario'])
  }

}
