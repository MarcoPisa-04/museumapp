import { createClient } from '@supabase/supabase-js';

// Inizializza il client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configurazione dei provider AI
const AI_PROVIDERS = {
  DEEPSEEK: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat'
  },
  OPENAI: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo'
  }
};

const SYSTEM_PROMPT = `Sei un assistente virtuale del Museo del Clima. 
Informazioni sul museo:
- Orari: Lunedì-Venerdì 9:00-18:00, Sabato 10:00-20:00, Domenica 10:00-19:00
- Prezzi: Adulto €15, Studente €10, Bambino €8, Famiglia €35
- Metodi di pagamento: Carta di Credito, PayPal, Bonifico

Puoi interagire con il database Supabase per:
1. Gestione Prenotazioni:
   - Creare nuove prenotazioni
   - Modificare prenotazioni esistenti
   - Cancellare prenotazioni
   - Verificare disponibilità
   - Controllare lo stato delle prenotazioni

2. Gestione Biglietti:
   - Verificare disponibilità biglietti
   - Controllare prezzi e sconti
   - Gestire tipi di biglietti
   - Verificare validità biglietti

3. Gestione Pagamenti:
   - Verificare stato pagamenti
   - Gestire rimborsi
   - Controllare transazioni
   - Verificare metodi di pagamento

4. Gestione Eventi:
   - Informazioni su mostre in corso
   - Eventi speciali
   - Visite guidate
   - Workshop e attività

5. Gestione Utenti:
   - Verificare account utenti
   - Gestire preferenze
   - Controllare storico prenotazioni
   - Gestire abbonamenti

6. Gestione Contenuti:
   - Informazioni sulle collezioni
   - Dettagli sulle mostre
   - Materiale didattico
   - Guide e mappe

Rispondi in modo professionale e conciso. Se l'utente vuole prenotare, inizia il processo di prenotazione.`;

