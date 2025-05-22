import { useState } from 'react';
import type { ChatbotResponse } from '@/types/chatbot';

export function useChatbot() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [risposta, setRisposta] = useState<string | null>(null);

  async function inviaMessaggio(messaggio: string) {
    setLoading(true);
    setError(null);
    setRisposta(null);
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messaggio }),
      });
      const json: ChatbotResponse = await res.json();
      setRisposta(json.risposta);
    } catch {
      setError('Errore nella comunicazione con il chatbot');
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, risposta, inviaMessaggio };
} 