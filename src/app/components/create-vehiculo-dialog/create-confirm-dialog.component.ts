import { Component, Inject } from '@angular/core';
import { Vehiculo } from '../../models/vehiculo.type';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-confirm-dialog',
  templateUrl: './create-confirm-dialog.component.html',
  styleUrl: './create-confirm-dialog.component.css',
})
export class CreateVehiculoDialog {
  vehiculo: Vehiculo;
  imagenPrevia: string | null = null;
  modoEdicion: boolean;

  constructor(
    private dialogRef: MatDialogRef<CreateVehiculoDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: { vehiculo: Vehiculo; modoEdicion: boolean }
  ) {
    this.vehiculo = { ...data.vehiculo };
    this.modoEdicion = data.modoEdicion;

    if (this.vehiculo.fotografia) {
      this.imagenPrevia = this.vehiculo.fotografia;
    }
  }

  cancelar() {
    this.dialogRef.close(null);
  }

  guardar() {
    if (this.modoEdicion) {
      this.dialogRef.close({ vehiculo: this.vehiculo, accion: 'editar' });
    } else {
      this.dialogRef.close({ vehiculo: this.vehiculo, accion: 'crear' });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Para el evento de arrastrear y soltar archivos
  onDrop(event: DragEvent) {
    event.preventDefault();
    const archivo = event.dataTransfer?.files[0];
    if (archivo) {
      this.subirArchivo(archivo);
    }
  }

  // Para el evento de selección de archivos desde el input
  subirImagen(event: any) {
    this.subirArchivo(event.target.files[0]);
  }

  private subirArchivo(archivo: File) {
    if (archivo) {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => {
        this.imagenPrevia = reader.result as string;
        this.vehiculo.fotografia = this.imagenPrevia;
      };
    }
  }
}
