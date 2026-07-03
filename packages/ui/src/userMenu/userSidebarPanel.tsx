import clsx from 'clsx';
import { X } from 'lucide-react';
import { DropdownItem } from '../dropdown';
import UserMenuHeader, { UserMenuUser } from './userMenuHeader';
import { useUserSidebar } from './userSidebarProvider';

/**
 * Main panel for the mobile userMenu, implementing the sidebar
 */

const SidebarItemRow = ({ item }: { item: DropdownItem }) => (
  <button
    type="button"
    onClick={item.onSelect}
    disabled={item.disabled}
    className={clsx(
      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5',
      'text-sm font-normal outline-none transition-colors duration-75 select-none',
      'disabled:pointer-events-none disabled:opacity-50',
      item.variant === 'destructive'
        ? 'text-destructive hover:bg-destructive/10'
        : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
    )}
  >
    {item.icon}
    {item.label}
  </button>
);

const MobileCloseButton = () => {
  const { close } = useUserSidebar();
  return (
    <button
      type="button"
      aria-label="Close user menu"
      onClick={close}
      className={clsx(
        'flex size-8 items-center justify-center rounded-md',
        'text-muted-foreground transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      <X className="size-4" />
    </button>
  );
};

const UserSidebarPanel = ({
  user,
  items,
}: {
  user: UserMenuUser;
  items: DropdownItem[];
}) => (
  <div className="flex h-full w-72 flex-col border-l border-sidebar-border bg-sidebar">
    {/* Header row */}
    <div className="flex items-center justify-between px-3 pt-3">
      <UserMenuHeader user={user} />
      <MobileCloseButton />
    </div>

    {/* Separator */}
    <div className="mx-3 my-1 h-px bg-border" />

    {/* Items */}
    <nav className="flex flex-col gap-0.5 px-2 py-1">
      {items.map((item, i) => (
        <div key={i}>
          {item.separatorBefore && <div className="mx-1 my-1 h-px bg-border" />}
          <SidebarItemRow item={item} />
        </div>
      ))}
    </nav>
  </div>
);

export default UserSidebarPanel;
