import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactNode,
  useState,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type DropdownItemBase = {
  variant?: 'default' | 'destructive';
  /** Renders a separator line above this item */
  separatorBefore?: boolean;
  /** Disables this item */
  disabled?: boolean;
};

export type DropdownItem =
  | (DropdownItemBase & {
      label: string;
      onSelect?: () => void;
      icon?: ReactNode;
      asChild?: false;
    })
  | (DropdownItemBase & {
      /**
       * Renders the item as a wrapper around a custom element (e.g. a
       * next/link, for navigation items) instead of the built-in
       * label+icon layout. The item's own classes — including the
       * destructive variant, if set — are merged onto the child via
       * Radix's Slot. No onSelect here: the child's own click/keyboard
       * behavior (e.g. the anchor's) drives the action.
       */
      asChild: true;
      children: ReactNode;
    });

export type DropdownProps = {
  /** The element that opens the menu */
  triggerButtonProps: ComponentProps<'button'>;
  items: DropdownItem[];
  /** Optional header rendered above the first item */
  header?: ReactNode;
  /** Passed straight through to Radix Content */
  align?: ComponentPropsWithoutRef<typeof DropdownMenu.Content>['align'];
  sideOffset?: number;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const DropdownItemRow = ({ item }: { item: DropdownItem }) => {
  const className = clsx(
    'flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 outline-none',
    'text-body-sm transition-colors duration-75',
    'data-disabled:pointer-events-none data-disabled:text-foreground/60',
    item.variant === 'destructive'
      ? 'text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive'
      : 'text-popover-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground',
  );

  return item.asChild ? (
    <DropdownMenu.Item asChild disabled={item.disabled} className={className}>
      {item.children}
    </DropdownMenu.Item>
  ) : (
    <DropdownMenu.Item
      onSelect={item.onSelect}
      disabled={item.disabled}
      className={className}
    >
      {item.icon}
      {item.label}
    </DropdownMenu.Item>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const Dropdown = ({
  triggerButtonProps,
  items,
  header,
  align = 'end',
  sideOffset = 8,
}: DropdownProps) => {
  // Controlled open state so AnimatePresence knows exactly when to trigger
  // the exit animation before Radix unmounts the content.
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger {...triggerButtonProps} />

      <AnimatePresence>
        {open && (
          // forceMount keeps Portal + Content in the DOM during the exit
          // animation — without it Radix removes the node immediately on
          // close and Framer never gets to play the exit.
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              asChild
              forceMount
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
                  transformOrigin:
                    'var(--radix-dropdown-menu-content-transform-origin)',
                }}
                className={clsx(
                  'z-50 min-w-55 rounded-xl border border-border bg-popover p-2',
                  'shadow-lg shadow-black/10',
                )}
              >
                {header && (
                  <>
                    {header}
                    <DropdownMenu.Separator className="my-1 h-px bg-border" />
                  </>
                )}
                {items.map((item, i) => (
                  <div key={i}>
                    {item.separatorBefore && (
                      <DropdownMenu.Separator className="my-1 h-px bg-border" />
                    )}
                    <DropdownItemRow item={item} />
                  </div>
                ))}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
