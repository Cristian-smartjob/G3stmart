'use client';

import { useEffect, useState } from 'react';

export default function EnvPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        const response = await fetch('/api/env');
        if (!response.ok) {
          throw new Error('Error al obtener las variables de entorno');
        }
        const data = await response.json();
        setEnvVars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchEnvVars();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Cargando variables de entorno...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Variables de Entorno</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Variable</th>
              <th className="px-4 py-2 text-left">Valor</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(envVars).map(([key, value]) => (
              <tr key={key} className="border-t">
                <td className="px-4 py-2 font-mono">{key}</td>
                <td className="px-4 py-2 font-mono">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 