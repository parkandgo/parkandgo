/* /api/webhooks/route.ts */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false, // Verhindert automatisches Parsen des Bodys
  },
};

function handleCORS(request: Request) {
  const origin = request.headers.get('origin') || '*';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: handleCORS(new Request('')) });
}

export async function POST(req: Request) {
  const corsHeaders = handleCORS(req);

  try {
    const rawBody = await req.arrayBuffer();
    const buf = Buffer.from(rawBody);
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook Error:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
      
        console.log('Zahlung erfolgreich abgeschlossen:', session);
      
        // Prüfen, ob `amount_total` vorhanden ist
        const amountTotal = session.amount_total ?? 0; // Standardwert 0, falls `null`
        const formData = session.metadata;
        const paymentMethod = session.payment_method_types?.[0]; // Zahlungsmethode (Visa, MasterCard, etc.)
      
        if (formData) {
          try {
            // API-Aufruf zur E-Mail-Bestätigung
            await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/confirm`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                formData,
                totalPrice: amountTotal / 100, // Betrag in EUR
                sessionId: session.id, // Hier wird die sessionId übergeben
              }),
            });
      
            // API-Aufruf zur Datenbankaktualisierung
            await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/database/update`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                formData,
                totalPrice: amountTotal / 100, // Betrag in EUR
                sessionId: session.id, // Hier wird die sessionId übergeben
                paymentMethod: paymentMethod, // Zahlungsmethode
                didPay: true, // Zahlungsstatus
              }),
            });
      
            console.log('E-Mail und Datenbank erfolgreich aktualisiert.');
          } catch (err) {
            console.error('Fehler bei der Verarbeitung der API-Aufrufe:', err);
          }
        } else {
          console.warn('Formulardaten fehlen in der Session-Metadata.');
        }
      
        break;
    
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    

    return NextResponse.json({ received: true }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
