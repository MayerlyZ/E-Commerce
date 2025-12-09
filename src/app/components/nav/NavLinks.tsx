'use client'
import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

interface Session {
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

export default function HorizontalNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // No mostrar nav si estamos en rutas de admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (!response.ok) {
          setIsAdmin(false);
          setIsClient(false);
          setIsLoading(false);
          return;
        }

        const data: Session = await response.json();
        
        if (data && data.user) {
          const isAdminUser = data.user.role === 'admin';
          const isClientUser = data.user.role === 'customer';
          
          setIsAdmin(!!isAdminUser);
          setIsClient(!!isClientUser);
          
          if (isClientUser && data.user.name) {
            setUserName(data.user.name);
            // Obtener conteos del localStorage
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            setCartCount(cart.length);
            setFavoritesCount(favorites.length);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAdmin(false);
        setIsClient(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const clientLinks = [
    { href: '/productos', label: 'Productos' },
    { href: '/material', label: 'Material' },
    { href: '/descuentos', label: 'Descuentos' },
    { href: '/nosotros', label: 'Quiénes Somos' },
  ];

  const adminLinks = [
    { href: '/admin', label: ' Panel Admin' },
    
  ];

  const links = isAdmin ? adminLinks : clientLinks;

  // Determinar si el usuario está autenticado
  const isAuthenticated = isAdmin || isClient;

  return (
    <nav className="relative w-full flex flex-col items-center text-sm">
      {/* Top section: Logo y controles */}
      <div className="w-full flex items-center justify-between px-6 py-0">
        {/* Left section: Hamburger menu on mobile (solo para autenticados) */}
        <div className="flex-1">
          {isAuthenticated && (
            <button
              className="p-2 rounded md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              {menuOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Image
                  src="/img/menu-burger.png"
                  width={32}
                  height={32}
                  alt="Menú hamburguesa"
                />
              )}
            </button>
          )}
        </div>

        {/* Centered Logo - Much Larger */}
        <div className="flex-1 flex justify-center">
          <a href="/">
            <Image
              src="/img/loguito.png"
              width={250}
              height={200}
              alt="Logo"
              className="h-auto"
              priority
            />
          </a>
        </div>

        {/* Right section: Login/Logout button */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {isAdmin ? (
            <button
              onClick={() => signOut({ redirect: true, redirectTo: '/' })}
              className="text-olas-dark hover:text-olas-light transition text-sm"
            >
              Cerrar Sesión
            </button>
          ) : isClient && userName ? (
            <div className="flex items-center gap-4">
              {/* User name */}
              <span className="hidden md:inline text-olas-dark font-semibold text-sm">
                {userName}
              </span>

              {/* Favorites icon */}
              <a 
                href="/favoritos" 
                className="relative hover:scale-110 transition"
                title="Favoritos"
              >
                <svg className="w-6 h-6 text-olas-dark hover:text-olas-light" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-olas-dark text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </a>

              {/* Shopping cart icon */}
              <a 
                href="/carrito" 
                className="relative hover:scale-110 transition"
                title="Carrito"
              >
                <svg className="w-6 h-6 text-olas-dark hover:text-olas-light" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 2L7.12 6H4a2 2 0 0 0-2 2v2h2.58L6.2 19.4A2 2 0 0 0 8.16 21h11.68a2 2 0 0 0 1.96-1.6L19.42 10H22V8a2 2 0 0 0-2-2h-3.12L15 2H9m0 2h6v2H9V4m-4 6h14l-1.5 9H5.5L5 10z"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-olas-dark text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>

              {/* Logout button */}
              <button
                onClick={() => signOut({ redirect: true, redirectTo: '/' })}
                className="text-olas-dark hover:text-olas-light transition text-sm font-semibold"
                title="Cerrar sesión"
              >
                Salir
              </button>
            </div>
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
        </div>
      </div>

      {/* Bottom section: Navigation links with gradient background */}
      {!isLoading && (
        <>
          {/* Desktop links - centered below logo with gradient */}
          <div 
            className="hidden md:flex gap-6 px-8 py-3 w-full justify-center"
            style={{
              background: 'linear-gradient(90deg, rgba(255,250,239,0) 0%, rgba(255,250,239,0.6) 20%, rgba(255,250,239,0.6) 80%, rgba(255,250,239,0) 100%)',
              borderTop: '1px solid rgba(111, 26, 7, 0.1)',
              borderBottom: '1px solid rgba(111, 26, 7, 0.1)'
            }}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-olas-dark hover:text-olas-accent transition font-semibold text-base whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div 
              className="w-full md:hidden flex flex-col p-3 space-y-2"
              style={{
                background: 'linear-gradient(90deg, rgba(255,250,239,0) 0%, rgba(255,250,239,0.6) 20%, rgba(255,250,239,0.6) 80%, rgba(255,250,239,0) 100%)',
                borderTop: '1px solid rgba(111, 26, 7, 0.1)',
                borderBottom: '1px solid rgba(111, 26, 7, 0.1)'
              }}
            >
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
              
              {isClient && userName && (
                <>
                  <hr className="my-2" />
                  <p className="text-olas-dark font-semibold text-sm py-2">
                    {userName}
                  </p>
                  <a
                    href="/favoritos"
                    className="text-olas-dark hover:text-olas-light py-2 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    ❤️ Favoritos ({favoritesCount})
                  </a>
                  <a
                    href="/carrito"
                    className="text-olas-dark hover:text-olas-light py-2 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    🛍️ Carrito ({cartCount})
                  </a>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ redirect: true, redirectTo: '/' });
                    }}
                    className="text-olas-dark hover:text-olas-light py-2 transition text-left"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </nav>
  );
}