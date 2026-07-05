import { NavItem, NavSidebar, NavSidebarProvider } from '@repo/ui/navSidebar';
import { PropsWithChildren } from 'react';

import ROUTES from '../../common/routes';
import Header from '../../components/header';
import { getUser } from '../../lib/userContext';

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

const AuthenticatedLayout = async ({
  children,
}: Readonly<PropsWithChildren>) => {
  const user = await getUser();
  return (
    <NavSidebarProvider>
      <div className="flex h-screen flex-col bg-background">
        <Header variant="authenticated" user={user} />
        <div className="flex flex-1 min-h-0">
          <NavSidebar items={NAV_ITEMS} />
          <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
        </div>
      </div>
    </NavSidebarProvider>
  );
};

export default AuthenticatedLayout;
