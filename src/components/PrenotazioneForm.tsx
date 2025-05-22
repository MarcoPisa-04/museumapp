'use client';

import { useState } from 'react';

interface PrenotazioneFormProps {
  onSuccess: (qrCode: string) => void;
}

interface FormData {
  nome: string;
  giorno: string;
  persone: number;
}

interface FormErrors {
  nome?: string;
  giorno?: string;
  persone?: string;
}

export default function PrenotazioneForm({ onSuccess }: PrenotazioneFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    giorno: '',
    persone: 1,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Il nome è obbligatorio';
    }
    
    if (!formData.giorno) {
      newErrors.giorno = 'Seleziona una data';
    } else {
      const selectedDate = new Date(formData.giorno);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.giorno = 'La data non può essere nel passato';
      }
    }
    
    if (formData.persone < 1 || formData.persone > 10) {
      newErrors.persone = 'Il numero di persone deve essere tra 1 e 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/prenotazioni', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Errore nella prenotazione');
      }

      const data = await response.json();
      onSuccess(data.qrCode);
      
      // Reset form
      setFormData({
        nome: '',
        giorno: '',
        persone: 1,
      });
    } catch (err) {
      setError('Si è verificato un errore durante la prenotazione. Riprova più tardi.');
      console.error('Errore:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900">Prenota la tua Visita</h3>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-lg flex items-center gap-2">
            <svg
              className="w-5 h-5"
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
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome e Cognome
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.nome ? 'border-red-300' : 'border-gray-300'
                } rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="Inserisci il tuo nome"
              />
            </div>
            {errors.nome && (
              <p className="mt-1 text-sm text-red-500">{errors.nome}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data della Visita
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              </div>
              <input
                type="date"
                value={formData.giorno}
                onChange={(e) => setFormData({ ...formData, giorno: e.target.value })}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.giorno ? 'border-red-300' : 'border-gray-300'
                } rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary`}
              />
            </div>
            {errors.giorno && (
              <p className="mt-1 text-sm text-red-500">{errors.giorno}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numero di Persone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.persone}
                onChange={(e) => setFormData({ ...formData, persone: parseInt(e.target.value) })}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.persone ? 'border-red-300' : 'border-gray-300'
                } rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary`}
              />
            </div>
            {errors.persone && (
              <p className="mt-1 text-sm text-red-500">{errors.persone}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Prenotazione in corso...</span>
              </div>
            ) : (
              'Prenota Ora'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 