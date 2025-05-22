import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { nome, giorno, persone } = await request.json();

    if (!nome || !giorno || !persone) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('prenotazioni')
      .insert([
        {
          nome,
          giorno,
          persone,
          timestamp: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Errore Supabase:', error);
      return NextResponse.json(
        { error: 'Errore nel salvataggio della prenotazione' },
        { status: 500 }
      );
    }

    return NextResponse.json({ prenotazione: data[0] });
  } catch (error) {
    console.error('Errore server:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID prenotazione mancante'
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('prenotazioni')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Errore nel recupero della prenotazione:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Errore nel recupero della prenotazione'
      },
      { status: 500 }
    );
  }
} 