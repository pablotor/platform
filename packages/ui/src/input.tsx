import { cva, type VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

const inputVariants = cva(
  'flex w-full min-w-0 rounded-lg border bg-background text-foreground shadow-sm transition-[color,box-shadow] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40',
  {
    variants: {
      variant: {
        default: 'border-input',
        ghost: 'border-transparent bg-muted/50',
      },
      inputSize: {
        sm: 'h-8 px-2.5 text-body-sm',
        default: 'h-10 px-3 text-body-sm',
        lg: 'h-11 px-3.5 text-body',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  },
);

export type InputProps = {
  label: string | ReactNode;
  showErrorText?: boolean;
  error?: string;
  adornment?: ReactNode;
} & VariantProps<typeof inputVariants> &
  React.ComponentProps<'input'>;

const Input = ({
  label,
  showErrorText,
  error,
  adornment,
  name,
  variant,
  inputSize,
  ...etc
}: InputProps) => (
  <div>
    <label htmlFor={name} className="mb-2 block text-label">
      {label}
    </label>
    <div className="relative flex items-center">
      <input
        name={name}
        className={inputVariants({ variant, inputSize })}
        aria-invalid={!!error}
        {...etc}
      />
      {adornment}
    </div>
    {showErrorText && (
      <div className="min-h-4 mt-2 text-overline">
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    )}
  </div>
);

export default Input;
