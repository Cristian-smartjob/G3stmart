"use client";
import React, { useState, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import PreinvoicePDF from "@/components/pdf/PreinvoicePDF";
import PreinvoicePDFLandscape from "@/components/pdf/PreinvoicePDFLandscape";
import { transformToPreinvoicePDFData } from "@/utils/pdfUtils";
import { fetchPreInvoiceWithDetails } from "@/app/actions/preInvoices";
import type { PreInvoice } from "@/interface/common";

interface PDFDownloadButtonProps {
  preInvoiceId: number;
  preInvoice?: PreInvoice;
  className?: string;
  children?: React.ReactNode;
}

type PDFOrientation = "portrait" | "landscape";

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  preInvoiceId,
  preInvoice,
  className = "rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 ml-2",
  children = "PDF",
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async (orientation: PDFOrientation) => {
    setIsGenerating(true);
    setShowDropdown(false);

    try {
      // 1. Obtener los datos de la prefactura
      const fullPreInvoice = await fetchPreInvoiceWithDetails(preInvoiceId);

      // 2. Transformar los datos al formato PDF
      const transformedData = transformToPreinvoicePDFData(fullPreInvoice);

      // 3. Seleccionar el componente según la orientación
      const PdfComponent = orientation === "landscape" ? PreinvoicePDFLandscape : PreinvoicePDF;

      // 4. Generar el documento PDF
      const pdfDocument = pdf(<PdfComponent data={transformedData} />);
      const blob = await pdfDocument.toBlob();

      // 5. Crear y descargar el archivo
      const monthNames = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];

      const monthName = preInvoice?.month ? monthNames[preInvoice.month - 1] : "mes";
      const year = preInvoice?.year || new Date().getFullYear();
      const clientName = preInvoice?.client?.name?.replace(/[^a-zA-Z0-9]/g, "_") || "cliente";
      const orientationSuffix = orientation === "landscape" ? "_horizontal" : "_vertical";
      const fileName = `prefactura_${clientName}_${monthName}_${year}${orientationSuffix}.pdf`;

      // 6. Descargar el archivo
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al generar el PDF. Por favor, inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Cerrar dropdown cuando se hace click fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isGenerating}
        className={`${className} ${showDropdown ? "bg-green-700" : ""} flex items-center space-x-1`}
      >
        <span>{isGenerating ? "Generando..." : children}</span>
        <svg
          className={`w-3 h-3 transition-transform ${showDropdown ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {showDropdown && !isGenerating && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleDownloadPDF("portrait")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>PDF Vertical (Portrait)</span>
            </button>
            <button
              onClick={() => handleDownloadPDF("landscape")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>PDF Horizontal (Landscape)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFDownloadButton;
