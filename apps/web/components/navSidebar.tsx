'use client';

import {
  NavItem,
  NavSidebar as BaseNavSidebar,
  NavSidebarProvider,
} from '@repo/ui/navSidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ROUTES from '../common/routes';

const NAV_ITEMS: NavItem[] = [
  {
    type: 'link',
    label: 'Dashboard',
    href: ROUTES.authenticated.dashboard,
  },
  {
    type: 'group',
    label: 'Design',
    children: [
      {
        type: 'link',
        label: 'Fundamentals',
        href: ROUTES.authenticated.design.fundamentals,
      },
      {
        type: 'link',
        label: 'Typography',
        href: ROUTES.authenticated.design.typography,
      },
      {
        type: 'link',
        label: 'Colors',
        href: ROUTES.authenticated.design.colors,
      },
      {
        type: 'link',
        label: 'Composition',
        href: ROUTES.authenticated.design.composition,
      },
    ],
  },
];

const NavSidebar = () => {
  const pathname = usePathname();
  return (
    <BaseNavSidebar items={NAV_ITEMS} currentPath={pathname} linkAs={Link} />
  );
};

export { NavSidebar, NavSidebarProvider };
