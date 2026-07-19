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
    label: 'Quickstart',
    href: ROUTES.public.docs.quickstart,
  },
  {
    type: 'link',
    label: 'Philosophy',
    href: ROUTES.public.docs.philosophy,
  },
  {
    type: 'link',
    label: 'Architecture',
    href: ROUTES.public.docs.architecture,
  },
  {
    type: 'link',
    label: 'CheatSheet',
    href: ROUTES.public.docs.cheatsheet,
  },
  {
    type: 'group',
    label: 'Design',
    children: [
      {
        type: 'link',
        label: 'Fundamentals',
        href: ROUTES.public.docs.design.fundamentals,
      },
      {
        type: 'link',
        label: 'Typography',
        href: ROUTES.public.docs.design.typography,
      },
      {
        type: 'link',
        label: 'Colors',
        href: ROUTES.public.docs.design.colors,
      },
      {
        type: 'link',
        label: 'Composition',
        href: ROUTES.public.docs.design.composition,
      },
    ],
  },
];

const DocsNavSidebar = () => {
  const pathname = usePathname();
  return (
    <BaseNavSidebar items={NAV_ITEMS} currentPath={pathname} linkAs={Link} />
  );
};

export default DocsNavSidebar;
