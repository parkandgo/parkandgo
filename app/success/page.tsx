"use client";

import "../assets/styles/success/success.scss"
import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';  // React Icon für Erfolg
import Image from 'next/image';

const Success = () => {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) {
      setSessionId(sessionId);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl relative overflow-hidden">
      {/* Pyro Effect */}
      <div className="pyro">
        <div className="before"></div>
        <div className="after"></div>
      </div>

      <div className="flex justify-center mb-6">
        <FaCheckCircle className="text-green-500 text-6xl" />
      </div>

      <h1 className="text-4xl font-semibold text-center mb-4 text-green-600">Bestellung erfolgreich abgeschlossen!</h1>

      <p className="text-lg text-center mb-6">Herzlichen Glückwunsch, deine Zahlung war erfolgreich!</p>


      <div className="text-center mb-6">
        <p className="text-lg text-gray-600">
          Du erhältst in Kürze eine E-Mail mit deinen Buchungsdetails. <br/> Falls du keine E-Mail siehst, schau bitte auch in deinem Spam-Ordner nach.
        </p>
      </div>

      <div className="text-center">
        <a
          href="/checkout"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Neue Buchung vornehmen
        </a>
      </div>

      {/* Optional: Add a cute image for more personality */}
      <div className="mt-10 flex justify-center">
        <Image
          draggable={false}
          src="/images/secure-stripe-payment-logo.png" // Hier kannst du ein passendes Dankeschön-Bild einfügen
          alt="Thank you"
          width={300}
          height={200}
        />
      </div>

      {/* Display session ID in small font, hidden from the main view */}
      {sessionId && (
        <div className="pt-4 text-center text-xs text-gray-500">
          <p>Session-ID (Zahlungsreferenz): {sessionId}</p>
        </div>
      )}
    </div>
  );
};

export default Success;
