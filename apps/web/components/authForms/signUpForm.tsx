'use client';

import {
  PasswordSchema,
  type SignUpContract,
  SignUpSchema,
} from '@repo/contracts';
import Button from '@repo/ui/button';
import Input from '@repo/ui/input';
import PasswordCreationInput, {
  type PasswordRequirement,
  type PasswordStrength,
} from '@repo/ui/passwordCreationInput';
import { useToast } from '@repo/ui/toast/handler';
import { useRouter } from 'next/navigation';

import { DEFAULT_AUTHENTICATED_ROUTE } from '../../common/routes';
import useForm from '../../hooks/useForm';
import authClient from '../../lib/authClient';
import AuthFormWrapper from './authFormWrapper';

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
  },
  {
    id: 'upper',
    label: 'One uppercase letter',
  },
  {
    id: 'number',
    label: 'One number',
  },
  {
    id: 'special',
    label: 'One special character (!@#$%^&*…)',
  },
];

const PASSWORD_STRENGTH_CONFIG: PasswordStrength[] = [
  {
    label: 'Weak',
    barColor: 'bg-brand-secondary',
    textColor: 'text-brand-secondary/90',
    width: 'w-1/4',
  },
  {
    label: 'Fair',
    barColor: 'bg-brand-secondary-accent',
    textColor: 'text-brand-secondary-accent/90',
    width: 'w-1/2',
  },
  {
    label: 'Good',
    barColor: 'bg-brand-secondary-from',
    textColor: 'text-brand-secondary-from/90',
    width: 'w-3/4',
  },
  {
    label: 'Strong',
    barColor: 'bg-brand-primary',
    textColor: 'text-brand-primary/90',
    width: 'w-full',
  },
];

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const toastKey = 'signup-toast';
  const { action, register, isSubmitting } = useForm<SignUpContract>(
    async (payload) => {
      await authClient.signUp.email(payload, {
        onRequest: () => {
          toast({
            toastKey,
            mode: 'loading',
          });
        },
        onSuccess: () => {
          router.refresh();
          router.push(DEFAULT_AUTHENTICATED_ROUTE);
          toast({
            toastKey,
            mode: 'success',
            content: 'Registration complete',
          });
        },
        onError: ({ error }) => {
          const errorMessage = `Sign Up error: ${error.message || "We couldn't sign you up. If this error persist contact support"}`;
          console.error(errorMessage);
          toast({
            toastKey,
            mode: 'error',
            content: errorMessage,
          });
        },
      });
    },
    SignUpSchema,
  );

  return (
    <AuthFormWrapper mode="signup">
      <form action={action} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Name"
          type="text"
          autoComplete="name"
          placeholder="Enter your name"
          showErrorText
          {...register('name')}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          showErrorText
          {...register('email')}
        />
        <PasswordCreationInput
          requirements={PASSWORD_REQUIREMENTS}
          strengthConfig={PASSWORD_STRENGTH_CONFIG}
          validationSchema={PasswordSchema}
          {...register('password')}
        />
        <Button
          variant="default"
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-2"
        >
          {isSubmitting ? 'Please wait' : 'Sign up'}
        </Button>
      </form>
    </AuthFormWrapper>
  );
};

export default SignUpForm;
