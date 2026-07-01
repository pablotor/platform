import { useState } from 'react';
import { Eye, EyeOff, Check, Circle } from 'lucide-react';
import { ZodString } from 'zod';
import clsx from 'clsx';
import Input, { InputProps } from './input';

export type PasswordRequirement = {
  id: string;
  label: string;
};

export type PasswordStrength = {
  label: string;
  barColor: string;
  textColor: string;
  width: string;
};

type PasswordCreationInputProps = {
  requirements: PasswordRequirement[];
  strengthConfig: PasswordStrength[];
  validationSchema: ZodString;
} & Pick<InputProps, 'name' | 'error'>;

const PasswordCreationInput = ({
  requirements,
  strengthConfig,
  validationSchema,
  ...inputProps
}: PasswordCreationInputProps) => {
  const [visible, setVisible] = useState(false);
  const [pendingRequirements, setPendingRequirements] = useState(
    requirements.map(({ id }) => id),
  );

  const currentPwdStrength =
    strengthConfig[strengthConfig.length - 1 - pendingRequirements.length];

  return (
    <div>
      <Input
        id="password"
        label="Password"
        placeholder="Enter your password"
        type={visible ? 'text' : 'password'}
        onChange={(event) => {
          const validationResult = validationSchema.safeParse(
            event.target.value,
          );
          setPendingRequirements(
            validationResult.error?.issues.map((issue) => issue.message) || [],
          );
        }}
        autoComplete="new-password"
        adornment={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
            className="absolute right-2.5 flex items-center p-1 text-muted-foreground transition hover:text-foreground cursor-pointer"
          >
            {visible ? (
              <EyeOff size={18} strokeWidth={1.75} />
            ) : (
              <Eye size={18} strokeWidth={1.75} />
            )}
          </button>
        }
        {...inputProps}
      />

      {/* Strength bar */}
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-input">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300',
            currentPwdStrength
              ? `${currentPwdStrength.barColor} ${currentPwdStrength.width}`
              : 'w-0',
          )}
        />
      </div>
      <p
        className={clsx(
          'mb-5 mt-1.5 min-h-4 text-body-xs transition-colors duration-300',
          currentPwdStrength
            ? currentPwdStrength.textColor
            : 'text-transparent',
        )}
      >
        {currentPwdStrength ? currentPwdStrength.label : '—'}
      </p>

      <ul className="flex flex-col gap-2">
        {requirements.map((req) => {
          const isPending = pendingRequirements.includes(req.id);
          return (
            <li key={req.id} className="flex items-center gap-2.5">
              <span
                className={clsx(
                  'flex w-5 shrink-0 items-center transition-colors duration-200',
                  isPending
                    ? inputProps.error
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                    : 'text-brand-primary/90',
                )}
              >
                {isPending ? (
                  <Circle size={13} strokeWidth={1.5} />
                ) : (
                  <Check size={15} strokeWidth={2.5} />
                )}
              </span>
              <span
                className={clsx(
                  'text-sm transition-colors duration-200',
                  isPending
                    ? inputProps.error
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                    : 'text-brand-primary',
                )}
              >
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordCreationInput;
