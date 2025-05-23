export class Utilidades {

  static  esNullOUndefined(variable:any) {
    return typeof variable === "undefined" || variable == undefined || variable == null;
  }

  static dataDeServerEsCorrecta(data:any) {
    return (!this.esNullOUndefined(data) && !this.esNullOUndefined(data.estado) && data.estado == "exito");
  }

  static esNullOUndefinedoVacio(variable:any) {
    return this.esNullOUndefined(variable) || variable === "" || (typeof variable == "string" && variable.trim() === "");
  }

  static formatMesNumero(month: number) {
    return String(month).padStart(2, '0');
  }

}


