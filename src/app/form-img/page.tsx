'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';

export default function FormImg() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);
  
  const router = useRouter();


  useEffect(() => {
   
  }, [errorMessage, router]);

  return (
    <form action={dispatch} style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
        />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="password">Password</label>
        <input
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          id="password"
          type="password"
          name="password"
          placeholder="Enter password"
          required
          minLength={6}
        />
      </div>
      
      <LoginButton />

      {errorMessage && (
        <div style={{ marginTop: '1rem', color: 'red' }}>
          <p>{errorMessage}</p>
        </div>
      )}
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className={`mt-6 w-full rounded-md bg-olas p-2.5 text-white cursor-pointer ${pending ? 'bg-gray-300' : ''}`}
    >
      {pending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
    </button>
  );
}