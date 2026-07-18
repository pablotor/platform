import { PropsWithChildren } from 'react';

import Header from '../../components/header';
import { NavSidebar, NavSidebarProvider } from '../../components/navSidebar';
import { getUser } from '../../lib/userContext';

const AuthenticatedLayout = async ({
  children,
}: Readonly<PropsWithChildren>) => {
  const user = await getUser();
  return (
    <NavSidebarProvider>
      <div className="flex h-screen flex-col bg-background">
        <Header variant="authenticated" user={user} />
        <div className="flex flex-1 min-h-0">
          <NavSidebar />
          <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
        </div>
      </div>
    </NavSidebarProvider>
  );
};

export default AuthenticatedLayout;
