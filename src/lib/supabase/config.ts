export const SUPABASE_CONFIG = {
  tables: {
    orari: {
      name: 'orari',
      columns: {
        id: 'id',
        giorno: 'giorno',
        apertura: 'apertura',
        chiusura: 'chiusura',
        created_at: 'created_at'
      }
    },
    prenotazioni: {
      name: 'prenotazioni',
      columns: {
        id: 'id',
        nome: 'nome',
        giorno: 'giorno',
        persone: 'persone',
        timestamp: 'timestamp',
        created_at: 'created_at'
      }
    }
  }
}; 