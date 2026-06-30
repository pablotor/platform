'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface SidebarContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

const useSidebar = () => {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used inside <SidebarProvider>');
  return ctx;
};

const SidebarProvider = ({ children }: React.PropsWithChildren) => {
  const [open, setOpen] = React.useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  // close on route change (mobile UX)
  const pathname = usePathname();
  React.useEffect(() => {
    close();
  }, [pathname]);

  return (
    <SidebarContext.Provider value={{ open, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarProvider, useSidebar };
