import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import type { Vehiculo } from '../../models/vehiculo.type';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateVehiculoDialog } from '../create-vehiculo-dialog/create-confirm-dialog.component';
import { ImagenService } from '../../services/AssetsService/image.service';
import { VehiculoService } from '../../services/ApiBackendService/apiBackendVehiculo.service';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.css',
})
export class VehiculoComponent {
  vehiculos = new MatTableDataSource<Vehiculo>([]);
  vehiculosOriginales: Vehiculo[] = [];
  filtroVehiculo: Partial<Vehiculo> = {};
  nuevoVehiculo: Omit<Vehiculo, 'id'> = {
    estado: true,
    anio: new Date().getFullYear(),
    fotografia: '',
    marca: '',
    placa: '',
    tipoVehiculo: '',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private imagenService: ImagenService,
    private _snackBar: MatSnackBar,
    private vehiculoService: VehiculoService
  ) {}

  displayedColumns: string[] = [
    'estado',
    'anio',
    'marca',
    'placa',
    'tipoVehiculo',
    'fotografia',
    'acciones',
  ];

  ngOnInit(): void {
    this.listarVehiculos();
  }

  ngAfterViewInit() {
    this.vehiculos.paginator = this.paginator;
  }

  listarVehiculos() {
    this.vehiculoService.listarVehiculos().subscribe((data) => {
      this.vehiculosOriginales = data;
      this.vehiculos.data = data;
    });
  }

  agregarVehiculo() {
    const dialogRef = this.dialog.open(CreateVehiculoDialog, {
      data: { vehiculo: this.nuevoVehiculo },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      const { vehiculo, accion } = resultado || {};
      if (accion !== 'crear') return;
      if (!vehiculo) return;

      if (vehiculo.fotografia) {
        this.imagenService
          .subirImagen(vehiculo.fotografia)
          .then((urlImagen) => {
            if (!urlImagen) {
              throw new Error('Error al subir imagen. No se obtuvo URL.');
            }
            vehiculo.fotografia = urlImagen;
            return this.crearVehiculo(vehiculo);
          })
          .catch((error) => {
            console.error('Error al subir imagen:', error);
            this._snackBar.open(
              'Error al subir la imagen. No se guardará el vehículo.',
              'Cerrar',
              { duration: 3000 }
            );
          });
      } else {
        this.crearVehiculo(vehiculo);
      }
    });
  }

  private crearVehiculo(vehiculo: Vehiculo) {
    this.vehiculoService.crearVehiculo(vehiculo).subscribe({
      next: (vehiculoGuardado) => {
        this.vehiculos.data = [...this.vehiculos.data, vehiculoGuardado];
        this.vehiculosOriginales = [
          ...this.vehiculosOriginales,
          vehiculoGuardado,
        ];
        this._snackBar.open('Vehículo agregado correctamente.', 'Cerrar', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Error al agregar vehículo:', err);
        this._snackBar.open(
          'Error al agregar vehículo. Inténtalo nuevamente.',
          'Cerrar',
          { duration: 3000 }
        );
      },
    });
  }

  editarVehiculo(vehiculo: Vehiculo) {
    const dialogRef = this.dialog.open(CreateVehiculoDialog, {
      data: { vehiculo, modoEdicion: true },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      const { vehiculo, accion } = resultado || {};
      if (accion !== 'editar') return;
      if (!vehiculo) return;

      if (vehiculo.fotografia) {
        this.imagenService
          .subirImagen(vehiculo.fotografia)
          .then((urlImagen) => {
            if (!urlImagen) {
              throw new Error('Error al subir imagen. No se obtuvo URL.');
            }
            vehiculo.fotografia = urlImagen;
            this.actualizarVehiculo(vehiculo);
          })
          .catch((error) => {
            console.error('Error al subir imagen:', error);
            this._snackBar.open(
              'Error al subir la imagen. No se actualizará el vehículo.',
              'Cerrar',
              { duration: 3000 }
            );
          });
      } else {
        this.actualizarVehiculo(vehiculo);
      }
    });
  }

  private actualizarVehiculo(vehiculo: Vehiculo) {
    this.vehiculoService.actualizarVehiculo(vehiculo.id, vehiculo).subscribe({
      next: (vehiculoActualizado) => {
        this.vehiculos.data = this.vehiculos.data.map((v) =>
          v.id === vehiculoActualizado.id ? { ...vehiculoActualizado } : v
        );

        this.vehiculos._updateChangeSubscription();
        this._snackBar.open('Vehículo actualizado correctamente.', 'Cerrar', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Error al actualizar vehículo:', err);
        this._snackBar.open(
          'Error al actualizar el vehículo. Inténtalo nuevamente.',
          'Cerrar',
          { duration: 3000 }
        );
      },
    });
  }

  eliminarVehiculo(vehiculo: Vehiculo) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { mensaje: '¿Estás seguro de que deseas eliminar este vehículo?' },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.vehiculoService.eliminarVehiculo(vehiculo.id).subscribe({
          next: () => {
            this.vehiculos.data = this.vehiculos.data.filter(
              (v) => v.id !== vehiculo.id
            );
            this.vehiculosOriginales = this.vehiculosOriginales.filter(
              (v) => v.id !== vehiculo.id
            );
            this._snackBar.open('Vehículo eliminado correctamente.', 'Cerrar', {
              duration: 3000,
            });
          },
          error: () => {
            this._snackBar.open('Error al eliminar el vehículo.', 'Cerrar', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  filtrarVehiculos() {
    if (this.vehiculosOriginales.length === 0) {
      this._snackBar.open(
        'No hay vehículos disponibles para filtrar.',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    this.filtroVehiculo = Object.fromEntries(
      Object.entries(this.filtroVehiculo).filter(
        ([_, valor]) => valor !== '' && valor !== undefined
      )
    );

    if (Object.keys(this.filtroVehiculo).length === 0) {
      this._snackBar.open(
        'No hay filtros aplicados, mostrando todos los vehículos.',
        'Cerrar',
        { duration: 3000 }
      );
      this.vehiculos.data = [...new Set(this.vehiculosOriginales)];
      return;
    }

    this.vehiculos.data = this.vehiculosOriginales.filter((vehiculo) =>
      Object.entries(this.filtroVehiculo).every(([key, filtroValor]) => {
        const vehiculoValor = vehiculo[key as keyof Vehiculo];

        if (typeof vehiculoValor === 'string') {
          return vehiculoValor
            .toLowerCase()
            .includes(filtroValor.toString().toLowerCase());
        }
        if (typeof vehiculoValor === 'number') {
          return vehiculoValor === Number(filtroValor);
        }
        if (typeof vehiculoValor === 'boolean') {
          return (
            vehiculoValor === (filtroValor === 'true' || filtroValor === true)
          );
        }

        return false;
      })
    );
  }

  limpiarFiltroVehiculos() {
    this.filtroVehiculo = {};
    this.vehiculos.data = [...new Set(this.vehiculosOriginales)];
    this._snackBar.open('Filtro de vehículos limpiado.', 'Cerrar', {
      duration: 3000,
    });
  }

  tieneFiltros(): boolean {
    return Object.values(this.filtroVehiculo).some(
      (value) => value !== undefined && value !== ''
    );
  }
}
