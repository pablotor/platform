import AuthForm from '../../components/authForm';
import Navbar from '../../components/navbar';

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        <AuthForm mode="signin" />
      </div>
    </main>
  );
}
