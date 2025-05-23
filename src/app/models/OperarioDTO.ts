export class OperarioDTO {
  estadoOperario: string;
  numDocumento: string;
  operarioId: number;
  brevete: string;
  categoria: string;
  persona: string;

  constructor(data:any) {
    this.estadoOperario = data.estadoOperario;
    this.numDocumento = data.numDocumento;
    this.operarioId = data.operadorId;
    this.brevete = data.brevete;
    this.categoria = data.categoria;
    this.persona = data.persona;
  }
}
