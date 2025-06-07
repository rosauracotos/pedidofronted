export class Validaciones {
  static validarSoloNumeros(valor: string): string {
    return valor.replace(/\D/g, '');
  }

  static validarSoloLetras(valor: string): boolean {
    return /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(valor);
  }

  static validarPlaca(placa: string): boolean {
    return /^[A-Z]{3}-\d{3,4}$/.test(placa);
  }
}
