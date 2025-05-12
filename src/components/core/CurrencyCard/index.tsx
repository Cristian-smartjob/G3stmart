"use client";

import React, { useState, useEffect } from "react";
import styles from "./CurrencyCard.module.css";
import { useCurrencyCard } from "./useCurrencyCard";
import ErrorAlert from "../ErrorAlert";
import LoadingBar from "./LoadingBar";

/**
 * Componente CurrencyCard - Muestra información actual sobre tasas de cambio
 * @returns Componente con información de UF y USD
 */
export default function CurrencyCard(): React.ReactElement {
  const { currency, loading, error, updating, updateCurrency, isToday } = useCurrencyCard();
  // Estado para controlar la visibilidad del mensaje de error
  const [showError, setShowError] = useState<boolean>(true);

  // Determinar clases de estilo según si los datos están actualizados
  const todayStatus = isToday();

  // Calcular estilos condicionales
  const cardStyle = {
    backgroundColor: todayStatus ? "rgba(41, 217, 194, 0.4)" : "#fee2e2",
    borderColor: todayStatus ? "rgba(41, 217, 194, 0.4)" : "#fca5a5",
    opacity: updating ? 0.6 : 1,
    cursor: !todayStatus && !updating && !loading ? "pointer" : "default",
  };

  const valueTextClass = todayStatus ? styles.currencyValueToday : styles.currencyValueOutdated;

  // Manejador de clic para actualizar
  const handleCardClick = () => {
    if (!todayStatus && !updating && !loading) {
      // Reiniciar el estado de showError cuando el usuario hace clic para actualizar
      setShowError(true);
      updateCurrency();
    }
  };

  // Comprobar si hay error por falta de datos o por ser día no hábil
  const isNoDataError =
    error && (error.includes("No hay datos") || error.includes("null") || error.includes("No es día hábil"));

  // Función para ocultar el mensaje de error
  const hideError = () => {
    setShowError(false);
  };

  // Determinar si mostrar la información de monedas aunque haya error
  const showCurrencyData = currency && (currency.uf !== null || currency.usd !== null);

  // Reiniciar el estado de showError cuando cambia el error
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Renderizar el spinner para estados de carga
  const renderSpinner = () => (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Cargando...</span>
      </div>
      <p className={styles.spinnerText}>{updating ? "Actualizando..." : "Cargando..."}</p>
    </div>
  );

  return (
    <div
      className={styles.card}
      style={cardStyle}
      title={currency ? `Última actualización: ${currency.date.substring(0, 10)}` : ""}
      onClick={handleCardClick}
    >
      <div className={styles.cardTitle}>
        <span>Monedas</span>
        {!todayStatus && !updating && !loading && (
          <span title="Desactualizado" className={styles.outdatedWarning}>
            ⚠️
          </span>
        )}
      </div>

      {loading || updating ? (
        renderSpinner()
      ) : (
        <>
          {isNoDataError && showError && (
            <>
              <ErrorAlert message={error || "No hay datos disponibles para algunas monedas"} />
              <LoadingBar duration={5000} onComplete={hideError} />
            </>
          )}

          {!isNoDataError && error && <div className={styles.errorText}>{error}</div>}

          {showCurrencyData && (
            <>
              <div className={styles.currencyRow}>
                <span className={styles.currencyLabel}>UF:</span>
                <span className={`${styles.currencyValue} ${valueTextClass}`}>
                  {currency.uf !== null
                    ? `$${currency.uf.toLocaleString("es-CL", { maximumFractionDigits: 2 })}`
                    : "No disponible"}
                </span>
              </div>
              <div className={styles.currencyRow}>
                <span className={styles.currencyLabel}>USD:</span>
                <span className={`${styles.currencyValue} ${valueTextClass}`}>
                  {currency.usd !== null
                    ? `$${currency.usd.toLocaleString("es-CL", { maximumFractionDigits: 2 })}`
                    : "No disponible"}
                </span>
              </div>
              {currency.date && (
                <div className={styles.updateInfo}>
                  <span>Fecha actualización:</span>
                  <span>{currency.date.substring(0, 10)}</span>
                </div>
              )}
              {!todayStatus && !isNoDataError && (
                <div className={styles.updateText}>Haz clic para actualizar manualmente</div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
