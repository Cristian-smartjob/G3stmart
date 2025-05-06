import { useEffect, useState } from "react";
import axios from "axios";

interface CurrencyHistory {
  uf: number;
  usd: number;
  date: string;
}

export default function CurrencyCard() {
  const [currency, setCurrency] = useState<CurrencyHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchCurrency = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/currency-history/latest");
      setCurrency(res.data.data);
    } catch (e) {
      console.error(e);
      setError("No se pudo obtener el valor de las monedas");
    } finally {
      setLoading(false);
    }
  };

  const updateCurrency = async () => {
    setUpdating(true);
    setError(null);
    try {
      await axios.post("/api/currency-history/update");
      await fetchCurrency();
    } catch (e) {
      console.error(e);
      setError("No se pudo actualizar el valor de las monedas");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchCurrency();
  }, []);

  const isToday = () => {
    if (!currency) return false;
    const today = new Date().toISOString().substring(0, 10);
    return currency.date.substring(0, 10) === today;
  };

  const cardColor = isToday()
    ? "" // Usaremos un estilo inline para el verde personalizado
    : "bg-red-100 border-red-400";
  const textColor = isToday() ? "text-green-800" : "text-red-800";
  const clickable = !isToday();

  return (
    <div
      className={`border rounded-lg p-4 shadow-md flex flex-col gap-2 w-full max-w-xs ${cardColor} ${
        clickable ? "cursor-pointer" : "cursor-default"
      }`}
      title={currency ? `Última actualización: ${currency.date.substring(0, 10)}` : ""}
      onClick={clickable && !updating ? updateCurrency : undefined}
      style={{
        opacity: updating ? 0.6 : 1,
        backgroundColor: isToday() ? "rgba(41, 217, 194, 0.4)" : undefined,
        borderColor: isToday() ? "rgba(41, 217, 194, 0.4)" : undefined,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">Monedas</span>
        {!isToday() && (
          <span title="Desactualizado" className="text-2xl">
            ⚠️
          </span>
        )}
      </div>
      {loading ? (
        <div className="text-gray-500">Cargando...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : currency ? (
        <>
          <div className="flex justify-between">
            <span className="font-semibold">UF:</span>
            <span className={textColor}>${currency.uf.toLocaleString("es-CL", { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">USD:</span>
            <span className={textColor}>${currency.usd.toLocaleString("es-CL", { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span>Fecha actualización:</span>
            <span>{currency.date.substring(0, 10)}</span>
          </div>
          {clickable && <div className="text-xs text-gray-400 mt-1">Haz clic para actualizar manualmente</div>}
        </>
      ) : null}
    </div>
  );
}
