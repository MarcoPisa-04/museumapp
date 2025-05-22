import { useState } from 'react';
import type { QrCodePayload } from '@/types/qrcode';

export function useQrCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<QrCodePayload | null>(null);

  async function getQr(id: string) {
    setLoading(true);
    setError(null);
    setPayload(null);
    try {
      const res = await fetch(`/api/qrcode?id=${id}`);
      const json = await res.json();
      if (json.payload) setPayload(json.payload);
      else setError('QR code non trovato');
    } catch {
      setError('Errore nel recupero QR code');
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, payload, getQr };
} 