import { NavSidebarProvider } from '@repo/ui/navSidebar';
import { PropsWithChildren } from 'react';

const WithSidebarLayout = async ({ children }: Readonly<PropsWithChildren>) => (
  <NavSidebarProvider>
    <div className="flex h-screen flex-col bg-background">{children}</div>
  </NavSidebarProvider>
);

export default WithSidebarLayout;
