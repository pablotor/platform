'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import authClient from '../lib/authClient';
import Input from '@repo/ui/input';
import Button from '@repo/ui/button';
import { DEFAULT_AUTHENTICATED_ROUTE } from '../common/routes';

type Mode = 'signin' | 'signup';

const copy: Record<
  Mode,
  {
    title: string;
    subtitle: string;
    cta: string;
    altText: string;
    altHref: string;
    altLabel: string;
  }
> = {
  signin: {
    title: 'Welcome back',
    subtitle: 'Sign in to continue to the platform.',
    cta: 'Sign in',
    altText: "Don't have an account?",
    altHref: '/signup',
    altLabel: 'Sign up',
  },
  signup: {
    title: 'Create your account',
    subtitle: 'Join the demo in a few seconds.',
    cta: 'Sign up',
    altText: 'Already have an account?',
    altHref: '/signin',
    altLabel: 'Sign in',
  },
};

const AuthForm = ({ mode }: { mode: Mode }) => {
  const t = copy[mode];
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
        });
        if (error) throw new Error(error.message ?? 'Could not sign up');
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message ?? 'Could not sign in');
      }
      router.refresh();
      router.push(DEFAULT_AUTHENTICATED_ROUTE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-a gradient-text">{t.title}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'signup' && (
          <Input
            id="name"
            label="Name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Pablo Tor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <Input
          id="email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="me@pablotor.dev"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button
          variant="default"
          type="submit"
          size="lg"
          disabled={loading}
          className="mt-2"
        >
          {loading ? 'Please wait…' : t.cta}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.altText}{' '}
        <Link
          href={t.altHref}
          className="font-medium text-brand-indigo-600 underline-offset-4 hover:underline"
        >
          {t.altLabel}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
