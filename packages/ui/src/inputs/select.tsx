import * as SelectPrimitive from '@radix-ui/react-select';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { type ComponentPropsWithoutRef, ReactNode } from 'react';

import { RegistrableFieldProps } from './types';

export type SelectItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
};

export const SelectItem = ({ value, label, disabled }: SelectItemProps) => (
  <SelectPrimitive.Item
    value={value}
    disabled={disabled}
    className={clsx(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-lg py-2 pl-2.5 pr-8 outline-none',
      'text-body-sm text-popover-foreground transition-colors duration-75',
      'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
      'data-disabled:pointer-events-none data-disabled:text-foreground/60',
    )}
  >
    <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-2.5 inline-flex items-center">
      <Check className="size-3.5" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
);

export const SelectItemSeparator = () => (
  <SelectPrimitive.Separator className="my-1 h-px bg-border" />
);

export interface SelectProps
  extends
    RegistrableFieldProps<string | undefined, HTMLSelectElement>,
    Omit<
      React.ComponentProps<'select'>,
      'defaultValue' | 'name' | 'onBlur' | 'error'
    > {
  label: string | ReactNode;
  placeholder?: string;
  showErrorText?: boolean;
  onValueChange?: (value: string) => void;
  triggerClassName?: string;
  /** Passed straight through to Radix Content */
  align?: ComponentPropsWithoutRef<typeof SelectPrimitive.Content>['align'];
  sideOffset?: number;
}

const Select = ({
  children,
  defaultValue,
  placeholder = 'Select an option',
  label,
  name,
  disabled,
  error,
  onBlur,
  showErrorText,
  triggerClassName,
  align = 'start',
  sideOffset = 8,
}: SelectProps) => (
  <div>
    <label htmlFor={name} className="mb-2 block text-label">
      {label}
    </label>

    <SelectPrimitive.Root
      defaultValue={defaultValue}
      name={name}
      disabled={disabled}
      onValueChange={(value) =>
        error
          ? onBlur?.({
              target: { name, value },
            } as React.FocusEvent<HTMLSelectElement>)
          : undefined
      }
    >
      <SelectPrimitive.Trigger
        aria-invalid={!!error}
        className={clsx(
          'group flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-popover px-3 py-2',
          'text-body-sm text-popover-foreground outline-none shadow-sm',
          'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
          'data-placeholder:text-foreground/60 focus:focusable',
          'data-disabled:pointer-events-none data-disabled:opacity-60',
          triggerClassName,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="size-4 text-foreground/60 group-data-[state=open]:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <AnimatePresence>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            asChild
            position="popper"
            align={align}
            sideOffset={sideOffset}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              // Radix sets this CSS var so the zoom origin tracks the
              // trigger position rather than animating from the center.
              style={{
                transformOrigin: 'var(--radix-select-content-transform-origin)',
                width: 'var(--radix-select-trigger-width)',
              }}
              className="
                z-50 min-w-55 rounded-xl border border-border bg-popover p-2
                shadow-lg shadow-black/10
              "
            >
              <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1 text-foreground/60">
                <ChevronDown className="size-3.5 rotate-180" />
              </SelectPrimitive.ScrollUpButton>

              <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>

              <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1 text-foreground/60">
                <ChevronDown className="size-3.5" />
              </SelectPrimitive.ScrollDownButton>
            </motion.div>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </AnimatePresence>
    </SelectPrimitive.Root>

    {showErrorText && (
      <div className="min-h-4 mt-2 text-overline">
        {error && <p className="text-destructive text-body-xs">{error}</p>}
      </div>
    )}
  </div>
);

export default Select;
