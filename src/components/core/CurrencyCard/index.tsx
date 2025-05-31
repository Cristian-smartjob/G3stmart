"use client";

import React, { useState } from "react";
import { useCurrencyCard } from "./useCurrencyCard";

/**
 * Tipos de estado para las tarjetas de moneda
 */
type CurrencyState = "success" | "future" | "error" | "normal";

/**
 * Formatea una fecha ISO a formato legible
 */
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Sin fecha";

  // Extraer solo la parte de fecha (YYYY-MM-DD) sin conversión de zona horaria
  const dateOnly = dateString.split("T")[0];
  const [year, month, day] = dateOnly.split("-");

  // Crear fecha local sin conversión UTC
  const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return localDate.toLocaleDateString("es-CL");
};

/**
 * Props para el componente CurrencyCard individual
 */
interface CurrencyCardProps {
  type: "UF" | "USD";
  value: string;
  dateValue: string;
  lastUpdated: string;
  state: CurrencyState;
  onClick: () => void;
  loading: boolean;
  lastRecordInfo?: string; // Información del último registro disponible
  lastRecordDate?: string; // Última fecha cargada en la base de datos (solo para UF)
  hasFutureData?: boolean; // Indica si hay datos desde hoy hacia adelante (solo para UF)
}

/**
 * Componente de tarjeta individual para moneda
 */
const CurrencyCard: React.FC<CurrencyCardProps> = ({
  type,
  value,
  dateValue,
  lastUpdated,
  state,
  onClick,
  loading,
  lastRecordInfo,
  lastRecordDate,
  hasFutureData,
}) => {
  // Determinar colores dinámicos basados en datos futuros (para UF y USD)
  const getDynamicColors = () => {
    const hasData = hasFutureData;

    return hasData
      ? {
          // Verde: hay datos futuros
          badge: "bg-[#29D9C2] text-white",
          border: "hover:border-[#29D9C2]",
          spinner: "border-t-[#29D9C2]",
          text: "text-[#29D9C2]",
        }
      : {
          // Naranja: no hay datos futuros
          badge: "bg-[#F99B06] text-white",
          border: "hover:border-[#F99B06]",
          spinner: "border-t-[#F99B06]",
          text: "text-[#F99B06]",
        };
  };

  const dynamicColors = getDynamicColors();

  // Colores del logo SmartJob (mantenidos para estados específicos)
  const colorMap = {
    success: "bg-[#29D9C2] text-white", // Verde/turquesa del logo
    future: dynamicColors.badge, // Dinámico para UF
    error: "bg-[#dc2626] text-white", // Rojo para errores
    normal: dynamicColors.badge, // Dinámico para UF
  };

  const borderColor = {
    default: "border-[#e2e8f0]",
    hover: `hover:shadow-md ${dynamicColors.border}`, // Dinámico
  };

  const statusText = {
    success: "Actualizado correctamente",
    future: "Valor actual cargado",
    error: "Error al cargar valor",
    normal: "Valor actual cargado",
  };

  // Spinner inline para loading
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className={`w-6 h-6 border-2 border-[#e2e8f0] ${dynamicColors.spinner} rounded-full animate-spin`}></div>
    </div>
  );

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full text-left rounded-2xl border p-4 mb-4 transition-all duration-150 
                  ${borderColor.default} ${borderColor.hover} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[#6b7280] font-medium">
          {type === "UF" ? "UF (Unidad de Fomento)" : "USD (Dólar)"}
        </span>
        <span className={`px-2 py-0.5 text-xs rounded-md ${colorMap[state]}`}>{statusText[state]}</span>
      </div>

      <div className="text-2xl font-bold text-[#1f2937] mb-1">{loading ? <LoadingSpinner /> : value}</div>

      <div className="text-xs text-[#6b7280]">Valor para: {dateValue}</div>
      <div className="text-xs text-[#6b7280]">Última actualización: {lastUpdated}</div>

      {/* Mostrar última fecha cargada en BD para UF */}
      {type === "UF" && lastRecordDate && (
        <div className="text-xs text-[#6b7280]">Última fecha en BD: {formatDate(lastRecordDate)}</div>
      )}

      {/* Mostrar última fecha cargada en BD para USD */}
      {type === "USD" && lastRecordDate && (
        <div className="text-xs text-[#6b7280]">Última fecha en BD: {formatDate(lastRecordDate)}</div>
      )}

      {/* Mostrar información del último registro si existe */}
      {type === "UF" && lastRecordInfo && (
        <div className={`text-xs ${dynamicColors.text} mt-1 font-medium`}>{lastRecordInfo}</div>
      )}

      {type === "UF" && !lastRecordInfo && (
        <div className={`text-xs ${dynamicColors.text} mt-1 font-medium`}>Datos del año en curso y siguiente</div>
      )}

      {/* Mostrar información de fallback para USD si existe */}
      {type === "USD" && lastRecordInfo && (
        <div className={`text-xs ${dynamicColors.text} mt-1 font-medium`}>{lastRecordInfo}</div>
      )}
    </button>
  );
};

