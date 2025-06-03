import { useEffect, useState } from "react";
import axios from "axios";
import {
  CurrencyCardState,
  CurrencyHistory,
  UseCurrencyCardResult,
  UFUpdateResponse,
  USDUpdateResponse,
} from "./types";

/**
 * Verifica si una fecha es fin de semana (sábado o domingo)
 * @param date Fecha a verificar
 * @returns true si es sábado o domingo
 */
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = domingo, 6 = sábado
};

/**
 * Obtiene la fecha actual en zona horaria de Santiago de Chile
 * @returns Fecha en formato YYYY-MM-DD
 */
const getTodayInSantiago = (): string => {
  const now = new Date();

  // Usar Intl.DateTimeFormat para obtener fecha en Santiago de manera más precisa
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const result = formatter.format(now); // Devuelve formato YYYY-MM-DD

  return result;
};

/**
 * Verifica si una fecha es futura comparada con hoy (en zona horaria de Santiago)
 * @param dateString Fecha en formato ISO
 * @returns true si la fecha es futura
 */
const isFutureDate = (dateString: string): boolean => {
  const today = getTodayInSantiago();
  return dateString > today;
};

/**
 * Formatea una fecha para mostrar
 * @param dateString Fecha en formato ISO
 * @returns Fecha formateada
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-CL");
};

/**
 * Verifica si hay datos UF desde hoy hacia adelante en la base de datos
 * @param today Fecha actual en formato YYYY-MM-DD
 * @returns Promise<boolean> true si hay datos UF futuros o de hoy
 */
const checkFutureData = async (today: string): Promise<boolean> => {
  try {
    // Verificar si hay datos para hoy
    const todayResponse = await axios.get(`/api/currency-history/latest?date=${today}`);
    if (todayResponse.data.data && todayResponse.data.data.uf > 0) {
      return true; // Hay datos para hoy
    }

    // Si no hay datos para hoy, verificar si hay datos futuros
    // Verificar los próximos 7 días como muestra
    const todayDate = new Date(today);
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(todayDate);
      futureDate.setDate(futureDate.getDate() + i);
      const futureDateString = futureDate.toISOString().split("T")[0];

      const futureResponse = await axios.get(`/api/currency-history/latest?date=${futureDateString}`);
      if (futureResponse.data.data && futureResponse.data.data.uf > 0) {
        return true; // Hay datos futuros
      }
    }

    return false; // No hay datos desde hoy hacia adelante
  } catch (error) {
    console.log("Error verificando datos futuros:", error);
    return false;
  }
};

/**
 * Verifica si hay datos USD desde hoy hacia adelante en la base de datos
 * @param today Fecha actual en formato YYYY-MM-DD
 * @returns Promise<boolean> true si hay datos USD futuros o de hoy
 */
const checkFutureDataUSD = async (today: string): Promise<boolean> => {
  try {
    // Verificar si hay datos USD para hoy
    const todayResponse = await axios.get(`/api/currency-history/latest?date=${today}&currency=usd`);
    if (todayResponse.data.data && todayResponse.data.data.usd > 0) {
      return true; // Hay datos USD para hoy
    }

    // Si no hay datos para hoy, verificar si hay datos futuros
    // Verificar los próximos 7 días como muestra
    const todayDate = new Date(today);
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(todayDate);
      futureDate.setDate(futureDate.getDate() + i);
      const futureDateString = futureDate.toISOString().split("T")[0];

      const futureResponse = await axios.get(`/api/currency-history/latest?date=${futureDateString}&currency=usd`);
      if (futureResponse.data.data && futureResponse.data.data.usd > 0) {
        return true; // Hay datos USD futuros
      }
    }

    return false; // No hay datos USD desde hoy hacia adelante
  } catch (error) {
    console.log("Error verificando datos futuros USD:", error);
    return false;
  }
};

/**
 * Hook personalizado para manejar la lógica del componente CurrencyCard refactorizado
 * @returns Estado y funciones para controlar el componente CurrencyCard
 */
