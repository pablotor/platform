import { NavSidebarProvider } from '@repo/ui/navSidebar';
import { PropsWithChildren } from 'react';

import Header from '../../components/header';
import AuthenticatedNavSidebar from '../../components/sidebars/authenticatedNavSidebar';
import { getUser } from '../../lib/userContext';

const DashboardLayout = async ({ children }: Readonly<PropsWithChildren>) => {
  const user = await getUser();
  return (
    <NavSidebarProvider>
      <div className="flex h-screen flex-col bg-background">
        <Header variant="authenticated" user={user} withNavSidebar />
        <div className="flex flex-1 min-h-0">
          <AuthenticatedNavSidebar />
          <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
        </div>
      </div>
    </NavSidebarProvider>
  );
};

export default DashboardLayout;
