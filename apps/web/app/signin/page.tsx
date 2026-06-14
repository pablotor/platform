import AuthForm from '../../components/authForm';

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <AuthForm mode="signin" />
    </div>
  );
}
