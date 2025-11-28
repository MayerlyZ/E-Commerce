
"use client";

import { useState } from 'react';
import Image from 'next/image';
import  '../app/globals.css';


export default function Home() {
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
    <div className="flex flex-col items-center justify-center min-h-screen w-full text-center px-4 py-8">
      <div className="flex flex-col items-center justify-center w-full">
        {/* <h2 className="text-lg font-bold tracking-wide text-white mb-2 font-playfair">Olas Accesory</h2>   */}
        <h1 className="text-6xl md:text-7xl font-playfair text-white mb-4">Fragmentos de cielo para tu piel   </h1>
        <p className="text-lg text-white mb-6">El toque final que necesitas</p>
        <div className="flex flex-col items-center gap-3 mt-8 w-full justify-center">
          <div className="flex flex-row items-center gap-3 w-full justify-center" style={{fontFamily:'font-playfair'}}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-olas-dark text-black text-base w-48"
              style={{fontSize: '1rem', width:'300px' , height:'40px', borderRadius:'30px', padding:'5px', margin:'30px', border:'1px solid #6F1A07'}}
            />
            
          </div>
          <button 
            onClick={handleContactClick}
            disabled={loading || !email}
            style={{background:' #6F1A07', color:'#FFFAEF', borderRadius:'30px', width:'165px', height:'40px', margin:'5px' , border:'none', fontFamily:'font-playfair', fontSize:'1.2rem', cursor: (loading || !email) ? 'not-allowed' : 'pointer', opacity: (loading || !email) ? 0.6 : 1}}
          >
            {loading ? 'Enviando...' : 'Contactame'}
          </button>
          {statusMessage && <p className="text-white mt-4">{statusMessage}</p>}
        </div>
        <div className="flex gap-6 justify-center mt-6">
          <a href="#" aria-label="Facebook" className="text-white hover:text-olas-light text-2xl"><i className="fab fa-facebook"></i></a>
          <a href="#" aria-label="Instagram" className="text-white hover:text-olas-light text-2xl"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="Twitter" className="text-white hover:text-olas-light text-2xl"><i className="fab fa-twitter"></i></a>
        </div>
      </div>
    </div>
  );
}

