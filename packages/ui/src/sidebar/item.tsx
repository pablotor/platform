'use client';

import Link from 'next/link';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export type NavLink = {
  type: 'link';
  label: string;
  href: string;
  icon?: LucideIcon;
};

export type NavGroup = {
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
        ],
      },
    },
    defaultVariants: { state: 'idle' },
  },
);

export const NavLinkItem = ({ item }: { item: NavLink }) => {
  const pathname = usePathname();
  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={navLinkVariants({ state: active ? 'active' : 'idle' })}
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

export const NavGroupItem = ({ item }: { item: NavGroup }) => (
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
