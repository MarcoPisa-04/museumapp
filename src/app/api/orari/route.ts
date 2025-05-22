import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Mancano le variabili d\'ambiente di Supabase');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orari')
      .select('*')
      .order('id');

    if (error) {
      console.error('Errore Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orari: data });
  } catch (error) {
    console.error('Errore:', error);
    return NextResponse.json({ error: 'Errore di connessione' }, { status: 500 });
  }
} 