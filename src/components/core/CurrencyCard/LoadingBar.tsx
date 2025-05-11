import React, { useEffect, useState } from "react";
import styles from "./CurrencyCard.module.css";

interface LoadingBarProps {
  duration?: number; // Duración en milisegundos
  onComplete?: () => void;
}

/**
 * Componente de barra de carga horizontal que se completa automáticamente
 * y ejecuta una acción al terminar
 */
export default function LoadingBar({ duration = 3000, onComplete }: LoadingBarProps): React.ReactElement {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Iniciar animación solo cuando el componente se monta
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsedTime / duration) * 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className={styles.loadingBarContainer}>
      <div className={styles.loadingBarProgress} style={{ width: `${progress}%` }} />
    </div>
  );
}
