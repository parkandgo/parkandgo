import React, { useEffect, useState } from 'react';

const options = [
  { value: 'Keine Zusatzoption', name: 'Keine Zusatzoption', price: 0, description: 'Keine Zusatzoptionen ausgewählt.' },
  { value: 'Außenreinigung', name: 'Außenreinigung', price: 10, description: 'Reinigung des Fahrzeugs von außen.' },
  { value: 'Innen-und-Außenreinigung', name: 'Innen- und Außenreinigung', price: 20, description: 'Komplette Reinigung des Fahrzeugs von innen und außen.' },
  { value: 'Innen-und-Außenreinigung-und-Tanken', name: 'Innen- und Außenreinigung + Tanken', price: 30, description: 'Tankkosten sind nicht im Gesamtpreis enthalten und werden separat berechnet.' },
];

export default function AddOns({ formData, setFormData }: any) {
  const [selectedOption, setSelectedOption] = useState<string>(formData.extras || 'Keine');

  useEffect(() => {
    const { totalPrice, discount, discountAmount } = calculateTotalPriceWithExtras();
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      extras: selectedOption,
      totalPrice: totalPrice.toFixed(2), // apply toFixed to the totalPrice
    }));
  }, [selectedOption, setFormData]);

  const calculateTotalPriceWithExtras = () => {
    const pickupTime = new Date(formData.pickupDate + ' ' + formData.pickupTime);
    const dropOffTime = new Date(formData.dropOffDate + ' ' + formData.dropOffTime);

    // Berechnung der Mietdauer, unter Berücksichtigung des Falls, dass Abholung und Abgabe gleich sind
    let rentalDays = Math.ceil((dropOffTime.getTime() - pickupTime.getTime()) / (1000 * 3600 * 24));

    // Wenn Abholung und Abgabezeit gleich sind, mindestens 1 Tag berechnen
    if (rentalDays <= 0) rentalDays = 1;

    let totalPrice = rentalDays * 11.9; // 11,90 € pro Tag

    const option = options.find((opt) => opt.value === selectedOption);
    if (option) totalPrice += option.price; // Hinzufügen der Kosten der ausgewählten Option

    // Berechnung des Rabatts
    let discount = 0;
    if (rentalDays >= 30) {
      discount = 0.10; // 10% Rabatt für 30+ Tage
    } else if (rentalDays >= 10) {
      discount = 0.05; // 5% Rabatt für 10-29 Tage
    }

    const discountAmount = totalPrice * discount;
    totalPrice -= discountAmount;

    return { totalPrice, discount, discountAmount, rentalDays };
  };

  const { totalPrice, discount, discountAmount, rentalDays } = calculateTotalPriceWithExtras();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Zusatzoptionen</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => setSelectedOption(option.value)}
            className={`cursor-pointer p-4 border rounded-lg text-center ${selectedOption === option.value ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            <h3 className="font-medium text-lg">{option.name}</h3>
            {option.price > 0 && <p className="text-sm">+{option.price}€</p>}
            <p className={`text-sm mt-2 ${selectedOption === option.value ? ' text-white' : 'text-gray-500'}`}>
              {option.description}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6 border-b pb-6">
        <div>
          <p className="text-sm font-semibold text-gray-600">Gesamtpreis</p>
          {discount > 0 && (
            <div className="text-sm font-semibold text-gray-400">
              <p className="line-through text-red-600">€{(totalPrice + discountAmount).toFixed(2)}</p>
            </div>
          )}
          <p className="text-xl font-bold text-blue-600">€{totalPrice.toFixed(2)}</p>
        </div>
        {discount > 0 && (
          <div className="text-sm font-semibold text-green-600">
            <p>Rabatt: {discount * 100}%</p>
            <p>Du sparst: €{discountAmount.toFixed(2)}</p>
          </div>
        )}
        {(discount === 0) && (
          <div className="text-sm font-semibold text-yellow-600">
            <p>Weitere {10 - rentalDays} Tage hinzufügen <br/> für 5% Rabatt!</p>
          </div>
        )}
      </div>
    </div>
  );
}
