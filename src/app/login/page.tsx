
import LoginForm from '@/app/components/login/LoginForm'; 

export default function LoginPage() {
  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ position: 'relative', width: '400px', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h1>Login E-commerce</h1>
        <LoginForm />
      </div>
    </main>
  );
}