/**
 * Componente principal que contiene las dos tarjetas de moneda
 */
export default function CurrencyCards(): React.ReactElement {
  const { uf, usd, initialLoading, updateUF, updateUSD } = useCurrencyCard();

  // Estados de loading separados para cada tarjeta
  const [ufLoading, setUfLoading] = useState(false);
  const [usdLoading, setUsdLoading] = useState(false);
  const [monthsForward] = useState(6); // Valor fijo más alto para aprovechar la nueva estrategia

  /**
   * Formatea un valor numérico a string con formato chileno
   */
  const formatValue = (value: number | null): string => {
    if (value === null) return "No disponible";
    return value.toLocaleString("es-CL", { maximumFractionDigits: 2 });
  };

  /**
   * Formatea timestamp de última actualización
   */
  const formatLastUpdated = (dateString: string | null): string => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleString("es-CL");
  };

  /**
   * Determina el estado de la tarjeta UF
   */
  const getUFState = (): CurrencyState => {
    if (uf.error) return "error";
    if (uf.successMessage) return "success";
    if (uf.isFuture) return "future";
    return "normal";
  };

  /**
   * Determina el estado de la tarjeta USD
   */
  const getUSDState = (): CurrencyState => {
    if (usd.error) return "error";
    if (usd.successMessage) return "success";
    return "normal";
  };

  /**
   * Maneja el click en la tarjeta UF
   */
  const handleUFClick = async () => {
    if (ufLoading) return;

    setUfLoading(true);
    try {
      await updateUF(monthsForward);
    } catch (error) {
      console.error("Error updating UF:", error);
    } finally {
      setUfLoading(false);
    }
  };

  /**
   * Maneja el click en la tarjeta USD
   */
  const handleUSDClick = async () => {
    if (usdLoading) return;

    setUsdLoading(true);
    try {
      // Cargar año completo para USD
      await updateUSD(true);
    } catch (error) {
      console.error("Error updating USD:", error);
    } finally {
      setUsdLoading(false);
    }
  };

  // Mostrar spinner de carga inicial
  if (initialLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-[#e2e8f0] border-t-[#F99B06] rounded-full animate-spin"></div>
          <span className="ml-3 text-[#6b7280]">Cargando datos de monedas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tarjeta UF */}
      <CurrencyCard
        type="UF"
        value={`$${formatValue(uf.value)}`}
        dateValue={formatDate(uf.date)}
        lastUpdated={formatLastUpdated(uf.lastUpdated)}
        state={getUFState()}
        onClick={handleUFClick}
        loading={ufLoading || uf.updating}
        lastRecordInfo={uf.lastRecordInfo || undefined}
        lastRecordDate={uf.lastRecordDate || undefined}
        hasFutureData={uf.hasFutureData}
      />

      {/* Tarjeta USD */}
      <CurrencyCard
        type="USD"
        value={`$${formatValue(usd.value)}`}
        dateValue={formatDate(usd.date)}
        lastUpdated={formatLastUpdated(usd.lastUpdated)}
        state={getUSDState()}
        onClick={handleUSDClick}
        loading={usdLoading || usd.updating}
        lastRecordInfo={usd.fallbackInfo || undefined}
        lastRecordDate={usd.lastRecordDate || undefined}
        hasFutureData={usd.hasFutureData}
      />
    </div>
  );
}
