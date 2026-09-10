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
    type: 'group',
    label: 'Posts',
    children: [
      {
        type: 'link',
        label: 'Listing',
        href: ROUTES.authenticated.dashboard.posts.root,
      },

      {
        type: 'link',
        label: 'Create',
        href: ROUTES.authenticated.dashboard.posts.create,
      },
    ],
  },
];

const AuthenticatedNavSidebar = () => {
  const pathname = usePathname();
  return (
    <BaseNavSidebar items={NAV_ITEMS} currentPath={pathname} linkAs={Link} />
  );
};

export default AuthenticatedNavSidebar;
