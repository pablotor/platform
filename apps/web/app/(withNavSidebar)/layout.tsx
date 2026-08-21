import { NavSidebarProvider } from '@repo/ui/navSidebar';
import { PropsWithChildren } from 'react';

import Header from '../../components/header';
import { getUser } from '../../lib/userContext';

const WithSidebarLayout = async ({ children }: Readonly<PropsWithChildren>) => {
  const user = await getUser();
  return (
    <NavSidebarProvider>
      <div className="flex h-screen flex-col bg-background">
        <Header
          variant={user ? 'authenticated' : 'public'}
          user={user}
          withNavSidebar
        />
        <div className="flex flex-1 min-h-0">{children}</div>
      </div>
    </NavSidebarProvider>
  );
};

export default WithSidebarLayout;
