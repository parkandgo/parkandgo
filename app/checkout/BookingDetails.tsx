import { useState, useEffect } from 'react';

interface FormData {
  pickupDate: string;
  pickupTime: string;
  dropOffDate: string;
  dropOffTime: string;
  meetingPoint: string;
  ticketNumber: string;
  extras: string;
  name: string;
  email: string;
  phone: string;
  totalPrice: number;
  orderId: string;
}

interface BookingDetailsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function BookingDetails({ formData, setFormData }: BookingDetailsProps) {
  // Helper function to calculate the time and date 30 minutes in the future
  const getMinPickupTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 35); // Add 30 minutes to the current time

    const adjustedDate = now.toLocaleDateString('en-CA'); // 'en-CA' format is YYYY-MM-DD
    const adjustedTime = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); // Format as HH:MM

    return { adjustedDate, adjustedTime };
  };

  // Function to check if the selected time is at least 30 minutes in the future
  const isValidTime = (selectedDate: string, selectedTime: string) => {
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    return selectedDateTime > now && (selectedDateTime.getTime() - now.getTime()) >= 30 * 60 * 1000;
  };

  // Error state for form validation
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize only if no values are set
    if (!formData.pickupDate || !formData.pickupTime) {
      const { adjustedDate, adjustedTime } = getMinPickupTime();
      setFormData((prev: FormData) => ({
        ...prev,
        pickupDate: adjustedDate,
        pickupTime: adjustedTime,
        dropOffDate: adjustedDate,
        dropOffTime: adjustedTime,
      }));
    }
  }, [formData, setFormData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validate pickup date/time
    if (name === "pickupDate" || name === "pickupTime") {
      const selectedDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}:00`);
      const now = new Date();

      // If selected time is less than 30 minutes in the future, set it to 30 minutes from now
      if (!isValidTime(formData.pickupDate, formData.pickupTime)) {
        const { adjustedDate, adjustedTime } = getMinPickupTime();
        setFormData((prev: FormData) => ({
          ...prev,
          pickupDate: adjustedDate,
          pickupTime: adjustedTime,
        }));
        setError("Frühestens in 30 Minuten buchen!");
        return;
      } else {
        setError(null);
      }
    }

    // Ensure drop-off date is not earlier than pickup date/time
    if (name === "dropOffDate" || name === "dropOffTime") {
      const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}:00`);
      const dropOffDateTime = new Date(`${formData.dropOffDate}T${formData.dropOffTime}:00`);

      if (dropOffDateTime < pickupDateTime) {
        setFormData((prev: FormData) => ({
          ...prev,
          dropOffDate: formData.pickupDate,
          dropOffTime: formData.pickupTime,
        }));
        setError("Abgabedatum und -zeit können nicht vor dem Abholdatum und -zeit liegen.");
      } else {
        setError(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Pickup Date and Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="pickupDate" className="text-sm font-semibold text-gray-700">Wir holen ab</label>
          <input
            type="date"
            name="pickupDate"
            id="pickupDate"
            value={formData.pickupDate}
            onChange={handleInputChange}
            onBlur={handleBlur} // Trigger validation when the input loses focus
            min={new Date().toLocaleDateString('en-CA')} // Prevent past dates using local timezone date format
            className="mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="pickupTime" className="text-sm font-semibold text-gray-700">Abholzeit</label>
          <input
            type="time"
            name="pickupTime"
            id="pickupTime"
            value={formData.pickupTime}
            onChange={handleInputChange}
            onBlur={handleBlur} // Trigger validation when the input loses focus
            min={getMinPickupTime().adjustedTime} // Set minimum time to 30 minutes from now
            className="mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
            required
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Drop-off Date and Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="dropOffDate" className="text-sm font-semibold text-gray-700">Wir bringen zurück</label>
          <input
            type="date"
            name="dropOffDate"
            id="dropOffDate"
            value={formData.dropOffDate}
            onChange={handleInputChange}
            min={formData.pickupDate} // Drop-off date cannot be earlier than pickup date
            className="mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="dropOffTime" className="text-sm font-semibold text-gray-700">Abgabezeit</label>
          <input
            type="time"
            name="dropOffTime"
            id="dropOffTime"
            value={formData.dropOffTime}
            onChange={handleInputChange}
            className="mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
            required
          />
        </div>
      </div>

      {/* Meeting Point */}
      <div className="flex flex-col">
        <label htmlFor="meetingPoint" className="text-sm font-semibold text-gray-700">Treffpunkt</label>
        <input
          type="text"
          name="meetingPoint"
          id="meetingPoint"
          value={formData.meetingPoint}
          onChange={handleInputChange}
          placeholder="Treffpunkt eingeben"
          className="mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
          required
        />
      </div>

      {/* Ticket Number (required) */}
      <div className="flex flex-col">
        <label htmlFor="ticketNumber" className="text-sm font-semibold text-gray-700">
          Ticketnummer
        </label>
        <input
          type="text"
          name="ticketNumber"
          id="ticketNumber"
          value={formData.ticketNumber}
          onChange={handleInputChange}
          placeholder="Ticketnummer eingeben"
          className="mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
          required
        />
      </div>
    </div>
  );
}
