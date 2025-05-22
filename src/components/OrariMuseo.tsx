import React from 'react';
import type { OrarioMuseo } from '@/types/orari';

interface Props {
  orari: OrarioMuseo[];
  loading: boolean;
  error: string | null;
}

export function OrariMuseo({ orari, loading, error }: Props) {
  if (loading) return <div>Caricamento orari...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Giorno</th>
            <th>Apertura</th>
            <th>Chiusura</th>
            <th>Posti disponibili</th>
          </tr>
        </thead>
        <tbody>
          {orari.map((o) => (
            <tr key={o.giorno} className={o.postiDisponibili === 0 ? 'bg-red-100' : ''}>
              <td>{o.giorno}</td>
              <td>{o.apertura}</td>
              <td>{o.chiusura}</td>
              <td>{o.postiDisponibili}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 