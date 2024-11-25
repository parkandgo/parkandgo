'use client';

import { useEffect, useState } from 'react';

// Typ für die Order-Daten definieren
type Order = {
  id: number;
  pickup_date: string;
  pickup_time: string;
  dropoff_date: string;
  dropoff_time: string;
  meeting_point: string;
  extras: string | null;
  total_price: number;
  email: string;
  did_pay: boolean;
  session_id: string | null;
  payment_method: string | null;
  created_at: string;
};

// Hilfsfunktion zum Formatieren von Datum
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'past' | 'upcoming'>('all');
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setOrders(data.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Bestellungen:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filterlogik basierend auf dem aktiven Tab
  useEffect(() => {
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3); // +3 Tage

    const filtered = orders.filter((order) => {
      const pickupDate = new Date(order.pickup_date);
      const dropoffDate = new Date(order.dropoff_date);

      if (activeTab === 'active') {
        return pickupDate <= now && dropoffDate >= now;
      }
      if (activeTab === 'past') {
        return dropoffDate < now;
      }
      if (activeTab === 'upcoming') {
        return pickupDate > now && pickupDate <= threeDaysFromNow;
      }
      return true; // Default für 'all'
    });

    setFilteredOrders(filtered);
  }, [orders, activeTab]);

  if (loading) return <p className="text-center text-gray-500">Lädt...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Dashboard</h1>

      {/* Filter-Tabs */}
      <div className="flex justify-center space-x-4 mb-8 max-md:flex-col max-md:gap-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded ${
            activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          } `}
        >
          Alle
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded ${
            activeTab === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Aktive Fahrzeuge
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded ${
            activeTab === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Vergangen
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded ${
            activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Bevorstehend
        </button>
      </div>

      {/* Bestellungen anzeigen */}
      <ul className="space-y-4">
        {filteredOrders.map((order) => (
          <li
            key={order.id}
            className="bg-white shadow-md rounded p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {order.meeting_point}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.pickup_date)} - {formatDate(order.dropoff_date)}
                </p>
                <p className="text-sm text-gray-500">
                  {order.pickup_time} - {order.dropoff_time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-700">
                  {order.total_price} €
                </p>
                <p
                  className={`text-sm font-medium ${
                    order.did_pay ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {order.did_pay ? 'Bezahlt' : 'Nicht bezahlt'}
                </p>
              </div>
              <button
                onClick={() =>
                  setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                }
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
              >
                {expandedOrderId === order.id ? 'Details verbergen' : 'Details anzeigen'}
              </button>
            </div>

            {/* Details bei Bedarf anzeigen */}
            {expandedOrderId === order.id && (
              <div className="mt-4 border-t border-gray-300 pt-4 text-sm text-gray-600">
                <p>
                  <span className="font-bold">E-Mail:</span> {order.email}
                </p>
                <p>
                  <span className="font-bold">Extras:</span> {order.extras || 'Keine'}
                </p>
                <p className='break-words'>
                  <span className="font-bold">Session ID:</span>{' '}
                  {order.session_id || 'Nicht verfügbar'}
                </p>
                <p>
                  <span className="font-bold">Zahlungsmethode:</span>{' '}
                  {order.payment_method || 'Nicht verfügbar'}
                </p>
                <p>
                  <span className="font-bold">Erstellt am:</span>{' '}
                  {new Date(order.created_at).toLocaleString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
