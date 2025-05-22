export interface Prenotazione {
  nome: string;
  giorno: string;
  persone: number;
  timestamp: string;
}

export interface PrenotazioneResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    prenotazione: Prenotazione;
  };
} 