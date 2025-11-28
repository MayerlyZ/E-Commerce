
"use client";

import { useState } from 'react';

export default function DashboardPage() {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContactClick = async () => {
    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          asunto: "El toque final que mereces ✨",
          mensajeHtml: `
            <div style="font-family:Inter,sans-serif;color:#592202;background:#F2E7DC;padding:24px;border-radius:24px;">
              <h2 style="margin-top:0; font-family:'Playfair Display', serif; font-style: italic; color:#592202; font-size:28px;">Olas ✨ </h2>
              <p style="line-height:1.6;font-size:16px;margin:16px 0;">
                  Bienvenid@ <strong>${email}</strong> Para conocer mas, inicia sesion. 
              </p>
            </div>
          `,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal al enviar el correo.');
      }

      setStatusMessage(data.res);
      setEmail(''); 
    } catch (error: any) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-6 text-olas-dark">Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8">Bienvenido al panel de administración de Olas Accesory</p>
      
      <div className="bg-white rounded-lg shadow p-8 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-olas-dark">Contacto</h2>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg border border-olas-dark focus:outline-none focus:ring-2 focus:ring-olas-dark text-black"
          />
          <button 
            onClick={handleContactClick}
            disabled={loading || !email}
            className="bg-olas-dark hover:bg-olas-light text-white font-semibold py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Contactarme'}
          </button>
          {statusMessage && (
            <p className={`text-sm ${statusMessage.includes('Error') || statusMessage.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
              {statusMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

