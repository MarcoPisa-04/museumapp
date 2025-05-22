import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import './globals.css';

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'Museo del Clima',
  description: 'Visita il Museo del Clima nel Green Hub di Cava de\' Tirreni',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>

          <footer className="glass mt-auto">
            <div className="container-custom py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold gradient-text">Museo del Clima</h3>
                  <div className="decoration-line mb-4"></div>
                  <p className="text-gray-600">
                    Un viaggio attraverso il tempo per comprendere il cambiamento climatico e le sue implicazioni.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold gradient-text">Orari</h3>
                  <div className="decoration-line mb-4"></div>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-800">Lunedì - Venerdì:</span><br />
                      9:00 - 18:00
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-800">Sabato:</span><br />
                      10:00 - 20:00
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-800">Domenica:</span><br />
                      10:00 - 19:00
                    </p> 
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold gradient-text">Contatti</h3>
                  <div className="decoration-line mb-4"></div>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-800">Indirizzo:</span><br />
                      Green Hub, Cava de' Tirreni
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-800">Tel:</span><br />
                      +39 XXX XXX XXXX
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-800">Email:</span><br />
                      info@museodelclima.it
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-gray-100">
                <p className="text-center text-gray-500">
                  © 2025 Museo del Clima. Tutti i diritti riservati.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
