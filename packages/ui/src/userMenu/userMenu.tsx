'use client';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import Dropdown, { type DropdownProps } from '../dropdown';
import UserAvatar from './userAvatar';
import UserMenuHeader from './userMenuHeader';
import { UserMenuUser } from './UserMenuUser';
import UserSidebarPanel from './userSidebarPanel';
import {
  UserSidebarDrawer,
  UserSidebarProvider,
  useUserSidebar,
} from './userSidebarProvider';

export type UserMenuItem = DropdownProps['items'];

type UserMenuProps = {
  user: UserMenuUser;
  items: UserMenuItem;
};

const triggerClassName = clsx(
  'relative group flex cursor-pointer items-center gap-1 font-sans outline-none',
  'rounded-full border-2 border-border bg-background text-foreground md:border md:p-1 md:pr-2.5',
  'transition-colors duration-120 ease-in-out',
  'hover:border-input hover:bg-muted focus-visible:focusable active:scale-95',
  'data-[state=open]:border-input data-[state=open]:bg-muted',
);

const AvatarTriggerContent = ({ user }: { user: UserMenuUser }) => (
  <>
    <UserAvatar imageUrl={user.image || undefined} name={user.name} />
    {/* Hover overlay (mobile only) - reacts to the `group` on the parent trigger button.
        overflow-hidden on Avatar.Root clips it to the circle shape. */}
    <span
      aria-hidden="true"
      className="md:hidden absolute inset-0 rounded-full transition-colors duration-200 group-hover:bg-accent/10"
    />
    <div className="hidden md:flex">
      <span className="text-ui">{user.name}</span>
      <ChevronDown
        size={14}
        strokeWidth={2.5}
        className="ml-1 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
      />
    </div>
  </>
);

const MobileSidebarTrigger = ({ user }: { user: UserMenuUser }) => {
  const { toggle } = useUserSidebar();
  return (
    <button
      type="button"
      aria-label="User menu"
      onClick={toggle}
      className={clsx(triggerClassName, 'md:hidden')}
    >
      <AvatarTriggerContent user={user} />
    </button>
  );
};

const RouteChangeClose = () => {
  const { close } = useUserSidebar();
  const pathname = usePathname();
  useEffect(() => {
    close();
  }, [close, pathname]);
  return null;
};

// ─── Main component ───────────────────────────────────────────────────────────

const UserMenu = ({ user, items }: UserMenuProps) => (
  <UserSidebarProvider>
    <RouteChangeClose />

    {/* Desktop: dropdown */}
    <Dropdown
      triggerButtonProps={{
        'aria-label': 'User menu',
        className: clsx(triggerClassName, 'hidden md:flex'),
        children: <AvatarTriggerContent user={user} />,
      }}
      header={<UserMenuHeader user={user} />}
      items={items}
    />

    {/* Mobile: sidebar drawer anchored to the right */}
    <MobileSidebarTrigger user={user} />
    <UserSidebarDrawer label="User menu" side="right">
      <UserSidebarPanel user={user} items={items} />
    </UserSidebarDrawer>
  </UserSidebarProvider>
);

export default UserMenu;
