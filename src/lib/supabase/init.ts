import { supabase } from './client';
import { SUPABASE_CONFIG } from './config';

export async function initializeDatabase() {
  try {
    // Verifica se le tabelle esistono
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) throw tablesError;

    const existingTables = tables.map(t => t.table_name);

    // Crea la tabella orari se non esiste
    if (!existingTables.includes(SUPABASE_CONFIG.tables.orari.name)) {
      const { error: orariError } = await supabase.rpc('create_orari_table');
      if (orariError) throw orariError;
    }

    // Crea la tabella prenotazioni se non esiste
    if (!existingTables.includes(SUPABASE_CONFIG.tables.prenotazioni.name)) {
      const { error: prenotazioniError } = await supabase.rpc('create_prenotazioni_table');
      if (prenotazioniError) throw prenotazioniError;
    }

    // Inserisci i dati iniziali per gli orari
    const { error: insertError } = await supabase
      .from(SUPABASE_CONFIG.tables.orari.name)
      .upsert([
        { giorno: 'Lunedì', apertura: '9:00', chiusura: '18:00' },
        { giorno: 'Martedì', apertura: '9:00', chiusura: '18:00' },
        { giorno: 'Mercoledì', apertura: '9:00', chiusura: '18:00' },
        { giorno: 'Giovedì', apertura: '9:00', chiusura: '18:00' },
        { giorno: 'Venerdì', apertura: '9:00', chiusura: '18:00' },
        { giorno: 'Sabato', apertura: '10:00', chiusura: '20:00' },
        { giorno: 'Domenica', apertura: '10:00', chiusura: '20:00' }
      ]);

    if (insertError) throw insertError;

    console.log('Database inizializzato con successo');
    return true;
  } catch (error) {
    console.error('Errore durante l\'inizializzazione del database:', error);
    return false;
  }
} 