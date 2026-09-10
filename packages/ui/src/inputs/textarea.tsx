import { cva, type VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

import { RegistrableFieldProps } from './types';

const textareaVariants = cva(
  [
    'flex w-full min-w-0 rounded-lg border bg-background text-foreground shadow-sm',
    'transition-[color,box-shadow] outline-none placeholder:text-muted-foreground',
    'selection:bg-primary selection:text-primary-foreground',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
    'focus-visible:focusable',
  ],
  {
    variants: {
      variant: {
        default: 'border-input',
        ghost: 'border-transparent bg-muted/50',
      },
      inputSize: {
        sm: 'min-h-8 h-16 px-2.5 py-1 text-body-sm',
        default: 'min-h-10.25 h-20.5 px-3 py-2 text-body-sm',
        lg: 'min-h-12 h-24 px-3.5 py-2.5 text-body',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  },
);

export interface TextareaProps
  extends
    RegistrableFieldProps<string | undefined, HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants>,
    Omit<
      React.ComponentProps<'textarea'>,
      'defaultValue' | 'name' | 'onBlur' | 'error'
    > {
  label: string | ReactNode;
  showErrorText?: boolean;
}

const Textarea = ({
  label,
  showErrorText,
  error,
  name,
  variant,
  inputSize,
  ...etc
}: TextareaProps) => (
  <div>
    <label htmlFor={name} className="mb-2 block text-label">
      {label}
    </label>
    <textarea
      name={name}
      className={textareaVariants({ variant, inputSize })}
      aria-invalid={!!error}
      {...etc}
    />
    {showErrorText && (
      <div className="min-h-4 mt-2 text-overline">
        {error && <p className="text-destructive text-body-xs">{error}</p>}
      </div>
    )}
  </div>
);

export default Textarea;
