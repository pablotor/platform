import { PropsWithChildren } from 'react';
import { NavItem, NavSidebar, NavSidebarProvider } from '@repo/ui/navSidebar';
import Header from '../../components/header';
import { getUser } from '../../lib/userContext';

import ROUTES from '../../common/routes';

const NAV_ITEMS: NavItem[] = [
  {
    type: 'link',
    label: 'Dashboard',
    href: ROUTES.authenticated.dashboard,
  },
  {
    type: 'group',
    label: 'Examples',
    children: [
      {
        type: 'link',
        label: 'Design',
        href: ROUTES.authenticated.examples.design,
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
