'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QrCodeDisplayProps {
  qrCode: string;
  onClose: () => void;
}

export default function QrCodeDisplay({ qrCode, onClose }: QrCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(qrCode, {
          width: 300,
          margin: 2,
          color: {
            dark: '#166534', // green-800
            light: '#ffffff',
          },
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, [qrCode]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'prenotazione-museo-clima.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Il tuo QR Code</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent" />
          </div>
        ) : (
          <img
            src={qrCodeUrl}
            alt="QR Code Prenotazione Museo del Clima"
            className="w-full h-auto"
          />
        )}
      </div>

      <p className="text-gray-600 mb-6">
        Mostra questo QR code all'ingresso del Green Hub per accedere al Museo del Clima
      </p>

      <button
        onClick={handleDownload}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Scarica QR Code
      </button>
    </div>
  );
} 