export class ProductoDTO {
  productoId: number;
  producto: string;
  codigo: string;
  cantidad: number;

  constructor(data:any) {
    this.productoId = data.productoId;
    this.producto = data.producto;
    this.codigo = data.codigo;
    this.cantidad = data.cantidad;
  }
}
