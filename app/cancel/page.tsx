"use client";
import Image from "next/image";
// app/cancel/page.tsx
import { useState } from "react";
import { FaSmile, FaShieldAlt, FaQuestionCircle, FaHeart, FaPhoneAlt } from "react-icons/fa"; // Smile, Shield, Question, Heart, Phone

const Cancel = () => {
  const [feedback, setFeedback] = useState<string>("");
  const [agreed, setAgreed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const handleFeedbackSubmit = async () => {
    if (!agreed || !feedback) {
      setMessage("Bitte gib dein Feedback ein und stimme zu.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/email/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: feedback }),
      });

      if (response.ok) {
        setMessage("Danke für dein Feedback! Es hilft uns, besser zu werden.");
      } else {
        setMessage("Es gab ein Problem beim Senden deines Feedbacks.");
      }
    } catch (error) {
      setMessage("Fehler: Bitte versuche es später noch einmal.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setIsOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="cancel-page max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-600">
        Oh schade, du verlässt uns!
      </h1>

      <p className="text-lg text-center mb-4">
        Es tut uns leid, dass du die Zahlung abgebrochen hast. 
      </p>

      {/* Feedback Eingabe */}
      <div className="mb-6">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Was können wir verbessern?"
          rows={4}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Feedback Zustimmung */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={agreed}
          onChange={() => setAgreed(!agreed)}
          className="mr-2"
        />
        <label className="text-gray-600">
          Ich stimme zu, dass mein Feedback gesendet wird.
        </label>
      </div>

      {/* Buttons nebeneinander */}
      <div className="flex justify-between">
        <button
          onClick={handleFeedbackSubmit}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex-1 mr-2"
        >
          {loading ? "Feedback wird gesendet..." : "Feedback senden"}
        </button>

        <a
          href="/checkout"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex-1 ml-2"
        >
          Neue Buchung
        </a>
      </div>

      {/* Nachricht */}
      {message && <div className="text-center text-lg text-gray-600 mt-4">{message}</div>}

      {/* FAQ Accordions */}
      <div className="mt-8">
        {/* Warum werde ich auf Stripe weitergeleitet? */}
        <div className="cursor-pointer text-lg font-semibold text-gray-700" onClick={() => toggleFAQ(1)}>
          <div className="flex items-center">
            <FaQuestionCircle className="mr-2" /> Warum werde ich auf Stripe weitergeleitet?{" "}
            <FaSmile className="ml-2" />
          </div>
        </div>
        {isOpen[1] && (
          <div className="text-gray-600 mt-4">
            <p>
              Ganz einfacher Grund: Wir möchten dir die sicherste Zahlung und modernste Technologien bieten,
              damit Hacker keine Chance haben und du schnell, sicher und sorgenfrei den Parkservice buchen kannst.
            </p>
          </div>
        )}

        {/* Ist Stripe wirklich so sicher? */}
        <div
          className="cursor-pointer text-lg font-semibold text-gray-700 mt-6"
          onClick={() => toggleFAQ(2)}
        >
          <div className="flex items-center">
            <FaQuestionCircle className="mr-2" /> Ist Stripe wirklich so sicher?{" "}
            <FaShieldAlt className="ml-2" />
          </div>
        </div>
        {isOpen[2] && (
          <div className="text-gray-600 mt-4">
            <p>
              Ja, Stripe ist der größte Zahlungsabwickler, auch wenn ihn viele nicht kennen. Große Namen wie PayPal, 
              Visa, American Express (Amex), Amazon und viele mehr vertrauen Stripe. Millionen von Entwicklern setzen auf
              Stripe. Wenn deine Verunsicherung der Grund für den Abbruch war, finden wir es gut, dass du vorsichtig bist,
              aber mach dir keine Sorgen und erstelle einfach eine neue Buchung. Nach dem Checkout gelangst du wieder auf
              unsere Seite und erhältst deine Bestelldetails per E-Mail für deine Unterlagen.
            </p>
          </div>
        )}

        {/* Kann ich meine Buchung später noch ändern oder stornieren? */}
        <div
          className="cursor-pointer text-lg font-semibold text-gray-700 mt-6"
          onClick={() => toggleFAQ(3)}
        >
          <div className="flex items-center">
            <FaQuestionCircle className="mr-2" /> Kann ich meine Buchung später noch ändern oder stornieren?{" "}
            <FaPhoneAlt className="ml-2" />
          </div>
        </div>
        {isOpen[3] && (
          <div className="text-gray-600 mt-4">
            <p>
              Deine Buchung kannst du selbstverständlich stornieren oder ändern. Nutze einfach unser Kontaktformular oder
              ruf uns telefonisch an. Wir finden eine Lösung für dich!
            </p>
          </div>
        )}

        {/* Kann ich Park & GO vertrauen? */}
        <div
          className="cursor-pointer text-lg font-semibold text-gray-700 mt-6"
          onClick={() => toggleFAQ(4)}
        >
          <div className="flex items-center">
            <FaQuestionCircle className="mr-2" /> Kann ich Park & GO vertrauen?{" "}
            <FaHeart className="ml-2" />
          </div>
        </div>
        {isOpen[4] && (
          <div className="text-gray-600 mt-4">
            <p>
              Ja, das kannst du definitiv! Wir geben immer unser Bestes, da wir wissen, dass Qualität und Engagement sich
              auszahlen. Zufriedene Kunden sind wiederkehrende Kunden. Bei uns bekommst du keine unsicheren Webseiten oder
              unflexible Abläufe. Bei uns ist der Kunde König!
            </p>
          </div>
        )}
      </div>

      {/* Weitere Erklärungen */}
      <div className="mt-6 text-gray-600">
        <p>
          Wir von Park & GO legen großen Wert darauf, unseren Kunden den besten Service zu bieten. Deshalb möchten wir
          sicherstellen, dass du beim Bezahlvorgang höchste Sicherheit und Vertrauen hast. Unser Ziel ist es, langfristige
          Beziehungen zu unseren Kunden aufzubauen, und dafür setzen wir auf moderne, sichere Zahlungsabwicklungen wie Stripe.
        </p>
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
    </div>
  );
};

export default Cancel;
