const DEEPSEEK_API_URL ='https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const SYSTEM_PROMPT = `Sei un assistente virtuale del museo. Il tuo compito è aiutare i visitatori fornendo informazioni su:
- Orari di apertura e chiusura
- Prenotazioni e biglietti
- Regole del museo
- Mostre in corso

Rispondi in modo cortese e professionale. Se non conosci la risposta a una domanda, suggerisci di contattare la biglietteria.`;

export async function getChatCompletion(messages: { role: string; content: string }[]) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key non configurata');
  }

  try {
    const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Errore API DeepSeek: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Errore nella chiamata a DeepSeek:', error);
    throw error;
  }
} 