'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketPurchase: (ticket: any) => void;
}

const TICKET_PRICES = {
  'Intero': 15,
  'Ridotto': 10,
  'Bambino': 8,
  'Famiglia': 35
};

const PAYMENT_METHODS = [
  { id: 'card', name: 'Carta di Credito', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '📱' },
  { id: 'transfer', name: 'Bonifico', icon: '🏦' }
];

export default function ChatBot({ isOpen, onClose, onTicketPurchase }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'text',
      content: 'Ciao! Sono l\'assistente virtuale del Museo del Clima. Come posso aiutarti? Puoi chiedermi informazioni, orari o prenotare i biglietti.',
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [bookingStep, setBookingStep] = useState<'idle' | 'date' | 'time' | 'tickets' | 'payment'>('idle');
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    tickets: {} as Record<string, number>,
    name: '',
    email: '',
    paymentMethod: ''
  });
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'it-IT';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSendMessage(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      type: 'text',
      content: message,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Se siamo in fase di prenotazione, gestiamo localmente
      if (bookingStep !== 'idle') {
        await processBookingStep(message);
        return;
      }

      // Altrimenti, inviamo alla API per una risposta AI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore nella risposta del server');
      }

      if (!data.success) {
        throw new Error(data.error || 'Errore nella risposta del server');
      }

      setMessages(prev => [...prev, {
        type: 'text',
        content: data.risposta,
        sender: 'bot'
      }]);

    } catch (error) {
      console.error('Errore:', error);
      setMessages(prev => [...prev, {
        type: 'text',
        content: error instanceof Error ? error.message : 'Mi dispiace, si è verificato un errore. Riprova più tardi.',
        sender: 'bot'
      }]);
    }
  };

  const processBookingStep = async (message: string) => {
    switch (bookingStep) {
      case 'date':
        const dateMatch = message.match(/\d{2}\/\d{2}\/\d{4}/);
        if (dateMatch) {
          setBookingData(prev => ({ ...prev, date: dateMatch[0] }));
          setBookingStep('time');
          setMessages(prev => [...prev, {
            type: 'text',
            content: 'Ottimo! A che ora preferisci? (es. 14:30)',
            sender: 'bot'
          }]);
        } else {
          setMessages(prev => [...prev, {
            type: 'text',
            content: 'Per favore, inserisci la data nel formato GG/MM/AAAA',
            sender: 'bot'
          }]);
        }
        break;

      case 'time':
        const timeMatch = message.match(/\d{2}:\d{2}/);
        if (timeMatch) {
          setBookingData(prev => ({ ...prev, time: timeMatch[0] }));
          setBookingStep('tickets');
          setMessages(prev => [...prev, {
            type: 'text',
            content: 'Perfetto! Scegli il tipo di biglietto:',
            sender: 'bot'
          }]);
        } else {
          setMessages(prev => [...prev, {
            type: 'text',
            content: 'Per favore, inserisci l\'ora nel formato HH:MM',
            sender: 'bot'
          }]);
        }
        break;

      case 'tickets':
        if (!selectedTicketType) {
          const ticketType = Object.keys(TICKET_PRICES).find(type => 
            message.toLowerCase().includes(type.toLowerCase())
          );
          
          if (ticketType) {
            setSelectedTicketType(ticketType);
            setMessages(prev => [...prev, {
              type: 'text',
              content: `Hai scelto ${ticketType} (€${TICKET_PRICES[ticketType as keyof typeof TICKET_PRICES]}). Quanti biglietti vuoi acquistare?`,
              sender: 'bot'
            }]);
          } else {
            setMessages(prev => [...prev, {
              type: 'text',
              content: 'Per favore, scegli uno dei seguenti tipi di biglietto:\n' + 
                Object.entries(TICKET_PRICES)
                  .map(([type, price]) => `${type}: €${price}`)
                  .join('\n'),
              sender: 'bot'
            }]);
          }
        } else {
          const quantity = parseInt(message);
          if (!isNaN(quantity) && quantity > 0) {
            setTicketQuantity(quantity);
            setBookingData(prev => ({
              ...prev,
              tickets: { [selectedTicketType]: quantity }
            }));
            setBookingStep('payment');
            setMessages(prev => [...prev, {
              type: 'text',
              content: `Ottimo! Hai selezionato ${quantity} biglietto/i ${selectedTicketType}.\nScegli il metodo di pagamento:\n` +
                PAYMENT_METHODS.map(method => `${method.icon} ${method.name}`).join('\n'),
              sender: 'bot'
            }]);
          } else {
            setMessages(prev => [...prev, {
              type: 'text',
              content: 'Per favore, inserisci un numero valido di biglietti.',
              sender: 'bot'
            }]);
          }
        }
        break;

      case 'payment':
        const selectedMethod = PAYMENT_METHODS.find(method => 
          message.toLowerCase().includes(method.name.toLowerCase())
        );

        if (selectedMethod) {
          setBookingData(prev => ({ ...prev, paymentMethod: selectedMethod.id }));
          
          const total = TICKET_PRICES[selectedTicketType as keyof typeof TICKET_PRICES] * ticketQuantity;

          const ticket = {
            id: Math.random().toString(36).substr(2, 9),
            date: bookingData.date,
            time: bookingData.time,
            type: `${ticketQuantity}x ${selectedTicketType}`,
            quantity: ticketQuantity,
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              JSON.stringify({
                id: Math.random().toString(36).substr(2, 9),
                date: bookingData.date,
                time: bookingData.time,
                tickets: { [selectedTicketType!]: ticketQuantity },
                total: total
              })
            )}`
          };

          onTicketPurchase(ticket);
          setMessages(prev => [...prev, {
            type: 'text',
            content: `Prenotazione completata! Totale: €${total}\nIl tuo QR code è stato generato e sarà disponibile nella sezione "I tuoi Biglietti".`,
            sender: 'bot'
          }]);
          setBookingStep('idle');
          setSelectedTicketType(null);
          setTicketQuantity(1);
          setBookingData({
            date: '',
            time: '',
            tickets: {},
            name: '',
            email: '',
            paymentMethod: ''
          });
        } else {
          setMessages(prev => [...prev, {
            type: 'text',
            content: 'Per favore, seleziona uno dei metodi di pagamento disponibili',
            sender: 'bot'
          }]);
        }
        break;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => onClose()}
        className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.sender === 'user'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-800 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line">{message.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder="Scrivi un messaggio o chiedi di prenotare i biglietti..."
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <button
            onClick={() => handleSendMessage(input)}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm"
          >
            Invia
          </button>
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-6 py-3 rounded-xl transition-colors shadow-sm ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isListening ? 'Stop' : '🎤'}
          </button>
        </div>
      </div>
    </div>
  );
} 