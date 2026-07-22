import * as DialogPrimitive from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Arbitrary body content, rendered between the header and actions */
  children?: ReactNode;
  /** Typically Cancel/Confirm buttons, right-aligned in the footer */
  actions?: ReactNode;
};

// ─── Main component ───────────────────────────────────────────────────────────

const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
}: DialogProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <AnimatePresence>
      {open && (
        // forceMount, same reasoning as Dropdown: keeps Portal/Overlay/
        // Content in the DOM during the exit animation instead of Radix
        // unmounting immediately on close.
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay asChild forceMount>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed inset-0 z-50 bg-black/50"
            />
          </DialogPrimitive.Overlay>

          <DialogPrimitive.Content asChild forceMount>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={clsx(
                'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2',
                'rounded-xl border border-border bg-popover p-6',
                'shadow-lg shadow-black/10',
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <DialogPrimitive.Title className="text-subtitle">
                    {title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close
                    className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:focusable-outline"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </DialogPrimitive.Close>
                </div>
                {description && (
                  <DialogPrimitive.Description className="text-body-sm text-muted-foreground">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>

              {children && <div className="mt-4">{children}</div>}

              {actions && (
                <div className="mt-6 flex items-center justify-end gap-2">
                  {actions}
                </div>
              )}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  </DialogPrimitive.Root>
);

export default Dialog;
