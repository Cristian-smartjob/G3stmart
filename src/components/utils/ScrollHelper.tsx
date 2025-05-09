'use client';

import { ReactNode, useEffect } from 'react';
import { animateScroll, Events, scrollSpy } from 'react-scroll';

interface ScrollHelperProps {
  children: ReactNode;
}

// Extender la interfaz Window para incluir nuestro método
declare global {
  interface Window {
    scrollToTop: () => void;
  }
}

/**
 * Componente auxiliar que configura y gestiona el comportamiento de scroll
 * para resolver los problemas con elementos sticky/fixed
 */
const ScrollHelper = ({ children }: ScrollHelperProps) => {
  useEffect(() => {
    // Configurar opciones de scroll
    scrollSpy.update();
    
    // Registrar listeners de eventos
    Events.scrollEvent.register('begin', () => {
      // Silenciar temporalmente los warnings de consola relacionados con scroll
      const originalConsoleWarn = console.warn;
      console.warn = (...args) => {
        if (
          typeof args[0] === 'string' && 
          (args[0].includes('auto-scroll') || args[0].includes('position: sticky') || args[0].includes('position: fixed'))
        ) {
          return;
        }
        originalConsoleWarn(...args);
      };
      
      // Restaurar después de un tiempo
      setTimeout(() => {
        console.warn = originalConsoleWarn;
      }, 1000);
    });
    
    Events.scrollEvent.register('end', () => {
      // Nada que hacer al final del scroll
    });
    
    // Deshabilitar comportamiento automático de scroll para elementos fixed y sticky
    const style = document.createElement('style');
    style.innerHTML = `
      .scroll-container * {
        scroll-behavior: smooth !important;
      }
      .scroll-container [style*="position: fixed"],
      .scroll-container [style*="position:fixed"],
      .scroll-container [style*="position: sticky"],
      .scroll-container [style*="position:sticky"] {
        transform: translateZ(0);
      }
    `;
    document.head.appendChild(style);
    
    // Opciones para el scroll suave
    const scrollOptions = {
      duration: 500,
      smooth: true,
      spy: true,
      offset: -70,
    };
    
    // Método para scroll suave
    const handleScrollToTop = () => {
      animateScroll.scrollToTop(scrollOptions);
    };
    
    // Exponer el método globalmente
    window.scrollToTop = handleScrollToTop;
    
    // Limpieza al desmontar
    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
      document.head.removeChild(style);
    };
  }, []);
  
  return <div className="scroll-container">{children}</div>;
};

export default ScrollHelper; 