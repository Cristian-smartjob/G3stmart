"use client";

import React, { useState, useRef } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

interface UploadResult {
  success: boolean;
  totalFilas: number;
  totalInsertadas: number;
  errores?: Array<{
    rut: string;
    error: string;
  }>;
}

export default function AbsencesUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResult(null);
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
      setUploadResult(result);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setUploadResult({
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
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Carga de Ausencias</h1>
        <p className="text-gray-600">
          Sube un archivo Excel con la información de ausencias para actualizar el sistema.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {!uploadResult ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ArrowUpTrayIcon className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Haz clic para seleccionar</span> o arrastra un archivo
                  </p>
                  <p className="text-xs text-gray-500">XLSX o XLS (MAX. 10MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
              </label>

              {file && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-700 truncate">Archivo seleccionado: {file.name}</p>
                  <p className="text-xs text-gray-500">Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={isLoading || !file}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading || !file}
              >
                {isLoading ? "Procesando..." : "Subir archivo"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-md ${uploadResult.success ? "bg-green-50" : "bg-red-50"}`}>
              <h3 className={`text-lg font-semibold ${uploadResult.success ? "text-green-800" : "text-red-800"}`}>
                {uploadResult.success ? "Carga exitosa" : "Error en la carga"}
              </h3>
              <div className="mt-2 text-sm">
                <p className="font-medium">Registros procesados: {uploadResult.totalFilas}</p>
                <p className="font-medium">Registros insertados: {uploadResult.totalInsertadas}</p>
                {uploadResult.errores && uploadResult.errores.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-red-700 mb-2">Errores encontrados:</p>
                    <div className="max-h-40 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
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
                          {uploadResult.errores.map((error, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {error.rut}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{error.error}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cargar otro archivo
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Instrucciones</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>El archivo Excel debe contener las siguientes columnas:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Nombre y Apellido:</strong> Nombre completo del empleado (opcional)
            </li>
            <li>
              <strong>RUT:</strong> RUT del empleado (obligatorio)
            </li>
            <li>
              <strong>Motivo:</strong> Razón de la ausencia
            </li>
            <li>
              <strong>Inicio:</strong> Fecha de inicio (formato DD/MM/YYYY)
            </li>
            <li>
              <strong>Término:</strong> Fecha de término (formato DD/MM/YYYY)
            </li>
          </ul>
          <p className="mt-4">
            El sistema verificará el RUT del empleado en la base de datos y, si existe, registrará la ausencia.
          </p>
        </div>
      </div>
    </div>
  );
}
