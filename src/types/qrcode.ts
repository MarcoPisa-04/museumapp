export interface QrCodePayload {
  id: string;
  message: string;
  data: {
    nome: string;
    giorno: string;
    persone: number;
    timestamp: string;
  };
} 