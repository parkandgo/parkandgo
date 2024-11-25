"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

interface SummaryProps {
  formData: any;
}

// Funktion zum Formatieren des Datums im deutschen Format (DD.MM.YYYY)
const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(date).toLocaleDateString('de-DE', options);
};

export default function Summary({ formData }: SummaryProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);  // Rabattbetrag

  // Gesamtpreis berechnen
  const calculateTotalPrice = () => {
    const pickupTime = new Date(formData.pickupDate + " " + formData.pickupTime);
    const dropOffTime = new Date(formData.dropOffDate + " " + formData.dropOffTime);
  
    let rentalDays = Math.ceil(
      (dropOffTime.getTime() - pickupTime.getTime()) / (1000 * 3600 * 24)
    );
  
    if (rentalDays <= 0) rentalDays = 1;
  
    let totalPrice = rentalDays * 11.9;
  
    // Berechnung des Rabatts
    let discount = 0;
    if (rentalDays >= 30) {
      discount = 0.10; // 10% Rabatt für 30+ Tage
    } else if (rentalDays >= 10) {
      discount = 0.05; // 5% Rabatt für 10-29 Tage
    }
  
    const discountAmount = totalPrice * discount;  // Rabattbetrag berechnen
    totalPrice -= discountAmount;  // Rabatt vom Gesamtpreis abziehen
  
    setDiscountAmount(discountAmount);  // Rabattbetrag setzen
  
    const option = formData.extras;
    if (option === "Außenreinigung") totalPrice += 10;
    if (option === "Innen-und-Außenreinigung") totalPrice += 20;
    if (option === "Innen-und-Außenreinigung-und-Tanken") totalPrice += 30;
  
    // Runden des Gesamtpreises auf 2 Dezimalstellen und auf Cent
    totalPrice = Math.round(totalPrice * 100) / 100;
  
    return totalPrice;
  };
  
  // Preis beim Laden berechnen
  useEffect(() => {
    const price = calculateTotalPrice();
    setTotalPrice(price);
  }, [formData]);
  
  // Stripe-Zahlung starten
  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      const stripe = await stripePromise;
  
      if (!stripe) {
        throw new Error("Stripe konnte nicht geladen werden.");
      }
  
      if (totalPrice <= 0) {
        throw new Error("Fehler bei der Preisberechnung.");
      }
  
      // Betrag in Cent senden
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100), // Betrag in Cent
          formData: formData,
        }),
      });
  
      const session = await response.json();
  
      if (!response.ok || session.error) {
        throw new Error(session.error || "Fehler bei der Zahlungsanfrage.");
      }
  
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
  
      if (error) {
        throw new Error(error.message || "Ein unbekannter Fehler ist aufgetreten.");
      }
  
      setSuccessMessage("Die Zahlung war erfolgreich! Vielen Dank für deine Bestellung.");
    } catch (error: any) {
      setErrorMessage(error.message || "Ein unbekannter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Zusammenfassung</h2>

      {/* Abholung Details */}
      <div className="flex justify-between border-b pb-4">
        <div>
          <p className="text-sm font-semibold text-gray-600">Abholung</p>
          <p className="text-lg font-medium">{formatDate(formData.pickupDate)} um {formData.pickupTime}</p>
        </div>
      </div>

      {/* Abgabe Details */}
      <div className="flex justify-between border-b pb-4">
        <div>
          <p className="text-sm font-semibold text-gray-600">Abgabe</p>
          <p className="text-lg font-medium">{formatDate(formData.dropOffDate)} um {formData.dropOffTime}</p>
        </div>
      </div>

      {/* Treffpunkt Details */}
      <div className="flex justify-between border-b pb-4">
        <div>
          <p className="text-sm font-semibold text-gray-600">Treffpunkt</p>
          <p className="text-lg font-medium">{formData.meetingPoint}</p>
        </div>
      </div>

      {/* Zusatzoptionen */}
      <div className="flex justify-between border-b pb-4">
        <div>
          <p className="text-sm font-semibold text-gray-600">Zusatzoptionen</p>
          <p className="text-lg font-medium">{formData.extras}</p>
        </div>
      </div>

      {/* Gesamtpreis */}
      <div className="flex justify-between border-b pb-6">
        <div>
          <p className="text-sm font-semibold text-gray-600">Gesamtpreis</p>
          {discountAmount > 0 && (
            <div className="text-sm font-semibold text-gray-400">
              <p className="line-through text-red-600">€{(totalPrice + discountAmount).toFixed(2)}</p>
            </div>
          )}
          <p className="text-xl font-bold text-blue-600">€{totalPrice.toFixed(2)}</p>
        </div>
        {discountAmount > 0 && (
          <div className="text-sm font-semibold text-green-600">
            <p>Rabatt: {discountAmount.toFixed(2)}€</p>
            <p>Du sparst: €{discountAmount.toFixed(2)}</p>
          </div>
        )}
        {(discountAmount === 0) && (
          <div className="text-sm font-semibold text-yellow-600">
            <p>Weitere {10 - Math.ceil((new Date(formData.dropOffDate).getTime() - new Date(formData.pickupDate).getTime()) / (1000 * 3600 * 24))} Tage hinzufügen <br/> für 5% Rabatt!</p>
          </div>
        )}
      </div>

      {/* Bezahl-Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handlePayment}
          disabled={loading || totalPrice <= 0}
          className="px-6 py-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          {loading ? "Zahlung läuft..." : `Jetzt bezahlen (€${totalPrice.toFixed(2)})`}
        </button>
      </div>

      {/* Fehler und Erfolgsmeldungen */}
      {errorMessage && <div className="text-red-600 text-center mt-4">{errorMessage}</div>}
      {successMessage && <div className="text-green-600 text-center mt-4">{successMessage}</div>}
    </div>
  );
}
