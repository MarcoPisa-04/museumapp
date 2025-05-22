import { useEffect, useState } from 'react';
import type { OrarioMuseo } from '@/types/orari';

export function useOrari() {
  const [orari, setOrari] = useState<OrarioMuseo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/orari')
      .then(res => res.json())
      .then(data => setOrari(data.orari))
      .catch(() => setError('Errore nel recupero orari'))
      .finally(() => setLoading(false));
  }, []);

  return { orari, loading, error };
} 