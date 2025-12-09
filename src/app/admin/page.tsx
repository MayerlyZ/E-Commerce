'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styles from '@/app/components/admin/admin.module.css';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const session = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/users'),
          fetch('/api/orders'),
        ]);

        const productsData = await productsRes.json();
        const usersData = await usersRes.json();
        const ordersData = await ordersRes.json();

        // Calculate stats
        const totalProducts = productsData.data?.length || 0;
        const totalUsers = usersData.data?.length || 0;
        const totalOrders = ordersData.data?.length || 0;
        const totalRevenue = ordersData.data?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;

        setStats({
          totalProducts,
          totalUsers,
          totalOrders,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminName = session?.data?.user?.name || 'Administrador';

  return (
    <div className={styles.adminContainer}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeContent}>
          <h2>¡Hola, {adminName}! 👋</h2>
          <p>Bienvenido a tu panel de administración. Aquí puedes gestionar todos los aspectos de tu tienda.</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.yellow}`}>
          <div className={styles.statLabel}>Total Productos</div>
          <div className={styles.statValue}>{stats.totalProducts}</div>
        </div>
        <div className={`${styles.statCard} ${styles.purple}`}>
          <div className={styles.statLabel}>Total Usuarios</div>
          <div className={styles.statValue}>{stats.totalUsers}</div>
        </div>
        <div className={`${styles.statCard} ${styles.pink}`}>
          <div className={styles.statLabel}>Total Pedidos</div>
          <div className={styles.statValue}>{stats.totalOrders}</div>
        </div>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <div className={styles.statLabel}>Ingresos Totales</div>
          <div className={styles.statValue}>${stats.totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Admin Cards Section */}
      <h3 className={styles.adminTitle} style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        Gestión
      </h3>

      <div className={styles.adminGrid}>
        <Link href="/admin/products" className={styles.adminCard}>
          <div className={styles.adminCardIcon}>📦</div>
          <h2 className={styles.adminCardTitle}>Productos</h2>
          <p className={styles.adminCardDesc}>Crea, edita y elimina productos del catálogo</p>
        </Link>

        <Link href="/admin/users" className={styles.adminCard}>
          <div className={styles.adminCardIcon}>👥</div>
          <h2 className={styles.adminCardTitle}>Usuarios</h2>
          <p className={styles.adminCardDesc}>Administra usuarios y sus roles en el sistema</p>
        </Link>

        <Link href="/admin/orders" className={styles.adminCard}>
          <div className={styles.adminCardIcon}>📋</div>
          <h2 className={styles.adminCardTitle}>Pedidos</h2>
          <p className={styles.adminCardDesc}>Visualiza y gestiona todos los pedidos</p>
        </Link>
      </div>
    </div>
  );
}
