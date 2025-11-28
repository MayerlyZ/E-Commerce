'use client'
import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import Style from './navlinks.module.css';

export default function HorizontalNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Verificar si existe la cookie de sesión de NextAuth
        const response = await fetch('/api/auth/session', {
          credentials: 'include', // Incluir cookies
          cache: 'no-store'
        });
        
        if (!response.ok) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        
        // Log para debugging
        console.log('Session data:', data);
        
        // Si la respuesta está vacía o no tiene user, es usuario no autenticado
        const hasSession = data && Object.keys(data).length > 0 && data.user;
        setIsAdmin(!!hasSession);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Links para usuarios no autenticados (clientes)
  const clientLinks = [
    { href: '/productos', label: 'Productos' },
    { href: '/material', label: 'Material' },
    { href: '/descuentos', label: 'Descuentos' },
    { href: '/nosotros', label: 'Quiénes Somos' },
  ];

  // Links para usuarios autenticados (administradores)
  const adminLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/products', label: 'Productos' },
    { href: '/dashboard/orders', label: 'Pedidos' },
    { href: '/dashboard/materials', label: 'Material' },
    { href: '/dashboard/customers', label: 'Clientes' },
    { href: '/dashboard/contact', label: 'Contacto' },
  ];

  const links = isAdmin ? adminLinks : clientLinks;

  return (
    <nav className="w-full flex items-center justify-between px-12 py-4 text-sm">
      {/* Logo centrado */}
      <div className="flex-1 flex justify-center items-center">
        <a href="/">
          <Image
            src="/img/loguito.png"
            width={180}
            height={180}
            alt="Logo"
            style={{ maxWidth: '220px', height: 'auto' }}
          />
        </a>
      </div>

      {/* Links de navegación (hidden en móvil) */}
      <div className="hidden md:flex gap-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-olas-dark hover:text-olas-light transition"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Botón de login y menú hamburguesa a la derecha */}
      <div className="flex items-center gap-10">
        {isAdmin ? (
          <button
            onClick={() => signOut({ redirect: true, redirectTo: '/' })}
            className="text-olas-dark hover:text-olas-light transition text-sm"
          >
            Cerrar Sesión
          </button>
        ) : (
          <a href="/login">
            <Image
              src="/img/user.png"
              width={40}
              height={40}
              alt="Usuario"
              className="w-10 h-10"
            />
          </a>
        )}
        <button
          className="md:hidden p-2 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? (
            <XMarkIcon style={{ height: 32, width: 32 }} />
          ) : (
            <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', margin: 0, padding: 0}}>
              <Image
                src="/img/menu-burger.png"
                width={32}
                height={32}
                alt="Menú hamburguesa"
                style={{objectFit: 'contain', background:'transparent'}}
              />
            </span>
          )}
        </button>
      </div>

      {/* Menú hamburguesa móvil */}
      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 flex flex-col p-4 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-olas-dark hover:text-olas-light py-2 transition"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}