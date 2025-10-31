// src/app/dashboard/customers/page.tsx
import CustomersTable from  '@/app/components/customers/page'; 

export default function CustomersPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Gestión de Clientes</h1>


      <CustomersTable /> 
    </section>
  );
}