import { NextResponse } from 'next/server';

interface BookingRequest {
  date: string;
  time: string;
  tickets: {
    type: 'adult' | 'child' | 'senior' | 'student';
    quantity: number;
  }[];
  name: string;
  email: string;
}

export async function POST(request: Request) {
  try {
    const { message, action } = await request.json();

    // Process the message and determine the action
    const lowerMessage = message.toLowerCase();

    // Check if it's a booking request
    if (lowerMessage.includes('prenot') || lowerMessage.includes('bigliett') || lowerMessage.includes('acquist')) {
      // Here you would typically:
      // 1. Extract booking details from the message
      // 2. Validate the request
      // 3. Process the booking
      // 4. Generate a QR code
      // For now, we'll return a mock response

      return NextResponse.json({
        type: 'booking',
        message: 'Perfetto! Per procedere con la prenotazione, ho bisogno di alcune informazioni:\n\n' +
          '1. Data della visita\n' +
          '2. Orario preferito\n' +
          '3. Numero di biglietti e tipo (adulto, bambino, senior, studente)\n' +
          '4. Nome e email per la conferma\n\n' +
          'Puoi fornirmi questi dettagli?'
      });
    }

    // Check for opening hours
    if (lowerMessage.includes('orari') || lowerMessage.includes('aperto') || lowerMessage.includes('chiuso')) {
      return NextResponse.json({
        type: 'text',
        message: 'Il Museo del Clima è aperto:\n\n' +
          '• Lunedì - Venerdì: 9:00 - 18:00\n' +
          '• Sabato - Domenica: 10:00 - 19:00\n\n' +
          'L\'ultimo ingresso è consentito 30 minuti prima della chiusura.'
      });
    }

    // Check for general information
    if (lowerMessage.includes('informazion') || lowerMessage.includes('dove') || lowerMessage.includes('come')) {
      return NextResponse.json({
        type: 'text',
        message: 'Il Museo del Clima si trova presso il Green Hub di Cava de\' Tirreni.\n\n' +
          '• Indirizzo: [Inserire indirizzo]\n' +
          '• Parcheggio disponibile\n' +
          '• Accesso per disabili\n' +
          '• Visite guidate su prenotazione\n\n' +
          'Posso aiutarti con qualcos\'altro?'
      });
    }

    // Default response for other queries
    return NextResponse.json({
      type: 'text',
      message: 'Sono l\'assistente virtuale del Museo del Clima. Posso aiutarti con:\n\n' +
        '• Prenotazione biglietti\n' +
        '• Informazioni sugli orari\n' +
        '• Informazioni generali sul museo\n' +
        '• Guide alla visita\n\n' +
        'Come posso esserti utile?'
    });

  } catch (error) {
    console.error('Error processing chatbot request:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore nel processare la richiesta' },
      { status: 500 }
    );
  }
} 