import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function testSupabaseConnection() {
  try {
    // Test 1: Verifica connessione
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (testError) throw testError;
    console.log('✅ Connessione a Supabase riuscita');

    // Test 2: Inserisci un evento di test
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert([
        {
          title: 'Test Event',
          description: 'Evento di test per verifica connessione',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: 0,
          capacity: 100,
          type: 'test'
        }
      ])
      .select();

    if (eventError) throw eventError;
    console.log('✅ Inserimento evento di test riuscito');

    // Test 3: Verifica inserimento
    const { data: verifyData, error: verifyError } = await supabase
      .from('events')
      .select('*')
      .eq('title', 'Test Event')
      .single();

    if (verifyError) throw verifyError;
    console.log('✅ Verifica lettura dati riuscita');

    // Test 4: Pulizia dati di test
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('title', 'Test Event');

    if (deleteError) throw deleteError;
    console.log('✅ Pulizia dati di test riuscita');

    return {
      success: true,
      message: 'Tutti i test completati con successo'
    };

  } catch (error) {
    console.error('❌ Errore durante il test:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore sconosciuto'
    };
  }
} 