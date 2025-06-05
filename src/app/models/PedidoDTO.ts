export class PedidoDTO {
  pedidoid: number;
  cliente: string;
  direccion: string;
  nropedido: number;
  operario: string;
  estadopedido: string;

  constructor(data:any) {
    this.pedidoid = data.pedidoid;
    this.cliente = data.cliente;
    this.direccion = data.direccion;
    this.nropedido = data.nropedido;
    this.operario = data.operario;
    this.estadopedido = data.estadopedido;
  }
}
