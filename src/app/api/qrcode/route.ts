import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID mancante' }, { status: 400 });
  // In un caso reale qui genereresti un QR code per la prenotazione
  // Qui restituiamo solo il payload da codificare
  const payload = {
    id,
    valid: true,
    message: "Mostra questo QR code all'ingresso del museo",
  };
  return NextResponse.json({ payload });
} 