'use client';

import React, { useEffect, ReactNode } from 'react';

interface ErrorSuppressionProviderProps {
  children: ReactNode;
}

/**
 * Componente que intercepta y suprime errores y advertencias específicas a nivel global
 */
const ErrorSuppressionProvider: React.FC<ErrorSuppressionProviderProps> = ({ children }) => {
  useEffect(() => {
    // Suprimir mensajes relacionados con auto-scroll y position sticky/fixed
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    // Sobrescribir completamente console.warn
    console.warn = function(...args) {
      // Filtrar mensajes que contienen ciertas palabras clave
      if (
        args.length > 0 && 
        typeof args[0] === 'string' && 
        (
          args[0].includes('auto-scroll') || 
          args[0].includes('position: sticky') || 
          args[0].includes('position: fixed') ||
          args[0].includes('layout-router')
        )
      ) {
        return; // No hacer nada con este mensaje
      }
      
      // Pasar otros mensajes a la función original
      originalConsoleWarn.apply(console, args);
    };
    
    // Sobrescribir console.error de manera similar
    console.error = function(...args) {
      if (
        args.length > 0 && 
        typeof args[0] === 'string' && 
        (
          args[0].includes('auto-scroll') || 
          args[0].includes('position: sticky') || 
          args[0].includes('position: fixed') ||
          args[0].includes('layout-router')
        )
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
    // Aplicar estilos CSS para mejorar el comportamiento de elementos sticky/fixed
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Mejoras para elementos sticky/fixed */
      body * {
        scroll-behavior: smooth !important;
      }
      
      /* Evitar problemas con elementos sticky/fixed */
      [style*="position: fixed"],
      [style*="position:fixed"],
      [style*="position: sticky"],
      [style*="position:sticky"] {
        transform: translateZ(0);
        will-change: transform;
        isolation: isolate;
      }
      
      /* Sobreescribir comportamiento de headlessui */
      .fixed {
        transform: translateZ(0);
        will-change: transform;
        backface-visibility: hidden;
      }
      
      /* Corregir superposición z-index */
      .z-40, .z-50 {
        isolation: isolate;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Sobrescribir los métodos de scroll nativos
    const originalScrollTo = window.scrollTo;
    window.scrollTo = function(xOrOptions?: number | ScrollToOptions, y?: number) {
      try {
        if (typeof xOrOptions === 'number' && typeof y === 'number') {
          return originalScrollTo(xOrOptions, y);
        } else {
          return originalScrollTo(xOrOptions as ScrollToOptions);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.debug('Error durante scroll:', { error });
      }
    };
    
    return () => {
      // Restaurar métodos originales cuando el componente se desmonte
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
      window.scrollTo = originalScrollTo;
      
      // Eliminar los estilos CSS
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return <>{children}</>;
};

export default ErrorSuppressionProvider; 