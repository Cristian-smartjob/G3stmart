"use client";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeRef.current) {
      try {
        storeRef.current = makeStore();
        setIsStoreReady(true);
        setError(null);
      } catch (err) {
        console.error("Error inicializando el store:", err);
        setError("Error inicializando el store");
        // Intentar reinicializar después de un breve delay
        setTimeout(() => {
          try {
            storeRef.current = makeStore();
            setIsStoreReady(true);
            setError(null);
          } catch (retryErr) {
            console.error("Error en reintento de inicialización del store:", retryErr);
          }
        }, 1000);
      }
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error de inicialización</h2>
          <p className="text-gray-600">Reintentando...</p>
        </div>
      </div>
    );
  }

  if (!isStoreReady || !storeRef.current) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
