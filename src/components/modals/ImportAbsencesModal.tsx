"use client";

import { useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ImportAbsencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type ValidationError = {
  rut: string;
  error: string;
};

type ImportResult = {
  success: boolean;
  totalFilas: number;
  totalInsertadas: number;
  errores?: ValidationError[];
};

const ImportAbsencesModal = ({ isOpen, onClose, onSuccess }: ImportAbsencesModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/absences/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setImportResult(result);

      if (result.success && result.totalInsertadas > 0 && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setImportResult({
        success: false,
        totalFilas: 0,
        totalInsertadas: 0,
        errores: [{ rut: "N/A", error: "Error al procesar la solicitud" }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const renderUploadForm = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cargar Excel de Ausencias</h2>
      <p className="text-gray-500 text-sm mb-6">
        Selecciona un archivo Excel (.xlsx, .xls) que contenga los datos de las ausencias.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Haz clic para seleccionar</span> o arrastra un archivo
              </p>
              <p className="text-xs text-gray-500">XLSX o XLS (MAX. 10MB)</p>
            </div>
            <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileChange} />
          </label>

          {file && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700 truncate">Archivo seleccionado: {file.name}</p>
              <p className="text-xs text-gray-500">Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading || !file}
          >
            {isLoading ? "Procesando..." : "Subir archivo"}
          </button>
        </div>
      </form>

      {/* Instrucciones */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Instrucciones</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>El archivo Excel debe contener las siguientes columnas:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Rut:</strong> RUT del empleado (obligatorio)
            </li>
            <li>
              <strong>Inicio:</strong> Fecha de inicio (formato M/D/YYYY o DD/MM/YYYY)
            </li>
            <li>
              <strong>Término:</strong> Fecha de término (formato M/D/YYYY o DD/MM/YYYY)
            </li>
            <li>
              <strong>Motivo:</strong> Razón de la ausencia (opcional)
            </li>
            <li>
              <strong>Nombre y Apellido:</strong> Nombre completo del empleado (opcional)
            </li>
            <li>
              <strong>Cliente:</strong> Nombre del cliente (opcional)
            </li>
            <li>
              <strong>Grupo:</strong> Grupo al que pertenece (opcional)
            </li>
            <li>
              <strong>observaciones:</strong> Observaciones adicionales (opcional)
            </li>
          </ul>
          <p className="mt-3">
            <strong>Nota:</strong> El sistema verificará el RUT del empleado en la base de datos. Las columnas
            adicionales como &quot;N° días&quot;, &quot;Hábiles&quot; y &quot;Corridos&quot; son opcionales y se ignoran
            durante la importación.
          </p>
        </div>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!importResult) return null;

    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{importResult.success ? "Carga exitosa" : "Error en la carga"}</h2>

        <div className={`p-4 rounded-md mb-6 ${importResult.success ? "bg-green-50" : "bg-red-50"}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {importResult.success ? (
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${importResult.success ? "text-green-800" : "text-red-800"}`}>
                Resumen de la importación
              </h3>
              <div className="mt-2 text-sm">
                <p>Registros procesados: {importResult.totalFilas}</p>
                <p>Registros insertados: {importResult.totalInsertadas}</p>
                {importResult.errores && importResult.errores.length > 0 && (
                  <p>Errores encontrados: {importResult.errores.length}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {importResult.errores && importResult.errores.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-red-700 mb-3">Errores encontrados:</h3>
            <div className="max-h-40 overflow-y-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RUT
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Error
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {importResult.errores.map((error, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{error.rut}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{error.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cargar otro archivo
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={handleClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={handleClose}
            >
              <span className="sr-only">Cerrar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {!importResult ? renderUploadForm() : renderResult()}
        </div>
      </div>
    </div>
  );
};

export default ImportAbsencesModal;
