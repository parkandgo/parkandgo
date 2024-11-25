import { useState } from 'react';

interface ContactDetailsProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function ContactDetails({ formData, setFormData }: ContactDetailsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Name Input */}
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Ihr Name"
          className="mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      {/* Email Input */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm font-semibold text-gray-700">E-Mail</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Ihre E-Mail-Adresse"
          className="mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      {/* Phone Number Input */}
      <div className="flex flex-col">
        <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Telefon</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Ihre Telefonnummer"
          className="mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>
    </div>
  );
}
