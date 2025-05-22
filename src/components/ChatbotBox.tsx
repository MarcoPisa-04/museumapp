import React, { useState } from 'react';

interface Props {
  onSend: (msg: string) => void;
  risposta: string | null;
  loading: boolean;
}

export function ChatbotBox({ onSend, risposta, loading }: Props) {
  const [msg, setMsg] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (msg.trim()) {
      onSend(msg);
      setMsg('');
    }
  }

  return (
    <div className="flex flex-col gap-2 max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="input input-bordered flex-1"
          type="text"
          placeholder="Scrivi una domanda..."
          value={msg}
          onChange={e => setMsg(e.target.value)}
          disabled={loading}
        />
        <button className="btn btn-secondary" type="submit" disabled={loading || !msg.trim()}>
          Invia
        </button>
      </form>
      <div className="min-h-[40px] mt-2">
        {loading && <span>Risposta in corso...</span>}
        {!loading && risposta && <span className="block bg-base-200 rounded p-2">{risposta}</span>}
      </div>
    </div>
  );
} 