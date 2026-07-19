'use client';

import { NavItem, NavSidebar as BaseNavSidebar } from '@repo/ui/navSidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ROUTES from '../../common/routes';

const NAV_ITEMS: NavItem[] = [
  {
    type: 'link',
    label: 'Dashboard',
    href: ROUTES.authenticated.dashboard.root,
  },
  {
    type: 'link',
    label: 'Posts',
    href: ROUTES.authenticated.dashboard.posts.root,
  },
];

const AuthenticatedNavSidebar = () => {
  const pathname = usePathname();
  return (
    <BaseNavSidebar items={NAV_ITEMS} currentPath={pathname} linkAs={Link} />
  );
};

export default AuthenticatedNavSidebar;
