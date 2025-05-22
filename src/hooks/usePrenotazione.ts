import { useState } from 'react';
import type { Prenotazione } from '@/types/prenotazione';

export function usePrenotazione() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Prenotazione | null>(null);

  async function prenota(nome: string, giorno: string, persone: number) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch('/api/prenotazioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, giorno, persone }),
      });
      const json = await res.json();
      if (json.success) setData(json.prenotazione);
      else setError('Errore nella prenotazione');
    } catch {
      setError('Errore nella prenotazione');
    } finally {
      setLoading(false);
    }
  }

  async function recupera(id: string) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/prenotazioni?id=${id}`);
      const json = await res.json();
      if (json.prenotazione) setData(json.prenotazione);
      else setError('Prenotazione non trovata');
    } catch {
      setError('Errore nel recupero');
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, prenota, recupera };
} 