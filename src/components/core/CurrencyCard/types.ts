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
  /** Información de fallback para USD cuando el valor actual es 0 */
  usdFallback?: {
    value: number;
    date: string;
    reason: "current_value_is_zero" | "latest_value_is_zero";
  };
}

/**
 * Estado específico para UF
 */
export interface UFState {
  /** Valor UF actual */
  value: number | null;
  /** Fecha del valor UF */
  date: string | null;
  /** Indica si está cargando */
  loading: boolean;
  /** Indica si está actualizando */
  updating: boolean;
  /** Mensaje de error específico */
  error: string | null;
  /** Mensaje de éxito */
  successMessage: string | null;
  /** Indica si es un valor futuro */
  isFuture: boolean;
  /** Última fecha de actualización */
  lastUpdated: string | null;
  /** Información sobre el último registro disponible */
  lastRecordInfo: string | null;
  /** Última fecha cargada en la base de datos */
  lastRecordDate: string | null;
  /** Indica si hay datos desde hoy hacia adelante */
  hasFutureData: boolean;
}

/**
 * Estado específico para USD
 */
export interface USDState {
  /** Valor USD actual */
  value: number | null;
  /** Fecha del valor USD */
  date: string | null;
  /** Indica si está cargando */
  loading: boolean;
  /** Indica si está actualizando */
  updating: boolean;
  /** Mensaje de error específico */
  error: string | null;
  /** Mensaje de éxito */
  successMessage: string | null;
  /** Última fecha de actualización */
  lastUpdated: string | null;
  /** Información sobre el último registro válido cuando el actual es 0 */
  fallbackInfo: string | null;
  /** Última fecha cargada en la base de datos */
  lastRecordDate: string | null;
  /** Indica si hay datos desde hoy hacia adelante */
  hasFutureData: boolean;
}

/**
 * Estado del componente CurrencyCard refactorizado
 */
export interface CurrencyCardState {
  /** Estado de UF */
  uf: UFState;
  /** Estado de USD */
  usd: USDState;
  /** Indica si está cargando los datos iniciales */
  initialLoading: boolean;
  /** Error general del componente */
  generalError: string | null;
}

/**
 * Resultado del hook useCurrencyCard refactorizado
 */
export interface UseCurrencyCardResult {
  /** Estado de UF */
  uf: UFState;
  /** Estado de USD */
  usd: USDState;
  /** Indica si está cargando los datos iniciales */
  initialLoading: boolean;
  /** Error general del componente */
  generalError: string | null;
  /** Función para actualizar UF anticipadamente */
  updateUF: (monthsForward?: number) => Promise<void>;
  /** Función para actualizar USD del día o del año completo */
  updateUSD: (loadFullYear?: boolean) => Promise<void>;
  /** Función para cargar datos iniciales */
  fetchInitialData: () => Promise<void>;
  /** Función para limpiar mensajes de éxito */
  clearSuccessMessages: () => void;
  /** Función para limpiar errores */
  clearErrors: () => void;
}

/**
 * Respuesta del endpoint de actualización UF (nueva estructura)
 */
export interface UFUpdateResponse {
  success: boolean;
  message: string;
  summary: {
    monthsForward: number;
    yearsProcessed: number;
    totalInserted: number;
    totalUpdated: number;
    totalSkipped: number;
    totalErrors: number;
    dateRange: {
      minDate: string | null;
      maxDate: string | null;
    };
    processedYears: string[];
    errorYears?: string[];
  };
}

/**
 * Respuesta del endpoint de actualización USD
 */
export interface USDUpdateResponse {
  success: boolean;
  message: string;
  data?: {
    date: string;
    usdValue: number;
    action: "created" | "updated" | "unchanged";
    previousValue?: number;
  };
  summary?: {
    year: number;
    totalInserted: number;
    totalUpdated: number;
    totalSkipped: number;
    totalErrors: number;
    totalProcessed: number;
    dateRange: {
      minDate: string | null;
      maxDate: string | null;
    };
  };
}
