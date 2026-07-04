'use client';

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { createSidebar } from './sidebarFactory';

type NavLink = {
  type: 'link';
  label: string;
  href: string;
  icon?: LucideIcon;
};

type NavGroup = {
  type: 'group';
  label: string;
  children: NavLink[];
};

export type NavItem = NavLink | NavGroup;

const navLinkVariants = cva(
  'text-ui group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
  {
    variants: {
      state: {
        active: 'bg-sidebar-primary text-sidebar-primary-foreground',
        idle: [
          'text-sidebar-foreground',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          'focus-visible:focusable-outline',
        ],
      },
    },
    defaultVariants: { state: 'idle' },
  },
);

const NavLinkItem = ({ item }: { item: NavLink }) => {
  const pathname = usePathname();
  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={navLinkVariants({ state: active ? 'active' : 'idle' })}
      tabIndex={active ? -1 : 0}
    >
      {item.icon && (
        <item.icon
          aria-hidden="true"
          className={clsx(
            'size-4 shrink-0 transition-opacity',
            active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100',
          )}
        />
      )}
      {item.label}
    </Link>
  );
};

const NavGroupItem = ({ item }: { item: NavGroup }) => (
  <div className="flex flex-col">
    <span className="text-label px-3 pb-1 pt-4 text-muted-foreground first:pt-2">
      {item.label}
    </span>
    <div className="flex flex-col gap-0.5 border-l border-sidebar-border ml-3 pl-2">
      {item.children.map((child) => (
        <NavLinkItem key={child.href} item={child} />
      ))}
    </div>
  </div>
);

const NavSidebarPanel = ({ items }: { items: NavItem[] }) => (
  <div className="flex h-full w-60 flex-col border-r border-sidebar-border bg-sidebar px-3 py-4">
    <nav className="flex flex-col gap-0.5">
      {items.map((item) =>
        item.type === 'group' ? (
          <NavGroupItem key={item.label} item={item} />
        ) : (
          <NavLinkItem key={item.href} item={item} />
        ),
      )}
    </nav>
  </div>
);

const {
  Provider: NavSidebarProvider,
  Drawer: NavSidebarDrawer,
  useSidebar: useNavSidebar,
  toggleButtonId: navSidebarButtonId,
} = createSidebar('nav');

interface NavSidebarProps {
  items: NavItem[];
}

const NavSidebar = ({ items }: NavSidebarProps) => {
  const { close } = useNavSidebar();
  const path = usePathname();

  useEffect(() => {
    close();
  }, [path, close]);

  return (
    <>
      {/* Desktop: always visible in the document flow */}
      <aside className="hidden w-60 shrink-0 md:flex">
        <NavSidebarPanel items={items} />
      </aside>

      {/* Mobile: animated drawer */}
      <NavSidebarDrawer label="Navigation">
        <NavSidebarPanel items={items} />
      </NavSidebarDrawer>
    </>
  );
};

const NavSidebarButton = ({ className }: { className?: string }) => {
  const { open, toggle } = useNavSidebar();

  return (
    <button
      id={navSidebarButtonId}
      type="button"
      aria-label={open ? 'Close navigation' : 'Open navigation'}
      aria-expanded={open}
      onClick={toggle}
      className={clsx(
        'flex size-9 flex-col items-center justify-center gap-1.25 rounded-md md:hidden',
        'text-muted-foreground transition-colors cursor-pointer',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <span
        className={clsx(
          'block h-0.5 w-5 rounded-full bg-current transition-transform duration-300',
          open && 'translate-y-1.75 rotate-45',
        )}
      />
      <span
        className={clsx(
          'block h-0.5 w-5 rounded-full bg-current transition-opacity duration-300',
          open && 'opacity-0',
        )}
      />
      <span
        className={clsx(
          'block h-0.5 w-5 rounded-full bg-current transition-transform duration-300',
          open && '-translate-y-1.75 -rotate-45',
        )}
      />
    </button>
  );
};

export { NavSidebar, NavSidebarButton, NavSidebarProvider };
