import {
  ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DropdownItem = {
  label: string;
  onSelect?: () => void;
  icon?: ReactNode;
  /** Renders the item in destructive (red) colours */
  variant?: 'default' | 'destructive';
  /** Renders a separator line above this item */
  separatorBefore?: boolean;
  /** Disables this item */
  disabled?: boolean;
};

export type DropdownProps = {
  /** The element that opens the menu */
  // Not really elegant, but passing the button element breaks the trigger
  triggerButtonProps: ComponentProps<'button'>;
  items: DropdownItem[];
  /** Optional header rendered above the first item */
  header?: ReactNode;
  /** Passed straight through to Radix Content */
  align?: ComponentPropsWithoutRef<typeof DropdownMenu.Content>['align'];
  sideOffset?: number;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const DropdownContent = ({
  children,
  align = 'end',
  sideOffset = 8,
}: {
  children: ReactNode;
  align?: DropdownProps['align'];
  sideOffset?: number;
}) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      align={align}
      sideOffset={sideOffset}
      className="
        z-50 min-w-55 rounded-xl border border-border bg-popover p-2
        shadow-lg shadow-black/10
        origin-[--radix-dropdown-menu-content-transform-origin]
        animate-in fade-in-0 zoom-in-95 duration-130
      "
    >
      {children}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
);

const DropdownItemRow = ({ item }: { item: DropdownItem }) => (
  <DropdownMenu.Item
    onSelect={item.onSelect}
    className={clsx(
      'flex items-center gap-2 px-2.5 py-2 rounded-lg',
      'text-sm font-normal data-disabled:text-foreground/60 cursor-pointer data-disabled:pointer-events-none outline-none select-none',
      'transition-colors duration-75',
      item.variant === 'destructive'
        ? 'text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive'
        : 'text-popover-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground',
    )}
    disabled={item.disabled}
  >
    {item.icon}
    {item.label}
  </DropdownMenu.Item>
);

// ─── Main component ───────────────────────────────────────────────────────────

const Dropdown = ({
  triggerButtonProps,
  items,
  header,
  align = 'end',
  sideOffset = 8,
}: DropdownProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger {...triggerButtonProps} />
    <DropdownContent align={align} sideOffset={sideOffset}>
      {header && (
        <>
          {header}
          <DropdownMenu.Separator className="h-px bg-border my-1" />
        </>
      )}

      {items.map((item, i) => (
        <div key={i}>
          {item.separatorBefore && (
            <DropdownMenu.Separator className="h-px bg-border my-1" />
          )}
          <DropdownItemRow item={item} />
        </div>
      ))}
    </DropdownContent>
  </DropdownMenu.Root>
);

export default Dropdown;
