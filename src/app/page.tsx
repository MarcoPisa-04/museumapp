'use client';

import { useState, useEffect } from 'react';
import ChatBot from '@/components/ChatBot';
import QrCodeDisplay from '@/components/QrCodeDisplay';

interface Ticket {
  id: string;
  date: string;
  time: string;
  type: string;
  quantity: number;
  qrCode: string;
}

const TICKET_PRICES = {
  'Intero': 15,
  'Ridotto': 10,
  'Bambino': 8,
  'Famiglia': 35
};

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [purchasedTickets, setPurchasedTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTicketPurchase = (ticket: Ticket) => {
    setPurchasedTickets(prev => [...prev, ticket]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[url('/museum-bg.jpg')] bg-cover bg-center opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-green-600/20 via-transparent to-green-800/20" />

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-green-600' : 'text-white drop-shadow-lg'
            }`}>
              Museo del Clima
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-800/90" />
          <div className="absolute inset-0 bg-[url('/museum-bg.jpg')] bg-cover bg-center mix-blend-overlay" />
          <div className="relative container mx-auto px-4 text-center z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg animate-fade-in">
              Scopri il futuro del nostro pianeta
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90 drop-shadow animate-fade-in-delay">
              Un viaggio interattivo nel Green Hub di Cava de' Tirreni
            </p>
          </div>
        </section>

        {/* ChatBot Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 border-b bg-gradient-to-r from-green-600 to-green-700">
                  <h3 className="font-semibold text-white text-xl">Assistente Virtuale</h3>
                </div>
                <div className="h-[400px]">
                  <ChatBot
                    isOpen={isChatOpen}
                    onClose={() => {}}
                    onTicketPurchase={handleTicketPurchase}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info and Tickets Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Opening Hours and Prices */}
              <div className="space-y-8">
                {/* Opening Hours */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-green-800">Orari di Apertura</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                      <span className="font-medium">Lunedì - Venerdì</span>
                      <span className="text-green-600 font-semibold">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                      <span className="font-medium">Sabato</span>
                      <span className="text-green-600 font-semibold">10:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                      <span className="font-medium">Domenica</span>
                      <span className="text-green-600 font-semibold">10:00 - 19:00</span>
                    </div>
                  </div>
                </div>

                {/* Prices */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-green-800">Prezzi Biglietti</h3>
                  <div className="space-y-4">
                    {Object.entries(TICKET_PRICES).map(([type, price]) => (
                      <div key={type} className="flex justify-between items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                        <span className="font-medium">{type}</span>
                        <span className="text-green-600 font-semibold">€{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tickets Section */}
              <div id="tickets-section">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-green-800">I tuoi Biglietti</h3>
                  {purchasedTickets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-6 text-green-600">
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 10V6c0-1.11-.9-2-2-2H4C2.9 4 2 4.89 2 6v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46 0-1.48-.8-2.77-1.99-3.46L4 6h16v2.54z" />
                        </svg>
                      </div>
                      <p className="text-xl mb-4 text-gray-700">Non hai ancora acquistato biglietti</p>
                      <p className="text-gray-600">Usa l'assistente virtuale per prenotare la tua visita</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {purchasedTickets.map(ticket => (
                        <div
                          key={ticket.id}
                          className="bg-white border border-green-100 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-[1.02]"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-lg text-green-800">{ticket.type}</h4>
                              <p className="text-gray-600">
                                {ticket.date} - {ticket.time}
                              </p>
                            </div>
                            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                              {ticket.quantity} {ticket.quantity === 1 ? 'biglietto' : 'biglietti'}
                            </span>
                          </div>
                          <button
                            className="w-full bg-green-50 text-green-600 py-3 rounded-lg hover:bg-green-100 transition-colors font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                            }}
                          >
                            Mostra QR Code
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QR Code Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 transform transition-all animate-scale-in">
            <QrCodeDisplay
              qrCode={selectedTicket.qrCode}
              onClose={() => setSelectedTicket(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 