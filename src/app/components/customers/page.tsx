// src/components/CustomersTable.tsx

import React from 'react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  registerDate: string;
  orders: number;
  spent: string; 
  avatar: string;
}

const customers: Customer[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@correo.com',
    phone: '+57 300 123 4567',
    registerDate: '28 Oct, 2025',
    orders: 8,
    spent: '850.00',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 2,
    name: 'Ana García',
    email: 'ana.g@correo.com',
    phone: '+57 310 987 6543',
    registerDate: '15 Sep, 2025',
    orders: 2,
    spent: '120.50',
    avatar: 'https://i.pravatar.cc/150?img=25',
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'c.lopez@correo.com',
    phone: '+57 321 555 1212',
    registerDate: '01 Jul, 2025',
    orders: 15,
    spent: '2,300.00',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 4,
    name: 'María Rodríguez',
    email: 'maria.r@correo.com',
    phone: '+57 301 444 8888',
    registerDate: '29 Oct, 2025',
    orders: 1,
    spent: '45.00',
    avatar: 'https://i.pravatar.cc/150?img=45',
  },
];

export default function CustomersTable(): JSX.Element {
  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-md">
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          
          <thead className="hidden bg-gray-50 md:table-header-group">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Contacto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Registro
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Pedidos
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Gasto Total
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {customers.map((customer) => (
              <tr key={customer.id} className="block md:table-row">
                
                <td className="flex items-center gap-3 px-6 py-4 md:table-cell">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={customer.avatar}
                    alt={`${customer.name} avatar`}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500 md:hidden">{customer.email}</div>
                  </div>
                </td>
                
                <td className="px-6 py-4 md:table-cell">
                  <div className="text-xs font-medium text-gray-400 md:hidden">Contacto</div>
                  <div className="text-sm text-gray-900 hidden md:block">{customer.email}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </td>

                <td className="px-6 py-4 md:table-cell">
                  <div className="text-xs font-medium text-gray-400 md:hidden">Registro</div>
                  <div className="text-sm text-gray-900">{customer.registerDate}</div>
                </td>

                <td className="px-6 py-4 md:table-cell">
                  <div className="text-xs font-medium text-gray-400 md:hidden">Pedidos</div>
                  <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                    {customer.orders} pedidos
                  </span>
                </td>

                <td className="px-6 py-4 text-left md:text-right md:table-cell">
                  <div className="text-xs font-medium text-gray-400 md:hidden">Gasto Total</div>
                  <div className="text-sm font-medium text-gray-900">${customer.spent}</div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-start gap-2 md:justify-end">
                    <button className="text-gray-400 hover:text-blue-600">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-indigo-600">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">4</span> de
          <span className="font-medium"> {customers.length} </span> resultados
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Anterior
          </button>
          <button className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Siguiente
          </button>
        </div>
      </div>

    </div>
  );
}