export interface Indicador {
    codigo: string;
    nombre: string;
    unidad_medida: string;
    fecha: string; 
    valor: number;
  }
  
export interface Data {
    version: string;
    autor: string;
    fecha: string; 
    uf: Indicador;
    ivp: Indicador;
    dolar: Indicador;
    dolar_intercambio: Indicador;
    euro: Indicador;
    ipc: Indicador;
    utm: Indicador;
    imacec: Indicador;
    tpm: Indicador;
    libra_cobre: Indicador;
    tasa_desempleo: Indicador;
    bitcoin: Indicador;
  }
  