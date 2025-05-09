'use client';

import React, { useEffect } from 'react';
import { Link as ScrollLink, Element } from 'react-scroll';

interface ScrollToLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

export const ScrollToLink = ({ to, children, className = '', offset = -70 }: ScrollToLinkProps) => {
  // Usar una función auxiliar para manejar clic, sin asignarla directamente al onClick
  useEffect(() => {
    const handleClick = () => {
      // Suprimir mensajes de consola durante el scroll
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
      
      // Restaurar después
      setTimeout(() => {
        console.warn = originalConsoleWarn;
      }, 500);
    };
    
    document.addEventListener('wheel', handleClick);
    
    return () => {
      document.removeEventListener('wheel', handleClick);
    };
  }, []);
  
  return (
    <ScrollLink
      to={to}
      spy={true}
      smooth={true}
      duration={500}
      offset={offset}
      className={`cursor-pointer ${className}`}
      ignoreCancelEvents={true}
    >
      {children}
    </ScrollLink>
  );
};

interface ScrollSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const ScrollSection = ({ id, children, className = '' }: ScrollSectionProps) => {
  return (
    <Element name={id} className={`scroll-section ${className}`} id={id}>
      {children}
    </Element>
  );
}; 