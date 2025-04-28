"use client";

import { useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "@/lib/hook";
import { fetch } from "@/lib/features/users";

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ValidationError = {
  row: number;
  field: string;
  message: string;
};

type ImportResult = {
  success: boolean;
  processed?: number[];
  failed?: { row: number; error: string }[];
  errors?: ValidationError[];
  preview?: Record<string, unknown>[];
  totalRows?: number;
};

const ImportExcelModal = ({ isOpen, onClose }: ImportExcelModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[] | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [uploadStep, setUploadStep] = useState<"select" | "preview" | "result">("select");

  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      readExcelPreview(selectedFile);
    }
  };

  const readExcelPreview = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await window.fetch("/api/people/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setImportResult(result);

      if (result.preview && Array.isArray(result.preview)) {
        setPreviewData(result.preview);
        setUploadStep("preview");
      }
    } catch (error) {
      console.error("Error al leer el archivo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await window.fetch("/api/people/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setImportResult(result);
      setUploadStep("result");

      if (result.success) {
        // Recargar datos de personas después de una importación exitosa
        dispatch(fetch());
      }
    } catch (error) {
      console.error("Error en la importación:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewData(null);
    setImportResult(null);
    setUploadStep("select");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderSelectStep = () => (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-xl font-semibold mb-4">Cargar Excel de Smarters</h2>
      <p className="text-gray-500 text-sm mb-6">
        Selecciona un archivo Excel (.xlsx, .xls) que contenga los datos de las personas.
      </p>

      <div className="w-full max-w-md">
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
    </div>
  );

  const renderPreviewStep = () => {
    if (!previewData) return null;

    // Extraer las columnas del primer objeto
    const columns = previewData.length > 0 ? Object.keys(previewData[0]) : [];

    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-3">Vista previa de datos</h2>
        <p className="text-gray-500 text-sm mb-4">
          Mostrando {previewData.length} de {importResult?.totalRows || "?"} filas. Revisa que los datos sean correctos
          antes de importar.
        </p>

        {importResult?.errors && importResult.errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 rounded-md border border-red-200">
            <h3 className="text-sm font-medium text-red-800 mb-2">Se encontraron errores en los datos:</h3>
            <ul className="text-xs text-red-700 list-disc pl-5 max-h-40 overflow-y-auto">
              {importResult.errors.slice(0, 10).map((error, index) => (
                <li key={index}>
                  Fila {error.row}: {error.field} - {error.message}
                </li>
              ))}
              {importResult.errors.length > 10 && <li>...y {importResult.errors.length - 10} errores más</li>}
            </ul>
          </div>
        )}

        <div className="overflow-x-auto mt-4 border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewData.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {columns.map((column, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`} className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {String(row[column] !== undefined ? row[column] : "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={handleReset}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              importResult?.errors && importResult.errors.length > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleConfirmImport}
            disabled={isLoading || (importResult?.errors && importResult.errors.length > 0)}
          >
            {isLoading ? "Importando..." : "Confirmar importación"}
          </button>
        </div>
      </div>
    );
  };

  const renderResultStep = () => {
    if (!importResult) return null;

    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-3">
          {importResult.success ? "Importación completada" : "Error en la importación"}
        </h2>

        {importResult.success ? (
          <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
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
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">¡La importación se ha completado con éxito!</p>
                <ul className="mt-2 text-sm text-green-700">
                  <li>Total de filas procesadas: {importResult.processed?.length || 0}</li>
                  <li>Total de filas con errores: {importResult.failed?.length || 0}</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
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
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Se han encontrado errores durante la importación.</p>
                {importResult.errors && (
                  <ul className="mt-2 text-sm text-red-700 list-disc pl-5 max-h-40 overflow-y-auto">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>
                        Fila {error.row}: {error.field} - {error.message}
                      </li>
                    ))}
                    {importResult.errors.length > 5 && <li>...y {importResult.errors.length - 5} errores más</li>}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {importResult.failed && importResult.failed.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Filas que no pudieron ser procesadas:</h3>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 max-h-40 overflow-y-auto text-xs">
              <ul className="list-disc pl-5">
                {importResult.failed.slice(0, 10).map((item, index) => (
                  <li key={index} className="text-gray-600 mb-1">
                    Fila {item.row}: {item.error}
                  </li>
                ))}
                {importResult.failed.length > 10 && (
                  <li className="text-gray-600">...y {importResult.failed.length - 10} errores más</li>
                )}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => {
              onClose();
              handleReset();
            }}
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
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Cerrar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {uploadStep === "select" && renderSelectStep()}
          {uploadStep === "preview" && renderPreviewStep()}
          {uploadStep === "result" && renderResultStep()}
        </div>
      </div>
    </div>
  );
};

export default ImportExcelModal;
