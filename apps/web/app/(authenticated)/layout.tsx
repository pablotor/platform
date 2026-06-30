import { PropsWithChildren } from 'react';
import { SidebarProvider } from '@repo/ui/sidebar/provider';
import Sidebar from '@repo/ui/sidebar/sidebar';
import { NavItem } from '@repo/ui/sidebar/item';
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
    <SidebarProvider>
      <div className="flex h-screen flex-col bg-background">
        <Header variant="authenticated" user={user} />
        <div className="flex flex-1 min-h-0">
          <Sidebar items={NAV_ITEMS} />
          <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;
