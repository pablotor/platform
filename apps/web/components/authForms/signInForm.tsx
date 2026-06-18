'use client';

import { useRouter } from 'next/navigation';
import { SignInContract, SignInSchema } from '@repo/api';
import Button from '@repo/ui/button';
import Input from '@repo/ui/input';
import { DEFAULT_AUTHENTICATED_ROUTE } from '../../common/routes';
import useForm from '../../hooks/useForm';
import authClient from '../../lib/authClient';
import AuthFormWrapper from './authFormWrapper';

const SignInForm = () => {
  const router = useRouter();

  const { action, register, isSubmitting, submitError } =
    useForm<SignInContract>(async (payload: SignInContract) => {
      await authClient.signIn.email(payload, {
        onSuccess: () => {
          router.refresh();
          router.push(DEFAULT_AUTHENTICATED_ROUTE);
        },
        onError: ({ error }) => {
          console.error('Signin error: ', error.message);
          throw new Error(
            error.message ||
              "We couldn't sign you in. If this error persist contact support",
          );
        },
      });
    }, SignInSchema);

  return (
    <AuthFormWrapper mode="signin">
      <form action={action} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          {...register('email')}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
        />

        {submitError && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {submitError}
          </p>
        )}

        <Button
          variant="default"
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-2"
        >
          {isSubmitting ? 'Please wait…' : 'Sign in'}
        </Button>
      </form>
    </AuthFormWrapper>
  );
};

export default SignInForm;
