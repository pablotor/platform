import { NavSidebarProvider } from '@repo/ui/navSidebar';
import { PropsWithChildren } from 'react';

import ROUTES from '../../common/routes';
import Header from '../../components/header';
import DocsNavSidebar from '../../components/sidebars/docsNavSidebar';
import { getUser } from '../../lib/userContext';

const DocsLayout = async ({ children }: Readonly<PropsWithChildren>) => {
  const user = await getUser();
  return (
    <NavSidebarProvider>
      <div className="flex h-screen flex-col bg-background">
        <Header
          variant={user ? 'authenticated' : 'public'}
          logoText="Docs"
          logoHref={ROUTES.public.docs.root}
          user={user}
          withNavSidebar
        />
        <div className="flex flex-1 min-h-0">
          <DocsNavSidebar />
          <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
        </div>
      </div>
    </NavSidebarProvider>
  );
};

export default DocsLayout;
