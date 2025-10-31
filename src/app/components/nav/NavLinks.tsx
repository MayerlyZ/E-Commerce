import React from 'react';
import { 
  MagnifyingGlassIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  BellIcon 
} from '@heroicons/react/24/outline';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#0052FF"/>
    <path d="M20.1912 11.8027C21.102 11.8027 21.9059 12.0833 22.5855 12.6417C23.2678 13.1973 23.75 13.9167 23.9967 14.7573C24.2435 15.5953 24.2435 16.488 23.9967 17.3207C23.75 18.1533 23.2678 18.8727 22.5855 19.4283L25.961 28.1973H23.5962L20.6272 20.3253H17.4857V28.1973H15.1209V11.8027H20.1912ZM20.1912 14.076C19.6382 14.076 19.1415 14.242 18.7573 14.5627C18.3731 14.8833 18.181 15.2973 18.181 15.792C18.181 16.2867 18.3731 16.7007 18.7573 17.0213C19.1415 17.342 19.6382 17.502 20.1912 17.502C20.7442 17.502 21.2408 17.342 21.625 17.0213C22.0118 16.7007 22.2078 16.2867 22.2078 15.792C22.2078 15.2973 22.0118 14.8833 21.625 14.5627C21.2408 14.242 20.7442 14.076 20.1912 14.076Z" fill="white"/>
  </svg>
);

export default function HorizontalNav() {
  return (
    <nav className="flex w-full items-center justify-between gap-8 rounded-full bg-white px-5 py-3 shadow-lg">
      
      <div className="flex items-center gap-4">
        <a href="/">
          <Logo />
        </a>
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="w-64 rounded-md border-none bg-gray-100 py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-6">
        <a href="/dashboard" className="text-sm font-medium text-blue-600">
          Dashboard
        </a>
        <a href="/dashboard/products" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          Productos
        </a>
        <a href="/dashboard/orders" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          Orders
        </a>
        <a href="/dashboard/customers" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          Customers
        </a>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-900">
          <HeartIcon className="h-6 w-6" />
        </button>
        <button className="text-gray-500 hover:text-gray-900">
          <ShoppingBagIcon className="h-6 w-6" />
        </button>
        <button className="text-gray-500 hover:text-gray-900">
          <BellIcon className="h-6 w-6" />
        </button>
        
        <a 
          href="/login"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Iniciar sesión
        </a>
      </div>
    </nav>
  );
}