export const useCurrencyCard = (): UseCurrencyCardResult => {
  // Estado inicial del componente
  const [state, setState] = useState<CurrencyCardState>({
    uf: {
      value: null,
      date: null,
      loading: false,
      updating: false,
      error: null,
      successMessage: null,
      isFuture: false,
      lastUpdated: null,
      lastRecordInfo: null,
      lastRecordDate: null,
      hasFutureData: false,
    },
    usd: {
      value: null,
      date: null,
      loading: false,
      updating: false,
      error: null,
      successMessage: null,
      lastUpdated: null,
      fallbackInfo: null,
      lastRecordDate: null,
      hasFutureData: false,
    },
    initialLoading: false,
    generalError: null,
  });

  /**
   * Obtiene los últimos valores de las monedas desde el endpoint legacy
   */
  const fetchInitialData = async (): Promise<void> => {
    setState((prev) => ({
      ...prev,
      initialLoading: true,
      generalError: null,
      uf: { ...prev.uf, error: null },
      usd: { ...prev.usd, error: null },
    }));

    try {
      const today = getTodayInSantiago();

      // Intentar obtener el valor UF del día actual primero
      let todayUFData: CurrencyHistory | null = null;
      let latestData: CurrencyHistory | null = null;
      let lastRecordDate: string | null = null;

      try {
        const todayRes = await axios.get(`/api/currency-history/latest?date=${today}`);
        if (todayRes.data.data) {
          todayUFData = todayRes.data.data as CurrencyHistory;
        }
        // Obtener la última fecha cargada si está disponible
        if (todayRes.data.lastRecordDate) {
          lastRecordDate = todayRes.data.lastRecordDate;
        }
      } catch {
        console.log("No hay valor UF para hoy");
      }

      // Obtener el valor más reciente (para USD y como fallback para UF)
      try {
        const latestRes = await axios.get("/api/currency-history/latest");
        latestData = latestRes.data.data as CurrencyHistory;
        // Si no obtuvimos la última fecha antes, obtenerla ahora
        if (!lastRecordDate && latestRes.data.lastRecordDate) {
          lastRecordDate = latestRes.data.lastRecordDate;
        }
      } catch {
        console.error("Error obteniendo datos más recientes");
      }

      if (!latestData) {
        setState((prev) => ({
          ...prev,
          generalError: "No hay datos disponibles de monedas",
          initialLoading: false,
        }));
        return;
      }

      const now = new Date().toISOString();

      // Verificar si hay datos futuros para UF
      const hasFutureData = await checkFutureData(today);

      // Verificar si hay datos futuros para USD
      const hasFutureDataUSD = await checkFutureDataUSD(today);

      // Determinar qué valor UF usar y generar mensaje informativo
      let ufValue: number | null;
      let ufDate: string;
      let lastRecordInfo: string | null = null;

      if (todayUFData) {
        // Usar valor del día actual
        ufValue = todayUFData.uf;
        ufDate = todayUFData.date;
        lastRecordInfo = null; // No necesitamos mostrar info adicional
      } else {
        // Usar el valor más reciente disponible
        ufValue = latestData.uf;
        ufDate = latestData.date;

        // Generar mensaje informativo
        const latestDateFormatted = formatDate(latestData.date);
        const todayFormatted = formatDate(today);
        const latestDateOnly = latestData.date.split("T")[0];

        if (latestDateOnly !== today) {
          lastRecordInfo = `No hay UF para hoy (${todayFormatted}). Mostrando: ${latestDateFormatted}`;
        }
      }

      // Determinar qué valor USD usar - SIEMPRE usar la consulta específica
      let usdValue: number | null;
      let usdDate: string;
      let usdFallbackInfo: string | null = null;
      let usdLastRecordDate: string | null = null;

      // Siempre usar la consulta específica de USD
      try {
        const timestamp = Date.now();
        const usdRes = await axios.get(`/api/currency-history/latest?date=${today}&currency=usd&_t=${timestamp}`);

        if (usdRes.data.data) {
          const usdData = usdRes.data.data as CurrencyHistory;
          usdValue = usdData.usd;
          usdDate = usdData.date;

          // Obtener la última fecha cargada si está disponible
          if (usdRes.data.lastRecordDate) {
            usdLastRecordDate = usdRes.data.lastRecordDate;
          }

          // Si hay información de fallback, generar mensaje
          if (usdData.usdFallback) {
            const fallbackDateFormatted = formatDate(usdData.usdFallback.date);
            const todayFormatted = formatDate(today);

            if (usdData.usdFallback.reason === "current_value_is_zero") {
              usdFallbackInfo = `USD para hoy (${todayFormatted}) es $0. Mostrando: ${fallbackDateFormatted}`;
            }
          }
        } else {
          throw new Error("No data returned");
        }
      } catch (error) {
        console.log("❌ Error en consulta USD específica, usando fallback:", error);
        // Fallback al valor general
        usdValue = latestData.usd;
        usdDate = latestData.date;
        console.log("🔄 Using fallback USD data:", { usdValue, usdDate });

        // Si no obtuvimos la última fecha antes, obtenerla del fallback
        if (!usdLastRecordDate && lastRecordDate) {
          usdLastRecordDate = lastRecordDate;
        }

        const latestDateFormatted = formatDate(latestData.date);
        const todayFormatted = formatDate(today);
        const latestDateOnly = latestData.date.split("T")[0];

        if (latestDateOnly !== today) {
          usdFallbackInfo = `No hay USD para hoy (${todayFormatted}). Mostrando: ${latestDateFormatted}`;
        }
      }

      setState((prev) => ({
        ...prev,
        uf: {
          ...prev.uf,
          value: ufValue,
          date: ufDate,
          isFuture: isFutureDate(ufDate),
          lastUpdated: now,
          error: ufValue === null ? "No disponible" : null,
          lastRecordInfo,
          lastRecordDate,
          hasFutureData,
        },
        usd: {
          ...prev.usd,
          value: usdValue,
          date: usdDate,
          lastUpdated: now,
          error: usdValue === null ? "No disponible" : null,
          fallbackInfo: usdFallbackInfo,
          lastRecordDate: usdLastRecordDate,
          hasFutureData: hasFutureDataUSD,
        },
        initialLoading: false,
        generalError: null,
      }));
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setState((prev) => ({
        ...prev,
        generalError: "No se pudo obtener el valor de las monedas",
        initialLoading: false,
      }));
    }
  };

  /**
   * Actualiza valores UF anticipadamente
   */
  const updateUF = async (monthsForward: number = 2): Promise<void> => {
    // Verificar si hoy es fin de semana (en zona horaria de Santiago)
    const todayString = getTodayInSantiago();
    const today = new Date(todayString + "T12:00:00");
    if (isWeekend(today)) {
      setState((prev) => ({
        ...prev,
        uf: {
          ...prev.uf,
          error: "No es día hábil. No se pueden actualizar los datos UF hoy.",
        },
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      uf: {
        ...prev.uf,
        updating: true,
        error: null,
        successMessage: null,
      },
    }));

    try {
      const response = await axios.post("/api/currency-history/update/uf", {
        monthsForward,
      });

      const data = response.data as UFUpdateResponse;

      if (data.success) {
        // Actualizar datos después de la actualización exitosa
        await fetchInitialData();

        // Generar mensaje de éxito basado en la nueva estructura
        const { summary } = data;
        const yearsText = summary.processedYears.join(", ");
        const dateRangeText =
          summary.dateRange.minDate && summary.dateRange.maxDate
            ? `desde ${formatDate(summary.dateRange.minDate)} hasta ${formatDate(summary.dateRange.maxDate)}`
            : "datos completos";

        const successMsg = `✅ UF actualizada para año(s) ${yearsText} (${summary.totalInserted} nuevos, ${summary.totalUpdated} actualizados, ${summary.totalSkipped} omitidos) - ${dateRangeText}`;

        setState((prev) => ({
          ...prev,
          uf: {
            ...prev.uf,
            updating: false,
            successMessage: successMsg,
            lastUpdated: new Date().toISOString(),
          },
        }));

        // Limpiar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            uf: { ...prev.uf, successMessage: null },
          }));
        }, 5000);
      } else {
        setState((prev) => ({
          ...prev,
          uf: {
            ...prev.uf,
            updating: false,
            error: data.message || "Error actualizando UF",
          },
        }));
      }
    } catch (error) {
      console.error("Error updating UF:", error);
      let errorMessage = "Error actualizando valores UF";

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setState((prev) => ({
        ...prev,
        uf: {
          ...prev.uf,
          updating: false,
          error: errorMessage,
        },
      }));
    }
  };

  /**
   * Actualiza valor USD del día o del año completo
   */
  const updateUSD = async (loadFullYear: boolean = false): Promise<void> => {
    // Verificar si hoy es fin de semana (en zona horaria de Santiago)
    const todayString = getTodayInSantiago();
    const today = new Date(todayString + "T12:00:00");
    if (isWeekend(today)) {
      setState((prev) => ({
        ...prev,
        usd: {
          ...prev.usd,
          error: "No es día hábil. No se pueden actualizar los datos USD hoy.",
        },
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      usd: {
        ...prev.usd,
        updating: true,
        error: null,
        successMessage: null,
      },
    }));

    try {
      const response = await axios.post("/api/currency-history/update/usd", {
        loadFullYear,
      });
      const data = response.data as USDUpdateResponse;

      if (data.success) {
        // Actualizar datos después de la actualización exitosa
        await fetchInitialData();

        // Generar mensaje de éxito basado en el tipo de actualización
        let successMsg = "";

        if (loadFullYear && data.summary) {
          // Mensaje para año completo
          const { summary } = data;
          const dateRangeText =
            summary.dateRange.minDate && summary.dateRange.maxDate
              ? `desde ${formatDate(summary.dateRange.minDate)} hasta ${formatDate(summary.dateRange.maxDate)}`
              : "datos completos";

          successMsg = `✅ USD actualizado para año ${summary.year} (${summary.totalInserted} nuevos, ${summary.totalUpdated} actualizados, ${summary.totalSkipped} omitidos) - ${dateRangeText}`;
        } else if (data.data) {
          // Mensaje para día específico
          switch (data.data.action) {
            case "created":
              successMsg = `✅ USD creado para ${formatDate(data.data.date)}: $${data.data.usdValue.toLocaleString(
                "es-CL"
              )}`;
              break;
            case "updated":
              successMsg = `✅ USD actualizado para ${formatDate(data.data.date)}: $${data.data.usdValue.toLocaleString(
                "es-CL"
              )}`;
              break;
            case "unchanged":
              successMsg = `✅ USD ya está actualizado para ${formatDate(
                data.data.date
              )}: $${data.data.usdValue.toLocaleString("es-CL")}`;
              break;
          }
        }

        setState((prev) => ({
          ...prev,
          usd: {
            ...prev.usd,
            updating: false,
            successMessage: successMsg,
            lastUpdated: new Date().toISOString(),
          },
        }));

        // Limpiar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            usd: { ...prev.usd, successMessage: null },
          }));
        }, 5000);
      } else {
        setState((prev) => ({
          ...prev,
          usd: {
            ...prev.usd,
            updating: false,
            error: data.message || "Error actualizando USD",
          },
        }));
      }
    } catch (error) {
      console.error("Error updating USD:", error);
      let errorMessage = "Error actualizando valor USD";

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setState((prev) => ({
        ...prev,
        usd: {
          ...prev.usd,
          updating: false,
          error: errorMessage,
        },
      }));
    }
  };

  /**
   * Limpia mensajes de éxito
   */
  const clearSuccessMessages = (): void => {
    setState((prev) => ({
      ...prev,
      uf: { ...prev.uf, successMessage: null },
      usd: { ...prev.usd, successMessage: null },
    }));
  };

  /**
   * Limpia errores
   */
  const clearErrors = (): void => {
    setState((prev) => ({
      ...prev,
      uf: { ...prev.uf, error: null },
      usd: { ...prev.usd, error: null },
      generalError: null,
    }));
  };

  // Cargar los datos al montar el componente
  useEffect(() => {
    fetchInitialData();
  }, []);

  return {
    uf: state.uf,
    usd: state.usd,
    initialLoading: state.initialLoading,
    generalError: state.generalError,
    updateUF,
    updateUSD,
    fetchInitialData,
    clearSuccessMessages,
    clearErrors,
  };
};
