'use client';

import clsx from 'clsx';

type PublishSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

const PublishSwitch = ({
  checked,
  onCheckedChange,
  disabled,
}: PublishSwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={clsx(
      'relative cursor-pointer inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 focus-visible:focusable-outline disabled:cursor-not-allowed disabled:opacity-50',
      checked
        ? 'gradient-primary border-transparent'
        : 'bg-muted border-border',
    )}
  >
    <span
      className={clsx(
        'inline-block size-4 transform rounded-full bg-background shadow-sm transition-transform duration-200',
        checked ? 'translate-x-6' : 'translate-x-1',
      )}
    />
  </button>
);

export default PublishSwitch;
