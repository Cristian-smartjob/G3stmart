/**
 * Historia de tasas de cambio para diferentes monedas
 */
export interface CurrencyHistory {
  /** Valor de la Unidad de Fomento (UF) */
  uf: number;
  /** Valor del Dólar estadounidense (USD) */
  usd: number;
  /** Fecha de la cotización en formato ISO */
  date: string;
}

/**
 * Estado del componente CurrencyCard
 */
export interface CurrencyCardState {
  /** Datos de las monedas */
  currency: CurrencyHistory | null;
  /** Indica si está cargando los datos */
  loading: boolean;
  /** Mensaje de error si hay algún problema */
  error: string | null;
  /** Indica si está actualizando los datos */
  updating: boolean;
}

/**
 * Resultado del hook useCurrencyCard
 */
export interface UseCurrencyCardResult {
  /** Datos de las monedas */
  currency: CurrencyHistory | null;
  /** Indica si está cargando los datos */
  loading: boolean;
  /** Mensaje de error si hay algún problema */
  error: string | null;
  /** Indica si está actualizando los datos */
  updating: boolean;
  /** Función para actualizar manualmente los datos de las monedas */
  updateCurrency: () => Promise<void>;
  /** Verifica si la fecha de los datos corresponde al día actual */
  isToday: () => boolean;
}
