/* /api/stripe/route.ts */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

// Funktion zum Formatieren des Datums im deutschen Format (DD.MM.YYYY)
const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(date).toLocaleDateString('de-DE', options);
};

export async function POST(request: Request) {
  try {
    const { amount, formData } = await request.json();

    if (!amount || !formData) {
      return NextResponse.json({ error: 'Amount and formData are required' }, { status: 400 });
    }

    // Dynamische Beschreibung basierend auf den Formulardaten erstellen
const description = `
  Parkservice: sicheres abholen & parken | 
  Zeitraum: Vom ${formatDate(formData.pickupDate)} bis ${formatDate(formData.dropOffDate)} | 
  Treffpunkt: ${formData.meetingPoint} | 
  Mit folgenden Zusatzoptionen: ${formData.extras}
`;

    // Stripe Checkout-Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Park Service Online Buchung',
              description: description, // Dynamische Beschreibung
            },
            unit_amount: amount, // Amount in Cent
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: formData, // Speichern der Formulardaten für spätere Verarbeitung
    });

    // Rückgabe der Session-ID für Stripe-Checkout
    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error);
    return NextResponse.json({ error: 'Fehler beim Erstellen der Checkout-Session' }, { status: 500 });
  }
}
