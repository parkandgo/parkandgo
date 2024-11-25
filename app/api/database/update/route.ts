/* /api/database/update/route.ts */
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { formData, totalPrice, sessionId, paymentMethod, didPay } = await request.json();

    if (!formData || !totalPrice || !sessionId || paymentMethod === undefined) {
      return NextResponse.json({ error: 'FormData, totalPrice, sessionId und paymentMethod sind erforderlich' }, { status: 400 });
    }

    const {
      pickupDate,
      pickupTime,
      dropOffDate,
      dropOffTime,
      meetingPoint,
      extras,
      email,
    } = formData;

    // SQL-Abfrage zum Einfügen der Bestellung in die Datenbank, einschließlich neuer Felder
    const result = await sql`
      INSERT INTO orders (pickup_date, pickup_time, dropoff_date, dropoff_time, meeting_point, extras, total_price, email, session_id, payment_method, did_pay)
      VALUES (${pickupDate}, ${pickupTime}, ${dropOffDate}, ${dropOffTime}, ${meetingPoint}, ${extras ? extras : null}, ${totalPrice}, ${email}, ${sessionId}, ${paymentMethod}, ${didPay})
      RETURNING id
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Fehler beim Speichern der Bestellung' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Bestellung erfolgreich gespeichert', orderId: result.rows[0].id });
  } catch (error) {
    console.error('Datenbank Fehler:', (error as Error).message);
    return NextResponse.json({ error: `Datenbankfehler: ${(error as Error).message}` }, { status: 500 });
  }
}
