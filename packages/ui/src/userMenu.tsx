import * as Avatar from '@radix-ui/react-avatar';
import { ChevronDown } from 'lucide-react';
import Dropdown, { DropdownProps } from './dropdown';
import clsx from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserMenuItem = DropdownProps['items'];

type UserMenuProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  items: UserMenuItem;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

// ─── Sub-components ───────────────────────────────────────────────────────────

const UserAvatar = ({
  imageUrl,
  name,
  size = 'sm',
}: {
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'lg';
}) => (
  <Avatar.Root
    className={clsx(
      'inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none',
      size === 'lg' ? 'size-10' : 'size-8',
    )}
  >
    <Avatar.Image
      className="w-full h-full object-cover"
      src={imageUrl}
      alt={name}
    />
    <Avatar.Fallback
      delayMs={0}
      className={clsx(
        'w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-semibold tracking-wide',
        size === 'lg' ? 'text-sm' : 'text-xs',
      )}
    >
      {getInitials(name)}
    </Avatar.Fallback>
  </Avatar.Root>
);

const UserMenuHeader = ({ user }: { user: UserMenuProps['user'] }) => (
  <div className="flex items-center gap-2.5 px-2 pt-2 pb-2.5">
    <UserAvatar imageUrl={user.image || undefined} name={user.name} size="lg" />
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-sm font-semibold text-popover-foreground truncate">
        {user.name}
      </span>
      <span className="text-xs text-muted-foreground truncate">
        {user.email}
      </span>
    </div>
  </div>
);

const UserMenuTrigger = ({ user }: { user: UserMenuProps['user'] }) => (
  <>
    <UserAvatar imageUrl={user.image || undefined} name={user.name} />
    <div className="md:flex hidden">
      <span className="text-sm font-medium leading-none">{user.name}</span>
      <ChevronDown
        size={14}
        strokeWidth={2.5}
        className="text-muted-foreground ml-px transition-transform duration-200 group-data-[state=open]:rotate-180"
      />
    </div>
  </>
);

// ─── Main component ───────────────────────────────────────────────────────────

const UserMenu = ({ user, items }: UserMenuProps) => (
  <Dropdown
    triggerButtonProps={{
      'aria-label': 'User menu',
      className: clsx(
        'group flex items-center gap-1 md:p-1 md:pr-2.5',
        'rounded-full border-2 md:border border-border bg-background text-foreground',
        'cursor-pointer outline-none font-sans',
        'transition-colors duration-120 ease-in-out',
        'hover:bg-muted hover:border-input',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        'data-[state=open]:bg-muted data-[state=open]:border-input',
      ),
      children: <UserMenuTrigger user={user} />,
    }}
    header={<UserMenuHeader user={user} />}
    items={items}
  />
);

export default UserMenu;
