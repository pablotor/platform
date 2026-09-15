'use client';

import { NavItem, NavSidebar as BaseNavSidebar } from '@repo/ui/navSidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ROUTES from '../../common/routes';

const NAV_ITEMS: NavItem[] = [
  {
    type: 'link',
    label: 'Introduction',
    href: ROUTES.public.docs.root,
  },
  {
    type: 'link',
    label: 'Getting started',
    href: ROUTES.public.docs.gettingStarted,
  },
  {
    type: 'link',
    label: 'Project structure',
    href: ROUTES.public.docs.projectStructure,
  },
];

const DocsNavSidebar = () => {
  const pathname = usePathname();
  return (
    <BaseNavSidebar items={NAV_ITEMS} currentPath={pathname} linkAs={Link} />
  );
};

export default DocsNavSidebar;
