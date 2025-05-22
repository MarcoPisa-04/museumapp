import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Mancano le variabili d\'ambiente di Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipi per le tabelle del database
export interface Orario {
  id: number;
  giorno: string;
  apertura: string;
  chiusura: string;
  created_at: string;
}

export interface Prenotazione {
  id: string;
  nome: string;
  giorno: string;
  persone: number;
  timestamp: string;
  created_at: string;
} 