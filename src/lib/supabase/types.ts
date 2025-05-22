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

export interface Database {
  public: {
    Tables: {
      orari: {
        Row: Orario;
        Insert: Omit<Orario, 'id' | 'created_at'>;
        Update: Partial<Omit<Orario, 'id' | 'created_at'>>;
      };
      prenotazioni: {
        Row: Prenotazione;
        Insert: Omit<Prenotazione, 'id' | 'created_at'>;
        Update: Partial<Omit<Prenotazione, 'id' | 'created_at'>>;
      };
    };
  };
} 