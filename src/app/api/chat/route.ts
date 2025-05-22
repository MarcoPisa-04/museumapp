import { NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/ai';

const SYSTEM_PROMPT = `Sei un assistente virtuale del Museo del Clima. 
Informazioni sul museo:
- Orari: Lunedì-Venerdì 9:00-18:00, Sabato 10:00-20:00, Domenica 10:00-19:00
- Prezzi: Intero €15, Ridotto €10, Bambino €8, Famiglia €35
- Metodi di pagamento: Carta di Credito, PayPal, Bonifico

Rispondi in modo professionale e conciso. Se l'utente vuole prenotare, inizia il processo di prenotazione.`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Il messaggio è obbligatorio' },
        { status: 400 }
      );
    }

    // Usa DeepSeek per generare la risposta
    const response = await getChatCompletion([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message }
    ], 'DEEPSEEK');

    // Se la risposta è il messaggio di fallback, lo gestiamo come successo
    // ma con un flag speciale per il frontend
    if (response.includes("Mi dispiace, al momento non sono in grado di rispondere")) {
      return NextResponse.json({
        success: true,
        risposta: response,
        isFallback: true
      });
    }

    return NextResponse.json({
      success: true,
      risposta: response
    });

  } catch (error) {
    console.error('Error processing chatbot request:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Si è verificato un errore nel processare la richiesta',
        details: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
} 