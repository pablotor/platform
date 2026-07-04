import Link from 'next/link';
import { PropsWithChildren } from 'react';

type Mode = 'signin' | 'signup';

const copy: Record<
  Mode,
  {
    title: string;
    subtitle: string;
    altText: string;
    altHref: string;
    altLabel: string;
  }
> = {
  signin: {
    title: 'Welcome back',
    subtitle: 'Sign in to continue to the platform.',
    altText: "Don't have an account?",
    altHref: '/signup',
    altLabel: 'Sign up',
  },
  signup: {
    title: 'Create your account',
    subtitle: 'Join the demo in a few seconds.',
    altText: 'Already have an account?',
    altHref: '/signin',
    altLabel: 'Sign in',
  },
};

const AuthFormWrapper = ({
  children,
  mode,
}: PropsWithChildren<{ mode: Mode }>) => {
  const t = copy[mode];

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-subheading gradient-primary text-gradient">
          {t.title}
        </h1>
        <p className="mt-2 text-body-sm text-muted-foreground">{t.subtitle}</p>
      </div>
      {children}
      <p className="mt-6 text-center text-body-sm text-muted-foreground">
        {t.altText}{' '}
        <Link href={t.altHref} className="font-medium text-link">
          {t.altLabel}
        </Link>
      </p>
    </div>
  );
};

export default AuthFormWrapper;
