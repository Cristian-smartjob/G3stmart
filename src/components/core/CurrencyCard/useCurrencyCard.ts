import { useEffect, useState } from "react";
import axios from "axios";
import { CurrencyCardState, CurrencyHistory, UseCurrencyCardResult } from "./types";

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
 * Hook personalizado para manejar la lógica del componente CurrencyCard
 * @returns Estado y funciones para controlar el componente CurrencyCard
 */
export const useCurrencyCard = (): UseCurrencyCardResult => {
  // Estado inicial del componente
  const [state, setState] = useState<CurrencyCardState>({
    currency: null,
    loading: false,
    error: null,
    updating: false,
  });

  const { currency, loading, error, updating } = state;

  /**
   * Obtiene los últimos valores de las monedas
   */
  const fetchCurrency = async (): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await axios.get("/api/currency-history/latest");
      const currencyData = res.data.data as CurrencyHistory;

      // Verificar si hay datos nulos o sin valores
      if (!currencyData) {
        setState((prev) => ({
          ...prev,
          error: "No hay datos disponibles de monedas",
          loading: false,
        }));
        return;
      }

      // Verificar específicamente si algún valor viene como null
      if (currencyData.uf === null && currencyData.usd === null) {
        // Verificar si hoy es fin de semana
        const today = new Date();
        if (isWeekend(today)) {
          setState((prev) => ({
            ...prev,
            error: "No es día hábil. Aún no hay datos disponibles para actualizar.",
            loading: false,
            currency: currencyData, // Mantener la fecha aunque no haya valores
          }));
        } else {
          setState((prev) => ({
            ...prev,
            error: "No hay datos disponibles para ninguna moneda",
            loading: false,
            currency: currencyData,
          }));
        }
        return;
      }

      // Si solo alguna moneda viene como null, seguimos mostrando la información
      setState((prev) => {
        // Verificar si es fin de semana y algún valor es nulo
        const today = new Date();
        let errorMessage = null;

        if (currencyData.uf === null || currencyData.usd === null) {
          if (isWeekend(today)) {
            errorMessage = "No es día hábil. Algunos datos no están disponibles.";
          } else {
            errorMessage = "No hay datos disponibles para algunas monedas";
          }
        }

        return {
          ...prev,
          currency: currencyData,
          loading: false,
          error: errorMessage,
        };
      });
    } catch (e) {
      console.error(e);
      setState((prev) => ({
        ...prev,
        error: "No se pudo obtener el valor de las monedas",
        loading: false,
      }));
    }
  };

  /**
   * Actualiza manualmente los valores de las monedas
   */
  const updateCurrency = async (): Promise<void> => {
    // Verificar si hoy es fin de semana antes de intentar actualizar
    const today = new Date();
    if (isWeekend(today)) {
      setState((prev) => ({
        ...prev,
        error: "No es día hábil. No se pueden actualizar los datos hoy.",
        updating: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, updating: true, error: null }));

    try {
      await axios.post("/api/currency-history/update");
      await fetchCurrency();
    } catch (e) {
      console.error(e);
      setState((prev) => ({
        ...prev,
        error: "No se pudo actualizar el valor de las monedas",
        updating: false,
      }));
    } finally {
      setState((prev) => ({ ...prev, updating: false }));
    }
  };

  /**
   * Verifica si la fecha de los datos corresponde al día actual
   */
  const isToday = (): boolean => {
    if (!currency) return false;
    const today = new Date().toISOString().substring(0, 10);
    return currency.date.substring(0, 10) === today;
  };

  // Cargar los datos al montar el componente
  useEffect(() => {
    fetchCurrency();
  }, []);

  return {
    currency,
    loading,
    error,
    updating,
    updateCurrency,
    isToday,
  };
};
