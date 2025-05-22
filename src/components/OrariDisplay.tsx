'use client';

import { useState, useEffect } from 'react';

interface Orario {
  giorno: string;
  apertura: string;
  chiusura: string;
}

export default function OrariDisplay() {
  const [orari, setOrari] = useState<Orario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrari = async () => {
      try {
        const response = await fetch('/api/orari');
        if (!response.ok) {
          throw new Error('Errore nel recupero degli orari');
        }
        const data = await response.json();
        setOrari(data.orari);
      } catch (err) {
        setError('Impossibile caricare gli orari. Riprova più tardi.');
        console.error('Errore:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrari();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg inline-block">
          <svg
            className="w-6 h-6 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900">Orari di Apertura</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Giorno
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Apertura
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Chiusura
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orari.map((orario, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {orario.giorno}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {orario.apertura}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {orario.chiusura}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 