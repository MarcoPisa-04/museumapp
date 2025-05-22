'use client';

import { useState } from 'react';
import { testSupabaseConnection } from '@/lib/supabase-test';

export default function TestSupabasePage() {
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const testResult = await testSupabaseConnection();
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Test Connessione Supabase
        </h1>

        <button
          onClick={runTest}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Test in corso...' : 'Esegui Test'}
        </button>

        {result && (
          <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className={`text-lg font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Test Completato' : '❌ Test Fallito'}
            </h2>
            <p className={`mt-2 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message || result.error}
            </p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>Questo test verifica:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Connessione al database</li>
            <li>Inserimento dati</li>
            <li>Lettura dati</li>
            <li>Eliminazione dati</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 