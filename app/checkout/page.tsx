"use client";
import '../assets/styles/checkout/page.scss'
import { useState } from 'react';
import BookingDetails from './BookingDetails';
import ContactDetails from './ContactDetails';
import AddOns from './AddOns';  // Import the AddOns component
import Summary from './Summary';
import { FaCheck } from 'react-icons/fa';

const steps = [
  { id: 1, title: 'Buchungsdetails' },
  { id: 2, title: 'Zusatzoptionen' }, // Add the new Add-Ons step here
  { id: 3, title: 'Kontaktdaten' },
  { id: 4, title: 'Zusammenfassung' },  // Move the Summary step to 4
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    dropOffDate: '',
    dropOffTime: '',
    meetingPoint: '',
    ticketNumber: '',
    extras: '',
    name: '',
    email: '',
    phone: '',
    totalPrice: 0,
    orderId: '12345',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Validierungsfunktionen
  const validateForm = () => {
    if (currentStep === 1) {
      if (!formData.pickupDate || !formData.pickupTime || !formData.dropOffDate || !formData.dropOffTime || !formData.meetingPoint || !formData.ticketNumber) {
        setErrorMessage('Bitte füllen Sie alle Felder aus.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.name || !formData.email || !formData.phone) {
        setErrorMessage('Bitte geben Sie Ihre Kontaktdaten ein.');
        return false;
      }

      // E-Mail Validierung
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return false;
      }

      // Telefonnummer Validierung (muss mit Ländercode beginnen)
      const phoneRegex = /^\+(\d{1,4})\s?\(?(\d{1,4})\)?[\d\s-]{5,}$/;
      if (!phoneRegex.test(formData.phone)) {
        setErrorMessage('Bitte geben Sie eine gültige Telefonnummer mit Ländercode ein.');
        return false;
      }
    }

    setErrorMessage('');
    return true;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep((prev) => {
        const nextStep = Math.min(prev + 1, steps.length);
        // Scrollen nach oben
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return nextStep;
      });
    }
  };
  
  const handlePreviousStep = () => {
    setCurrentStep((prev) => {
      const prevStep = Math.max(prev - 1, 1);
      // Scrollen nach oben
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return prevStep;
    });
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-20 max-md:ml-2 max-md:mr-4 max-md:mt-10 max-md:mb-10">
      <h1 className="text-3xl font-bold text-center mb-8 OswaldBold">PARK & GO Buchen</h1>
      
      {/* Steps Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-between items-center">
          {steps.map((step) => (
            <div key={step.id} className={`step ${currentStep >= step.id ? 'active' : ''} text-center w-full sm:w-auto`}>
              <div className={`step-title text-lg font-semibold ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'} text-sm sm:text-base`}>
                {step.title}
              </div>
              <div className={`step-indicator ${currentStep >= step.id ? 'bg-blue-600' : 'bg-gray-300'} w-8 h-8 flex items-center justify-center rounded-full text-white mx-auto`}>
                {currentStep > step.id ? <FaCheck /> : step.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Components */}
      <div className="space-y-8">
        {currentStep === 1 && <BookingDetails formData={formData} setFormData={setFormData} />}
        {currentStep === 2 && <AddOns formData={formData} setFormData={setFormData} />}
        {currentStep === 3 && <ContactDetails formData={formData} setFormData={setFormData} />}
        {currentStep === 4 && <Summary formData={formData} />}
      </div>

      {/* Error Message */}
      {errorMessage && <div className="text-red-600 text-center mt-4">{errorMessage}</div>}

      {/* Step Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {currentStep > 1 && (
          <button
            onClick={handlePreviousStep}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Zurück
          </button>
        )}
        {currentStep < steps.length && (
          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Weiter
          </button>
        )}
      </div>
    </div>
  );
}
