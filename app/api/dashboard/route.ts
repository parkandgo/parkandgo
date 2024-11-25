import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Daten aus der `orders`-Tabelle abfragen
    const result = await sql`SELECT * FROM orders ORDER BY created_at DESC`;

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Fehler beim Abrufen der Dashboard-Daten:', (error as Error).message);
    return NextResponse.json(
      { error: `Fehler beim Abrufen der Daten: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
