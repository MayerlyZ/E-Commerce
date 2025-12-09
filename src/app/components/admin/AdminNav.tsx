'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import styles from './admin.module.css';

export default function AdminNav() {
  const handleLogout = async () => {
    await signOut({ redirect: true, redirectTo: '/' });
  };

  return (
    <nav className={styles.adminNav}>
      <div className={styles.adminNavContainer}>
        <Link href="/admin" className={styles.adminLogo}>
          <Image
            src="/img/loguito.png"
            alt="Olas Accessories"
            width={120}
            height={100}
            priority
          />
        </Link>

        <div className={styles.adminLinks}>
          <Link href="/admin/products" className={styles.adminLink}>
            Productos
          </Link>
          <Link href="/admin/users" className={styles.adminLink}>
            Usuarios
          </Link>
          <Link href="/admin/orders" className={styles.adminLink}>
            Pedidos
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