export async function getChatCompletion(messages: { role: string; content: string }[], provider: 'DEEPSEEK' | 'OPENAI' = 'DEEPSEEK') {
  const FALLBACK_MESSAGE = "Mi dispiace, al momento non sono in grado di rispondere. Il servizio di assistenza virtuale è temporaneamente non disponibile. Per favore, riprova più tardi o contatta direttamente il museo.";

  try {
    const selectedProvider = AI_PROVIDERS[provider];
    const apiKey = provider === 'DEEPSEEK' ? process.env.DEEPSEEK_API_KEY : process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error(`${provider} API key non configurata`);
      if (provider === 'DEEPSEEK') {
        console.log('Tentativo di fallback su OpenAI...');
        return getChatCompletion(messages, 'OPENAI');
      }
      return FALLBACK_MESSAGE;
    }

    // Aggiungi il contesto del database al prompt
    const lastUserMessage = messages[messages.length - 1].content;
    let databaseContext = '';

    // Gestione Prenotazioni
    if (lastUserMessage.toLowerCase().includes('prenot') || 
        lastUserMessage.toLowerCase().includes('disponibil') ||
        lastUserMessage.toLowerCase().includes('bigliett')) {
      
      const { data: availability, error: availabilityError } = await supabase
        .from('bookings')
        .select('date, time, available_slots, ticket_types')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(7);

      if (!availabilityError && availability) {
        databaseContext += `\nInformazioni sulla disponibilità:\n${availability.map(slot => 
          `- ${new Date(slot.date).toLocaleDateString('it-IT')} ${slot.time}: ${slot.available_slots} posti disponibili\n` +
          `  Tipi di biglietti: ${Object.entries(slot.ticket_types).map(([type, count]) => `${type}: ${count}`).join(', ')}`
        ).join('\n')}`;
      }
    }

    // Gestione Stato Prenotazioni
    if (lastUserMessage.toLowerCase().includes('stato') || 
        lastUserMessage.toLowerCase().includes('conferma') ||
        lastUserMessage.toLowerCase().includes('prenotazione')) {
      
      const bookingRef = lastUserMessage.match(/\d+/)?.[0];
      
      if (bookingRef) {
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*, payments(*), user:users(*)')
          .eq('booking_reference', bookingRef)
          .single();

        if (!bookingError && booking) {
          databaseContext += `\nStato della prenotazione ${bookingRef}:\n` +
            `- Data: ${new Date(booking.date).toLocaleDateString('it-IT')}\n` +
            `- Orario: ${booking.time}\n` +
            `- Stato: ${booking.status}\n` +
            `- Biglietti: ${booking.ticket_count}\n` +
            `- Pagamento: ${booking.payments?.status || 'Non effettuato'}\n` +
            `- Utente: ${booking.user?.email || 'Non specificato'}`;
        }
      }
    }

    // Gestione Eventi e Mostre
    if (lastUserMessage.toLowerCase().includes('mostra') || 
        lastUserMessage.toLowerCase().includes('evento') ||
        lastUserMessage.toLowerCase().includes('attività')) {
      
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true });

      if (!eventsError && events) {
        databaseContext += `\nEventi in programma:\n${events.map(event => 
          `- ${event.title} (${new Date(event.start_date).toLocaleDateString('it-IT')} - ${new Date(event.end_date).toLocaleDateString('it-IT')})\n` +
          `  ${event.description}\n` +
          `  Prezzo: ${event.price}€`
        ).join('\n')}`;
      }
    }

    // Gestione Collezioni
    if (lastUserMessage.toLowerCase().includes('collezione') || 
        lastUserMessage.toLowerCase().includes('opera') ||
        lastUserMessage.toLowerCase().includes('esposizione')) {
      
      const { data: collections, error: collectionsError } = await supabase
        .from('collections')
        .select('*, exhibits(*)')
        .order('name');

      if (!collectionsError && collections) {
        databaseContext += `\nCollezioni disponibili:\n${collections.map(collection => 
          `- ${collection.name}\n` +
          `  Opere in mostra: ${collection.exhibits.length}\n` +
          `  ${collection.description}`
        ).join('\n')}`;
      }
    }

    // Gestione Utenti
    if (lastUserMessage.toLowerCase().includes('account') || 
        lastUserMessage.toLowerCase().includes('profilo') ||
        lastUserMessage.toLowerCase().includes('abbonamento')) {
      
      const userId = lastUserMessage.match(/user[_-]?id[=:]\s*(\d+)/i)?.[1];
      
      if (userId) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*, subscriptions(*), bookings(*)')
          .eq('id', userId)
          .single();

        if (!userError && user) {
          databaseContext += `\nInformazioni utente:\n` +
            `- Email: ${user.email}\n` +
            `- Abbonamento: ${user.subscriptions?.type || 'Nessuno'}\n` +
            `- Prenotazioni: ${user.bookings?.length || 0}\n` +
            `- Stato account: ${user.status}`;
        }
      }
    }

    // Aggiungi il contesto del database al messaggio
    const messagesWithContext = [
      { role: 'system', content: SYSTEM_PROMPT + databaseContext },
      ...messages
    ];

    console.log(`Tentativo di chiamata a ${provider}...`);
    const response = await fetch(selectedProvider.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedProvider.model,
        messages: messagesWithContext,
        temperature: 0.7,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || response.statusText;
      console.error(`Errore ${provider}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      
      if (provider === 'DEEPSEEK') {
        console.log('Tentativo di fallback su OpenAI...');
        try {
          return await getChatCompletion(messages, 'OPENAI');
        } catch (openaiError) {
          console.error('Fallback su OpenAI fallito:', openaiError);
          return FALLBACK_MESSAGE;
        }
      }
      
      return FALLBACK_MESSAGE;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error(`${provider} ha restituito una risposta vuota`);
      return FALLBACK_MESSAGE;
    }

    return content;
  } catch (error) {
    console.error(`Errore nella chiamata a ${provider}:`, error);
    
    if (provider === 'DEEPSEEK') {
      console.log('Tentativo di fallback su OpenAI...');
      try {
        return await getChatCompletion(messages, 'OPENAI');
      } catch (openaiError) {
        console.error('Fallback su OpenAI fallito:', openaiError);
        return FALLBACK_MESSAGE;
      }
    }
    
    return FALLBACK_MESSAGE;
  }
} 